-- Additive, OFF by default. Does not change the erasure function or game ledgers.
BEGIN;
CREATE TABLE quiz_private.push_config(singleton boolean PRIMARY KEY DEFAULT true CHECK(singleton),enabled boolean NOT NULL DEFAULT false,test_actors uuid[] NOT NULL DEFAULT '{}');
INSERT INTO quiz_private.push_config(singleton) VALUES(true);
CREATE TABLE quiz_private.push_preferences(
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 enabled boolean NOT NULL DEFAULT false,friends boolean NOT NULL DEFAULT true,invites boolean NOT NULL DEFAULT true,results boolean NOT NULL DEFAULT true,rooms boolean NOT NULL DEFAULT true
);
CREATE TABLE quiz_private.push_devices(
 id uuid PRIMARY KEY,user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 session_id uuid NOT NULL,token text NOT NULL UNIQUE CHECK(length(token)<=256 AND token ~ '^(Expo|Exponent)PushToken\[[A-Za-z0-9_-]+\]$'),
 platform text NOT NULL CHECK(platform IN('android','ios')),active boolean NOT NULL DEFAULT true,seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX push_device_owner ON quiz_private.push_devices(user_id);
CREATE TABLE quiz_private.push_outbox(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),notification_id uuid REFERENCES public.player_notifications(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,device_id uuid NOT NULL REFERENCES quiz_private.push_devices(id) ON DELETE CASCADE,
 kind text NOT NULL,reference_id uuid NOT NULL,state text NOT NULL DEFAULT 'queued' CHECK(state IN('queued','submitting','ticket','provider_accepted','failed','suppressed','unknown')),
 created_at timestamptz NOT NULL DEFAULT now(),expires_at timestamptz NOT NULL DEFAULT now()+interval '1 hour',submitted_at timestamptz,
 token_hash text,ticket text,check_at timestamptz,error_code text,
 CHECK((kind='room_started' AND notification_id IS NULL) OR (kind<>'room_started' AND notification_id IS NOT NULL)),
 UNIQUE(notification_id,device_id),UNIQUE(device_id,kind,reference_id)
);
CREATE INDEX push_outbox_pending ON quiz_private.push_outbox(state,created_at);
DO $$ DECLARE t text; BEGIN FOREACH t IN ARRAY ARRAY['push_config','push_preferences','push_devices','push_outbox'] LOOP
 EXECUTE format('ALTER TABLE quiz_private.%I ENABLE ROW LEVEL SECURITY',t);
 EXECUTE format('ALTER TABLE quiz_private.%I FORCE ROW LEVEL SECURITY',t);
 EXECUTE format('REVOKE ALL ON quiz_private.%I FROM public,anon,authenticated',t);
END LOOP; END $$;

-- Existing inbox envelopes/kinds remain unchanged for installed older APKs.
-- Rooms use their existing authoritative start event and this same delivery queue.
CREATE FUNCTION quiz_private.push_category(kind text) RETURNS text LANGUAGE sql IMMUTABLE SET search_path='' AS $$
 SELECT CASE WHEN kind IN('friend_request','friend_accepted') THEN 'friends' WHEN kind IN('challenge_received','challenge_accepted') THEN 'invites' WHEN kind IN('match_completed','turn_ready') THEN 'results' WHEN kind='room_started' THEN 'rooms' END
$$;
CREATE FUNCTION quiz_private.push_available(actor uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT enabled OR actor=ANY(test_actors) FROM quiz_private.push_config WHERE singleton
$$;
CREATE FUNCTION quiz_private.push_event_current(kind text,ref uuid,actor uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT CASE
 WHEN kind IN('friend_request','friend_accepted') THEN EXISTS(SELECT 1 FROM quiz_private.friendships f WHERE f.id=ref AND actor IN(f.sender,f.recipient) AND (kind='friend_accepted' OR f.state='pending'))
 WHEN kind IN('challenge_received','challenge_accepted') THEN EXISTS(SELECT 1 FROM quiz_private.direct_challenges c WHERE c.id=ref AND actor IN(c.sender,c.recipient) AND ((kind='challenge_received' AND c.state='pending' AND c.expires_at>now()) OR (kind='challenge_accepted' AND c.state='accepted')))
 WHEN kind IN('match_completed','turn_ready') THEN EXISTS(SELECT 1 FROM quiz_private.match_players p JOIN quiz_private.matches m ON m.id=p.match_id WHERE m.id=ref AND p.player_id=actor AND (kind='match_completed' AND m.state='completed' OR kind='turn_ready' AND m.state NOT IN('completed','expired','cancelled') AND m.expires_at>now()))
 WHEN kind='room_started' THEN EXISTS(SELECT 1 FROM quiz_private.live_members p JOIN quiz_private.live_rooms r ON r.id=p.room_id WHERE r.id=ref AND p.player_id=actor AND p.left_at IS NULL AND r.state IN('countdown','playing') AND r.expires_at>now()) ELSE false END
$$;
CREATE FUNCTION public.push_settings(operation text,body jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE actor uuid:=auth.uid(); sid uuid; p quiz_private.push_preferences; d quiz_private.push_devices; identifier uuid; n public.player_notifications;
BEGIN
 IF auth.role() IS DISTINCT FROM 'authenticated' OR actor IS NULL OR NOT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=actor AND NOT u.is_anonymous AND u.email_confirmed_at IS NOT NULL) THEN RAISE insufficient_privilege; END IF;
 IF jsonb_typeof(body) IS DISTINCT FROM 'object' OR octet_length(body::text)>2048 THEN RAISE EXCEPTION 'Invalid push request'; END IF;
 sid:=nullif(current_setting('request.jwt.claims',true)::jsonb->>'session_id','')::uuid;
 IF sid IS NULL OR NOT EXISTS(SELECT 1 FROM auth.sessions s WHERE s.id=sid AND s.user_id=actor AND (s.not_after IS NULL OR s.not_after>now())) THEN RAISE insufficient_privilege; END IF;
 INSERT INTO quiz_private.push_preferences(user_id) VALUES(actor) ON CONFLICT DO NOTHING;
 IF operation='preferences' THEN
  IF EXISTS(SELECT 1 FROM jsonb_each(body) x WHERE x.key NOT IN('enabled','friends','invites','results','rooms') OR jsonb_typeof(x.value)<>'boolean') OR body->>'enabled'='true' THEN RAISE EXCEPTION 'Enable needs device permission'; END IF;
  UPDATE quiz_private.push_preferences SET enabled=coalesce((body->>'enabled')::boolean,enabled),friends=coalesce((body->>'friends')::boolean,friends),invites=coalesce((body->>'invites')::boolean,invites),results=coalesce((body->>'results')::boolean,results),rooms=coalesce((body->>'rooms')::boolean,rooms) WHERE user_id=actor;
  -- Recheck every queued send against authoritative preferences at claim time too.
 ELSIF operation IN('enable','register') THEN
  IF NOT quiz_private.push_available(actor) THEN RAISE EXCEPTION 'Push rollout is not enabled'; END IF;
  IF EXISTS(SELECT 1 FROM jsonb_object_keys(body) k WHERE k NOT IN('deviceId','token','platform')) OR coalesce(body->>'platform','') NOT IN('android','ios') OR coalesce(body->>'token','') !~ '^(Expo|Exponent)PushToken\[[A-Za-z0-9_-]+\]$' OR length(body->>'token')>256 THEN RAISE EXCEPTION 'Invalid registration'; END IF;
  identifier:=(body->>'deviceId')::uuid; IF identifier IS NULL THEN RAISE EXCEPTION 'Missing device'; END IF;
  -- Lock account, making concurrent device caps and preference writes deterministic.
  PERFORM 1 FROM quiz_private.push_preferences WHERE user_id=actor FOR UPDATE;
  SELECT * INTO d FROM quiz_private.push_devices WHERE id=identifier FOR UPDATE;
  IF FOUND AND d.user_id<>actor THEN RAISE insufficient_privilege; END IF;
  IF EXISTS(SELECT 1 FROM quiz_private.push_devices WHERE token=body->>'token' AND (user_id<>actor OR id<>identifier)) THEN RAISE EXCEPTION 'Device token already bound'; END IF;
  IF NOT EXISTS(SELECT 1 FROM quiz_private.push_devices WHERE id=identifier) AND (SELECT count(*) FROM quiz_private.push_devices WHERE user_id=actor)>=6 THEN RAISE EXCEPTION 'Device limit'; END IF;
  INSERT INTO quiz_private.push_devices(id,user_id,session_id,token,platform) VALUES(identifier,actor,sid,body->>'token',body->>'platform') ON CONFLICT(id) DO UPDATE SET session_id=sid,token=excluded.token,platform=excluded.platform,active=true,seen_at=now();
  IF operation='enable' THEN UPDATE quiz_private.push_preferences SET enabled=true WHERE user_id=actor; END IF;
 ELSIF operation='revoke' THEN
  IF EXISTS(SELECT 1 FROM jsonb_object_keys(body) k WHERE k<>'deviceId') THEN RAISE EXCEPTION 'Invalid revoke'; END IF;
  DELETE FROM quiz_private.push_devices WHERE id=(body->>'deviceId')::uuid AND user_id=actor;
 ELSIF operation IN('target','notification') THEN
  IF EXISTS(SELECT 1 FROM jsonb_object_keys(body) k WHERE k NOT IN('notificationId','source')) OR coalesce(body->>'source','inbox') NOT IN('inbox','room') THEN RAISE EXCEPTION 'Invalid target'; END IF;
  IF body->>'source'='room' THEN
   IF operation='notification' OR NOT quiz_private.push_event_current('room_started',(body->>'notificationId')::uuid,actor) THEN RETURN NULL; END IF;
   RETURN jsonb_build_object('kind','room','id',(body->>'notificationId')::uuid);
  END IF;
  SELECT * INTO n FROM public.player_notifications WHERE id=(body->>'notificationId')::uuid AND recipient_id=actor;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF operation='notification' THEN RETURN jsonb_build_object('id',n.id,'kind',n.kind,'referenceId',n.reference_id,'createdAt',n.created_at,'read',n.read_at IS NOT NULL); END IF;
  IF NOT quiz_private.push_event_current(n.kind,n.reference_id,actor) THEN RETURN NULL; END IF;
  IF n.kind IN('match_completed','turn_ready') THEN RETURN jsonb_build_object('kind','match','id',n.reference_id); END IF;
  RETURN jsonb_build_object('kind','notification','id',n.id);
 ELSIF operation<>'get' OR body<>'{}'::jsonb THEN RAISE EXCEPTION 'Invalid operation'; END IF;
 SELECT * INTO p FROM quiz_private.push_preferences WHERE user_id=actor;
 RETURN jsonb_build_object('available',quiz_private.push_available(actor),'preferences',to_jsonb(p)-'user_id');
END $$;
REVOKE ALL ON FUNCTION public.push_settings(text,jsonb) FROM public,anon;
GRANT EXECUTE ON FUNCTION public.push_settings(text,jsonb) TO authenticated;

CREATE FUNCTION quiz_private.queue_push() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 INSERT INTO quiz_private.push_outbox(notification_id,user_id,device_id,kind,reference_id)
 SELECT new.id,new.recipient_id,d.id,new.kind,new.reference_id FROM quiz_private.push_devices d JOIN quiz_private.push_preferences p ON p.user_id=d.user_id
 WHERE d.user_id=new.recipient_id AND d.active AND p.enabled AND coalesce((to_jsonb(p)->>quiz_private.push_category(new.kind))::boolean,false) AND quiz_private.push_available(p.user_id)
 ON CONFLICT DO NOTHING;
 RETURN new;
END $$;
CREATE TRIGGER queue_real_notification AFTER INSERT ON public.player_notifications FOR EACH ROW EXECUTE FUNCTION quiz_private.queue_push();
CREATE FUNCTION quiz_private.room_push_event() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF old.state='lobby' AND new.state='countdown' THEN
  INSERT INTO quiz_private.push_outbox(user_id,device_id,kind,reference_id)
  SELECT m.player_id,d.id,'room_started',new.id FROM quiz_private.live_members m
  JOIN quiz_private.push_devices d ON d.user_id=m.player_id AND d.active
  JOIN quiz_private.push_preferences p ON p.user_id=m.player_id AND p.enabled AND p.rooms
  WHERE m.room_id=new.id AND m.left_at IS NULL AND m.player_id<>new.host_id AND quiz_private.push_available(m.player_id)
  ON CONFLICT DO NOTHING;
 END IF;
 RETURN new;
END $$;
CREATE TRIGGER room_started_notification AFTER UPDATE ON quiz_private.live_rooms FOR EACH ROW EXECUTE FUNCTION quiz_private.room_push_event();

CREATE FUNCTION public.push_worker(operation text,body jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE q quiz_private.push_outbox; d quiz_private.push_devices; result jsonb:='[]'; code text; job uuid; item record;
BEGIN
 IF auth.role() IS DISTINCT FROM 'service_role' THEN RAISE insufficient_privilege; END IF;
 IF operation='claim' THEN
  -- No indefinite token retention. This only touches push-owned records.
  DELETE FROM quiz_private.push_devices dev WHERE seen_at<now()-interval '90 days' OR NOT EXISTS(SELECT 1 FROM auth.sessions s WHERE s.id=dev.session_id AND s.user_id=dev.user_id AND (s.not_after IS NULL OR s.not_after>now()));
  UPDATE quiz_private.push_outbox SET state='unknown',error_code='SendOutcomeUnknown' WHERE state='submitting' AND submitted_at<now()-interval '5 minutes';
  UPDATE quiz_private.push_outbox SET state='suppressed' WHERE state='queued' AND expires_at<=now();
  DELETE FROM quiz_private.push_outbox WHERE created_at<now()-interval '7 days';
  FOR q IN SELECT * FROM quiz_private.push_outbox WHERE state='queued' AND expires_at>now() ORDER BY created_at,id LIMIT 100 FOR UPDATE SKIP LOCKED LOOP
   IF jsonb_array_length(result)>=30 THEN EXIT; END IF;
   SELECT * INTO d FROM quiz_private.push_devices WHERE id=q.device_id;
   IF NOT FOUND OR NOT d.active OR NOT quiz_private.push_available(q.user_id) OR NOT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=q.user_id AND u.email_confirmed_at IS NOT NULL AND NOT u.is_anonymous) OR NOT EXISTS(SELECT 1 FROM quiz_private.push_preferences p WHERE p.user_id=q.user_id AND p.enabled AND coalesce((to_jsonb(p)->>quiz_private.push_category(q.kind))::boolean,false)) OR NOT quiz_private.push_event_current(q.kind,q.reference_id,q.user_id) THEN
    UPDATE quiz_private.push_outbox SET state='suppressed' WHERE id=q.id; CONTINUE;
   END IF;
   IF q.kind='room_started' AND EXISTS(SELECT 1 FROM quiz_private.live_rooms WHERE id=q.reference_id AND start_at>now()) THEN CONTINUE; END IF;
   IF (SELECT count(*) FROM quiz_private.push_outbox WHERE device_id=d.id AND submitted_at>now()-interval '15 minutes')>=6 OR (SELECT count(*) FROM quiz_private.push_outbox WHERE device_id=d.id AND submitted_at>now()-interval '1 day')>=40 THEN CONTINUE; END IF;
   UPDATE quiz_private.push_outbox SET state='submitting',submitted_at=now(),token_hash=encode(extensions.digest(d.token,'sha256'),'hex') WHERE id=q.id;
   result:=result||jsonb_build_array(jsonb_build_object('id',q.id,'token',d.token,'kind',q.kind,'notificationId',coalesce(q.notification_id,q.reference_id),'source',CASE WHEN q.kind='room_started' THEN 'room' ELSE 'inbox' END,'recipientId',q.user_id));
  END LOOP;
  RETURN result;
 ELSIF operation='authorize' THEN
  SELECT * INTO q FROM quiz_private.push_outbox WHERE id=(body->>'id')::uuid FOR UPDATE;
  IF NOT FOUND OR q.state<>'submitting' THEN RETURN 'false'::jsonb; END IF;
  SELECT * INTO d FROM quiz_private.push_devices WHERE id=q.device_id;
  IF FOUND AND d.active AND encode(extensions.digest(d.token,'sha256'),'hex')=q.token_hash AND quiz_private.push_available(q.user_id)
   AND EXISTS(SELECT 1 FROM auth.sessions ses WHERE ses.id=d.session_id AND ses.user_id=d.user_id AND (ses.not_after IS NULL OR ses.not_after>now()))
   AND EXISTS(SELECT 1 FROM quiz_private.push_preferences p WHERE p.user_id=q.user_id AND p.enabled AND coalesce((to_jsonb(p)->>quiz_private.push_category(q.kind))::boolean,false))
   AND quiz_private.push_event_current(q.kind,q.reference_id,q.user_id) THEN RETURN 'true'::jsonb; END IF;
  UPDATE quiz_private.push_outbox SET state='suppressed' WHERE id=q.id;
  RETURN 'false'::jsonb;
 ELSIF operation='finish' THEN
  job:=(body->>'id')::uuid; SELECT * INTO q FROM quiz_private.push_outbox WHERE id=job FOR UPDATE;
  IF NOT FOUND OR q.state<>'submitting' THEN RETURN jsonb_build_object('saved',false); END IF;
  code:=CASE WHEN body->>'error' IN('DeviceNotRegistered','MessageTooBig','MessageRateExceeded','InvalidCredentials','MismatchSenderId') THEN body->>'error' ELSE 'SendOutcomeUnknown' END;
  IF body->>'ticket' ~ '^[A-Za-z0-9_-]{1,128}$' THEN UPDATE quiz_private.push_outbox SET state='ticket',ticket=body->>'ticket',check_at=now()+interval '15 minutes' WHERE id=job;
  ELSE
   UPDATE quiz_private.push_outbox SET state=CASE WHEN code='SendOutcomeUnknown' THEN 'unknown' ELSE 'failed' END,error_code=code WHERE id=job;
   IF code='DeviceNotRegistered' THEN UPDATE quiz_private.push_devices SET active=false WHERE id=q.device_id AND encode(extensions.digest(token,'sha256'),'hex')=q.token_hash; END IF;
  END IF;
  RETURN jsonb_build_object('saved',true);
 ELSIF operation='receipts' THEN
  RETURN coalesce((SELECT jsonb_agg(jsonb_build_object('id',id,'ticket',ticket)) FROM(SELECT id,ticket FROM quiz_private.push_outbox WHERE state='ticket' AND check_at<=now() ORDER BY check_at LIMIT 100) t),'[]');
 ELSIF operation='receipt' THEN
  SELECT * INTO q FROM quiz_private.push_outbox WHERE id=(body->>'id')::uuid FOR UPDATE;
  IF NOT FOUND OR q.state<>'ticket' THEN RETURN jsonb_build_object('saved',false); END IF;
  IF body->>'status'='ok' THEN UPDATE quiz_private.push_outbox SET state='provider_accepted',error_code=null WHERE id=q.id;
  ELSIF body->>'status'='error' THEN
   code:=CASE WHEN body->>'error' IN('DeviceNotRegistered','MessageTooBig','MessageRateExceeded','InvalidCredentials','MismatchSenderId') THEN body->>'error' ELSE 'ReceiptError' END;
   UPDATE quiz_private.push_outbox SET state='failed',error_code=code WHERE id=q.id;
   IF code='DeviceNotRegistered' THEN UPDATE quiz_private.push_devices SET active=false WHERE id=q.device_id AND encode(extensions.digest(token,'sha256'),'hex')=q.token_hash; END IF;
  ELSE UPDATE quiz_private.push_outbox SET state=CASE WHEN created_at<now()-interval '24 hours' THEN 'unknown' ELSE 'ticket' END,check_at=now()+interval '15 minutes' WHERE id=q.id;
  END IF;
  RETURN jsonb_build_object('saved',true);
 ELSE RAISE EXCEPTION 'Invalid worker operation'; END IF;
END $$;
REVOKE ALL ON FUNCTION public.push_worker(text,jsonb) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.push_worker(text,jsonb) TO service_role;
REVOKE ALL ON FUNCTION quiz_private.push_category(text),quiz_private.push_available(uuid),quiz_private.push_event_current(text,uuid,uuid),quiz_private.queue_push(),quiz_private.room_push_event() FROM public,anon,authenticated;
COMMIT;
