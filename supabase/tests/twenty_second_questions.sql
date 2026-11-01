BEGIN;
DO $$ DECLARE f quiz_private.timing_test_fixtures;v jsonb;m uuid;s uuid;r uuid;request uuid;option text;manifest jsonb;BEGIN
 SELECT * INTO f FROM quiz_private.timing_test_fixtures;
 IF (SELECT answer_seconds FROM quiz_private.live_rooms WHERE id=f.legacy_room)<>10 OR (SELECT answer_seconds IS NOT NULL FROM quiz_private.matches WHERE id=f.legacy_match) THEN RAISE EXCEPTION 'Existing timing changed'; END IF;
 -- Old matches remain untimed when started by the new client.
 v=public.online_duel_command(f.a,'start',jsonb_build_object('matchId',f.legacy_match));
 IF v->'answerSeconds'<>'null'::jsonb OR v->'deadline'<>'null'::jsonb THEN RAISE EXCEPTION 'Legacy match upgraded in place'; END IF;
 v=public.online_duel_command(f.a,'create',jsonb_build_object('requestId',gen_random_uuid(),'timingVersion',2));
 m=(v->>'id')::uuid;
 IF v->>'answerSeconds'<>'20' OR v->'questions'<>'[]'::jsonb OR v->'review'<>'[]'::jsonb THEN RAISE EXCEPTION 'New match settings/privacy wrong: %',v; END IF;
 PERFORM public.online_duel_command(f.b,'join',jsonb_build_object('token',v->>'inviteToken'));
 v=public.online_duel_command(f.a,'start',jsonb_build_object('matchId',m,'timingVersion',2));
 SELECT id INTO s FROM quiz_private.quiz_sessions WHERE match_id=m AND player_id=f.a;
 IF extract(epoch FROM ((v->>'deadline')::timestamptz-(v->>'questionOpenedAt')::timestamptz))<>20 THEN RAISE EXCEPTION 'Async deadline differs from UI'; END IF;
 v=public.online_duel_command(f.a,'get',jsonb_build_object('matchId',m));
 IF v->>'error'<>'UPDATE_REQUIRED' THEN RAISE EXCEPTION 'Old client can silently play timed match without countdown'; END IF;
 -- 19 seconds is accepted; matching request retry cannot add a second answer.
 UPDATE quiz_private.quiz_sessions SET question_opened_at=clock_timestamp()-interval '19 seconds' WHERE id=s;
 option=(SELECT question_set#>>'{0,options,0,id}' FROM quiz_private.matches WHERE id=m);request=gen_random_uuid();
 v=public.online_duel_command(f.a,'answer',jsonb_build_object('matchId',m,'timingVersion',2,'position',1,'optionId',option,'requestId',request));
 IF v ? 'error' OR jsonb_array_length(v->'answers')<>1 THEN RAISE EXCEPTION '19s answer rejected: %',v; END IF;
 v=public.online_duel_command(f.a,'answer',jsonb_build_object('matchId',m,'timingVersion',2,'position',1,'optionId',option,'requestId',request));
 IF jsonb_array_length(v->'answers')<>1 THEN RAISE EXCEPTION 'Duplicate answer recorded'; END IF;
 UPDATE quiz_private.quiz_sessions SET question_opened_at=clock_timestamp()-interval '20.1 seconds' WHERE id=s;
 v=public.online_duel_command(f.a,'answer',jsonb_build_object('matchId',m,'timingVersion',2,'position',2,'optionId','a','requestId',gen_random_uuid()));
 IF v->>'error'<>'ANSWER_LATE' THEN RAISE EXCEPTION 'Late answer accepted'; END IF;
 v=public.online_duel_command(f.a,'get',jsonb_build_object('matchId',m,'timingVersion',2));
 IF v#>>'{answers,1,timedOut}'<>'true' OR v#>'{answers,1,optionId}'<>'null'::jsonb OR jsonb_array_length(v->'answers')<>2 THEN RAISE EXCEPTION 'Timeout not recorded safely'; END IF;
 IF v->'review'<>'[]'::jsonb THEN RAISE EXCEPTION 'Early answer key leak'; END IF;
 v=public.online_duel_command(f.a,'expire',jsonb_build_object('matchId',m,'timingVersion',2,'position',3,'requestId',gen_random_uuid()));
 IF v->>'error'<>'ANSWER_NOT_DUE' THEN RAISE EXCEPTION 'Early expiry accepted'; END IF;
 -- New live room authoritative answer/reveal/deadline boundaries.
 manifest=quiz_private.live_manifest('bank-v73','mixed','easy',5);
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,start_at,manifest,set_hash,question_count,phase,position)
 VALUES('TIMEB2',f.a,gen_random_uuid(),'bank-v73','playing',clock_timestamp()-interval '19 seconds',manifest,'timing-synthetic',5,'answer',1) RETURNING id INTO r;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(r,f.a,true),(r,f.b,true);
 v=quiz_private.live_view(f.a,r);
 IF v#>>'{settings,seconds}'<>'20' OR v->'review'<>'null'::jsonb THEN RAISE EXCEPTION '20s live or privacy broken'; END IF;
 v=public.live_room_command(f.a,'room_answer',jsonb_build_object('roomId',r,'position',1,'optionId',manifest#>>'{0,options,0,id}','requestId',gen_random_uuid()));
 IF v ? 'error' THEN RAISE EXCEPTION 'Live answer at 19s rejected: %',v; END IF;
 -- Separate room created just beyond the boundary, including second player.
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,start_at,manifest,set_hash,question_count,phase,position)
 VALUES('TIMEC2',f.a,gen_random_uuid(),'bank-v73','playing',clock_timestamp()-interval '20.1 seconds',manifest,'timing-synthetic',5,'answer',1) RETURNING id INTO r;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(r,f.a,true),(r,f.b,true);
 v=public.live_room_command(f.b,'room_answer',jsonb_build_object('roomId',r,'position',1,'optionId',manifest#>>'{0,options,0,id}','requestId',gen_random_uuid()));
 IF v->>'error'<>'ANSWER_LATE' THEN RAISE EXCEPTION 'Live late answer accepted'; END IF;
 v=quiz_private.live_view(f.b,r);
 IF v->>'phase'<>'reveal' OR extract(epoch FROM ((v->>'nextAt')::timestamptz-(v->>'deadline')::timestamptz))<>5 THEN RAISE EXCEPTION 'Live reveal interval changed'; END IF;
 BEGIN UPDATE quiz_private.live_rooms SET answer_seconds=10 WHERE id=r; RAISE EXCEPTION 'TEST room mutation accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST room mutation accepted' THEN RAISE;END IF; END;
 BEGIN UPDATE quiz_private.matches SET answer_seconds=NULL WHERE id=m; RAISE EXCEPTION 'TEST match mutation accepted'; EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST match mutation accepted' THEN RAISE;END IF; END;
 IF has_function_privilege('authenticated','public.online_duel_command(uuid,text,jsonb)','EXECUTE') OR has_table_privilege('anon','quiz_private.quiz_answer_keys','SELECT') THEN RAISE EXCEPTION 'Privilege boundary changed'; END IF;
 RAISE NOTICE 'PASS 20s new live/async, old timing unchanged, 19s accepted, late rejected, idempotency, timeout progression, 5s reveal, private answer keys and frozen timing';
END $$;
ROLLBACK;
