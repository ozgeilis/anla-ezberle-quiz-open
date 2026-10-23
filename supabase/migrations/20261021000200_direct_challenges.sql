-- Username-to-player challenges reuse the authoritative immutable duel engine.
alter table quiz_private.player_profiles
 add column challenge_window timestamptz not null default now(),
 add column challenge_count integer not null default 0,
 add column inbox_window timestamptz not null default now(),
 add column inbox_count integer not null default 0;
create table quiz_private.direct_challenges (
 id uuid primary key default gen_random_uuid(),
 sender uuid not null references quiz_private.player_profiles(id) on delete cascade,
 recipient uuid not null references quiz_private.player_profiles(id) on delete cascade,
 request_id uuid not null,
 match_request_id uuid not null default gen_random_uuid(),
 state text not null default 'pending' check(state in ('pending','accepted','declined','cancelled','expired')),
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '24 hours',
 match_id uuid references quiz_private.matches(id),
 check(sender<>recipient),
 check((state='accepted')=(match_id is not null)),
 unique(sender,request_id)
);
create unique index direct_pending_pair on quiz_private.direct_challenges(least(sender,recipient),greatest(sender,recipient)) where state='pending';
create index direct_recipient_created on quiz_private.direct_challenges(recipient,created_at desc);
create index direct_sender_created on quiz_private.direct_challenges(sender,created_at desc);
alter table quiz_private.direct_challenges enable row level security;
alter table quiz_private.direct_challenges force row level security;
revoke all on quiz_private.direct_challenges from public,anon,authenticated;

-- Only this minimal recipient-owned event envelope is exposed to Realtime.
-- Never publish answer keys, answers, invite tokens, emails or private profiles.
create table public.player_notifications (
 id uuid primary key default gen_random_uuid(),
 recipient_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('friend_request','friend_accepted','challenge_received','challenge_accepted','challenge_declined','challenge_cancelled','turn_ready','match_completed')),
 reference_id uuid not null,
 created_at timestamptz not null default now(),
 read_at timestamptz
);
create index player_notifications_inbox on public.player_notifications(recipient_id,created_at desc);
create index player_notifications_unread on public.player_notifications(recipient_id) where read_at is null;
alter table public.player_notifications enable row level security;
alter table public.player_notifications force row level security;
revoke all on public.player_notifications from public,anon,authenticated;
grant select on public.player_notifications to authenticated;
create policy own_notifications on public.player_notifications for select to authenticated using(recipient_id=(select auth.uid()));
do $$ begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  alter publication supabase_realtime add table public.player_notifications;
 end if;
end $$;

create function quiz_private.notify_player(recipient uuid, event_kind text, reference uuid) returns void
language sql security definer set search_path='' as $$
 insert into public.player_notifications(recipient_id,kind,reference_id) values(recipient,event_kind,reference)
$$;
create function quiz_private.friend_notification() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='INSERT' then perform quiz_private.notify_player(new.recipient,'friend_request',new.id);
 elsif new.state='accepted' and old.state='pending' then perform quiz_private.notify_player(new.sender,'friend_accepted',new.id);
 end if;
 return new;
end $$;
create trigger notify_friend after insert or update on quiz_private.friendships for each row execute function quiz_private.friend_notification();
create function quiz_private.match_notification() returns trigger
language plpgsql security definer set search_path='' as $$
declare player uuid;
begin
 if new.state='completed' and old.state<>'completed' then
  for player in select player_id from quiz_private.match_players where match_id=new.id loop
   perform quiz_private.notify_player(player,'match_completed',new.id);
  end loop;
 elsif new.state='waiting_for_result' and old.state<>'waiting_for_result' then
  for player in select s.player_id from quiz_private.quiz_sessions s where s.match_id=new.id and s.completed_at is null loop
   perform quiz_private.notify_player(player,'turn_ready',new.id);
  end loop;
 end if;
 return new;
end $$;
create trigger notify_match after update on quiz_private.matches for each row execute function quiz_private.match_notification();

