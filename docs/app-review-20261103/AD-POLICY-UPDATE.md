# Reklam politikasında hedefli düzeltme — 3 Kasım 2026

PR #30'un `d13dc73` kaynağı üzerine uygulanır. Ayrı branch/PR açılmaz;
başka worktree'nin dosyası, main, backend veya yüklü binary değişmez.

## Uygulanan davranış

- `adPolicy.ts`: `testAdsAllowed` artık reklam veya UMP uygunluğu şartı
  değildir. Alan eski yerel kayıtları kayıpsız okuyabilmek için tutulur.
  Hem false hem true eski kayıtlar aynı yaş/UMP kurallarına tabidir.
- `AdProvider.tsx`: yetişkin uygunluğu sonrasında ana sayfada gerekli UMP
  formu/ATT durumu otomatik ele alınır. Ayrı reklam etkinleştirme işlemi
  istenmez. Oyun oturumu, yanlış ekran, arka plan ve eşzamanlı işlem kilitleri
  korunur. Yaş tercihi değişince uygunluk tekrar kontrol edilir.
- `AdPrivacySettings.tsx`: reklam açma düğmesi kaldırılır; yaş uygunluğu,
  izinleri yeniden hazırlama ve Google gizlilik seçenekleri korunur.
- `consentAuthorization.ts`: UMP reddinde ATT/SDK başlatılmaz. UMP uygunsa
  ATT kontrolünün bitmesi beklenir; ATT false reklam kararını false yapmaz.
  Kontrol hata verirse hata üst akışta yakalanır, SDK başlatılmaz. İzin reddi
  takip onayı değildir; GMA'nın sistem ATT durumuna uyması esas alınır.
- `runtime.native.tsx` değiştirilmedi: NPA istekleri, iOS publisher first-party
  ID kapatma, gecikmeli SDK başlangıcı, test kimlikleri ve zaman aşımı korunur.
- `config/admob.js`: live yalnız iOS store yapılandırmasında kabul edilir.
  Development/simulator live reddedilir. Store/test profilleri test modunda
  kalır; Android gerçek reklamları açılamaz. `runtimeConfig.ts` yalnız eski
  test/live kayıt ayrımının artık rıza olmadığına ilişkin yorumu düzeltir.
- `src/app/privacy.tsx`: yeni politikayla çelişen yerel açıklamalar düzeltildi.

18+ sınırı korunur: yaşı bilinmeyen/reşit olmayan kullanıcıda UMP veya reklam
başlatılmaz. Bu, oyunu 18+ yapmaz; yaş beyanı UMP/ATT rızası yerine geçmez.
Mevcut home banner ve kayıtlı sonuçtan çıkışta sunulan geçiş reklamı korunur.
Geçişin mevcut atlama seçeneği, ilk iki tur koruması, beş dakika sınırı,
skor/XP bağımsızlığı değiştirilmez; yeni/ödüllü reklam yoktur.

## ATT reddinde teknik dayanak

Google açıkça ATT reddinde de reklam istenebileceğini ve GMA'nın IDFA'yı
göndermeyeceğini belirtir. Apple ATT'yi şirketler arası takip/IDFA için ister;
reddedilen izni alternatif tanımlayıcı veya fingerprinting ile aşmaya izin
vermez. Bu nedenle NPA korunur, publisher first-party ID kapalıdır; hesap
e-postası, skor, kullanıcı kimliği reklam talebine eklenmez. Yeni mediation,
ölçüm veya tanımlayıcı kütüphanesi eklenmez. UMP'de gerekli storage/basic-ads
izinleri reddedildiğinde reklam isteği yapılmayan mevcut daha korumacı yol
aynen korunur; bu görev limited-ads/refusala rağmen reklam yolu eklemez.

Bu, gerçek cihazda SDK ağ davranışının incelendiği iddiası değildir. Yeni
paket/kurulum bu görevde yasak olduğundan yeni politika fiziksel kabulü bekler.

