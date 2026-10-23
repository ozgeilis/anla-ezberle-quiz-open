-- LOCAL ONLY. The runner sets this session marker after choosing a fixed local
-- Docker container. Every fixture and counter change is rolled back, even when
-- psql exits early on an assertion failure. Never run this on a hosted project.
BEGIN;
SET LOCAL statement_timeout='20s';
DO $$ BEGIN
 ASSERT current_setting('anla.audit_local_only',true)='on','Local-only runner required';
END $$;
CREATE TEMP TABLE security_people(label text PRIMARY KEY,id uuid DEFAULT gen_random_uuid());
INSERT INTO security_people(label) VALUES('a'),('b'),('unverified');
GRANT SELECT ON security_people TO anon,authenticated;
INSERT INTO auth.users(id,email,email_confirmed_at,is_anonymous)
 SELECT id,'security-'||id||'@example.invalid',CASE WHEN label<>'unverified' THEN now() END,false FROM security_people;
INSERT INTO quiz_private.player_profiles(id,display_name,username,access_enabled,discoverable)
 SELECT id,'Security Fixture','sec_'||left(replace(id::text,'-',''),12),true,true FROM security_people;
INSERT INTO public.player_notifications(recipient_id,kind,reference_id)
 SELECT id,'friend_request',gen_random_uuid() FROM security_people WHERE label IN('a','b');
CREATE TEMP TABLE security_objects(kind text PRIMARY KEY,id uuid DEFAULT gen_random_uuid());
INSERT INTO security_objects(kind) VALUES('match'),('session'),('room');
GRANT SELECT ON security_objects TO anon,authenticated;
INSERT INTO quiz_private.matches(id,creator_id,create_request_id,question_set,manifest_hash,invite_hash)
 SELECT o.id,p.id,gen_random_uuid(),(SELECT jsonb_agg('{}'::jsonb) FROM generate_series(1,10)),
 'local-security-fixture',decode(md5(o.id::text),'hex') FROM security_objects o CROSS JOIN security_people p WHERE o.kind='match' AND p.label='b';
INSERT INTO quiz_private.quiz_sessions(id,match_id,player_id)
 SELECT s.id,m.id,p.id FROM security_objects s CROSS JOIN security_objects m CROSS JOIN security_people p
 WHERE s.kind='session' AND m.kind='match' AND p.label='b';
INSERT INTO quiz_private.match_players(match_id,slot,player_id,session_id)
 SELECT m.id,'a',p.id,s.id FROM security_objects m CROSS JOIN security_objects s CROSS JOIN security_people p
 WHERE m.kind='match' AND s.kind='session' AND p.label='b';
INSERT INTO quiz_private.live_rooms(id,code,host_id,request_id,dataset)
 SELECT o.id,translate(upper(left(replace(o.id::text,'-',''),6)),'01','XY'),p.id,gen_random_uuid(),'local-security-fixture' FROM security_objects o CROSS JOIN security_people p WHERE o.kind='room' AND p.label='b';
INSERT INTO quiz_private.live_members(room_id,player_id)
 SELECT o.id,p.id FROM security_objects o CROSS JOIN security_people p WHERE o.kind='room' AND p.label='b';

