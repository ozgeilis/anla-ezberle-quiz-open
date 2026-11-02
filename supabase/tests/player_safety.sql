-- Disposable local fixtures only. Never run against a hosted database.
BEGIN;
INSERT INTO auth.users(id,email,email_confirmed_at) VALUES
 ('b0000000-0000-4000-8000-000000000001','safety-a@example.invalid',now()),
 ('b0000000-0000-4000-8000-000000000002','safety-b@example.invalid',now()),
 ('b0000000-0000-4000-8000-000000000003','safety-c@example.invalid',now()),
 ('b0000000-0000-4000-8000-000000000004','safety-mod@example.invalid',now());
INSERT INTO quiz_private.player_profiles(id,display_name,username,access_enabled,discoverable) SELECT id,'Test Oyuncu','safety_'||right(id::text,1),true,true FROM auth.users WHERE email LIKE 'safety-%@example.invalid';
INSERT INTO auth.sessions(id,user_id) VALUES('c0000000-0000-4000-8000-000000000004','b0000000-0000-4000-8000-000000000004');
INSERT INTO quiz_private.moderators(actor) VALUES('b0000000-0000-4000-8000-000000000004');
UPDATE quiz_private.player_safety_config SET enabled=true;
SELECT set_config('request.jwt.claims','{"role":"service_role"}',true);
DO $$ DECLARE a uuid:='b0000000-0000-4000-8000-000000000001';b uuid:='b0000000-0000-4000-8000-000000000002';c uuid:='b0000000-0000-4000-8000-000000000003';f uuid;ch uuid;x jsonb; i integer;m uuid;sess uuid;room uuid;
BEGIN
 ASSERT NOT has_table_privilege('authenticated','quiz_private.player_reports','select'),'private complaint storage';
 ASSERT NOT has_function_privilege('authenticated','public.player_safety_command(uuid,text,jsonb)','execute'),'no caller-supplied actor RPC';
 ASSERT NOT has_function_privilege('service_role','quiz_private.player_social_core(uuid,text,jsonb)','execute'),'no legacy API backdoor';
 ASSERT (SELECT bool_and(relrowsecurity AND relforcerowsecurity) FROM pg_class JOIN pg_namespace n ON n.oid=relnamespace WHERE n.nspname='quiz_private' AND relname IN('player_blocks','player_reports','moderators','social_restrictions','moderation_audit','safety_limits')),'forced RLS';
 INSERT INTO quiz_private.friendships(sender,recipient,state) VALUES(a,b,'accepted') RETURNING id INTO f;
 INSERT INTO quiz_private.direct_challenges(sender,recipient,request_id) VALUES(b,a,gen_random_uuid()) RETURNING id INTO ch;
 x=public.player_safety_command(a,'player_block',jsonb_build_object('playerId',b));ASSERT x->>'saved'='true','block saved';
 ASSERT NOT EXISTS(SELECT 1 FROM quiz_private.friendships WHERE id=f),'friend contact removed';
 ASSERT (SELECT state='cancelled' FROM quiz_private.direct_challenges WHERE id=ch),'pending invite cancelled';
 ASSERT NOT EXISTS(SELECT 1 FROM public.player_notifications WHERE reference_id IN(f,ch)),'pending inbox/push envelope removed';
 ASSERT EXISTS(SELECT 1 FROM auth.users WHERE id=b),'blocking does not delete account';
 INSERT INTO quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash) VALUES(a,gen_random_uuid(),(SELECT jsonb_agg('{}'::jsonb) FROM generate_series(1,10)),'fixture',decode('aabb','hex')) RETURNING id INTO m;
 INSERT INTO quiz_private.quiz_sessions(match_id,player_id) VALUES(m,b) RETURNING id INTO sess;
 BEGIN INSERT INTO quiz_private.match_players(match_id,slot,player_id,session_id) VALUES(m,'b',b,sess);RAISE EXCEPTION 'FAIL: old token join bypass';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'PLAYER_UNAVAILABLE' THEN RAISE;END IF;END;
 INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset) VALUES('ABC234',a,gen_random_uuid(),'synthetic-safety') RETURNING id INTO room;
 BEGIN INSERT INTO quiz_private.live_members(room_id,player_id) VALUES(room,b);RAISE EXCEPTION 'FAIL: room code bypass';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'PLAYER_UNAVAILABLE' THEN RAISE;END IF;END;
 ASSERT EXISTS(SELECT 1 FROM quiz_private.matches WHERE id=m),'block does not delete match history';

 BEGIN INSERT INTO quiz_private.friendships(sender,recipient) VALUES(b,a);RAISE EXCEPTION 'FAIL:block bypass';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'PLAYER_UNAVAILABLE' THEN RAISE;END IF; END;
 BEGIN INSERT INTO quiz_private.direct_challenges(sender,recipient,request_id) VALUES(a,b,gen_random_uuid());RAISE EXCEPTION 'FAIL:invite bypass';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'PLAYER_UNAVAILABLE' THEN RAISE;END IF; END;
 x=public.player_social_command(b,'player_search','{"query":"safety_1"}');ASSERT jsonb_array_length(x->'players')=0,'reverse direction hidden in search';
 x=public.player_safety_command(c,'player_unblock',jsonb_build_object('playerId',b));ASSERT quiz_private.pair_blocked(a,b),'third user cannot unblock someone else';
 x=public.player_safety_command(a,'blocked_players');ASSERT jsonb_array_length(x->'players')=1,'only own block list';
 x=public.player_safety_command(b,'blocked_players');ASSERT jsonb_array_length(x->'players')=0,'blocker identity not leaked to target';
 x=public.player_safety_command(a,'player_unblock',jsonb_build_object('playerId',b));ASSERT NOT quiz_private.pair_blocked(a,b),'unblock owner';
 ASSERT NOT EXISTS(SELECT 1 FROM quiz_private.friendships WHERE id=f),'unblock never restores consent';
 INSERT INTO quiz_private.friendships(sender,recipient) VALUES(a,b);
 x=public.player_safety_command(a,'player_report',jsonb_build_object('playerId',b,'reason','harassment','details','Synthetic test evidence'));ASSERT x->>'saved'='true','report saved';
 x=public.player_safety_command(a,'player_report',jsonb_build_object('playerId',b,'reason','harassment'));ASSERT x->>'saved'='true','duplicate is idempotent';
 ASSERT (SELECT count(*)=1 FROM quiz_private.player_reports WHERE reporter=a),'no report spam duplicates';
 x=public.player_safety_command(a,'player_report',jsonb_build_object('playerId',b,'reason','invalid'));ASSERT x->>'error'='INVALID_REQUEST','reason validation';
 x=public.player_safety_command(a,'player_report',jsonb_build_object('playerId',b,'reason','spam','reporter',c));ASSERT x->>'error'='INVALID_REQUEST','no reporter spoof';
 x=public.player_safety_command(a,'player_report',jsonb_build_object('playerId',b,'reason','spam','details',repeat('x',501)));ASSERT x->>'error'='INVALID_REQUEST','bounded evidence';
 UPDATE quiz_private.safety_limits SET reports=5 WHERE actor=a;
 x=public.player_safety_command(a,'player_report',jsonb_build_object('playerId',c,'reason','spam'));ASSERT x->>'error'='REPORT_RATE_LIMIT','daily report quota';
 UPDATE quiz_private.safety_limits SET calls=30 WHERE actor=a;
 x=public.player_safety_command(a,'player_unblock',jsonb_build_object('playerId',b));ASSERT x->>'error'='RATE_LIMIT','request quota';
 FOR i IN 1..2 LOOP
 BEGIN
  IF i=1 THEN UPDATE quiz_private.player_profiles SET display_name='S.İ.K.T.İ.R' WHERE id=b;
  ELSE UPDATE quiz_private.player_profiles SET username='f_u_c_k' WHERE id=b;END IF;
  RAISE EXCEPTION 'FAIL: unsafe profile accepted';
 EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'PROFILE_CONTENT_REJECTED' THEN RAISE;END IF;END;
 END LOOP;
 ASSERT quiz_private.valid_profile_content('Ayşe') AND quiz_private.valid_profile_content('Nazım'),'Turkish names allowed';
