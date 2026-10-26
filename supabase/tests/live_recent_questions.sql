-- Supabase local acceptance: history-aware live sets; everything rolls back.
-- Run after the live-room migrations and the private bank-v41 dataset seed.
BEGIN;
DO $$
DECLARE
  player_a uuid=gen_random_uuid();
  player_b uuid=gen_random_uuid();
  selected jsonb;
  question_ids text[];
  previous_ids text[]='{}';
  room_id uuid;
  round_number integer;
  room_code text;
  fingerprint text;
BEGIN
  IF NOT EXISTS(
    SELECT 1 FROM quiz_private.live_pools
    WHERE dataset='bank-v41' AND topic='mixed' AND level='easy'
      AND question_count=5 AND jsonb_array_length(sample)=5
  ) THEN RAISE EXCEPTION 'The bank-v41 live pool must be seeded before this test'; END IF;
  INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous)
  VALUES
    (player_a,'authenticated','authenticated','history-a-'||player_a||'@example.test',now(),false),
    (player_b,'authenticated','authenticated','history-b-'||player_b||'@example.test',now(),false);
  INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled)
  VALUES (player_a,'History A',true),(player_b,'History B',true);

  FOR round_number IN 1..6 LOOP
    selected=quiz_private.live_manifest_recent('bank-v41','mixed','easy',5,ARRAY[player_a,player_b]);
    IF selected IS NULL OR jsonb_array_length(selected)<>5 THEN
      RAISE EXCEPTION 'Could not assemble live manifest for round %',round_number;
    END IF;
    SELECT array_agg(item->>'id') INTO question_ids
    FROM jsonb_array_elements(selected) AS t(item);
    IF question_ids && previous_ids THEN
      RAISE EXCEPTION 'Repeated question within the previous five rounds, round %',round_number;
    END IF;
    room_code='HIST'||chr(65+round_number)||'Q'; -- six allowed characters, no excluded 0/1 digits
    fingerprint=encode(extensions.digest(array_to_string(question_ids,'|'),'sha256'),'hex');
    INSERT INTO quiz_private.live_rooms(
      code,host_id,request_id,dataset,topic,level,question_count,
      state,phase,start_at,manifest,set_hash
    ) VALUES (
      room_code,player_a,gen_random_uuid(),'bank-v41','mixed','easy',5,
      'playing','answer',clock_timestamp(),selected,fingerprint
    ) RETURNING id INTO room_id;
    INSERT INTO quiz_private.live_members(room_id,player_id,in_round)
    VALUES(room_id,player_a,true),(room_id,player_b,true);
    previous_ids=previous_ids||question_ids;
  END LOOP;
  RAISE NOTICE 'PASS six successive multiplayer rounds contain no repeated questions';
  IF has_function_privilege('authenticated',
     'quiz_private.live_manifest_recent(text,text,text,integer,uuid[])','EXECUTE') THEN
    RAISE EXCEPTION 'Private history selector should not be callable by clients';
  END IF;
  RAISE NOTICE 'PASS history selector is unavailable to authenticated clients';
END $$;
ROLLBACK;
