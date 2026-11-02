# Apple erasure and player safety candidate — 2 November 2026

Stacked on PR #25 (`bdcac7a`); this PR is not a main/store/backend deployment.
No hosted migration, Apple provider, moderator grant, secret, or tester change
has been performed. All new server capabilities default to **closed**.

## Implemented

- Native Apple fresh proof, server nonce/subject/audience/issuer/signature and
  live same-actor Supabase session checks; Apple-only and linked identities
  cannot bypass revocation through the password/Google branch.
- Server-only Apple code exchange, ES256 client secret, AES-256-GCM encrypted
  short-lived refresh token, serialized leased retry state. Revoke before the
  existing account-erasure operation; retry network errors with stored proof,
  retry erasure after revocation without exchanging/revoking again.
- Shared real profile actions: block/report, four reasons, own blocked list and
  unblock. No fabricated presence or players. Actor-change/unmount guards.
- Private forced-RLS reports, blocks, limits, moderator membership and audit.
  No client report table access. Server-authoritative reciprocal block guards
  cover friendship, direct challenges, old duel invite redemption, room join
  and room start. Existing started games/history/XP are retained.
- Blocking removes friend edges/pending challenges/contact envelopes, never
  user accounts or historical results. Unblock does not recreate friendship.
- Unicode/Turkish name normalization and prohibited-word server filtering;
  no automatic account deletion or blanket retroactive profile rewriting.

## Actual tests and remaining acceptance

| Check                                                   | Status / scope                                                                                                                                                       |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript, lint, bank, unit/regression                 | PASS: `pnpm check`, 426/426 after the approved seasonal change was retained                                                                                          |
| Edge Deno checking                                      | PASS account-delete with its pinned deno.json; online-duel                                                                                                           |
| Isolated PostgreSQL full migration/history suite        | PASS after alias fix and Docker recovery: all current migrations, immutable keys, old games and player/score/award row preservation; no hosted connection            |
| Apple HTTP + PostgreSQL crypto/revoke/erase retries     | PASS repeated after final SQL against explicit signed Apple/Supabase JWT fixtures; **not real Apple revocation**                                                     |
| Real local GoTrue + actual online-duel Edge + PostgREST | PASS report/idempotency, reciprocal blocks, new requests/invites denied, unblock, field spoofing and unauthorized RPC/moderation denied; synthetic local actors only |
| Real browser UI on isolated server                      | Report success, block removed friendship/inbox, owned blocked list; dark 390dp inspected                                                                             |
| iOS simulator                                           | Current embedded JS launches; guest home preserves prior local XP. Full authenticated native safety acceptance pending                                               |
| Physical iPhone / Android                               | Not tested for this candidate                                                                                                                                        |
| Real Apple provider, relay, revocation                  | Pending separate hosted plan approval, key setup and real same-actor test                                                                                            |
| Hosted moderation process / mobile matrix               | Pending acceptance; do not mark App Store ready                                                                                                                      |

Commands: `pnpm check`; `pnpm dlx deno check --config
supabase/functions/account-delete/deno.json supabase/functions/account-delete/index.ts`;
`pnpm dlx deno check --no-config supabase/functions/online-duel/index.ts`.
The canonical SQL harness accepts only a local container and creates a fresh
schema-only throwaway database. No account export or hosted URL is involved.
Apple protocol acceptance: set `SAFETY_LOCAL_CONTAINER`, `SAFETY_TEST_DB` and run
`pnpm exec tsx scripts/apple-deletion-local.ts`. Actual local Edge acceptance:
`SAFETY_STACK_FILE=/private/outside/repo.json
SAFETY_FIXTURES_FILE=/private/outside/repo.json node scripts/player-safety-local.mjs`.
Use three disposable local authenticated fixtures with initial friendship; do
not point these fixtures at a hosted service. Credentials/output remain outside Git.

## Deployment sequence — separate approval required

1. Complete final isolated SQL and Android/iOS UI matrix, review diff and migration
   hashes. Re-read hosted hook hash/schema; stop on drift. Do not replace a
   changed hook. Retain current Google/email closed-test branches.
