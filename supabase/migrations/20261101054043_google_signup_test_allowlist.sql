BEGIN;
SET LOCAL lock_timeout='5s';
DO $$ BEGIN
 IF (SELECT md5(prosrc) FROM pg_proc WHERE oid='public.before_google_user_created(jsonb)'::regprocedure)<>'a160aecbf5e919510163b95bfd7ef3be'
 THEN RAISE EXCEPTION 'Auth hook drift: review closed signup policy before applying'; END IF;
END $$;
-- Empty, expiring, server-managed allowlist. No tester addresses are committed.
-- Does not enable global Google signup, remove the hook or alter Cloud audience.
CREATE TABLE quiz_private.google_signup_test_allowlist (
 email text PRIMARY KEY CHECK(email=lower(trim(email)) AND length(email) BETWEEN 3 AND 254),
 expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK(expires_at>created_at AND expires_at<=created_at+interval '30 days')
);
ALTER TABLE quiz_private.google_signup_test_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_private.google_signup_test_allowlist FORCE ROW LEVEL SECURITY;
REVOKE ALL ON quiz_private.google_signup_test_allowlist FROM public,anon,authenticated;
GRANT SELECT ON quiz_private.google_signup_test_allowlist TO supabase_auth_admin;
CREATE POLICY google_signup_auth_read ON quiz_private.google_signup_test_allowlist FOR SELECT TO supabase_auth_admin USING(true);
CREATE OR REPLACE FUNCTION public.before_google_user_created(event jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
 -- app_metadata.provider and top-level email are supplied by Supabase's trusted
 -- OAuth pipeline, never taken from mutable user_metadata or a client RPC body.
 IF event->'user'->'app_metadata'->>'provider' IS DISTINCT FROM 'google' THEN RETURN '{}'::jsonb; END IF;
 IF EXISTS(SELECT 1 FROM quiz_private.google_auth_config WHERE oauth_enabled AND deletion_enabled
   AND (signup_enabled OR EXISTS(SELECT 1 FROM quiz_private.google_signup_test_allowlist t
     WHERE t.email=lower(trim(event->'user'->>'email')) AND t.expires_at>clock_timestamp())))
   AND coalesce((public.online_service_capabilities()->>'registrationEnabled')::boolean,false)
 THEN RETURN '{}'::jsonb; END IF;
 RETURN jsonb_build_object('error',jsonb_build_object('http_code',403,'message','Google ile yeni hesap kaydı kapalı test izni gerektiriyor.'));
END $$;
REVOKE ALL ON FUNCTION public.before_google_user_created(jsonb) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.before_google_user_created(jsonb) TO supabase_auth_admin;
COMMIT;
