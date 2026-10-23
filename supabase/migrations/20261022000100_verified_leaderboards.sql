-- Additive, opt-in leaderboard. Source reward rules and historical rows are unchanged.
BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='60s';
LOCK TABLE quiz_private.score_ledger,quiz_private.live_rewards IN SHARE ROW EXCLUSIVE MODE;
ALTER TABLE quiz_private.player_profiles ADD COLUMN leaderboard_opt_in boolean NOT NULL DEFAULT false;
CREATE TABLE quiz_private.leaderboard_config(singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),enabled boolean NOT NULL DEFAULT false);
INSERT INTO quiz_private.leaderboard_config VALUES(true,false);
-- Rebuildable index/projection, never a second source of earned XP.
CREATE TABLE quiz_private.leaderboard_projection(
 player_id uuid PRIMARY KEY REFERENCES quiz_private.player_profiles(id) ON DELETE CASCADE,
 duel_points bigint NOT NULL DEFAULT 0 CHECK(duel_points>=0),duel_games bigint NOT NULL DEFAULT 0 CHECK(duel_games>=0),
 live_xp bigint NOT NULL DEFAULT 0 CHECK(live_xp>=0),live_games bigint NOT NULL DEFAULT 0 CHECK(live_games>=0),
 xp bigint GENERATED ALWAYS AS(duel_points/10+live_xp) STORED,
 games bigint GENERATED ALWAYS AS(duel_games+live_games) STORED
);
CREATE INDEX leaderboard_order_idx ON quiz_private.leaderboard_projection(xp DESC,games DESC,player_id);
CREATE INDEX leaderboard_public_profiles_idx ON quiz_private.player_profiles(id) WHERE access_enabled AND leaderboard_opt_in AND discoverable AND username IS NOT NULL;
CREATE INDEX IF NOT EXISTS leaderboard_duel_player_idx ON quiz_private.score_ledger(player_id);
CREATE INDEX IF NOT EXISTS leaderboard_live_player_idx ON quiz_private.live_rewards(player_id);
CREATE TABLE quiz_private.leaderboard_limits(player_id uuid PRIMARY KEY REFERENCES quiz_private.player_profiles(id) ON DELETE CASCADE,window_at timestamptz NOT NULL,calls integer NOT NULL);
DO $$ BEGIN
 IF EXISTS(SELECT 1 FROM quiz_private.score_ledger s JOIN quiz_private.matches m ON m.id=s.match_id WHERE m.state<>'completed') OR EXISTS(SELECT 1 FROM quiz_private.live_rewards w JOIN quiz_private.live_rooms r ON r.id=w.room_id WHERE r.state<>'completed') THEN RAISE EXCEPTION 'Leaderboard rollout stopped: reward without completed game';END IF;
END $$;
INSERT INTO quiz_private.leaderboard_projection(player_id,duel_points,duel_games,live_xp,live_games)
SELECT player_id,sum(duel_points),sum(duel_games),sum(live_xp),sum(live_games) FROM(
 SELECT player_id,sum(score)::bigint duel_points,count(*) duel_games,0::bigint live_xp,0::bigint live_games FROM quiz_private.score_ledger GROUP BY player_id
 UNION ALL SELECT player_id,0,0,sum(xp)::bigint,count(*) FROM quiz_private.live_rewards GROUP BY player_id
) s GROUP BY player_id;
-- Deferred until commit: live rewards are inserted before the room becomes completed
-- in the SAME existing transaction. Failed/rolled-back games never reach this index.
CREATE FUNCTION quiz_private.leaderboard_project_reward() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF TG_TABLE_NAME='score_ledger' THEN
  IF NOT EXISTS(SELECT 1 FROM quiz_private.matches WHERE id=NEW.match_id AND state='completed') THEN RAISE EXCEPTION 'Unfinished duel cannot earn ranked XP';END IF;
  INSERT INTO quiz_private.leaderboard_projection(player_id,duel_points,duel_games) VALUES(NEW.player_id,NEW.score,1)
  ON CONFLICT(player_id) DO UPDATE SET duel_points=quiz_private.leaderboard_projection.duel_points+excluded.duel_points,duel_games=quiz_private.leaderboard_projection.duel_games+1;
 ELSE
  IF NOT EXISTS(SELECT 1 FROM quiz_private.live_rooms WHERE id=NEW.room_id AND state='completed') THEN RAISE EXCEPTION 'Unfinished room cannot earn ranked XP';END IF;
  INSERT INTO quiz_private.leaderboard_projection(player_id,live_xp,live_games) VALUES(NEW.player_id,NEW.xp,1)
  ON CONFLICT(player_id) DO UPDATE SET live_xp=quiz_private.leaderboard_projection.live_xp+excluded.live_xp,live_games=quiz_private.leaderboard_projection.live_games+1;
 END IF;
 RETURN NEW;
