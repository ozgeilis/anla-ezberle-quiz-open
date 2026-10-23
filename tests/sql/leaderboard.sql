-- Isolated synthetic identities and rewards, always rolled back. LOCAL ONLY.
BEGIN;
SET LOCAL statement_timeout='30s';
CREATE TEMP TABLE lb_people(i integer PRIMARY KEY,id uuid DEFAULT gen_random_uuid());
INSERT INTO lb_people(i) SELECT generate_series(1,65);
INSERT INTO auth.users(id,email_confirmed_at,is_anonymous) SELECT id,now(),false FROM lb_people;
INSERT INTO quiz_private.player_profiles(id,display_name,username,access_enabled,discoverable,leaderboard_opt_in) SELECT id,'Sıralama Test '||i,'rank_'||replace(id::text,'-','')::varchar(12),true,true,false FROM lb_people;
UPDATE quiz_private.leaderboard_config SET enabled=true;
CREATE TEMP TABLE lb_report(label text PRIMARY KEY);
DO $$DECLARE a uuid;r jsonb;n integer;BEGIN
 SELECT id INTO a FROM lb_people WHERE i=1;
 r=public.player_leaderboard_command(a,'leaderboard','{}');
 IF r->'entries'<>'[]'::jsonb THEN RAISE EXCEPTION 'Zero participants';END IF;
 INSERT INTO lb_report VALUES('zero players and default opt-out');
 IF (public.player_leaderboard_command(NULL,'leaderboard','{}')->>'status')::int<>400 THEN RAISE EXCEPTION 'Null actor';END IF;
 IF (public.player_leaderboard_command(gen_random_uuid(),'leaderboard','{}')->>'status')::int<>403 THEN RAISE EXCEPTION 'Unauthorized actor';END IF;
 FOR r IN SELECT public.player_leaderboard_command(a,'leaderboard',v) FROM(VALUES('{"playerId":"spoof"}'::jsonb),('{"xp":9999}'::jsonb),('{"limit":51}'::jsonb),('{"scope":"private"}'::jsonb),('{"cursor":{}}'::jsonb),('{"cursor":[]}'::jsonb),('{"limit":-1}'::jsonb),('{"limit":1.5}'::jsonb))t(v) LOOP
  IF r->>'error'<>'INVALID_REQUEST' THEN RAISE EXCEPTION 'Unvalidated payload';END IF;
 END LOOP;
 INSERT INTO lb_report VALUES('actor spoof, fake XP, cursor and size validation');
END $$;
-- Create valid terminal server reward fixtures. No public API accepts these writes.
CREATE TEMP TABLE lb_matches(i integer,match_id uuid);
WITH m AS(INSERT INTO quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash,state)
 SELECT id,gen_random_uuid(),(SELECT jsonb_agg('{}'::jsonb) FROM generate_series(1,10)),'local-leaderboard-fixture',decode(replace(gen_random_uuid()::text,'-',''),'hex'),'completed' FROM lb_people RETURNING id,creator_id)
