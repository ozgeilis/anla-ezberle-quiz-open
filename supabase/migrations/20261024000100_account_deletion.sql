-- REVIEW CANDIDATE: apply only this migration after explicit owner approval.
-- Reuses the PR #2 cleanup rules, driven by Auth Admin hard deletion instead of direct Auth SQL.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='60s';
-- Shared score/room history belongs to remaining players too. Remove the erased
-- participant, retain the other players' immutable results and public manifests.
ALTER TABLE quiz_private.matches ALTER COLUMN creator_id DROP NOT NULL;
ALTER TABLE quiz_private.match_players ALTER COLUMN player_id DROP NOT NULL;
ALTER TABLE quiz_private.match_players ALTER COLUMN session_id DROP NOT NULL;
ALTER TABLE quiz_private.live_rooms ALTER COLUMN host_id DROP NOT NULL;
CREATE TABLE quiz_private.account_deletion_config(singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),enabled boolean NOT NULL DEFAULT false,test_actors uuid[] NOT NULL DEFAULT '{}');
INSERT INTO quiz_private.account_deletion_config VALUES(true,false,'{}');
ALTER TABLE quiz_private.account_deletion_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_private.account_deletion_config FORCE ROW LEVEL SECURITY;
REVOKE ALL ON quiz_private.account_deletion_config FROM public,anon,authenticated;
-- This setting exists only inside the service-only atomic erasure transaction.
-- Direct client table/function access remains denied; all normal immutability stays.
CREATE OR REPLACE FUNCTION quiz_private.immutable_content() RETURNS trigger
LANGUAGE plpgsql SET search_path='' AS $$
DECLARE actor uuid := nullif(current_setting('anla.erasing_actor',true),'')::uuid;
BEGIN
 IF current_user='postgres' AND actor IS NOT NULL AND TG_TABLE_SCHEMA='quiz_private' THEN
  IF TG_OP='DELETE' AND TG_TABLE_NAME IN('score_ledger','live_answers','live_rewards') AND (to_jsonb(OLD)->>'player_id')::uuid=actor THEN RETURN OLD; END IF;
  IF TG_OP='DELETE' AND TG_TABLE_NAME='quiz_attempts' AND EXISTS(SELECT 1 FROM quiz_private.quiz_sessions WHERE id=(to_jsonb(OLD)->>'session_id')::uuid AND player_id=actor) THEN RETURN OLD; END IF;
  IF TG_OP='UPDATE' AND TG_TABLE_NAME='live_rewards' AND to_jsonb(NEW)-'friend_ids'=to_jsonb(OLD)-'friend_ids' AND NEW.friend_ids=array_remove(OLD.friend_ids,actor) THEN RETURN NEW; END IF;
 END IF;
 RAISE EXCEPTION 'Content versions are immutable; insert a new version';
END $$;
CREATE OR REPLACE FUNCTION quiz_private.guard_match() returns trigger
language plpgsql set search_path = '' as $$
begin
 if current_user='postgres' and nullif(current_setting('anla.erasing_actor',true),'') is not null
 and to_jsonb(new)-ARRAY['creator_id','state','revision']=to_jsonb(old)-ARRAY['creator_id','state','revision']
 and (new.creator_id IS NOT DISTINCT FROM old.creator_id OR (old.creator_id=nullif(current_setting('anla.erasing_actor',true),'')::uuid AND new.creator_id IS NULL))
 and ((new.state=old.state AND new.revision=old.revision) OR (old.state NOT IN('completed','expired','cancelled') AND new.state='cancelled' AND new.revision=old.revision+1)) then return new; end if;
  if new.question_set is distinct from old.question_set or new.manifest_hash is distinct from old.manifest_hash
     or new.rule_version <> old.rule_version or new.creator_id <> old.creator_id
     or new.created_at <> old.created_at or new.expires_at <> old.expires_at
     or new.create_request_id <> old.create_request_id then
    raise exception 'Match manifest and deadlines are immutable';
  end if;
  if old.state in ('completed','expired','cancelled') then raise exception 'Terminal match is immutable'; end if;
  if new.state <> old.state and not (
    (old.state = 'created' and new.state in ('waiting_for_opponent','in_progress','cancelled','expired')) or
    (old.state = 'waiting_for_opponent' and new.state in ('in_progress','cancelled','expired')) or
    (old.state = 'in_progress' and new.state in ('waiting_for_result','completed','cancelled','expired')) or
    (old.state = 'waiting_for_result' and new.state in ('in_progress','completed','cancelled','expired'))
  ) then raise exception 'Invalid match transition'; end if;
  return new;
