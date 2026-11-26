# Google native SDK ve canlı App Privacy karşılaştırması — 26 Kasım 2026

Sonuç: **GoogleSignIn 10.1.0'ın sekiz manifest türü, canlı yayımlanmış 17 tür
arasında mevcut ve amaç/kimlikle ilişki/tracking bileşimiyle kapsanıyor.**
Bu SDK için gereken App Store Connect alan değişikliği: **yok**.
Edit/Save/Publish yapılmadı; SDK gizlilik manifesti silinmedi/değiştirilmedi.

Canlı App Privacy sayfasında Published 14 days ago, 17 data types görüldü.
Eski 14 tür tablosu güncel form durumu değildir. Phone Number, Other Data
Types ve Other Usage Data daha önce eklenmiş; User ID'de Analytics mevcut.
Canlı seçili 0.1.1 Build 13 App Review notu da SDK beyanının güncellendiğini
belirtiyor; not tek başına başarı kanıtı sayılmadı, gerçek form ayrıca okundu.

Kanıt: `app-privacy-live-comparison.json` (17 türün tamamı); gerçek derlenmiş
SDK manifesti `google-sdk-privacy.json`, kaynak SHA256
9300972853096f7d570d6c4a4bf7152a36c798e89c4f0d81d3b4c6b5dfaddfd0.

F = App Functionality; A = Analytics; R = Third-Party Advertising;
M = Developer's Advertising or Marketing.

| App Store Connect alanı | SDK amaçları | Canlı uygulama toplam amacı | Linked | Tracking | Gereken işlem |
|---|---|---|---|---|---|
| Contact Info → Name | F | F | Yes | No | Koru |
| Contact Info → Email Address | F | F | Yes | No | Koru |
| Contact Info → Phone Number | F | F | Yes | No | Koru; uygulama telefon istemiyor diye SDK beyanını çıkarma |
| Other Data → Other Data Types | F + A | F + A | Yes | No | Koru |
| Location → Coarse Location | F | F + A + R + M | Yes | No | Koru; AdMob/UMP amaçları da kapsanıyor |
| Identifiers → User ID | F + A | F + A | Yes | No | Koru; Analytics zaten eklenmiş |
| Identifiers → Device ID | A | F + A + R + M | Yes | **Yes** | Koru; SDK'nın No'su AdMob toplam Yes'ini kaldırmaz |
| Usage Data → Other Usage Data | A | A | Yes | No | Koru; Product Interaction ile karıştırma |

Diğer dokuz veri türünün mevcut beyanları değiştirilmez. Altı AdMob türündeki
Developer's Advertising or Marketing amaçları ve Device ID Tracking=Yes
korunur. ATT reddi bunları otomatik No yapma gerekçesi değildir. Google
Sign-In SDK'sı için ayrıca reklam amacı veya Tracking=Yes eklemek gerekmez;
uygulamanın toplam Device ID satırı mevcut AdMob davranışını da içerir.

## SDK beyanı ile uygulamanın kullandığı veri ayrımı

- Yerel Swift köprüsü yalnız idToken ve accessToken döndürür; additionalScopes
  nil, profile/phone/Gmail/People/contacts için ek API çağrısı yoktur.
- JS, ID token + access token + nonce'u Supabase doğrulamasına verir; ardından
  getUser ile Google identity/hesap kimliği doğrulanır ve oturum kaydedilir.
  Telefon alanı isteği, telefonla kayıt ekranı veya telefon raporlama kodu yoktur.
- Bu, Google'ın kendi SDK/kimlik doğrulama hizmetinde hiç telefon verisi
  işlenmediğini kanıtlamaz. Apple beyanı üçüncü taraf SDK uygulamalarını da
  kapsar; manifestin geniş beyanı korunur. Bu görevde gerçek ağ paketinde
  PhoneNumber/OtherDataTypes iletimi ölçülmedi; ölçülmüş gibi sunulmaz.
- User ID oturum kimliğidir. Coarse Location için ayrıca GPS izni istenmez;
  Google'ın resmî SDK dokümanı IP adresinden genel konum/fraud önleme kullanımını
  açıklar. SDK Analytics amacı, uygulamada Firebase Analytics veya Google
  Analytics ürününün açıldığı anlamına gelmez.
- Manifestteki Linked=true, yalnız uygulamanın Supabase hesabına ek bir
  sütun kaydetmesine bağlı değildir. SDK'nın kendi kullanıcı/cihaz bağlamı da
  toplam beyana dahildir. Mevcut App Privacy bu kapsamı koruyor.

## Kaynaklar ve sınır

- Sürümü sabitlenmiş Google kaynak manifesti:
  https://github.com/google/GoogleSignIn-iOS/blob/10.1.0/GoogleSignIn/Sources/Resources/PrivacyInfo.xcprivacy
- Google SDK veri açıklaması:
  https://developers.google.com/identity/sign-in/ios/app-privacy
- Apple App Privacy, üçüncü taraf SDK'lar dahil:
  https://developer.apple.com/app-store/app-privacy-details/

Google'ın genel metni User ID ve IP'yi özetler; bu, 10.1.0 manifestindeki
daha geniş türleri yok saymak için kanıt değildir. Mevcut form tümünü zaten
kapsadığı için bu SDK amacıyla ek destek yanıtını yayın ön koşulu olarak
beklemek gerekmiyor. Nihai dağıtım paketinde SDK/manifest veya gerçek veri
kullanımı değişirse karşılaştırma tekrar yapılmalı; bu görev SDK yükseltmedi.
