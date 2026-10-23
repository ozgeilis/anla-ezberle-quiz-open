begin;
-- Stable-identity protection for older asynchronous duels, independent from
-- the live-room history selector. The 20-question synthetic pool is too small
-- to guarantee five disjoint 10-question rounds; minimize overlap instead.
create or replace function quiz_private.async_manifest_recent(scope text, player uuid)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 perform pg_advisory_xact_lock(hashtextextended('async-history:'||player::text,0));
 with previous as (
   select m.question_set, row_number() over (order by m.created_at desc,m.id desc) as age
   from quiz_private.matches m
   join quiz_private.match_players p on p.match_id=m.id and p.player_id=player
   where m.content_scope=scope and m.question_set is not null
   order by m.created_at desc,m.id desc limit 5
 ), recent_usage as (
   select question.value->>'id' id, count(*) as times_seen, min(previous.age) as most_recent
   from previous cross join lateral jsonb_array_elements(previous.question_set) question(value)
   group by question.value->>'id'
 ), latest as (
   select distinct on(q.id) q.id,q.version,q.prompt,q.options
   from quiz_private.quiz_questions q where q.content_scope=scope
   order by q.id,q.version desc
 ), chosen as (
   select jsonb_build_object('id',q.id,'version',q.version,'prompt',q.prompt,'options',q.options) item
   from latest q left join recent_usage u on u.id=q.id
   order by coalesce(u.times_seen,0) asc,coalesce(u.most_recent,999) desc,random()
   limit 10
 )
 select jsonb_agg(item order by random()) into result from chosen;
 return result;
end $$;
revoke all on function quiz_private.async_manifest_recent(text,uuid) from public,anon,authenticated;
grant execute on function quiz_private.async_manifest_recent(text,uuid) to service_role;

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
  if operation not in ('get','start','answer','invite','cancel') then return quiz_private.failure('INVALID_OPERATION'); end if;
  match_uuid=(body->>'matchId')::uuid;
  select * into m from quiz_private.matches where id=match_uuid for update;
  if not found then return quiz_private.failure('MATCH_NOT_FOUND',404); end if;
  select p.slot,p.session_id into actor_slot,session_uuid from quiz_private.match_players p where p.match_id=m.id and p.player_id=actor;
  if not found then return quiz_private.failure('MATCH_NOT_FOUND',404); end if;
  select * into session_row from quiz_private.quiz_sessions where id=session_uuid;
  if operation='answer' then
    request_uuid=(body->>'requestId')::uuid; position_number=(body->>'position')::integer; answer_id=body->>'optionId';
    if request_uuid is null or position_number is null or answer_id is null then return quiz_private.failure('INVALID_REQUEST'); end if;
    select * into old_answer from quiz_private.quiz_attempts where session_id=session_row.id and request_id=request_uuid;
    if found then
      if old_answer.position<>position_number or old_answer.option_id<>answer_id then return quiz_private.failure('IDEMPOTENCY_CONFLICT',409); end if;
      return quiz_private.match_view(actor,m.id);
    end if;
  end if;
  if m.state not in ('completed','expired','cancelled') and m.expires_at<=clock_timestamp() then
    update quiz_private.matches set state='expired',revision=revision+1 where id=m.id; m.state='expired';
  end if;
  if operation='get' then return quiz_private.match_view(actor,m.id); end if;
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
      update quiz_private.quiz_sessions set started_at=now() where id=session_row.id;
      update quiz_private.matches set state='in_progress',revision=revision+1 where id=m.id;
    end if;
  elsif operation='answer' then
    if session_row.started_at is null or session_row.completed_at is not null then return quiz_private.failure('SESSION_NOT_PLAYING',409); end if;
    if position_number<>(select count(*)+1 from quiz_private.quiz_attempts where session_id=session_row.id) or position_number not between 1 and 10 then return quiz_private.failure('ANSWER_LOCKED',409); end if;
    q=m.question_set->(position_number-1);
    if not exists(select 1 from jsonb_array_elements(q->'options') o where o->>'id'=answer_id) then return quiz_private.failure('INVALID_OPTION'); end if;
    insert into quiz_private.quiz_attempts(session_id,position,option_id,request_id,is_correct) select session_row.id,position_number,answer_id,request_uuid,k.correct_option_id=answer_id from quiz_private.quiz_answer_keys k where k.question_id=q->>'id' and k.question_version=(q->>'version')::integer;
    if not found then raise exception 'Missing answer key'; end if;
    if position_number=10 then
      select count(*) filter(where is_correct) into correct_number from quiz_private.quiz_attempts where session_id=session_row.id;
      update quiz_private.quiz_sessions set completed_at=now(),correct_count=correct_number where id=session_row.id;
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
commit;
