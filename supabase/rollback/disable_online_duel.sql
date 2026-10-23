-- Emergency reversible shutdown. Apply ONLY to the explicitly approved dev project.
-- Preserve all Auth users, content versions, matches, attempts and ledger rows.
begin;
revoke execute on function public.online_duel_command(uuid,text,jsonb) from service_role;
revoke execute on function public.online_duel_enroll_test_user(uuid,text) from service_role;
update quiz_private.player_profiles set access_enabled = false;
commit;
-- Reopening requires explicit service grants and an individually reviewed list
-- of tester ids to reactivate. Never globally reopen sign-ups as a rollback.
