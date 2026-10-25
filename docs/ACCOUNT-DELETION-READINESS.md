# Account deletion — live acceptance record

Updated 25 October 2026. The owner explicitly approved the deployment plan before any hosted migration or deletion. The approved rollout is now complete for the web/backend path.
Public support/privacy contact supplied by the owner: **kovynelstudio@gmail.com**.

## Scope and coordination

This focused branch starts at main `0b2a2aac5cddaf5a9fc2af5f5b1988ada83fa94a`.
It reuses the account-only candidate from PR #2/#3, without merging their Home,
category, audio/timer or result work. Those branches remain open and unchanged.
A later integration of those branches must retain this reviewed implementation,
not replace it with their earlier direct-Auth-SQL candidate.

No question, answer key, image, score formula, existing migration or online room
protocol is changed. Two obsolete SQL fixture assumptions are corrected: the
catalog now contains six duel plus six live award rules, and room codes cannot
contain digits 0/1. The assertions are not disabled.

## Pre-installation hosted read-only evidence

Target: **anla-ezberle-quiz-dev**, `mqyuihiobkomjfipxehj`, Frankfurt `eu-central-1`.
Dashboard SQL was run inside `BEGIN READ ONLY … ROLLBACK`. No live user rows were
exported. These observations preceded the owner-approved installation and synthetic acceptance described below.

| Check                           | Result        | Evidence                                                                          |
| ------------------------------- | ------------- | --------------------------------------------------------------------------------- |
| Correct existing target         | PASS          | Project name, ref and Central EU region visible in Dashboard                      |
| Pre-installation disabled state | CONFIRMED     | Account migration/RPC absent; capability field absent; earlier endpoint probe 404 |
| App baseline                    | PASS          | Eight installed versions, listed below                                            |
| Auth operations permitted       | PASS          | `postgres` has Auth user TRIGGER, audit UPDATE, refresh/flow DELETE privileges    |
| Storage                         | PASS          | 0 buckets, 0 objects, 0 policies, 0 owned buckets                                 |
| Enterprise identity             | PASS          | 0 linked SCIM users; new flow fails closed for SCIM/enrolled MFA                  |
| Baseline aggregate counts       | RECORDED      | 13 Auth users, 12 profiles, 23 matches, 32 ledger rows, 9 rooms                   |
| Backups                         | LIMITATION    | Free Dashboard shows no scheduled database backups                                |
| Pre-installation erasure        | NOT PERFORMED | Owner approval was obtained before rollout                                        |

Registered app versions: `20261019000100`, `20261019000200`, `20261021000100`,
`20261021000200`, `20261021000300`, `20261021000400`, `20261021000500`,
`20261022000100`.
**Drift:** repository-only `20261021000600` / `20261021000700` are not registered
on this hosted target. Do not use an unfiltered `db push`; do not apply them here.
The account candidate was installed and tested against an isolated reconstruction
of precisely the eight hosted application versions. Only the local cron extension
and scheduled job were omitted so the isolated database cannot run shared jobs.
Auth/Storage schema was copied without user rows, passwords, sessions or objects.

## Server design

The Edge endpoint resolves the actor using Auth `getUser(JWT)`, requires a verified
nonanonymous identity and fresh password proof for the **same** actor. The body
accepts only `password` and `confirmation`, never an actor/email override.
The endpoint uses server-managed keys; no administrative value enters Expo.
`verify_jwt=false` delegates validation to that explicit Auth lookup (also supports
modern ES256 tokens); it does not bypass identity verification.

1. Server-only RPC lists files owned by that actor (both ownership columns).
2. Storage API removes those files. Owned buckets or multipart uploads fail closed
   rather than erase other people's files or manipulate Storage metadata directly.
3. A service-only RPC creates a two-minute deletion intent.
4. Supported `auth.admin.deleteUser(actor, false)` performs hard deletion. A guarded
   BEFORE DELETE trigger consumes the intent and performs the reused app cleanup
   **inside the same Auth database transaction**. Exceptions roll it all back.
5. Postflight verifies removal of identity, sessions, refresh tokens, personal app
   rows and Storage ownership; linked Auth audit payloads are anonymized by exact
   JSON value matching, never substring/email-prefix matching.
6. Only verified completion returns `{deleted:true}`. The UI then clears only that
   actor's pending online caches, resets the local name and signs out. Solo history,
   XP, badges, avatar and preferences are preserved and explicitly disclosed.

A failed Storage batch may have already removed some of the deleting user's files.
It does not delete Auth or report success. This cross-service boundary cannot be
rolled back as a single database transaction; the final warning discloses it.
If postflight fails after Auth hard deletion, do not tell the user to recreate the
account as recovery: investigate with support using server-only metadata.

Already issued JWTs are stateless until expiry. Auth deletion invalidates refresh
and our sensitive endpoints look up the actual Auth identity. Existing app RLS and
private RPC grants remain in place. Future Storage policies must not authorize
uploads solely from a now-deleted JWT subject.

## Executed acceptance

- `pnpm check`: 1,500-question integrity, TypeScript, ESLint, **299 tests passed**.
- Web export and Android/iOS/Web JavaScript/Hermes exports passed. These are not a
  signed APK/AAB, native installation or physical-device UI acceptance.
