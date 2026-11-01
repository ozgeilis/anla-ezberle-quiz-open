-- Display-only level curve. No XP, ledger, award, profile or match row changes.
BEGIN;
SET LOCAL lock_timeout = '5s';
CREATE FUNCTION quiz_private.player_level(total_xp numeric) RETURNS integer
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$
  SELECT max(level)::integer
  FROM pg_catalog.generate_series(1,100) AS levels(level)
  WHERE (level-1)*100 + 5*(level-1)*(level-2) <=
    CASE WHEN total_xp IS NULL OR total_xp::text IN ('NaN','Infinity','-Infinity')
      THEN 0 ELSE greatest(0,total_xp) END;
$$;
REVOKE ALL ON FUNCTION quiz_private.player_level(numeric) FROM PUBLIC, anon, authenticated;

-- Keep current privacy filters, XP sources, grants and the existing function owner.
-- Abort on a changed source instead of restoring an older social projection.
DO $$
DECLARE definition text;
  old_expression constant text := 'least(100,floor(x.xp/250)+1)';
BEGIN
  IF (SELECT md5(prosrc) FROM pg_proc WHERE oid='quiz_private.social_player(uuid)'::regprocedure)
     <> '07adcdefdd04c7bc19589690d6d6eceb' THEN
    RAISE EXCEPTION 'social_player source drift; review before deployment';
  END IF;
  SELECT pg_catalog.pg_get_functiondef('quiz_private.social_player(uuid)'::regprocedure) INTO definition;
  IF (length(definition) - length(replace(definition,old_expression,''))) / length(old_expression) <> 1 THEN
    RAISE EXCEPTION 'social_player level expression drift; review before deployment';
  END IF;
  EXECUTE replace(definition, old_expression, 'quiz_private.player_level(x.xp)');
END $$;
COMMENT ON FUNCTION quiz_private.player_level(numeric) IS
  'Progressive display level: 100 levels, next cost 100+(level-1)*10; earned XP is unchanged.';
COMMIT;
