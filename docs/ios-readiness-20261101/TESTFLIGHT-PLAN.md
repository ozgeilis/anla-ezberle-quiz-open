# TestFlight: sahibi onayladıktan sonra uygulanacak plan

Bu PR bir App Store gönderimi değildir. Apple üyeliği, App ID kaydı veya credential değiştirilmedi. IPA/App Store Connect yüklemesi yapılmadı.

1. Aktif Apple Developer Team ve hukuki yayıncı adını sahibiyle doğrula. Ücretli işlem/üyelik kabulü kullanıcıya aittir.
2. Kalıcı `com.kovynelstudio.anlaezberle` Bundle ID kullanılabilirliğini kontrol et, ayrı onayla kaydet. Prototip ID'yi başka uygulamaya çevirmeden koru. Yeni ID ayrı sandbox demektir; prototip cihaz yerel geçmişi kendiliğinden taşınmaz. Mevcut uygulamayı silme.
3. App Store Connect uygulaması: Türkçe birincil dil, iOS adı/Bundle ID, benzersiz SKU. Yeni sözleşme/hesap kabulünde kullanıcı devralır.
4. Dağıtım sertifikası, App Store provisioning, Sign in with Apple ve Push capability. EAS credentials yetkisi gerekiyorsa ayrı onay. APNs .p8 özel anahtar/signer dosyası Git'e konmaz.
5. APPLE-AUTH-AND-BACKEND.md ve REVIEW-CHECKLIST.md yayın engellerini kapat. Kontrollü Supabase provider/hook/deletion güncellemesi için ayrı somut plan/onay.
6. Kayıt/Team onayı sonrası `registeredBundleId` ve `appleTeamVerified` kaydını doğrula; `IOS_REGISTERED_BUNDLE_ID` açıkça verilmiş `ios-development` profiliyle yeni kimliğin fiziksel kabulünü yap (diğer geliştirme profilleri prototipi korur). mevcut prototipin üzerine yanlış kimlikle kurma. Profile/Team eşleşmesini doğrula.
7. Bundle ID/Team ve fiziksel/Auth/review kabulü belgelenince `config/ios-store-approval.json` kaydını yalnız yeni sahibi onayıyla aç. `IOS_REGISTERED_BUNDLE_ID` onaylı değeri EAS'ta özel build ortamına koy. Android ayarlarına dokunma.
8. `pnpm dlx eas-cli@25.3.0 build --platform ios --profile ios-testflight` komutunun güncel yardımını kontrol ederek üret. Ücretli kota/işlem gerekirse dur. App sürümü başlangıçta 0.1.0; iOS CFBundleVersion EAS remote buildNumber ile monoton artar. Android versionCode bağımsız kalır. Pazarlama sürümü Android'le bilinçli ortak değişir.
9. IPA kimliği, Team/provisioning, entitlements, min OS, ikon, Hermes/asset ve privacy manifest doğrula. Gerçek API endpoint/kapalı test yetkisi ve ADS_MODE=off doğrula. EAS Submit profili eklenmedi; otomatik gönderim yok.
10. Sahibi ayrı izin verirse yalnız seçilen IPA'yı App Store Connect'e yükle. Build processing / export compliance / privacy yanıtlarını doğrula.
11. İç TestFlight: yetkili App Store Connect kullanıcıları; dış test: grup/tester ayrı onayı ve Beta App Review. Android Alpha listeleri ve katılım süreci değişmez.
12. Fiziksel iPhone: 20 saniye tüm modlar, gerçek Safari mail/Google/Apple callback, ses/sessiz anahtarı, APNs açık/kapalı/foreground, cold start, hesap silme, cross-platform Android↔iOS oda/düello kabulü.
13. Mağaza görselleri ve metadata, App Privacy + yaş anketi, moderasyon ve incelemeci erişimi tamamlandıktan sonra **ayrı App Review yayın onayı**.

## Profiller

- `development-simulator`: önceki geliştirme davranışı korunur.
- `ios-simulator-acceptance`: imzasız yerel/simülatör Release kabulü; güncel içerik, reklam kapalı, Apple native capability hazırlığı.
- `ios-development`: development client; Apple hesabı/capability ile cihaz testi içindir. Mevcut kişisel Team development build'e JS-only olarak taşınacağı varsayılmaz.
- `ios-testflight`: store/Release + iOS buildNumber autoIncrement; kalıcı ID ortam/onay kapısı sağlanmadan durur.
- Eski Android development/preview/production/ads-* profilleri aynen korunur. iOS-* profiliyle Android üretimi build kapısında reddedilir.

EAS Update şu an yapılandırılmadı (`expo-updates` doğrudan bağımlılığı/runtimeVersion/updates.url yok). Bu PR OTA yayınlamaz. Apple native modülünün eklenmesi yeni native build gerektirir. Gelecek OTA yalnız uyumlu runtime ve özel test kanalıyla ayrı incelenmelidir.

TestFlight profilinde Expo Notifications plugin'i APNs `production` ortamını üretir; diğer mevcut profillerin plugin seçenekleri korunur. Bu, Apple APNs anahtarının kurulduğu veya teslimin test edildiği anlamına gelmez. Capability/provisioning ve EAS credential kabulü ayrıca gereklidir.