end $$;
CREATE OR REPLACE FUNCTION quiz_private.live_guard_room() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 if current_user='postgres' and nullif(current_setting('anla.erasing_actor',true),'') is not null
 and to_jsonb(new)-ARRAY['host_id','state','phase','revision']=to_jsonb(old)-ARRAY['host_id','state','phase','revision']
 and (new.host_id IS NOT DISTINCT FROM old.host_id OR (old.host_id=nullif(current_setting('anla.erasing_actor',true),'')::uuid AND new.host_id IS NULL))
 and ((new.state=old.state AND new.phase=old.phase AND new.revision=old.revision) OR (old.state NOT IN('completed','expired','cancelled') AND new.state='cancelled' AND new.phase='cancelled' AND new.revision=old.revision+1)) then return new; end if;
 IF old.state IN('completed','cancelled','expired') THEN RAISE EXCEPTION 'Terminal room is immutable'; END IF;
 IF new.id<>old.id OR new.code<>old.code OR new.host_id<>old.host_id OR new.request_id<>old.request_id OR new.dataset<>old.dataset OR new.created_at<>old.created_at THEN RAISE EXCEPTION 'Room identity is immutable';END IF;
 IF old.start_at IS NOT NULL AND (new.start_at IS DISTINCT FROM old.start_at OR new.manifest IS DISTINCT FROM old.manifest OR new.set_hash IS DISTINCT FROM old.set_hash OR new.topic<>old.topic OR new.level<>old.level OR new.question_count<>old.question_count OR new.expires_at<>old.expires_at) THEN RAISE EXCEPTION 'Started manifest and deadlines are immutable';END IF;
 IF new.state<>old.state AND NOT((old.state='lobby' AND new.state IN('countdown','cancelled','expired')) OR (old.state='countdown' AND new.state IN('playing','completed','cancelled')) OR (old.state='playing' AND new.state IN('completed','cancelled'))) THEN RAISE EXCEPTION 'Invalid room transition';END IF;
 RETURN new;
END $$;

CREATE OR REPLACE FUNCTION public.online_service_capabilities() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('registrationEnabled',public_enrollment_enabled,'accountDeletionEnabled',(SELECT enabled OR coalesce(auth.uid()=ANY(test_actors),false) FROM quiz_private.account_deletion_config WHERE singleton)) FROM quiz_private.player_service_config WHERE singleton
$$;
-- Account erasure uses the supported Auth Admin hard-delete endpoint. A short-
-- lived server-only intent lets that Auth transaction atomically run app cleanup.
CREATE TABLE quiz_private.account_deletion_intents(
 actor uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL
);
ALTER TABLE quiz_private.account_deletion_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_private.account_deletion_intents FORCE ROW LEVEL SECURITY;
REVOKE ALL ON quiz_private.account_deletion_intents FROM public,anon,authenticated;

CREATE FUNCTION quiz_private.erasure_allowed(actor uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=actor AND u.email_confirmed_at IS NOT NULL AND NOT u.is_anonymous)
 AND EXISTS(SELECT 1 FROM quiz_private.account_deletion_config c WHERE singleton AND (enabled OR actor=ANY(test_actors)))
 -- This email/password flow must not bypass an enrolled second factor or enterprise identity lifecycle.
 AND NOT EXISTS(SELECT 1 FROM auth.mfa_factors WHERE user_id=actor AND status='verified')
 AND NOT EXISTS(SELECT 1 FROM auth.scim_users WHERE user_id=actor)
$$;
REVOKE ALL ON FUNCTION quiz_private.erasure_allowed(uuid) FROM public,anon,authenticated;

