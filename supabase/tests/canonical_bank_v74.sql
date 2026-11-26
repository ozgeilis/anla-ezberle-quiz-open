-- Isolated local fixture only: never a hosted SQL test runner.
BEGIN;
DO $$
DECLARE before_keys text; before_members text; manifest jsonb; a uuid; b uuid; u uuid; pending jsonb; reply jsonb; i integer; opt text;
BEGIN
 SELECT md5(string_agg(to_jsonb(k)::text,',' ORDER BY k.question_id,k.question_version))
 INTO before_keys FROM quiz_private.quiz_answer_keys k JOIN quiz_private.online_bank_members m
 ON m.id=k.question_id AND m.version=k.question_version WHERE m.dataset='bank-v73';
 SELECT md5(string_agg(to_jsonb(m)::text,',' ORDER BY m.id)) INTO before_members
 FROM quiz_private.online_bank_members m WHERE m.dataset='bank-v73';
 PERFORM quiz_private.validate_online_bank('bank-v73');
 PERFORM quiz_private.validate_online_bank('bank-v74');
 IF (SELECT count(*) FROM quiz_private.online_bank_members WHERE dataset='bank-v74')<>3000
 OR (SELECT count(*) FROM quiz_private.live_questions WHERE dataset='bank-v74')<>3000
 OR (SELECT count(*) FROM quiz_private.live_keys WHERE dataset='bank-v74')<>3000
 THEN RAISE EXCEPTION 'Wrong v74 count';END IF;
 UPDATE quiz_private.bank_release_approval SET content_approved=true WHERE dataset IN('bank-v73','bank-v74');
 UPDATE quiz_private.online_content_config SET active_scope='bank-v73';
 SELECT (value->>0)::uuid,(value->>1)::uuid INTO a,b FROM quiz_private.v72_test_state WHERE key='actors';
 manifest=quiz_private.async_manifest_recent('bank-v73',a);
 pending=public.online_duel_command(a,'create',jsonb_build_object('requestId',gen_random_uuid()));
 reply=public.online_duel_command(b,'join',jsonb_build_object('token',pending->>'inviteToken'));
 UPDATE quiz_private.online_content_config SET active_scope='bank-v74';
 FOREACH u IN ARRAY ARRAY[a,b] LOOP
  reply=public.online_duel_command(u,'start',jsonb_build_object('matchId',pending->>'id'));
  FOR i IN 1..10 LOOP
   SELECT k.correct_option_id INTO opt FROM quiz_private.matches m
   CROSS JOIN LATERAL jsonb_array_elements(m.question_set) WITH ORDINALITY item(value,n)
   JOIN quiz_private.quiz_answer_keys k ON k.question_id=item.value->>'id' AND k.question_version=(item.value->>'version')::integer
   WHERE m.id=(pending->>'id')::uuid AND item.n=i;
   reply=public.online_duel_command(u,'answer',jsonb_build_object('matchId',pending->>'id','position',i,'optionId',opt,'requestId',gen_random_uuid()));
  END LOOP;
 END LOOP;
 IF reply->>'scope'<>'bank-v73' OR reply->>'state'<>'completed' OR reply->'players'->0->>'score'<>'1000'
 THEN RAISE EXCEPTION 'In-progress v73 match failed after v74 cutover';END IF;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(manifest) q WHERE NOT EXISTS(
  SELECT 1 FROM quiz_private.quiz_questions old WHERE old.id=q->>'id' AND old.version=(q->>'version')::integer
  AND old.prompt=q->>'prompt' AND old.options=q->'options'))
 THEN RAISE EXCEPTION 'Saved v73 manifest no longer matches old immutable rows'; END IF;
 IF before_keys IS DISTINCT FROM (SELECT md5(string_agg(to_jsonb(k)::text,',' ORDER BY k.question_id,k.question_version))
 FROM quiz_private.quiz_answer_keys k JOIN quiz_private.online_bank_members m
 ON m.id=k.question_id AND m.version=k.question_version WHERE m.dataset='bank-v73')
 OR before_members IS DISTINCT FROM (SELECT md5(string_agg(to_jsonb(m)::text,',' ORDER BY m.id))
 FROM quiz_private.online_bank_members m WHERE m.dataset='bank-v73')
 THEN RAISE EXCEPTION 'v73 keys or membership changed';END IF;
 IF (SELECT count(*) FROM quiz_private.online_bank_members WHERE dataset='bank-v74' AND id LIKE 'new74-%')<>1500
 OR EXISTS(SELECT 1 FROM quiz_private.online_bank_members WHERE dataset='bank-v74' AND id LIKE 'new74-%' GROUP BY metadata->>'categoryId' HAVING count(*)<>375)
 THEN RAISE EXCEPTION 'Wrong v74 additions or category quota';END IF;
 IF EXISTS(SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
 WHERE n.nspname='quiz_private' AND c.relname IN('online_bank_members','bank_release_approval')
 AND (NOT c.relrowsecurity OR NOT c.relforcerowsecurity OR has_table_privilege('anon',c.oid,'SELECT') OR has_table_privilege('authenticated',c.oid,'SELECT')))
 THEN RAISE EXCEPTION 'v74 private bank ACL/RLS weakened'; END IF;
 RAISE NOTICE 'PASS v74 exact count/key, v73 immutable manifest/key/member retention, reversible new-game switch and private ACL';
END $$;
ROLLBACK;
