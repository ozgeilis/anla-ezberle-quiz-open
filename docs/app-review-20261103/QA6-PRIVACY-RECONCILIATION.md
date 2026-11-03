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

iOS UMP mesajı sahibi tarafından yayımlandı; son AdMob listesinde
"Anla & Ezberle iOS - Avrupa Reklam İzni" **Yayınlandı / Unpublish on**
olarak ayrıca doğrulandı. Android mesajı da **Yayınlandı** durumunu korur.
Yalnız iOS uygulaması seçili ve ret seçeneği açık olarak yayın öncesi görüldü.
Apple App Privacy Publish yapılmadı. Apple'ın
uygulama Distribution sayfası bu oturumda "Sorry, something went wrong"
verdi; önceki 10 türlük taslağa yeni canlı teyit veya kayıt başarısı denmez.

Sahibi QA6'da eski reklam açma anahtarının kalktığını ve profil ilerlemesinin
korunduğunu doğruladı. Fiziksel iPhone ekranı Device Hub'da ayrıca görüldü:
yalnız 18+ anahtarı var ve kapalı, yeni IDFA/NPA açıklaması görünür. Gerçek
reklam kabulü bu ilk ekran gözleminden çıkarılmadı. Ardından sahibi yetişkin
uygunluğunu açtı ve test banner'ının yüklendiğini doğruladı. Google'ın ayrı
izin formunun göründüğünü ve izin verdiğini de açıkça doğruladı: fiziksel
cihaz UMP form/kabul gösterimi geçti. Bu gözlem, debug EEA coğrafyasının
teknik olarak zorlandığına dair kanıt değildir.

Google'ın resmî IDFA belgesine göre UMP, GDPR formundan ayrı bir IDFA/ATT
ön bilgilendirme mesajı da gösterebilir. Önceki fiziksel form görüntüsü
kaydedilmediği için sahibinin “Google formu göründü; izin verdim” gözlemi
**GDPR rızası/kabulü veya geri alma testi** diye yeniden etiketlenmez.
https://developers.google.com/admob/ios/privacy/idfa .

İlk reklam denemesinde ATT'ye izin verdiğini belirtti; bu deneme ret kabulü
diye sayılmadı. Yalnız Anla & Ezberle'nin takip anahtarını sistem ayarından
kapatıp uygulamayı tamamen kapatıp yeniden açtıktan sonra test banner'ının
tekrar yüklendiğini de doğruladı. **Gerçek iPhone'da ATT izinli ve ATT ret
durumunda test banner gösterimi geçti (sahibinin gözlemi).** Bu, ağ
payload'ında IDFA yokluğunun bağımsız ölçümü değildir; IDFA göndermeme
dayanağı GMA'nın resmî dokümantasyonudur. Sahibi tur sonunda **reklam çıkmadan
doğrudan ana sayfaya dönüldüğünü** netleştirdi; tam ekran reklam gösterimi
geçti sayılmadı. Ardından Wi-Fi ve hücresel veri kapalıyken uygulamayı yeniden
açıp kategori/kolay sorusunda oyunun ve 20 saniyenin çalıştığını bildirdi:
çevrimdışı yerel oyun kabulü geçti. Bağlantı tekrar açıkken Google gizlilik
seçenekleri açılmadı; alttaki mesaj sahibi tarafından **"reklam hazır değil"**
olarak bildirildi. Bu genel uygulama metni, tek başına Google API hatası veya
ret kararı değildir. Yarım kalmış aktif oturum `consent()` korumasını
tetikleyebildiğinden temiz yeniden açılış ve ana sayfada banner sonrasında
tekrar deneme istendi. Sahibi iki yanıtta, temiz yeniden açılış sonrasında da
Google gizlilik seçeneklerinin açılmadığını bildirdi. Yarım tur varsayımı
kanıtlanmadı ve çözüm olarak kabul edilmedi. **UMP geri alma/ret kabulü açık.**
Ekran kanıtları
Git dışındaki `app-review-20261103/qa6-phone-privacy-age-off.png` ve
`public-privacy-ios-ads-20261103.png` dosyalarındadır; kişisel cihaz ekranları
Git'e eklenmedi.