END $$;
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"role":"authenticated","sub":"b0000000-0000-4000-8000-000000000002","session_id":"c0000000-0000-4000-8000-000000000004","user_metadata":{"moderator":true}}',true);
DO $$ BEGIN
 BEGIN PERFORM public.moderation_review('queue');RAISE EXCEPTION 'FAIL: unauthorized moderation';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 BEGIN PERFORM 1 FROM quiz_private.player_reports;RAISE EXCEPTION 'FAIL: complaint leak';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
 BEGIN PERFORM public.player_safety_command('b0000000-0000-4000-8000-000000000001','player_block','{}');RAISE EXCEPTION 'FAIL: direct RPC';EXCEPTION WHEN insufficient_privilege THEN NULL;END;
END $$;
SELECT set_config('request.jwt.claims','{"role":"authenticated","sub":"b0000000-0000-4000-8000-000000000004","session_id":"c0000000-0000-4000-8000-000000000004"}',true);
DO $$ DECLARE queue jsonb; report uuid; BEGIN
 queue=public.moderation_review('queue');ASSERT jsonb_array_length(queue->'reports')=1,'authorized moderator queue';
 report=(queue->'reports'->0->>'id')::uuid;
 ASSERT public.moderation_review('restrict',report,'Synthetic reviewed restriction')->>'saved'='true','moderator action';
END $$;
RESET ROLE;
DO $$ DECLARE b uuid:='b0000000-0000-4000-8000-000000000002';a uuid:='b0000000-0000-4000-8000-000000000001';BEGIN
 ASSERT quiz_private.social_restricted(b),'restriction persisted';
 ASSERT EXISTS(SELECT 1 FROM auth.users WHERE id=b),'moderation never erases account';
 ASSERT (SELECT count(*)=1 FROM quiz_private.moderation_audit),'review audited';
 BEGIN INSERT INTO quiz_private.direct_challenges(sender,recipient,request_id) VALUES(b,a,gen_random_uuid());RAISE EXCEPTION 'FAIL: restricted actor';EXCEPTION WHEN raise_exception THEN IF SQLERRM<>'PLAYER_UNAVAILABLE' THEN RAISE;END IF;END;
END $$;
ROLLBACK;
