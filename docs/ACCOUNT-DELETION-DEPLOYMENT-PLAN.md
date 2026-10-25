# Account deletion — production approval request

## Exact changes to approve

Target **only** `mqyuihiobkomjfipxehj` (`anla-ezberle-quiz-dev`, Frankfurt).
No Seoul, old GitHub repo, unrelated migration, seed or existing real-user
account deletion. Existing Vercel project/domain remain unchanged.

Candidate file: `supabase/migrations/20261024000100_account_deletion.sql`.
SHA-256: `de71ec6a9c43fa98e6f212243432ee8f321e431cc4b7bf55c6bb9f19ae2f7c0e`.
If this byte hash changes, review the changed SQL before applying it.

The migration runs in one transaction (5s lock / 60s statement timeout):

- Makes four historical identity links nullable: matches creator, match_players
  player/session, live_rooms host. This permits erasure without deleting opponents'
  results. It does not erase existing rows during installation.
- Creates private forced-RLS config (global **false**, empty synthetic tester list)
  and short-lived intent table, plus service-only Storage/preflight/postflight RPCs.
- Installs an intent-guarded Auth BEFORE DELETE trigger. Real Auth deletion remains
  the supported server-side Admin API, not client SQL or `DELETE auth.users` RPC.
- Replaces three immutable guards with explicitly bounded erasure exceptions;
  normal scoring/answers/manifests stay immutable. Schema compatibility was checked.
- Adds one capability field, preserving registration settings. Redacts missing
  players in the **installed** match view via narrow checked replacements; no
  local content protocol is substituted for the deployed one.
- Removes/anonymizes only the requesting account's linked data upon a later,
  separately authenticated deletion request, never on migration installation.

## Ordered rollout (after explicit owner approval)

1. Recheck project name/ref/region, exact eight-version history and guard hashes;
   stop on drift. Record only aggregate counts and deterministic server-side
   fingerprints of existing Auth/profile/score/answer rows; do not export personal
   records. Check no current owned buckets, multipart uploads or SCIM accounts
   require a changed plan. Existing Free project has no scheduled DB backups;
   no private user-data dump is included in this plan.
2. Apply **only** the hashed migration and register that version. Do not run an
   unfiltered `supabase db push`, reset, seed or the two unregistered history
   migrations. Verify grants/RLS, config false, no changed baseline records.
3. Deploy **only `account-delete`**, all three source files, with explicit manual
   Auth validation / `verify_jwt=false`. Use platform-injected administrative keys;
   do not create an Expo secret or print any key. Verify preflight and invalid JWT
   rejection while global rollout remains false.
4. Create two newly generated, clearly tagged synthetic email/password accounts
   using the protected server/admin channel. No real user is a test subject.
   Add only their IDs to `test_actors`. Test wrong password, foreign-actor body,
   expired/erased JWT, fresh password deletion, own Storage where applicable,
   shared game redaction, immutable opponent scores, refresh rejection and retry.
   Preserve fingerprints of **all pre-existing** users/games/scores/answers.
   Delete only this approved synthetic fixture batch; never broad cleanup.
5. If hosted acceptance succeeds, merge the focused account PR into main and
   allow existing Vercel Production deployment of `/account-delete` and `/privacy`.
   Keep the existing domain and public Supabase environment values. No new project,
   Auth provider/signup change or unrelated UI PR merge. Verify the exact deployed
   commit and direct HTTPS routes on the public domain before declaring them live.
6. Enable the global deletion config only after those checks, clear `test_actors`,
   and verify `accountDeletionEnabled:true` plus invalid-session rejection and an
   additional controlled synthetic UI deletion. Production is successful only
   after hosted evidence, web login flow and unchanged pre-existing fingerprints.
7. The installed native app must contain the new account UI; a new preview build
   and physical Android/iOS acceptance are separate evidence. Do not call an old
   APK updated merely because the backend was enabled. No Google Play submission.

## Risks and stop conditions

- Installing Auth triggers affects a sensitive managed schema. Permissions were
  checked and the real Admin API/rollback path tested locally; unexpected hosted
  schema or permission drift is a hard stop.
- Storage deletion is a separate service transaction. Partial own-file removal is
  possible before a later failure; it is disclosed, retryable and never success.
  Owned buckets/multipart uploads fail closed and need review, not broad deletion.
- Irreversible **user-requested** deletion cannot be undone. Remaining players'
  results stay; the erased participant loses their own online scores and identity.
- Already-issued JWTs persist cryptographically until expiry. Actual Auth lookup,
  profile removal, protected RPCs and RLS deny sensitive access. Do not claim that
  deleting a row changes the signature or expiry of an issued JWT.
- Exact internal provider log retention/support mailbox retention is not verified.
  Current public policy states that limit; this plan is not Google Play/legal
  certification. The public contact is owner-approved.
- Stop without global activation if fingerprints change unexpectedly, any critical
  hosted acceptance fails, required access is missing or the live target differs.

## Immediate rollback / recovery

Set `account_deletion_config.enabled=false` and `test_actors='{}'` through the
server/admin channel first. Disable/revert the endpoint/client deployment if
needed. The trigger checks the same gate, so unused intents do not permit erasure.
For an already-running request, the Auth transaction either commits its bounded
cleanup or rolls back; do not promise cancellation after commit. Do not restore an
erased person's data, force-push history, DROP tables or reverse nullable fields
with new production nulls. Leave compatible schema installed; investigate and fix
forward. Other games continue through their existing endpoints.

No production step above has been performed in this change. Owner approval must
cover this exact migration, endpoint, synthetic hosted acceptance, focused main
merge/Vercel publication and final capability activation before execution begins.
