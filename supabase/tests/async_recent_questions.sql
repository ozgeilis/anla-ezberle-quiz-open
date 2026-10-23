-- Test async duet question rotation against the standard 20-question synthetic seed.
-- Requires all migrations through 20261021000700 and a local seeded database.
BEGIN;
DO $$
DECLARE actor_id uuid=gen_random_uuid();
  first_manifest jsonb;
  second_manifest jsonb;
  first_ids text[];
  second_ids text[];
  match_id uuid;
  session_id uuid;
BEGIN
  IF (SELECT count(DISTINCT id) FROM quiz_private.quiz_questions
      WHERE content_scope='synthetic_test')<>20 THEN
     RAISE EXCEPTION 'Synthetic question fixture should contain 20 unique IDs';
  END IF;
  INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous)
  VALUES(actor_id,'authenticated','authenticated','async-'||actor_id||'@example.test',now(),false);
  INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled)
  VALUES(actor_id,'Async History',true);

  first_manifest=quiz_private.async_manifest_recent('synthetic_test',actor_id);
  IF jsonb_array_length(first_manifest)<>10 THEN RAISE EXCEPTION 'First manifest invalid';END IF;
  SELECT array_agg(q.value->>'id') INTO first_ids FROM jsonb_array_elements(first_manifest) q(value);
  INSERT INTO quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash,content_scope)
  VALUES(actor_id,gen_random_uuid(),first_manifest,
     encode(extensions.digest(first_manifest::text,'sha256'),'hex'),
     extensions.digest('async-test-fixture','sha256'),'synthetic_test') RETURNING id INTO match_id;
  INSERT INTO quiz_private.quiz_sessions(match_id,player_id) VALUES(match_id,actor_id) RETURNING id INTO session_id;
  INSERT INTO quiz_private.match_players(match_id,slot,player_id,session_id)
  VALUES(match_id,'a',actor_id,session_id);

  second_manifest=quiz_private.async_manifest_recent('synthetic_test',actor_id);
  SELECT array_agg(q.value->>'id') INTO second_ids FROM jsonb_array_elements(second_manifest) q(value);
  IF cardinality(second_ids)<>10 OR first_ids && second_ids THEN
    RAISE EXCEPTION 'Second async round repeated one of the first ten IDs despite 20-question pool';
  END IF;
  IF has_function_privilege('authenticated','quiz_private.async_manifest_recent(text,uuid)','EXECUTE') THEN
    RAISE EXCEPTION 'Private async question selector leaked';
  END IF;
  RAISE NOTICE 'PASS second 10-question async duel uses the other 10 synthetic questions';
END $$;
ROLLBACK;
