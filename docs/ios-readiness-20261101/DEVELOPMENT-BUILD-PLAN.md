# Sonraki onay: yalnız yerel iPhone kabul build'i

Bu plan **henüz onaylanmadı / çalıştırılmadı**. TestFlight dağıtımı veya IPA yüklemesi değildir. Amaç imzasız simülatördeki -34018 Keychain sınırı yerine gerçek iOS entitlements ile Auth ve kalıcılık testine uygun uygulamayı hazırlamaktır.

## Dar kapsam

- PR #25'in CI'ı geçen son commit'i; Team `W7CRC43SHP`; yeni kayıtlı `com.kovynelstudio.anlaezberle`.
- Bu Team'e ait mevcut geçerli Apple Development identity kullanılır; yeni özel anahtar veya Distribution sertifikası oluşturulmaz. Gerekirse **yalnız bu App ID** için development provisioning yenilenir/oluşturulur. Farklı Team, sertifika veya beklenmeyen capability istenirse durulur.
- Önce `developmentBuildApproved=true` yalnız bu kabul kaydı için açılır, local pre-install guard çalıştırılır. İş bitince genel build izni açık bırakılmaz. `approved` (store) false kalır.
- Mevcut Xcode araç zinciri ve kurulu bağımlılıklar, yerel fiziksel cihaz Release build'i. Ücretli EAS kotası kullanılmaz. Yeni runtime indirilmez. Disk yetersizse kullanıcı dosyaları veya başka worktree'ler silinmez.
- Yeni ID **ayrı uygulamadır**. Eski prototipin üstüne kurulmaz veya silinmez; eski kayıtlar korunur. Yeni sandbox'ta eski yerel XP otomatik görünmez. Gerçek kullanıcı geçmişi taşınmaz/sıfırlanmaz.
- Üretim/backend/Alpha/Android/Ads/Analytics değişmez. Apple provider kapalı kalır. Yeni hosted kullanıcı oluşturulmaz veya silinmez.

## İşlem ve kabul

1. Son commit, mevcut public Frankfurt yapılandırması, onay kaydı, Xcode hesap/Team, bağlı iPhone ve boş alan kontrol edilir. Xcode login/yeni sözleşme/anahtar adımı çıkarsa kullanıcıya devredilir.
2. Yeni profile env ile `expo prebuild --platform ios --no-install` yalnız bu worktree'nin gitignore'lu native çıktısını üretir; prototip app.json/Android source korunur. Önceki unsigned simulator `.app` kanıtı saklanır.
3. `ios-development` kimlik konfigürasyonu ve ön kontrol: `EAS_BUILD_PLATFORM=ios`, `EAS_BUILD_PROFILE=ios-development`, `IOS_BUILD_TARGET=device`, `IOS_REGISTERED_BUNDLE_ID=com.kovynelstudio.anlaezberle`, `IOS_APPLE_AUTH=1`, production içerik ve ADS_MODE=off. Public URL/key yalnız `.env.local` / mevcut EAS preview yapılandırmasındadır; loglanmaz. Node'un `--env-file=.env.local` desteği kullanılabilir, dosya shell kodu olarak çalıştırılmaz.
4. Local `xcodebuild` Release/iphoneos, doğrulanmış Team, Apple Development identity ve gerektiğinde bu App ID'ye sınırlı automatic provisioning. `-allowProvisioningUpdates` yalnız bu onay kapsamıyla kullanılır. Beklenmeyen hesap/kimlikte durulur; private key dışarı aktarılmaz.
5. `.app` signature, application-identifier, Team, keychain group, Apple capability, **development** APNs, Bundle ID, version/build, cihaz family, mikrofon/ATT/arka plan sesinin eklenmediği kontrol edilir. Store verifier bu development build için kullanılmaz; production APNs/App Store profile beklediği için doğru biçimde reddeder.
6. Kullanıcı iPhone'u açıp izin verirse yeni uygulama yanına yüklenir. Keychain hatasının yokluğu ve guest yerel akışlar kontrol edilir. Kullanıcı mevcut hesabına kendisi giriş yapabilir; parola veya kod toplanmaz. Gerçek test hesabı oluşturma/silme ayrıca onay ister.
7. Prototip ile aynı custom scheme nedeniyle e-posta/Safari callback çakışması ayrıca değerlendirilir. Doğru kalıcı uygulamaya dönüş kanıtlanmadan bu akış başarılı sayılmaz; prototip silinmez. Universal Link/provider/redirect değişikliği ayrı sunucu/domain planıdır.
8. Gerçek Apple login/relay/deletion/revoke, provider ve backend güvenliği tamamlanmadan test edildi sayılmaz. Bu development build'in üretilmesi bu bayrakları açmaz.

İmzalı **TestFlight IPA** üretimi, App Store provisioning/Distribution credential, upload ve iç test dağıtımı daha sonraki ayrı onaylardır. Sosyal moderasyon ve Apple silme/revocation açık engelleri korunur.