END $$;
CREATE CONSTRAINT TRIGGER leaderboard_duel_reward AFTER INSERT ON quiz_private.score_ledger DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION quiz_private.leaderboard_project_reward();
CREATE CONSTRAINT TRIGGER leaderboard_live_reward AFTER INSERT ON quiz_private.live_rewards DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION quiz_private.leaderboard_project_reward();
DO $$ DECLARE t text;BEGIN
 FOREACH t IN ARRAY ARRAY['leaderboard_config','leaderboard_projection','leaderboard_limits'] LOOP
  EXECUTE format('ALTER TABLE quiz_private.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('ALTER TABLE quiz_private.%I FORCE ROW LEVEL SECURITY',t);
  EXECUTE format('REVOKE ALL ON quiz_private.%I FROM public,anon,authenticated',t);
 END LOOP;
END $$;
REVOKE ALL ON FUNCTION quiz_private.leaderboard_project_reward() FROM public,anon,authenticated;

-- Inline eligible relation; no arbitrary player-id lookup and no private fields.
CREATE FUNCTION quiz_private.leaderboard_eligible(actor uuid,scope text)
RETURNS TABLE(id uuid,xp bigint,games bigint) LANGUAGE sql STABLE AS $$
 SELECT p.id,s.xp,s.games FROM quiz_private.leaderboard_projection s JOIN quiz_private.player_profiles p ON p.id=s.player_id JOIN auth.users u ON u.id=p.id
 WHERE s.games>0 AND p.access_enabled AND p.username IS NOT NULL AND p.leaderboard_opt_in AND u.email_confirmed_at IS NOT NULL AND NOT u.is_anonymous AND u.deleted_at IS NULL AND (u.banned_until IS NULL OR u.banned_until<=now())
 AND ((scope='global' AND p.discoverable) OR(scope='friends' AND p.id<>actor AND EXISTS(SELECT 1 FROM quiz_private.friendships f WHERE f.state='accepted' AND((f.sender=actor AND f.recipient=p.id)OR(f.recipient=actor AND f.sender=p.id)))))
$$;
REVOKE ALL ON FUNCTION quiz_private.leaderboard_eligible(uuid,text) FROM public,anon,authenticated;
CREATE FUNCTION public.player_leaderboard_command(actor uuid,operation text,body jsonb DEFAULT '{}'::jsonb) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE p quiz_private.player_profiles;scope text;lim integer;cursor_xp bigint;cursor_games bigint;cursor_id uuid;calls integer;result jsonb;allowed_keys text[];
BEGIN
 IF actor IS NULL OR jsonb_typeof(body) IS DISTINCT FROM 'object' THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
 SELECT * INTO p FROM quiz_private.player_profiles WHERE id=actor;
 IF NOT FOUND OR NOT p.access_enabled THEN RETURN quiz_private.failure('CLOSED_TEST_ONLY',403);END IF;
 IF NOT EXISTS(SELECT 1 FROM auth.users WHERE id=actor AND email_confirmed_at IS NOT NULL AND NOT is_anonymous AND deleted_at IS NULL AND (banned_until IS NULL OR banned_until<=now())) THEN RETURN quiz_private.failure('SIGN_IN_REQUIRED',401);END IF;
 IF NOT(SELECT enabled FROM quiz_private.leaderboard_config WHERE singleton) THEN RETURN quiz_private.failure('LEADERBOARD_NOT_READY',503);END IF;
 INSERT INTO quiz_private.leaderboard_limits VALUES(actor,clock_timestamp(),1) ON CONFLICT(player_id) DO UPDATE
 SET window_at=CASE WHEN quiz_private.leaderboard_limits.window_at<clock_timestamp()-interval '1 minute' THEN clock_timestamp() ELSE quiz_private.leaderboard_limits.window_at END,
 calls=CASE WHEN quiz_private.leaderboard_limits.window_at<clock_timestamp()-interval '1 minute' THEN 1 ELSE quiz_private.leaderboard_limits.calls+1 END RETURNING leaderboard_limits.calls INTO calls;
 IF calls>30 THEN RETURN quiz_private.failure('RATE_LIMIT',429);END IF;
 allowed_keys=CASE operation WHEN 'leaderboard' THEN ARRAY['scope','limit','cursor'] WHEN 'leaderboard_settings' THEN ARRAY['enabled'] WHEN 'leaderboard_self' THEN ARRAY[]::text[] END;
 IF allowed_keys IS NULL OR EXISTS(SELECT 1 FROM jsonb_object_keys(body) k WHERE NOT(k=ANY(allowed_keys))) THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
 IF operation='leaderboard_settings' THEN
  IF jsonb_typeof(body->'enabled') IS DISTINCT FROM 'boolean' THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
  IF (body->>'enabled')::boolean AND p.username IS NULL THEN RETURN quiz_private.failure('USERNAME_REQUIRED');END IF;
  UPDATE quiz_private.player_profiles SET leaderboard_opt_in=(body->>'enabled')::boolean WHERE id=actor RETURNING * INTO p;
  RETURN jsonb_build_object('saved',true,'optIn',p.leaderboard_opt_in);
 END IF;
 scope=coalesce(body->>'scope','global');
 IF scope NOT IN('global','friends') OR (body ? 'scope' AND jsonb_typeof(body->'scope')<>'string') THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
 lim=coalesce((body->>'limit')::integer,50);
 IF lim<1 OR lim>50 OR (body ? 'limit' AND (jsonb_typeof(body->'limit')<>'number' OR (body->>'limit')!~'^[0-9]+$')) THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
 IF body ? 'cursor' THEN
  IF jsonb_typeof(body->'cursor') IS DISTINCT FROM 'object' THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
  IF (SELECT count(*) FROM jsonb_object_keys(body->'cursor'))<>3 OR NOT(body->'cursor' ?& ARRAY['xp','games','id']) OR (body->'cursor'->>'xp')!~'^[0-9]+$' OR(body->'cursor'->>'games')!~'^[0-9]+$' THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
  cursor_xp=(body->'cursor'->>'xp')::bigint;cursor_games=(body->'cursor'->>'games')::bigint;cursor_id=(body->'cursor'->>'id')::uuid;
  IF cursor_xp IS NULL OR cursor_games IS NULL OR cursor_id IS NULL OR cursor_xp>9007199254740991 OR cursor_games>9007199254740991 THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
 END IF;
 WITH eligible AS NOT MATERIALIZED(SELECT * FROM quiz_private.leaderboard_eligible(actor,scope)),
 page AS MATERIALIZED(SELECT * FROM eligible e WHERE cursor_id IS NULL OR e.xp<cursor_xp OR(e.xp=cursor_xp AND e.games<cursor_games)OR(e.xp=cursor_xp AND e.games=cursor_games AND e.id>cursor_id) ORDER BY xp DESC,games DESC,id LIMIT lim+1),
 shown AS MATERIALIZED(SELECT * FROM page ORDER BY xp DESC,games DESC,id LIMIT lim),
 first_shown AS(SELECT * FROM shown ORDER BY xp DESC,games DESC,id LIMIT 1),
 ranked AS(SELECT e.*,row_number() OVER(ORDER BY e.xp DESC,e.games DESC,e.id)+(SELECT count(*) FROM eligible x CROSS JOIN first_shown f WHERE x.xp>f.xp OR(x.xp=f.xp AND x.games>f.games)OR(x.xp=f.xp AND x.games=f.games AND x.id<f.id)) rank FROM shown e),
 own AS(SELECT e.*,1+(SELECT count(*) FROM eligible x WHERE x.xp>e.xp OR(x.xp=e.xp AND x.games>e.games)OR(x.xp=e.xp AND x.games=e.games AND x.id<e.id)) rank FROM eligible e WHERE e.id=actor)
 SELECT jsonb_build_object('entries',CASE WHEN operation='leaderboard_self' THEN '[]'::jsonb ELSE coalesce((SELECT jsonb_agg(jsonb_build_object('rank',rank,'games',games,'player',quiz_private.social_player(id)) ORDER BY rank) FROM ranked),'[]'::jsonb) END,
 'nextCursor',CASE WHEN operation<>'leaderboard_self' AND(SELECT count(*) FROM page)>lim THEN(SELECT jsonb_build_object('xp',xp,'games',games,'id',id) FROM shown ORDER BY xp,games,id DESC LIMIT 1) END,
 'self',jsonb_build_object('optIn',p.leaderboard_opt_in,'discoverable',p.discoverable,'username',p.username,'xp',coalesce((SELECT xp FROM quiz_private.leaderboard_projection WHERE player_id=actor),0),'games',coalesce((SELECT games FROM quiz_private.leaderboard_projection WHERE player_id=actor),0),'entry',(SELECT jsonb_build_object('rank',rank,'games',games,'player',quiz_private.social_player(id)) FROM own)),
 'asOf',clock_timestamp(),'scope',scope) INTO result;
 RETURN result;
EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN RETURN quiz_private.failure('INVALID_REQUEST');
END $$;
REVOKE ALL ON FUNCTION public.player_leaderboard_command(uuid,text,jsonb) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.player_leaderboard_command(uuid,text,jsonb) TO service_role;
NOTIFY pgrst, 'reload schema';
COMMIT;
