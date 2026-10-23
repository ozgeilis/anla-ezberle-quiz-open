-- Append-only avatar IDs 4–11. No profile, friendship, game or XP rows change.
-- Retain the same security-definer API, grants and all other input checks.
do $avatar_catalog$
declare
  definition text;
  old_guard text := '(body->>''avatar'') !~ ''^[0-3]$''';
  new_guard text := '(body->>''avatar'') !~ ''^([0-9]|1[01])$''';
begin
  select pg_get_functiondef('public.player_social_command(uuid,text,jsonb)'::regprocedure)
    into definition;
  if position(old_guard in definition) = 0 then
    raise exception 'Unexpected social API avatar guard; migration stopped';
  end if;
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'quiz_private.player_profiles'::regclass
      and conname = 'player_profiles_avatar_check'
      and pg_get_constraintdef(oid) = 'CHECK (((avatar >= 0) AND (avatar <= 3)))'
  ) then
    raise exception 'Unexpected avatar constraint; migration stopped';
  end if;
  -- Validate the wider boundary before replacing the old narrower boundary.
  alter table quiz_private.player_profiles
    add constraint player_profiles_avatar_catalog_v2_check check (avatar between 0 and 11);
  alter table quiz_private.player_profiles drop constraint player_profiles_avatar_check;
  execute replace(definition, old_guard, new_guard);
end
$avatar_catalog$;