INSERT INTO lb_matches SELECT p.i,m.id FROM m JOIN lb_people p ON p.id=m.creator_id;
INSERT INTO quiz_private.score_ledger(match_id,player_id,score,rule_version) SELECT m.match_id,p.id,CASE WHEN p.i=1 THEN 0 ELSE 500 END,1 FROM lb_people p JOIN lb_matches m USING(i);
SET CONSTRAINTS ALL IMMEDIATE;
DO $$DECLARE a uuid;b uuid;r jsonb;n integer;page2 jsonb;cur jsonb;BEGIN
 SELECT id INTO a FROM lb_people WHERE i=1;SELECT id INTO b FROM lb_people WHERE i=2;
 FOR n IN 1..3 LOOP
  UPDATE quiz_private.player_profiles SET leaderboard_opt_in=true WHERE id=(SELECT id FROM lb_people WHERE i=n);
  r=public.player_leaderboard_command(a,'leaderboard','{}');
  IF jsonb_array_length(r->'entries')<>n THEN RAISE EXCEPTION 'One/two/three players';END IF;
 END LOOP;
 IF (r->'self'->'entry'->>'rank')::int<>3 OR (r->'self'->>'xp')::int<>0 THEN RAISE EXCEPTION 'Real zero score and self rank';END IF;
 INSERT INTO lb_report VALUES('one, two, three players; zero XP remains a verified result');
 UPDATE quiz_private.player_profiles SET leaderboard_opt_in=true WHERE id IN(SELECT id FROM lb_people);
 r=public.player_leaderboard_command(a,'leaderboard','{}');cur=r->'nextCursor';
 IF jsonb_array_length(r->'entries')<>50 OR cur='null'::jsonb THEN RAISE EXCEPTION 'Page cap';END IF;
 page2=public.player_leaderboard_command(a,'leaderboard',jsonb_build_object('cursor',cur));
 IF jsonb_array_length(page2->'entries')<>15 OR (page2->'entries'->0->>'rank')::int<>51 THEN RAISE EXCEPTION 'Second page';END IF;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(r->'entries')x JOIN jsonb_array_elements(page2->'entries')y ON x->'player'->>'id'=y->'player'->>'id') THEN RAISE EXCEPTION 'Pagination overlap';END IF;
 IF (r->'self'->'entry'->>'rank')::int<>65 THEN RAISE EXCEPTION 'Off-page exact self rank';END IF;
 INSERT INTO lb_report VALUES('65 real fixtures, capped keyset pages, no overlap, exact off-page rank');
 IF EXISTS(SELECT 1 FROM(SELECT player_id,row_number() OVER(ORDER BY player_id) n FROM quiz_private.leaderboard_projection WHERE player_id IN(SELECT id FROM lb_people WHERE i>1))p JOIN jsonb_array_elements(r->'entries')e ON e->'player'->>'id'=p.player_id::text WHERE(e->>'rank')::int<>p.n) THEN RAISE EXCEPTION 'Stable UUID tie';END IF;
 INSERT INTO lb_report VALUES('equal XP and games: deterministic immutable-id tie-break');
 INSERT INTO quiz_private.friendships(sender,recipient,state) VALUES(a,b,'accepted'),(a,(SELECT id FROM lb_people WHERE i=3),'pending');
 r=public.player_leaderboard_command(a,'leaderboard','{"scope":"friends"}');
 IF jsonb_array_length(r->'entries')<>1 OR r->'entries'->0->'player'->>'id'<>b::text THEN RAISE EXCEPTION 'Accepted only';END IF;
 UPDATE quiz_private.player_profiles SET discoverable=false WHERE id=b;
 IF jsonb_array_length(public.player_leaderboard_command(a,'leaderboard','{"scope":"friends"}')->'entries')<>1 THEN RAISE EXCEPTION 'Accepted private friend visibility';END IF;
 UPDATE quiz_private.player_profiles SET leaderboard_opt_in=false WHERE id=b;
 IF public.player_leaderboard_command(a,'leaderboard','{"scope":"friends"}')->'entries'<>'[]'::jsonb THEN RAISE EXCEPTION 'Opt-out friend exposed';END IF;
 UPDATE quiz_private.player_profiles SET leaderboard_opt_in=true WHERE id=b;
 DELETE FROM quiz_private.friendships WHERE sender=a AND recipient=b;
 IF public.player_leaderboard_command(a,'leaderboard','{"scope":"friends"}')->'entries'<>'[]'::jsonb THEN RAISE EXCEPTION 'Removed friend exposed';END IF;
 INSERT INTO lb_report VALUES('accepted/pending/removed friends and independent opt-in/privacy');
 UPDATE quiz_private.player_profiles SET username=null WHERE id=(SELECT id FROM lb_people WHERE i=3);
 UPDATE quiz_private.player_profiles SET access_enabled=false WHERE id=(SELECT id FROM lb_people WHERE i=4);
 UPDATE auth.users SET email_confirmed_at=null WHERE id=(SELECT id FROM lb_people WHERE i=5);
 UPDATE auth.users SET is_anonymous=true WHERE id=(SELECT id FROM lb_people WHERE i=6);
 UPDATE auth.users SET banned_until=now()+interval '1 day' WHERE id=(SELECT id FROM lb_people WHERE i=7);
 UPDATE auth.users SET deleted_at=now() WHERE id=(SELECT id FROM lb_people WHERE i=8);
 r=public.player_leaderboard_command(a,'leaderboard','{}');
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(r->'entries')e WHERE e->'player'->>'id' IN(SELECT id::text FROM lb_people WHERE i IN(2,3,4,5,6,7,8))) THEN RAISE EXCEPTION 'Privacy/auth leak';END IF;
 INSERT INTO lb_report VALUES('undiscoverable, missing username, disabled, unconfirmed and anonymous excluded');
 IF public.player_leaderboard_command((SELECT id FROM lb_people WHERE i=5),'leaderboard','{}')->>'error'<>'SIGN_IN_REQUIRED' THEN RAISE EXCEPTION 'Unconfirmed actor';END IF;
 IF EXISTS(SELECT 1 FROM jsonb_array_elements(r->'entries')e CROSS JOIN LATERAL jsonb_object_keys(e->'player')k WHERE k NOT IN('id','name','username','avatar','xp','level','achievementsShared','badgeIds','showcase')) THEN RAISE EXCEPTION 'Private field in DTO';END IF;
 INSERT INTO lb_report VALUES('unconfirmed actor denied and strict public social DTO');
