# Play Data Safety — Android Production candidate

Read-only export obtained from Play Console on 2026-11-27. No import, attestation, submission or publication performed.

Current form declares 10 types. Preserve account deletion URL https://anla-ezberle-quiz.vercel.app/account-delete and TLS yes. Add OAuth to account creation methods alongside username/password: Android uses browser Google OAuth/PKCE. It does not link the iOS GoogleSignIn SDK.

## Required corrections for this candidate

| Type | Collected | Shared | Collection purposes | Sharing purposes | Optional? | Evidence |
|---|---|---|---|---|---|---|
| Name | Yes | No | App functionality, account management | — | Yes, guest play works | Supabase profile/Auth flow; no name passed to AdMob |
| Email | Yes | No | App functionality, account management, fraud prevention/security | — | Yes | Auth only; no email passed to AdMob |
| User IDs | Yes | No | App functionality, account management, fraud prevention/security | — | Yes | Online identity/profile; no account UID passed to AdMob |
| Approximate location | Yes | Yes | Advertising, analytics, fraud prevention/security | Same | **Required** | GMA 25.5.0 IP-based approximate location; no GPS permission |
| Contacts | Yes | No | App functionality | — | Yes | In-app friend/social graph counts under Google's Contacts definition; phone address book is not read |
| Crash logs | **Add Yes** | **Add Yes** | Advertising, analytics, fraud prevention/security | Same | **Required** | GMA 25.5.0 automatically collects SDK/app crash diagnostics |
| Diagnostics | Yes | Yes | Advertising, analytics, fraud prevention/security | Same | **Required** | SDK launch time, hangs, energy/performance; already selected |
| App interactions | Yes | Yes | App functionality, advertising, analytics, fraud prevention/security | Advertising, analytics, fraud prevention/security | **Required** | GMA app launches/ad views and taps; not first-party analytics activation |
| In-app search history | Yes | No | App functionality | — | Yes | Online profile search request |
| Other user-generated content | **Add Yes** | No | App functionality, fraud prevention/security | — | Yes | Optional report details stored for authorized moderation (`PlayerSafetyActions.tsx`) |
| Other actions | Yes | No | App functionality, fraud prevention/security | — | Yes | Online answers/game results/social actions; local-only guest XP is not uploaded |
| Device or other IDs | Yes | Yes | App functionality, advertising, analytics, fraud prevention/security | Advertising, analytics, fraud prevention/security | **Required** | GMA app/device identifiers and optional push token. Blocked AD_ID does not establish absence of all other identifiers |

All above: not ephemeral (No). Existing optional account/social features remain optional. For automatic SDK data, the new candidate does not offer a global ad/data off switch in every region; therefore optional cannot be asserted globally. Regional UMP refusal can prevent requests but is not a universal opt-out. This follows Google's rule: if required for any distributed version/user, mark Required.

Do not add phone number, precise location, photos, messages/chat, installed apps, religious belief or additional performance data merely because another platform's SDK manifest lists them. No such Android collection has been established. Diagnostics plus Crash logs cover the documented GMA performance categories; there is no evidence for a separate unlisted performance category. No Google Analytics/Firebase Analytics was enabled.

## Primary evidence

- Installed react-native-google-mobile-ads 17.4.0 declares Android classic GMA **25.5.0**; no SDK upgrade performed.
- https://developers.google.com/admob/android/privacy/play-data-disclosure (same SDK version; automated IP, interactions, diagnostics and identifiers; encrypted in transit).
- https://support.google.com/googleplay/android-developer/answer/10787469?hl=en (Contacts includes social graph; Other user-generated content; global optional/required rule).
- Code: `src/features/online/client.ts`, `googleFlow.ts`, `safety/PlayerSafetyActions.tsx`, `src/features/ads/runtime.native.tsx`, `consent.ts`.

## Website mismatch

Live /privacy was rendered and still says Android real revenue ads are not active. It currently describes test-only Android and iOS revenue. Update only the Android advertising paragraph before public Android release: distinguish test vs published Android units; disclose the same SDK data/purposes; NPA/G rating; no AD_ID/AdServices permissions; publisher first-party ID off; unknown age conservatively under consent age in both UMP and GMA; no guarantee that all identifiers vanish; regional consent checks retained. iOS ATT text stays intact. Source policy and public deployment must match. No main merge or Vercel deployment is authorized/performed in this task.

app-ads.txt returned HTTP 200, text/plain, exact seller line `google.com, pub-9642662711398587, DIRECT, f08c47fec0942fa0`, no redirect. This proves reachability, not AdMob crawler approval. Android AdMob has no public Play store link yet and remains review-required/limited. Link and crawler approval must be revisited after a public store listing exists.