CREATE FUNCTION public.account_deletion_storage(actor uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE files jsonb;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 IF NOT quiz_private.erasure_allowed(actor) THEN RAISE EXCEPTION 'Deletion not authorized'; END IF;
 IF EXISTS(SELECT 1 FROM storage.s3_multipart_uploads WHERE owner_id=actor::text) THEN RAISE EXCEPTION 'Active upload requires completion before erasure'; END IF;
 -- A bucket may hold other users' files. Never automatically delete an owned bucket.
 IF EXISTS(SELECT 1 FROM storage.buckets b WHERE (to_jsonb(b)->>'owner_id'=actor::text OR to_jsonb(b)->>'owner'=actor::text)) THEN RAISE EXCEPTION 'Storage bucket ownership requires review'; END IF;
 SELECT coalesce(jsonb_agg(jsonb_build_object('bucket',bucket_id,'name',name)),'[]') INTO files FROM
 (SELECT bucket_id,name FROM storage.objects o WHERE (to_jsonb(o)->>'owner_id'=actor::text OR to_jsonb(o)->>'owner'=actor::text) ORDER BY bucket_id,name LIMIT 100) objects;
 RETURN jsonb_build_object('files',files);
END $$;
CREATE FUNCTION public.prepare_account_deletion(actor uuid) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 IF NOT quiz_private.erasure_allowed(actor) THEN RAISE EXCEPTION 'Deletion not authorized'; END IF;
 IF EXISTS(SELECT 1 FROM storage.s3_multipart_uploads WHERE owner_id=actor::text) THEN RAISE EXCEPTION 'Active upload requires completion before erasure'; END IF;
 PERFORM 1 FROM auth.users WHERE id=actor FOR UPDATE;
 IF EXISTS(SELECT 1 FROM storage.objects o WHERE (to_jsonb(o)->>'owner_id'=actor::text OR to_jsonb(o)->>'owner'=actor::text)) THEN RAISE EXCEPTION 'Storage cleanup incomplete'; END IF;
 INSERT INTO quiz_private.account_deletion_intents VALUES(actor,now()+interval '2 minutes')
 ON CONFLICT ON CONSTRAINT account_deletion_intents_pkey DO UPDATE SET expires_at=excluded.expires_at;
 RETURN jsonb_build_object('ready',true);
END $$;
CREATE FUNCTION quiz_private.erase_authorized_player() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE actor uuid:=OLD.id; refs uuid[];
BEGIN
 -- Normal administrative Auth operations are not granted an application erasure bypass.
 IF NOT EXISTS(SELECT 1 FROM quiz_private.account_deletion_intents i WHERE i.actor=OLD.id AND i.expires_at>now()) THEN RETURN OLD; END IF;
 IF NOT quiz_private.erasure_allowed(actor) THEN RAISE EXCEPTION 'Deletion rollout not enabled'; END IF;
 IF EXISTS(SELECT 1 FROM storage.buckets b WHERE (to_jsonb(b)->>'owner_id'=actor::text OR to_jsonb(b)->>'owner'=actor::text)) OR EXISTS(SELECT 1 FROM storage.s3_multipart_uploads WHERE owner_id=actor::text) THEN RAISE EXCEPTION 'Storage ownership requires review'; END IF;
 IF EXISTS(SELECT 1 FROM storage.objects o WHERE (to_jsonb(o)->>'owner_id'=actor::text OR to_jsonb(o)->>'owner'=actor::text)) THEN RAISE EXCEPTION 'Storage cleanup incomplete'; END IF;
 PERFORM 1 FROM quiz_private.player_profiles WHERE id=actor FOR UPDATE;
 PERFORM set_config('anla.erasing_actor',actor::text,true);
 SELECT array_agg(id) INTO refs FROM (
  SELECT id FROM quiz_private.friendships WHERE actor IN(sender,recipient)
  UNION SELECT id FROM quiz_private.direct_challenges WHERE actor IN(sender,recipient)
  UNION SELECT match_id FROM quiz_private.match_players WHERE player_id=actor
  UNION SELECT room_id FROM quiz_private.live_members WHERE player_id=actor
 ) x;
 DELETE FROM public.player_notifications WHERE recipient_id=actor OR reference_id=ANY(coalesce(refs,'{}'));
 DELETE FROM quiz_private.friendships WHERE actor IN(sender,recipient);
 DELETE FROM quiz_private.direct_challenges WHERE actor IN(sender,recipient);
 -- Cancel unfinished shared games; completed opponents' scores stay unchanged.
 UPDATE quiz_private.matches SET state='cancelled',revision=revision+1 WHERE state NOT IN('completed','expired','cancelled') AND (creator_id=actor OR id IN(SELECT match_id FROM quiz_private.match_players WHERE player_id=actor));
 UPDATE quiz_private.matches SET creator_id=NULL WHERE creator_id=actor;
 DELETE FROM quiz_private.quiz_attempts WHERE session_id IN(SELECT id FROM quiz_private.quiz_sessions WHERE player_id=actor);
 UPDATE quiz_private.match_players SET player_id=NULL,session_id=NULL WHERE player_id=actor;
 DELETE FROM quiz_private.quiz_sessions WHERE player_id=actor;
 DELETE FROM quiz_private.score_ledger WHERE player_id=actor;
 UPDATE quiz_private.live_rooms SET state='cancelled',phase='cancelled',revision=revision+1 WHERE state NOT IN('completed','expired','cancelled') AND (host_id=actor OR id IN(SELECT room_id FROM quiz_private.live_members WHERE player_id=actor));
 UPDATE quiz_private.live_rooms SET host_id=NULL WHERE host_id=actor;
 UPDATE quiz_private.live_rewards SET friend_ids=array_remove(friend_ids,actor) WHERE actor=ANY(friend_ids);
 DELETE FROM quiz_private.live_answers WHERE player_id=actor;
 DELETE FROM quiz_private.live_rewards WHERE player_id=actor;
 DELETE FROM quiz_private.live_members WHERE player_id=actor;
 DELETE FROM quiz_private.live_limits WHERE player_id=actor;

 UPDATE quiz_private.account_deletion_config SET test_actors=array_remove(test_actors,actor) WHERE singleton;
 DELETE FROM auth.flow_state WHERE user_id=actor;
 PERFORM set_config('anla.erasing_actor','',true);
 RETURN OLD;
END $$;
CREATE TRIGGER anla_account_erasure BEFORE DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION quiz_private.erase_authorized_player();

CREATE FUNCTION public.verify_account_deletion(actor uuid, prior_email text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 IF actor IS NULL OR EXISTS(SELECT 1 FROM auth.users WHERE id=actor) THEN RETURN jsonb_build_object('deleted',false); END IF;
 -- Legacy refresh rows without a session FK must not survive hard deletion.
 DELETE FROM auth.refresh_tokens WHERE user_id=actor::text;
 IF EXISTS(SELECT 1 FROM quiz_private.player_profiles WHERE id=actor)
 OR EXISTS(SELECT 1 FROM auth.sessions WHERE user_id=actor)
 OR EXISTS(SELECT 1 FROM auth.refresh_tokens WHERE user_id=actor::text)
 OR EXISTS(SELECT 1 FROM quiz_private.score_ledger WHERE player_id=actor)
 OR EXISTS(SELECT 1 FROM quiz_private.live_rewards WHERE player_id=actor)
 OR EXISTS(SELECT 1 FROM quiz_private.live_members WHERE player_id=actor)
 OR EXISTS(SELECT 1 FROM quiz_private.quiz_sessions WHERE player_id=actor)
 OR EXISTS(SELECT 1 FROM public.player_notifications WHERE recipient_id=actor)
 OR EXISTS(SELECT 1 FROM storage.objects o WHERE (to_jsonb(o)->>'owner_id'=actor::text OR to_jsonb(o)->>'owner'=actor::text))
 THEN RETURN jsonb_build_object('deleted',false); END IF;
 -- Keep only non-identifying event type/time in the application's Auth audit rows.
 -- No password, session, JWT, email, user id, IP or payload details are retained here.
 UPDATE auth.audit_log_entries SET payload=jsonb_build_object('action',CASE WHEN payload->>'action' ~ '^[a-z_]+$' THEN payload->>'action' ELSE 'account_event' END,'account_deleted',true),ip_address=''
 WHERE jsonb_path_exists(payload::jsonb,'$.** ? (@ == $actor || @ == $email)',jsonb_build_object('actor',actor::text,'email',prior_email));
 RETURN jsonb_build_object('deleted',true);
END $$;
REVOKE ALL ON FUNCTION public.account_deletion_storage(uuid),public.prepare_account_deletion(uuid),public.verify_account_deletion(uuid,text) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.account_deletion_storage(uuid),public.prepare_account_deletion(uuid),public.verify_account_deletion(uuid,text) TO service_role;
REVOKE ALL ON FUNCTION quiz_private.erase_authorized_player(),quiz_private.immutable_content(),quiz_private.guard_match(),quiz_private.live_guard_room() FROM public,anon,authenticated;
-- Preserve the installed version's content-scope/review behavior. Redact only
-- the erased slot; do not copy an unrelated local/staged content protocol.
DO $redact$
DECLARE definition text;
BEGIN
 SELECT pg_get_functiondef('quiz_private.match_view(uuid,uuid)'::regprocedure) INTO definition;
 IF position('quiz_private.player_profiles pr on pr.id=p.player_id' in definition)=0 OR position('quiz_private.quiz_sessions ps on ps.id=p.session_id' in definition)=0 THEN RAISE EXCEPTION 'Unsupported match view; review before account erasure rollout'; END IF;
 definition=replace(definition,'''name'',pr.display_name','''name'',coalesce(pr.display_name,''Silinmiş Oyuncu'')');
 IF position('left join quiz_private.player_profiles pr on pr.id=p.player_id' in definition)=0 THEN
  definition=replace(definition,'join quiz_private.player_profiles pr on pr.id=p.player_id','left join quiz_private.player_profiles pr on pr.id=p.player_id');
 END IF;
 IF position('left join quiz_private.quiz_sessions ps on ps.id=p.session_id' in definition)=0 THEN
  definition=replace(definition,'join quiz_private.quiz_sessions ps on ps.id=p.session_id','left join quiz_private.quiz_sessions ps on ps.id=p.session_id');
 END IF;
 EXECUTE definition;
END $redact$;
COMMIT;
