-- Local-only PostgreSQL security acceptance. All fixtures roll back.
BEGIN;
DO $$
DECLARE ids uuid[]='{}';u uuid;r jsonb;rid uuid;code text;i integer;v jsonb;manifest jsonb;hash text;first_room uuid;second_room uuid;late_room uuid;req uuid=gen_random_uuid();opt text;
BEGIN
 FOR i IN 1..9 LOOP
  u=gen_random_uuid();ids=array_append(ids,u);
  INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous) VALUES(u,'authenticated','authenticated','live-sql-'||u::text||'@example.com',now(),false);
  INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled,username) VALUES(u,'SQL Oyuncu',true,'sql_'||substr(replace(u::text,'-',''),1,16));
 END LOOP;
 r=public.live_room_command(ids[1],'room_create',jsonb_build_object('requestId',gen_random_uuid()));rid=(r->>'id')::uuid;code=r->>'code';
 IF rid IS NULL THEN RAISE EXCEPTION 'Create failed';END IF;
 FOR i IN 2..8 LOOP v=public.live_room_command(ids[i],'room_join',jsonb_build_object('code',code));IF v ? 'error' THEN RAISE EXCEPTION 'Valid capacity rejected';END IF;END LOOP;
 v=public.live_room_command(ids[9],'room_join',jsonb_build_object('code',code));IF v->>'error'<>'ROOM_FULL' THEN RAISE EXCEPTION 'Ninth member was not rejected';END IF;
 RAISE NOTICE 'PASS capacity 2-8 enforced in database';
 PERFORM set_config('request.jwt.claim.sub',ids[1]::text,true);
 IF NOT public.live_room_member('live:'||rid::text) THEN RAISE EXCEPTION 'Member authorization failed';END IF;
 PERFORM set_config('request.jwt.claim.sub',ids[9]::text,true);
 IF public.live_room_member('live:'||rid::text) THEN RAISE EXCEPTION 'Foreign room membership leak';END IF;
 IF has_function_privilege('authenticated','public.live_room_command(uuid,text,jsonb)','EXECUTE') OR has_function_privilege('anon','public.live_room_command(uuid,text,jsonb)','EXECUTE') THEN RAISE EXCEPTION 'Client command grant leaked';END IF;
 IF has_table_privilege('authenticated','quiz_private.live_keys','SELECT') OR has_table_privilege('authenticated','quiz_private.live_rewards','UPDATE') OR has_table_privilege('authenticated','quiz_private.live_answers','INSERT') THEN RAISE EXCEPTION 'Private table grant leaked';END IF;
 RAISE NOTICE 'PASS member authorization, private keys, no client scoring or actor impersonation';
 FOR i IN 1..10 LOOP v=public.live_room_command(ids[9],'room_join','{"code":"ZZZZZZ"}');END LOOP;
 IF v->>'error'<>'RATE_LIMIT' THEN RAISE EXCEPTION 'Join rate limit missing';END IF;
 RAISE NOTICE 'PASS invitation brute-force rate limit';
 UPDATE quiz_private.live_rooms SET expires_at=clock_timestamp()-interval '1 second' WHERE id=rid;
 v=public.live_room_command(ids[1],'room_get',jsonb_build_object('roomId',rid));IF v->>'state'<>'expired' THEN RAISE EXCEPTION 'Expired lobby remains open';END IF;
 RAISE NOTICE 'PASS unused lobby expiry';
 manifest=quiz_private.live_manifest('bank-v41','mixed','easy',5);
 hash=encode(extensions.digest((SELECT string_agg(q->>'id','|' ORDER BY q->>'id') FROM jsonb_array_elements(manifest) q),'sha256'),'hex');
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,question_count,state,start_at,manifest,set_hash,phase,position) VALUES('SQLA23',ids[1],gen_random_uuid(),'bank-v41',5,'playing',clock_timestamp()-interval '16 seconds',manifest,hash,'answer',1) RETURNING id INTO late_room;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(late_room,ids[1],true),(late_room,ids[2],true);
 opt=manifest->0->'options'->0->>'id';
 v=public.live_room_command(ids[1],'room_answer',jsonb_build_object('roomId',late_room,'position',1,'optionId',opt,'requestId',req));IF v->>'error'<>'ANSWER_LATE' THEN RAISE EXCEPTION 'Late answer was accepted';END IF;
 BEGIN UPDATE quiz_private.live_rooms SET start_at=start_at-interval '1 hour' WHERE id=late_room;RAISE EXCEPTION 'TEST immutable clock bypassed';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST immutable clock bypassed' THEN RAISE;END IF;END;
 RAISE NOTICE 'PASS late answer and immutable started clock';
 FOR i IN 1..2 LOOP
  INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,question_count,state,start_at,manifest,set_hash,phase,position) VALUES(CASE WHEN i=1 THEN 'SQLB23' ELSE 'SQLC23' END,ids[1],gen_random_uuid(),'bank-v41',5,'playing',clock_timestamp()-interval '101 seconds',manifest,hash,'answer',1) RETURNING id INTO rid;
  INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(rid,ids[1],true),(rid,ids[2],true);
  INSERT INTO quiz_private.live_answers(room_id,player_id,position,option_id,request_id,is_correct) VALUES(rid,ids[1],1,opt,gen_random_uuid(),true);
  PERFORM quiz_private.live_advance(rid);PERFORM quiz_private.live_advance(rid);
  IF i=1 THEN first_room=rid;ELSE second_room=rid;END IF;
 END LOOP;
 IF (SELECT xp FROM quiz_private.live_rewards WHERE room_id=first_room AND player_id=ids[1])<>30 OR (SELECT xp FROM quiz_private.live_rewards WHERE room_id=second_room AND player_id=ids[1])<>0 THEN RAISE EXCEPTION 'Repeated set granted XP';END IF;
 IF (SELECT count(*) FROM quiz_private.live_rewards WHERE player_id=ids[1] AND credited)<>1 THEN RAISE EXCEPTION 'Duplicate reward credit';END IF;
 IF EXISTS(SELECT 1 FROM quiz_private.live_rewards WHERE player_id=ids[2] AND credited) THEN RAISE EXCEPTION 'Absent participant got a reward';END IF;
 RAISE NOTICE 'PASS immutable completion, reward idempotency, repeated-set farming and absent-player reward gates';
 BEGIN UPDATE quiz_private.live_rewards SET xp=170 WHERE room_id=first_room;RAISE EXCEPTION 'TEST reward mutation bypassed';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST reward mutation bypassed' THEN RAISE;END IF;END;
 BEGIN UPDATE quiz_private.live_answers SET is_correct=false WHERE room_id=first_room;RAISE EXCEPTION 'TEST answer mutation bypassed';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST answer mutation bypassed' THEN RAISE;END IF;END;
 RAISE NOTICE 'PASS accepted answers and awarded XP are append-only';
END $$;
ROLLBACK;
