# TestFlight: sahibi onayladıktan sonra uygulanacak plan

Bu PR bir App Store gönderimi değildir. Üyelik/Team doğrulandı; sahibi ayrı onay verince kalıcı App ID kaydedildi. Connect uygulama kaydı ve beta metni hazır. IPA üretilmedi/yüklenmedi. Güncel kanıt: [CURRENT-STATE.md](CURRENT-STATE.md).

1. Aktif Apple Developer Team ve hukuki yayıncı adını sahibiyle doğrula. Ücretli işlem/üyelik kabulü kullanıcıya aittir.
2. Kalıcı `com.kovynelstudio.anlaezberle` ID, Team `W7CRC43SHP` altında ayrı onayla kaydedildi. Prototip ID'yi başka uygulamaya çevirmeden koru. Yeni ID ayrı sandbox demektir; prototip cihaz yerel geçmişi kendiliğinden taşınmaz. Mevcut uygulamayı silme.
3. App Store Connect uygulaması: Türkçe birincil dil, iOS adı/Bundle ID, benzersiz SKU. Yeni sözleşme/hesap kabulünde kullanıcı devralır.
4. Dağıtım sertifikası, App Store provisioning, Sign in with Apple ve Push capability. EAS credentials yetkisi gerekiyorsa ayrı onay. APNs .p8 özel anahtar/signer dosyası Git'e konmaz.
5. APPLE-AUTH-AND-BACKEND.md ve REVIEW-CHECKLIST.md yayın engellerini kapat. Kontrollü Supabase provider/hook/deletion güncellemesi için ayrı somut plan/onay.
6. Kayıt/Team onayı sonrası `registeredBundleId` ve `appleTeamVerified` kaydını doğrula; `IOS_REGISTERED_BUNDLE_ID` açıkça verilmiş yeni `ios-development` profilinin ayrı developmentBuildApproved onayını alıp yeni kimliğin fiziksel kabulünü yap (diğer geliştirme profilleri prototipi korur). mevcut prototipin üzerine yanlış kimlikle kurma. Profile/Team eşleşmesini doğrula.
7. Bundle ID/Team ve fiziksel/Auth/review kabulü belgelenince `config/ios-store-approval.json` kaydını yalnız yeni sahibi onayıyla aç. Kayıtlı ID yeni profile env içinde açıkça verilidir; mevcut EAS ortamını veya Android kimliğini değiştirme. Android ayarlarına dokunma.
8. `pnpm dlx eas-cli@25.3.0 build --platform ios --profile ios-testflight` komutunun güncel yardımını kontrol ederek üret. Ücretli kota/işlem gerekirse dur. App sürümü başlangıçta 0.1.0; iOS CFBundleVersion EAS remote buildNumber ile monoton artar. Android versionCode bağımsız kalır. Pazarlama sürümü Android'le bilinçli ortak değişir.
9. IPA kimliği, Team/provisioning, entitlements, min OS, ikon, Hermes/asset ve privacy manifest doğrula. Gerçek API endpoint/kapalı test yetkisi ve ADS_MODE=off doğrula. EAS Submit profili eklenmedi; otomatik gönderim yok.
10. Sahibi ayrı izin verirse yalnız seçilen IPA'yı App Store Connect'e yükle. Build processing / export compliance / privacy yanıtlarını doğrula.
11. İç TestFlight: yetkili App Store Connect kullanıcıları; dış test: grup/tester ayrı onayı ve Beta App Review. Android Alpha listeleri ve katılım süreci değişmez.
12. Fiziksel iPhone: 20 saniye tüm modlar, gerçek Safari mail/Google/Apple callback, ses/sessiz anahtarı, APNs açık/kapalı/foreground, cold start, hesap silme, cross-platform Android↔iOS oda/düello kabulü.
13. Mağaza görselleri ve metadata, App Privacy + yaş anketi, moderasyon ve incelemeci erişimi tamamlandıktan sonra **ayrı App Review yayın onayı**.

## Profiller

- `development-simulator`: önceki geliştirme davranışı korunur.
- `ios-simulator-acceptance`: imzasız yerel/simülatör Release kabulü; güncel içerik, reklam kapalı, Apple native capability hazırlığı.
- `ios-development`: kalıcı ID ve doğrulanmış Team ile development client; ayrı build onayı ve provisioning sonrası cihaz testi içindir. Mevcut kişisel Team development build'e JS-only olarak taşınacağı varsayılmaz.
- `ios-testflight`: store/Release + iOS buildNumber autoIncrement; kalıcı ID ortam/onay kapısı sağlanmadan durur.
- Eski Android development/preview/production/ads-* profilleri aynen korunur. iOS-* profiliyle Android üretimi build kapısında reddedilir.

