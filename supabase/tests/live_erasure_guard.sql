-- Isolated local fixture only. No hosted accounts or records are used.
BEGIN;
-- The schema-only harness owns tables as supabase_admin; production uses postgres.
-- Match the production erasure role inside this rolled-back fixture only.
GRANT SELECT,UPDATE ON quiz_private.live_rooms TO postgres;
SET LOCAL statement_timeout='30s';
DO $$
DECLARE a uuid=gen_random_uuid();b uuid=gen_random_uuid();own_room uuid;other_room uuid;active_room uuid;
BEGIN
 INSERT INTO auth.users(id,aud,role,email,email_confirmed_at,is_anonymous) VALUES
 (a,'authenticated','authenticated','guard-a-'||a||'@example.invalid',now(),false),
 (b,'authenticated','authenticated','guard-b-'||b||'@example.invalid',now(),false);
 INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled) VALUES(a,'Synthetic Guard A',true),(b,'Synthetic Guard B',true);
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,phase,manifest,set_hash)
 VALUES('GUARDA',a,gen_random_uuid(),'bank-v41','completed','completed','[{"id":"synthetic-guard"}]','synthetic-guard') RETURNING id INTO own_room;
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,phase)
 VALUES('GUARDB',b,gen_random_uuid(),'bank-v41','completed','completed') RETURNING id INTO other_room;
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,phase,start_at,manifest,set_hash)
 VALUES('GUARDC',a,gen_random_uuid(),'bank-v41','playing','answer',clock_timestamp(),'[{"id":"synthetic-guard"}]','synthetic-guard') RETURNING id INTO active_room;
 PERFORM set_config('anla.fixture_guard_actor',a::text,true);
 PERFORM set_config('anla.fixture_guard_other',b::text,true);
 PERFORM set_config('anla.fixture_guard_own_room',own_room::text,true);
 PERFORM set_config('anla.fixture_guard_other_room',other_room::text,true);
 PERFORM set_config('anla.fixture_guard_active_room',active_room::text,true);
END $$;
SET LOCAL ROLE postgres;
DO $$
DECLARE a uuid=current_setting('anla.fixture_guard_actor')::uuid;b uuid=current_setting('anla.fixture_guard_other')::uuid;
own_room uuid=current_setting('anla.fixture_guard_own_room')::uuid;other_room uuid=current_setting('anla.fixture_guard_other_room')::uuid;
active_room uuid=current_setting('anla.fixture_guard_active_room')::uuid;original jsonb;
BEGIN
 PERFORM set_config('anla.erasing_actor',a::text,true);

 BEGIN UPDATE quiz_private.live_rooms SET manifest='[{"id":"changed"}]' WHERE id=own_room;RAISE EXCEPTION 'TEST erasure bypass changed manifest';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST erasure bypass changed manifest' THEN RAISE;END IF;END;
 BEGIN UPDATE quiz_private.live_rooms SET answer_seconds=15 WHERE id=own_room;RAISE EXCEPTION 'TEST erasure bypass changed timing';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST erasure bypass changed timing' THEN RAISE;END IF;END;
 BEGIN UPDATE quiz_private.live_rooms SET host_id=NULL WHERE id=other_room;RAISE EXCEPTION 'TEST erasure bypass anonymized another host';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST erasure bypass anonymized another host' THEN RAISE;END IF;END;
 BEGIN UPDATE quiz_private.live_rooms SET state='playing',phase='answer' WHERE id=own_room;RAISE EXCEPTION 'TEST erasure bypass reopened terminal room';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST erasure bypass reopened terminal room' THEN RAISE;END IF;END;

 SELECT to_jsonb(r) INTO original FROM quiz_private.live_rooms r WHERE id=own_room;
 UPDATE quiz_private.live_rooms SET host_id=NULL WHERE id=own_room;
 IF (SELECT to_jsonb(r)-'host_id' FROM quiz_private.live_rooms r WHERE id=own_room) IS DISTINCT FROM original-'host_id' THEN RAISE EXCEPTION 'Anonymization changed shared history';END IF;
 SELECT to_jsonb(r) INTO original FROM quiz_private.live_rooms r WHERE id=active_room;
 UPDATE quiz_private.live_rooms SET host_id=NULL,state='cancelled',phase='cancelled',revision=revision+1 WHERE id=active_room;
 IF (SELECT to_jsonb(r)-ARRAY['host_id','state','phase','revision'] FROM quiz_private.live_rooms r WHERE id=active_room) IS DISTINCT FROM original-ARRAY['host_id','state','phase','revision'] THEN RAISE EXCEPTION 'Cancellation changed shared history or timer';END IF;
 IF NOT EXISTS(SELECT 1 FROM quiz_private.live_rooms WHERE id=other_room AND host_id=b AND state='completed') THEN RAISE EXCEPTION 'Other player room changed';END IF;
 PERFORM set_config('anla.erasing_actor','',true);
 BEGIN UPDATE quiz_private.live_rooms SET host_id=b WHERE id=own_room;RAISE EXCEPTION 'TEST terminal mutation without erasure allowed';EXCEPTION WHEN raise_exception THEN IF SQLERRM='TEST terminal mutation without erasure allowed' THEN RAISE;END IF;END;
 RAISE NOTICE 'PASS erasure only anonymizes its actor/cancels active rooms; terminal manifests, timing, shared history and other hosts stay immutable';
END $$;
ROLLBACK;
