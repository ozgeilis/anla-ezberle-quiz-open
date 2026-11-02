BEGIN;
SET LOCAL lock_timeout = '5s';

-- Cleanup only: no new deletion endpoint, grant, rollout flag or Auth policy.
-- Run before Auth's SET NULL foreign keys lose the affected report identities.
-- The existing account-erasure trigger still enforces its own authorization.
CREATE FUNCTION quiz_private.erase_moderation_personal_text() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
 -- Restriction reasons can contain the same free-text note as their audit.
 -- Redact that copy without lifting an unrelated player's restriction.
 UPDATE quiz_private.social_restrictions s
 SET reason = 'Hesap silme nedeniyle ayrıntılar kaldırıldı.'
 WHERE s.actor IN (
  SELECT a.target FROM quiz_private.moderation_audit a
  WHERE a.moderator = OLD.id OR a.target = OLD.id OR a.report IN (
   SELECT r.id FROM quiz_private.player_reports r WHERE r.reporter = OLD.id OR r.target = OLD.id
  )
 );
 UPDATE quiz_private.moderation_audit a
 SET note = 'Hesap silme nedeniyle kaldırıldı.'
 WHERE a.moderator = OLD.id OR a.target = OLD.id OR a.report IN (
  SELECT r.id FROM quiz_private.player_reports r
  WHERE r.reporter = OLD.id OR r.target = OLD.id
 );

 UPDATE quiz_private.player_reports
 SET details = '', name_snapshot = 'Silinen hesapla ilişkili kayıt',
     username_snapshot = NULL,
     state = CASE WHEN state = 'open' THEN 'dismissed' ELSE state END,
     resolved_at = CASE WHEN state = 'open' THEN clock_timestamp() ELSE resolved_at END
 WHERE reporter = OLD.id OR target = OLD.id;
 -- FK actions remove the deleted actor's links. Other players' identities,
 -- restrictions and decision metadata are not reassigned or erased.
 RETURN OLD;
END $$;
REVOKE ALL ON FUNCTION quiz_private.erase_moderation_personal_text()
 FROM public, anon, authenticated, service_role;
CREATE TRIGGER anla_moderation_erasure BEFORE DELETE ON auth.users
FOR EACH ROW EXECUTE FUNCTION quiz_private.erase_moderation_personal_text();

-- Forward repair of records whose Auth identity was already deleted.
UPDATE quiz_private.social_restrictions s
SET reason = 'Hesap silme nedeniyle ayrıntılar kaldırıldı.'
WHERE s.actor IN (
 SELECT a.target FROM quiz_private.moderation_audit a
 WHERE a.moderator IS NULL OR a.target IS NULL OR a.report IS NULL OR a.report IN (
  SELECT r.id FROM quiz_private.player_reports r WHERE r.reporter IS NULL OR r.target IS NULL
 )
);
UPDATE quiz_private.moderation_audit a
SET note = 'Hesap silme nedeniyle kaldırıldı.'
WHERE a.moderator IS NULL OR a.target IS NULL OR a.report IS NULL OR a.report IN (
 SELECT r.id FROM quiz_private.player_reports r
 WHERE r.reporter IS NULL OR r.target IS NULL
);
UPDATE quiz_private.player_reports
SET details = '', name_snapshot = 'Silinen hesapla ilişkili kayıt',
    username_snapshot = NULL,
    state = CASE WHEN state = 'open' THEN 'dismissed' ELSE state END,
    resolved_at = CASE WHEN state = 'open' THEN clock_timestamp() ELSE resolved_at END
WHERE reporter IS NULL OR target IS NULL;
COMMIT;
