-- Closed development test only. No religious content is seeded by this migration.
-- Every command is one database transaction; lock order: actor profile, then match.
create schema if not exists quiz_private;
create extension if not exists pgcrypto with schema extensions;
revoke all on schema quiz_private from public, anon, authenticated;

create table if not exists quiz_private.player_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Test oyuncu' check (char_length(display_name) between 3 and 24 and display_name !~ '[[:cntrl:]<>]' and display_name !~* '(https?://|www\.)'),
  access_enabled boolean not null default false,
  name_changed_at timestamptz,
  join_window timestamptz not null default now(),
  join_count integer not null default 0
);
create table if not exists quiz_private.quiz_questions (
  id text not null,
  version integer not null check (version > 0),
  prompt text not null,
  options jsonb not null check (jsonb_array_length(options) = 4),
  content_scope text not null check (content_scope = 'synthetic_test'),
  primary key (id, version)
);
create table if not exists quiz_private.quiz_answer_keys (
  question_id text not null,
  question_version integer not null,
  correct_option_id text not null check (correct_option_id in ('a','b','c','d')),
  explanation text not null,
  primary key (question_id, question_version),
  foreign key (question_id, question_version) references quiz_private.quiz_questions(id, version)
);
create table if not exists quiz_private.matches (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references quiz_private.player_profiles(id),
  create_request_id uuid not null,
  question_set jsonb not null check (jsonb_array_length(question_set) = 10),
  manifest_hash text not null,
  rule_version integer not null default 1 check (rule_version = 1),
  invite_hash bytea not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '24 hours'),
  state text not null default 'waiting_for_opponent' check (state in ('created','waiting_for_opponent','in_progress','waiting_for_result','completed','expired','cancelled')),
  revision integer not null default 1,
  result jsonb,
  unique (creator_id, create_request_id)
);
create table if not exists quiz_private.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references quiz_private.matches(id),
  player_id uuid not null references quiz_private.player_profiles(id),
  started_at timestamptz,
  completed_at timestamptz,
  correct_count integer check (correct_count between 0 and 10),
  unique (match_id, player_id)
);
create table if not exists quiz_private.match_players (
  match_id uuid not null references quiz_private.matches(id),
  slot text not null check (slot in ('a','b')),
  player_id uuid not null references quiz_private.player_profiles(id),
  session_id uuid not null unique references quiz_private.quiz_sessions(id),
  primary key (match_id, slot),
  unique (match_id, player_id)
);
create table if not exists quiz_private.quiz_attempts (
  session_id uuid not null references quiz_private.quiz_sessions(id),
  position integer not null check (position between 1 and 10),
  option_id text not null check (option_id in ('a','b','c','d')),
  request_id uuid not null,
  is_correct boolean not null,
  received_at timestamptz not null default now(),
  primary key (session_id, position),
  unique (session_id, request_id)
);
create table if not exists quiz_private.score_ledger (
  match_id uuid not null references quiz_private.matches(id),
  player_id uuid not null references quiz_private.player_profiles(id),
  score integer not null check (score between 0 and 1000 and score % 100 = 0),
  rule_version integer not null check (rule_version = 1),
  recorded_at timestamptz not null default now(),
  primary key (match_id, player_id)
);
create index if not exists matches_creator_created_idx on quiz_private.matches(creator_id, created_at);
create index if not exists matches_invite_hash_idx on quiz_private.matches(invite_hash);
create index if not exists match_players_player_idx on quiz_private.match_players(player_id);

-- Default-deny RLS plus no client schema/table privileges. All access is via the
-- authenticated Edge API, which invokes the service-only command below.
do $$ declare t text; begin
  foreach t in array array['player_profiles','quiz_questions','quiz_answer_keys','quiz_sessions','quiz_attempts','matches','match_players','score_ledger'] loop
    execute format('alter table quiz_private.%I enable row level security', t);
    execute format('alter table quiz_private.%I force row level security', t);
    execute format('revoke all on table quiz_private.%I from public, anon, authenticated', t);
  end loop;
end $$;
alter default privileges in schema quiz_private revoke all on tables from public, anon, authenticated;
alter default privileges in schema quiz_private revoke execute on functions from public, anon, authenticated;

create or replace function quiz_private.immutable_content() returns trigger
language plpgsql set search_path = '' as $$
begin raise exception 'Content versions are immutable; insert a new version'; end $$;
drop trigger if exists immutable_question on quiz_private.quiz_questions;
create trigger immutable_question before update or delete on quiz_private.quiz_questions for each row execute function quiz_private.immutable_content();
drop trigger if exists immutable_answer_key on quiz_private.quiz_answer_keys;
create trigger immutable_answer_key before update or delete on quiz_private.quiz_answer_keys for each row execute function quiz_private.immutable_content();

-- Accepted answers and awarded ledger rows are append-only, even for the
-- normal server workflow. Corrections require a separately reviewed migration.
drop trigger if exists immutable_attempt on quiz_private.quiz_attempts;
create trigger immutable_attempt before update or delete on quiz_private.quiz_attempts for each row execute function quiz_private.immutable_content();
drop trigger if exists immutable_score on quiz_private.score_ledger;
create trigger immutable_score before update or delete on quiz_private.score_ledger for each row execute function quiz_private.immutable_content();