### QA6 sonrası kaynak düzeltmesi — telefona kurulmadı

`Dialog` iOS native `onDismiss` olayını reklam geçişine iletir. Reklam
sunumu, pencereyi gizleme isteğinden sonra bu olay gelene kadar bekler;
beş saniyede olay gelmezse reklam atlanır ve normal gezinme devam eder.
Rota değişimi, reklam geçersizleştirme ve unmount bekleyeni iptal eder.
Android için iOS olayı beklenmez; mevcut sıklık/yaş/oyun korumaları korunur.

Bu, görünür kaynakta bulunan native pencere kapanışı ile GMA sunumu arasındaki
sıralama riskini giderir. QA6'da reklam çıkmamasının tek ve kesin kök nedeni
olarak sunulmaz: yükleme, oturum ve sıklık korumaları ayrıca etkilidir.
QA6 hâlâ `9d58329` kaynağıdır; bu yeni kod cihaz kabulünden geçmiş sayılmaz.
Yeni paket, imzalama ve kurulum bu kaynak düzeltmesiyle yapılmadı.

Yeni dört event/iptal/timeout testi dahil reklam testleri **28/28**, ilgili
oyun/sayaç/sonuç regresyonları **39/39**, TypeScript ve tam ESLint geçti.
Gerçek UMP ret ve tam ekran gösterim testi bu otomatik kontrollerle ikame
edilmedi. Native olay sözleşmesi: https://reactnative.dev/docs/modal#ondismiss .

### Açılmayan gizlilik düğmesi için hedefli ek düzeltme

QA6 düğmeyi SDK'nın `privacyOptionsRequired` kararından bağımsız gösteriyor;
`NOT_REQUIRED` yanıtında runtime formu açmadan devam ediyor. Ayrıca rota,
oyun ve foreground korumaları eylemi sessizce durdurabiliyor. Bunlar kaynakta
doğrulanan davranışlardır; mevcut fiziksel denemede hangi dalın çalıştığı
henüz ölçülmedi. Google belgeleri privacy-options girişinin yalnız gerektiği
durumda görünür ve etkileşimli olmasını ister.

Yeni kaynakta düğme SDK gerektirdiğinde görünür. Diğer durumda açıklama ve
izin bilgisini yeniden hazırlama eylemi vardır; bilinmeyen durum başarılı
form gibi sayılmaz. Runtime formun gerçekten açılıp kapanmasını ayrı sonuçla
bildirir. Manuel eylem oyun, arka plan, yükleme, eşzamanlı işlem veya rota
korumasına takılırsa anlaşılır neden gösterilir. SDK izni sıfırlanmaz, UMP
reset kullanılmaz, rıza veya yaş/ATT güvenliği atlanmaz.

Beş yeni hedefli test ile reklam testleri **33/33**, TypeScript ve tam lint
geçti. Bu kod QA6'da yoktur; yeni yerel paket imzalama/kurulum onayı ve gerçek
cihaz denemesi bekler. Kaynak düzeltmesi, UMP ret testinin geçtiği veya
telefonun kesin kök nedeninin bulunduğu anlamına gelmez.

Resmî gereklilik: https://developers.google.com/admob/ios/privacy#privacy_options .

## QA7 gerçek iPhone kabulü — 3 Kasım 2026

Sahibinin dar kaynak/paket onayından sonra QA7 aynı Development kimliği ile
imzalanıp uygulama kaldırılmadan kuruldu. Cihaz sorgusu build 7'yi doğruladı.
Kaynak `7182bb6`, JS `6a482eda16ae8fdf22bab7dc3d242e8948fa2206c50b2786f10c09ba030ea728`.

