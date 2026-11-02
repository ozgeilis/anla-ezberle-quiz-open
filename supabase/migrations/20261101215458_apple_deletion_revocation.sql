-- Candidate only. No provider, capability, cron, live signup or user is enabled here.
BEGIN;
SET LOCAL lock_timeout='5s';
CREATE TABLE quiz_private.apple_auth_config(
 singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),
 oauth_enabled boolean NOT NULL DEFAULT false,deletion_enabled boolean NOT NULL DEFAULT false,
 revocation_enabled boolean NOT NULL DEFAULT false,signup_enabled boolean NOT NULL DEFAULT false
);
INSERT INTO quiz_private.apple_auth_config(singleton) VALUES(true);
CREATE TABLE quiz_private.apple_signup_test_allowlist(
 email text PRIMARY KEY CHECK(email=lower(trim(email)) AND length(email) BETWEEN 3 AND 254),
 created_at timestamptz NOT NULL DEFAULT now(),expires_at timestamptz NOT NULL,
 CHECK(expires_at>created_at AND expires_at<=created_at+interval '7 days')
);
CREATE TABLE quiz_private.apple_deletion_jobs(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 apple_subject text NOT NULL,nonce_hash text NOT NULL CHECK(nonce_hash~'^[a-f0-9]{64}$'),
 stage text NOT NULL DEFAULT 'proof' CHECK(stage IN('proof','token','revoked')),
 ciphertext text CHECK(length(ciphertext)<=8192),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 expires_at timestamptz NOT NULL DEFAULT clock_timestamp()+interval '15 minutes',
 lease uuid,lease_until timestamptz,attempts integer NOT NULL DEFAULT 0,
 CHECK((stage='token')=(ciphertext IS NOT NULL))
);
CREATE INDEX apple_deletion_actor_created ON quiz_private.apple_deletion_jobs(actor,created_at);
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['apple_auth_config','apple_signup_test_allowlist','apple_deletion_jobs'] LOOP
  EXECUTE format('ALTER TABLE quiz_private.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('ALTER TABLE quiz_private.%I FORCE ROW LEVEL SECURITY',t);
  EXECUTE format('REVOKE ALL ON quiz_private.%I FROM public,anon,authenticated',t);
 END LOOP;
END $$;
GRANT SELECT ON quiz_private.apple_auth_config,quiz_private.apple_signup_test_allowlist TO supabase_auth_admin;
CREATE POLICY apple_config_auth_read ON quiz_private.apple_auth_config FOR SELECT TO supabase_auth_admin USING(true);
CREATE POLICY apple_signup_auth_read ON quiz_private.apple_signup_test_allowlist FOR SELECT TO supabase_auth_admin USING(true);
CREATE FUNCTION public.apple_auth_capabilities() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('appleOAuthEnabled',oauth_enabled,'appleDeletionEnabled',deletion_enabled,'appleRevocationEnabled',revocation_enabled)
 FROM quiz_private.apple_auth_config WHERE singleton
$$;
REVOKE ALL ON FUNCTION public.apple_auth_capabilities() FROM public;
GRANT EXECUTE ON FUNCTION public.apple_auth_capabilities() TO anon,authenticated;
CREATE FUNCTION public.apple_deletion_session(actor uuid,session uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM auth.sessions WHERE id=session AND user_id=actor AND (not_after IS NULL OR not_after>clock_timestamp()))
 AND EXISTS(SELECT 1 FROM auth.identities WHERE user_id=actor AND provider='apple' AND length(identity_data->>'sub')>0)
 AND EXISTS(SELECT 1 FROM auth.users WHERE id=actor AND email_confirmed_at IS NOT NULL AND NOT is_anonymous)
$$;
CREATE FUNCTION public.purge_apple_deletion_jobs() RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE n integer;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 DELETE FROM quiz_private.apple_deletion_jobs WHERE expires_at<=clock_timestamp();
 GET DIAGNOSTICS n=ROW_COUNT; RETURN n;
END $$;
CREATE FUNCTION public.begin_apple_deletion(actor uuid,nonce_hash text) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE subject text; result uuid;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('apple-delete:'||actor::text,0));
 IF NOT EXISTS(SELECT 1 FROM quiz_private.apple_auth_config WHERE singleton AND oauth_enabled AND deletion_enabled AND revocation_enabled)
 OR NOT quiz_private.erasure_allowed(actor) THEN RAISE EXCEPTION 'NOT_ENABLED'; END IF;
 IF nonce_hash IS NULL OR nonce_hash!~'^[a-f0-9]{64}$' THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
 SELECT identity_data->>'sub' INTO subject FROM auth.identities WHERE user_id=actor AND provider='apple';
 IF subject IS NULL OR subject='' THEN RAISE EXCEPTION 'APPLE_IDENTITY_REQUIRED'; END IF;
 PERFORM public.purge_apple_deletion_jobs();
 IF (SELECT count(*) FROM quiz_private.apple_deletion_jobs j WHERE j.actor=begin_apple_deletion.actor AND created_at>clock_timestamp()-interval '10 minutes')>=3
 THEN RAISE EXCEPTION 'RATE_LIMITED'; END IF;
 -- Never overwrite a verified retry job with a new proof or consume a different actor's job.
 INSERT INTO quiz_private.apple_deletion_jobs(actor,apple_subject,nonce_hash) VALUES(actor,subject,nonce_hash) RETURNING id INTO result;
 RETURN result;