create or replace function quiz_private.guard_match() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.question_set is distinct from old.question_set or new.manifest_hash is distinct from old.manifest_hash
     or new.rule_version <> old.rule_version or new.creator_id <> old.creator_id
     or new.created_at <> old.created_at or new.expires_at <> old.expires_at
     or new.create_request_id <> old.create_request_id then
    raise exception 'Match manifest and deadlines are immutable';
  end if;
  if old.state in ('completed','expired','cancelled') then raise exception 'Terminal match is immutable'; end if;
  if new.state <> old.state and not (
    (old.state = 'created' and new.state in ('waiting_for_opponent','in_progress','cancelled','expired')) or
    (old.state = 'waiting_for_opponent' and new.state in ('in_progress','cancelled','expired')) or
    (old.state = 'in_progress' and new.state in ('waiting_for_result','completed','cancelled','expired')) or
    (old.state = 'waiting_for_result' and new.state in ('in_progress','completed','cancelled','expired'))
  ) then raise exception 'Invalid match transition'; end if;
  return new;
end $$;
drop trigger if exists guard_match on quiz_private.matches;
create trigger guard_match before update on quiz_private.matches for each row execute function quiz_private.guard_match();

create or replace function quiz_private.failure(code text, status integer default 400) returns jsonb
language sql immutable set search_path = '' as $$ select jsonb_build_object('error',code,'status',status) $$;

-- This view deliberately never returns invite hashes, private profiles, opponent
-- answers, or partial correctness/scores. Keys unlock only after both finish.
create or replace function quiz_private.match_view(actor uuid, match_uuid uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
select jsonb_build_object(
 'id',m.id,'state',m.state,'revision',m.revision,'createdAt',m.created_at,'expiresAt',m.expires_at,
 'manifestHash',m.manifest_hash,'ruleVersion',m.rule_version,'scope','synthetic_test',
 'slot',mp.slot,'started',s.started_at is not null,'finished',s.completed_at is not null,
 'questions',case when s.started_at is not null then m.question_set else '[]'::jsonb end,
 'answers',coalesce((select jsonb_agg(jsonb_build_object('position',a.position,'optionId',a.option_id,'requestId',a.request_id) order by a.position) from quiz_private.quiz_attempts a where a.session_id=s.id),'[]'::jsonb),
 'players',(select jsonb_agg(jsonb_build_object('slot',p.slot,'name',pr.display_name,'finished',ps.completed_at is not null,'correct',case when m.state='completed' then ps.correct_count end,'wrong',case when m.state='completed' then 10-ps.correct_count end,'score',case when m.state='completed' then ps.correct_count*100 end) order by p.slot) from quiz_private.match_players p join quiz_private.player_profiles pr on pr.id=p.player_id join quiz_private.quiz_sessions ps on ps.id=p.session_id where p.match_id=m.id),
 'result',case when m.state='completed' then m.result end,
 'review',case when m.state='completed' then (select jsonb_agg(jsonb_build_object('id',q.value->>'id','version',(q.value->>'version')::integer,'correctOptionId',k.correct_option_id,'explanation',k.explanation) order by q.ordinality) from jsonb_array_elements(m.question_set) with ordinality q(value,ordinality) join quiz_private.quiz_answer_keys k on k.question_id=q.value->>'id' and k.question_version=(q.value->>'version')::integer) else '[]'::jsonb end
)
from quiz_private.matches m join quiz_private.match_players mp on mp.match_id=m.id and mp.player_id=actor join quiz_private.quiz_sessions s on s.id=mp.session_id where m.id=match_uuid;
$$;

-- Only service_role may execute. actor is supplied by Edge after getUser(JWT),
-- never from a playerId/score/winner field in an untrusted request.
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
    select jsonb_agg(x.item order by x.sort_key) into manifest from (select jsonb_build_object('id',id,'version',version,'prompt',prompt,'options',options) item,random() sort_key from (select distinct on (id) * from quiz_private.quiz_questions where content_scope='synthetic_test' order by id,version desc) latest order by random() limit 10) x;
    if jsonb_array_length(manifest) is distinct from 10 then return quiz_private.failure('CONTENT_NOT_READY',503); end if;
    invite=encode(extensions.gen_random_bytes(32),'hex');
    insert into quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash) values(actor,request_uuid,manifest,encode(extensions.digest(manifest::text,'sha256'),'hex'),extensions.digest(invite,'sha256')) returning * into m;
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
    if actor_slot='b' and not exists(select 1 from quiz_private.match_players p join quiz_private.quiz_sessions s on s.id=p.session_id where p.match_id=m.id and p.slot='a' and s.completed_at is not null) then return quiz_private.failure('WAIT_FOR_A',409); end if;
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
revoke all on all functions in schema quiz_private from public, anon, authenticated;
revoke all on function public.online_duel_command(uuid,text,jsonb) from public, anon, authenticated;
grant execute on function public.online_duel_command(uuid,text,jsonb) to service_role;

-- Explicit administrator provisioning; not exposed by the player Edge handler.
-- Retrying does not rename, reset a password, or reactivate a revoked account.
create or replace function public.online_duel_enroll_test_user(user_id uuid, display_name text) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if not exists(select 1 from auth.users where id=user_id and email_confirmed_at is not null) then raise exception 'Confirmed Auth test user required'; end if;
  insert into quiz_private.player_profiles(id,display_name,access_enabled) values(user_id,display_name,true) on conflict (id) do nothing;
  return jsonb_build_object('enabled',(select access_enabled from quiz_private.player_profiles where id=user_id));
end $$;
revoke all on function public.online_duel_enroll_test_user(uuid,text) from public, anon, authenticated;
grant execute on function public.online_duel_enroll_test_user(uuid,text) to service_role;
