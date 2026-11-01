# TestFlight yalnız iç test için yükleme

Sahibinin son talimatı: “testflighte yükleme hazırlığı devam etsin ve yükleme tamamlansın”. Bu izin yeni iOS paketinin hazırlanmasını ve Connect'e yüklenmesini kapsar; testçi/grup ekleme, testçilere dağıtım, dış Beta Review, App Store incelemesi, main merge veya canlı Supabase değişikliği değildir.

## Tam kabul ile yükleme izninin ayrılması

Önceki tek store kapısı fiziksel/Auth/review kabulünü aynı anda gerektiriyordu. Eksikler yapılmış gibi işaretlenmez: `approved`, `physicalAcceptance`, `appleAuthAndDeletionAccepted`, `reviewReadinessAccepted` **false** kalır. Ayrı dar `testflightUpload` kaydı yalnız bu işlem süresince açılır, işlemden sonra kapatılır. Kaynak commit'i, doğrulanmış Team/Bundle/Connect kaydı, önceki development kabul JS hash'i, reklam off ve sabit Internal Only export seçenekleri birlikte doğrulanır.

`IOS_TESTFLIGHT_UPLOAD_ONLY=1` açık değilse önceki tam store gate aynen geçerlidir. Yeni yol generic iOS/Android store profillerini açmaz. Export ayarı `testFlightInternalTestingOnly=true`: [Apple bu build'in dış TestFlight veya App Store'da dağıtılmasını engeller](https://developer.apple.com/tutorials/develop-in-swift/test-your-beta-app). Ön kontrol yalnız yerel export'a izin verir; kendisi upload yapmaz. Gerçek upload Xcode CLI ile aynı **TestFlight Internal Only** export politikası altında yapılır. Internal tester dağıtımı otomatik açılmaz.

## Paket ve imza planı

- PR #25 güncel kaynak; `com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP`, Connect `6829516832`.
- Yerel Xcode archive; mevcut Development identity ile development archive, ardından App Store distribution imzasına export. Final artifact'ta production APNs/profile, get-task-allow=false, Apple capability, doğru Team ve App ID şart. Development `.app` veya unsigned archive yüklenmez.
- Sürüm0.1.0, iOS build2; yüklemeden hemen önce Connect'te No Builds görüldü, çakışma bulunmadı. Android versionCode/paket/profilleri değişmez. Expo default prototype ID kaynak dosyasında korunur; yalnız gitignore'lu native çıktı kalıcı ID'yi kullanır.
- Gerekli Distribution sertifikasını sahibi Xcode'da oluşturdu; doğru Team ve private-key eşleşmesi doğrulandı. Özel anahtar Keychain'de kalır; API key veya app-specific password istenmez/üretilmez.
- Yalnız bu App ID için App Store provisioning hazırlanır; mevcut capability, üyelik, uygulama veya tester yetkileri genişletilmez.
- Export edilen IPA'nın SHA, signature/profile/entitlements ve native SDK/privacy manifest bütünlüğü yerelde kontrol edilir. Upload sonrası Connect processing sonucunda exact version/build görünmeden “yükleme tamamlandı” denmez.

## Doğrulanmış ve açık kontroller

Bu hazırlıkta `pnpm check`: **411/411**, TypeScript, lint, 1.500 soru bütünlüğü geçti. Yeni üç test upload-only izninin public/upload destination, başka Team/Bundle, değişmiş kaynak ve reklam açılmasını reddettiğini kontrol eder; gerçek Apple servis testi değildir.

Önceki fiziksel iPhone11 sınırlı kabulü ve imzalı development artifact kanıtı korunur. Gerçek Apple login/deletion/revocation, kayıt hook'u, Safari callback/session kalıcılığı, moderasyon, APNs/ses ve tam cihaz matrisi **açıktır**. Apple provider/capability RPC kapalı kalır; yeni hosted test hesabı oluşturulmaz. Bu eksikler iç yükleme sırasında “tamamlandı” veya genel yayın kabulü sayılmaz.

## Sonuç

Sahibi Xcode’da Apple Distribution kimliğini oluşturdu; doğru Team ve private-key eşleşmesi yerelde doğrulandı. Yalnız yeni App ID için App Store provisioning oluşturuldu ve production APNs/Apple capability, get-task-allow=false, cihaz listesi bulunmaması ve exact Distribution sertifikası doğrulandı. Private key/profile Git’e eklenmedi. Connect hâlâ No Builds; iOS0.1.0/build2 ayrıldı.

İlk iki archive denemesi özel SYMROOT ile Xcode’un BuildProductsPath toplama aşamasında hata verdi. Standart arşiv ürün yoluna geçildi; yalnız kendi yeniden üretilebilir cihaz Products/eksik archive çıktıları temizlendi. Üçüncü denemede standart Xcode arşiv ürün yolu ile **ARCHIVE SUCCEEDED**; ardından manuel Distribution imzasıyla **EXPORT SUCCEEDED**. macOS codesign Keychain onayını sahibi kendisi tamamladı.

Gerçek provisioning dosyasını doğrularken plutil’in NSDate/NSData içeren bütün belgeyi JSON’a çeviremediği görüldü. Verifier artık yalnız ihtiyaç duyduğu alanları plistlib ile seçer, UTC tarihini normalleştirir; NSData sertifika payload’ını dışarı vermez. Tarih/data tipi ve yanlış plist regresyon testi eklendi, ilgili 7 test ve sonrasında tam 411/411 kontrolü geçti.

Başarılı archive ve Store IPA doğrulandı. Xcode 2 Kasım 00:43:04 (Europe/Istanbul) tarihinde **Upload succeeded / Uploaded package is processing / EXPORT SUCCEEDED** bildirdi (exit0). Connect gerçek arayüzünde **Version0.1.0, Build(2), Processing, Nov2 12:43AM** kaydı görüldü. Ardından Apple processing tamamlandı; **Build2 Internal / Ready to Test / Expires in90 days** görüldü. [Gerçek IPA kanıtı](testflight-artifact.json): production APNs, get-task-allow=false, beta-reports-active, tek doğru Distribution sertifikası, Team/Bundle, iki cihaz ailesi, 17 okunabilen Privacy Manifest ve mevcut public Frankfurt endpoint kontrolü geçti. Bu statik kontroller gerçek Apple giriş/servis veya kapsamlı privacy kabulü değildir. Yeni sözleşme/ücret/kimlik doğrulama isteği çıkarsa kullanıcıya devredilir. İş bitince upload izni false'a döndürülür; main/Alpha/backend korunur.

## Kaynak izlenebilirliği

Arşiv işlemi `16adf3c3f34ecf8e2127fca7b7b836d3334d0d32` kaynak commit'inde başladı. Gerçek IPA doğrulaması `9175a05aa340d96baab02c979aaebdf91302b0a0` verifier düzeltmesinde yapıldı. İki commit arasında `src`, app/Expo/EAS config, bağımlılıklar ve Supabase runtime kaynakları için diff boş; uygulama kodu aynıdır. Sonraki kayıt commit'i build'in başlangıç commit'i gibi sunulmaz.

Export edilmiş yerel IPA SHA256: `403fe57734cb681a39c72e40090fe7b39af7edb9ad6cd328583c3d2e64136d68`. Xcode upload aynı arşivi yeniden paketleyebilir; Apple'a taşınan ZIP'in aynı SHA'ya sahip olduğu ayrıca kanıtlanmadıkça iddia edilmez.

## Gerçek upload sonucu ve sınırlamalar

Xcode aynı gerçek `.xcarchive` üzerinden `destination=upload`, manuel pinlenmiş Distribution cert/profile ve `testFlightInternalTestingOnly=true` ile Apple'a yükledi. API key/app-specific password üretilmedi veya istenmedi. Bu işlem testçi dağıtımı değildir; hiç grup/testçi eklenmedi, dış Beta Review veya App Review gönderilmedi. İşlem izni hemen false'a kapatıldı; tam store kabulünün bütün eksik bayrakları false kaldı.

Yükleme engellenmedi ancak üç **Upload Symbols Failed** uyarısı var: `React.framework`, `ReactNativeDependencies.framework`, `hermesvm.framework`. Arşivde ana uygulama ve Expo dSYM'leri var; Pods'ta bu üç vendora ait dSYM bulunmadı. Uydurma/eşleşmeyen dSYM yüklenmedi. Bu eksik semboller native çökme raporlarının okunabilirliğini azaltabilir; sonraki tanı/SDK artifact çalışması için açık tutulur.

Connect'te iç grup listesi hâlâ boş ve Create Group çağrısı var; tester/grup eklenmedi. EAS yalnız iOS `ios-testflight` uzaktaki buildNumber sayacı `2` olarak başlatıldı ve tekrar salt okunur get ile doğrulandı. Sonraki autoIncrement yeni sayı kullanacak; Android sayacı değiştirilmedi.

## Tamamlanan Apple işlemesi

[Gerçek Build2 kaydı](https://appstoreconnect.apple.com/teams/38b04e22-235f-4480-ab4b-32527bfe50f8/apps/6829516832/testflight/ios/26b94987-a87b-4b99-b8ee-919d7eee28a8) **0.1.0 (2) / Internal / Ready to Test**. Detay ekranında **Groups(0)** doğrulandı. Bu, Apple'ın paketi işlediği ve iç teste hazırlanabileceği anlamındadır; kullanıcıya dağıtıldığı veya App Store güvenlik kabulünün tamamlandığı anlamına gelmez. Türkçe What to Test alanına gerçek kapsam ve Apple girişinin kapalı olduğu bilgisi kaydedildi. Testçi eklenmedi ve davet gönderilmedi.
