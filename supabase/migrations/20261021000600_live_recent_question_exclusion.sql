BEGIN;
-- Recent-question protection for live multiplayer rooms.
-- Shared Wi-Fi/IP does not identify a person. Use each authenticated participant's
-- last five started rounds, including rounds hosted by somebody else.
-- We never persist IP addresses, nor leak historical question IDs to clients.
CREATE OR REPLACE FUNCTION quiz_private.live_manifest_recent(
 ds text,tp text,lv text,n integer,players uuid[]
) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE
 pool quiz_private.live_pools;
 candidate quiz_private.live_questions;
 used_keys text[];
 picked text[];
 difficulties jsonb;
 blocked text[];
 round_limit integer;
 try_number integer;
 player_uuid uuid;
 result jsonb;
BEGIN
 SELECT * INTO pool FROM quiz_private.live_pools
 WHERE dataset=ds AND topic=tp AND level=lv AND question_count=n;
 IF NOT FOUND OR jsonb_array_length(pool.sample)<>n THEN RETURN NULL; END IF;
 -- Lock players in stable order to prevent simultaneously started rooms from
 -- both selecting unseen questions on the basis of the same stale history.
 FOR player_uuid IN SELECT DISTINCT p FROM unnest(players) AS t(p) ORDER BY p LOOP
   PERFORM pg_advisory_xact_lock(hashtextextended('live-history:'||player_uuid::text,0));
 END LOOP;

 -- Strictly exclude five latest rounds; if the constrained pool becomes too
 -- small, progressively release the oldest rounds instead of using a fixed set.
 FOR round_limit IN REVERSE 5..0 LOOP
   SELECT coalesce(array_agg(DISTINCT item.value->>'id'),'{}'::text[]) INTO blocked
   FROM (
     SELECT previous.manifest
     FROM (
       SELECT r.manifest,
              row_number() OVER (PARTITION BY m.player_id ORDER BY r.start_at DESC,r.id DESC) AS ordinal
       FROM quiz_private.live_members m
       JOIN quiz_private.live_rooms r ON r.id=m.room_id
       WHERE m.player_id=ANY(players) AND m.in_round AND r.start_at IS NOT NULL AND r.manifest IS NOT NULL
     ) previous
     WHERE previous.ordinal<=round_limit
   ) recent
   CROSS JOIN LATERAL jsonb_array_elements(recent.manifest) AS item(value);

   FOR try_number IN 1..24 LOOP
     used_keys='{}'::text[];
     picked='{}'::text[];
     difficulties='{"easy":0,"medium":0,"hard":0}'::jsonb;
     FOR candidate IN
       SELECT * FROM quiz_private.live_questions q
       WHERE q.dataset=ds AND (tp='mixed' OR q.topic=tp)
         AND pool.candidates ? q.id AND NOT(q.id=ANY(blocked))
       ORDER BY random()
     LOOP
       IF NOT(candidate.concept_keys && used_keys)
          AND (difficulties->>candidate.difficulty)::integer < (pool.quotas->>candidate.difficulty)::integer THEN
         picked=array_append(picked,candidate.id);
         used_keys=used_keys||candidate.concept_keys;
         difficulties=jsonb_set(difficulties,ARRAY[candidate.difficulty],
           to_jsonb((difficulties->>candidate.difficulty)::integer+1));
         EXIT WHEN cardinality(picked)=n;
       END IF;
     END LOOP;
     IF cardinality(picked)=n THEN
       SELECT jsonb_agg(q.question ORDER BY random()) INTO result
       FROM quiz_private.live_questions q
       WHERE q.dataset=ds AND q.id=ANY(picked);
       RETURN result;
     END IF;
   END LOOP;
 END LOOP;
 -- The pool validator supplies an independent witness. Never fail an otherwise
 -- valid round just because greedy randomized selections were unlucky.
 RETURN quiz_private.live_manifest(ds,tp,lv,n);
END $$;
REVOKE ALL ON FUNCTION quiz_private.live_manifest_recent(text,text,text,integer,uuid[]) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION quiz_private.live_manifest_recent(text,text,text,integer,uuid[]) TO service_role;

-- Keep the existing room-state, authorization and scoring logic unchanged.
CREATE OR REPLACE FUNCTION public.live_room_command(actor uuid,operation text,body jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
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
  question_manifest=quiz_private.live_manifest_recent(
    r.dataset,r.topic,r.level,r.question_count,
    (SELECT coalesce(array_agg(m.player_id ORDER BY m.player_id),'{}'::uuid[])
     FROM quiz_private.live_members m WHERE m.room_id=rid AND m.left_at IS NULL)
  );
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
COMMIT;
