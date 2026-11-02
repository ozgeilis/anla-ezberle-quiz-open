-- Disposable isolated database only. All fixture writes and deletions roll back.
BEGIN;
SET LOCAL statement_timeout = '30s';
DO $$
DECLARE
 actor_reporter uuid := gen_random_uuid(); actor_target uuid := gen_random_uuid();
 actor_moderator uuid := gen_random_uuid(); other_a uuid := gen_random_uuid(); other_b uuid := gen_random_uuid();
 report_id uuid; other_report uuid; audit_id uuid; other_audit uuid;
 report_before jsonb; audit_before jsonb;
BEGIN
 ASSERT NOT has_function_privilege('anon','quiz_private.erase_moderation_personal_text()','execute');
 ASSERT NOT has_function_privilege('authenticated','quiz_private.erase_moderation_personal_text()','execute');
 ASSERT NOT has_function_privilege('service_role','quiz_private.erase_moderation_personal_text()','execute');
 INSERT INTO auth.users(id,email,email_confirmed_at,is_anonymous)
 SELECT id,'erase-moderation-'||id||'@example.invalid',now(),false
 FROM unnest(ARRAY[actor_reporter,actor_target,actor_moderator,other_a,other_b]) id;
 INSERT INTO quiz_private.player_reports(reporter,target,reason,details,name_snapshot,username_snapshot)
 VALUES(actor_reporter,actor_target,'other','Personal details to remove','Personal name','personal_name') RETURNING id INTO report_id;
 INSERT INTO quiz_private.moderation_audit(moderator,report,target,decision,note)
 VALUES(actor_moderator,report_id,actor_target,'warn','Personal moderator note') RETURNING id INTO audit_id;
 INSERT INTO quiz_private.player_reports(reporter,target,reason,details,name_snapshot)
 VALUES(other_a,other_b,'spam','Unrelated evidence','Unrelated name') RETURNING id INTO other_report;
 INSERT INTO quiz_private.moderation_audit(moderator,report,target,decision,note)
 VALUES(other_a,other_report,other_b,'dismiss','Unrelated note') RETURNING id INTO other_audit;
 SELECT to_jsonb(r) INTO report_before FROM quiz_private.player_reports r WHERE id=other_report;
 SELECT to_jsonb(a) INTO audit_before FROM quiz_private.moderation_audit a WHERE id=other_audit;

 -- Rollout denial and atomic rollback must retain all evidence and the account.
 UPDATE quiz_private.account_deletion_config SET enabled=false,test_actors='{}' WHERE singleton;
 INSERT INTO quiz_private.account_deletion_intents VALUES(actor_target,now()+interval '1 minute');
 BEGIN
  DELETE FROM auth.users WHERE id=actor_target;
  RAISE EXCEPTION 'TEST disabled rollout permitted deletion';
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM <> 'Deletion rollout not enabled' THEN RAISE; END IF;
 END;
 ASSERT EXISTS(SELECT 1 FROM auth.users WHERE id=actor_target);
 ASSERT (SELECT details='Personal details to remove' FROM quiz_private.player_reports WHERE id=report_id);
 UPDATE quiz_private.account_deletion_config SET enabled=true WHERE singleton;
 BEGIN
  DELETE FROM auth.users WHERE id=actor_target;
  RAISE no_data_found;
 EXCEPTION WHEN no_data_found THEN NULL; END;
 ASSERT (SELECT note='Personal moderator note' FROM quiz_private.moderation_audit WHERE id=audit_id);

 -- Authorized application erasure; FK nulling and text cleanup are one transaction.
 DELETE FROM auth.users WHERE id=actor_target;
 ASSERT (SELECT target IS NULL AND reporter IS NOT NULL AND details='' AND username_snapshot IS NULL
  AND name_snapshot='Silinen hesapla ilişkili kayıt' AND state='dismissed' AND resolved_at IS NOT NULL
  FROM quiz_private.player_reports WHERE id=report_id),'target personal text removed';
 ASSERT (SELECT note='Hesap silme nedeniyle kaldırıldı.' AND target IS NULL
  FROM quiz_private.moderation_audit WHERE id=audit_id),'linked audit text removed';

 -- Reporter erasure also removes free text which can identify the reporter.
 INSERT INTO quiz_private.player_reports(reporter,target,reason,details,name_snapshot)
 VALUES(actor_reporter,other_b,'other','Reporter private text','Snapshot to remove') RETURNING id INTO report_id;
 INSERT INTO quiz_private.moderation_audit(moderator,report,target,decision,note)
 VALUES(actor_moderator,report_id,other_b,'warn','Reporter personal note') RETURNING id INTO audit_id;
 INSERT INTO quiz_private.social_restrictions(actor,reason) VALUES(other_b,'Reporter personal note'),(other_a,'Unrelated restriction');
 INSERT INTO quiz_private.account_deletion_intents VALUES(actor_reporter,now()+interval '1 minute');
 DELETE FROM auth.users WHERE id=actor_reporter;
 ASSERT (SELECT reporter IS NULL AND target=other_b AND details='' FROM quiz_private.player_reports WHERE id=report_id);
 ASSERT (SELECT note='Hesap silme nedeniyle kaldırıldı.' FROM quiz_private.moderation_audit WHERE id=audit_id);
 ASSERT (SELECT reason='Hesap silme nedeniyle ayrıntılar kaldırıldı.' FROM quiz_private.social_restrictions WHERE actor=other_b),'restriction kept, personal reason removed';

 -- Normal administrative hard deletion also redacts; cleanup grants no new delete authority.
 UPDATE quiz_private.moderation_audit SET note='Moderator identifying text' WHERE id=audit_id;
 DELETE FROM auth.users WHERE id=actor_moderator;
 ASSERT (SELECT moderator IS NULL AND note='Hesap silme nedeniyle kaldırıldı.' FROM quiz_private.moderation_audit WHERE id=audit_id);
 ASSERT report_before=(SELECT to_jsonb(r) FROM quiz_private.player_reports r WHERE id=other_report);
 ASSERT audit_before=(SELECT to_jsonb(a) FROM quiz_private.moderation_audit a WHERE id=other_audit);
 ASSERT EXISTS(SELECT 1 FROM auth.users WHERE id=other_a) AND EXISTS(SELECT 1 FROM auth.users WHERE id=other_b);
 ASSERT (SELECT reason='Unrelated restriction' FROM quiz_private.social_restrictions WHERE actor=other_a);
 RAISE NOTICE 'PASS target/reporter/moderator erasure, rollout denial, atomic rollback, unrelated evidence preservation';
END $$;
SET LOCAL ROLE authenticated;
DO $$ BEGIN
 BEGIN DELETE FROM auth.users; RAISE EXCEPTION 'TEST client Auth delete'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
 BEGIN UPDATE quiz_private.player_reports SET details=''; RAISE EXCEPTION 'TEST client evidence change'; EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
ROLLBACK;
