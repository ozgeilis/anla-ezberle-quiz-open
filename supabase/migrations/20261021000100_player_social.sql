-- Authenticated, closed-test social API. No public table/view privileges.
alter table quiz_private.player_profiles
  add column username text,
  add column avatar integer not null default 0 check (avatar between 0 and 3),
  add column discoverable boolean not null default false,
  add column social_window timestamptz not null default now(),
  add column social_count integer not null default 0,
  add column friend_window timestamptz not null default now(),
  add column friend_count integer not null default 0;

create function quiz_private.valid_username(value text) returns boolean
language sql immutable set search_path = '' as $$
 select coalesce(value ~ '^[a-z0-9_]{3,20}$'
 and value !~ '^(admin|administrator|moderator|support|system|root|official|diyanet|tdv|anla_ezberle|deleted|null|undefined)$'
 and value !~ '(fuck|shit|nazi|siktir|orospu|amk|pic|yarrak)',false)
$$;
alter table quiz_private.player_profiles add constraint valid_username check (username is null or quiz_private.valid_username(username));
create unique index player_username_unique on quiz_private.player_profiles(lower(username)) where username is not null;
create table quiz_private.friendships (
 id uuid primary key default gen_random_uuid(),
 sender uuid not null references quiz_private.player_profiles(id) on delete cascade,
 recipient uuid not null references quiz_private.player_profiles(id) on delete cascade,
 state text not null default 'pending' check (state in ('pending','accepted')),
 created_at timestamptz not null default now(),
 check (sender <> recipient)
);
create unique index friendship_pair_unique on quiz_private.friendships(least(sender,recipient),greatest(sender,recipient));
create index friendships_recipient on quiz_private.friendships(recipient);
create index friendships_sender on quiz_private.friendships(sender);
alter table quiz_private.friendships enable row level security;
alter table quiz_private.friendships force row level security;
revoke all on quiz_private.friendships from public, anon, authenticated;

