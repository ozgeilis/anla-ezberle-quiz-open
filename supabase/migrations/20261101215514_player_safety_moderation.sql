BEGIN;
SET LOCAL lock_timeout='5s';
CREATE TABLE quiz_private.player_safety_config(singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),enabled boolean NOT NULL DEFAULT false);
INSERT INTO quiz_private.player_safety_config(singleton) VALUES(true);
CREATE TABLE quiz_private.player_blocks(
 actor uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,target uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),PRIMARY KEY(actor,target),CHECK(actor<>target)
);
CREATE INDEX player_blocks_target ON quiz_private.player_blocks(target,actor);
CREATE TABLE quiz_private.safety_limits(actor uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 day date NOT NULL DEFAULT current_date,reports integer NOT NULL DEFAULT 0,window_at timestamptz NOT NULL DEFAULT clock_timestamp(),calls integer NOT NULL DEFAULT 0);
CREATE TABLE quiz_private.moderators(actor uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,active boolean NOT NULL DEFAULT true);
CREATE TABLE quiz_private.social_restrictions(actor uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 reason text NOT NULL CHECK(length(reason) BETWEEN 3 AND 500),created_at timestamptz NOT NULL DEFAULT clock_timestamp());
CREATE TABLE quiz_private.player_reports(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),reporter uuid REFERENCES auth.users(id) ON DELETE SET NULL,target uuid REFERENCES auth.users(id) ON DELETE SET NULL,
 reason text NOT NULL CHECK(reason IN('inappropriate_name','harassment','spam','other')),
 details text NOT NULL DEFAULT '' CHECK(length(details)<=500 AND details!~'[[:cntrl:]]'),
 name_snapshot text NOT NULL,username_snapshot text,
 state text NOT NULL DEFAULT 'open' CHECK(state IN('open','dismissed','warned','restricted')),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),resolved_at timestamptz,
 CHECK(reporter IS NULL OR target IS NULL OR reporter<>target)
);
CREATE UNIQUE INDEX report_open_pair_reason ON quiz_private.player_reports(reporter,target,reason) WHERE state='open';
CREATE INDEX reports_queue ON quiz_private.player_reports(state,created_at);
CREATE TABLE quiz_private.moderation_audit(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),moderator uuid REFERENCES auth.users(id) ON DELETE SET NULL,
 report uuid REFERENCES quiz_private.player_reports(id) ON DELETE SET NULL,target uuid REFERENCES auth.users(id) ON DELETE SET NULL,
 decision text NOT NULL,note text NOT NULL CHECK(length(note) BETWEEN 3 AND 500),created_at timestamptz NOT NULL DEFAULT clock_timestamp());
