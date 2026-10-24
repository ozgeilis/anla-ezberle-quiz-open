# Android / Google Play hazırlığı — 23 Ekim 2026

Öncelik preview APK ve fiziksel ses kabulüdür. Bu belge mağaza gönderimi, üretim erişimi veya içerik/haklar onayı değildir. Vercel, eski PRIVATE GitHub deposu ve canlı Supabase verileri bu çalışmada değiştirilmez.

## Build ve kimlik

- Expo 58.0.17, React Native 0.88.0, expo-audio ~58.0.10 kullanılır. Kurulu RN version catalog ve Expo root Gradle plugin varsayılanı target SDK 36 / compile SDK 37'dir. Google Play'in 31 Ağustos 2026'dan itibaren yeni telefon uygulamaları için API 36+ şartını karşılayan kaynak yapılandırmasıdır; **gerçek APK manifesti ayrıca incelenmelidir**.
- Mevcut `preview`: internal, APK, developmentClient=false; Metro'suz açılan bağımsız uygulama. Üretim içerik kanalı ve yalnız mevcut Frankfurt URL/publishable istemci anahtarı kullanılır.
- `production`: store, app-bundle, autoIncrement=true. **Şimdilik engelli:** `eas-build-pre-install` fiziksel APK kabulünün SHA-256'sı ve kalıcı paket kimliği için kullanıcı onayı olmadan store AAB'yi reddeder. `config/android-store-approval.json` varsayılan onaysızdır. Submit profili veya otomatik gönderim eklenmez.
- Kullanıcı 24 Ekim 2026’da kalıcı Android kimliği olarak **`com.kovynelstudio.anlaezberle`** seçti. Android yapılandırması bu seçime geçirildi; önceki `.prototype` uygulaması ve kayıtları silinmez. Kimlik tercihi onaylıdır; fiziksel APK ve store yayını onayı değildir. Yeni kimlik Android'de ayrı uygulama/veri alanı oluşturur; yerel geçmişin kendiliğinden taşındığı iddia edilemez. Kimlik değişimi ayrıca mevcut auth scheme, veri koruma ve yeni APK kabulüyle ele alınır.
- EAS proje bilgisi app.json'a eklenmiştir. `.easignore` gizli dosyaları, test/CI raporlarını, sunucu kaynaklarını ve native/build çıktısını build arşivinden dışlar. Bu, bu dosyaları Git'ten silmez. İmzalama anahtarları Git'e veya uygulama paketine konmaz.

İlk APK 58.0.14 kaynağından başarıyla derlendi; EAS doktoru 19/20 kontrol ve dokuz patch uyumsuzluğu bildirdi. Bunun üzerine yalnız önerilen dokuz Expo 58 patch'i uyumlandı (Expo ~58.0.17, Router ~58.0.25 dahil). İlk indirme zaman aşımından sonra düşük eşzamanlılıkla kurulum tamamlandı. `expo install --check` artık temiz; soru bütünlüğü, TypeScript, lint ve 296 test tekrar başarılı. Güncel APK bu ikinci kaynaktan yeniden derlenir; ilk binary güncel patch'li APK olarak sunulmaz. Android Hermes export ve başarılı build gerçek cihaz kabulünün yerine geçmez.

## Yayın engelleri

