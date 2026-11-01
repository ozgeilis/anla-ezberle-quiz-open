# TestFlight yalnız iç test için yükleme

Sahibinin son talimatı: “testflighte yükleme hazırlığı devam etsin ve yükleme tamamlansın”. Bu izin yeni iOS paketinin hazırlanmasını ve Connect'e yüklenmesini kapsar; testçi/grup ekleme, testçilere dağıtım, dış Beta Review, App Store incelemesi, main merge veya canlı Supabase değişikliği değildir.

## Tam kabul ile yükleme izninin ayrılması

Önceki tek store kapısı fiziksel/Auth/review kabulünü aynı anda gerektiriyordu. Eksikler yapılmış gibi işaretlenmez: `approved`, `physicalAcceptance`, `appleAuthAndDeletionAccepted`, `reviewReadinessAccepted` **false** kalır. Ayrı dar `testflightUpload` kaydı yalnız bu işlem süresince açılır, işlemden sonra kapatılır. Kaynak commit'i, doğrulanmış Team/Bundle/Connect kaydı, önceki development kabul JS hash'i, reklam off ve sabit Internal Only export seçenekleri birlikte doğrulanır.

`IOS_TESTFLIGHT_UPLOAD_ONLY=1` açık değilse önceki tam store gate aynen geçerlidir. Yeni yol generic iOS/Android store profillerini açmaz. Export ayarı `testFlightInternalTestingOnly=true`: [Apple bu build'in dış TestFlight veya App Store'da dağıtılmasını engeller](https://developer.apple.com/tutorials/develop-in-swift/test-your-beta-app). Ön kontrol yalnız yerel export'a izin verir; kendisi upload yapmaz. Gerçek upload Xcode'da aynı **TestFlight Internal Only** seçimiyle doğrulanır. Internal tester dağıtımı otomatik açılmaz.

## Paket ve imza planı

- PR #25 güncel kaynak; `com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP`, Connect `6829516832`.
- Yerel Xcode archive; mevcut Development identity ile development archive, ardından App Store distribution imzasına export. Final artifact'ta production APNs/profile, get-task-allow=false, Apple capability, doğru Team ve App ID şart. Development `.app` veya unsigned archive yüklenmez.
- Sürüm0.1.0, iOS build2 önerisi; yüklemeden önce Connect'te çakışmadığı kontrol edilir. Android versionCode/paket/profilleri değişmez. Expo default prototype ID kaynak dosyasında korunur; yalnız gitignore'lu native çıktı kalıcı ID'yi kullanır.
- Gerekli Distribution sertifikası mevcut değil; yeni kimliğin son oluşturma adımı sahibi tarafından Xcode'da tamamlanır. Özel anahtar Keychain'de kalır; API key veya app-specific password istenmez/üretilmez.
- Yalnız bu App ID için App Store provisioning hazırlanır; mevcut capability, üyelik, uygulama veya tester yetkileri genişletilmez.
- Export edilen IPA'nın SHA, signature/profile/entitlements ve native SDK/privacy manifest bütünlüğü yerelde kontrol edilir. Upload sonrası Connect processing sonucunda exact version/build görünmeden “yükleme tamamlandı” denmez.

## Doğrulanmış ve açık kontroller

Bu hazırlıkta `pnpm check`: **411/411**, TypeScript, lint, 1.500 soru bütünlüğü geçti. Yeni üç test upload-only izninin public/upload destination, başka Team/Bundle, değişmiş kaynak ve reklam açılmasını reddettiğini kontrol eder; gerçek Apple servis testi değildir.

Önceki fiziksel iPhone11 sınırlı kabulü ve imzalı development artifact kanıtı korunur. Gerçek Apple login/deletion/revocation, kayıt hook'u, Safari callback/session kalıcılığı, moderasyon, APNs/ses ve tam cihaz matrisi **açıktır**. Apple provider/capability RPC kapalı kalır; yeni hosted test hesabı oluşturulmaz. Bu eksikler iç yükleme sırasında “tamamlandı” veya genel yayın kabulü sayılmaz.

## Sonuç

Sahibi Xcode’da Apple Distribution kimliğini oluşturdu; doğru Team ve private-key eşleşmesi yerelde doğrulandı. Yalnız yeni App ID için App Store provisioning oluşturuldu ve production APNs/Apple capability, get-task-allow=false, cihaz listesi bulunmaması ve exact Distribution sertifikası doğrulandı. Private key/profile Git’e eklenmedi. Connect hâlâ No Builds; iOS0.1.0/build2 ayrıldı.

İlk iki archive denemesi özel SYMROOT ile Xcode’un BuildProductsPath toplama aşamasında hata verdi. Standart arşiv ürün yoluna geçildi; yalnız kendi yeniden üretilebilir cihaz Products/eksik archive çıktıları temizlendi. Gerçek archive işlemi sürüyor, başarı varsayılmıyor.

Gerçek provisioning dosyasını doğrularken plutil’in NSDate/NSData içeren bütün belgeyi JSON’a çeviremediği görüldü. Verifier artık yalnız ihtiyaç duyduğu alanları plistlib ile seçer, UTC tarihini normalleştirir; NSData sertifika payload’ını dışarı vermez. Tarih/data tipi ve yanlış plist regresyon testi eklendi, ilgili 7 test ve sonrasında tam 411/411 kontrolü geçti.

Henüz başarılı archive/IPA veya upload sonucu yok; gerçek işlem kanıtları bekleniyor. Yeni sözleşme/ücret/kimlik doğrulama isteği çıkarsa kullanıcıya devredilir. İş bitince upload izni false'a döndürülür; main/Alpha/backend korunur.
