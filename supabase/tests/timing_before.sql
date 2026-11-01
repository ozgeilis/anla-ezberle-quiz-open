-- Run only in the throwaway local database, BEFORE the forward migration.
CREATE TABLE quiz_private.timing_test_fixtures(a uuid,b uuid,legacy_match uuid,legacy_room uuid);
DO $$ DECLARE a uuid=gen_random_uuid();b uuid=gen_random_uuid();v jsonb;r uuid; BEGIN
 INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous)
 SELECT id,'authenticated','authenticated','timing-'||id||'@example.invalid',now(),false FROM unnest(ARRAY[a,b]) id;
 INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled,username)
 SELECT id,'Synthetic Timing',true,'timing_'||substr(replace(id::text,'-',''),1,12) FROM unnest(ARRAY[a,b]) id;
 v=public.online_duel_command(a,'create',jsonb_build_object('requestId',gen_random_uuid()));
 IF v ? 'error' THEN RAISE EXCEPTION 'Fixture create failed: %',v; END IF;
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset) VALUES('TIMEA2',a,gen_random_uuid(),'bank-v73') RETURNING id INTO r;
 INSERT INTO quiz_private.timing_test_fixtures VALUES(a,b,(v->>'id')::uuid,r);
END $$;