| Konu                        | Durum / gereken                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fiziksel Android ses testi  | **Bekliyor.** Kullanıcıda şu an Android telefon yok; [cihaz kabul formu](ANDROID-AUDIO-DEVICE-ACCEPTANCE.md) doldurulmalı.                                                                                                                                                                                                                                                               |
| Kalıcı paket / Play signing | **Kimlik onaylı; cihaz ve store signing bekliyor.** `com.kovynelstudio.anlaezberle` seçildi. Fiziksel kabul olmadan AAB ve mağaza gönderimi yapılmaz. Upload key, Play App Signing ve güvenli yedek kararı ayrıca verilmeli. Preview keystore'un varlığı mağaza imzası onayı değildir.                                                                                                   |
| Play Console                | Salt-okunur görünümde Kovynel Studio **kişisel hesap**, henüz ilk uygulama oluşturulmamış. Üretim erişimi veya kapalı test süreci tamamlanmış olarak doğrulanamadı. Uygulama kaydı oluşturulmadı.                                                                                                                                                                                        |
| Kapalı test                 | 13 Kasım 2023 sonrası açılan kişisel hesaplarda en az 12 test kullanıcısı kesintisiz 14 gün opt-in olmalı; ardından üretim erişimine başvuru gerekir. Bu hesaba ait açılış tarihi/test kanıtı yok. APK'yı elle kurmak Play kapalı test süresini başlatmaz.                                                                                                                               |
| Gizlilik politikası         | **Eksik.** Kodda ayarların gizlilik tercihleri var; uygulama içinden erişilen kapsamlı politika ve çalışan kamuya açık politika URL'si bulunamadı. İsim, e-posta, kullanıcı kimliği, profil, arkadaşlık/davet/maç verileri, yerel kayıtlar, Supabase/auth sağlayıcıları, saklama/silme ve destek iletişimi doğru açıklanmalı. Kişisel iletişim bilgisi uydurulmaz.                       |
| Data safety                 | **Hazırlanmalı.** Online kimlik/e-posta ve oyun/sosyal verileri nedeniyle “hiç veri toplanmıyor” denemez. Opsiyonel hesap, sunucudaki işlemler, TLS, veri amaçları, paylaşım/hizmet sağlayıcı sınıflaması ve saklama süreleri gerçek davranışla doldurulmalı. SDK izinleri ve 3. taraflar gerçek AAB'de de denetlenmeli. Ses kaydı/toplama özelliği yoktur; mikrofon izni kapalıdır.     |
| Hesap silme                 | **Eksik.** Kaynakta uygulama hesabını ve ilişkili verileri güvenli silme/istek akışı ve uygulama dışından başlatılabilecek web yolu bulunamadı. Çıkış yapmak veya yalnız cihazı temizlemek hesap silme değildir. Canlı veride silme denemesi yapılmadı.                                                                                                                                  |
| Uygulama erişimi            | **Bekliyor.** Misafir solo açıklaması ve online bölümler için Google inceleyicisinin kullanabileceği onaylı test erişimi/OTP talimatı hazırlanmalı. Üretim şifresi veya test hesabı Git'e yazılmaz.                                                                                                                                                                                      |
| Derecelendirme / hedef yaş  | **Bekliyor.** IARC anketi gerçek soru içeriği, arkadaş arama/iletişim ve sosyal işlevlere göre doldurulmalı. Çocuk kategorisinin hazırlık durumunu değiştirmedik; yaş/kaynak uygunluğu tamamlanmadan çocuklara onaylı içerik diye sunulmaz.                                                                                                                                              |
| Mağaza listeleme            | Başlık taslağı: **Anla & Ezberle: İslami Quiz** (30 karakter sınırı içinde). Kısa açıklama: **Kur’an, siyer ve daha fazlasında bilgini sına; öğren, yarış, rozet kazan!** (80 içinde). Tam açıklama, gerçek Android ekran görüntüleri, 512×512 ikon, 1024×500 feature graphic, kategori, destek iletişimi ve ülke/dağıtım tercihleri hazırlanmalı. Mevcut görseller yeniden tasarlanmaz. |
| Görsel hakları / içerik     | Mevcut assetler ve 1.500 soru değişmedi. Referans görsellerin yeniden dağıtım haklarına dair önceki belirsizlik devam eder. Kodda onay durumu bağımsız dinî kaynak/yaş uygunluğu denetimi yerine geçmez.                                                                                                                                                                                 |

## Gerçek APK sonucu ve manifest izinleri

23 Ekim'de tamamlanan ikinci build ve 24 Ekim teknik incelemesi: [APK raporu](ANDROID-PREVIEW-BUILD-20261023.md). target API 36 / compile API 37, imza ve 11 WAV doğrulandı. Fiziksel kabul hâlâ yapılmadı.

İlk gerçek manifest incelemesi, SDK'lardan devralınan `SYSTEM_ALERT_WINDOW`, API 32 ile sınırlı `READ_EXTERNAL_STORAGE` / `WRITE_EXTERNAL_STORAGE` ve biyometrik izinleri de gösterdi. Uygulamada overlay, dosya seçme veya biyometrik giriş akışı bulunmadı. Bu izinleri mağazada gerekliymiş gibi beyan etmek yerine üretim öncesi kullanım/bağımlılık incelemesiyle daraltmak ve değişen manifestle yeni APK kabulü yapmak gerekir. Bunlar bu ilk test APK'sında duruyor; mikrofon ve ses foreground servis izinleri yok. Özel overlay/biometrik yetki kullanımı veya cihaz verisi erişimi test edilmedi.

## Sonraki sıra

1. Preview APK build sonucu, kurulum URL'si, imza ve gerçek manifest SDK seviyesini build raporunda kaydet.
2. Fiziksel Android telefonda formu gerçek ses dinlemesiyle tamamla. Kayıtları silerek veya sahte ödül ekleyerek test yapma.
3. Onaylanan `com.kovynelstudio.anlaezberle` kimliğiyle üretilen APK fiziksel cihazda kabul edilsin. Güvenli upload key / Play App Signing planı netleşsin.
4. Gizlilik, hesap silme, Data safety, erişim, derecelendirme ve görsel hakları açıklarını kapat; canlı veri/ayar değişikliği için ayrı somut çalışma gerekir.
5. Kabul edilen APK SHA-256 ve kimlik onayını kayda geçir; yalnız bundan sonra `eas build -p android --profile production` ile imzalı AAB üret. Bu komut Play'e göndermez. Otomatik submit kullanılmaz; ücretsiz kota bitmişse durulur.
6. Kullanıcı yetkilendirdiğinde Play kapalı test uygulama kaydı ve dağıtımı ayrı yürütülür; 12/14 koşulu ile üretim erişimi Console'dan doğrulanır.

## Resmî kaynaklar

- [Google Play target API gereksinimi](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Kişisel hesap kapalı test / üretim erişimi](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Hesap silme gereksinimi](https://support.google.com/googleplay/android-developer/answer/13327111)
- [Data safety](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Kullanıcı verisi / gizlilik politikası](https://support.google.com/googleplay/android-developer/answer/10144311)
- [İncelemeye hazırlık / uygulama erişimi](https://support.google.com/googleplay/android-developer/answer/9859455)
- [Mağaza listeleme](https://support.google.com/googleplay/android-developer/answer/9859152)
- [Expo APK profili](https://docs.expo.dev/build-reference/apk/), [EAS build yapılandırması](https://docs.expo.dev/eas/json/)