2. Review/apply only `20261101215458_apple_deletion_revocation.sql` and
   `20261101215514_player_safety_moderation.sql`; deploy compatible Edge handlers.
   All feature flags remain false. No backfill of XP/history/old matches.
3. Secure server configuration: existing permanent Apple client ID
   `com.kovynelstudio.anlaezberle`, correct Team, Apple key ID + private P8,
   encryption key ID/key map. Store only Supabase secrets, never client/public
   env, logs, Git, or this document. Preserve encryption keys for all unexpired
   jobs during rotation; new jobs use the new key ID. Do not rotate/delete an old
   key while a valid pending job still needs it.
4. Review the separate retention operation `supabase/operations/apple-deletion-retention.sql`.
   Run and verify its scheduled purge before enabling Apple erasure; monitor
   failure/expiry counts without token payloads. Jobs expire in 15 minutes,
   proof in 5 minutes; purge runs every five minutes. Expired proof cannot be
   claimed even if a scheduler is down. In a scheduler outage repair cleanup
   before re-enabling. Ciphertext is removed immediately after recorded revoke.
5. Separately approve Apple provider/capability use and exact temporary test
   allowlist (max seven days, no Private Relay wildcard), enable only after
   verified deletion/revocation acceptance. Verify Hide My Email/relay delivery
   with registered sending domain/address; never treat email similarity as identity.
6. Grant only named authorized moderator users through trusted administrative
   SQL after owner approval; verify actual auth.sessions. No user_metadata role
   can grant access. Set player_safety_config.enabled after real acceptance.
7. Test only approved synthetic accounts, then owner-approved cleanup using the
   normal verified deletion path. Publish/merge/distribute only in the separately
   authorized scope. Existing Android Alpha and its testers remain unchanged.

## Moderator operations / contact

Support and appeal channel: **kovynelstudio@gmail.com** (existing support address).
The operator must assign an accountable human moderator before activation,
check queue at least daily, triage threats/harassment promptly, record decisions
and handle appeals. This is a required operating process, not an automated
claim that a human has already reviewed reports.

Use `moderation_review` with an authenticated, server-enrolled moderator session:
`queue` returns at most 50 private records; `dismiss`, `warn`, `restrict`, `restore`
record decisions and audit. `warn` records an internal warning decision; it does
not send a message. `restrict` denies social contact writes; no scores, games,
XP, accounts or content are deleted. Only authorized moderators see reporter
identity. No report or reporter identity is exposed to the target. Keep the
private moderation queue/audit out of public diagnostics. Manual notices or
appeal replies require the normal authorized support process.

Report details max 500 characters; duplicate open reports reuse their ID;
submission rate is bounded, including five reports per actor/day. Name filtering
is an initial explicit lexicon, not a complete semantic moderation solution.
False positives require moderator review and a versioned lexicon change.

## Final candidate evidence

Candidate `2115c15` (stacked on current PR #25) passes all five GitHub checks:
canonical-bank content-check, leaderboard SQL/Edge, leaderboard UI, Vercel and
Vercel comment. The isolated canonical suite and Apple HTTP/SQL retry acceptance
were repeated after Docker recovery. The formerly ambiguous alias is fixed.
Local full check after seasonal integration is 426/426.

Hosted read-only check: Frankfurt is ACTIVE_HEALTHY/Postgres17.11; neither
proposed security migration/config table exists. Existing online-duel v18 and
account-delete v7 remain active. The current Google-hook hash matches the
reviewed precondition `a32147ffb2e85ef10e60ae8cf1af9bea`. No hosted writes.

Reviewed migration SHA256:

- Apple: `05b6a92c015ea9764dc110703180d43cf8860b41b91f8be7c3a4e5fef18925e8`
- Player safety: `76667ad009ffd2f4829502c51d9064571699ddc52e4cc8b18ac4fdbc8a93d6d1`
- Optional separately reviewed retention operation: `edd96d5ab78486f524bc4dc6fda4338dd4d876825f3edfd6cac29fe722659da8`

This is a concrete backend review package, not permission to deploy it.
Real Apple credentials/provider/revocation, private relay, authorized moderator
enrollment/operating acceptance and complete physical device testing remain open.
