-- Local-only acceptance: no production SQL runner is used by this test.
BEGIN;
DO $$
DECLARE a uuid;b uuid;c uuid;m jsonb;v jsonb;r jsonb;rid uuid;code text;u uuid;i integer;opt text;ids text[];used text[];q record;p record;initial_ids text[];n integer;
BEGIN
 SELECT (value->>0)::uuid,(value->>1)::uuid,(value->>2)::uuid INTO a,b,c FROM quiz_private.v72_test_state WHERE key='actors';
 IF (SELECT active_scope FROM quiz_private.online_content_config)<>'owner_approved_v13' OR (SELECT dataset FROM quiz_private.live_config)<>'bank-v41' THEN RAISE EXCEPTION 'Staging activated bank';END IF;
 IF (SELECT value FROM quiz_private.v72_test_state WHERE key='old_matches') IS DISTINCT FROM (SELECT jsonb_agg(to_jsonb(x) ORDER BY id) FROM quiz_private.matches x)
 OR (SELECT value FROM quiz_private.v72_test_state WHERE key='old_rooms') IS DISTINCT FROM (SELECT jsonb_agg(to_jsonb(x) ORDER BY id) FROM quiz_private.live_rooms x)
 OR (SELECT value FROM quiz_private.v72_test_state WHERE key='old_ledger') IS DISTINCT FROM (SELECT jsonb_agg(to_jsonb(x) ORDER BY player_id) FROM quiz_private.score_ledger x)
 THEN RAISE EXCEPTION 'Historical games changed';END IF;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements((SELECT value FROM quiz_private.v72_test_state WHERE key='old_keys')) old WHERE NOT EXISTS(SELECT 1 FROM quiz_private.quiz_answer_keys k WHERE to_jsonb(k)=old)) THEN RAISE EXCEPTION 'Historical keys changed';END IF;
 RAISE NOTICE 'PASS inactive staging and immutable old matches, lobbies, ledger and answer keys';
 PERFORM quiz_private.validate_online_bank('bank-v72');PERFORM quiz_private.live_validate_dataset('bank-v72');PERFORM quiz_private.live_validate_dataset('bank-v41');
 BEGIN UPDATE quiz_private.online_content_config SET active_scope='bank-v72';RAISE EXCEPTION 'TEST bypass';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST bypass' THEN RAISE;END IF;END;
 BEGIN UPDATE quiz_private.live_config SET dataset='bank-v72';RAISE EXCEPTION 'TEST bypass';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST bypass' THEN RAISE;END IF;END;
 RAISE NOTICE 'PASS both activation switches reject missing independent content approval';
 -- This approval exists only within the isolated fixture transaction and rolls back.
 UPDATE quiz_private.bank_release_approval SET content_approved=true;
 UPDATE quiz_private.online_content_config SET active_scope='bank-v72';
 UPDATE quiz_private.live_config SET dataset='bank-v72';
 FOR p IN SELECT * FROM quiz_private.live_pools WHERE dataset='bank-v72' LOOP
  v=quiz_private.live_manifest_recent('bank-v72',p.topic,p.level,p.question_count,ARRAY[a,b]);
  IF jsonb_array_length(p.sample)=0 THEN IF v IS NOT NULL THEN RAISE EXCEPTION 'Sparse pool widened';END IF;CONTINUE;END IF;
  IF jsonb_array_length(v)<>p.question_count THEN RAISE EXCEPTION 'Wrong manifest size';END IF;
  used='{}';
  FOR q IN SELECT l.* FROM quiz_private.live_questions l JOIN jsonb_array_elements(v) j ON j->>'id'=l.id WHERE dataset='bank-v72' LOOP
   IF used && q.concept_keys OR (p.topic<>'mixed' AND q.topic<>p.topic) OR (p.quotas->>q.difficulty)::integer=0 THEN RAISE EXCEPTION 'Invalid pool selection';END IF;
   used=used||q.concept_keys;
  END LOOP;
  IF v::text ~ 'correctOptionId|explanation|sources|concept_keys' THEN RAISE EXCEPTION 'Live pre-reveal leak';END IF;
 END LOOP;
 RAISE NOTICE 'PASS all 264 pool combinations: exact topic, difficulty, independent concepts, no pre-reveal keys';
 m=public.online_duel_command(a,'create',jsonb_build_object('requestId',gen_random_uuid()));
 IF m->>'scope'<>'bank-v72' THEN RAISE EXCEPTION 'Async old bank used';END IF;
 v=public.online_duel_command(b,'join',jsonb_build_object('token',m->>'inviteToken'));
 FOREACH u IN ARRAY ARRAY[a,b] LOOP
  v=public.online_duel_command(u,'start',jsonb_build_object('matchId',m->>'id'));
  IF u=a THEN
   IF v::text ~ 'correctOptionId|explanation|correct_option_id' THEN RAISE EXCEPTION 'Async pre-reveal leak';END IF;
   SELECT array_agg(item->>'id') INTO initial_ids FROM jsonb_array_elements(v->'questions') item;
   used='{}';FOR q IN SELECT * FROM quiz_private.online_bank_members WHERE dataset='bank-v72' AND id=ANY(initial_ids) LOOP
    IF used && q.concept_keys THEN RAISE EXCEPTION 'Async concept collision';END IF;used=used||q.concept_keys;
   END LOOP;
  END IF;
  FOR i IN 1..10 LOOP
   SELECT k.correct_option_id INTO opt FROM quiz_private.matches x CROSS JOIN LATERAL jsonb_array_elements(x.question_set) WITH ORDINALITY item(value,n) JOIN quiz_private.quiz_answer_keys k ON k.question_id=item.value->>'id' AND k.question_version=(item.value->>'version')::integer WHERE x.id=(m->>'id')::uuid AND item.n=i;
   v=public.online_duel_command(u,'answer',jsonb_build_object('matchId',m->>'id','position',i,'optionId',opt,'requestId',gen_random_uuid()));
  END LOOP;
 END LOOP;
 IF v->>'state'<>'completed' OR v->'players'->0->>'score'<>'1000' OR jsonb_array_length(v->'review')<>10 THEN RAISE EXCEPTION 'Canonical async scoring/reveal failed';END IF;
 SELECT array_agg(item->>'id') INTO ids FROM jsonb_array_elements(quiz_private.async_manifest_recent('bank-v72',a)) item;
 IF ids && initial_ids THEN RAISE EXCEPTION 'Recent async questions repeated';END IF;
 RAISE NOTICE 'PASS two-player async create/join/start/answer/server-score/review and recent exclusion';
 UPDATE quiz_private.player_profiles SET discoverable=true WHERE id=b;
 r=public.player_matchmaking_command(a,'challenge_send',jsonb_build_object('playerId',b,'requestId',gen_random_uuid()));
 r=public.player_matchmaking_command(b,'challenge_reply',jsonb_build_object('challengeId',r#>>'{challenge,id}','action','accept'));
 IF NOT EXISTS(SELECT 1 FROM quiz_private.direct_challenges d JOIN quiz_private.matches x ON x.id=d.match_id WHERE d.sender=a AND d.recipient=b AND d.state='accepted' AND x.content_scope='bank-v72') THEN RAISE EXCEPTION 'Friend duel did not use canonical bank';END IF;
 RAISE NOTICE 'PASS accepted friend challenge creates pinned canonical v72 match';

 r=public.live_room_command(a,'room_create',jsonb_build_object('requestId',gen_random_uuid()));rid=(r->>'id')::uuid;code=r->>'code';
 v=public.live_room_command(b,'room_join',jsonb_build_object('code',code));
 v=public.live_room_command(a,'room_settings',jsonb_build_object('roomId',rid,'topic','mixed','level','easy','count',5));
 v=public.live_room_command(a,'room_ready',jsonb_build_object('roomId',rid,'ready',true));
 v=public.live_room_command(b,'room_ready',jsonb_build_object('roomId',rid,'ready',true));
 v=public.live_room_command(a,'room_start',jsonb_build_object('roomId',rid));
 IF NOT EXISTS(SELECT 1 FROM quiz_private.live_rooms WHERE id=rid AND dataset='bank-v72' AND answer_seconds=10 AND jsonb_array_length(manifest)=5) THEN RAISE EXCEPTION 'New live room not on canonical bank';END IF;
 IF v::text ~ 'correctOptionId|explanation|sources' THEN RAISE EXCEPTION 'New room key leak';END IF;
 r=public.live_room_command(c,'room_get',jsonb_build_object('roomId',rid));IF NOT(r ? 'error') THEN RAISE EXCEPTION 'Foreign user read room';END IF;

 -- A real server answer against v72 uses the private key, never a client score.
 SELECT manifest INTO r FROM quiz_private.live_rooms WHERE id=rid;
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,question_count,state,start_at,manifest,set_hash,phase,position)
 VALUES('VSECA2',a,gen_random_uuid(),'bank-v72',5,'playing',clock_timestamp()-interval '1 second',r,'v72-active-answer','answer',1) RETURNING id INTO rid;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(rid,a,true),(rid,b,true);
 SELECT correct_option INTO opt FROM quiz_private.live_keys WHERE dataset='bank-v72' AND id=r->0->>'id';
 v=public.live_room_command(a,'room_answer',jsonb_build_object('roomId',rid,'position',1,'optionId',opt,'requestId',gen_random_uuid()));
 IF NOT EXISTS(SELECT 1 FROM quiz_private.live_answers WHERE room_id=rid AND player_id=a AND is_correct) THEN RAISE EXCEPTION 'V72 server answer incorrect';END IF;
 IF v::text ~ 'correctOptionId|explanation|sources' THEN RAISE EXCEPTION 'Answer phase key leak';END IF;
 -- Fixture with an elapsed immutable clock verifies timeout completion/review.
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,question_count,state,start_at,manifest,set_hash,phase,position)
 VALUES('VSECB2',a,gen_random_uuid(),'bank-v72',5,'playing',clock_timestamp()-interval '76 seconds',r,'v72-completion','answer',1) RETURNING id INTO rid;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(rid,a,true),(rid,b,true);
 PERFORM quiz_private.live_advance(rid);
 v=quiz_private.live_view(a,rid);
 IF v->>'state'<>'completed' OR jsonb_array_length(v->'history')<>5 OR NOT EXISTS(SELECT 1 FROM quiz_private.live_rewards WHERE room_id=rid AND player_id=a AND correct=0 AND unanswered=5) THEN RAISE EXCEPTION 'V72 timeout completion/review invalid';END IF;
 RAISE NOTICE 'PASS v72 live server grading, answer privacy, timeout completion and final review';
 -- A pending old duel must still finish against its original keys after cutover.
 SELECT (value#>>'{}')::uuid INTO rid FROM quiz_private.v72_test_state WHERE key='pending';
 FOREACH u IN ARRAY ARRAY[a,b] LOOP
  v=public.online_duel_command(u,'start',jsonb_build_object('matchId',rid));
  FOR i IN 1..10 LOOP
   SELECT k.correct_option_id INTO opt FROM quiz_private.matches x CROSS JOIN LATERAL jsonb_array_elements(x.question_set) WITH ORDINALITY item(value,n) JOIN quiz_private.quiz_answer_keys k ON k.question_id=item.value->>'id' AND k.question_version=(item.value->>'version')::integer WHERE x.id=rid AND item.n=i;
   v=public.online_duel_command(u,'answer',jsonb_build_object('matchId',rid,'position',i,'optionId',opt,'requestId',gen_random_uuid()));
  END LOOP;
 END LOOP;
 IF v->>'scope'<>'owner_approved_v13' OR v->>'state'<>'completed' OR v->'players'->0->>'score'<>'1000' THEN RAISE EXCEPTION 'Pending historical duel failed after cutover';END IF;
 RAISE NOTICE 'PASS pending historical v13 duel completes after v72 activation with original server keys';
 -- Old lobby stays pinned even if its host starts after activation.
 SELECT (value#>>'{}')::uuid INTO rid FROM quiz_private.v72_test_state WHERE key='room';
 IF (SELECT dataset FROM quiz_private.live_rooms WHERE id=rid)<>'bank-v41' THEN RAISE EXCEPTION 'Old room retagged';END IF;
 v=public.live_room_command(a,'room_settings',jsonb_build_object('roomId',rid,'topic','mixed','level','easy','count',5));
 v=public.live_room_command(a,'room_ready',jsonb_build_object('roomId',rid,'ready',true));
 v=public.live_room_command(b,'room_ready',jsonb_build_object('roomId',rid,'ready',true));
 v=public.live_room_command(a,'room_start',jsonb_build_object('roomId',rid));
 IF NOT EXISTS(SELECT 1 FROM quiz_private.live_rooms WHERE id=rid AND dataset='bank-v41' AND jsonb_array_length(manifest)=5) THEN RAISE EXCEPTION 'Old lobby cannot start after activation';END IF;
 RAISE NOTICE 'PASS historical v41 lobby starts after activation on its original dataset';

 UPDATE quiz_private.online_content_config SET active_scope='owner_approved_v13';
 UPDATE quiz_private.live_config SET dataset='bank-v41';
 v=public.online_duel_command(a,'get',jsonb_build_object('matchId',m->>'id'));IF v->>'scope'<>'bank-v72' OR v->>'state'<>'completed' THEN RAISE EXCEPTION 'Rollback corrupted new match';END IF;
 IF (SELECT value FROM quiz_private.v72_test_state WHERE key='other_profile') IS DISTINCT FROM (SELECT to_jsonb(x) FROM quiz_private.player_profiles x WHERE id=c) THEN RAISE EXCEPTION 'Other player profile changed';END IF;
 IF has_table_privilege('authenticated','quiz_private.online_bank_members','SELECT') OR has_table_privilege('anon','quiz_private.quiz_answer_keys','SELECT') OR has_function_privilege('authenticated','quiz_private.validate_online_bank(text)','EXECUTE') THEN RAISE EXCEPTION 'Private bank ACL leak';END IF;
 RAISE NOTICE 'PASS live host/join/ready/start, 10-second rule, old-room pinning, rollback, unrelated player preservation and ACL';
END $$;
ROLLBACK;
