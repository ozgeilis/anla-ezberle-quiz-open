-- Verify the actual forward migration repaired already-orphaned fixture rows.
DO $$ BEGIN
 ASSERT (SELECT details='' AND username_snapshot IS NULL AND name_snapshot='Silinen hesapla ilişkili kayıt'
  AND state='dismissed' AND resolved_at IS NOT NULL FROM quiz_private.player_reports
  WHERE id='e0000000-0000-4000-8000-000000000002');
 ASSERT (SELECT note='Hesap silme nedeniyle kaldırıldı.' FROM quiz_private.moderation_audit
  WHERE id='e0000000-0000-4000-8000-000000000003');
 ASSERT (SELECT reason='Hesap silme nedeniyle ayrıntılar kaldırıldı.' FROM quiz_private.social_restrictions
  WHERE actor='e0000000-0000-4000-8000-000000000001');
 RAISE NOTICE 'PASS forward repair of orphaned report/audit/restriction personal text';
END $$;
-- Remove only the runner's fixed local fixtures; no hosted execution.
DELETE FROM quiz_private.moderation_audit WHERE id='e0000000-0000-4000-8000-000000000003';
DELETE FROM quiz_private.player_reports WHERE id='e0000000-0000-4000-8000-000000000002';
DELETE FROM quiz_private.social_restrictions WHERE actor='e0000000-0000-4000-8000-000000000001';
DELETE FROM auth.users WHERE id='e0000000-0000-4000-8000-000000000001';
