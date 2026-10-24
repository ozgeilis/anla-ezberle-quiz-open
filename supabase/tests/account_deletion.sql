-- Local synthetic accounts only. Everything including test data rolls back.
BEGIN;
SET LOCAL statement_timeout='30s';
DO $$
DECLARE a uuid:=gen_random_uuid();b uuid:=gen_random_uuid();rid uuid;mid uuid;sa uuid;sb uuid;before_score jsonb;v jsonb;
BEGIN
 IF has_function_privilege('anon','public.delete_player_account(uuid)','EXECUTE') OR has_function_privilege('authenticated','public.delete_player_account(uuid)','EXECUTE') THEN RAISE EXCEPTION 'Client can invoke service erasure'; END IF;
 INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous) VALUES(a,'authenticated','authenticated','erase-a-'||a||'@example.invalid',now(),false),(b,'authenticated','authenticated','erase-b-'||b||'@example.invalid',now(),false);
 INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled) VALUES(a,'Synthetic A',true),(b,'Synthetic B',true);
 PERFORM set_config('request.jwt.claim.role','authenticated',true);
 BEGIN PERFORM public.delete_player_account(b);RAISE EXCEPTION 'TEST cross-user erasure allowed';EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 PERFORM set_config('request.jwt.claim.role','service_role',true);
 BEGIN PERFORM public.delete_player_account(a);RAISE EXCEPTION 'TEST disabled rollout accepted';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST disabled rollout accepted' THEN RAISE;END IF; END;
 UPDATE quiz_private.account_deletion_config SET enabled=true WHERE singleton;
 INSERT INTO quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash,state,result)
 VALUES(a,gen_random_uuid(),(SELECT jsonb_agg(jsonb_build_object('id',n)) FROM generate_series(1,10)n),'synthetic',decode('00','hex'),'completed','{"winner":"a","a":1000,"b":500}') RETURNING id INTO mid;
 INSERT INTO quiz_private.quiz_sessions(match_id,player_id,completed_at,correct_count) VALUES(mid,a,now(),10) RETURNING id INTO sa;
 INSERT INTO quiz_private.quiz_sessions(match_id,player_id,completed_at,correct_count) VALUES(mid,b,now(),5) RETURNING id INTO sb;
 INSERT INTO quiz_private.match_players VALUES(mid,'a',a,sa),(mid,'b',b,sb);
 INSERT INTO quiz_private.quiz_attempts VALUES(sa,1,'a',gen_random_uuid(),true,now());
 INSERT INTO quiz_private.score_ledger(match_id,player_id,score,rule_version) VALUES(mid,a,1000,1),(mid,b,500,1);
 SELECT to_jsonb(s) INTO before_score FROM quiz_private.score_ledger s WHERE player_id=b AND match_id=mid;
 INSERT INTO quiz_private.friendships(sender,recipient) VALUES(a,b);
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state) VALUES('ERASE2',a,gen_random_uuid(),'bank-v41','completed') RETURNING id INTO rid;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(rid,a,true),(rid,b,true);
 INSERT INTO quiz_private.live_answers(room_id,player_id,position,option_id,request_id,is_correct) VALUES(rid,a,1,'a',gen_random_uuid(),true),(rid,b,1,'b',gen_random_uuid(),false);
 INSERT INTO quiz_private.live_rewards(room_id,player_id,score,correct,wrong,unanswered,rank,won,xp,bonus,credited,set_hash,friend_ids)
 VALUES(rid,a,100,1,0,9,1,true,10,0,true,'synthetic-erasure',ARRAY[b]),(rid,b,0,0,1,9,2,false,0,0,false,'synthetic-erasure',ARRAY[a]);
 BEGIN
  PERFORM public.delete_player_account(a);
  RAISE no_data_found; -- exercise rollback of the entire erasure subtransaction
 EXCEPTION WHEN no_data_found THEN NULL; END;
 IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id=a) OR NOT EXISTS(SELECT 1 FROM quiz_private.score_ledger WHERE player_id=a) THEN RAISE EXCEPTION 'Atomic rollback failed'; END IF;
 v=public.delete_player_account(a);
 IF v->>'deleted'<>'true' OR EXISTS(SELECT 1 FROM auth.users WHERE id=a) OR EXISTS(SELECT 1 FROM quiz_private.player_profiles WHERE id=a) OR EXISTS(SELECT 1 FROM quiz_private.quiz_attempts WHERE session_id=sa) OR EXISTS(SELECT 1 FROM quiz_private.live_members WHERE player_id=a) OR EXISTS(SELECT 1 FROM quiz_private.live_rewards WHERE player_id=a) OR EXISTS(SELECT 1 FROM quiz_private.score_ledger WHERE player_id=a) OR EXISTS(SELECT 1 FROM quiz_private.friendships WHERE a IN(sender,recipient)) THEN RAISE EXCEPTION 'Erasure incomplete'; END IF;
 IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id=b) OR before_score IS DISTINCT FROM (SELECT to_jsonb(s) FROM quiz_private.score_ledger s WHERE player_id=b AND match_id=mid) THEN RAISE EXCEPTION 'Other player/account/score damaged'; END IF;
 IF EXISTS(SELECT 1 FROM quiz_private.live_rewards WHERE a=ANY(friend_ids)) THEN RAISE EXCEPTION 'Personal friend ID retained'; END IF;
 BEGIN UPDATE quiz_private.score_ledger SET score=1000 WHERE player_id=b AND match_id=mid;RAISE EXCEPTION 'TEST reward immutability bypassed';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST reward immutability bypassed' THEN RAISE;END IF; END;
 BEGIN DELETE FROM quiz_private.live_answers WHERE player_id=b AND room_id=rid;RAISE EXCEPTION 'TEST answer immutability bypassed';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST answer immutability bypassed' THEN RAISE;END IF; END;
 v=quiz_private.match_view(b,mid);
 IF jsonb_array_length(v->'players')<>2 OR v#>>'{players,0,name}'<>'Silinmiş Oyuncu' THEN RAISE EXCEPTION 'Erased opponent view broken'; END IF;
 RAISE NOTICE 'PASS service-only erasure, disabled gate, cross-user denial, atomic related cleanup, opponent score preservation, immutable answers and rewards';
END $$;
ROLLBACK;
