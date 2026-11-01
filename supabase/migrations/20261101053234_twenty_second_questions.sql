BEGIN;
SET LOCAL lock_timeout='5s';
-- Fail closed on server drift instead of replacing a newer deployed protocol.
DO $$ BEGIN
 IF (SELECT md5(prosrc) FROM pg_proc WHERE oid='public.online_duel_command(uuid,text,jsonb)'::regprocedure)<>'d8a35cd739366eb732b2276720dd6e1e'
 OR (SELECT md5(prosrc) FROM pg_proc WHERE oid='quiz_private.match_view(uuid,uuid)'::regprocedure)<>'827043b5d05d42d2d8437d58b3242d3c'
 OR (SELECT md5(prosrc) FROM pg_proc WHERE oid='public.live_room_command(uuid,text,jsonb)'::regprocedure)<>'a130dbe4f25bbac8c2086bd49d04630e'
 THEN RAISE EXCEPTION 'Server protocol drift: review timing rollout before applying'; END IF;
END $$;
-- Existing rows keep their exact timing. Defaults affect future creations only.
ALTER TABLE quiz_private.live_rooms DROP CONSTRAINT live_rooms_answer_seconds_check;
ALTER TABLE quiz_private.live_rooms ADD CONSTRAINT live_rooms_answer_seconds_check CHECK(answer_seconds IN(10,15,20));
ALTER TABLE quiz_private.live_rooms ALTER COLUMN answer_seconds SET DEFAULT 20;
-- Old asynchronous matches remain untimed, including a later opponent joining.
ALTER TABLE quiz_private.matches ADD COLUMN answer_seconds integer CHECK(answer_seconds=20);
ALTER TABLE quiz_private.matches ALTER COLUMN answer_seconds SET DEFAULT 20;
ALTER TABLE quiz_private.quiz_sessions ADD COLUMN question_opened_at timestamptz;
ALTER TABLE quiz_private.quiz_attempts ADD COLUMN timed_out boolean NOT NULL DEFAULT false;
ALTER TABLE quiz_private.quiz_attempts ALTER COLUMN option_id DROP NOT NULL;
ALTER TABLE quiz_private.quiz_attempts ADD CONSTRAINT timeout_has_no_choice CHECK(
 (timed_out AND option_id IS NULL AND NOT is_correct) OR (NOT timed_out AND option_id IS NOT NULL));
CREATE FUNCTION quiz_private.guard_match_timing() RETURNS trigger LANGUAGE plpgsql SET search_path='' AS $$
BEGIN IF NEW.answer_seconds IS DISTINCT FROM OLD.answer_seconds THEN RAISE EXCEPTION 'Match timing is immutable'; END IF; RETURN NEW; END $$;
REVOKE ALL ON FUNCTION quiz_private.guard_match_timing() FROM public,anon,authenticated;
CREATE TRIGGER guard_match_timing BEFORE UPDATE ON quiz_private.matches FOR EACH ROW EXECUTE FUNCTION quiz_private.guard_match_timing();

create or replace function quiz_private.match_view(actor uuid, match_uuid uuid) returns jsonb
language sql volatile security definer set search_path = '' as $$
select jsonb_build_object(
 'direct',exists(select 1 from quiz_private.direct_challenges d where d.match_id=m.id and d.state='accepted'),'id',m.id,'state',m.state,'revision',m.revision,'createdAt',m.created_at,'expiresAt',m.expires_at,
 'manifestHash',m.manifest_hash,'ruleVersion',m.rule_version,'scope',m.content_scope,
 'serverNow',clock_timestamp(),'answerSeconds',m.answer_seconds,'questionOpenedAt',s.question_opened_at,'deadline',s.question_opened_at+make_interval(secs=>m.answer_seconds),
 'slot',mp.slot,'started',s.started_at is not null,'finished',s.completed_at is not null,
 'questions',case when s.started_at is not null then m.question_set else '[]'::jsonb end,
 'answers',coalesce((select jsonb_agg(jsonb_build_object('position',a.position,'optionId',a.option_id,'requestId',a.request_id,'timedOut',a.timed_out) order by a.position) from quiz_private.quiz_attempts a where a.session_id=s.id),'[]'::jsonb),
 'players',(select jsonb_agg(jsonb_build_object('slot',p.slot,'name',coalesce(pr.display_name,'Silinmiş Oyuncu'),'finished',ps.completed_at is not null,'correct',case when m.state='completed' then ps.correct_count end,'wrong',case when m.state='completed' then 10-ps.correct_count end,'score',case when m.state='completed' then ps.correct_count*100 end) order by p.slot) from quiz_private.match_players p left join quiz_private.player_profiles pr on pr.id=p.player_id left join quiz_private.quiz_sessions ps on ps.id=p.session_id where p.match_id=m.id),
 'result',case when m.state='completed' then m.result end,
 'review',case when m.state='completed' then (select jsonb_agg(jsonb_build_object('id',q.value->>'id','version',(q.value->>'version')::integer,'correctOptionId',k.correct_option_id,'explanation',k.explanation) order by q.ordinality) from jsonb_array_elements(m.question_set) with ordinality q(value,ordinality) join quiz_private.quiz_answer_keys k on k.question_id=q.value->>'id' and k.question_version=(q.value->>'version')::integer) else '[]'::jsonb end
)
from quiz_private.matches m join quiz_private.match_players mp on mp.match_id=m.id and mp.player_id=actor join quiz_private.quiz_sessions s on s.id=mp.session_id where m.id=match_uuid;
$$;