Gerçek Device Hub görüntüsünde yeni Gizlilik ekranı açıldı: yaş uygunluğu
açık, yalnız “Reklam izinlerini hazırla” düğmesi, formun Google tarafından
gerektiğinde sunulacağı açıklaması ve **“Gizlilik kontrolleri tamamlandı”**
durumu görüldü. Rozet vitrini 4/82 olarak göründü; bütün profil alanlarının
korunduğu bu tek ekranla yeniden onaylanmış sayılmaz. Sahibi hazırlama
düğmesine bastığını ve ekranın aynı kaldığını bildirdi. SDK gerekli-form
bayrağı false olduğu için yeniden açma düğmesi gösterilmiyor. Bu görüntü
SDK'nın REQUIRED dönmediğini kanıtlar; fiziksel denemenin ham SDK yanıtı
ayrıca ölçülmedi, kesin coğrafya/servis kök nedeni iddia edilmez.

Uygulama açık bırakılıp mevcut sıklık koşulları beklendikten sonra sahibi
bir turu bitirdi ve **“reklam tam ekran çıktı kapatınca anasayfaya döndü”**
sonucunu bildirdi. **QA7 fiziksel iPhone'da tam ekran test reklamı ve
kapatıldıktan sonra doğru gezinme kabulü geçti (sahibinin gözlemi).**
Reklamın görüntüsü kaydedilmedi; sonuç kullanıcı gözlemi olarak tutulur.
Önceki QA6 reklam çıkmaması kaydı geriye dönük başarılıya çevrilmez; modal
sıralama riski tek kesin kök neden olarak gösterilmez.

UMP geri alma/ret kabulü hâlâ açık. Fiziksel QA7'de yeniden açılabilir form
sunulmadı; mevcut Türkiye koşulu ile açıklanabileceği yalnız olasılıktır.
Mevcut simülatör native paketinde GMA/UMP/ATT olmadığı görüldüğünden onunla
reklam testi geçti denmedi. Eski paket ayrı korunarak mevcut Pod/DerivedData
ile gerekli simülatör derlemesi başlatıldı; tamamlanma ve UMP testi ayrıca
bekler. Bu işlem yeni IPA veya mağaza yüklemesi değildir.

Yeni fiziksel gizlilik ekranı Git dışı
`app-review-20261103/qa7-phone-privacy-ready.png` dosyasında kayıtlıdır.

## QA7 simülatör — gerçek UMP servis/form kabulü

Mevcut iPhone 16 / iOS 27.0 simülatörü kullanıldı. Yeni runtime indirilmedi.
Eski GMA'sız simülatör .app kopyası ayrı saklandı. İlk universal derleme Intel
ve arm64 hazırladığı için yalnız bu işlem durduruldu (exit 75); önbellek
silinmeden `ONLY_ACTIVE_ARCH=YES ARCHS=arm64` ile devam edildi ve Release
derleme **exit 0 / BUILD SUCCEEDED** verdi. Bu dağıtım arşivi veya IPA değildir.

Yeni native simülatör kopyasına **aynı QA7 JS SHA** ve varlıklar yerleştirildi.
`verify-ios-simulator.mjs` kayıtlı Bundle ID, iPhone/iPad ailesi, GMA/UMP/ATT,
geciktirilmiş measurement, test modu ve gömülü public client yapılandırmasını
doğruladı. `simctl install` uygulamayı kaldırmadan geçti. Bu kontroller gerçek
form etkileşiminin yerine kullanılmadı; aşağıdaki arayüz denemeleri ayrıca yapıldı.

Yalnız test konfigürasyonunda debug EEA kullanıldı. Google'ın belgesine göre
simülatörler test cihazıdır; fiziksel iPhone'a test-ID eklenmiş veya fiziksel
coğrafya zorlaması kanıtlanmış sayılmaz. `AdsConsent.reset`, veri silme veya
güvenlik atlatması kullanılmadı.

