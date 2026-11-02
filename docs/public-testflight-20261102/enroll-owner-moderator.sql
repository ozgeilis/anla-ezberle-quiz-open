-- NOT APPLIED. Requires separate owner authorization, only Frankfurt project.
-- Operation on the existing private schema; no Auth or profile row is rewritten.
BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '10s';
DO $$
DECLARE owner_id uuid; current_flag boolean;
BEGIN
  SELECT id INTO STRICT owner_id FROM auth.users
  WHERE lower(email)='kovynelstudio@gmail.com'
    AND email_confirmed_at IS NOT NULL AND NOT is_anonymous;
  IF NOT EXISTS(SELECT 1 FROM auth.identities WHERE user_id=owner_id AND provider='email')
    OR NOT EXISTS(SELECT 1 FROM auth.sessions WHERE user_id=owner_id
      AND (not_after IS NULL OR not_after>clock_timestamp())) THEN
    RAISE EXCEPTION 'VERIFIED_OWNER_SIGNIN_REQUIRED';
  END IF;
  SELECT enabled INTO STRICT current_flag FROM quiz_private.player_safety_config
    WHERE singleton FOR UPDATE;
  IF current_flag OR EXISTS(SELECT 1 FROM quiz_private.moderators WHERE active)
    OR EXISTS(SELECT 1 FROM quiz_private.moderators WHERE actor=owner_id) THEN
    RAISE EXCEPTION 'MODERATION_PRECONDITION_DRIFT';
  END IF;
  INSERT INTO quiz_private.moderators(actor,active) VALUES(owner_id,true);
END $$;
COMMIT;
