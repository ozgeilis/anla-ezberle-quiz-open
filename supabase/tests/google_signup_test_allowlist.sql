BEGIN;
UPDATE quiz_private.google_auth_config SET oauth_enabled=true,deletion_enabled=true,signup_enabled=false;
UPDATE quiz_private.player_service_config SET public_enrollment_enabled=true;
INSERT INTO quiz_private.google_signup_test_allowlist(email,expires_at) VALUES('allowed@example.invalid',now()+interval '1 day');
INSERT INTO quiz_private.google_signup_test_allowlist(email,created_at,expires_at) VALUES('expired@example.invalid',now()-interval '2 days',now()-interval '1 day');
SET LOCAL ROLE supabase_auth_admin;
DO $$ DECLARE v jsonb;BEGIN
 v=public.before_google_user_created('{"user":{"email":"Allowed@example.invalid","app_metadata":{"provider":"google"}}}');
 IF v<>'{}'::jsonb THEN RAISE EXCEPTION 'Approved exact address blocked';END IF;
 v=public.before_google_user_created('{"user":{"email":"other@example.invalid","app_metadata":{"provider":"google"},"user_metadata":{"email":"allowed@example.invalid","approved":true}}}');
 IF v#>>'{error,http_code}'<>'403' THEN RAISE EXCEPTION 'Mutable user metadata bypassed allowlist';END IF;
 v=public.before_google_user_created('{"user":{"email":"expired@example.invalid","app_metadata":{"provider":"google"}}}');
 IF v#>>'{error,http_code}'<>'403' THEN RAISE EXCEPTION 'Expired address admitted';END IF;
 v=public.before_google_user_created('{"user":{"email":"other@example.invalid","app_metadata":{"provider":"email"}}}');
 IF v<>'{}'::jsonb THEN RAISE EXCEPTION 'Existing email enrollment changed';END IF;
END $$;
RESET ROLE;
UPDATE quiz_private.google_auth_config SET deletion_enabled=false;
SET LOCAL ROLE supabase_auth_admin;
DO $$ BEGIN
 IF public.before_google_user_created('{"user":{"email":"allowed@example.invalid","app_metadata":{"provider":"google"}}}')#>>'{error,http_code}'<>'403' THEN RAISE EXCEPTION 'Deletion prerequisite bypassed';END IF;
END $$;
RESET ROLE;
DO $$ BEGIN
 IF has_table_privilege('authenticated','quiz_private.google_signup_test_allowlist','SELECT') OR has_table_privilege('anon','quiz_private.google_signup_test_allowlist','INSERT') OR has_function_privilege('authenticated','public.before_google_user_created(jsonb)','EXECUTE') THEN RAISE EXCEPTION 'Allowlist exposed to clients';END IF;
 IF (public.google_auth_capabilities()->>'googleSignupEnabled')::boolean THEN RAISE EXCEPTION 'Global signup enabled';END IF;
 RAISE NOTICE 'PASS exact expiring private Google allowlist; invoker/RLS, mutable metadata rejection, deletion prerequisite and global closure preserved';
END $$;
ROLLBACK;
