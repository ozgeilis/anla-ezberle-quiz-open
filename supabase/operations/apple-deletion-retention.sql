-- Separate LIVE approval required. Run only after the reviewed migration/Edge
-- code and server secrets are installed. Does not enable Apple signup/provider.
-- pg_cron is already a prerequisite of this app's existing live-room engine.
-- The trusted postgres-owned cron session labels its own private service call;
-- this grants no SQL/JWT access to a client and does not create credentials.
SELECT cron.schedule('anla-apple-deletion-retention','*/5 * * * *',
 $job$SELECT set_config('request.jwt.claims','{"role":"service_role"}',false); SELECT public.purge_apple_deletion_jobs();$job$);
-- Before enabling Apple capabilities, inspect cron.job and a successful job_run_details
-- entry. Expired proof is unusable immediately, encrypted leftovers purged within
-- the next successful 5-minute tick. Alert on failed ticks; never claim hard TTL
-- if the worker is stopped. Rollback: cron.unschedule('anla-apple-deletion-retention').
