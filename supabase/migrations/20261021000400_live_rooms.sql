-- Additive live rooms. Existing async matches, content scope and ledgers are untouched.
BEGIN;
CREATE TABLE quiz_private.live_config(singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton), enabled boolean NOT NULL DEFAULT false, dataset text);
INSERT INTO quiz_private.live_config VALUES(true,false,null);
CREATE TABLE quiz_private.live_questions(
 dataset text NOT NULL,id text NOT NULL,version integer NOT NULL CHECK(version>0),question jsonb NOT NULL,
 difficulty text NOT NULL CHECK(difficulty IN('easy','medium','hard')),topic text NOT NULL,concept_keys text[] NOT NULL,
 PRIMARY KEY(dataset,id),CHECK(jsonb_array_length(question->'options')=4)
);
CREATE TABLE quiz_private.live_keys(
 dataset text NOT NULL,id text NOT NULL,correct_option text NOT NULL,explanation text NOT NULL,sources jsonb NOT NULL,
 PRIMARY KEY(dataset,id),FOREIGN KEY(dataset,id) REFERENCES quiz_private.live_questions(dataset,id)
);
CREATE TABLE quiz_private.live_pools(
 dataset text NOT NULL,topic text NOT NULL,level text NOT NULL,question_count integer NOT NULL CHECK(question_count IN(5,10,15)),
 quotas jsonb NOT NULL,candidates jsonb NOT NULL,sample jsonb NOT NULL,PRIMARY KEY(dataset,topic,level,question_count)
);
CREATE TABLE quiz_private.live_rooms(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),code text NOT NULL UNIQUE CHECK(code ~ '^[A-Z2-9]{6}$'),host_id uuid NOT NULL REFERENCES quiz_private.player_profiles(id),
 request_id uuid NOT NULL,dataset text NOT NULL,topic text NOT NULL DEFAULT 'mixed',level text NOT NULL DEFAULT 'easy',question_count integer NOT NULL DEFAULT 10 CHECK(question_count IN(5,10,15)),
 state text NOT NULL DEFAULT 'lobby' CHECK(state IN('lobby','countdown','playing','completed','cancelled','expired')),
 created_at timestamptz NOT NULL DEFAULT clock_timestamp(),expires_at timestamptz NOT NULL DEFAULT clock_timestamp()+interval '30 minutes',
 start_at timestamptz,manifest jsonb,set_hash text,position integer NOT NULL DEFAULT 0,phase text NOT NULL DEFAULT 'lobby',revision integer NOT NULL DEFAULT 1,
 UNIQUE(host_id,request_id)
);
CREATE TABLE quiz_private.live_members(
 room_id uuid NOT NULL REFERENCES quiz_private.live_rooms(id),player_id uuid NOT NULL REFERENCES quiz_private.player_profiles(id),
 ready boolean NOT NULL DEFAULT false,in_round boolean NOT NULL DEFAULT false,joined_at timestamptz NOT NULL DEFAULT clock_timestamp(),seen_at timestamptz NOT NULL DEFAULT clock_timestamp(),left_at timestamptz,
 badges_before text[] NOT NULL DEFAULT '{}',new_badges text[] NOT NULL DEFAULT '{}',PRIMARY KEY(room_id,player_id)
);
CREATE INDEX live_members_player_idx ON quiz_private.live_members(player_id,joined_at DESC);
CREATE TABLE quiz_private.live_answers(
 room_id uuid NOT NULL,player_id uuid NOT NULL,position integer NOT NULL CHECK(position BETWEEN 1 AND 15),option_id text NOT NULL,request_id uuid NOT NULL,
 is_correct boolean NOT NULL,received_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(room_id,player_id,position),UNIQUE(room_id,player_id,request_id),FOREIGN KEY(room_id,player_id) REFERENCES quiz_private.live_members(room_id,player_id)
);
CREATE TABLE quiz_private.live_rewards(
 room_id uuid NOT NULL,player_id uuid NOT NULL,score integer NOT NULL CHECK(score BETWEEN 0 AND 1500 AND score%100=0),
 correct integer NOT NULL,wrong integer NOT NULL,unanswered integer NOT NULL,rank integer NOT NULL,won boolean NOT NULL,
 xp integer NOT NULL CHECK(xp BETWEEN 0 AND 170),bonus integer NOT NULL CHECK(bonus IN(0,20)),credited boolean NOT NULL,set_hash text NOT NULL,friend_ids uuid[] NOT NULL DEFAULT '{}',recorded_at timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(room_id,player_id),FOREIGN KEY(room_id,player_id) REFERENCES quiz_private.live_members(room_id,player_id)
);
CREATE UNIQUE INDEX live_reward_set_once ON quiz_private.live_rewards(player_id,set_hash) WHERE credited;
CREATE TABLE quiz_private.live_limits(player_id uuid PRIMARY KEY REFERENCES quiz_private.player_profiles(id),window_at timestamptz NOT NULL DEFAULT clock_timestamp(),calls integer NOT NULL DEFAULT 0,joins integer NOT NULL DEFAULT 0);
DO $$ DECLARE t text; BEGIN
 FOREACH t IN ARRAY ARRAY['live_config','live_questions','live_keys','live_pools','live_rooms','live_members','live_answers','live_rewards','live_limits'] LOOP
  EXECUTE format('ALTER TABLE quiz_private.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('ALTER TABLE quiz_private.%I FORCE ROW LEVEL SECURITY',t);
  EXECUTE format('REVOKE ALL ON quiz_private.%I FROM public,anon,authenticated',t);
 END LOOP;
 FOREACH t IN ARRAY ARRAY['live_questions','live_keys','live_pools','live_answers','live_rewards'] LOOP
  EXECUTE format('CREATE TRIGGER immutable_live BEFORE UPDATE OR DELETE ON quiz_private.%I FOR EACH ROW EXECUTE FUNCTION quiz_private.immutable_content()',t);
 END LOOP;
END $$;

-- Validate all offline-computed feasibility witnesses against private server rows.
-- Empty witnesses mean unavailable; they never silently substitute another topic.
CREATE FUNCTION quiz_private.live_validate_dataset(ds text) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE p quiz_private.live_pools;q quiz_private.live_questions;used text[]; k text; counts jsonb; n integer;
BEGIN
 IF (SELECT count(*) FROM quiz_private.live_questions WHERE dataset=ds)<>600 OR (SELECT count(*) FROM quiz_private.live_keys WHERE dataset=ds)<>600 OR (SELECT count(*) FROM quiz_private.live_pools WHERE dataset=ds)<>264 THEN RAISE EXCEPTION 'Incomplete live dataset'; END IF;
 IF EXISTS(SELECT 1 FROM quiz_private.live_questions qq JOIN quiz_private.live_keys a USING(dataset,id) WHERE qq.dataset=ds AND NOT EXISTS(SELECT 1 FROM jsonb_array_elements(qq.question->'options') o WHERE o->>'id'=a.correct_option)) THEN RAISE EXCEPTION 'Invalid live answer key'; END IF;
 FOR p IN SELECT * FROM quiz_private.live_pools WHERE dataset=ds LOOP
  IF jsonb_array_length(p.sample)=0 THEN CONTINUE;END IF;
  IF jsonb_array_length(p.sample)<>p.question_count THEN RAISE EXCEPTION 'Invalid live witness';END IF;
  used='{}';counts='{"easy":0,"medium":0,"hard":0}';n=0;
  FOR k IN SELECT jsonb_array_elements_text(p.sample) LOOP
   SELECT * INTO q FROM quiz_private.live_questions WHERE dataset=ds AND id=k;
   IF NOT FOUND OR (p.topic<>'mixed' AND q.topic<>p.topic) OR q.concept_keys && used OR NOT(p.candidates ? k) THEN RAISE EXCEPTION 'Invalid independent live witness';END IF;
   used=used||q.concept_keys;counts=jsonb_set(counts,ARRAY[q.difficulty],to_jsonb((counts->>q.difficulty)::integer+1));n=n+1;
  END LOOP;
  IF counts<>p.quotas OR n<>p.question_count THEN RAISE EXCEPTION 'Invalid live quotas';END IF;
 END LOOP;
END $$;
CREATE FUNCTION quiz_private.live_manifest(ds text,tp text,lv text,n integer) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE p quiz_private.live_pools;q quiz_private.live_questions;used text[]='{}';ids text[]='{}';counts jsonb='{"easy":0,"medium":0,"hard":0}';result jsonb;
BEGIN
 SELECT * INTO p FROM quiz_private.live_pools WHERE dataset=ds AND topic=tp AND level=lv AND question_count=n;
 IF NOT FOUND OR jsonb_array_length(p.sample)<>n THEN RETURN NULL; END IF;
 FOR q IN SELECT * FROM quiz_private.live_questions WHERE dataset=ds AND (tp='mixed' OR topic=tp) AND p.candidates ? id ORDER BY random() LOOP
  IF NOT(q.concept_keys && used) AND (counts->>q.difficulty)::integer<(p.quotas->>q.difficulty)::integer THEN
   ids=array_append(ids,q.id);used=used||q.concept_keys;counts=jsonb_set(counts,ARRAY[q.difficulty],to_jsonb((counts->>q.difficulty)::integer+1));
   EXIT WHEN cardinality(ids)=n;
  END IF;
 END LOOP;
 -- The exact shared selector produced this witness; greedy failure cannot widen the pool.
 IF cardinality(ids)<>n THEN SELECT array_agg(v) INTO ids FROM jsonb_array_elements_text(p.sample) v; END IF;
 SELECT jsonb_agg(question ORDER BY random()) INTO result FROM quiz_private.live_questions WHERE dataset=ds AND id=ANY(ids);
 RETURN result;
END $$;

CREATE FUNCTION quiz_private.live_guard_room() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN
 IF old.state IN('completed','cancelled','expired') THEN RAISE EXCEPTION 'Terminal room is immutable'; END IF;
 IF new.id<>old.id OR new.code<>old.code OR new.host_id<>old.host_id OR new.request_id<>old.request_id OR new.dataset<>old.dataset OR new.created_at<>old.created_at THEN RAISE EXCEPTION 'Room identity is immutable';END IF;
 IF old.start_at IS NOT NULL AND (new.start_at IS DISTINCT FROM old.start_at OR new.manifest IS DISTINCT FROM old.manifest OR new.set_hash IS DISTINCT FROM old.set_hash OR new.topic<>old.topic OR new.level<>old.level OR new.question_count<>old.question_count OR new.expires_at<>old.expires_at) THEN RAISE EXCEPTION 'Started manifest and deadlines are immutable';END IF;
 IF new.state<>old.state AND NOT((old.state='lobby' AND new.state IN('countdown','cancelled','expired')) OR (old.state='countdown' AND new.state IN('playing','completed','cancelled')) OR (old.state='playing' AND new.state IN('completed','cancelled'))) THEN RAISE EXCEPTION 'Invalid room transition';END IF;
 RETURN new;
END $$;
CREATE TRIGGER live_guard_room BEFORE UPDATE ON quiz_private.live_rooms FOR EACH ROW EXECUTE FUNCTION quiz_private.live_guard_room();
CREATE FUNCTION quiz_private.live_notify() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 -- Never broadcast rows, manifests, answers, codes or answer keys.
 PERFORM realtime.send(jsonb_build_object('roomId',new.id,'revision',new.revision),'changed','live:'||new.id::text,true);
 RETURN new;
END $$;
CREATE TRIGGER live_notify AFTER INSERT OR UPDATE ON quiz_private.live_rooms FOR EACH ROW EXECUTE FUNCTION quiz_private.live_notify();

-- Realtime authorization only checks the caller's own membership. Presence is
-- a connectivity hint, never identity, readiness, scoring or timing authority.
CREATE FUNCTION public.live_room_member(topic text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM quiz_private.live_members m JOIN quiz_private.live_rooms r ON r.id=m.room_id JOIN quiz_private.player_profiles p ON p.id=m.player_id JOIN auth.users u ON u.id=p.id WHERE 'live:'||r.id::text=$1 AND m.player_id=auth.uid() AND m.left_at IS NULL AND p.access_enabled AND u.email_confirmed_at IS NOT NULL AND NOT u.is_anonymous AND r.state NOT IN('cancelled','expired') AND r.created_at>now()-interval '1 day');
$$;
REVOKE ALL ON FUNCTION public.live_room_member(text) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.live_room_member(text) TO authenticated;
CREATE POLICY live_room_receive ON realtime.messages FOR SELECT TO authenticated USING(extension IN('broadcast','presence') AND public.live_room_member(realtime.topic()));
CREATE POLICY live_room_presence ON realtime.messages FOR INSERT TO authenticated WITH CHECK(extension='presence' AND public.live_room_member(realtime.topic()));

CREATE FUNCTION quiz_private.live_metrics(player uuid) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('liveRounds',count(*),'liveWins',count(*) FILTER(WHERE won),'livePerfect',count(*) FILTER(WHERE correct=r.question_count),'liveFriends',(SELECT count(DISTINCT f) FROM quiz_private.live_rewards rw CROSS JOIN LATERAL unnest(rw.friend_ids) f WHERE rw.player_id=player AND rw.credited)) FROM quiz_private.live_rewards w JOIN quiz_private.live_rooms r ON r.id=w.room_id WHERE w.player_id=player AND w.credited;
$$;
CREATE OR REPLACE FUNCTION quiz_private.achievement_metrics(player uuid) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('friends',(SELECT count(*) FROM quiz_private.friendships f WHERE state='accepted' AND player IN(f.sender,f.recipient)),
 'opponents',count(DISTINCT other.player_id),'wins',count(DISTINCT other.player_id) FILTER(WHERE own.score>other.score),'perfect',count(*) FILTER(WHERE own.score=1000)) || quiz_private.live_metrics(player)
 FROM quiz_private.score_ledger own JOIN quiz_private.score_ledger other ON other.match_id=own.match_id AND other.player_id<>own.player_id JOIN quiz_private.matches m ON m.id=own.match_id AND m.state='completed' WHERE own.player_id=player;
$$;
INSERT INTO quiz_private.achievement_rules VALUES('live_first','liveRounds',1),('live_win','liveWins',1),('live_wins5','liveWins',5),('live_wins20','liveWins',20),('live_perfect','livePerfect',1),('live_friends','liveFriends',3);
CREATE OR REPLACE FUNCTION quiz_private.social_player(player uuid) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('id',p.id,'name',p.display_name,'username',p.username,'avatar',p.avatar,'xp',x.xp,'level',least(100,floor(x.xp/250)+1),
 'achievementsShared',p.share_achievements,'badgeIds',CASE WHEN p.share_achievements THEN coalesce((SELECT jsonb_agg(badge_id ORDER BY badge_id) FROM quiz_private.achievement_awards WHERE player_id=p.id),'[]'::jsonb) ELSE '[]'::jsonb END,
 'showcase',CASE WHEN p.share_achievements THEN to_jsonb(p.achievement_showcase) ELSE '[]'::jsonb END)
 FROM quiz_private.player_profiles p CROSS JOIN LATERAL(SELECT coalesce((SELECT sum(score)/10 FROM quiz_private.score_ledger WHERE player_id=p.id),0)+coalesce((SELECT sum(xp) FROM quiz_private.live_rewards WHERE player_id=p.id),0) xp) x WHERE p.id=player AND p.access_enabled AND p.username IS NOT NULL;
$$;

CREATE FUNCTION quiz_private.live_advance(room_uuid uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r quiz_private.live_rooms;t timestamptz;elapsed double precision;pos integer;ph text;m record;w record;ans integer;right_n integer;top_score integer;top_count integer;credit boolean;win boolean;old_badges text[];
BEGIN
 SELECT * INTO r FROM quiz_private.live_rooms WHERE id=room_uuid FOR UPDATE;
 IF NOT FOUND OR r.state IN('completed','expired','cancelled') THEN RETURN; END IF;
 t=clock_timestamp();
 IF r.state='lobby' THEN
  IF t>=r.expires_at THEN UPDATE quiz_private.live_rooms SET state='expired',phase='expired',revision=revision+1 WHERE id=r.id;END IF;
  RETURN;
 END IF;
 elapsed=extract(epoch FROM(t-r.start_at));
 IF elapsed<0 THEN RETURN;END IF;
 IF elapsed>=r.question_count*20 THEN
  -- Stable advisory-lock ordering serializes rewards across overlapping rooms.
  FOR m IN SELECT player_id FROM quiz_private.live_members WHERE room_id=r.id AND in_round ORDER BY player_id LOOP
   PERFORM pg_advisory_xact_lock(hashtextextended('live-reward:'||m.player_id::text,0));
  END LOOP;
  SELECT max(s),count(*) FILTER(WHERE s=(SELECT max(z.s) FROM(SELECT count(a.position) FILTER(WHERE a.is_correct)::integer s FROM quiz_private.live_members mm LEFT JOIN quiz_private.live_answers a ON a.room_id=mm.room_id AND a.player_id=mm.player_id WHERE mm.room_id=r.id AND mm.in_round GROUP BY mm.player_id) z)) INTO top_score,top_count FROM(SELECT count(a.position) FILTER(WHERE a.is_correct)::integer s FROM quiz_private.live_members mm LEFT JOIN quiz_private.live_answers a ON a.room_id=mm.room_id AND a.player_id=mm.player_id WHERE mm.room_id=r.id AND mm.in_round GROUP BY mm.player_id) x;
  FOR m IN SELECT * FROM quiz_private.live_members WHERE room_id=r.id AND in_round ORDER BY player_id LOOP
   SELECT count(*),count(*) FILTER(WHERE is_correct) INTO ans,right_n FROM quiz_private.live_answers WHERE room_id=r.id AND player_id=m.player_id;
   credit=ans>0 AND NOT EXISTS(SELECT 1 FROM quiz_private.live_rewards WHERE player_id=m.player_id AND set_hash=r.set_hash AND credited) AND (SELECT count(*) FROM quiz_private.live_rewards WHERE player_id=m.player_id AND credited AND recorded_at>t-interval '24 hours')<20;
   win=right_n=top_score AND top_count=1 AND top_score>0;
   INSERT INTO quiz_private.live_rewards(room_id,player_id,score,correct,wrong,unanswered,rank,won,xp,bonus,credited,set_hash,friend_ids)
   SELECT r.id,m.player_id,right_n*100,right_n,ans-right_n,r.question_count-ans,1+(SELECT count(*) FROM(SELECT mm.player_id,count(a.position) FILTER(WHERE a.is_correct) s FROM quiz_private.live_members mm LEFT JOIN quiz_private.live_answers a ON a.room_id=mm.room_id AND a.player_id=mm.player_id WHERE mm.room_id=r.id AND mm.in_round GROUP BY mm.player_id) z WHERE z.s>right_n),win,CASE WHEN credit THEN right_n*10+CASE WHEN win THEN 20 ELSE 0 END ELSE 0 END,CASE WHEN credit AND win THEN 20 ELSE 0 END,credit,r.set_hash,
   coalesce((SELECT array_agg(other.player_id) FROM quiz_private.live_members other WHERE other.room_id=r.id AND other.in_round AND other.player_id<>m.player_id AND EXISTS(SELECT 1 FROM quiz_private.friendships f WHERE f.state='accepted' AND ((f.sender=m.player_id AND f.recipient=other.player_id) OR(f.recipient=m.player_id AND f.sender=other.player_id)))),'{}'::uuid[])
   ON CONFLICT DO NOTHING;
  END LOOP;
  UPDATE quiz_private.live_rooms SET state='completed',phase='completed',position=question_count,revision=revision+1 WHERE id=r.id;
  FOR m IN SELECT * FROM quiz_private.live_members WHERE room_id=r.id AND in_round ORDER BY player_id LOOP
   SELECT coalesce(array_agg(badge_id),'{}') INTO old_badges FROM quiz_private.achievement_awards WHERE player_id=m.player_id;
   PERFORM quiz_private.refresh_achievement_awards(m.player_id);
   UPDATE quiz_private.live_members SET new_badges=coalesce((SELECT array_agg(badge_id ORDER BY badge_id) FROM quiz_private.achievement_awards WHERE player_id=m.player_id AND NOT(badge_id=ANY(old_badges))),'{}') WHERE room_id=r.id AND in_round AND player_id=m.player_id;
  END LOOP;
  RETURN;
 END IF;
 pos=floor(elapsed/20)::integer+1;ph=CASE WHEN mod(elapsed::numeric,20)<15 THEN 'answer' ELSE 'reveal' END;
 IF r.state<>'playing' OR r.position<>pos OR r.phase<>ph THEN UPDATE quiz_private.live_rooms SET state='playing',position=pos,phase=ph,revision=revision+1 WHERE id=r.id;END IF;
END $$;

CREATE FUNCTION quiz_private.live_view(actor uuid,room_uuid uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r quiz_private.live_rooms;q jsonb;a quiz_private.live_answers;reveal boolean;start_q timestamptz;t timestamptz=clock_timestamp();
BEGIN
 SELECT * INTO r FROM quiz_private.live_rooms WHERE id=room_uuid;
 q=CASE WHEN r.position>0 THEN r.manifest->(r.position-1) END;
 start_q=r.start_at+(greatest(0,r.position-1)*20)*interval '1 second';
 reveal=r.phase='reveal' OR r.state='completed';
 SELECT * INTO a FROM quiz_private.live_answers WHERE room_id=r.id AND player_id=actor AND position=r.position;
 RETURN jsonb_build_object('id',r.id,'code',r.code,'hostId',r.host_id,'state',r.state,'phase',r.phase,'position',r.position,'revision',r.revision,'serverNow',t,'startAt',r.start_at,'deadline',CASE WHEN r.state='playing' THEN start_q+interval '15 seconds' END,'nextAt',CASE WHEN r.state='playing' THEN start_q+interval '20 seconds' END,'expiresAt',r.expires_at,
 'settings',jsonb_build_object('topic',r.topic,'level',r.level,'count',r.question_count,'seconds',15),
 'question',CASE WHEN r.state='playing' THEN q END,
 'answer',CASE WHEN a.position IS NOT NULL THEN jsonb_build_object('position',a.position,'optionId',a.option_id,'requestId',a.request_id) END,
 'review',CASE WHEN r.phase='reveal' THEN(SELECT jsonb_build_object('correctOptionId',k.correct_option,'explanation',k.explanation,'sources',k.sources) FROM quiz_private.live_keys k WHERE k.dataset=r.dataset AND k.id=q->>'id') END,
 'players',coalesce((SELECT jsonb_agg(jsonb_build_object('id',p.id,'name',p.display_name,'username',p.username,'avatar',p.avatar,'ready',m.ready,'left',m.left_at IS NOT NULL,'seenAt',m.seen_at,'answered',EXISTS(SELECT 1 FROM quiz_private.live_answers x WHERE x.room_id=r.id AND x.player_id=p.id AND x.position=r.position),'score',w.score,'correct',w.correct,'wrong',w.wrong,'unanswered',w.unanswered,'rank',w.rank,'won',w.won) ORDER BY m.joined_at,p.id) FROM quiz_private.live_members m JOIN quiz_private.player_profiles p ON p.id=m.player_id LEFT JOIN quiz_private.live_rewards w ON w.room_id=r.id AND w.player_id=p.id WHERE m.room_id=r.id AND ((r.start_at IS NULL AND m.left_at IS NULL) OR m.in_round)),'[]'::jsonb),
 'reward',(SELECT jsonb_build_object('xp',w.xp,'bonus',w.bonus,'credited',w.credited,'newBadges',to_jsonb(m.new_badges)) FROM quiz_private.live_rewards w JOIN quiz_private.live_members m USING(room_id,player_id) WHERE w.room_id=r.id AND w.player_id=actor),
 'history',CASE WHEN r.state='completed' THEN coalesce((SELECT jsonb_agg(jsonb_build_object('position',item.ordinality,'question',item.value,'optionId',answ.option_id,'correctOptionId',k.correct_option,'explanation',k.explanation,'sources',k.sources) ORDER BY item.ordinality) FROM jsonb_array_elements(r.manifest) WITH ORDINALITY item(value,ordinality) JOIN quiz_private.live_keys k ON k.dataset=r.dataset AND k.id=item.value->>'id' LEFT JOIN quiz_private.live_answers answ ON answ.room_id=r.id AND answ.player_id=actor AND answ.position=item.ordinality),'[]'::jsonb) ELSE '[]'::jsonb END);
END $$;

CREATE FUNCTION public.live_room_command(actor uuid,operation text,body jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE p quiz_private.player_profiles;r quiz_private.live_rooms;me quiz_private.live_members;cfg quiz_private.live_config;lim quiz_private.live_limits;old_answer quiz_private.live_answers;rid uuid;req uuid;code_text text;lv text;tp text;n integer;pool quiz_private.live_pools;question_manifest jsonb;pos integer;opt text;t timestamptz;alphabet text='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';bytes bytea;badges text[];
BEGIN
 IF actor IS NULL OR jsonb_typeof(body) IS DISTINCT FROM 'object' THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
 SELECT * INTO p FROM quiz_private.player_profiles WHERE id=actor;
 IF NOT FOUND OR NOT p.access_enabled OR NOT EXISTS(SELECT 1 FROM auth.users WHERE id=actor AND email_confirmed_at IS NOT NULL AND NOT is_anonymous) THEN RETURN quiz_private.failure('CLOSED_TEST_ONLY',403);END IF;
 IF p.username IS NULL THEN RETURN quiz_private.failure('USERNAME_REQUIRED');END IF;
 INSERT INTO quiz_private.live_limits(player_id) VALUES(actor) ON CONFLICT DO NOTHING;
 SELECT * INTO lim FROM quiz_private.live_limits WHERE player_id=actor FOR UPDATE;
 IF lim.window_at<clock_timestamp()-interval '1 minute' THEN lim.window_at=clock_timestamp();lim.calls=0;lim.joins=0;END IF;
 IF lim.calls>=180 OR(operation='room_join' AND lim.joins>=10) THEN RETURN quiz_private.failure('RATE_LIMIT',429);END IF;
 UPDATE quiz_private.live_limits SET window_at=lim.window_at,calls=lim.calls+1,joins=lim.joins+CASE WHEN operation='room_join' THEN 1 ELSE 0 END WHERE player_id=actor;
 SELECT * INTO cfg FROM quiz_private.live_config WHERE singleton;
 IF operation IN('room_options','room_create','room_join') AND NOT cfg.enabled THEN RETURN quiz_private.failure('LIVE_NOT_READY',503);END IF;
 IF operation='room_list' THEN
  RETURN jsonb_build_object('rooms',coalesce((SELECT jsonb_agg(x.obj ORDER BY x.created_at DESC) FROM(SELECT jsonb_build_object('id',rr.id,'state',rr.state,'code',rr.code,'createdAt',rr.created_at) obj,rr.created_at FROM quiz_private.live_members m JOIN quiz_private.live_rooms rr ON rr.id=m.room_id WHERE m.player_id=actor AND ((rr.start_at IS NULL AND m.left_at IS NULL) OR m.in_round) ORDER BY rr.created_at DESC LIMIT 20) x),'[]'::jsonb));
 ELSIF operation='room_options' THEN
  RETURN jsonb_build_object('combinations',(SELECT jsonb_agg(jsonb_build_object('topic',topic,'level',level,'count',question_count,'available',jsonb_array_length(sample)=question_count)) FROM quiz_private.live_pools WHERE dataset=cfg.dataset));
 ELSIF operation='room_create' THEN
  req=(body->>'requestId')::uuid;IF req IS NULL THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
  SELECT * INTO r FROM quiz_private.live_rooms WHERE host_id=actor AND request_id=req;
  IF FOUND THEN RETURN quiz_private.live_view(actor,r.id);END IF;
  IF(SELECT count(*) FROM quiz_private.live_rooms WHERE host_id=actor AND created_at>clock_timestamp()-interval '1 hour')>=5 OR(SELECT count(*) FROM quiz_private.live_rooms WHERE host_id=actor AND state IN('lobby','countdown','playing') AND expires_at>clock_timestamp())>=3 THEN RETURN quiz_private.failure('RATE_LIMIT',429);END IF;
  FOR n IN 1..10 LOOP
   bytes=extensions.gen_random_bytes(6);code_text='';FOR pos IN 0..5 LOOP code_text=code_text||substr(alphabet,(get_byte(bytes,pos)%32)+1,1);END LOOP;
   EXIT WHEN NOT EXISTS(SELECT 1 FROM quiz_private.live_rooms WHERE code=code_text);
  END LOOP;
  INSERT INTO quiz_private.live_rooms(code,host_id,request_id,dataset) VALUES(code_text,actor,req,cfg.dataset) RETURNING * INTO r;
  INSERT INTO quiz_private.live_members(room_id,player_id) VALUES(r.id,actor);
  RETURN quiz_private.live_view(actor,r.id);
 ELSIF operation='room_join' THEN
  code_text=upper(trim(body->>'code'));
  IF code_text IS NULL OR code_text !~ '^[A-Z2-9]{6}$' THEN RETURN quiz_private.failure('INVALID_ROOM',404);END IF;
  SELECT * INTO r FROM quiz_private.live_rooms WHERE code=code_text FOR UPDATE;
  IF NOT FOUND THEN RETURN quiz_private.failure('INVALID_ROOM',404);END IF;
  PERFORM quiz_private.live_advance(r.id);SELECT * INTO r FROM quiz_private.live_rooms WHERE id=r.id;
  SELECT * INTO me FROM quiz_private.live_members WHERE room_id=r.id AND player_id=actor;
  IF FOUND AND r.state NOT IN('expired','cancelled') THEN
   IF r.start_at IS NOT NULL AND NOT me.in_round THEN RETURN quiz_private.failure('INVALID_ROOM',404);END IF;
   UPDATE quiz_private.live_members SET left_at=null,seen_at=clock_timestamp() WHERE room_id=r.id AND player_id=actor;
   IF r.state NOT IN('completed') THEN UPDATE quiz_private.live_rooms SET revision=revision+1 WHERE id=r.id;END IF;
   RETURN quiz_private.live_view(actor,r.id);
  END IF;
  IF r.state<>'lobby' THEN RETURN quiz_private.failure('INVALID_ROOM',404);END IF;
  IF(SELECT count(*) FROM quiz_private.live_members WHERE room_id=r.id AND left_at IS NULL)>=8 THEN RETURN quiz_private.failure('ROOM_FULL',409);END IF;
  INSERT INTO quiz_private.live_members(room_id,player_id) VALUES(r.id,actor);
  UPDATE quiz_private.live_rooms SET revision=revision+1 WHERE id=r.id;
  RETURN quiz_private.live_view(actor,r.id);
 END IF;
 rid=(body->>'roomId')::uuid;
 SELECT * INTO r FROM quiz_private.live_rooms WHERE id=rid FOR UPDATE;
 IF NOT FOUND OR NOT EXISTS(SELECT 1 FROM quiz_private.live_members WHERE room_id=rid AND player_id=actor) THEN RETURN quiz_private.failure('ROOM_NOT_FOUND',404);END IF;
 PERFORM quiz_private.live_advance(r.id);SELECT * INTO r FROM quiz_private.live_rooms WHERE id=rid;
 SELECT * INTO me FROM quiz_private.live_members WHERE room_id=rid AND player_id=actor;
 IF r.start_at IS NOT NULL AND NOT me.in_round THEN RETURN quiz_private.failure('ROOM_NOT_FOUND',404);END IF;
 IF operation='room_get' THEN
  IF me.seen_at<clock_timestamp()-interval '10 seconds' THEN UPDATE quiz_private.live_members SET seen_at=clock_timestamp() WHERE room_id=rid AND player_id=actor;END IF;
  RETURN quiz_private.live_view(actor,rid);
 END IF;
 IF operation='room_answer' THEN
  req=(body->>'requestId')::uuid;pos=(body->>'position')::integer;opt=body->>'optionId';
  IF req IS NULL OR pos IS NULL OR opt IS NULL THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
  SELECT * INTO old_answer FROM quiz_private.live_answers WHERE room_id=rid AND player_id=actor AND (position=pos OR request_id=req) ORDER BY position LIMIT 1;
  IF FOUND THEN
   IF old_answer.position=pos AND old_answer.request_id=req AND old_answer.option_id=opt THEN RETURN quiz_private.live_view(actor,rid);END IF;
   RETURN quiz_private.failure('ANSWER_LOCKED',409);
  END IF;
  -- Read the clock AFTER obtaining the room lock and reconciling its phase.
  t=clock_timestamp();
  IF r.state<>'playing' OR r.phase<>'answer' OR pos<>r.position OR t<r.start_at+(pos-1)*interval '20 seconds' OR t>=r.start_at+(pos-1)*interval '20 seconds'+interval '15 seconds' OR me.left_at IS NOT NULL THEN RETURN quiz_private.failure('ANSWER_LATE',409);END IF;
  IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(r.manifest->(pos-1)->'options') o WHERE o->>'id'=opt) THEN RETURN quiz_private.failure('INVALID_REQUEST');END IF;
  INSERT INTO quiz_private.live_answers(room_id,player_id,position,option_id,request_id,is_correct)
  SELECT rid,actor,pos,opt,req,k.correct_option=opt FROM quiz_private.live_keys k WHERE k.dataset=r.dataset AND k.id=r.manifest->(pos-1)->>'id';
  UPDATE quiz_private.live_rooms SET revision=revision+1 WHERE id=rid;
  RETURN quiz_private.live_view(actor,rid);
 END IF;
 IF r.state IN('completed','expired','cancelled') THEN RETURN quiz_private.failure('ROOM_CLOSED',409);END IF;
 IF me.left_at IS NOT NULL THEN RETURN quiz_private.failure('ROOM_NOT_FOUND',404);END IF;
 IF operation='room_leave' THEN
  UPDATE quiz_private.live_members SET left_at=clock_timestamp(),ready=false WHERE room_id=rid AND player_id=actor;
  IF r.host_id=actor THEN UPDATE quiz_private.live_rooms SET state='cancelled',phase='cancelled',revision=revision+1 WHERE id=rid;
  ELSE UPDATE quiz_private.live_rooms SET revision=revision+1 WHERE id=rid;END IF;
 ELSIF operation='room_ready' THEN
  IF r.state<>'lobby' OR jsonb_typeof(body->'ready') IS DISTINCT FROM 'boolean' THEN RETURN quiz_private.failure('ROOM_CLOSED',409);END IF;
  UPDATE quiz_private.live_members SET ready=(body->>'ready')::boolean WHERE room_id=rid AND player_id=actor;
  UPDATE quiz_private.live_rooms SET revision=revision+1 WHERE id=rid;
 ELSIF operation='room_settings' THEN
  IF r.host_id<>actor THEN RETURN quiz_private.failure('HOST_ONLY',403);END IF;
  IF r.state<>'lobby' THEN RETURN quiz_private.failure('ROOM_CLOSED',409);END IF;
  tp=body->>'topic';lv=body->>'level';n=(body->>'count')::integer;
  SELECT * INTO pool FROM quiz_private.live_pools WHERE dataset=r.dataset AND topic=tp AND level=lv AND question_count=n AND jsonb_array_length(sample)=n;
  IF NOT FOUND THEN RETURN quiz_private.failure('LIVE_POOL_INSUFFICIENT',409);END IF;
  IF r.topic<>tp OR r.level<>lv OR r.question_count<>n THEN
   UPDATE quiz_private.live_rooms SET topic=tp,level=lv,question_count=n,revision=revision+1 WHERE id=rid;
   UPDATE quiz_private.live_members SET ready=false WHERE room_id=rid;
  END IF;
 ELSIF operation='room_start' THEN
  IF r.host_id<>actor THEN RETURN quiz_private.failure('HOST_ONLY',403);END IF;
  IF r.state IN('countdown','playing') THEN RETURN quiz_private.live_view(actor,rid);END IF;
  IF(SELECT count(*) FROM quiz_private.live_members WHERE room_id=rid AND left_at IS NULL)<2 OR EXISTS(SELECT 1 FROM quiz_private.live_members WHERE room_id=rid AND left_at IS NULL AND NOT ready) THEN RETURN quiz_private.failure('ROOM_NOT_READY',409);END IF;
  question_manifest=quiz_private.live_manifest(r.dataset,r.topic,r.level,r.question_count);
  IF question_manifest IS NULL THEN RETURN quiz_private.failure('LIVE_POOL_INSUFFICIENT',409);END IF;
  -- Remove departed lobby guests from the started roster without deleting records.
  UPDATE quiz_private.live_members m SET in_round=(left_at IS NULL),badges_before=coalesce((SELECT array_agg(badge_id) FROM quiz_private.achievement_awards WHERE player_id=m.player_id),'{}') WHERE room_id=rid;
  UPDATE quiz_private.live_rooms SET state='countdown',phase='countdown',start_at=clock_timestamp()+interval '3 seconds',expires_at=clock_timestamp()+make_interval(secs=>3+question_count*20+120),manifest=question_manifest,set_hash=encode(extensions.digest((SELECT string_agg(v->>'id','|' ORDER BY v->>'id') FROM jsonb_array_elements(question_manifest) v),'sha256'),'hex'),revision=revision+1 WHERE id=rid;
 ELSE RETURN quiz_private.failure('INVALID_OPERATION');END IF;
 RETURN quiz_private.live_view(actor,rid);
EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN RETURN quiz_private.failure('INVALID_REQUEST');
END $$;
REVOKE ALL ON FUNCTION public.live_room_command(uuid,text,jsonb) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.live_room_command(uuid,text,jsonb) TO service_role;

CREATE FUNCTION quiz_private.live_tick() RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE r record;BEGIN
 FOR r IN SELECT id FROM quiz_private.live_rooms WHERE state IN('lobby','countdown','playing') ORDER BY created_at LIMIT 200 FOR UPDATE SKIP LOCKED LOOP
  PERFORM quiz_private.live_advance(r.id);
 END LOOP;
END $$;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA quiz_private FROM public,anon,authenticated;
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('anla-live-room-tick','5 seconds','SELECT quiz_private.live_tick()');
COMMIT;
