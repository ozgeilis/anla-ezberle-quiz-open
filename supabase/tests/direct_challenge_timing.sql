-- Existing throwaway timing fixtures only. Never run this against hosted users.
BEGIN;
DO $$ DECLARE f quiz_private.timing_test_fixtures; v jsonb; cid uuid; m uuid; legacy uuid;
BEGIN
 SELECT * INTO STRICT f FROM quiz_private.timing_test_fixtures;
 UPDATE quiz_private.player_profiles SET discoverable=true WHERE id IN(f.a,f.b);
 v=public.player_matchmaking_command(f.a,'challenge_send',jsonb_build_object('playerId',f.b,'requestId',gen_random_uuid()));
 IF v ? 'error' THEN RAISE EXCEPTION 'Test invitation creation failed: %',v->>'error';END IF;
 cid=(v#>>'{challenge,id}')::uuid;
 -- Old clients must not unknowingly accept a newly timed game.
 v=public.player_matchmaking_command(f.b,'challenge_reply',jsonb_build_object('challengeId',cid,'action','accept'));
 IF v->>'error' IS DISTINCT FROM 'UPDATE_REQUIRED' OR (SELECT state FROM quiz_private.direct_challenges WHERE direct_challenges.id=cid)<>'pending' THEN RAISE EXCEPTION 'Legacy acceptance changed a pending invitation';END IF;
 v=public.player_matchmaking_command(f.b,'challenge_reply',jsonb_build_object('challengeId',cid,'action','accept','timingVersion',2));
 IF v ? 'error' THEN RAISE EXCEPTION 'Timing v2 invitation acceptance failed: %',v->>'error';END IF;
 SELECT match_id INTO m FROM quiz_private.direct_challenges WHERE direct_challenges.id=cid;
 IF m IS NULL OR (SELECT answer_seconds FROM quiz_private.matches WHERE matches.id=m)<>20 OR (SELECT count(*) FROM quiz_private.match_players WHERE match_id=m)<>2 THEN RAISE EXCEPTION 'Direct match timing/roster wrong';END IF;
 v=public.player_matchmaking_command(f.b,'challenge_reply',jsonb_build_object('challengeId',cid,'action','accept','timingVersion',2));
 IF v ? 'error' OR (SELECT count(*) FROM quiz_private.matches WHERE matches.id=m)<>1 THEN RAISE EXCEPTION 'Acceptance retry created another match';END IF;
 v=public.online_duel_command(f.b,'start',jsonb_build_object('matchId',m,'timingVersion',2));
 IF v ? 'error' OR extract(epoch FROM ((v->>'deadline')::timestamptz-(v->>'questionOpenedAt')::timestamptz))<>20 THEN RAISE EXCEPTION 'Direct recipient cannot start its twenty second turn';END IF;
 -- Existing accepted legacy invitations still resume the same untimed match.
 INSERT INTO quiz_private.direct_challenges(sender,recipient,request_id,state,match_id)
 VALUES(f.a,f.b,gen_random_uuid(),'accepted',f.legacy_match) RETURNING direct_challenges.id INTO legacy;
 v=public.player_matchmaking_command(f.b,'challenge_reply',jsonb_build_object('challengeId',legacy,'action','accept'));
 IF v ? 'error' OR (SELECT answer_seconds FROM quiz_private.matches WHERE matches.id=f.legacy_match) IS NOT NULL THEN RAISE EXCEPTION 'Legacy accepted match lost compatibility';END IF;
 -- Decline/cancel remain supported without the new timing protocol.
 v=public.player_matchmaking_command(f.a,'challenge_send',jsonb_build_object('playerId',f.b,'requestId',gen_random_uuid()));cid=(v#>>'{challenge,id}')::uuid;
 v=public.player_matchmaking_command(f.b,'challenge_reply',jsonb_build_object('challengeId',cid,'action','decline'));
 IF v ? 'error' OR (SELECT state FROM quiz_private.direct_challenges WHERE direct_challenges.id=cid)<>'declined' THEN RAISE EXCEPTION 'Legacy decline broken';END IF;
 v=public.player_matchmaking_command(f.a,'challenge_send',jsonb_build_object('playerId',f.b,'requestId',gen_random_uuid()));cid=(v#>>'{challenge,id}')::uuid;
 v=public.player_matchmaking_command(f.a,'challenge_reply',jsonb_build_object('challengeId',cid,'action','cancel'));
 IF v ? 'error' OR (SELECT state FROM quiz_private.direct_challenges WHERE direct_challenges.id=cid)<>'cancelled' THEN RAISE EXCEPTION 'Legacy cancel broken';END IF;
 IF has_function_privilege('anon','public.player_matchmaking_command(uuid,text,jsonb)','EXECUTE') OR has_function_privilege('authenticated','public.player_matchmaking_command(uuid,text,jsonb)','EXECUTE') THEN RAISE EXCEPTION 'RPC privilege leak';END IF;
 RAISE NOTICE 'PASS direct invitation: v2 acceptance, 20s recipient start, replay, legacy accepted match/decline/cancel and private RPC';
END $$;
ROLLBACK;
