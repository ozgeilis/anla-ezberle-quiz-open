# Build 4 final paket yapılandırması — doğrulanmış kusur

## Kanıt ve kök neden

Mevcut export IPA'nın imzası ve Apple binary validation sonucu geçerlidir.
Ancak final Hermes paketinde Frankfurt Supabase URL'si ve publishable client
key yoktur. Aynı JS SHA taşıyan kalıcı Bundle ID'li iPad uygulamasında gerçek
online ekranı “Çevrimiçi servis hazır değil / Bu cihazda geliştirme bağlantısı
yapılandırılmadı” gösterdi. Bu yalnız Apple bayrağı veya OAuth test izni sorunu
değildir; istemci bağlantısı daha erken aşamada yoktur.

Build 4 politika için yeniden export edilirken EXPO_PUBLIC_SUPABASE_URL ve
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY final bundle'a gömülmemiştir. EAS
pre-install zaten bu değerleri zorunlu tutar; fakat manuel export/repack yolu
EAS hook'unu çalıştırmamıştır. Önceki source/JS hash ve codesign kontrolleri,
bu yanlış yapılandırılmış bundle'ın kendisiyle eşitliğini doğrulamıştır.
Bu nedenle kaynak eşitliği ve geçerli imza tek başına yeterli değildir.

Build 4 SHA: `7c66a17df53a67980b6af1eeda6a9015b7a87296450a60663bafd1dd15ce4461`.
Mevcut Build 4 korunur; eski build numarasına başka binary yüklenmez.
HTTP 422 ile bu kusur arasında nedensellik kanıtlanmadı: 422, Apple'ın beta
gönderim API'sinin cevabıdır ve ayrı takip edilir.

## Gerçek düzeltme

- Etkin **publishable** client key, Supabase'in resmi salt okunur aracıyla
  alındı. Service-role/private key kullanılmadı. Client env dosyası Git dışında.
- Aynı güncel kaynakla production content channel, Frankfurt endpoint,
  publishable key, ads off ve iOS Apple native config marker'ı kullanılarak
  `expo export:embed --platform ios --dev false --bytecode` yeniden çalıştı.
- Bütün native varlıklar birlikte export edildi. Yeni bundle SHA:
  `8114254e4c826e21f867d8999d4655153d47fda32af464b6b74069035dc24e3c`.
- `verify-native-client-config.mjs` final bytecode içinde beklenen URL ve tam
  etkin public key'i zorunlu kılar. Değerleri raporlamaz; hash ve booleans verir.
  Store IPA doğrulama CLI'si de artık bu kontrolü atlayamaz. Mevcut izin,
  imza, Team, provisioning ve onay kapıları kaldırılmaz.
- Yeni ayrı **simülatör** kopyası Anla QA5, mevcut native kodla kuruldu.
  Build 4 asılları/arşivleri silinmedi. Eski misafir oyunları (2 tur / 10 XP)
  yeni simülatör kopyasında korundu.
- Yeni aday gerçek giriş formunu açtı; önceki NOT_CONFIGURED ekranı yok.
  Sahibi mevcut işletim hesabıyla giriş yaptı. Native ekran artık doğrulanmış
  oturum gerektiren Profilimi Tamamla / oda alanını gösteriyor. Sunucuda tek
  doğrulanmış işletim hesabı ve yeni giriş zamanı salt okunur teyit edildi.
  Tam kapat/aç sonrası kalıcılık kabulü ayrıca bekliyor.
- Mevcut sentetik reviewer parolasıyla yeni yapılandırılmış web önizlemesinde
  gerçek Supabase Auth girişi geçti. 8138 portunda sosyal Edge CORS reddi
  beklenen yerel köken kısıtıdır; canlı allowlist genişletilmedi. Sosyal erişim
  ayrıca mevcut izinli 8121 kökeninde kontrol edilir. Bu web denemesi native
  veya fiziksel cihaz kabulü değildir.

## Paket ve yayın sınırı

Henüz yeni IPA, App Store Connect yükleme, TestFlight dağıtımı veya Production
gönderimi yapılmadı. QA5 simülatör build numarası Apple'a yüklenmiş sürüm demek
değildir. Yeni IPA hazırlanırken kullanılmamış güncel build numarası Connect'ten
yeniden kontrol edilmeli; Build 4 yerine aynı numarayla upload yapılmamalı.

Apple canlı login/deletion/revocation bayrakları hâlâ false; kayıt hook'u/RLS
korunur. Exact yeni aday fiziksel kabulü, reviewer sosyal erişimi, Apple
giriş/silme kabulü ve metadata tamamlanmadan tam mağaza kapısı açılmaz.
Sahibinin mevcut görevindeki paket hazırlama/yükleme izni, eksik gerçek kabul
kanıtlarını olmuş gibi yazma veya canlı Auth değişikliği izni değildir.

## Tekrarlanabilir kontrol

Gerekli public client env yüklendikten sonra:

```sh
node scripts/verify-native-client-config.mjs /absolute/Payload/AnlaEzberle.app/main.jsbundle
```

Eski Build 4 burada bilinçli olarak reddedilir. Yeni QA bundle geçer; bu
statik kontrol gerçek oturum/ağ/silme kabulünün yerini almaz. Testler boş bundle,
eksik URL/key, farklı key, service key, yanlış proje ve güvenli kanıt çıktısını
regresyon olarak kapsar. App Review gate de bu kanıt olmadan fail closed kalır.