-- Only explicitly selected public fields. XP derives from immutable server ledger;
-- offline device progress is never trusted or uploaded as competitive XP.
create function quiz_private.social_player(player uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
 select jsonb_build_object('id',p.id,'name',p.display_name,'username',p.username,'avatar',p.avatar,
 'xp',coalesce((select sum(s.score)/10 from quiz_private.score_ledger s where s.player_id=p.id),0),
 'level',floor(coalesce((select sum(s.score)/10 from quiz_private.score_ledger s where s.player_id=p.id),0)/250)+1)
 from quiz_private.player_profiles p where p.id=player and p.access_enabled and p.username is not null
$$;
create function public.player_social_command(actor uuid, operation text, body jsonb default '{}'::jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
 p quiz_private.player_profiles;
 target quiz_private.player_profiles;
 f quiz_private.friendships;
 name_value text;
 query_value text;
 target_id uuid;
 items jsonb;
begin
 if actor is null or jsonb_typeof(body) <> 'object' then return quiz_private.failure('INVALID_REQUEST'); end if;
 select * into p from quiz_private.player_profiles where id=actor for update;
 if not found or not p.access_enabled then return quiz_private.failure('CLOSED_TEST_ONLY',403); end if;
 if not exists(select 1 from auth.users where id=actor and email_confirmed_at is not null and not is_anonymous) then return quiz_private.failure('SIGN_IN_REQUIRED',401); end if;
 if p.social_window < now()-interval '1 minute' then p.social_window=now(); p.social_count=0; end if;
 if p.social_count >= 60 then return quiz_private.failure('RATE_LIMIT',429); end if;
 update quiz_private.player_profiles set social_window=p.social_window,social_count=p.social_count+1 where id=actor;
 if operation='friend_send' and coalesce(body->>'playerId','') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then return quiz_private.failure('INVALID_REQUEST'); end if;
 if operation in ('friend_accept','friend_remove') and coalesce(body->>'friendshipId','') !~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' then return quiz_private.failure('INVALID_REQUEST'); end if;
 if operation='social_self' then
  return jsonb_build_object('profile',jsonb_build_object('name',p.display_name,'username',p.username,'avatar',p.avatar,'discoverable',p.discoverable),'player',quiz_private.social_player(actor));
 elsif operation='username_check' then
  name_value=body->>'username';
  return jsonb_build_object('available',quiz_private.valid_username(name_value) and not exists(select 1 from quiz_private.player_profiles where lower(username)=lower(name_value) and id<>actor));
 elsif operation='social_profile' then
  name_value=body->>'username';
  if not quiz_private.valid_username(name_value) then return quiz_private.failure('INVALID_USERNAME'); end if;
  if jsonb_typeof(body->'discoverable') is distinct from 'boolean' or jsonb_typeof(body->'avatar') is distinct from 'number' or (body->>'avatar') !~ '^[0-3]$' then return quiz_private.failure('INVALID_REQUEST'); end if;
  if exists(select 1 from quiz_private.player_profiles where lower(username)=lower(name_value) and id<>actor) then return quiz_private.failure('USERNAME_TAKEN',409); end if;
  query_value=normalize(trim(body->>'name'),NFC);
  if query_value is null or char_length(query_value) not between 3 and 24 or query_value ~ '[[:cntrl:]<>]' or query_value ~* '(https?://|www\.)' then return quiz_private.failure('INVALID_NAME'); end if;
  update quiz_private.player_profiles set username=name_value,display_name=query_value,avatar=(body->>'avatar')::integer,discoverable=(body->>'discoverable')::boolean where id=actor;
  return jsonb_build_object('saved',true);
 elsif operation='player_search' then
  query_value=body->>'query';
  if query_value is null or query_value !~ '^[a-z0-9_]{3,20}$' then return quiz_private.failure('INVALID_SEARCH'); end if;
  select coalesce(jsonb_agg(x.item),'[]'::jsonb) into items from (
   select quiz_private.social_player(id) item from quiz_private.player_profiles
   where access_enabled and discoverable and username is not null and id<>actor
   and left(username,length(query_value))=query_value order by username limit 20
  ) x;
  return jsonb_build_object('players',items);
 elsif operation='friends' then
  select coalesce(jsonb_agg(x.item order by x.created_at desc),'[]'::jsonb) into items from (
   select jsonb_build_object('id',r.id,'state',r.state,'incoming',r.recipient=actor,'player',quiz_private.social_player(case when r.sender=actor then r.recipient else r.sender end)) item,r.created_at
   from quiz_private.friendships r where (r.sender=actor or r.recipient=actor) order by r.created_at desc limit 200
  ) x;
  return jsonb_build_object('friendships',items);
 elsif operation='friend_send' then
  if p.username is null then return quiz_private.failure('USERNAME_REQUIRED'); end if;
  if p.friend_window < now()-interval '1 hour' then p.friend_window=now(); p.friend_count=0; end if;
  if p.friend_count>=20 then return quiz_private.failure('RATE_LIMIT',429); end if;
  update quiz_private.player_profiles set friend_window=p.friend_window,friend_count=p.friend_count+1 where id=actor;
  target_id=(body->>'playerId')::uuid;
  if target_id=actor then return quiz_private.failure('SELF_FRIEND',409); end if;
  select * into target from quiz_private.player_profiles where id=target_id and access_enabled and discoverable and username is not null;
  if not found then return quiz_private.failure('PLAYER_NOT_FOUND',404); end if;
  if exists(select 1 from quiz_private.friendships where least(sender,recipient)=least(actor,target_id) and greatest(sender,recipient)=greatest(actor,target_id)) then return quiz_private.failure('FRIEND_EXISTS',409); end if;
  if (select count(*) from quiz_private.friendships where sender=actor or recipient=actor)>=100 or (select count(*) from quiz_private.friendships where sender=target_id or recipient=target_id)>=100 then return quiz_private.failure('RATE_LIMIT',429); end if;
  insert into quiz_private.friendships(sender,recipient) values(actor,target_id);
  return jsonb_build_object('saved',true);
 elsif operation in ('friend_accept','friend_remove') then
  select * into f from quiz_private.friendships where id=(body->>'friendshipId')::uuid and (sender=actor or recipient=actor) for update;
  if not found then return quiz_private.failure('FRIEND_NOT_FOUND',404); end if;
  if operation='friend_accept' then
   if f.recipient<>actor or f.state<>'pending' then return quiz_private.failure('FRIEND_FORBIDDEN',403); end if;
   update quiz_private.friendships set state='accepted' where id=f.id;
  else
   delete from quiz_private.friendships where id=f.id;
  end if;
  return jsonb_build_object('saved',true);
 end if;
 return quiz_private.failure('INVALID_OPERATION');
exception
 when unique_violation then return quiz_private.failure(case when operation='social_profile' then 'USERNAME_TAKEN' else 'FRIEND_EXISTS' end,409);
 when invalid_text_representation then return quiz_private.failure('INVALID_REQUEST');
end $$;
revoke all on all functions in schema quiz_private from public,anon,authenticated;
revoke all on function public.player_social_command(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.player_social_command(uuid,text,jsonb) to service_role;