CREATE TABLE quiz_private.profile_prohibited_terms(term text PRIMARY KEY CHECK(term~'^[a-z0-9]{3,32}$'));
INSERT INTO quiz_private.profile_prohibited_terms VALUES('siktir'),('orospu'),('yarrak'),('fuck'),('shit'),('nazi'),('amk');
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['player_safety_config','player_blocks','safety_limits','moderators','social_restrictions','player_reports','moderation_audit','profile_prohibited_terms'] LOOP
  EXECUTE format('ALTER TABLE quiz_private.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('ALTER TABLE quiz_private.%I FORCE ROW LEVEL SECURITY',t);
  EXECUTE format('REVOKE ALL ON quiz_private.%I FROM public,anon,authenticated',t);
 END LOOP;
END $$;
CREATE FUNCTION quiz_private.social_restricted(player uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM quiz_private.social_restrictions WHERE actor=player)
$$;
CREATE FUNCTION quiz_private.pair_blocked(a uuid,b uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM quiz_private.player_blocks WHERE (actor=a AND target=b) OR(actor=b AND target=a))
$$;
CREATE FUNCTION quiz_private.lock_social_pair(a uuid,b uuid) RETURNS void LANGUAGE sql VOLATILE SET search_path='' AS $$
 SELECT pg_advisory_xact_lock(hashtextextended('social-pair:'||least(a,b)::text||':'||greatest(a,b)::text,0))
$$;
CREATE FUNCTION quiz_private.assert_social_pair(a uuid,b uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF a IS NULL OR b IS NULL OR a=b THEN RETURN; END IF;
 PERFORM quiz_private.lock_social_pair(a,b);
 IF quiz_private.pair_blocked(a,b) OR quiz_private.social_restricted(a) OR quiz_private.social_restricted(b) THEN RAISE EXCEPTION 'PLAYER_UNAVAILABLE'; END IF;
END $$;
CREATE FUNCTION quiz_private.guard_social_pair() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF TG_TABLE_NAME='friendships' OR NEW.state IN('pending','accepted') THEN PERFORM quiz_private.assert_social_pair(NEW.sender,NEW.recipient); END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER enforce_friend_blocks BEFORE INSERT OR UPDATE ON quiz_private.friendships FOR EACH ROW EXECUTE FUNCTION quiz_private.guard_social_pair();
CREATE TRIGGER enforce_challenge_blocks BEFORE INSERT OR UPDATE ON quiz_private.direct_challenges FOR EACH ROW EXECUTE FUNCTION quiz_private.guard_social_pair();
CREATE FUNCTION quiz_private.guard_match_participant() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE other uuid;
BEGIN
 -- Existing games and erasure-only identity nulling retain their old behavior.
 IF NEW.player_id IS NULL OR(TG_OP='UPDATE' AND NEW.player_id IS NOT DISTINCT FROM OLD.player_id) THEN RETURN NEW; END IF;
 IF quiz_private.social_restricted(NEW.player_id) THEN RAISE EXCEPTION 'PLAYER_UNAVAILABLE'; END IF;
 FOR other IN SELECT id FROM (SELECT player_id id FROM quiz_private.match_players WHERE match_id=NEW.match_id UNION SELECT creator_id FROM quiz_private.matches WHERE id=NEW.match_id) x WHERE id IS NOT NULL AND id<>NEW.player_id ORDER BY id LOOP
  PERFORM quiz_private.assert_social_pair(NEW.player_id,other);
 END LOOP;
 RETURN NEW;
END $$;
CREATE TRIGGER enforce_duel_blocks BEFORE INSERT OR UPDATE ON quiz_private.match_players FOR EACH ROW EXECUTE FUNCTION quiz_private.guard_match_participant();
CREATE FUNCTION quiz_private.guard_room_participant() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE other uuid;
BEGIN
 IF NEW.left_at IS NOT NULL OR(TG_OP='UPDATE' AND OLD.left_at IS NULL AND NEW.player_id=OLD.player_id) THEN RETURN NEW; END IF;
 IF quiz_private.social_restricted(NEW.player_id) THEN RAISE EXCEPTION 'PLAYER_UNAVAILABLE'; END IF;
 FOR other IN SELECT id FROM (SELECT player_id id FROM quiz_private.live_members WHERE room_id=NEW.room_id AND left_at IS NULL UNION SELECT host_id FROM quiz_private.live_rooms WHERE id=NEW.room_id) x WHERE id IS NOT NULL AND id<>NEW.player_id ORDER BY id LOOP
  PERFORM quiz_private.assert_social_pair(NEW.player_id,other);
 END LOOP;
 RETURN NEW;
END $$;
CREATE TRIGGER enforce_room_blocks BEFORE INSERT OR UPDATE ON quiz_private.live_members FOR EACH ROW EXECUTE FUNCTION quiz_private.guard_room_participant();
CREATE FUNCTION quiz_private.guard_room_start() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE pair record;
BEGIN
 IF OLD.state='lobby' AND NEW.state='countdown' THEN
  FOR pair IN SELECT a.player_id a,b.player_id b FROM quiz_private.live_members a JOIN quiz_private.live_members b ON a.room_id=b.room_id AND a.player_id<b.player_id WHERE a.room_id=NEW.id AND a.left_at IS NULL AND b.left_at IS NULL ORDER BY a.player_id,b.player_id LOOP
   PERFORM quiz_private.assert_social_pair(pair.a,pair.b);
  END LOOP;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER enforce_room_start_blocks BEFORE UPDATE ON quiz_private.live_rooms FOR EACH ROW EXECUTE FUNCTION quiz_private.guard_room_start();
CREATE FUNCTION quiz_private.valid_profile_content(value text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT value IS NOT NULL AND value!~'[[:cntrl:]<>​‌‍‎‏‪-‮⁦-⁩]' AND NOT EXISTS(SELECT 1 FROM quiz_private.profile_prohibited_terms WHERE
 (CASE WHEN term='nazi' THEN regexp_replace(translate(lower(normalize(value,NFKC)),'ıişğüöç0134','iisguocolea'),'[^a-z0-9]','','g')~'^nazi[0-9]*$' ELSE position(term IN regexp_replace(translate(lower(normalize(value,NFKC)),'ıişğüöç0134','iisguocolea'),'[^a-z0-9]','','g'))>0 END))
$$;
CREATE FUNCTION quiz_private.guard_profile_content() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF TG_OP='INSERT' OR NEW.display_name IS DISTINCT FROM OLD.display_name OR NEW.username IS DISTINCT FROM OLD.username THEN
  IF NOT quiz_private.valid_profile_content(NEW.display_name) OR(NEW.username IS NOT NULL AND NOT quiz_private.valid_profile_content(NEW.username)) THEN RAISE EXCEPTION 'PROFILE_CONTENT_REJECTED'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER enforce_profile_content BEFORE INSERT OR UPDATE ON quiz_private.player_profiles FOR EACH ROW EXECUTE FUNCTION quiz_private.guard_profile_content();
CREATE FUNCTION public.player_safety_capabilities() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('enabled',enabled) FROM quiz_private.player_safety_config WHERE singleton
$$;
REVOKE ALL ON FUNCTION public.player_safety_capabilities() FROM public;
GRANT EXECUTE ON FUNCTION public.player_safety_capabilities() TO authenticated;
CREATE FUNCTION public.player_safety_command(actor uuid,operation text,body jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE target_id uuid; target_profile quiz_private.player_profiles; l quiz_private.safety_limits; result jsonb;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 IF NOT EXISTS(SELECT 1 FROM quiz_private.player_safety_config WHERE enabled) THEN RETURN quiz_private.failure('SAFETY_NOT_READY',503); END IF;
 IF NOT EXISTS(SELECT 1 FROM auth.users u JOIN quiz_private.player_profiles p ON p.id=u.id WHERE u.id=actor AND u.email_confirmed_at IS NOT NULL AND NOT u.is_anonymous AND p.access_enabled) THEN RETURN quiz_private.failure('SIGN_IN_REQUIRED',401); END IF;
 IF jsonb_typeof(body) IS DISTINCT FROM 'object' THEN RETURN quiz_private.failure('INVALID_REQUEST'); END IF;
 -- Keep lock order compatible with existing social/matchmaking commands.
 PERFORM 1 FROM quiz_private.player_profiles WHERE id=actor FOR UPDATE;
 INSERT INTO quiz_private.safety_limits(actor) VALUES(actor) ON CONFLICT DO NOTHING;
 SELECT * INTO l FROM quiz_private.safety_limits WHERE safety_limits.actor=player_safety_command.actor FOR UPDATE;
 IF l.day<>current_date THEN l.day=current_date;l.reports=0; END IF;
 IF l.window_at<clock_timestamp()-interval '1 minute' THEN l.window_at=clock_timestamp();l.calls=0; END IF;
 IF l.calls>=30 THEN RETURN quiz_private.failure('RATE_LIMIT',429); END IF;
 UPDATE quiz_private.safety_limits SET day=l.day,reports=l.reports,window_at=l.window_at,calls=l.calls+1 WHERE safety_limits.actor=player_safety_command.actor;
 IF operation='blocked_players' THEN
  IF body<>'{}' THEN RETURN quiz_private.failure('INVALID_REQUEST'); END IF;
  SELECT coalesce(jsonb_agg(jsonb_build_object('id',b.target,'name',p.display_name,'username',p.username,'avatar',p.avatar) ORDER BY b.created_at DESC),'[]'::jsonb) INTO result
  FROM quiz_private.player_blocks b JOIN quiz_private.player_profiles p ON p.id=b.target WHERE b.actor=player_safety_command.actor;
  RETURN jsonb_build_object('players',result);
 END IF;
 IF operation NOT IN('player_block','player_unblock','player_report') OR coalesce(body->>'playerId','')!~'^[a-fA-F0-9-]{36}$'
 OR EXISTS(SELECT 1 FROM jsonb_object_keys(body) k WHERE k NOT IN('playerId','reason','details')) THEN RETURN quiz_private.failure('INVALID_REQUEST'); END IF;
 target_id=(body->>'playerId')::uuid;
 IF target_id=actor THEN RETURN quiz_private.failure('INVALID_REQUEST'); END IF;
 SELECT * INTO target_profile FROM quiz_private.player_profiles WHERE id=target_id;
 IF NOT FOUND THEN RETURN quiz_private.failure('PLAYER_NOT_FOUND',404); END IF;
 IF operation IN('player_block','player_unblock') THEN
  IF body ? 'reason' OR body ? 'details' THEN RETURN quiz_private.failure('INVALID_REQUEST'); END IF;
  PERFORM quiz_private.lock_social_pair(actor,target_id);
  IF operation='player_unblock' THEN DELETE FROM quiz_private.player_blocks WHERE player_blocks.actor=player_safety_command.actor AND target=target_id;
  ELSE
   IF (SELECT count(*) FROM quiz_private.player_blocks WHERE player_blocks.actor=player_safety_command.actor)>=500
    AND NOT EXISTS(SELECT 1 FROM quiz_private.player_blocks WHERE player_blocks.actor=player_safety_command.actor AND target=target_id) THEN RETURN quiz_private.failure('RATE_LIMIT',429); END IF;
   INSERT INTO quiz_private.player_blocks(actor,target) VALUES(actor,target_id) ON CONFLICT DO NOTHING;
   -- Remove only active contact edges, never profiles, match records, XP or results.
   DELETE FROM public.player_notifications WHERE reference_id IN(
    SELECT id FROM quiz_private.friendships WHERE (sender=actor AND recipient=target_id) OR(sender=target_id AND recipient=actor)
    UNION SELECT id FROM quiz_private.direct_challenges WHERE state='pending' AND ((sender=actor AND recipient=target_id) OR(sender=target_id AND recipient=actor)));
   DELETE FROM quiz_private.friendships WHERE (sender=actor AND recipient=target_id) OR(sender=target_id AND recipient=actor);
   UPDATE quiz_private.direct_challenges SET state='cancelled' WHERE state='pending' AND ((sender=actor AND recipient=target_id) OR(sender=target_id AND recipient=actor));
  END IF;
  RETURN jsonb_build_object('saved',true);
 END IF;
 IF body->>'reason' IS NULL OR body->>'reason' NOT IN('inappropriate_name','harassment','spam','other') OR jsonb_typeof(coalesce(body->'details','""'::jsonb))<>'string'
 OR length(coalesce(body->>'details',''))>500 OR coalesce(body->>'details','')~'[[:cntrl:]]' THEN RETURN quiz_private.failure('INVALID_REQUEST'); END IF;
 IF EXISTS(SELECT 1 FROM quiz_private.player_reports WHERE reporter=actor AND target=target_id AND reason=body->>'reason' AND state='open') THEN RETURN jsonb_build_object('saved',true); END IF;
 IF l.reports>=5 THEN RETURN quiz_private.failure('REPORT_RATE_LIMIT',429); END IF;
 INSERT INTO quiz_private.player_reports(reporter,target,reason,details,name_snapshot,username_snapshot) VALUES(actor,target_id,body->>'reason',coalesce(body->>'details',''),target_profile.display_name,target_profile.username);
 UPDATE quiz_private.safety_limits SET reports=reports+1 WHERE safety_limits.actor=player_safety_command.actor;
 RETURN jsonb_build_object('saved',true);
EXCEPTION WHEN invalid_text_representation THEN RETURN quiz_private.failure('INVALID_REQUEST');
END $$;
REVOKE ALL ON FUNCTION public.player_safety_command(uuid,text,jsonb) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.player_safety_command(uuid,text,jsonb) TO service_role;
-- Preserve one authoritative social implementation. The former public entry is
-- moved private and cannot be invoked as a backdoor by any API role.
ALTER FUNCTION public.player_social_command(uuid,text,jsonb) SET SCHEMA quiz_private;
ALTER FUNCTION quiz_private.player_social_command(uuid,text,jsonb) RENAME TO player_social_core;
REVOKE ALL ON FUNCTION quiz_private.player_social_core(uuid,text,jsonb) FROM public,anon,authenticated,service_role;
CREATE FUNCTION public.player_social_command(actor uuid,operation text,body jsonb DEFAULT '{}'::jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE result jsonb; items jsonb; key text;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 IF operation IN('friend_send','friend_accept','social_profile') AND quiz_private.social_restricted(actor) THEN RETURN quiz_private.failure('SOCIAL_RESTRICTED',403); END IF;
 result=quiz_private.player_social_core(actor,operation,body);
 IF operation IN('friends','player_search') AND NOT(result ? 'error') THEN
  key=CASE WHEN operation='friends' THEN 'friendships' ELSE 'players' END;
  SELECT coalesce(jsonb_agg(item),'[]'::jsonb) INTO items FROM jsonb_array_elements(result->key) item
   WHERE NOT quiz_private.social_restricted((CASE WHEN operation='friends' THEN item->'player'->>'id' ELSE item->>'id' END)::uuid) AND NOT quiz_private.pair_blocked(actor,(CASE WHEN operation='friends' THEN item->'player'->>'id' ELSE item->>'id' END)::uuid);
  result=jsonb_set(result,ARRAY[key],items);
 END IF;
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.player_social_command(uuid,text,jsonb) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.player_social_command(uuid,text,jsonb) TO service_role;
CREATE FUNCTION public.moderation_review(operation text,report_id uuid DEFAULT NULL,note text DEFAULT NULL) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE reviewer uuid:=auth.uid(); report quiz_private.player_reports; items jsonb;
BEGIN
 IF reviewer IS NULL OR NOT EXISTS(SELECT 1 FROM quiz_private.moderators WHERE moderators.actor=reviewer AND active)
 OR NOT EXISTS(SELECT 1 FROM auth.sessions WHERE user_id=reviewer AND id=nullif(auth.jwt()->>'session_id','')::uuid AND(not_after IS NULL OR not_after>clock_timestamp())) THEN RAISE insufficient_privilege; END IF;
 IF operation='queue' THEN
  SELECT coalesce(jsonb_agg(x.item),'[]'::jsonb) INTO items FROM(SELECT to_jsonb(r) item FROM quiz_private.player_reports r WHERE state='open' ORDER BY created_at LIMIT 50) x;
  RETURN jsonb_build_object('reports',items);
 END IF;
 IF operation NOT IN('dismiss','warn','restrict','restore') OR note IS NULL OR length(note) NOT BETWEEN 3 AND 500 OR note~'[[:cntrl:]]' THEN RAISE EXCEPTION 'INVALID_REQUEST'; END IF;
 SELECT * INTO report FROM quiz_private.player_reports WHERE id=report_id FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'REPORT_NOT_FOUND'; END IF;
 IF operation='restrict' AND report.target IS NOT NULL THEN INSERT INTO quiz_private.social_restrictions(actor,reason) VALUES(report.target,note) ON CONFLICT(actor) DO UPDATE SET reason=excluded.reason;
 ELSIF operation='restore' THEN DELETE FROM quiz_private.social_restrictions WHERE social_restrictions.actor=report.target; END IF;
 UPDATE quiz_private.player_reports SET state=CASE operation WHEN 'dismiss' THEN 'dismissed' WHEN 'warn' THEN 'warned' WHEN 'restrict' THEN 'restricted' ELSE 'dismissed' END,resolved_at=clock_timestamp() WHERE id=report_id;
 INSERT INTO quiz_private.moderation_audit(moderator,report,target,decision,note) VALUES(reviewer,report_id,report.target,operation,note);
 RETURN jsonb_build_object('saved',true);
END $$;
REVOKE ALL ON FUNCTION public.moderation_review(text,uuid,text) FROM public,anon;
GRANT EXECUTE ON FUNCTION public.moderation_review(text,uuid,text) TO authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA quiz_private FROM public,anon,authenticated;
COMMIT;