1. Uygulama açıldı; mevcut 10 XP / 2 rozet görünüyordu. Test simülatöründe
   yaş uygunluğu açıldı ve izin hazırlama düğmesine basıldı.
2. Gerçek Google UMP formu açıldı: “İzin ver”, **“İzin vermeyin”** ve
   “Seçenekleri yönetin” görüldü. Bu form sentetik UI değildir.
3. Test için kabul edildi. Ardından ayrı iOS ATT penceresinde **“Uygulama
   Beni Takip Etmesin”** seçildi. Kontrol tamamlandı; Google gizlilik düğmesi
   görünür hâle geldi. Bu aşamada banner gösterimi ayrıca ölçülmedi.
4. **Google reklam gizlilik seçenekleri** düğmesi formu gerçekten yeniden
   açtı. **“İzin vermeyin”** seçildi. İşlem tamamlanınca uygulama açıkça
   **“Tercihlerine göre reklamlar kapalı; oyuna reklamsız devam edebilirsin”**
   gösterdi. Reklam hazır durumu kapalı kaldı; ret yeniden kabul gibi sayılmadı.
5. Ana sayfa/kategori/Kur'an ve Dualar/Kolay turu açıldı. Sayaç ilerledi,
   süre aşımı/yanlış cevap değerlendirmesi ve sonraki soru çalıştı; bu kısa
   denemede reklam çıkmadı. Yalnız bu başlatılan kaydedilmemiş test turundan
   mevcut “Turdan ayrıl” eylemiyle çıkıldı; geçmiş sonuçlar silinmedi.

**Simülatörde gerçek UMP formu, yeniden açma, rızayı geri alma/ret ve ret
sonrası yerel oynanabilirlik geçti.** Bu sonuç fiziksel iPhone'da GDPR ret
kabulü veya ağ paketinde tanımlayıcı bulunmadığı ölçümü değildir. Native SDK
isteklerinin/measurement'ın ret sonrası tamamının bağımsız trafik yakalaması
yapılmadı; uygulama gösterim kararı ve arayüz sınırları doğrulandı.

Ekranlar Git dışında: `qa7-simulator-ump-form.png`,
`qa7-simulator-ump-reopened.png`, `qa7-simulator-ump-withdrawn.png`,
`qa7-simulator-game-after-ump-denial.png`. İmzalı fiziksel paket ve simülatör
paketi ayrı tutuldu. QA6/Build 4/5, sertifikalar ve provisioning korunur.

| Kabul | Güncel sonuç |
| --- | --- |
| QA6 fiziksel banner / ATT reddi / offline yerel oyun | Önceden sahibi gözlemledi; yeni QA7 tüm kapsamı tekrarlamadı |
| QA7 fiziksel tam ekran test reklamı ve ana sayfaya dönüş | Geçti; sahibinin gözlemi |
| QA7 fiziksel Google seçenekleri | Gerekli-form bayrağı false; geri alma testi bu cihazda geçmedi |
| QA7 simülatör gerçek Avrupa UMP / yeniden açma / ret | Geçti; gerçek servis ve arayüz |
| QA7 simülatör ret sonrası yerel oyun | Geçti; sınırlı soru/cevap/süre kontrolü |
| Bağımsız SDK ağ/IDFA ölçümü | Yapılmadı |
| Nihai App Privacy amaçları/Publish | Altı SDK amaç alanı hâlâ açık; Publish yapılmadı |
| Yeni IPA/upload/App Review/main merge | Yapılmadı; yalnız ayrı onaylı PR31 politikası main'de |

Kaynaklar:

- https://developer.apple.com/app-store/app-privacy-details/
- https://developer.apple.com/documentation/bundleresources/describing-data-use-in-privacy-manifests
- https://developer.apple.com/app-store/user-privacy-and-data-use/
- https://developers.google.com/admob/ios/privacy/data-disclosure
- https://developers.google.com/admob/ios/privacy/idfa
- https://developers.google.com/admob/ios/privacy/strategies
