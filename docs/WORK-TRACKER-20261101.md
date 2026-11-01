# Birleşik görev takibi — 1 Kasım 2026

Bu kayıt önceki talimatları iptal etmez. `Tamamlandı` yalnız belirtilen kapsamın
uygulama + test kanıtıdır; canlı yayında olduğu anlamına gelmez. Aday ve üretim
ayrıdır. Fiziksel cihaz testi, emülatör veya web kontrolüyle ikame edilmez.
Tablolar son durumu gösterir; aşağıdaki kronolojik notlardaki eski bekleme
kayıtları, daha sonraki kabul/temizlik sonuçlarıyla birlikte okunmalıdır.

## Dal / çakışma envanteri

- En güncel kapalı test kod tabanı: `release/play-final-candidate-20261030`
  `31e1278`; PR #20 → #18 → #17 katmanlı, henüz main'e birleşmemiş.
- Süre / Auth / sonuç geçişi: `fix/twenty-second-auth-callback-20261101`
  `44a55eb`, [PR #22](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/22).
- XP + bildirimler: ayrı `feat/progressive-xp-notification-cards-20261101`
  worktree; #22 üzerine kurulu. [PR #23](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/23); XP ve bildirimler aynı PR içinde. Son kaynak kabulü `7889be4`; sonraki commit'ler kabul belgeleridir.
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
| A4 | Canlı oda yeni default / CHECK 20; eski oda korunur | yeni timing migration; #22 | Tamamlandı | İzole SQL + hosted iki test aktörü RPC: 15.02 sn kabul, >20 sn ret, 5 sn reveal, tek kayıt | Canlıya onayla uygulandı; eski 10 oda aynı; iki cihaz testi değil |
| A5 | Asenkron server-authoritative süre / expire / idempotency | timing migration, online-duel; #22 | Tamamlandı | İzole SQL 19 sn kabul/20.1 sn ret; hosted native davet kabulü, 13.67 sn tek yanıt; özel anahtarlar | Edge v18/SQL canlı; iki fiziksel oyunculu kabul yok |
| A6 | Canlı istemci/sunucu birlikte etkin | #22; backend-deployment.md | Devam Ediyor | Edge v18 + ileri timing/davet migration; yeni QA istemci gerçek hosted maç kabulü/20 sn geçti, eski kayıtlar korundu | Yeni imzalı istemci ve Alpha güncellemesi bekliyor |
| A7 | Son cevap → skor öncesi boş oyun ekranı | QuizScreen; #22 | Tamamlandı | 6 turda DOM commit gözlemi, boş ekran 0 | Native 100 video karesi: boş mesaj 0; skor 62 kare |
| A8 | Fiziksel Android / Alpha güncellemesi | acceptance.md; #22 | Engellendi | QA APK yerel emülatörde 00:20 | Fiziksel cihaz ve ayrı yayın onayı |

## B — Auth

| Görev | Alt gereksinim | Dosya / PR | Durum | Test / kanıt | Kalan |
|---|---|---|---|---|---|
| B1 | Google kayıt kök nedeni | README; #22 | Tamamlandı | Hosted hook/flags salt okunur: googleSignupEnabled=false | Cloud Testing listesi bugün yeniden okunmadı |
| B2 | Kanca kaldırmadan süreli özel test listesi | yeni allowlist migration; #22 | Tamamlandı | İzole SQL, RLS/metadata spoof/expiry testleri; izinli Google testi geçti | Test temizliği sonrası liste boş; googleSignupEnabled=false |
| B3 | Gerçek yetkili Google yeni kayıt/giriş | #22; backend-deployment.md | Tamamlandı | Gerçek web kaydı + Android Google hesap seçimi → otomatik Profil; tek hesap/identity; force-stop/relaunch aynı hesap; iki geçici hesap güvenle silindi | Fiziksel Samsung/iOS kabulü yok; genel Google kaydı kapalı |
| B4 | PKCE, çift callback, taze getUser ve session hazır olunca profil | verifyLink, useAuthCallback, OnlineProvider; #22 | Tamamlandı | 396 unit; yerel Auth/SMTP; gerçek hosted Gmail native otomatik oturum/Profil | Son Google happy-path önceki QA; final ret ve e-posta final QA'da geçti |
| B5 | Parametresiz / ağ / kullanılmış / recovery ayrımı | callback modülleri; #22 | Tamamlandı | HTTP 15 sn/UI 35 sn; unit + yerel web bare/replay | Native hata matrisi tamamlanmadı |
| B6 | Chrome → native cold-start otomatik profil | hosted-fresh-email-native-result.json; #23 | Tamamlandı | Final Android 14 QA: gerçek taze Gmail bağlantısı → otomatik Profil; şifre tekrar istenmedi; exact fixture/session sunucuda doğrulandı | Fiziksel Samsung/iPhone değildir; önceki gecikmiş expiry ayrı kayıtta |
| B7 | SecureStore oturum relaunch / çıkış | acceptance; #22/#23 | Tamamlandı | Hosted Google, şifreli ve taze e-posta callback oturumları relaunch sonrası korundu; çıkış/silme temizliği doğrulandı | Fiziksel cihaz kabulü bekliyor |
| B8 | Google hesap eşleme / silme / recovery regresyonu | mevcut #13 + #22 | Devam Ediyor | Google OTP + iki e-posta şifreli native silme geçti; üç fixture 0, sahipsiz profil/session/identity 0; final ret açıklaması tek ekran | Yeni adayda native gerçek şifre sıfırlama kabulü bekliyor |
| B9 | Hosted callback/template/Edge dağıtımı | rollout-plan; #22/#23 | Tamamlandı | Onaylı Edge v18/migration; gerçek Google ve taze e-posta native dönüş/kalıcılık/silme geçti; template/politika değiştirilmedi | Genel Google kaydı kapalı; imzalı Alpha ve fiziksel kabul ayrı |
| B10 | Kullanıcı adı henüz seçilmemiş doğrulanmış profil etiketi | PlayerIdentityCard; önceki profil UI | Yapılmadı | Taze otomatik giriş görüntüsünde kullanıcı adı yokken “Misafir Oyuncu” yazıyor; gerçek oturum hesap ekranı ve sunucudan doğrulandı | Etiket oturum durumunu yanlış çağrıştırıyor; bu kabul turunda yeni kod değişikliği yapılmadı |

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
| D3 | Gerçek arkadaş isteği kabul/ret | mevcut social endpoint | Tamamlandı | Fixture ACK/tek istek; hosted native Kabul Et → server accepted ve pasif kart | Ret için fixture/SQL; fiziksel kabul yok |
| D4 | Davete Katıl / Daha Sonra | challenge_reply; #22/#23 | Tamamlandı | Ek plan onayıyla v18/migration uygulandı; hosted native Later pending/read, Katıl tek maç/iki oyuncu/20 sn; 13.67 sn yanıt ve çift dokunmada tek kayıt | Fiziksel/iOS ve Play-signed kabul bekliyor |
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
| Güvenli hesap silme / web / gizlilik | ACCOUNT-DELETION*, policy #19 | Devam Ediyor | SQL erasure ve hosted native Google OTP/e-posta şifreli silme geçti; üç izinli fixture temiz. Mevcut silme backend'i değiştirilmedi; tüm platform matrisi yeniden yapılmadı |
| Push kapalı test / FCM / APNs | PUSH-NOTIFICATIONS-READINESS | Engellendi | Önceki Android teslim/tap kullanıcı kanıtı var; tür kapatma testi ertelendi. Ücretli Apple/APNs fiziksel kabul yok; genel push açılmayacak |
| Logo / adaptive icon / stüdyo açılışı | approved-logo-20261031, #21 | Devam Ediyor | Logo sürüm tabanında; yeni AAB upload/yayın durumunu bu oturumda doğrulamadık. Stüdyo animasyonu değiştirilmedi |
| AdMob test / UMP / Analytics kapalı | admob-test-20261030, #18/#20 | Devam Ediyor | Kod/ayarlar korunuyor; gerçek reklam ve Analytics açılmadı |
| Play Alpha / reviewer / Türkiye / testçiler | play-closed-test-* #17/#20 | Engellendi | Kullanıcı Alpha'nın yayında olduğunu bildirdi; güncel Console durumu bu oturumda okunmadı. Liste/kanal değiştirilmez |
| Main / Vercel / yeni AAB yayın sınırları | bu takip + rollout planları | Engellendi | Bu adaylar için ayrı nihai onay gerekli; yapılmadı |
| Modüler mimari / çakışma / regresyon | AGENTS.md, farklı worktree'ler | Tamamlandı | C/D dalı #22'nin `44a55eb` kaynağını içeriyor; 396 unit, TypeScript/lint/export ve ilgili SQL regresyonu geçti; diğer worktree değişiklikleri korunuyor |

Kayıt testler ve PR kanıtları geldikçe güncellenecek. Erişilemeyen sohbetler,
Console veya fiziksel cihazlar hakkında varsayımla `Tamamlandı` yazılmayacak.

## Yeni adayın tamamlanmayan yayın adımları

C/D yerel kabulü canlı dağıtım anlamına gelmez. A/B: Google gerçek kayıt ve
taze Gmail/hosted native kabulü geçti; A/C: hosted migration/Edge 1 Kasımda açık onayla uygulandı; tümü için
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


### Hosted native Auth testinin son durumu

İzinli ikinci geçici hesap, hesap sahibinin şifre girişiyle gerçek Android
uygulamasından oluştu; tek kayıt ve doğrulanmamış e-posta sunucuda teyit edildi.
Chrome/Gmail callback kabulü bağlantının açılmasını bekliyor. Yeni hesap limiti
2/2; bu sınırı aşmadan mevcut iki geçici hesabın test ve güvenli temizliği
sürdürülecek. Tarayıcı otomasyonu kapalı olduğundan manuel bağlantı aktarımı
hazırlandı; şifre/token sohbet veya Git'e alınmadı.


### Gecikmiş gerçek e-posta callback — açık kalan hata

Native callback ulaştı; o aşamada sunucu email_confirmed_at dolu ancak session yok.
`/token` 422 `flow_state_expired`. Yaklaşık 10 dakika beklenmiş signup flow'unda
otomatik giriş **geçmedi**. Bu aday için hosted cold-start kabulü tamamlandı
sayılmaz. Yanıltıcı expired mesajı adayda düzeltildi; sonraki güvenli şifreli giriş
aynı hesap üzerinde geçti. Yeni hesap oluşturma ve Auth süresi/politika değişikliği
yapılmadı. [Kanıt](xp-notifications-20261101/hosted-email-expired-result.json).


### Aynı hosted hesapla güvenli giriş geçti

Hesap sahibinin şifreyle Android girişi başarılı; hosted confirmed=true/session=1.
Force-stop/relaunch sonrasında native oturum korundu. Gecikmiş callback sonucu
ayrı başarısız kabul olarak korunur. Yeni hata mesajı +391 test ve web export
geçti. Yerel GoTrue/Mailpit gecikme regresyonu ve token_hash alternatif kanıtı
raporda; canlı şablon/PKCE politikası değiştirilmedi. Yeni hosted signup testi
mevcut iki yeni hesap sınırı içinde yapılamıyor; ek hesap için ayrı izin gerekir.

### Hosted canlı odada iki test aktörüyle sınır testi

Yalnız mevcut iki izinli geçici hesap kullanıldı; yeni hesap oluşturulmadı.
Gerçek RPC ile create/join/ready/start, iki aktörde aynı deadline, 15.02 sn'de
yanıt kabulü, aynı isteğin tek kaydı, farklı ikinci isteğin kilitlenmesi,
20 sn sonrasında ANSWER_LATE ve 5 sn reveal geçti. İşlem bütünü ROLLBACK:
oda, geçici profil ayarı ve olası bildirim kuyruğu kalıcı yazılmadı.
Bu yönetici bağlantısından SQL entegrasyonudur; iki telefon/Edge Auth/UI
uçtan uca kabulü değildir. Kanıt: hosted-live-boundary-result.json.

### Gerçek Android Google dönüşü ve oturum kalıcılığı

İlk uzun Google doğrulaması Chrome'da Production ana sayfasına düştü; native
login/session oluşmadı ve başarı sayılmadı. Auth loglarında expiry ifadesi var.
Yeni kısa denemede aynı izinli iş hesabı hesap seçiminden sonra otomatik native
Profil'e döndü. Hosted son giriş 13:07:32 UTC; tek uygulama hesabı/tek Google
identity. Force-stop/relaunch sonrası Hesap ekranında doğru iş e-postası ve
doğrulanmış durum görüldü; önceki e-posta test kimliği görünmedi. Uygulama
şifresi veya ikinci uygulama e-posta doğrulaması istenmedi. Ekran görüntüsü ve
`hosted-google-native-result.json` kanıttır; fiziksel Samsung kabulü değildir.

### Davet üzerinden yeni maç: bulunan kapsam boşluğu

Önceki 20 sn testleri create/join'i kapsadı; matchmaking iç create çağrısındaki
timingVersion eksikliği atlanmıştı. Canlı kaynak bunu doğruladı. Yeni düzeltme
eski migration'ı değiştirmez; tek ileri migration + Edge/client alanı. İzole
regresyon önce UPDATE_REQUIRED üretti, düzeltmeden sonra 20 sn alıcı başlangıcı,
tekrar, eski kabul edilmiş zamansız maç/ret/iptal ve ACL kontrolleri geçti.
Tam izole SQL ve birleşik **391 test/TypeScript/lint/soru kontrolü** geçti.
Ek canlı değişiklik **uygulanmadı**; ayrı somut onay planı:
`timer-auth-20261101/direct-challenge-correction-plan.md`.

### Ek onay sonrası davet düzeltmesi uygulandı

Yukarıdaki önceki bekleme kaydından sonra kullanıcı ek planı açıkça onayladı.
Edge v18 ve migration `20261101133436` uygulandı. Yeni yerel QA APK üzerine
kuruldu; gerçek hosted arkadaşlık kabulü, erteleme/pending ve davete Katıl
işlemleri native oturumla geçti. Tek maç, iki oyuncu, 20 sn ve ilk cevabın
13.67 sn'de tek satırla kabulü sunucuda doğrulandı. Yeni hesap yok (limit 2/2).
Kanıt: `timer-auth-20261101/direct-challenge-correction-deployment.md`.
Geçici hesap temizliği için mevcut Google OTP/SİL son adımı kullanıcıyı bekliyor.

### İki geçici hesabın temizliği tamamlandı

Sonraki kullanıcı yanıtlarıyla Google OTP ve e-posta şifreli silme mevcut native
ekranda tamamlandı. Sunucuda iki Auth hesabı/profil 0; sahipsiz session/identity
0. Test için süreli Google kayıt izni kaldırıldı; liste boş, genel kayıt kapalı.
Yerel oyun geçmişi/XP korunuyor. Yeni hosted hesap limiti 2/2 olarak tüketildi;
silinmiş olması üçüncü yeni hesap için izin vermez.

### Son Google hata akışı regresyonu

Callback error fragment'inin Router'da kaybolması ve eşzamanlı iki hata
tesliminin pending kaydı tüketmesi düzeltildi. Sonuçlar bounded bellekte tek
işlenir; nonce/hedef/expiry/PKCE/UID koruması ve implicit token reddi sürer.
Google callback üstüne eski ekranın ikinci hata modalı açılmaz.
396 unit test + TS/lint + web export geçti. Son Android emülatör paketinde
gerçek Google ret açıklaması tek ekranda; yanlış expiry/ağ/ikinci modal yok,
yeni hosted hesap 0. Başarılı native Google kanıtı son hata-işleme düzeltmeleri
öncesindendir; güncel happy-path tekrar kabulü varsayılmaz.
Geçerli e-posta linkinin hosted/native otomatik girişi için
`timer-auth-20261101/fresh-email-native-retest-plan.md` hazır; ayrı izin bekler.

### Tek ek hosted e-posta testi onaylandı

Kullanıcı yalnız planlanan fresh e-posta hesabını ve testi onayladı; önkontrol
existing count=0. Emülatör formu hazır, şifre ve gerçek Gmail linki aktarımı
kullanıcının kontrolünde. Henüz otomatik giriş kabul sonucu yok; yeni onay
genel kayıt/yayın/Auth politika veya dördüncü yeni hesap izni değildir.

### Taze hosted Gmail otomatik giriş ve son temizlik geçti

Son QA APK (`26e3b489…dae2aa014`) üzerinde taze kayıt 15:31:25 UTC, e-posta
doğrulaması 15:32:44 UTC ve giriş 15:32:49 UTC. Sahip gerçek Gmail bağlantısını
emülatör Chrome'da açtı; uygulama cold start ile otomatik Profilim'e döndü.
Yeniden şifre girişi olmadı. Hesap ekranındaki tam fixture adresi, sunucudaki
confirmed/session=1 ve force-stop/relaunch sonrası aynı oturum doğrulandı.
Önceki yaklaşık 10 dakikalık expired bağlantı ayrı başarısız deneme olarak kalır.

Sahip son mevcut şifre/SİL/silme formunu tamamladı. Native giriş ekranına döndü;
sunucuda üç izinli fixture hesabı 0, sahipsiz profil/session/identity 0. Yerel
20 XP, seviye 1 ve son skor 200 korundu. Google test izin listesi boş;
oauth/deletion açık, genel Google yeni kaydı kapalı. Yeni migration/şablon/
Auth ayarı veya yayın yok. Kanıt: `xp-notifications-20261101/hosted-fresh-email-native-result.json`.
