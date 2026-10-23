# Android preview APK — build 23 Ekim, teknik inceleme 24 Ekim 2026

**Gerçek EAS build başarılı. Fiziksel cihaz ses kabulü yapılmadı. Google Play yayını veya AAB üretilmedi.**

- [APK indir](https://expo.dev/artifacts/eas/fLeeT6UpzCnh_woquzv72Ipd_nHDY1Ll3Sms9KRHI2s.apk)
- [Kurulum / Install sayfası](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/6fcfc30a-f849-4ca2-9974-cdc34323eee6)
- Build ID: `6fcfc30a-f849-4ca2-9974-cdc34323eee6`; `FINISHED` / `Succeeded`.
- Kaynak: `bddc81b` (Expo 58.0.17 patch uyumu). Önceki `4880e9d7` build'i de başarılıdır fakat eski patch'li kaynaktır; kabul için ikinci APK kullanılır.
- Profil: mevcut `preview`, internal, APK, release, developmentClient=false. Metro gerekmez. Ücretsiz EAS kotasından iki Android build; plan yükseltme veya ödeme yapılmadı.
- Sürüm `0.1.0`, versionCode `1`. Paket hâlâ `com.anlaezberle.quiz.prototype`; mağaza kimliği olarak onaylanmış değildir.
- EAS artifact ekranı inceleme sırasında 13 gün erişilebilirlik gösterdi. Kalıcı indirme hizmeti veya mağaza linki değildir; dosya yerel olarak da saklandı.

## İndirilen binary'de doğrulananlar

| Kontrol                              | Sonuç                                                                                                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APK boyutu                           | 104.167.181 bayt                                                                                                                                                                                                                         |
| SHA-256                              | `0b0bb3e8be08b47f0c6800fa29281c4a45e9a354e3a39632facf69e90616da21`                                                                                                                                                                       |
| aapt2 gerçek manifest                | target SDK **36**, compile SDK **37**, min SDK **24**                                                                                                                                                                                    |
| APK imzası                           | apksigner verify başarılı, APK Signature Scheme v2, tek imzalayan. Bu Play App Signing kurulumu/onayı değildir.                                                                                                                          |
| Native ses                           | ExpoAudio modülü DEX içinde; 10 efekt + müzik olmak üzere 11 WAV, kaynak SHA-256'larıyla birebir eşleşiyor.                                                                                                                              |
| Hermes                               | Gerçek Hermes bytecode magic ve yerel hermesc çözümleme doğrulandı.                                                                                                                                                                      |
| Gizli anahtar taraması               | 21.457 çözülen stringde gerçek `sb_secret_*` anahtarı ve service-role JWT eşleşmesi yok. Mevcut Frankfurt endpoint/publishable istemci yapılandırması mevcut. Bu tam sunucu güvenlik testi değildir.                                     |
| Ham bytecode eşleşmesi               | Ham taramadaki tek eşleşme false positive: Hermes'in yan yana string deposundaki SDK'nın 10 karakterlik `sb_secret_` öneki komşu stringe birleşiyordu. Gerçek string sınırları çözülerek doğrulandı; gizlenmedi veya regex gevşetilmedi. |
| Mikrofon / audio foreground izinleri | RECORD_AUDIO ve ses foreground servis izinleri yok. Manifestte devralınan overlay/eski depolama/biometrik izinleri üretim öncesi daraltılmalı; [hazırlık denetimi](ANDROID-PLAY-READINESS.md).                                           |

## Otomatik doğrulama

Patch uyumundan sonra `expo install --check` temiz. EAS doktoru **20/20** başarılı. `pnpm check`: soru bütünlüğü, TypeScript, lint ve **296 test / 0 hata / 0 skip**. Web export başarılı. Önceki 295 test korundu; yalnız yeni build engeli için bir hedefli test eklendi. İlk üretim profili değişikliğiyle beklenen üç eski internal-only testinin başarısızlığı giderildi; testler kapatılmadı.

Görsel assetler, 1.500 soru ve geçmiş bankalar, oyun/skor/XP/rozet mantığı ve canlı Supabase verileri değişmedi. Yeni EAS projesi ve test APK imzası hazırlandı; yalnız preview ortamına mevcut URL/publishable client ayarlandı. Yönetici anahtarı yüklenmedi. Vercel, eski repo ve Google Play kayıtları değiştirilmedi.

## Henüz doğrulanmayanlar / sonraki adım

Kullanıcıda fiziksel Android telefon yok; ADB listesi boş. Efektlerin duyulması, Android medya sesi, gecikme, Bluetooth/arama kesintisi, arka plan/yeniden açma ve tercih kalıcılığı **Android cihazda test edilmedi**. Web/native export veya WAV bütünlüğü bunları kanıtlamaz.

Bir Android telefona APK'yı kurup [10 efekt ve müzik kabul formunu](ANDROID-AUDIO-DEVICE-ACCEPTANCE.md) tamamlayın. Mevcut uygulamayı veya kullanıcı kayıtlarını silmeyin; imza uyuşmazlığında durun. Ardından kalıcı package ID kullanıcı tarafından seçilip onaylanmalı; kimlik/izin değişirse o binary tekrar kabul edilmeli. Onaysız `android-store-approval.json` nedeniyle production AAB hook'u kapalı kalır. Play kapalı test/üretim erişimi, politika/hesap silme, Data safety, mağaza materyalleri ve görsel hakları açıkları ayrıca kapatılmalıdır.