END $$;
DO $$DECLARE a uuid;mid uuid;room uuid;r jsonb;before_name text;before_avatar integer;BEGIN
 SELECT id INTO a FROM lb_people WHERE i=1;
 INSERT INTO quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash,state) VALUES(a,gen_random_uuid(),(SELECT jsonb_agg('{}'::jsonb) FROM generate_series(1,10)),'lb-2',decode(replace(gen_random_uuid()::text,'-',''),'hex'),'completed') RETURNING id INTO mid;
 INSERT INTO quiz_private.score_ledger(match_id,player_id,score,rule_version) VALUES(mid,a,500,1);
 r=public.player_leaderboard_command(a,'leaderboard','{}');
 IF(r->'self'->'entry'->>'rank')::int<>1 THEN RAISE EXCEPTION 'Completed-game tie break';END IF;
 INSERT INTO lb_report VALUES('equal XP: completed verified game count breaks tie');
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset,state,phase) VALUES('ZZ'||translate(upper(substr(replace(gen_random_uuid()::text,'-',''),1,4)),'01','XY'),a,gen_random_uuid(),'leaderboard-local-only','completed','completed') RETURNING id INTO room;
 INSERT INTO quiz_private.live_members(room_id,player_id,in_round) VALUES(room,a,true);
 INSERT INTO quiz_private.live_rewards(room_id,player_id,score,correct,wrong,unanswered,rank,won,xp,bonus,credited,set_hash) VALUES(room,a,100,1,0,9,1,true,30,20,true,'lb-'||room);
 IF(SELECT xp FROM quiz_private.leaderboard_projection WHERE player_id=a)<>80 OR(quiz_private.social_player(a)->>'xp')::bigint<>80 THEN RAISE EXCEPTION 'XP rules diverged';END IF;
 IF(SELECT games FROM quiz_private.leaderboard_projection WHERE player_id=a)<>3 THEN RAISE EXCEPTION 'Live game not included';END IF;
 INSERT INTO lb_report VALUES('live reward XP includes existing bonus; exact social XP parity');
 BEGIN
  INSERT INTO quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash,state) VALUES(a,gen_random_uuid(),(SELECT jsonb_agg('{}'::jsonb) FROM generate_series(1,10)),'lb-invalid',decode(replace(gen_random_uuid()::text,'-',''),'hex'),'in_progress') RETURNING id INTO mid;
  INSERT INTO quiz_private.score_ledger(match_id,player_id,score,rule_version) VALUES(mid,a,1000,1);
  RAISE EXCEPTION 'Invalid game was credited';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM='Invalid game was credited' THEN RAISE;END IF;END;
 IF(SELECT xp FROM quiz_private.leaderboard_projection WHERE player_id=a)<>80 THEN RAISE EXCEPTION 'Failed game changed projection';END IF;
 INSERT INTO lb_report VALUES('unfinished game rejected atomically without ranked XP');
 SELECT display_name,avatar INTO before_name,before_avatar FROM quiz_private.player_profiles WHERE id=a;
 r=public.player_leaderboard_command(a,'leaderboard_settings','{"enabled":false}');
 IF r->>'saved'<>'true' OR r->>'optIn'<>'false' THEN RAISE EXCEPTION 'Opt-out ack';END IF;
 IF public.player_leaderboard_command(a,'leaderboard_self','{}')->'self'->'entry'<>'null'::jsonb THEN RAISE EXCEPTION 'Opt-out rank remains';END IF;
 IF(SELECT display_name<>before_name OR avatar<>before_avatar FROM quiz_private.player_profiles WHERE id=a) THEN RAISE EXCEPTION 'Preference touched identity';END IF;
 INSERT INTO lb_report VALUES('explicit opt-out removes exact rank without changing profile');
