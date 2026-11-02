-- NOT APPLIED. Frankfurt only, after separately approved privacy migration.
-- Restores the previously approved owner role; does not enroll another account.
BEGIN;
SET LOCAL lock_timeout='3s';
SET LOCAL statement_timeout='10s';
DO $$
DECLARE owner_id uuid; flag boolean;
BEGIN
 SELECT id INTO STRICT owner_id FROM auth.users WHERE lower(email)='kovynelstudio@gmail.com'
  AND email_confirmed_at IS NOT NULL AND NOT is_anonymous;
 SELECT enabled INTO STRICT flag FROM quiz_private.player_safety_config WHERE singleton FOR UPDATE;
 IF flag OR EXISTS(SELECT 1 FROM quiz_private.moderators WHERE active)
  OR NOT EXISTS(SELECT 1 FROM quiz_private.moderators WHERE actor=owner_id AND NOT active)
  OR to_regprocedure('quiz_private.erase_moderation_personal_text()') IS NULL
  OR NOT EXISTS(SELECT 1 FROM pg_trigger WHERE tgrelid='auth.users'::regclass AND tgname='anla_moderation_erasure' AND tgenabled='O')
  OR md5(pg_get_functiondef('quiz_private.erase_authorized_player()'::regprocedure))<>'d0d89af77bc34660904f3edd0847ca8b' THEN
  RAISE EXCEPTION 'MODERATION_PRIVACY_PRECONDITION_DRIFT';
 END IF;
 UPDATE quiz_private.moderators SET active=true WHERE actor=owner_id;
END $$;
COMMIT;
-- Safety is still false. Reuse the previously approved activate-player-safety.sql
-- only after a fresh owner console sign-in and private queue acceptance.