create or replace function public.online_duel_command(actor uuid, operation text, body jsonb default '{}'::jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  profile quiz_private.player_profiles;
  m quiz_private.matches;
  session_row quiz_private.quiz_sessions;
  old_answer quiz_private.quiz_attempts;
  match_uuid uuid;
  session_uuid uuid;
  request_uuid uuid;
  invite text;
  manifest jsonb;
  q jsonb;
  actor_slot text;
  position_number integer;
  correct_number integer;
  score_a integer;
  score_b integer;
  answer_id text;
  desired_name text;
  selected_scope text;
  received timestamptz;
  timed_out boolean=false;
begin
  if actor is null or jsonb_typeof(body) <> 'object' then return quiz_private.failure('INVALID_REQUEST'); end if;
  select * into profile from quiz_private.player_profiles where id=actor for update;
  if not found or not profile.access_enabled then return quiz_private.failure('CLOSED_TEST_ONLY',403); end if;
  if operation='self' then
    return jsonb_build_object('profile',jsonb_build_object('name',profile.display_name),'matches',coalesce((select jsonb_agg(x.item order by x.created_at desc) from (select jsonb_build_object('id',m2.id,'state',m2.state,'createdAt',m2.created_at) item,m2.created_at from quiz_private.matches m2 join quiz_private.match_players p on p.match_id=m2.id where p.player_id=actor order by m2.created_at desc limit 20) x),'[]'::jsonb));
  elsif operation='profile' then
    desired_name=normalize(trim(body->>'name'),NFC);
    if desired_name is null or char_length(desired_name) not between 3 and 24 or desired_name ~ '[[:cntrl:]<>]' or desired_name ~* '(https?://|www\.)' then return quiz_private.failure('INVALID_NAME'); end if;
    if profile.name_changed_at > now()-interval '1 minute' then return quiz_private.failure('RATE_LIMIT',429); end if;
    update quiz_private.player_profiles set display_name=desired_name,name_changed_at=now() where id=actor;
    return jsonb_build_object('profile',jsonb_build_object('name',desired_name));
  elsif operation='create' then
    request_uuid=(body->>'requestId')::uuid;
    if request_uuid is null then return quiz_private.failure('INVALID_REQUEST'); end if;
    select * into m from quiz_private.matches where creator_id=actor and create_request_id=request_uuid;
    if found then return quiz_private.match_view(actor,m.id); end if;
    if body->>'timingVersion' IS DISTINCT FROM '2' then return quiz_private.failure('UPDATE_REQUIRED',409); end if;
    if (select count(*) from quiz_private.matches where creator_id=actor and created_at>now()-interval '1 hour')>=5 or (select count(*) from quiz_private.matches where creator_id=actor and state not in ('completed','expired','cancelled') and expires_at>now())>=3 then return quiz_private.failure('RATE_LIMIT',429); end if;
    select active_scope into selected_scope from quiz_private.online_content_config where singleton=true;
    if selected_scope is null then return quiz_private.failure('CONTENT_NOT_READY',503); end if;
    select quiz_private.async_manifest_recent(selected_scope,actor) into manifest;
    if jsonb_array_length(manifest) is distinct from 10 then return quiz_private.failure('CONTENT_NOT_READY',503); end if;
    invite=encode(extensions.gen_random_bytes(32),'hex');
    insert into quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash,content_scope) values(actor,request_uuid,manifest,encode(extensions.digest(manifest::text,'sha256'),'hex'),extensions.digest(invite,'sha256'),selected_scope) returning * into m;
    insert into quiz_private.quiz_sessions(match_id,player_id) values(m.id,actor) returning id into session_uuid;
    insert into quiz_private.match_players values(m.id,'a',actor,session_uuid);
    return quiz_private.match_view(actor,m.id)||jsonb_build_object('inviteToken',invite);
  elsif operation='join' then
    if profile.join_window < now()-interval '1 minute' then profile.join_count=0; profile.join_window=now(); end if;
    if profile.join_count>=10 then return quiz_private.failure('RATE_LIMIT',429); end if;
    update quiz_private.player_profiles set join_count=profile.join_count+1,join_window=profile.join_window where id=actor;
    invite=body->>'token';
    if invite is null or invite !~ '^[0-9a-f]{64}$' then return quiz_private.failure('INVALID_INVITE',404); end if;
    select * into m from quiz_private.matches where invite_hash=extensions.digest(invite,'sha256') for update;
    if not found then return quiz_private.failure('INVALID_INVITE',404); end if;
    if m.creator_id=actor then return quiz_private.failure('SELF_JOIN',409); end if;
    if m.state in ('cancelled','expired') or m.expires_at<=clock_timestamp() then return quiz_private.failure('INVITE_CLOSED',410); end if;
    if exists(select 1 from quiz_private.match_players where match_id=m.id and player_id=actor) then return quiz_private.match_view(actor,m.id); end if;
    if m.state='completed' or exists(select 1 from quiz_private.match_players where match_id=m.id and slot='b') then return quiz_private.failure('INVITE_CLOSED',410); end if;
    insert into quiz_private.quiz_sessions(match_id,player_id) values(m.id,actor) returning id into session_uuid;
    insert into quiz_private.match_players values(m.id,'b',actor,session_uuid);
    update quiz_private.matches set revision=revision+1 where id=m.id;
    return quiz_private.match_view(actor,m.id);
  end if;
  if operation not in ('get','start','answer','expire','invite','cancel') then return quiz_private.failure('INVALID_OPERATION'); end if;
  match_uuid=(body->>'matchId')::uuid;
  select * into m from quiz_private.matches where id=match_uuid for update;
  if not found then return quiz_private.failure('MATCH_NOT_FOUND',404); end if;
  select p.slot,p.session_id into actor_slot,session_uuid from quiz_private.match_players p where p.match_id=m.id and p.player_id=actor;
  if not found then return quiz_private.failure('MATCH_NOT_FOUND',404); end if;
  select * into session_row from quiz_private.quiz_sessions where id=session_uuid;
  if m.answer_seconds IS NOT NULL AND ((operation='start' AND session_row.completed_at IS NULL) OR (operation IN('answer','expire') OR (operation='get' AND session_row.started_at IS NOT NULL AND session_row.completed_at IS NULL)))
    AND body->>'timingVersion' IS DISTINCT FROM '2' then return quiz_private.failure('UPDATE_REQUIRED',409); end if;
  received=clock_timestamp();
  if operation IN('answer','expire') then
    request_uuid=(body->>'requestId')::uuid; position_number=(body->>'position')::integer; answer_id=body->>'optionId';
    if request_uuid is null or position_number is null or (operation='answer' and answer_id is null) then return quiz_private.failure('INVALID_REQUEST'); end if;
    select * into old_answer from quiz_private.quiz_attempts where session_id=session_row.id and request_id=request_uuid;
    if found then
      if old_answer.position<>position_number or old_answer.option_id IS DISTINCT FROM answer_id then return quiz_private.failure('IDEMPOTENCY_CONFLICT',409); end if;
      return quiz_private.match_view(actor,m.id);
    end if;
  end if;
  if m.state not in ('completed','expired','cancelled') and m.expires_at<=clock_timestamp() then
    update quiz_private.matches set state='expired',revision=revision+1 where id=m.id; m.state='expired';
  end if;
  if operation='get' then
    if m.answer_seconds IS NOT NULL AND session_row.question_opened_at IS NOT NULL AND session_row.completed_at IS NULL
       AND received>=session_row.question_opened_at+make_interval(secs=>m.answer_seconds)
       AND m.state NOT IN('completed','expired','cancelled') then
      operation='expire'; request_uuid=gen_random_uuid();
      position_number=(select count(*)+1 from quiz_private.quiz_attempts where session_id=session_row.id);
    else return quiz_private.match_view(actor,m.id); end if;
  end if;
  if m.state in ('completed','expired','cancelled') then return quiz_private.failure('MATCH_CLOSED',410); end if;
  if operation='invite' then
    if m.creator_id<>actor or exists(select 1 from quiz_private.match_players where match_id=m.id and slot='b') then return quiz_private.failure('INVITE_CLOSED',409); end if;
    invite=encode(extensions.gen_random_bytes(32),'hex');
    update quiz_private.matches set invite_hash=extensions.digest(invite,'sha256'),revision=revision+1 where id=m.id;
    return quiz_private.match_view(actor,m.id)||jsonb_build_object('inviteToken',invite);
  elsif operation='cancel' then
    if m.creator_id<>actor or exists(select 1 from quiz_private.match_players p join quiz_private.quiz_sessions s on s.id=p.session_id where p.match_id=m.id and p.slot='b' and s.started_at is not null) then return quiz_private.failure('CANNOT_CANCEL',409); end if;
    update quiz_private.matches set state='cancelled',revision=revision+1 where id=m.id;
  elsif operation='start' then
    if session_row.completed_at is not null then return quiz_private.match_view(actor,m.id); end if;
    if actor_slot='b' and not exists(select 1 from quiz_private.direct_challenges d where d.match_id=m.id and d.state='accepted') and not exists(select 1 from quiz_private.match_players p join quiz_private.quiz_sessions s on s.id=p.session_id where p.match_id=m.id and p.slot='a' and s.completed_at is not null) then return quiz_private.failure('WAIT_FOR_A',409); end if;
    if session_row.started_at is null then
      update quiz_private.quiz_sessions set started_at=received,question_opened_at=CASE WHEN m.answer_seconds IS NOT NULL THEN received END where id=session_row.id;
      update quiz_private.matches set state='in_progress',revision=revision+1 where id=m.id;
    end if;
  elsif operation IN('answer','expire') then
    if session_row.started_at is null or session_row.completed_at is not null then return quiz_private.failure('SESSION_NOT_PLAYING',409); end if;
    if position_number<>(select count(*)+1 from quiz_private.quiz_attempts where session_id=session_row.id) or position_number not between 1 and 10 then return quiz_private.failure('ANSWER_LOCKED',409); end if;
    if m.answer_seconds IS NOT NULL then
      if session_row.question_opened_at IS NULL then return quiz_private.failure('SESSION_NOT_PLAYING',409); end if;
      if operation='expire' then
        if received<session_row.question_opened_at+make_interval(secs=>m.answer_seconds) then return quiz_private.failure('ANSWER_NOT_DUE',409); end if;
        timed_out=true;
      elsif received>=session_row.question_opened_at+make_interval(secs=>m.answer_seconds) then return quiz_private.failure('ANSWER_LATE',409);
      end if;
    elsif operation='expire' then return quiz_private.failure('INVALID_OPERATION'); end if;
    q=m.question_set->(position_number-1);
    if NOT timed_out AND not exists(select 1 from jsonb_array_elements(q->'options') o where o->>'id'=answer_id) then return quiz_private.failure('INVALID_OPTION'); end if;
    insert into quiz_private.quiz_attempts(session_id,position,option_id,request_id,is_correct,timed_out,received_at) select session_row.id,position_number,CASE WHEN timed_out THEN NULL ELSE answer_id END,request_uuid,NOT timed_out AND k.correct_option_id=answer_id,timed_out,CASE WHEN timed_out THEN session_row.question_opened_at+make_interval(secs=>m.answer_seconds) ELSE received END from quiz_private.quiz_answer_keys k where k.question_id=q->>'id' and k.question_version=(q->>'version')::integer;
    if not found then raise exception 'Missing answer key'; end if;
    update quiz_private.quiz_sessions set question_opened_at=CASE WHEN m.answer_seconds IS NOT NULL AND position_number<10 THEN clock_timestamp() END where id=session_row.id;
    if position_number=10 then
      select count(*) filter(where is_correct) into correct_number from quiz_private.quiz_attempts where session_id=session_row.id;
      update quiz_private.quiz_sessions set completed_at=received,correct_count=correct_number where id=session_row.id;
      if (select count(*) from quiz_private.quiz_sessions where match_id=m.id and completed_at is not null)=2 then
        select s.correct_count into score_a from quiz_private.match_players p join quiz_private.quiz_sessions s on s.id=p.session_id where p.match_id=m.id and p.slot='a';
        select s.correct_count into score_b from quiz_private.match_players p join quiz_private.quiz_sessions s on s.id=p.session_id where p.match_id=m.id and p.slot='b';
        insert into quiz_private.score_ledger(match_id,player_id,score,rule_version) select m.id,player_id,correct_count*100,1 from quiz_private.quiz_sessions where match_id=m.id;
        update quiz_private.matches set state='completed',result=jsonb_build_object('winner',case when score_a=score_b then 'tie' when score_a>score_b then 'a' else 'b' end),revision=revision+1 where id=m.id;
      else update quiz_private.matches set state='waiting_for_result',revision=revision+1 where id=m.id;
      end if;
    else update quiz_private.matches set revision=revision+1 where id=m.id;
    end if;
  end if;
  return quiz_private.match_view(actor,m.id);
end $$;
revoke all on function public.online_duel_command(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.online_duel_command(uuid,text,jsonb) to service_role;

COMMIT;
