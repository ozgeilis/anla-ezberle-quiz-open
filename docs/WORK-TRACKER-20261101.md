# Birleşik görev takibi — 1 Kasım 2026

Bu kayıt önceki talimatları iptal etmez. `Tamamlandı` yalnız belirtilen kapsamın
uygulama + test kanıtıdır; canlı yayında olduğu anlamına gelmez. Aday ve üretim
ayrıdır. Fiziksel cihaz testi, emülatör veya web kontrolüyle ikame edilmez.

## Dal / çakışma envanteri

- En güncel kapalı test kod tabanı: `release/play-final-candidate-20261030`
  `31e1278`; PR #20 → #18 → #17 katmanlı, henüz main'e birleşmemiş.
- Süre / Auth / sonuç geçişi: `fix/twenty-second-auth-callback-20261101`
  `e29e56d`, [PR #22](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/22).
- XP + bildirimler: ayrı `feat/progressive-xp-notification-cards-20261101`
  worktree; #22 üzerine kurulu. [PR #23](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/23), `d2363cd`; XP ve bildirimler aynı PR içinde.
- #13 açık Google Auth öncülü; kodu sürüm tabanında zaten var. Eski dalı yeniden
  merge ederek güncel hesap silme/callback kodunun üzerine yazılmayacak.
- Mevcut worktree'ler incelendi; diğer worktree'lerin commit edilmemiş dosyaları
  değiştirilmedi. Diğer Codex sohbetlerine erişildiği iddia edilmiyor.
- #2/#3/#6/#7/#8/#9/#10/#11/#12/#14/#15/#16/#19/#21 geçmiş PR kayıtları ve
  ilgili kabul belgeleri ayrıca aşağıdaki koruma kapsamındadır. Eski PR'ın
  merged olması tek başına yeni adayın fiziksel kabulü sayılmaz.

## A — Süre / sonuç geçişi

| Görev | Alt gereksinim | Dosya / PR | Durum | Test / kanıt | Kalan |
|---|---|---|---|---|---|
| A1 | Yeni solo / günlük / kategori / öğrenme / aşama / demo 20 sn | question-clock, engine, DuelProvider; #22 | Tamamlandı | 390 test; altı gerçek web turu | Native solo >10 sn yanıt ve arka plan geçti; her mod ayrı cihaz kabulü bekliyor |
| A2 | Eski 10 sn / zamansız kayıtlar | schema, engine; #22 | Tamamlandı | tarihsel oyun regresyonu | Yok, geçmiş üzerine yazılmadı |
| A3 | Arka plan / çift cevap / sınır anı | QuestionClock; #22 | Tamamlandı | monotonic + wall-clock / high-water; native arka plan süre aşımı geçti | Fiziksel cihaz bekliyor |
| A4 | Canlı oda yeni default / CHECK 20; eski oda korunur | yeni timing migration; #22 | Tamamlandı | izole SQL eski/yeni oda; 5 sn reveal | Canlıya onayla uygulandı; eski 10 oda aynı |
| A5 | Asenkron server-authoritative süre / expire / idempotency | timing migration, online-duel; #22 | Tamamlandı | izole SQL 19 sn kabul, 20.1 sn ret, özel anahtarlar | Edge v17/SQL canlı; gerçek iki oyunculu servis kabulü bekliyor |
| A6 | Canlı istemci/sunucu birlikte etkin | #22; backend-deployment.md | Devam Ediyor | Onaylı Edge v17 + timing migration; default 20 ve eski kayıt koruması doğrulandı | Yeni aday istemci gerçek hosted maç kabulü ve Alpha güncellemesi bekliyor |
| A7 | Son cevap → skor öncesi boş oyun ekranı | QuizScreen; #22 | Tamamlandı | 6 turda DOM commit gözlemi, boş ekran 0 | Native 100 video karesi: boş mesaj 0; skor 62 kare |
| A8 | Fiziksel Android / Alpha güncellemesi | acceptance.md; #22 | Engellendi | QA APK yerel emülatörde 00:20 | Fiziksel cihaz ve ayrı yayın onayı |

## B — Auth

| Görev | Alt gereksinim | Dosya / PR | Durum | Test / kanıt | Kalan |
|---|---|---|---|---|---|
| B1 | Google kayıt kök nedeni | README; #22 | Tamamlandı | Hosted hook/flags salt okunur: googleSignupEnabled=false | Cloud Testing listesi bugün yeniden okunmadı |
| B2 | Kanca kaldırmadan süreli özel test listesi | yeni allowlist migration; #22 | Tamamlandı | İzole SQL, RLS/metadata spoof/expiry testleri | Canlıya uygulandı; yalnız onaylı iş hesabına 7 gün izin |
| B3 | Gerçek yetkili Google yeni kayıt/giriş | #22; backend-deployment.md | Devam Ediyor | Gerçek Google web kayıt/otomatik profil/yenileme/çıkış/yeniden giriş geçti; tek hesap/identity | Android native Google callback ve geçici hesap temizliği bekliyor |
| B4 | PKCE, çift callback, taze getUser ve session hazır olunca profil | verifyLink, useAuthCallback, OnlineProvider; #22 | Tamamlandı | Unit + gerçek yerel web Auth/SMTP | Hosted Gmail/Google native ayrı test |
| B5 | Parametresiz / ağ / kullanılmış / recovery ayrımı | callback modülleri; #22 | Tamamlandı | HTTP 15 sn/UI 35 sn; unit + yerel web bare/replay | Native hata matrisi tamamlanmadı |
| B6 | Chrome → native cold-start otomatik profil | acceptance/screenshots; #22 | Tamamlandı | Android 14 emülatör + gerçek yerel SMTP bağlantısı | Fiziksel Samsung/Gmail değildir |
| B7 | SecureStore oturum relaunch / çıkış | acceptance; #22 | Tamamlandı | Native force-stop/relaunch; doğrulanmış hesap ekranı | Fiziksel cihaz kabulü bekliyor |
| B8 | Google hesap eşleme / silme / recovery regresyonu | mevcut #13 + #22 | Devam Ediyor | Güvenlik unit ve SQL erasure geçti | Bu adayda gerçek Google silme/native recovery bekliyor |
| B9 | Hosted callback/template/Edge dağıtımı | rollout-plan; #22 | Devam Ediyor | Edge v17 uygulandı; mevcut redirect listesi salt okunur denetlendi | Gerçek native/hosted e-posta ve Google dönüşü bekliyor; template değiştirilmedi |

## C — XP / seviye (aynı PR: D)

| Görev | Alt gereksinim | Dosya / PR | Durum | Test / kanıt | Kalan |
|---|---|---|---|---|---|
| C1 | 100 seviye, artan eşik, bozuk XP fallback | domain/scoring/levels.ts | Tamamlandı | 99 eşik + bozuk XP / cap testleri geçti | Canlı projection uygulandı; toplam XP aynı |
| C2 | Toplam XP / geçmiş / unvan korunur | progress.ts | Tamamlandı | 390 regresyon; rewardSummary, eski fixture byte ve XP korunuyor | Yok (kod adayı) |
| C3 | Profil / ana başlık / ayarlar ilerleme çubuğu | PlayerIdentityCard, ReferenceHero, SettingsScreen | Tamamlandı | Web profil 60/100; native 20/100; max %100 unit | Fiziksel cihaz kabulü yok |
| C4 | Sosyal / online / leaderboard / seviye ses olayı | social UI + GameAudioEvents | Tamamlandı | 300 XP / eski level=2 DTO, sosyal ve sıralamada seviye 3 | Canlı projection uygulandı; gerçek hosted UI kabulü bekliyor |
| C5 | İlgili server hesaplaması | quiz_private.social_player | Tamamlandı | Onaylı migration canlı; 100 seviye sınırı geçti; eski profil/ledger/rozet/oda özetleri aynı; ACL korunuyor | Yeni istemci fiziksel kabulü ayrıca bekliyor |
| C6 | Maksimum / negatif / NaN / sınırlar | levels.test.ts | Tamamlandı | 0/99/100/210/330/orta/yüksek/58410/üstü geçti | Yok |
| C7 | Gerçek çalışan UI görsel kabul | screenshots | Tamamlandı | 6 web ve 18 Android emulator görünüm matrisi; screenshots | Fiziksel Samsung/iOS yapılmadı |

## D — Bildirimler (aynı PR: C)

| Görev | Alt gereksinim | Dosya / PR | Durum | Test / kanıt | Kalan |
|---|---|---|---|---|---|
| D1 | Ekli referansın açılıp incelenmesi | ekli fb742878 PNG | Tamamlandı | Görsel açıldı; teal/krem, eşit butonlar | Alt nav örneği kopyalanmayacak |
| D2 | Tümü/İstekler/Davetler, kompakt kartlar | InboxScreen + ortak kart | Tamamlandı | 6 web + 18 native matris; ortak kart/filter | Yok (aday) |
| D3 | Gerçek arkadaş isteği kabul/ret | mevcut social endpoint | Tamamlandı | Synthetic HTTP gerçek UI: kabul ACK/tek istek; modal regresyonu | Hosted/fiziksel yeni kabul yapılmadı |
| D4 | Davete Katıl / Daha Sonra | mevcut challenge_reply | Tamamlandı | Later pending koruyor; Katıl ACK sonrası doğru maç rotası | Hosted/fiziksel yeni kabul yapılmadı |
| D5 | Kabul / ret / iptal / süre doldu / pasif | notifications.ts | Tamamlandı | Pasif/süre doldu hiçbir katıl işlemi göstermiyor; fixture UI | Yok (aday) |
| D6 | Push açınca aynı kompakt detay | NotificationDetail | Tamamlandı | 3 push navigation grubu; aynı kompakt detay/okundu akışı | Gerçek yeni push teslim testi yapılmadı |
| D7 | Empty/loading/error/retry | InboxScreen | Tamamlandı | 6 matriste boş/hata/yeniden deneme; yükleme mevcut | Yok (aday) |
| D8 | 320/360/390, açık/koyu, büyük yazı | ekran görüntüleri | Tamamlandı | 320/360/390 × light/dark × 100/150/200 native:18; web:6 | Fiziksel/iOS değildir |
| D9 | Fiziksel Android / iOS / push teslim | kabul raporu | Engellendi | Bu adayda henüz yok | Cihaz sahibi kabulü; genel push kapalı |

## Önceki gereksinimler / korunacak çalışmalar

| Görev | İlgili kanıt | Durum | Test durumu / kalan |
|---|---|---|---|
| v73 / 1500 soru / tarihsel v72 / 30 anlam sorusu | CANONICAL-V73*, editorial-v73; #12/#15/#16 | Devam Ediyor | Yeni #22 bankayı değiştirmedi; preservation test geçti. Bağımsız ilahiyat onayı yerine yazılım testi gösterilmez |
| Premium sonuç rozetleri / skor kırpılması | RESULTS-CATEGORY-ACCEPTANCE, result-experience smoke | Devam Ediyor | Yeni gerçek web sonuç görüntüleri mevcut; yeni adayda tüm başarı seviyeleri/native yeniden kabul bekliyor |
| Onaylı 9 kategori görseli / ortak kart / soru sayısı kaldırılması | RESULTS-CATEGORY*, PROFILE-ACCEPTANCE | Devam Ediyor | Dosyalar tabanda korunuyor; yeni adayda tüm görsel matris yeniden çalıştırılmadı |
| Renkli ana sayfa / profil istatistikleri | HOME-COLOR-CARDS*, PROFILE-ACCEPTANCE | Devam Ediyor | Önceki iPhone kullanıcı kabulü kaydı var; yeni XP sonrası göstergeler yeniden test edilecek |
| Sabit 5 alt sekme / avatarlar / tema taslak-kaydet | FIXED-TABS*, MOBILE-UI*, mevcut tests | Devam Ediyor | Kod korunuyor; fiziksel %150/%200 bu yeni adayda henüz yok |
| Ses: tok efekt / tik | AUDIO-EXPERIENCE, ANDROID-AUDIO-DEVICE-ACCEPTANCE | Engellendi | Son ses sürümünün fiziksel Samsung kabulü kullanıcıdan bekleniyordu; geçti sayılmadı |
| Güvenli hesap silme / web / gizlilik | ACCOUNT-DELETION*, policy #19 | Devam Ediyor | Yeni SQL erasure regresyonu geçti. Canlı backend değiştirilmedi; yeni auth Google kabulü ayrıca bekliyor |
| Push kapalı test / FCM / APNs | PUSH-NOTIFICATIONS-READINESS | Engellendi | Önceki Android teslim/tap kullanıcı kanıtı var; tür kapatma testi ertelendi. Ücretli Apple/APNs fiziksel kabul yok; genel push açılmayacak |
| Logo / adaptive icon / stüdyo açılışı | approved-logo-20261031, #21 | Devam Ediyor | Logo sürüm tabanında; yeni AAB upload/yayın durumunu bu oturumda doğrulamadık. Stüdyo animasyonu değiştirilmedi |
| AdMob test / UMP / Analytics kapalı | admob-test-20261030, #18/#20 | Devam Ediyor | Kod/ayarlar korunuyor; gerçek reklam ve Analytics açılmadı |
| Play Alpha / reviewer / Türkiye / testçiler | play-closed-test-* #17/#20 | Engellendi | Kullanıcı Alpha'nın yayında olduğunu bildirdi; güncel Console durumu bu oturumda okunmadı. Liste/kanal değiştirilmez |
| Main / Vercel / yeni AAB yayın sınırları | bu takip + rollout planları | Engellendi | Bu adaylar için ayrı nihai onay gerekli; yapılmadı |
| Modüler mimari / çakışma / regresyon | AGENTS.md, farklı worktree'ler | Devam Ediyor | Sonuç fix #22'de korunuyor; C/D onun üzerine. Final test sonrası diff/soy kontrolü yapılacak |

Kayıt testler ve PR kanıtları geldikçe güncellenecek. Erişilemeyen sohbetler,
Console veya fiziksel cihazlar hakkında varsayımla `Tamamlandı` yazılmayacak.

## Yeni adayın tamamlanmayan yayın adımları

C/D yerel kabulü canlı dağıtım anlamına gelmez. A/B: Google gerçek kayıt ve
Gmail/hosted uçtan uca kabulü; A/C: hosted migration/Edge 1 Kasımda açık onayla uygulandı; tümü için
fiziksel Android/iOS ve sonraki imzalı Alpha güncellemesi ayrı bekleyen işlerdir.
Son Settings/hesap regresyonu 11 grup; Google sentetik akışı 13 grup; C/D kabul dosyasında kanıtı var.

## Doğrulanan GitHub PR envanteri

| PR | Durum | Dal → hedef |
|---|---|---|
| [#23](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/23) | OPEN | `feat/progressive-xp-notification-cards-20261101` → `fix/twenty-second-auth-callback-20261101` |
| [#22](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/22) | OPEN | `fix/twenty-second-auth-callback-20261101` → `release/play-final-candidate-20261030` |
| [#21](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/21) | MERGED | `feat/approved-education-logo-20261031` → `release/play-final-candidate-20261030` |
| [#20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20) | OPEN | `release/play-final-candidate-20261030` → `feat/admob-test-integration-20261030` |
| [#19](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/19) | MERGED | `docs/privacy-admob-test-20261030` → `main` |
| [#18](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/18) | OPEN | `feat/admob-test-integration-20261030` → `release/android-closed-test-20261030` |
| [#17](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/17) | OPEN | `release/android-closed-test-20261030` → `main` |
| [#16](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/16) | MERGED | `fix/v73-room-erasure-guard-20261030` → `main` |
| [#15](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/15) | MERGED | `feat/activate-bank-v73-20261030` → `main` |
| [#14](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/14) | MERGED | `feat/home-color-cards-20261028` → `main` |
| [#13](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/13) | OPEN | `feat/google-auth-password8-20261027` → `main` |
| [#12](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/12) | CLOSED | `feat/iman-ahlak-editorial-v73-20261027` → `main` |
| [#11](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/11) | MERGED | `fix/catalog-privacy-acceptance-20261027` → `integration/mobile-game-ui-20261026` |
| [#10](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/10) | MERGED | `feat/premium-profile-navigation-20261027` → `integration/mobile-game-ui-20261026` |
| [#9](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/9) | MERGED | `feat/canonical-v72-all-modes-20261027` → `integration/mobile-game-ui-20261026` |
| [#8](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/8) | MERGED | `integration/mobile-game-ui-20261026` → `main` |
| [#7](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/7) | MERGED | `feat/settings-push-notifications` → `main` |
| [#6](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/6) | CLOSED | `feat/fixed-tabs-approved-icon` → `feat/approved-special-category-art` |
| [#5](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/5) | MERGED | `docs/account-deletion-live-acceptance` → `main` |
| [#4](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/4) | MERGED | `feat/account-deletion-production` → `main` |
| [#3](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/3) | CLOSED | `feat/approved-special-category-art` → `feat/android-preview-play-readiness` |
| [#2](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/2) | MERGED | `feat/android-preview-play-readiness` → `main` |
| [#1](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/1) | MERGED | `feat/audio-public-ci` → `main` |

## 1 Kasım onaylı backend uygulaması

Kullanıcı yalnız sınırlı backend/geçici hesap test planını onayladı. Üç migration
ve Edge v17 uygulandı. [Dağıtım ve doğrulama](xp-notifications-20261101/backend-deployment.md).
Main, Vercel Production, Alpha, testçi listesi, genel Google kaydı/push, reklam
ve Analytics değiştirilmedi. Gerçek Google/Gmail ve yeni Alpha kabulü bekliyor.