EAS Update şu an yapılandırılmadı (`expo-updates` doğrudan bağımlılığı/runtimeVersion/updates.url yok). Bu PR OTA yayınlamaz. Apple native modülünün eklenmesi yeni native build gerektirir. Gelecek OTA yalnız uyumlu runtime ve özel test kanalıyla ayrı incelenmelidir.

TestFlight profilinde Expo Notifications plugin'i APNs `production` ortamını üretir; diğer mevcut profillerin plugin seçenekleri korunur. Bu, Apple APNs anahtarının kurulduğu veya teslimin test edildiği anlamına gelmez. Capability/provisioning ve EAS credential kabulü ayrıca gereklidir.

## Eski prototip ile kalıcı uygulamanın aynı telefonda bulunması

İki farklı Bundle ID aynı `anla-ezberle-quiz` scheme'ini taşıyabilir; callback yanlış yüklü uygulamaya giderse PKCE doğrulayıcısı bulunamaz. Kalıcı ID'ye geçişte bu risk ayrı gerçek cihaz testidir. Prototipi silmek veya scheme'i onaysız değiştirmek çözüm olarak uygulanmadı.

`templates/apple-app-site-association.json` doğrulanmış Team ile hazırlanmış bir taslaktır; web'e servis edilmedi, Associated Domains entitlement eklenmedi, Auth redirect izni genişletilmedi. Üretim için doğrulanmış Team+kalıcı ID ile yalnız `/online/auth` Universal Link kapsamı, sahipliği doğrulanmış HTTPS domain/AASA, Safari/ASWebAuthenticationSession ve Supabase dar callback yapılandırması ayrı incelenmeli/onaylanmalı. Taslağın dosyada bulunması geçerli web/AASA kurulumu değildir. İki uygulama birlikte yüklüyken e-posta/Google recovery akışı doğru uygulamada kanıtlanmadan kalıcı ID'nin Auth kabulü tamamlanmış sayılmaz.

## EAS ortamı ve çevrimiçi yapılandırma

Salt okunur EAS config kontrolünde `development` ortamında public Supabase değişkenlerinin bulunmadığı görüldü. Yeni üç iOS profili bu nedenle mevcut Android Alpha gibi **preview EAS ortamını** kullanır; bu etiket ayrı veritabanı anlamına gelmez, aynı Frankfurt endpoint ve kapalı test erişimi kullanılır. Mevcut Android profilleri ve EAS'taki değişkenler değiştirilmedi. Ortak pre-install kontrolü yeni iOS profillerinde de yalnız izin verilen public değişkenleri, production içerik kanalını, mevcut Frankfurt endpoint'ini ve publishable anahtarın varlığını doğrular; yapılandırmasız çevrimiçi özelliklerle sessiz bir store build üretmez. Bu kontrol Apple signing veya provider erişimi sağlamaz.

## Build öncesi doğrulama

EAS yerel config çözümlemesi için yalnız worker değişkenine bağlı kalınmaz; yeni profilde `IOS_BUILD_TARGET=store` ve kayıtlı Bundle ID bulunur. `eas config --platform ios --profile ios-testflight --json` salt okunur çıktısı kalıcı ID/Team/production APNs ile doğrulandı. Yeni IPA üretildiğinde arşiv açılıp `node scripts/verify-ios-store.mjs /absolute/Payload/App.app evidence.json` çalıştırılır. Bu script imza üretmez, yükleme veya dağıtım yapmaz. Mevcut imzasız simülatör uygulaması Keychain kabulü değildir; Auth için doğru entitlements içeren ayrıca onaylanmış development build gerekir.

Üyelik, App ID/Connect ve iki Apple capability kaydı tamamlandı; APNs key, Apple revoke key ve distribution provisioning oluşturulmadı. Yerel Team Development identity mevcut, Distribution identity bulunmadı. Eski prototip için capability/signing otomatik senkronizasyonu yapılmaması amacıyla yeni development profili açıkça kalıcı ID'yi kullanır; eski profiller korunur.

## Son talimat: yalnız yükleme

Sahibi TestFlight hazırlığı ve yüklemesini istedi. Tam fiziksel/Auth/review kabulü false kalır; dar Internal Only yükleme planı ve ayrı geçici kaynak bağlı izin [TESTFLIGHT-UPLOAD-ONLY.md](TESTFLIGHT-UPLOAD-ONLY.md) içindedir. Testçi dağıtımı veya App Store yayını bu izinle açılmaz.
