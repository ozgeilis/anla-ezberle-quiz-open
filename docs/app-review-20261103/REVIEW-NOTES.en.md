# App Review private notes — draft, not submitted

Do not paste this draft as an assertion that the release is ready until the
open Auth, reviewer login, privacy and device acceptance checks are complete.
Credentials belong only in App Store Connect's private sign-in fields. No
password, OTP, session, personal contact information or support case payload
is included here.

Anla & Ezberle is a Turkish Islamic knowledge quiz. The app is free and the
core single-player experience does not require an account. The supplied build
is 0.1.0 (4), bundle com.kovynelstudio.anlaezberle.

Guest review path:

1. From Ana Sayfa, tap Oyuna Başla and select a category, then Kolay, Orta or
   Zor. Timed questions start at 20 seconds. Select an answer or let time expire.
2. Finish the round to see the score, XP and explanations. Yanlış cevapları
   incele opens the question explanations and source references.
3. Günün Yarışması starts the daily challenge. Profil displays local history,
   the progressive 100-level XP system and earned badges. Guest progress is
   stored on the device; it is separate from server-earned online progression.
4. Ayarlar provides theme, sound, privacy and account controls.

Online review path (must be freshly verified before submission):

- Tap Arkadaşlarınla Oyna, then Giriş yap, and use the dedicated confirmed
  reviewer account in the private sign-in fields. Existing credentials require
  no new email registration or email confirmation.
- A second confirmed synthetic account is available for controlled friend,
  invitation, live-room and duel checks. Provide its credentials only through
  the private review channel when required. Do not use a real player's account.
- Notifications have Tümü, İstekler and Davetler filters. Player profiles expose
  report/block actions where authorized. Report reasons include inappropriate
  name, harassment, spam and other. Reports are visible only to authorized
  moderators. Moderation support: kovynelstudio@gmail.com.
- Account deletion is under Ayarlar → Hesap → Hesabımı Sil, with two confirmations
  and fresh identity verification. Email users use their current password;
  Google users use the verified-email one-time-code flow. Apple users require
  a fresh Apple proof and server-side revocation before erasure.

Release limitations to resolve, not conceal:

- Current server flags disable Apple login/deletion/revocation. Google signup
  remains restricted. A prior successful one-account Apple trial is not
  general release acceptance. Do not submit a release with incomplete login
  availability or a review-only hidden bypass.
- iOS ad requests and Analytics are off. No in-app purchase is offered. Native
  SDK privacy declarations are still reviewed; disabled ads do not establish
  that no other app or provider data is collected.
- Push delivery is restricted; in-app notifications are not evidence of APNs
  delivery. Do not promise untested phone push.
- External TestFlight submission returned HTTP 422 ENTITY_UNPROCESSABLE; Apple
  case 103016925563 is tracked separately. Production review has not been tried.
