# QA6 gizlilik uzlaştırması — formu yayımlama onayı değildir

3 Kasım 2026. Hazır yerel kopya: uygulama kaynağı `9d58329`, JS
`4ae2e909809cf592e8a7a2483e904bffd05cbad79b0e72f38482a15e981bb2e0`.
Sahibinin dar yerel QA6 onayıyla aynı Development kimliği/provisioning ile
imzalandı ve uygulama kaldırılmadan iPhone 11'e 0.1.0 (6) olarak kuruldu.
Kaynak build 4/5 dosyaları ve kanıtları korunur; yeni IPA veya upload yoktur.

## Paketten okunan kanıt

[17 manifestin birebir veri türleri, amaçları ve hash'leri](qa6-native-privacy-manifests.json)
hazır .app içinden toplandı. Bu script envanteridir; Xcode Generate Privacy
Report veya gerçek trafik yakalaması olarak sunulmaz. Yedi SDK veri türü
var; GMA 13.10.0 / UMP 3.1.0 sürümleri değişmedi. Google'ın güncel web veri
açıklaması 13.12.0'ı anlattığından 13.10.0 manifestinin yerine geçirilmedi.

SDK envanteri sunucu verilerinin yerine geçmez. Önceki Auth, profil, sosyal,
oyun, şikâyet ve push envanteri [ayrı denetimdedir](APP-PRIVACY-AUDIT.md).
Bu görevde sunucu verisi veya yapılandırması değiştirilmedi.

## Formdaki 10 türden 14 türlük aday tablosuna

| Tür | Aday için amaçlar | Kimlikle ilişkili | Tracking | Kaynak |
| --- | --- | --- | --- | --- |
| Name | App Functionality | Yes | No | Profil ve izinli Auth ad bilgisi |
| Email Address | App Functionality | Yes | No | Auth, doğrulama, Apple relay |
| User ID | App Functionality | Yes | No | Auth, profil ve oyuncu kimliği |
| Contacts | App Functionality | Yes | No | Arkadaşlık/sosyal grafik; telefon rehberi izni yok |
| Gameplay Content | App Functionality | Yes | No | Çevrimiçi yanıt, maç/oda/düello ve sonuç |
| Customer Support | App Functionality | Yes | No | Hesaba bağlı destek/şikâyet süreci |
| Other User Content | App Functionality | Yes | No | Şikâyet açıklaması ve ad kopyaları |
| Device ID | App Functionality + Third-Party Advertising + Analytics; aşağıdaki SDK amaç notu da uygulanır | Yes | **Yes** | Push/kurulum kaydı ve GMA |
| Product Interaction | App Functionality + Third-Party Advertising + Analytics; SDK amaç notu | Yes | No (manifest) | Oyun/sosyal olaylar; GMA/UMP |
| Other Diagnostic Data | App Functionality + Third-Party Advertising + Analytics; SDK amaç notu | Yes | No (manifest) | Bağlı Auth IP/user-agent; GMA tanılama |
| **Coarse Location** | App Functionality + Third-Party Advertising + Analytics; SDK amaç notu | Yes | No (manifest) | GMA IP-konumu; UMP işlevi |
| **Advertising Data** | Third-Party Advertising + Analytics; SDK amaç notu | Yes | No (manifest) | GMA reklam görüntüleme/etkileşim |
| **Crash Data** | Analytics | No | No | GMA 13.10.0 manifesti |
| **Performance Data** | App Functionality + Third-Party Advertising + Analytics; SDK amaç notu | No (13.10.0 manifesti) | No | GMA/UMP |

Son dört tür mevcut 10'lu taslakta yoksa eklenmelidir. Linked, yalnız Supabase
hesabına bağlamayı değil SDK'nın cihaz kimliğine bağlamasını da kapsar. NPA
veya test kimliği kullanımı bu tabloyu sıfırlamaz. Analytics amacı, Firebase
Analytics veya Google Analytics ürününü açtığımız anlamına gelmez.

### SDK amaç notu: halen kesinleştirilecek altı alan

GMA'nın kendi manifesti Device ID, Product Interaction, Other Diagnostic Data,
Coarse Location, Advertising Data ve Performance Data için yukarıdakilere ek
`NSPrivacyCollectedDataTypePurposeDeveloperAdvertising` bildiriyor. Bu altı
alanın kaynak beyanı dosyada kaybolmadan korunur. Apple'ın karşılığı
"Developer’s Advertising or Marketing"tir; yalnız AdMob geliri hedeflemek bu
kutuyu seçmenin gerekçesi değildir. Uygulama kodunda house-ad, kampanya veya
pazarlama iletişimi yoktur. Ancak üçüncü taraf SDK'nın kendi beyanını da
"biz kullanmıyoruz" diye otomatik yok sayamayız.

**Kesin Yes/No önermeden önce GMA 13.10.0 için bu SDK amacının mevcut
NPA/first-party-ID-off kullanımında geçerliliği vendor tarafından
netleştirilmeli.** Aşağıda hazır soru var; bu görevde Google'a mesaj
gönderilmedi. Bu altı alan açıkken App Privacy'ye tam doğruluk veya Publish
kabulü verilmedi. Veri türü/linked/tracking tarafındaki diğer kanıtlar
bundan ayrı olarak kullanılabilir. Mevcut 10 türün yeterli olduğunu söylemek
veya tüm Tracking alanlarını No yapmak bu sorunun çözümü değildir.

## ATT ret yolu nasıl değerlendirilir?

Google resmî belgesi ATT ret durumunda GMA'nın IDFA göndermediğini ve reklam
isteğinin yapılabileceğini açıklar. Kod UMP uygunluğu, NPA ve iOS publisher
first-party ID kapatmayı korur; takip için alternatif kimlik üretmez. ATT
kontrolü hata verirse SDK başlatılmaz. Hiçbir oyuncu e-postası, çevrimiçi ID,
quiz yanıtı veya skor reklam talebine eklenmez.

App Privacy ise bütün uygulama/izin durumlarını kapsar: ATT'ye izin verilen
durumda SDK Device ID tracking bildirdiği için toplam Device ID Tracking
cevabı Yes kalır. Diğer türlerin No değerleri SDK manifestindeki beyanlardır;
yeni gerçek cihaz/ağ kabulü yapılmış gibi sunulmaz. Yeni mediation veya
veri kullanımı eklenirse tablo tekrar değerlendirilir.

## Hazır Google teknik soru taslağı — gönderilmedi

> We use Google Mobile Ads iOS 13.10.0 and UMP 3.1.0, through
> react-native-google-mobile-ads 17.4.0. Requests are always non-personalized;
> publisher first-party ID is disabled before initialization. There are no
> mediation adapters, house ads, campaigns, direct marketing, or custom
> account/quiz targeting data. ATT is checked before initialization and its
> denial is respected by the SDK (no IDFA). The SDK privacy manifest declares
> DeveloperAdvertising for DeviceID, ProductInteraction, OtherDiagnosticData,
> CoarseLocation, AdvertisingData and PerformanceData. Does that purpose apply
> to this exact configuration, and which corresponding App Privacy purposes
> should be declared? Your current data-disclosure guide describes 13.12.0;
> please clarify the 13.10.0 declarations, including PerformanceData linkage.

## Web ve gerçek kabul

PR #31 `125f2d7` yeni reklam açma anahtarsız ve ATT-ret/NPA metnini PR #30 ile
eşleştirir. TypeScript, scoped lint, production web export ve bütün
GitHub/Vercel kontrolleri geçti. Gerçek yerel sayfa ve Vercel Preview'de yeni
metin render edildi; Preview `/app-ads.txt` doğru yayıncı kaydını gösterdi.

Sahibinin yalnız PR #31 main/Vercel onayı sonrası squash merge
`6af2d8a2a7fec0668075258d728a354b21bd30a7` oluştu. Vercel Production status
success; herkese açık `https://anla-ezberle-quiz.vercel.app/privacy` metni
bağımsız in-app browser'da gerçekten render edildi: IDFA'sız ret yolu ve
ayrı reklam açma anahtarı bulunmadığı görüldü. `https://anla-ezberle-quiz.vercel.app/app-ads.txt`
HTTP 200 / `text/plain; charset=utf-8` / birebir doğru yayıncı satırıyla
doğrulandı. Bu merge yalnız politika ve app-ads.txt'dir; PR #30 uygulama
kodu main'e alınmadı.

iOS UMP mesajı bu kontrolde **Taslak**, Android mesajı **Yayınlandı**.
Yalnız iOS uygulaması seçili ve ret seçeneği açık olarak görüldü. Sahibine
yalnız bu iOS mesajını kendi formunda yayımlama adımı bırakıldı; tamamlandı
yanıtı/son durum henüz yok. Apple App Privacy Publish yapılmadı. Apple'ın
uygulama Distribution sayfası bu oturumda "Sorry, something went wrong"
verdi; önceki 10 türlük taslağa yeni canlı teyit veya kayıt başarısı denmez.

Sahibi QA6'da eski reklam açma anahtarının kalktığını ve profil ilerlemesinin
korunduğunu doğruladı. Fiziksel iPhone ekranı Device Hub'da ayrıca görüldü:
yalnız 18+ anahtarı var ve kapalı, yeni IDFA/NPA açıklaması görünür. Gerçek
reklam/UMP/ATT-ret/çevrimdışı kabulü henüz geçilmiş sayılmaz. Ekran kanıtları
Git dışındaki `app-review-20261103/qa6-phone-privacy-age-off.png` ve
`public-privacy-ios-ads-20261103.png` dosyalarındadır; kişisel cihaz ekranları
Git'e eklenmedi.

Kaynaklar:

- https://developer.apple.com/app-store/app-privacy-details/
- https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests
- https://developer.apple.com/app-store/user-privacy-and-data-use/
- https://developers.google.com/admob/ios/privacy/data-disclosure
- https://developers.google.com/admob/ios/privacy/idfa
- https://developers.google.com/admob/ios/privacy/strategies
