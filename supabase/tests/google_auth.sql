-- Synthetic fixtures only. Roll back every mutation. Apply candidate migration first.
begin;
insert into auth.users(id) values
 ('a0000000-0000-4000-8000-000000000001'),
 ('a0000000-0000-4000-8000-000000000002');
do $$
begin
 assert public.google_auth_capabilities()->>'googleOAuthEnabled'='false','closed default';
 assert not has_function_privilege('anon','public.begin_google_deletion(uuid)','execute'),'anon cannot create challenge';
 assert not has_function_privilege('authenticated','public.claim_google_deletion(uuid,uuid)','execute'),'client cannot claim';
 assert not has_function_privilege('authenticated','public.before_google_user_created(jsonb)','execute'),'client cannot forge hook';
 assert has_function_privilege('supabase_auth_admin','public.before_google_user_created(jsonb)','execute'),'Auth may invoke hook';
 assert not has_table_privilege('authenticated','private.google_signup_allowlist','select'),'allowlist private';
 assert public.before_google_user_created('{"user":{"email":"fixture@example.invalid","app_metadata":{"provider":"email"}}}'::jsonb)='{}','email policy unchanged';
 assert public.before_google_user_created('{"user":{"email":"fixture@example.invalid","app_metadata":{"provider":"google"}}}'::jsonb)?'error','Google closed';
 begin
  perform public.begin_google_deletion('a0000000-0000-4000-8000-000000000001');
  raise exception 'FAIL: closed challenge accepted';
 exception when raise_exception then if sqlerrm<>'NOT_ENABLED' then raise; end if; end;
end $$;
update private.google_auth_config set oauth_enabled=true,deletion_enabled=true;
insert into private.google_signup_allowlist values
 (encode(sha256(convert_to('fixture@example.invalid','UTF8')),'hex'),now()+interval '1 hour');
set local role supabase_auth_admin;
do $$ begin
 assert public.before_google_user_created('{"user":{"email":" FIXTURE@example.invalid ","app_metadata":{"provider":"google"}}}'::jsonb)='{}','normalized allowlist';
 assert public.before_google_user_created('{"user":{"email":"other@example.invalid","app_metadata":{"provider":"google"}}}'::jsonb)?'error','not allowed';
end $$;
reset role;
update private.google_signup_allowlist set expires_at=now()-interval '1 second';
do $$ begin
 assert public.before_google_user_created('{"user":{"email":"fixture@example.invalid","app_metadata":{"provider":"google"}}}'::jsonb)?'error','expired allowlist';
end $$;
set local role service_role;
do $$
declare c uuid;
begin
 c:=public.begin_google_deletion('a0000000-0000-4000-8000-000000000001');
 assert not public.claim_google_deletion('a0000000-0000-4000-8000-000000000002',c),'cross-user denied';
 assert public.claim_google_deletion('a0000000-0000-4000-8000-000000000001',c),'owner can claim';
 assert not public.claim_google_deletion('a0000000-0000-4000-8000-000000000001',c),'replay denied';
 begin
  perform public.begin_google_deletion('a0000000-0000-4000-8000-000000000001');
  raise exception 'FAIL: send cooldown bypassed';
 exception when raise_exception then if sqlerrm<>'RATE_LIMITED' then raise; end if; end;
end $$;
reset role;
update private.google_deletion_challenges set created_at=now()-interval '2 minutes',expires_at=now()-interval '1 second',claimed=false;
do $$ begin
 assert not public.claim_google_deletion('a0000000-0000-4000-8000-000000000001',(select id from private.google_deletion_challenges limit 1)),'expired challenge denied';
end $$;
delete from auth.users where id='a0000000-0000-4000-8000-000000000001';
do $$ begin
 assert not exists(select 1 from private.google_deletion_challenges),'account cascade removes proof';
 assert exists(select 1 from auth.users where id='a0000000-0000-4000-8000-000000000002'),'other account preserved';
end $$;
rollback;
