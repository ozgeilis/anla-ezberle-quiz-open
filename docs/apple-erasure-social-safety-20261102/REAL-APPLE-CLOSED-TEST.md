# Proposed next acceptance: one real Apple private-relay application account

2 November2026. The owner separately approved this exact single-account trial
and its corrected local signing update. The trial passed and all temporary
settings were closed afterward: [results](REAL-APPLE-RESULT.md).
The operation below is its recorded scope, not permission to repeat or expand it.

## Baseline and scope

Frankfurt `mqyuihiobkomjfipxehj`; Team `W7CRC43SHP`; primary App ID
`com.kovynelstudio.anlaezberle`. Current Apple provider and four Apple flags
are disabled; Apple identities, private-relay application accounts and Apple
signup allowlist are empty. The hook MD5 is
`7db2b669f77266fdf8a62e9b076145f7`. Existing registration policy remains unchanged.
The owner has no separate Apple test account; a real Apple ID may authorize
**only one newly created temporary Supabase application account** using Hide My
Email. The Apple ID itself, existing application accounts and all game data are
outside the deletion scope. Stop if a pre-existing identity/account is found.

## Proposed controlled operation

1. **Correction after device inspection:** the installed permanent-ID acceptance
   app is a signed Release application, not a Metro development client. A launch
   URL did not create a Metro connection; PR26 was not delivered to the phone.
   Do not count the existing guest screen as a current-source test. Prepare the
   separately scoped [local candidate update](LOCAL-APPLE-TEST-UPDATE.md) and obtain
   owner approval before signing/installing it. No new native dependencies are
   needed. Keep the hosted trial closed until that candidate is ready.
2. Enable Supabase Apple **native identity-token** provider only for audience
   `com.kovynelstudio.anlaezberle`. No web Services ID/callback wildcard; nonce
   verification and verified email remain required. No Apple web OAuth secret
   is needed for this native-only path; the existing server P8 is used only by
   account-delete. Do not create another key.
3. Set only Apple oauth/deletion/revocation capabilities true, leave signup false;
   set `APPLE_ACCOUNT_DELETION_ENABLED=true` for the accepted server deletion
   code. Keep player safety/moderator settings unchanged. First leave the signup
   allowlist empty: an unlisted signup must be denied by the existing hook.
4. The owner chooses **Hide My Email** in Apple's native consent screen.
   The initial application registration is intentionally denied. No Supabase
   account should be created. Read only the newly assigned private-relay email
   from the owner's iPhone Apple Account settings for this app; never log an
   identity token/authorization code or share a password/code in chat.
5. Check that exact alias has no existing user. Allow only this address, expiring
   within7 days (no relay/domain wildcard), then retry native login. At most one
   new Supabase actor is permitted. Record its ID privately and verify creation
   after this test began, provider apple, and expected permanent app audience.
   If admission needs a global registration-policy change, stop instead.
6. Verify native nonce/token exchange, server user, automatic navigation, app
   restart/session persistence, cancellation and repeat sign-in. Do not treat a
   mock/fixture or guest screen as successful Apple authentication.
7. Verify account-delete capability only for that newly created actor; if an
   erasure test actor entry is required, add only that ID without changing the
   existing global erasure policy. The owner completes fresh Apple proof and
   final account deletion in the app. Verify revocation was recorded before
   existing erasure, actor/identity/session removal, no token ciphertext left,
   and baseline users/game/XP/history remain intact. Do not deliberately corrupt
   live traffic; network/retry fault injection remains in the isolated suite.
8. Remove the exact temporary admission/test-actor entry; restore Apple provider,
   three capability flags and Edge env flag to their captured closed values.
   Preserve the approved key and retention job. No new key rotation or moderator
   grant. Leave a failure/retry safely blocked and report it if erasure cannot
   finish; never delete an unidentified or pre-existing actor to make a test pass.

## Boundaries and evidence

General signup, Google/email rules, Before User Created hook, RLS, Alpha/testers,
main, Production, push and ads/Analytics remain unchanged. No Apple ID is deleted.
After any source drift or unexpected identity link, stop and review before any
further write. Provider activation alone is not App Store/TestFlight acceptance.
Hide My Email identity support and actual forwarded-email delivery are separate:
inspect existing sender/source registration; if custom SMTP/domain work is
required, keep it open for separate approval rather than inventing delivery proof.

Moderator enrollment/operating acceptance and authenticated native safety matrix
remain separate required acceptance. This plan does not authorize distributing
an incomplete candidate to TestFlight or merging PR26.

Primary references reviewed2 November2026:
- https://supabase.com/docs/guides/auth/social-sign-in/auth-apple
- https://docs.expo.dev/versions/latest/sdk/apple-authentication/