create function quiz_private.challenge_view(actor uuid, challenge uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',c.id,'incoming',c.recipient=actor,
 'state',case when c.state='pending' and c.expires_at<=now() then 'expired' else c.state end,
 'createdAt',c.created_at,'expiresAt',c.expires_at,'matchId',c.match_id,
 'matchState',(select case when m.expires_at<=now() and m.state not in('completed','expired','cancelled') then 'expired' else m.state end from quiz_private.matches m where m.id=c.match_id),
 'player',quiz_private.social_player(case when c.sender=actor then c.recipient else c.sender end))
 from quiz_private.direct_challenges c where c.id=challenge and actor in(c.sender,c.recipient)
$$;

create table quiz_private.player_service_config (
 singleton boolean primary key default true check(singleton),
 public_enrollment_enabled boolean not null default false
);
insert into quiz_private.player_service_config values(true,false);
alter table quiz_private.player_service_config enable row level security;
alter table quiz_private.player_service_config force row level security;
revoke all on quiz_private.player_service_config from public,anon,authenticated;

create function public.player_matchmaking_command(actor uuid, operation text, body jsonb default '{}'::jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 p quiz_private.player_profiles;
 c quiz_private.direct_challenges;
 target uuid;
 request uuid;
 item_id uuid;
 answer text;
 result jsonb;
 match_uuid uuid;
 session_uuid uuid;
begin
 if actor is null or jsonb_typeof(body) is distinct from 'object' then return quiz_private.failure('INVALID_REQUEST'); end if;
 if not exists(select 1 from auth.users where id=actor and email_confirmed_at is not null and not is_anonymous) then return quiz_private.failure('SIGN_IN_REQUIRED',401); end if;
 if operation='account_bootstrap' then
  if not exists(select 1 from quiz_private.player_profiles where id=actor) then
   if not (select public_enrollment_enabled from quiz_private.player_service_config where singleton) then return quiz_private.failure('REGISTRATION_CLOSED',403); end if;
   insert into quiz_private.player_profiles(id,display_name,access_enabled) values(actor,'Oyuncu',true) on conflict(id) do nothing;
  end if;
 end if;
 select * into p from quiz_private.player_profiles where id=actor;
 if not found or not p.access_enabled then return quiz_private.failure('CLOSED_TEST_ONLY',403); end if;
 if operation='account_bootstrap' then return jsonb_build_object('ready',true); end if;
 if operation in('inbox','notification_read') then
  select * into p from quiz_private.player_profiles where id=actor for update;
  if p.inbox_window<now()-interval '1 minute' then p.inbox_window=now();p.inbox_count=0; end if;
  if p.inbox_count>=120 then return quiz_private.failure('RATE_LIMIT',429); end if;
  update quiz_private.player_profiles set inbox_window=p.inbox_window,inbox_count=p.inbox_count+1 where id=actor;
 end if;
 -- A separate bucket keeps background inbox sync independent from typing/search.
 if operation='inbox' then
  return jsonb_build_object(
   'notifications',coalesce((select jsonb_agg(x.item order by x.created_at desc) from (
    select jsonb_build_object('id',n.id,'kind',n.kind,'referenceId',n.reference_id,'createdAt',n.created_at,'read',n.read_at is not null) item,n.created_at
    from public.player_notifications n where n.recipient_id=actor order by n.created_at desc limit 50
   ) x),'[]'::jsonb),
   'unreadCount',(select count(*) from public.player_notifications where recipient_id=actor and read_at is null),
   'challenges',coalesce((select jsonb_agg(x.item order by x.created_at desc) from (
    select quiz_private.challenge_view(actor,d.id) item,d.created_at from quiz_private.direct_challenges d
    where actor in(d.sender,d.recipient) order by d.created_at desc limit 30
   ) x),'[]'::jsonb));
 end if;
 if operation='notification_read' then
  if body->>'notificationId'='all' then
   update public.player_notifications set read_at=now() where recipient_id=actor and read_at is null;
   return jsonb_build_object('saved',true);
  end if;
  if coalesce(body->>'notificationId','') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then return quiz_private.failure('INVALID_REQUEST'); end if;
  update public.player_notifications set read_at=coalesce(read_at,now()) where id=(body->>'notificationId')::uuid and recipient_id=actor;
  if not found then return quiz_private.failure('NOTIFICATION_NOT_FOUND',404); end if;
  return jsonb_build_object('saved',true);
 end if;
 if operation='challenge_send' then
  if p.username is null then return quiz_private.failure('USERNAME_REQUIRED'); end if;
  if coalesce(body->>'playerId','') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' or coalesce(body->>'requestId','') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then return quiz_private.failure('INVALID_REQUEST'); end if;
  target=(body->>'playerId')::uuid; request=(body->>'requestId')::uuid;
  if target=actor then return quiz_private.failure('SELF_CHALLENGE',409); end if;
  -- Every path taking two profiles uses UUID order, then challenge, then match.
  perform id from quiz_private.player_profiles where id in(actor,target) order by id for update;
  select * into p from quiz_private.player_profiles where id=actor;
  select * into c from quiz_private.direct_challenges where sender=actor and request_id=request;
  if found then
   if c.recipient<>target then return quiz_private.failure('IDEMPOTENCY_CONFLICT',409); end if;
   return jsonb_build_object('challenge',quiz_private.challenge_view(actor,c.id));
  end if;
  if not exists(select 1 from quiz_private.player_profiles t where t.id=target and t.access_enabled and t.username is not null and (
   t.discoverable or exists(select 1 from quiz_private.friendships f where f.state='accepted' and least(f.sender,f.recipient)=least(actor,target) and greatest(f.sender,f.recipient)=greatest(actor,target)))) then return quiz_private.failure('PLAYER_NOT_FOUND',404); end if;
  if p.challenge_window < now()-interval '1 hour' then p.challenge_window=now();p.challenge_count=0; end if;
  if p.challenge_count>=20 then return quiz_private.failure('RATE_LIMIT',429); end if;
  update quiz_private.player_profiles set challenge_window=p.challenge_window,challenge_count=p.challenge_count+1 where id=actor;
  update quiz_private.direct_challenges set state='expired' where state='pending' and expires_at<=now() and least(sender,recipient)=least(actor,target) and greatest(sender,recipient)=greatest(actor,target);
  if exists(select 1 from quiz_private.direct_challenges where state='pending' and least(sender,recipient)=least(actor,target) and greatest(sender,recipient)=greatest(actor,target)) then return quiz_private.failure('CHALLENGE_EXISTS',409); end if;
  if (select count(*) from quiz_private.direct_challenges where recipient=target and state='pending' and expires_at>now())>=30 then return quiz_private.failure('RATE_LIMIT',429); end if;
  insert into quiz_private.direct_challenges(sender,recipient,request_id) values(actor,target,request) returning * into c;
  perform quiz_private.notify_player(target,'challenge_received',c.id);
  return jsonb_build_object('challenge',quiz_private.challenge_view(actor,c.id));
 elsif operation='challenge_reply' then
  if coalesce(body->>'challengeId','') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then return quiz_private.failure('INVALID_REQUEST'); end if;
  item_id=(body->>'challengeId')::uuid; answer=body->>'action';
  if answer is null or answer not in('accept','decline','cancel') then return quiz_private.failure('INVALID_REQUEST'); end if;
  select * into c from quiz_private.direct_challenges where id=item_id and actor in(sender,recipient);
  if not found then return quiz_private.failure('CHALLENGE_NOT_FOUND',404); end if;
  perform id from quiz_private.player_profiles where id in(c.sender,c.recipient) order by id for update;
  select * into c from quiz_private.direct_challenges where id=item_id for update;
  if (answer='cancel' and actor<>c.sender) or (answer<>'cancel' and actor<>c.recipient) then return quiz_private.failure('CHALLENGE_FORBIDDEN',403); end if;
  if answer='accept' and c.state='accepted' then return jsonb_build_object('challenge',quiz_private.challenge_view(actor,c.id)); end if;
  if c.state<>'pending' or c.expires_at<=now() then return quiz_private.failure('CHALLENGE_CLOSED',410); end if;
  if not exists(select 1 from quiz_private.player_profiles where id=c.sender and access_enabled) or not exists(select 1 from quiz_private.player_profiles where id=c.recipient and access_enabled) then return quiz_private.failure('PLAYER_NOT_FOUND',404); end if;
  if answer='accept' then
   result=public.online_duel_command(c.sender,'create',jsonb_build_object('requestId',c.match_request_id));
   if result ? 'error' then return result; end if;
   match_uuid=(result->>'id')::uuid;
   insert into quiz_private.quiz_sessions(match_id,player_id) values(match_uuid,c.recipient) returning id into session_uuid;
   insert into quiz_private.match_players(match_id,slot,player_id,session_id) values(match_uuid,'b',c.recipient,session_uuid);
   update quiz_private.matches set revision=revision+1 where id=match_uuid;
   update quiz_private.direct_challenges set state='accepted',match_id=match_uuid where id=c.id;
   perform quiz_private.notify_player(c.sender,'challenge_accepted',c.id);
   -- Recipient is already here; a durable event also resumes on another device.
   perform quiz_private.notify_player(c.recipient,'challenge_accepted',c.id);
  else
   update quiz_private.direct_challenges set state=case when answer='cancel' then 'cancelled' else 'declined' end where id=c.id;
   perform quiz_private.notify_player(case when answer='cancel' then c.recipient else c.sender end,case when answer='cancel' then 'challenge_cancelled' else 'challenge_declined' end,c.id);
  end if;
  return jsonb_build_object('challenge',quiz_private.challenge_view(actor,c.id));
 end if;
 return quiz_private.failure('INVALID_OPERATION');
exception when invalid_text_representation then return quiz_private.failure('INVALID_REQUEST');
 when unique_violation then return quiz_private.failure('CHALLENGE_EXISTS',409);
end $$;
revoke all on all functions in schema quiz_private from public,anon,authenticated;
revoke all on function public.player_matchmaking_command(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.player_matchmaking_command(uuid,text,jsonb) to service_role;

-- Direct opponents may play independently; historical link duels keep A-before-B.
create or replace function quiz_private.match_view(actor uuid, match_uuid uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
select jsonb_build_object(
 'direct',exists(select 1 from quiz_private.direct_challenges d where d.match_id=m.id and d.state='accepted'),'id',m.id,'state',m.state,'revision',m.revision,'createdAt',m.created_at,'expiresAt',m.expires_at,
 'manifestHash',m.manifest_hash,'ruleVersion',m.rule_version,'scope',m.content_scope,
 'slot',mp.slot,'started',s.started_at is not null,'finished',s.completed_at is not null,
 'questions',case when s.started_at is not null then m.question_set else '[]'::jsonb end,
 'answers',coalesce((select jsonb_agg(jsonb_build_object('position',a.position,'optionId',a.option_id,'requestId',a.request_id) order by a.position) from quiz_private.quiz_attempts a where a.session_id=s.id),'[]'::jsonb),
 'players',(select jsonb_agg(jsonb_build_object('slot',p.slot,'name',pr.display_name,'finished',ps.completed_at is not null,'correct',case when m.state='completed' then ps.correct_count end,'wrong',case when m.state='completed' then 10-ps.correct_count end,'score',case when m.state='completed' then ps.correct_count*100 end) order by p.slot) from quiz_private.match_players p join quiz_private.player_profiles pr on pr.id=p.player_id join quiz_private.quiz_sessions ps on ps.id=p.session_id where p.match_id=m.id),
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
    select jsonb_agg(x.item order by x.sort_key) into manifest from (select jsonb_build_object('id',id,'version',version,'prompt',prompt,'options',options) item,random() sort_key from (select distinct on (id) * from quiz_private.quiz_questions where content_scope=selected_scope order by id,version desc) latest order by random() limit 10) x;
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

-- Public readiness flag only; never reveals SMTP credentials or private config.
create function public.online_service_capabilities() returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('registrationEnabled',public_enrollment_enabled)
 from quiz_private.player_service_config where singleton
$$;
revoke all on function public.online_service_capabilities() from public;
grant execute on function public.online_service_capabilities() to anon,authenticated,service_role;
