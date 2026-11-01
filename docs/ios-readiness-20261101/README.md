# iOS / App Store hazırlığı — 1 Kasım 2026

Temel: main `89f6ba46255b0a611544cf764ceb4fc18ca775cd` (PR #24 birleşmiş). Ayrı dal: `feat/ios-store-readiness-20261101`. Android Alpha code5 Google incelemesinde; bu iOS çalışması Alpha binary'sini veya main/Production'ı değiştirmez.

## Kimlik, araçlar ve sınırlar

- Mevcut iOS Bundle ID `com.anlaezberle.quiz.prototype` korunur. Kalıcı öneri `com.kovynelstudio.anlaezberle`; Apple hesabında kullanılabilirlik/kayıt henüz doğrulanmadı. Android package, signing ve versionCode değişmedi.
- Xcode 27.1 (27A9275), Expo 58.0.21, React Native 0.88.1, React 19.3.0, AppleAuthentication 58.0.2. Üretilen iOS Podfile ve uygulama minimumu 16.4; RN pod alt hedefleri daha düşük olabilir. Yeni simulator runtime indirilmedi.
- Aktif banka ortak v73/1500. Domain motoru, 20 saniye, eski oda timing uyumluluğu, 100 seviye XP ve unvanlar main ile aynı; soru içeriği/skor/XP/kullanıcı verisi değişmedi.
- Apple sağlayıcısı canlıda açılmadı; yeni hesap, canlı migration, Apple App ID kaydı, IPA veya mağaza gönderimi yok.
- İlk kurulumda yaklaşık 8.5 GiB boş alan vardı. Derleme sırasında yalnız yeniden indirilebilir üç CocoaPods cache'i temizlendi; kullanıcı dosyaları, kurulu Pods ve başka worktree'ler korundu.

## Dosyalar

- [TestFlight planı](TESTFLIGHT-PLAN.md): Team/App ID/signing/EAS/IPA/inceleme adımları ve onay kapıları.
- [Apple Auth ve backend](APPLE-AUTH-AND-BACKEND.md): kod sınırı, nonce/session güvenliği, silme/revoke/hook engelleri.
- [Review ve gizlilik](REVIEW-CHECKLIST.md): 4.8, moderasyon, App Privacy, reklam/ATT/APNs, politika metni önerisi.
- [Türkçe mağaza içerikleri](STORE-METADATA.tr.md): metadata, açıklama, beta ve review notları.
- [Görseller](screenshots/README.md): yalnız gerçek native simülatör kanıtları ve mağaza planı.
- `config-evidence.json`: platform kimliği, mevcut Android profilleri ve reklam sınırları.

## Tekrarlanabilir yerel komutlar

```sh
pnpm install --frozen-lockfile
IOS_APPLE_AUTH=1 EXPO_PUBLIC_CONTENT_CHANNEL=production ADS_MODE=off pnpm exec expo prebuild --platform ios --no-install
# Ruby/CocoaPods'u mevcut kurulumdan kullan; yeni Apple hesabı veya sertifika gerekmez.
(cd ios && pod install)
IOS_APPLE_AUTH=1 EXPO_PUBLIC_CONTENT_CHANNEL=production ADS_MODE=off xcodebuild -workspace ios/AnlaEzberle.xcworkspace -scheme AnlaEzberle -configuration Release -sdk iphonesimulator -destination 'platform=iOS Simulator,id=<test-simulator-UUID>' -derivedDataPath <private-local-build-directory> -jobs 2 ONLY_ACTIVE_ARCH=YES CODE_SIGNING_ALLOWED=NO
node scripts/verify-ios-simulator.mjs <derivedData>/Build/Products/Release-iphonesimulator/AnlaEzberle.app <evidence.json>
pnpm check
pnpm questions:check
pnpm export:web
```

EAS'la hazırlanmış `ios-simulator-acceptance` ayrı profilidir; yerel xcodebuild komutu ücretli EAS build üretmez. Mevcut production Supabase URL + publishable key yalnız gitignore'lu `.env.local` içinde kullanılır; servis/admin anahtarı alınmadı. EAS environment geri indirilirken yalnız tek public istemci değişkeni istendi. Belgelere kimlik bilgisi eklenmedi.

## Uyumluluk notu

`expo install --check`, aynı SDK58 ailesinde Expo58.0.22, audio58.0.11, dev-client58.0.18, router58.0.29 ve screens4.30.1 yamalarını önerdi. Mevcut Android kabul tabanının native sürümleri bu PR'da topluca yükseltilmedi. Bu kontrol **uyarı/başarısız** olarak kaydedilir; native derleme ve test sonucu onun yerine uydurulmaz. Yama yükseltmesi ayrı Android/iOS regresyon kabulü gerektirir.

## Gerçek servis ve platformlar arası kabul planı

Yeni sentetik hesap yetkisi verilmeden canlı hesap oluşturulmaz. Apple hesabı ve kontrollü backend kabulü tamamlanınca Android↔iOS iki izinli hesapla arkadaşlık/istek/kabul, düello daveti/kabul/20sn/geç cevap/sonuç ve aynı canlı odada her iki oyuncunun serverNow/answerSeconds davranışı test edilir. Eski aktif 10/15 sn kayıtlar yeniden yazılmaz; eski istemci için UPDATE_REQUIRED yolu korunur. Ortak hesap ID'sinin iki platformda aynı online profil/XP/vitrine döndüğü kontrol edilir; bağımsız yerel geçmişlerin otomatik birleştirildiği iddia edilmez.

Safari mail/doğrulama/recovery, Google ve Apple callback, cold start/kalıcılık, APNs teslimi, sessiz anahtarı/telefon araması, ağ kesintisi ve hesap silme gerçek iPhone kabulünde ayrıca doğrulanmalıdır. Android emülatöründe önceki testler iOS testi yerine geçmez.

## Kalıcı görev tablosu

Durumlar çalışma sırasında güncellenir; ortak Android kanıtları iOS gerçek test kabulü yerine kullanılmaz. Önceki görevlerin ayrıntılı kaydı [WORK-TRACKER](../WORK-TRACKER-20261101.md) dosyasında korunur.

| Alt gereksinim | Dosya / kanıt | Durum | Kalan |
|---|---|---|---|
| Güncel main/PR24 ve ayrı worktree | config-evidence.json, git base89f6ba4 | Tamamlandı | Main'e iOS merge yok |
| Android kimlik/profiller/veri korunması | config-evidence.json, ortak testler | Tamamlandı ve test edildi | Yeni Android binary bu PR'da yok |
| Kalıcı ID seçimi | config/ios.js | Apple geliştirici hesabı bekliyor | Kullanılabilirlik/kayıt/onay |
| Simulator/native Pod kurulumu | Yerel xcodebuild/Podfile.lock | Devam ediyor | Son native sonuç |
| iOS build profilleri | eas.json + kapalı ios-store-approval | Kodlandı | Team/signing kabulü |
| Apple resmi buton/nonce/session/actor izolasyonu | appleAuth/appleFlow/AppleSignInButton + birim testleri | Kodlandı fakat gerçek cihaz testi bekliyor | Provider/capability, gerçek Apple test |
| Apple silme/revocation ve kapalı test hook'u | APPLE-AUTH-AND-BACKEND.md | Apple geliştirici hesabı bekliyor / eksik | Somut server credential + ayrı backend onayı ve implementasyon |
| 20sn/domain/v73/XP/unvan ortaklığı | Mevcut domain + 403 ortak test | Kodlandı ve ortak regresyon geçti | Native akışın gerçek kontrolü |
| E-posta/Google/Safari gerçek oturum | Ortak callback testleri, TestFlight planı | Gerçek iOS testi bekliyor | İzinli hesap/cihaz |
| Home/Quiz/sonuç/XP/profile/tema/safe area | screenshots + native smoke kaydı | Devam ediyor | Native build |
| Arkadaş/davet/oda/düello cross-platform | Aynı Supabase/domain; kabul planı | Gerçek iOS testi bekliyor | İzinli iki hesap, fiziksel Android+iOS |
| APNs teslimi/tap/cold start | device.ts / PushProvider | Apple geliştirici hesabı bekliyor | APNs, provisioning, izinli fiziksel cihaz |
| Ses/sessiz/background/interruption | Mevcut ortak ses testleri | Ortak test geçti; fiziksel iOS bekliyor | Ses çıkışı, sessiz anahtarı, çağrı |
| iPad ve 320/375/390/430 pt | screenshot planı | Devam ediyor | Gerçek native ölçü kabulü |
| Reklam kapalı/Analytics yok | config-evidence, REVIEW-CHECKLIST | Kod/config kontrolü geçti | Archive/gerçek cihaz ağ incelemesi |
| ATT/privacy manifest/App Privacy | REVIEW-CHECKLIST + simulator artifact raporu | Devam ediyor | Nihai archive + sahibin Connect beyanı |
| Gizlilik ve destek URL | Gerçek Chrome /privacy ve /settings/help kontrolü | Tamamlandı ve test edildi | iOS politika eki yalnız öneri; yayımlanmadı |
| Moderasyon/rapor/engelleme | Kod taraması + REVIEW-CHECKLIST | Eksik / yayın öncesi karar | Yeni server/ürün kapsamı ve test |
| Mağaza metadata / beta / review dosyaları | STORE-METADATA.tr.md | Hazır | Reviewer hesabı ve nihai gerçek özellik kabulü |
| IPA/Connect/TestFlight/App Review dağıtımı | TESTFLIGHT-PLAN.md | Apple geliştirici hesabı ve ayrı onay bekliyor | Üretim yapılmadı/yüklenmedi |

Yayımdaki `/privacy` (30 Ekim metni, Android reklam testi bölümü) ve `/settings/help` (Yardım ve mevcut destek e-postası) gerçek Chrome arayüzünde 1 Kasım günü doğrulandı. iOS politika eki henüz yayımlanmadı. Onaylı ikon `assets/images/icon.png`: 1024×1024, alfa kanalı yok; görsel değiştirilmedi.
