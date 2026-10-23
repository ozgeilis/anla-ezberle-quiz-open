-- Verified online achievements only. Offline scores are never accepted here.
alter table quiz_private.player_profiles
 add column share_achievements boolean not null default false,
 add column achievement_showcase text[] not null default '{}';
create table quiz_private.achievement_rules (
 id text primary key, metric text not null, target integer not null check(target>0)
);
insert into quiz_private.achievement_rules values
 ('friend_first','friends',1),('friend_five','friends',5),
 ('duel_first','opponents',1),('duel_five','opponents',5),
 ('duel_win','wins',1),('duel_perfect','perfect',1);
create table quiz_private.achievement_awards (
 player_id uuid not null references quiz_private.player_profiles(id) on delete cascade,
 badge_id text not null references quiz_private.achievement_rules(id),
 observed_at timestamptz not null default now(),
 primary key(player_id,badge_id)
);
alter table quiz_private.achievement_rules enable row level security;
alter table quiz_private.achievement_rules force row level security;
alter table quiz_private.achievement_awards enable row level security;
alter table quiz_private.achievement_awards force row level security;
revoke all on quiz_private.achievement_rules,quiz_private.achievement_awards from public,anon,authenticated;
create function quiz_private.achievement_metrics(player uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
 'friends',(select count(*) from quiz_private.friendships f where state='accepted' and player in(f.sender,f.recipient)),
 'opponents',count(distinct other.player_id),
 'wins',count(distinct other.player_id) filter(where own.score>other.score),
 'perfect',count(*) filter(where own.score=1000))
 from quiz_private.score_ledger own
 join quiz_private.score_ledger other on other.match_id=own.match_id and other.player_id<>own.player_id
 join quiz_private.matches m on m.id=own.match_id and m.state='completed'
 where own.player_id=player
$$;
create function quiz_private.refresh_achievement_awards(player uuid) returns void
language plpgsql security definer set search_path='' as $$
declare values_json jsonb;
begin
 if not exists(select 1 from quiz_private.player_profiles p join auth.users u on u.id=p.id where p.id=player and p.access_enabled and u.email_confirmed_at is not null and not u.is_anonymous) then return; end if;
 values_json=quiz_private.achievement_metrics(player);
 insert into quiz_private.achievement_awards(player_id,badge_id)
 select player,r.id from quiz_private.achievement_rules r where (values_json->>r.metric)::integer>=r.target
 on conflict do nothing;
end $$;
create function quiz_private.award_friend_achievements() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if new.state='accepted' then
  perform quiz_private.refresh_achievement_awards(least(new.sender,new.recipient));
  perform quiz_private.refresh_achievement_awards(greatest(new.sender,new.recipient));
 end if;
 return new;
end $$;
create trigger award_friend_achievements after insert or update on quiz_private.friendships
 for each row execute function quiz_private.award_friend_achievements();
create function quiz_private.award_match_achievements() returns trigger
language plpgsql security definer set search_path='' as $$
declare player uuid;
begin
 if new.state='completed' and old.state is distinct from new.state then
  for player in select player_id from quiz_private.match_players where match_id=new.id order by player_id loop
   perform quiz_private.refresh_achievement_awards(player);
  end loop;
 end if;
 return new;
end $$;
create trigger award_match_achievements after update on quiz_private.matches
 for each row execute function quiz_private.award_match_achievements();
-- Backfill only facts still provable from accepted friendships / immutable scores.
do $$ declare player uuid; begin
 for player in select id from quiz_private.player_profiles order by id loop
  perform quiz_private.refresh_achievement_awards(player);
 end loop;
end $$;
create or replace function quiz_private.social_player(player uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',p.id,'name',p.display_name,'username',p.username,'avatar',p.avatar,
 'xp',coalesce((select sum(s.score)/10 from quiz_private.score_ledger s where s.player_id=p.id),0),
 'level',least(100,floor(coalesce((select sum(s.score)/10 from quiz_private.score_ledger s where s.player_id=p.id),0)/250)+1),
 'achievementsShared',p.share_achievements,
 'badgeIds',case when p.share_achievements then coalesce((select jsonb_agg(badge_id order by badge_id) from quiz_private.achievement_awards where player_id=p.id),'[]'::jsonb) else '[]'::jsonb end,
 'showcase',case when p.share_achievements then to_jsonb(p.achievement_showcase) else '[]'::jsonb end)
 from quiz_private.player_profiles p where p.id=player and p.access_enabled and p.username is not null
$$;
create function public.player_achievement_command(actor uuid,operation text,body jsonb default '{}'::jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare p quiz_private.player_profiles; ids text[];
begin
 if jsonb_typeof(body) is distinct from 'object' then return quiz_private.failure('INVALID_REQUEST'); end if;
 if not exists(select 1 from auth.users where id=actor and email_confirmed_at is not null and not is_anonymous) then return quiz_private.failure('SIGN_IN_REQUIRED',401); end if;
 select * into p from quiz_private.player_profiles where id=actor for update;
 if not found or not p.access_enabled then return quiz_private.failure('CLOSED_TEST_ONLY',403); end if;
 if p.social_window<now()-interval '1 minute' then p.social_window=now();p.social_count=0; end if;
 if p.social_count>=60 then return quiz_private.failure('RATE_LIMIT',429); end if;
 update quiz_private.player_profiles set social_window=p.social_window,social_count=p.social_count+1 where id=actor;
 perform quiz_private.refresh_achievement_awards(actor);
 if operation='achievement_settings' then
  if (select count(*) from jsonb_object_keys(body))<>2 or not(body ?& array['shared','showcase']) or jsonb_typeof(body->'shared') is distinct from 'boolean' or jsonb_typeof(body->'showcase') is distinct from 'array' then return quiz_private.failure('INVALID_REQUEST'); end if;
  if jsonb_array_length(body->'showcase')>3 or exists(select 1 from jsonb_array_elements(body->'showcase') v where jsonb_typeof(v)<>'string') then return quiz_private.failure('INVALID_BADGE'); end if;
  select coalesce(array_agg(v),'{}') into ids from jsonb_array_elements_text(body->'showcase') v;
  if cardinality(ids)<>(select count(distinct v) from unnest(ids) v) or exists(select 1 from unnest(ids) v where not exists(select 1 from quiz_private.achievement_awards where player_id=actor and badge_id=v)) then return quiz_private.failure('INVALID_BADGE'); end if;
  update quiz_private.player_profiles set share_achievements=(body->>'shared')::boolean,achievement_showcase=ids where id=actor;
 elsif operation<>'achievement_self' or body<>'{}'::jsonb then return quiz_private.failure('INVALID_OPERATION'); end if;
 select * into p from quiz_private.player_profiles where id=actor;
 return jsonb_build_object('earned',coalesce((select jsonb_agg(badge_id order by badge_id) from quiz_private.achievement_awards where player_id=actor),'[]'::jsonb),'metrics',quiz_private.achievement_metrics(actor),'shared',p.share_achievements,'showcase',to_jsonb(p.achievement_showcase));
end $$;
revoke all on all functions in schema quiz_private from public,anon,authenticated;
revoke all on function public.player_achievement_command(uuid,text,jsonb) from public,anon,authenticated;
grant execute on function public.player_achievement_command(uuid,text,jsonb) to service_role;