- Isolated real HTTP acceptance uses actual GoTrue, PostgREST, Storage and Edge
  services, fresh local ES256 signing keys and temporary synthetic accounts.
  **30 HTTP checks passed**. It covers fresh proof, disabled/tester rollout, invalid/expired JWT, body actor
  override, wrong-other-account password, denied Auth admin access, CORS rejection,
  actual Storage outage, injected Auth transaction rollback, retry, real hard
  deletion, retained opponent identity/score/answer/file, and denied old login,
  refresh and repeated erased-session requests. See the safe acceptance summary.
- SQL account regression covers atomic rollback, client RPC denial, enrolled MFA
  rejection, active-game cancellation (including host without membership), audit
  anonymization without damaging a prefix-matching other record, preserved
  opponent scores/answers, redacted match views and normal immutability.
- Existing achievement, async history, live history, live room and user-data RLS
  suites run in the isolated database and roll back fixtures.
- Real browser: direct public route, login return target, first/second confirmation,
  cancellation, wrong password, successful synthetic deletion and signed-out
  confirmation; 320px light and 390px dark screenshots. No physical Android/iOS
  deletion acceptance has been claimed.

## Hosted completion — owner-approved rollout

- Applied only `20261024000100_account_deletion.sql` with approved SHA-256
  `de71ec6a9c43fa98e6f212243432ee8f321e431cc4b7bf55c6bb9f19ae2f7c0e`.
  Registered version 9; the two unrelated history migrations remain unapplied.
- Deployed `account-delete` with all three exact reviewed source files. Legacy JWT
  gate is off; actual Auth `getUser` plus same-actor fresh password verification
  are on. Invalid JWT requests are rejected by the function.
- Global flag stayed false during the three-account synthetic allowlist test.
  Two new accounts completed a real 10-question asynchronous match; one was
  erased while the opponent's Auth/profile/score/answers were fingerprint-checked.
  The opponent could still retrieve the redacted completed match and its real
  counts/score. The second synthetic account was then erased.
- PR #4 merged as `3eef199a8b241ea2621e5fb486a9a2e79320ff4b`. All seven Actions
  jobs and Vercel checks passed. Existing Production domain served the new routes;
  no Vercel project, domain or environment setting was changed.
- Enabled global `accountDeletionEnabled:true`, emptied `test_actors`, then used
  the third synthetic account on the **actual Production HTTPS UI**. Login return,
  two confirmations, wrong-password rejection, successful deletion, local sign-out
  and server-confirmed success were observed. That account's old credentials,
  refresh token and repeated deletion request are rejected.
- Final SQL checks show zero remaining synthetic Auth identities, profiles, sessions, refresh tokens, scores, notifications and deletion intents; the tester list is empty.
- **61 hosted HTTP checks passed**, including idempotent service postflight after
  all three synthetic accounts were deleted. No pre-existing real account was a
  deletion test subject. No additional account was created.
- Before/after server-side fingerprints match for all pre-existing **13 Auth
  users, 12 profiles, 23 matches, 32 ledger entries and 323 answers**. Existing
  rooms also match. One newly created synthetic match remains as anonymous shared
  history; its own two deleted players' scores and answers were erased. This is
  expected test evidence, not an additional real user's record.
- The deployed first-party script responses were scanned for the current server
  key and all synthetic passwords/JWTs/refresh tokens; none were present. Public
  publishable configuration remains the only client credential.

Live pages:

- https://anla-ezberle-quiz.vercel.app/account-delete
- https://anla-ezberle-quiz.vercel.app/privacy

Native exports compile, but physical Android/iOS deletion acceptance and an updated
installed binary were **not** verified. A backend/web rollout does not update an
old APK. Provider-internal log/support-mail retention remains unverified; this
record is not a general Google Play release certification.

## Public policy and remaining release limits

`/account-delete` works without installing the app and links to `/privacy` and the
owner-provided support address. Email is an alternative request channel, not an
instant deletion guarantee. The automatic path is for email/password accounts;
SCIM, enrolled MFA and OAuth-only users require additional ownership proof/support.

The policy discloses separate local history, cancellation/redaction, primary data
erasure and operational log limits. **Exact provider-internal log retention and
support-mail retention still need owner/provider confirmation.** Free panel log
visibility is not proof that all internal logs have physically expired. No blanket
legal or Google Play approval is claimed. Do not invent retention durations.

## Approved deployment plan and rollback

See [ACCOUNT-DELETION-DEPLOYMENT-PLAN.md](ACCOUNT-DELETION-DEPLOYMENT-PLAN.md).
The owner approved that exact plan before execution. Its immediate rollback remains global flag false plus an empty tester list; do not restore erased personal data or reverse compatible schema on populated production tables.

Primary references:

- [Supabase Admin hard deletion](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser)
- [Storage, deletion and stateless JWT limits](https://supabase.com/docs/guides/auth/managing-user-data)
- [Auth audit log storage](https://supabase.com/docs/guides/auth/audit-logs)
- [Google Play account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
