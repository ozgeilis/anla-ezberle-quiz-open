# Account deletion — verified candidate, production approval pending

Updated 25 October 2026. This document does not authorize production changes.
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

## Hosted read-only evidence

Target: **anla-ezberle-quiz-dev**, `mqyuihiobkomjfipxehj`, Frankfurt `eu-central-1`.
Dashboard SQL was run inside `BEGIN READ ONLY … ROLLBACK`. No live user rows were
exported. No production mutation or deletion request has been sent.

| Check                     | Result        | Evidence                                                                          |
| ------------------------- | ------------- | --------------------------------------------------------------------------------- |
| Correct existing target   | PASS          | Project name, ref and Central EU region visible in Dashboard                      |
| Why deletion is disabled  | CONFIRMED     | Account migration/RPC absent; capability field absent; earlier endpoint probe 404 |
| App baseline              | PASS          | Eight installed versions, listed below                                            |
| Auth operations permitted | PASS          | `postgres` has Auth user TRIGGER, audit UPDATE, refresh/flow DELETE privileges    |
| Storage                   | PASS          | 0 buckets, 0 objects, 0 policies, 0 owned buckets                                 |
| Enterprise identity       | PASS          | 0 linked SCIM users; new flow fails closed for SCIM/enrolled MFA                  |
| Baseline aggregate counts | RECORDED      | 13 Auth users, 12 profiles, 23 matches, 32 ledger rows, 9 rooms                   |
| Backups                   | LIMITATION    | Free Dashboard shows no scheduled database backups                                |
| Deployed erasure          | NOT PERFORMED | Requires explicit approval below                                                  |

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

No hosted/staging-account deletion acceptance has been performed yet. The local
isolated services are the staging-equivalent evidence; final hosted acceptance
must occur behind the tester allowlist after approved installation.

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

## Concrete approval and deployment plan

See [ACCOUNT-DELETION-DEPLOYMENT-PLAN.md](ACCOUNT-DELETION-DEPLOYMENT-PLAN.md).
Do not apply the live migration, deploy the function, enable the global flag or
publish the client until the owner explicitly approves that plan.

Primary references:

- [Supabase Admin hard deletion](https://supabase.com/docs/reference/javascript/auth-admin-deleteuser)
- [Storage, deletion and stateless JWT limits](https://supabase.com/docs/guides/auth/managing-user-data)
- [Auth audit log storage](https://supabase.com/docs/guides/auth/audit-logs)
- [Google Play account deletion](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
