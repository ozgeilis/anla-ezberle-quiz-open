BEGIN;
DO $$
DECLARE l integer; threshold integer := 0; cost integer;
BEGIN
  FOR l IN 1..99 LOOP
    cost := 100+(l-1)*10;
    IF quiz_private.player_level(threshold) <> l
      OR quiz_private.player_level(threshold+cost-1) <> l
      OR quiz_private.player_level(threshold+cost) <> l+1 THEN
      RAISE EXCEPTION 'Level threshold failed at %',l;
    END IF;
    threshold := threshold+cost;
  END LOOP;
  IF threshold<>58410 OR quiz_private.player_level(1e30)<>100
    OR quiz_private.player_level(-1)<>1 OR quiz_private.player_level(NULL)<>1
    OR quiz_private.player_level('NaN'::numeric)<>1
    OR quiz_private.player_level('Infinity'::numeric)<>1 THEN
    RAISE EXCEPTION 'Level fallback/cap failed';
  END IF;
  IF has_function_privilege('anon','quiz_private.player_level(numeric)','EXECUTE')
    OR has_function_privilege('authenticated','quiz_private.player_level(numeric)','EXECUTE') THEN
    RAISE EXCEPTION 'Unnecessary direct level RPC permission';
  END IF;
  -- Existing social projection must retain all XP/visibility/achievement sources.
  IF pg_get_functiondef('quiz_private.social_player(uuid)'::regprocedure) NOT LIKE '%quiz_private.player_level(x.xp)%' THEN
    RAISE EXCEPTION 'Social projection not using central level helper';
  END IF;
  RAISE NOTICE 'PASS 99 server thresholds, cap, malformed fallback, ACL and social projection';
END $$;
ROLLBACK;
