BEGIN;
DO $$
DECLARE a uuid=gen_random_uuid();rid uuid;legacy uuid;manifest jsonb;v jsonb;
BEGIN
 INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous) VALUES(a,'authenticated','authenticated','timer-'||a||'@example.invalid',now(),false);
 INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled,username) VALUES(a,'Synthetic Timer',true,'timer_'||substr(replace(a::text,'-',''),1,12));
 manifest=quiz_private.live_manifest('bank-v41','mixed','easy',5);
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,start_at,manifest,set_hash,question_count,phase,position)
 VALUES('TENSA2',a,gen_random_uuid(),'bank-v41','playing',clock_timestamp()-interval '9 seconds',manifest,'synthetic-timer',5,'answer',1) RETURNING id INTO rid;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(rid,a,true);
 v=quiz_private.live_view(a,rid);
 IF v#>>'{settings,seconds}'<>'10' OR v->'review'<>'null'::jsonb THEN RAISE EXCEPTION 'New room timing or answer privacy incorrect';END IF;
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,start_at,manifest,set_hash,question_count,phase,position,answer_seconds)
 VALUES('TENSB2',a,gen_random_uuid(),'bank-v41','playing',clock_timestamp()-interval '10.1 seconds',manifest,'synthetic-timer',5,'answer',1,15) RETURNING id INTO legacy;
 PERFORM quiz_private.live_advance(legacy);
 IF (SELECT phase FROM quiz_private.live_rooms WHERE id=legacy)<>'answer' THEN RAISE EXCEPTION 'Legacy 15s room broken';END IF;
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,start_at,manifest,set_hash,question_count,phase,position)
 VALUES('TENSC2',a,gen_random_uuid(),'bank-v41','playing',clock_timestamp()-interval '10.1 seconds',manifest,'synthetic-timer',5,'answer',1) RETURNING id INTO rid;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(rid,a,true);
 PERFORM quiz_private.live_advance(rid);v=quiz_private.live_view(a,rid);
 IF v->>'phase'<>'reveal' OR v->'review'='null'::jsonb THEN RAISE EXCEPTION '10s reveal missing';END IF;
 v=public.live_room_command(a,'room_answer',jsonb_build_object('roomId',rid,'position',1,'optionId','a','requestId',gen_random_uuid()));
 IF v->>'error'<>'ANSWER_LATE' THEN RAISE EXCEPTION 'Late 10s answer accepted';END IF;
 BEGIN UPDATE quiz_private.live_rooms SET answer_seconds=15 WHERE id=rid;RAISE EXCEPTION 'TEST timing mutation accepted';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST timing mutation accepted' THEN RAISE;END IF;END;
 RAISE NOTICE 'PASS new 10s rooms, hidden answer keys, 10s reveal, late rejection, frozen legacy 15s rooms and immutable timing';
END $$;
ROLLBACK;
