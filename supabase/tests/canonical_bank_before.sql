-- LOCAL FIXTURE ONLY. Persistent baseline used across staged import connections.
CREATE TABLE quiz_private.v72_test_state(key text PRIMARY KEY,value jsonb NOT NULL);
DO $$
DECLARE a uuid=gen_random_uuid();b uuid=gen_random_uuid();c uuid=gen_random_uuid();u uuid;m jsonb;v jsonb;rid uuid;code text;opt text;i integer;
BEGIN
 FOREACH u IN ARRAY ARRAY[a,b,c] LOOP
 INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous) VALUES(u,'authenticated','authenticated',u||'@example.test',now(),false);
 INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled,username) VALUES(u,'Fixture Player',true,'test_'||substr(replace(u::text,'-',''),1,14));
 END LOOP;
 INSERT INTO quiz_private.v72_test_state VALUES('actors',jsonb_build_array(a,b,c));
 m=public.online_duel_command(a,'create',jsonb_build_object('requestId',gen_random_uuid()));
 v=public.online_duel_command(b,'join',jsonb_build_object('token',m->>'inviteToken'));
 FOREACH u IN ARRAY ARRAY[a,b] LOOP
 v=public.online_duel_command(u,'start',jsonb_build_object('matchId',m->>'id'));
 FOR i IN 1..10 LOOP
 SELECT k.correct_option_id INTO opt FROM quiz_private.matches x CROSS JOIN LATERAL jsonb_array_elements(x.question_set) WITH ORDINALITY q(value,n) JOIN quiz_private.quiz_answer_keys k ON k.question_id=q.value->>'id' AND k.question_version=(q.value->>'version')::integer WHERE x.id=(m->>'id')::uuid AND q.n=i;
 v=public.online_duel_command(u,'answer',jsonb_build_object('matchId',m->>'id','position',i,'optionId',opt,'requestId',gen_random_uuid()));
 END LOOP; END LOOP;
 IF v->>'state'<>'completed' THEN RAISE EXCEPTION 'Historical match fixture incomplete';END IF;
 INSERT INTO quiz_private.v72_test_state VALUES('completed',m->'id');
 m=public.online_duel_command(a,'create',jsonb_build_object('requestId',gen_random_uuid()));
 v=public.online_duel_command(b,'join',jsonb_build_object('token',m->>'inviteToken'));
 INSERT INTO quiz_private.v72_test_state VALUES('pending',m->'id');
 m=public.live_room_command(a,'room_create',jsonb_build_object('requestId',gen_random_uuid()));rid=(m->>'id')::uuid;code=m->>'code';
 v=public.live_room_command(b,'room_join',jsonb_build_object('code',code));
 INSERT INTO quiz_private.v72_test_state VALUES('room',to_jsonb(rid));
 INSERT INTO quiz_private.v72_test_state VALUES('old_matches',(SELECT jsonb_agg(to_jsonb(x) ORDER BY id) FROM quiz_private.matches x));
 INSERT INTO quiz_private.v72_test_state VALUES('old_ledger',(SELECT jsonb_agg(to_jsonb(x) ORDER BY player_id) FROM quiz_private.score_ledger x));
 INSERT INTO quiz_private.v72_test_state VALUES('old_rooms',(SELECT jsonb_agg(to_jsonb(x) ORDER BY id) FROM quiz_private.live_rooms x));
 INSERT INTO quiz_private.v72_test_state VALUES('old_keys',(SELECT jsonb_agg(to_jsonb(x) ORDER BY question_id,question_version) FROM quiz_private.quiz_answer_keys x));
 INSERT INTO quiz_private.v72_test_state VALUES('other_profile',(SELECT to_jsonb(x) FROM quiz_private.player_profiles x WHERE id=c));
END $$;
