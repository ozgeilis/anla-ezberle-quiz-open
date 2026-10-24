-- LOCAL candidate only. Existing rooms keep their frozen 15-second rule.
BEGIN;
SET LOCAL lock_timeout='5s';
ALTER TABLE quiz_private.live_rooms ADD COLUMN answer_seconds integer NOT NULL DEFAULT 15 CHECK(answer_seconds IN(10,15));
ALTER TABLE quiz_private.live_rooms ALTER COLUMN answer_seconds SET DEFAULT 10;
CREATE OR REPLACE FUNCTION quiz_private.live_advance(room_uuid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
 IF elapsed>=r.question_count*(r.answer_seconds+5) THEN
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
 pos=floor(elapsed/(r.answer_seconds+5))::integer+1;ph=CASE WHEN mod(elapsed::numeric,r.answer_seconds+5)<r.answer_seconds THEN 'answer' ELSE 'reveal' END;
 IF r.state<>'playing' OR r.position<>pos OR r.phase<>ph THEN UPDATE quiz_private.live_rooms SET state='playing',position=pos,phase=ph,revision=revision+1 WHERE id=r.id;END IF;
END $function$;


CREATE OR REPLACE FUNCTION quiz_private.live_view(actor uuid, room_uuid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE r quiz_private.live_rooms;q jsonb;a quiz_private.live_answers;reveal boolean;start_q timestamptz;t timestamptz=clock_timestamp();
BEGIN
 SELECT * INTO r FROM quiz_private.live_rooms WHERE id=room_uuid;
 q=CASE WHEN r.position>0 THEN r.manifest->(r.position-1) END;
 start_q=r.start_at+(greatest(0,r.position-1)*(r.answer_seconds+5))*interval '1 second';
 reveal=r.phase='reveal' OR r.state='completed';
 SELECT * INTO a FROM quiz_private.live_answers WHERE room_id=r.id AND player_id=actor AND position=r.position;
 RETURN jsonb_build_object('id',r.id,'code',r.code,'hostId',r.host_id,'state',r.state,'phase',r.phase,'position',r.position,'revision',r.revision,'serverNow',t,'startAt',r.start_at,'deadline',CASE WHEN r.state='playing' THEN start_q+make_interval(secs=>r.answer_seconds) END,'nextAt',CASE WHEN r.state='playing' THEN start_q+make_interval(secs=>r.answer_seconds+5) END,'expiresAt',r.expires_at,
 'settings',jsonb_build_object('topic',r.topic,'level',r.level,'count',r.question_count,'seconds',r.answer_seconds),
 'question',CASE WHEN r.state='playing' THEN q END,
 'answer',CASE WHEN a.position IS NOT NULL THEN jsonb_build_object('position',a.position,'optionId',a.option_id,'requestId',a.request_id) END,
 'review',CASE WHEN r.phase='reveal' THEN(SELECT jsonb_build_object('correctOptionId',k.correct_option,'explanation',k.explanation,'sources',k.sources) FROM quiz_private.live_keys k WHERE k.dataset=r.dataset AND k.id=q->>'id') END,
 'players',coalesce((SELECT jsonb_agg(jsonb_build_object('id',p.id,'name',p.display_name,'username',p.username,'avatar',p.avatar,'ready',m.ready,'left',m.left_at IS NOT NULL,'seenAt',m.seen_at,'answered',EXISTS(SELECT 1 FROM quiz_private.live_answers x WHERE x.room_id=r.id AND x.player_id=p.id AND x.position=r.position),'score',w.score,'correct',w.correct,'wrong',w.wrong,'unanswered',w.unanswered,'rank',w.rank,'won',w.won) ORDER BY m.joined_at,p.id) FROM quiz_private.live_members m JOIN quiz_private.player_profiles p ON p.id=m.player_id LEFT JOIN quiz_private.live_rewards w ON w.room_id=r.id AND w.player_id=p.id WHERE m.room_id=r.id AND ((r.start_at IS NULL AND m.left_at IS NULL) OR m.in_round)),'[]'::jsonb),
 'reward',(SELECT jsonb_build_object('xp',w.xp,'bonus',w.bonus,'credited',w.credited,'newBadges',to_jsonb(m.new_badges)) FROM quiz_private.live_rewards w JOIN quiz_private.live_members m USING(room_id,player_id) WHERE w.room_id=r.id AND w.player_id=actor),
 'history',CASE WHEN r.state='completed' THEN coalesce((SELECT jsonb_agg(jsonb_build_object('position',item.ordinality,'question',item.value,'optionId',answ.option_id,'correctOptionId',k.correct_option,'explanation',k.explanation,'sources',k.sources) ORDER BY item.ordinality) FROM jsonb_array_elements(r.manifest) WITH ORDINALITY item(value,ordinality) JOIN quiz_private.live_keys k ON k.dataset=r.dataset AND k.id=item.value->>'id' LEFT JOIN quiz_private.live_answers answ ON answ.room_id=r.id AND answ.player_id=actor AND answ.position=item.ordinality),'[]'::jsonb) ELSE '[]'::jsonb END);
END $function$;


CREATE OR REPLACE FUNCTION public.live_room_command(actor uuid, operation text, body jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
  IF r.state<>'playing' OR r.phase<>'answer' OR pos<>r.position OR t<r.start_at+(pos-1)*make_interval(secs=>r.answer_seconds+5) OR t>=r.start_at+(pos-1)*make_interval(secs=>r.answer_seconds+5)+make_interval(secs=>r.answer_seconds) OR me.left_at IS NOT NULL THEN RETURN quiz_private.failure('ANSWER_LATE',409);END IF;
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
  question_manifest=quiz_private.live_manifest_recent(
    r.dataset,r.topic,r.level,r.question_count,
    (SELECT coalesce(array_agg(m.player_id ORDER BY m.player_id),'{}'::uuid[])
     FROM quiz_private.live_members m WHERE m.room_id=rid AND m.left_at IS NULL)
  );
  IF question_manifest IS NULL THEN RETURN quiz_private.failure('LIVE_POOL_INSUFFICIENT',409);END IF;
  -- Remove departed lobby guests from the started roster without deleting records.
  UPDATE quiz_private.live_members m SET in_round=(left_at IS NULL),badges_before=coalesce((SELECT array_agg(badge_id) FROM quiz_private.achievement_awards WHERE player_id=m.player_id),'{}') WHERE room_id=rid;
  UPDATE quiz_private.live_rooms SET state='countdown',phase='countdown',start_at=clock_timestamp()+interval '3 seconds',expires_at=clock_timestamp()+make_interval(secs=>3+question_count*(r.answer_seconds+5)+120),manifest=question_manifest,set_hash=encode(extensions.digest((SELECT string_agg(v->>'id','|' ORDER BY v->>'id') FROM jsonb_array_elements(question_manifest) v),'sha256'),'hex'),revision=revision+1 WHERE id=rid;
 ELSE RETURN quiz_private.failure('INVALID_OPERATION');END IF;
 RETURN quiz_private.live_view(actor,rid);
EXCEPTION WHEN invalid_text_representation OR numeric_value_out_of_range THEN RETURN quiz_private.failure('INVALID_REQUEST');
END $function$;


CREATE OR REPLACE FUNCTION quiz_private.live_guard_room()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
 if current_user='postgres' and nullif(current_setting('anla.erasing_actor',true),'') is not null then return new; end if;
 IF old.state IN('completed','cancelled','expired') THEN RAISE EXCEPTION 'Terminal room is immutable'; END IF;
 IF new.answer_seconds<>old.answer_seconds OR new.id<>old.id OR new.code<>old.code OR new.host_id<>old.host_id OR new.request_id<>old.request_id OR new.dataset<>old.dataset OR new.created_at<>old.created_at THEN RAISE EXCEPTION 'Room identity is immutable';END IF;
 IF old.start_at IS NOT NULL AND (new.start_at IS DISTINCT FROM old.start_at OR new.manifest IS DISTINCT FROM old.manifest OR new.set_hash IS DISTINCT FROM old.set_hash OR new.topic<>old.topic OR new.level<>old.level OR new.question_count<>old.question_count OR new.expires_at<>old.expires_at) THEN RAISE EXCEPTION 'Started manifest and deadlines are immutable';END IF;
 IF new.state<>old.state AND NOT((old.state='lobby' AND new.state IN('countdown','cancelled','expired')) OR (old.state='countdown' AND new.state IN('playing','completed','cancelled')) OR (old.state='playing' AND new.state IN('completed','cancelled'))) THEN RAISE EXCEPTION 'Invalid room transition';END IF;
 RETURN new;
END $function$;


REVOKE ALL ON FUNCTION quiz_private.live_advance(uuid),quiz_private.live_view(uuid,uuid),quiz_private.live_guard_room() FROM public,anon,authenticated;
COMMIT;