END $$;
-- Repeated reward insert must not project twice, immutable source cannot be edited.
DO $$DECLARE a uuid;mid uuid;before_x bigint;BEGIN
 SELECT id INTO a FROM lb_people WHERE i=1;SELECT match_id INTO mid FROM lb_matches WHERE i=1;
 SELECT xp INTO before_x FROM quiz_private.leaderboard_projection WHERE player_id=a;
 INSERT INTO quiz_private.score_ledger VALUES(mid,a,0,1,now()) ON CONFLICT DO NOTHING;
 IF (SELECT xp FROM quiz_private.leaderboard_projection WHERE player_id=a)<>before_x OR(SELECT games FROM quiz_private.leaderboard_projection WHERE player_id=a)<>3 THEN RAISE EXCEPTION 'Duplicate credited';END IF;
 BEGIN UPDATE quiz_private.score_ledger SET score=1000 WHERE player_id=a;RAISE EXCEPTION 'Mutable source';EXCEPTION WHEN raise_exception THEN IF SQLERRM='Mutable source' THEN RAISE;END IF;END;
 INSERT INTO lb_report VALUES('duplicate ledger idempotency and immutable answer-derived source');
 UPDATE quiz_private.leaderboard_limits SET calls=30,window_at=clock_timestamp() WHERE player_id=a;
 IF public.player_leaderboard_command(a,'leaderboard','{}')->>'error'<>'RATE_LIMIT' THEN RAISE EXCEPTION 'No quota';END IF;
 UPDATE quiz_private.leaderboard_limits SET window_at=clock_timestamp()-interval '2 minutes' WHERE player_id=a;
 IF public.player_leaderboard_command(a,'leaderboard_self','{}') ? 'error' THEN RAISE EXCEPTION 'Quota window reset';END IF;
 INSERT INTO lb_report VALUES('atomic rate limit and bounded window reset');
 IF has_function_privilege('authenticated','public.player_leaderboard_command(uuid,text,jsonb)','execute') OR has_function_privilege('anon','public.player_leaderboard_command(uuid,text,jsonb)','execute') OR has_table_privilege('authenticated','quiz_private.leaderboard_projection','update') OR NOT(SELECT relrowsecurity AND relforcerowsecurity FROM pg_class WHERE oid='quiz_private.leaderboard_projection'::regclass) THEN RAISE EXCEPTION 'Public score authority';END IF;
 INSERT INTO lb_report VALUES('forced RLS, no client score writes and service-only RPC');
END $$;
SELECT label FROM lb_report ORDER BY label;
ROLLBACK;