- [Google: IDFA olmadan reklam](https://developers.google.com/admob/ios/privacy/idfa)
- [Google: first-party ID kapatma ve ATT sırası](https://developers.google.com/admob/ios/privacy/strategies)
- [Apple: ATT ve veri kullanımı](https://developer.apple.com/app-store/user-privacy-and-data-use/)
- [Google: bölgesel UMP/geri alma](https://developers.google.com/admob/ios/privacy/gdpr)

## Test kapsamı ve değiştirilmeyen kanıt

`tests/ads.test.ts` eski false/true/eksik `testAdsAllowed` kayıtlarını, yaş,
hazır olmayan/reddedilmiş SDK durumunu, oyun/arka plan/ekran, cooldown ve
geçiş hata davranışını kapsar. `tests/ios-ads.test.ts` ATT false/true,
UMP reddi, kontrol hatası, ATT tamamlanmadan ilerlememe, test/live ve Android
izolasyonu ile final artifact guard kontrollerini kapsar. Son komut sonuçları
alttadır; birim kanıtı native kabul yerine geçmez.

| Kontrol | Gerçek sonuç |
| --- | --- |
| `pnpm typecheck` | GEÇTİ |
| `pnpm lint` | GEÇTİ; sıfır uyarı |
| `pnpm exec tsx --test tests/ads.test.ts tests/ios-ads.test.ts` | GEÇTİ; 24/24 |
| `pnpm exec tsx --test tests/question-timer.test.ts tests/game.test.ts tests/result-presentation.test.ts` | GEÇTİ; 39/39 |
| `git diff --check` | GEÇTİ |
| Yeni politika native/iPhone reklam/ağ kabulü | ÇALIŞTIRILMADI; yeni paket veya kurulum yapılmadı |
| Yeni tam suite / yeni web/native derleme | ÇALIŞTIRILMADI; bu görevde hedefli mevcut testler kullanıldı |

Özel veri içermeyen komut günlükleri Git dışında
`/Users/ozge/.local/share/anla-quiz-build/app-review-20261103/ad-policy-*.log`
dosyalarındadır. Bu kod değişikliği için yeni UI/native kabulü uydurulmaz.

Mevcut fiziksel build 5 (`0343888`, JS `44261763…68c995a`) ve build 4
değiştirilmez. Sahibinin build 5'te doğruladığı 20 sn, süre dolması, sonuç
sırası/skor kırpılmaması, XP/tur güncellemesi ve profil korunması geçerlidir;
yeni reklam politikasına veya gerçek reklam sunumuna taşınmaz.

## İlk reklamlı yayın adayına katılmadan önce

1. Bu değişikliğin PR #30 içinde incelenmesi; main merge ayrı onaydır.
2. PR #31'deki web politika metninin bu davranışa uyarlanması ve ayrı
   main/Vercel onayı; bu görevde o worktree veya PR değiştirilmedi.
3. iOS UMP mesajının doğru uygulama/politikayla etkinliği; gerçek iPhone'da
   UMP kabul/ret/geri alma, ATT ret/izin değişimi, NPA banner/geçiş,
   background/offline/hata ve oyun kesintisizliği kabulü. Fiziksel EEA test
   cihazı tanınmadan debug coğrafyası testi geçti sayılmaz.
4. App Privacy'nin final GMA/UMP manifestleriyle 14 tür/amaç/linked/tracking
   tablosunun uzlaştırılması. ATT ret yolu bütün uygulama için Tracking No
   veya hiç veri toplanmıyor sonucunu doğurmaz. DeveloperAdvertising amacı
   ve gerçek SDK ağı için önceki açık kontroller korunur. Publish sahibi yapar.
5. Sonraki ayrıca yetkili paket aşamasında yeni benzersiz build numarası,
   güvenli client config, doğru store/live birimleri ve QA override yokluğu
   doğrulanır. TestFlight/QA test birimleri korunur; revenue onayı olmadığı
   sürece mevcut güvenli test profili değiştirilmez.

Apple giriş/silme canlı kabulü ve genel kayıt politikası, AdMob hesap/app
readiness, DSA ve App Review gereksinimleri açık kalır. Bu dar reklam
düzeltmesi bunları çözüldü saymaz. Yeni IPA, kurulum, upload, canlı Supabase,
App Privacy Publish veya App Review gönderimi yapılmadı.
