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

Bu hazırlıkta `pnpm check`: **410/410**, TypeScript, lint, 1.500 soru bütünlüğü geçti. Yeni üç test upload-only izninin public/upload destination, başka Team/Bundle, değişmiş kaynak ve reklam açılmasını reddettiğini kontrol eder; gerçek Apple servis testi değildir.

Önceki fiziksel iPhone11 sınırlı kabulü ve imzalı development artifact kanıtı korunur. Gerçek Apple login/deletion/revocation, kayıt hook'u, Safari callback/session kalıcılığı, moderasyon, APNs/ses ve tam cihaz matrisi **açıktır**. Apple provider/capability RPC kapalı kalır; yeni hosted test hesabı oluşturulmaz. Bu eksikler iç yükleme sırasında “tamamlandı” veya genel yayın kabulü sayılmaz.

## Sonuç

Henüz archive/IPA veya upload sonucu yok. Distribution kimliği oluşturma adımı ve aşağıdaki gerçek işlem kanıtları bekleniyor. Yeni sözleşme/ücret/kimlik doğrulama isteği çıkarsa kullanıcıya devredilir. İş bitince upload izni false'a döndürülür; main/Alpha/backend korunur.