DO $$ DECLARE t record;f record;BEGIN
 ASSERT NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema IN('public','quiz_private') AND column_name ~* '(password|passwd|secret|access_token|refresh_token|email)'), 'No application credential columns';
 FOR t IN SELECT c.oid,c.relrowsecurity,c.relforcerowsecurity FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='quiz_private' AND c.relkind='r' LOOP
  ASSERT t.relrowsecurity AND t.relforcerowsecurity,'Private tables require forced RLS';
  ASSERT NOT has_table_privilege('anon',t.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE'),'No anon private table access';
  ASSERT NOT has_table_privilege('authenticated',t.oid,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE'),'No direct authenticated private table access';
 END LOOP;
 ASSERT (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname IN('online_duel_command','online_duel_enroll_test_user','player_social_command','player_matchmaking_command','player_achievement_command','live_room_command','player_leaderboard_command'))=7,'All protected RPCs must exist';
 FOR f IN SELECT p.oid FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname IN('online_duel_command','online_duel_enroll_test_user','player_social_command','player_matchmaking_command','player_achievement_command','live_room_command','player_leaderboard_command') LOOP
  ASSERT NOT has_function_privilege('anon',f.oid,'EXECUTE'),'No anon privileged RPC';
  ASSERT NOT has_function_privilege('authenticated',f.oid,'EXECUTE'),'No client actor spoof through RPC';
 END LOOP;
END $$;
SELECT 'PASS private RLS, credential columns and privileged RPC grants';

SET LOCAL ROLE anon;
DO $$ BEGIN
 BEGIN PERFORM 1 FROM public.player_notifications LIMIT 1;RAISE EXCEPTION 'Anonymous notification read succeeded';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 BEGIN PERFORM 1 FROM auth.users LIMIT 1;RAISE EXCEPTION 'Anonymous Auth user read succeeded';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 BEGIN PERFORM 1 FROM quiz_private.quiz_answer_keys LIMIT 1;RAISE EXCEPTION 'Anonymous answer key read succeeded';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
END $$;
RESET ROLE;
SELECT 'PASS anonymous account, notification and answer-key denial';

SET LOCAL ROLE authenticated;
DO $$ DECLARE a uuid;b uuid;BEGIN
 SELECT id INTO a FROM security_people WHERE label='a';SELECT id INTO b FROM security_people WHERE label='b';
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',a,'role','authenticated')::text,true);
 ASSERT (SELECT count(*) FROM public.player_notifications WHERE recipient_id=a)=1,'A sees own notification';
 ASSERT (SELECT count(*) FROM public.player_notifications WHERE recipient_id=b)=0,'A cannot read B notification';
 BEGIN PERFORM 1 FROM auth.users LIMIT 1;RAISE EXCEPTION 'Client Auth user read succeeded';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 BEGIN PERFORM 1 FROM quiz_private.player_profiles LIMIT 1;RAISE EXCEPTION 'Client private profile read succeeded';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 BEGIN PERFORM public.online_duel_command(b,'self','{}');RAISE EXCEPTION 'Client impersonation RPC succeeded';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 BEGIN UPDATE public.player_notifications SET read_at=now() WHERE recipient_id=b;RAISE EXCEPTION 'Client notification write succeeded';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 ASSERT NOT public.live_room_member('live:'||(SELECT id FROM security_objects WHERE kind='room')),'A cannot subscribe to B room';
 PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',b,'role','authenticated')::text,true);
 ASSERT (SELECT count(*) FROM public.player_notifications WHERE recipient_id=b)=1,'B sees own notification';
 ASSERT (SELECT count(*) FROM public.player_notifications WHERE recipient_id=a)=0,'B cannot read A notification';
 ASSERT public.live_room_member('live:'||(SELECT id FROM security_objects WHERE kind='room')),'B can subscribe to own room';
END $$;
RESET ROLE;
SELECT 'PASS A/B RLS isolation, write denial and Realtime membership';

DO $$ DECLARE a uuid;b uuid;u uuid;r jsonb;player jsonb;notification uuid;BEGIN
 SELECT id INTO a FROM security_people WHERE label='a';SELECT id INTO b FROM security_people WHERE label='b';SELECT id INTO u FROM security_people WHERE label='unverified';
 r=public.online_duel_command(a,'get',jsonb_build_object('matchId',(SELECT id FROM security_objects WHERE kind='match')));
 ASSERT r->>'error'='MATCH_NOT_FOUND','A cannot open B match';
 r=public.live_room_command(a,'room_get',jsonb_build_object('roomId',(SELECT id FROM security_objects WHERE kind='room')));
 ASSERT r->>'error'='ROOM_NOT_FOUND','A cannot open B room';
 SELECT id INTO notification FROM public.player_notifications WHERE recipient_id=b LIMIT 1;
 r=public.player_matchmaking_command(a,'notification_read',jsonb_build_object('notificationId',notification));
 ASSERT r->>'error'='NOTIFICATION_NOT_FOUND','A cannot mark B notification read';
 ASSERT (SELECT read_at IS NULL FROM public.player_notifications WHERE id=notification),'B read state preserved';
 ASSERT public.player_social_command(u,'social_self','{}')->>'error'='SIGN_IN_REQUIRED','Unverified social account denied';
 ASSERT public.player_achievement_command(u,'achievement_self','{}')->>'error'='SIGN_IN_REQUIRED','Unverified achievement account denied';
 r=public.player_social_command(a,'player_search',jsonb_build_object('query',(SELECT username FROM quiz_private.player_profiles WHERE id=b)));
 ASSERT jsonb_array_length(r->'players')=1,'Discoverable synthetic profile is returned';
 player=r->'players'->0;
 ASSERT NOT EXISTS(SELECT 1 FROM jsonb_object_keys(player) k WHERE k<>ALL(ARRAY['id','name','username','avatar','xp','level','achievementsShared','badgeIds','showcase'])),'Explicit public profile field allowlist';
 ASSERT player->'badgeIds'='[]'::jsonb AND player->'showcase'='[]'::jsonb,'Private achievements hidden';
 UPDATE quiz_private.player_profiles SET discoverable=false WHERE id=b;
 r=public.player_social_command(a,'player_search',jsonb_build_object('query',(SELECT username FROM quiz_private.player_profiles WHERE id=b)));
 ASSERT r->'players'='[]'::jsonb,'Search respects privacy opt-out';
END $$;
SELECT 'PASS cross-user match, room, inbox and public profile field isolation';
ROLLBACK;
SELECT 'PASS all synthetic SQL fixtures and counters rolled back';
