-- Development enrollment: require custom SMTP, successful send request, mandatory
-- email confirmation and tested redirects. This is not production launch approval.
-- Inbox delivery and native-device acceptance must be recorded separately.
-- Supabase Auth "Allow new users to sign up" must also be enabled.
-- This flag alone neither configures email nor enables Supabase Auth signup.
update quiz_private.player_service_config
set public_enrollment_enabled=true where singleton;