END $$;
CREATE FUNCTION public.claim_apple_deletion(actor uuid,challenge uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE j quiz_private.apple_deletion_jobs;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('apple-delete:'||actor::text,0));
 IF EXISTS(SELECT 1 FROM quiz_private.apple_deletion_jobs other_job WHERE other_job.actor=claim_apple_deletion.actor AND other_job.id<>challenge AND other_job.lease_until>clock_timestamp()) THEN RETURN NULL; END IF;
 IF NOT EXISTS(SELECT 1 FROM quiz_private.apple_auth_config WHERE singleton AND oauth_enabled AND deletion_enabled AND revocation_enabled)
 OR NOT quiz_private.erasure_allowed(actor) THEN RETURN NULL; END IF;
 UPDATE quiz_private.apple_deletion_jobs SET lease=gen_random_uuid(),lease_until=clock_timestamp()+interval '60 seconds',attempts=attempts+1
 WHERE id=challenge AND apple_deletion_jobs.actor=claim_apple_deletion.actor AND expires_at>clock_timestamp()
 AND (stage<>'proof' OR created_at>clock_timestamp()-interval '5 minutes') AND attempts<10
 AND (lease_until IS NULL OR lease_until<=clock_timestamp()) RETURNING * INTO j;
 IF NOT FOUND THEN RETURN NULL; END IF;
 RETURN jsonb_build_object('stage',j.stage,'appleSubject',j.apple_subject,'nonceHash',j.nonce_hash,'ciphertext',j.ciphertext,'lease',j.lease);
END $$;
CREATE FUNCTION public.save_apple_deletion(actor uuid,challenge uuid,lease_id uuid,next_stage text,encrypted_token text DEFAULT NULL) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 UPDATE quiz_private.apple_deletion_jobs SET stage=next_stage,ciphertext=encrypted_token
 WHERE id=challenge AND apple_deletion_jobs.actor=save_apple_deletion.actor AND lease=lease_id AND lease_until>clock_timestamp() AND expires_at>clock_timestamp()
 AND ((stage='proof' AND next_stage='token' AND encrypted_token IS NOT NULL AND length(encrypted_token) BETWEEN 32 AND 8192)
 OR (stage='token' AND next_stage='revoked' AND encrypted_token IS NULL));
 RETURN FOUND;
END $$;
CREATE FUNCTION public.release_apple_deletion(actor uuid,challenge uuid,lease_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 UPDATE quiz_private.apple_deletion_jobs SET lease=NULL,lease_until=NULL WHERE id=challenge AND apple_deletion_jobs.actor=release_apple_deletion.actor AND lease=lease_id;
END $$;
REVOKE ALL ON FUNCTION public.apple_deletion_session(uuid,uuid),public.begin_apple_deletion(uuid,text),public.claim_apple_deletion(uuid,uuid),public.save_apple_deletion(uuid,uuid,uuid,text,text),public.release_apple_deletion(uuid,uuid,uuid),public.purge_apple_deletion_jobs() FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.apple_deletion_session(uuid,uuid),public.begin_apple_deletion(uuid,text),public.claim_apple_deletion(uuid,uuid),public.save_apple_deletion(uuid,uuid,uuid,text,text),public.release_apple_deletion(uuid,uuid,uuid),public.purge_apple_deletion_jobs() TO service_role;
-- Extend the one existing hook, retaining the complete current Google/email branch.
DO $$ DECLARE definition text;
BEGIN
 SELECT pg_get_functiondef('public.before_google_user_created(jsonb)'::regprocedure) INTO definition;
 IF (SELECT md5(prosrc) FROM pg_proc WHERE oid='public.before_google_user_created(jsonb)'::regprocedure)<>'a32147ffb2e85ef10e60ae8cf1af9bea' THEN RAISE EXCEPTION 'Auth hook hash drift: review before applying'; END IF;
 IF position('google_signup_test_allowlist' IN definition)=0 OR position('IF event->' IN definition)=0 THEN RAISE EXCEPTION 'Auth hook drift: review before applying'; END IF;
 definition=replace(definition,'BEGIN', $insert$BEGIN
 IF event->'user'->'app_metadata'->>'provider'='apple' THEN
  IF EXISTS(SELECT 1 FROM quiz_private.apple_auth_config WHERE oauth_enabled AND deletion_enabled AND revocation_enabled
   AND (signup_enabled OR EXISTS(SELECT 1 FROM quiz_private.apple_signup_test_allowlist t WHERE t.email=lower(trim(event->'user'->>'email')) AND t.expires_at>clock_timestamp())))
   AND coalesce((public.online_service_capabilities()->>'registrationEnabled')::boolean,false)
  THEN RETURN '{}'::jsonb; END IF;
  RETURN jsonb_build_object('error',jsonb_build_object('http_code',403,'message','Apple ile yeni hesap kaydı kapalı test izni gerektiriyor.'));
 END IF;
$insert$);
 EXECUTE definition;
END $$;
COMMIT;
