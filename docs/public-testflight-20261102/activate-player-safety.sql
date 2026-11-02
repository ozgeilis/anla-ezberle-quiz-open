-- NOT APPLIED. Only after separately approved owner enrollment and real console
-- login/queue acceptance. Shared backend: compatible Android clients also see it.
BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '10s';
DO $$
DECLARE owner_id uuid; current_flag boolean;
BEGIN
  SELECT id INTO STRICT owner_id FROM auth.users
  WHERE lower(email)='kovynelstudio@gmail.com'
    AND email_confirmed_at IS NOT NULL AND NOT is_anonymous;
  IF NOT EXISTS(SELECT 1 FROM quiz_private.moderators WHERE actor=owner_id AND active)
    OR (SELECT count(*) FROM quiz_private.moderators WHERE active)<>1
    OR NOT EXISTS(SELECT 1 FROM auth.sessions WHERE user_id=owner_id
      AND (not_after IS NULL OR not_after>clock_timestamp())) THEN
    RAISE EXCEPTION 'OWNER_MODERATOR_ACCEPTANCE_REQUIRED';
  END IF;
  SELECT enabled INTO STRICT current_flag FROM quiz_private.player_safety_config
    WHERE singleton FOR UPDATE;
  IF current_flag THEN RAISE EXCEPTION 'SAFETY_FLAG_DRIFT'; END IF;
  UPDATE quiz_private.player_safety_config SET enabled=true WHERE singleton;
END $$;
COMMIT;
