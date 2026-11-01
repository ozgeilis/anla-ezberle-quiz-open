-- UNDEPLOYED candidate. Does not enable signup/OAuth or change hosted Auth settings.
begin;
create table quiz_private.google_auth_config (
 singleton boolean primary key default true check(singleton),
 oauth_enabled boolean not null default false,
 deletion_enabled boolean not null default false,
 signup_enabled boolean not null default false
);
insert into quiz_private.google_auth_config default values;
revoke all on quiz_private.google_auth_config from public,anon,authenticated;
create table quiz_private.google_deletion_challenges (
 id uuid primary key default gen_random_uuid(),
 actor uuid not null references auth.users(id) on delete cascade,
 created_at timestamptz not null default now(),
 expires_at timestamptz not null default now()+interval '5 minutes',
 claimed boolean not null default false
);
create index on quiz_private.google_deletion_challenges(actor,created_at);
revoke all on quiz_private.google_deletion_challenges from public,anon,authenticated;
create function public.google_auth_capabilities() returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('googleOAuthEnabled',oauth_enabled,
 'googleDeletionEnabled',deletion_enabled,'googleSignupEnabled',signup_enabled and coalesce((public.online_service_capabilities()->>'registrationEnabled')::boolean,false))
 from quiz_private.google_auth_config where singleton
$$;
revoke all on function public.google_auth_capabilities() from public;
grant execute on function public.google_auth_capabilities() to anon,authenticated;
create function public.begin_google_deletion(actor uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare challenge uuid;
begin
 if not exists(select 1 from quiz_private.google_auth_config where deletion_enabled) then raise exception 'NOT_ENABLED'; end if;
 perform pg_advisory_xact_lock(hashtextextended(actor::text,73));
 if exists(select 1 from quiz_private.google_deletion_challenges c where c.actor=begin_google_deletion.actor and c.created_at>now()-interval '60 seconds') then raise exception 'RATE_LIMITED';end if;
 delete from quiz_private.google_deletion_challenges c where c.actor=begin_google_deletion.actor or c.expires_at<now();
 insert into quiz_private.google_deletion_challenges(actor) values(actor) returning id into challenge;
 return challenge;
end $$;
create function public.claim_google_deletion(actor uuid,challenge uuid) returns boolean
language plpgsql security definer set search_path='' as $$
declare changed integer;
begin
 update quiz_private.google_deletion_challenges c set claimed=true
 where c.actor=claim_google_deletion.actor and c.id=challenge and not c.claimed and c.expires_at>now()
 and exists(select 1 from quiz_private.google_auth_config where deletion_enabled);
 get diagnostics changed=row_count;return changed=1;
end $$;
revoke all on function public.begin_google_deletion(uuid),public.claim_google_deletion(uuid,uuid) from public,anon,authenticated;
grant execute on function public.begin_google_deletion(uuid),public.claim_google_deletion(uuid,uuid) to service_role;
-- Follow the existing mandatory private-table RLS boundary.
alter table quiz_private.google_auth_config enable row level security;
alter table quiz_private.google_auth_config force row level security;
alter table quiz_private.google_deletion_challenges enable row level security;
alter table quiz_private.google_deletion_challenges force row level security;
grant usage on schema quiz_private to supabase_auth_admin;
grant select on quiz_private.google_auth_config to supabase_auth_admin;
create policy google_config_auth_read on quiz_private.google_auth_config
 for select to supabase_auth_admin using(true);
grant execute on function public.online_service_capabilities() to supabase_auth_admin;
-- No new Google signup during closed testing. Pre-provision only explicitly
-- approved temporary Auth accounts; no extra email/hash allowlist is retained.
create function public.before_google_user_created(event jsonb) returns jsonb
language plpgsql security invoker set search_path='' as $$
begin
 if event->'user'->'app_metadata'->>'provider' is distinct from 'google' then
   return '{}'::jsonb; -- preserve existing email signup policy
 end if;
 if exists(select 1 from quiz_private.google_auth_config where oauth_enabled and deletion_enabled and signup_enabled)
 and coalesce((public.online_service_capabilities()->>'registrationEnabled')::boolean,false)
 then return '{}'::jsonb; end if;
 return jsonb_build_object('error',jsonb_build_object('http_code',403,
   'message','Google ile yeni hesap kaydı kapalı test ile sınırlı.'));
end $$;
revoke all on function public.before_google_user_created(jsonb) from public,anon,authenticated;
grant execute on function public.before_google_user_created(jsonb) to supabase_auth_admin;
commit;
