# AdMob — yalnız test entegrasyonu, 30 Ekim 2026

**Güncel durum: UMP formu ve gerçek Android emülatör test banner/interstitial PASS; fiziksel cihaz/iOS/mağaza kabulü bekliyor.** [UMP yayını sonrası güncel retest ve kanıtlar](retest/README.md). Gerçek gelir reklamı ve Analytics kapalı; PR #18 main'e alınmadı. Aşağıdaki ilk deneme/UMP engeli bölümleri tarihsel kanıttır; güncel karar için retest ve `validation.json` esas alınır. Mağaza/AAB onay kapısı korunur.

## Kaynak ve mimari

Taban: güncel `main` ile uzlaştırılmış PR #17 başlığı `0109efb6d25c9e77e95fda0664a6ae6b5c43bcdd`. Yeni dal `feat/admob-test-integration-20261030`; önceki Google OAuth, v73, UI ve mağaza hazırlıkları korunur. Supabase/Vercel Production’da yazma veya dağıtım yapılmaz.

- `config/admob.js`: derleme güvenlik kapısı. Yalnız açık `ads-preview`, `ads-development` veya yerel `ADS_TEST_BUILD=1` + `ADS_MODE=test` reklam testi açabilir. Standart preview/development/production daima off. Gelir getiren mod ve gerçek reklam birimi kabul eden kod yolu yok.
- `adPolicy.ts`: tek frekans/oyun/yaş ve tekrar kontrolü; ilk iki kayıtlı solo turda yok, üçüncüden itibaren uygun olabilir, en az 300 saniye ara; saat geri alınırsa aralık açılmaz.
- `AdProvider`: uygulama durumu, tek geçiş ve onay koordinasyonu. Yerel tercih okuma/yazma ayrı `useAdPreferences`; SDK adaptörü ayrı `runtime.native.tsx`; web adaptörü native SDK import etmez.
- `consent.ts`: UMP durumunu reklam uygunluğuna çevirir. UNKNOWN/REQUIRED veya canRequestAds=false reklamı kapatır. GDPR uygulanıyorsa cihaz saklama/temel reklam izinleri de aranır. NPA tek başına onay sayılmaz.
- `interstitial.ts`: tek yükleme/gösterim; gerçek CLOSED/ERROR beklenir. SDK show() promise’i kapanış sayılmaz; tekrar kapanış ikinci navigasyon üretmez. Hazır olmayan veya başarısız reklam için oyun bekletilmez.
- `AdBanner`: yalnız Ana Sayfa listesinin en altında, aynı scroll içinde; adaptive genişlik, son kontrolden ayrı boşluk, yükleme hatasında alan kapanır. Başka sayfada banner yok.
- `AdTransitionDialog`: sonuçtan Yeniden Oyna veya Ana Sayfa düğmesiyle çıkarken önceden anlaşılır teklif; **reklamsız devam eşdeğer biçimde mümkündür**. Gösterim denemesinden önce saklanan 5 dakika eşiği, sunum başarısız olsa da muhafazakâr biçimde korunur; bu bir reklam gösterim sayacı değildir. Sonucu okurken otomatik reklam açılmaz, sonuç puanı/XP saklama değişmez. Kapatma/geri/inceleme/çevrimiçi akışlara reklam enjekte edilmez.
- `SoundController.setInterrupted`: reklam ve izin formu sırasında etkin/kuyruktaki kısa efektleri durdurur. Kapanışta eski sesler tekrar çalmaz, arka plan durumu yanlışlıkla etkinleştirilmez. GMA uygulama sesi de muted ayarlanır; yaratıcıların kendi ses kontrolleri cihaz kabulünde ayrıca sınanır.

Rewarded/App Open/mediation/analytics entegrasyonu yok. Reklam karşılığı XP, puan, doğru cevap veya rozet kodu eklenmedi. Süre/oyun/ödül motoru, banka ve onaylı görseller değiştirilmedi.

## SDK ve platformlar

`react-native-google-mobile-ads@17.4.0` sabitlenmiştir. Paket gereksinimi RN >=0.86/New Architecture/iOS >=15.1/Android >=24; proje RN 0.88.1/Expo 58, Android min24/target36/compile37. Native bağımlılıklar: klasik GMA Android 25.5.0, UMP Android 4.0.0; iOS GMA 13.10.0/UMP 3.1.0. JavaScript ve native derleme sonuçları aşağıdaki kanıtlarda ayrı raporlanır; metadata uyumu tek başına cihaz kabulü değildir.

Expo config plugin kullanılır; measurement initialization ertelenir. Android AD_ID ve AdServices AD_ID/Attribution/Topics izinleri kaldırılır; diğer SDK teknik verileri yok sayılmaz. iOS runtime bu ilk aşamada **kapalıdır**. Mevcut iPhone development build bu yeni modülü içermez; JavaScript arayüzleri çalışabilse de iOS reklam kabulü için yeni aynı-kimlik native build gerekir. Bundle identifier ve Apple imzası değiştirilmedi; ücretli Apple üyeliği varsayılmadı. ATT/SKAdNetwork/Apple gizlilik beyanı ve fiziksel iPhone testi henüz yok. Expo Go desteklenmez.

## Kimlikler ve gerçek reklam engeli

App ID `~` içerir ve native manifest/plist içindir; reklam birimi ID `/` içerir. Varsayılanlar Google’ın Android `ca-app-pub-3940256099942544~3347511713` ve iOS `ca-app-pub-3940256099942544~1458002511` örnek App ID’leridir. Gerçek App ID uydurulmadı. UMP hesabı testine geçerken yalnız test derlemesinde `ADMOB_ANDROID_APP_ID` ile işletmecinin AdMob’dan aldığı geçerli App ID kullanılabilir; reklam birimleri yine yalnız `sdk.TestIds.ADAPTIVE_BANNER` ve `sdk.TestIds.INTERSTITIAL` kalır. Uygulama kimliği veya App ID reklam birimi yerine kabul edilmez.

Üretim profili mode=off ve realAdsEnabled=false kalır. Ortamdan “live/production” istemek de gerçek reklamı açmaz. Mevcut EAS pre-install AAB onay kapısı korunur; test profili APK üretir ve public değişken/sır denetimini miras alır.

## Gizlilik, hedef yaş ve hesap yapılandırması

- Varsayılan yetişkin/test izni false; bilinmeyen yaş ve 18-altı kullanıcıda GMA initialize veya reklam yükleme yok. Test kullanıcısının Ayarlar → Gizlilik’te kendi yetişkinlik beyanı ve isteğe bağlı reklam testi tercihi gerekir. Bu kendiliğinden yaş doğrulaması/ebeveyn onayı veya Families uygunluğu değildir; paylaşılan cihazda kullanıcı bu tercihi yeniden değerlendirmelidir.
- UMP bilgisi her uygun uygulama açılışında yenilenir; başlangıç animasyonunda form açılmaz. Gereken form yalnız kullanıcının gizlilik ekranı eyleminden açılır. Başlatma/onay/ağ hatasında reklam gösterilmez; hata metni token, cihaz ID’si veya ham sağlayıcı cevabı içermez.
- Yerel anahtarı kapatmak sonraki reklam isteğini ve ön yüklemeyi keser; UMP seçenekleri, gerekiyorsa gizlilik ekranından tekrar açılır. Önceden toplanmış sağlayıcı verileri uzaktan silinmiş sayılmaz. Tercihler/frekans bu cihazdadır; Supabase’e yeni yaş alanı eklenmez.
- Ürün sahibi “yetişkin odaklı, çocuklar okuyabiliyorsa oynayabilir” dedi. Gerçek Play hedef yaş beyanı bu oturumda doğrulanmadı. Çocuk görselleri değerlendirmeyi etkileyebilir. Çocuk kategorisi açılmadı. İleride çocuk/karma hedeflenirse nötr yaş ayrımı, sertifikalı sürüm ve Families veri/sosyal kontrolleri ayrıca kabul edilmelidir; bu test dalı bunu çözülmüş saymaz.
- EEA/BK/İsviçre mesajı, reddetme/tercihler erişimi ve varsa ABD eyalet mesajları AdMob Privacy & messaging’de işletmeci tarafından yapılandırılır. UMP’nin gerekmiyor kararı Türkiye KVKK veya diğer yerel yükümlülükler bakımından genel hukuki onay değildir. Aydınlatma, hukuki dayanak, yurt dışı aktarım ve sağlayıcı saklama koşulları ayrıca kesinleştirilmeli.
- Güncel uygulama gizlilik politikası ve `store/google-play/tr-TR/data-safety-draft.md` reklam adayının IP/yaklaşık konum, teknik tanımlayıcı, ürün/reklam etkileşimi, tanılama; reklam/analiz/sahtekârlık önleme işlemesini açıklar. Hesap e-postası, dinî yanıtlar/ilgi profili veya XP reklama eklenmez. “Reklam içeriyor” beyanı gerçek sunulan son binary’ye göre güncellenir; Console’a bu görevde beyan kaydedilmedi.

## AdMob hesabında yapılacaklar

Kullanıcı önce hesabın bulunduğunu, uygulama kaydının olmadığını bildirdi; ardından Android App ID `ca-app-pub-9642662711398587~8836643534` sağlandı. Yalnız test profillerine eklendi; hesap paneli, UMP mesaj yayını ve kategori engelleri bağımsız doğrulanmadı. App ID’nin mevcut olması UMP mesajının kurulduğu anlamına gelmez.

1. AdMob → Uygulamalar → Uygulama ekle → Android → mağazada listelenmiş değil/Hayır → Anla & Ezberle. Play panelinde taslak kaydın oluşması herkese açık mağaza URL’si değildir. İlave User metrics/Firebase Analytics açılması gerekmez.
2. Uygulama ayarlarındaki **App ID** alınır; yalnız açık test derlemesine eklenir. Bu herkese açık native kimliktir, servis anahtarı değildir. Gerçek reklam birimleri ilk aşamada kodda kullanılmaz.
3. Privacy & messaging’de uygulama seçilip gerçek gizlilik URL’si, uygun bölgesel mesajlar ve görünür reddet/tercih seçenekleri hazırlanır. Yayınlanan mesajın gerçek UMP formunda çıktığı cihazda doğrulanır. Bu işlem reklam gelir modunu açmaz; gizlilik metninin Production’a taşınması ise ayrıca incelenir/onaylanır.
4. Blocking controls: yetişkin/cinsel çağrışım, kumar/bahis/simüle kumar, alkol/tütün ve diğer hassas kategoriler muhafazakâr biçimde incelenip engellenmeli. Dinî içerik/mezhep tanıtımları, siyaset, flört, yanıltıcı sağlık ve finans reklamları da oyuna uygunluk açısından gözden geçirilmeli. G rating tek başına kategori engeli değildir. Ad review center ve reklam bildirme/engelleme süreci gerekir. Filtreler bütün uygunsuz yaratıcıları kesin engellemez; test reklamı gerçek açık artırma kalitesinin kanıtı değildir.
5. Gerçek reklam öncesi App readiness, app-ads.txt/yayıncı satırı ve mağaza bağlantısı, Play reklam/Data Safety/yaş beyanları, gerçek App ID/birimler, yayın onayı ve fiziksel kabul ayrı tamamlanır. Yayıncı kimliği olmadan sahte app-ads.txt oluşturulmaz.

## Çalıştırma ve kabul

- Test development: `ADS_MODE=test ADS_TEST_BUILD=1 pnpm exec expo prebuild --platform android --no-install`; `pnpm exec expo run:android` veya `ads-development` profili. Development Metro aynı proje/dal/8195 portunda çalıştırıldı; başka çalışan sunucu ezilmedi.
- APK: `eas build --platform android --profile ads-preview`. Ücretli işlem veya otomatik submit başlatılmaz. Yerel Android debug/release denemeleri ve gerçek emülatör sonuçları `validation.json` ile güncellenecek.
- Android 14 ve 16, debug/release, banner gerçek yükleme, interstitial gerçek yükleme/kapanış, çevrimdışı/hata, arka plan, çift tetikleme, tekrarlanan gezinme, 320/360/390, açık/koyu ve büyük yazı ayrı kanıt ister. Politika birim testi bu teslim testlerinin yerine yazılmaz.
- Önceki `7b26b1a6-947e-4602-ab46-b0570a7bba52` APK **AdMob içermez**. Bu yeni kod için onun Android veya Samsung kabulü kullanılamaz. Henüz yeni imzalı mağaza AAB’si/Play yüklemesi/Pre-launch report yok.
- Görsel yeniden dağıtım hakları hâlâ bağımsız doğrulanmış değildir. Bu çalışma orijinal cami, madalya, kategori/rozet ve uygulama ikonu varlıklarını değiştirmez veya hak sorununu çözülmüş ilan etmez.

## Resmî kaynaklar

30.10.2026 incelendi:

- [SDK sürümü/kaynağı](https://github.com/invertase/react-native-google-mobile-ads/releases/tag/v17.4.0)
- [Expo kurulumu](https://docs.page/invertase/react-native-google-mobile-ads/installation/expo)
- [UMP](https://developers.google.com/admob/android/privacy)
- [Test birimleri](https://developers.google.com/admob/android/test-ads)
- [GMA veri açıklaması](https://developers.google.com/admob/android/privacy/play-data-disclosure)
- [Families](https://support.google.com/googleplay/android-developer/answer/9893335)
- [Reklam kategori kontrolleri](https://support.google.com/admob/answer/3150235)
- [Yayımlanmamış AdMob uygulaması](https://support.google.com/admob/answer/9989980)
- [KVKK çerez rehberi](https://www.kvkk.gov.tr/Icerik/7353/Cerez-Uygulamalari-Hakkinda-Rehber)

## Release başlangıç regresyonu

İlk küçültülmüş release APK’sı gerçek API 34 emülatöründe JavaScript başlamadan `WorkDatabase` oluşturulamadığı için çöktü. R8 mapping dosyasında WorkDatabase/WorkDatabase_Impl adları korunmuştu fakat yansıma ile çağrılan boş constructor yoktu. GMA transitive WorkManager 2.7.0/Room 2.2.5 bu yolu kullanır. `plugins/with-admob-workmanager.js` yalnız `androidx.work.impl.WorkDatabase_Impl` ve public boş constructor için kalıcı/idempotent prebuild kuralı ekler. R8/obfuscation tamamen kapatılmadı, bütün AndroidX paketini tutan geniş kural eklenmedi. Yeni release’de constructor, API 34 ve API 36 açılışı tekrar doğrulandı; crash buffer boştu. Önceki hatalı APK kabul dışıdır.

Kaynak: [Android yansıma/constructor koruma kuralları](https://developer.android.com/topic/performance/app-optimization/keep-rule-examples).

### Platform adaptörü regresyonu

İlk izin denemesinde güvenli yedek mesajı görüldü. Kaynak haritası Android’in `runtime.ts` dosyasını seçtiğini, native GMA modüllerinin JS paketine hiç girmediğini gösterdi; bu deneme UMP sunucu testi değildir. Metro uzantı önceliği nedeniyle generic `.ts`, `.native.tsx` önüne geçiyordu. Girişler aynı `.tsx` ailesine alındı ve explicit `.web.tsx` ile web’in de native dosyaya düşmesi engellendi. Gerçek kurulu Metro resolver kullanan Android/iOS/web regresyonu eklendi. Native kaynak haritası ve tekrar gerçek UMP denemesiyle ayrıca doğrulanır; başarısız ilk deneme gerçek reklam yüklemesi sayılmaz.

### Doğrulanmış UMP yapılandırma engeli

Platform düzeltmesinden sonraki Android Hermes kaynağında native adaptör ve 91 GMA kaynak modülü doğrulandı. Gerçek UMP çağrısı Google’dan “Publisher misconfiguration … no form(s) configured for the input app ID” döndü. Alınan App ID işletmecinin sağladığı Android kaydıyla aynıydı. Bu sonuç, gerçek test banner/interstitial yüklemesi PASS değildir. Onay kapısı nedeniyle GMA initialize/load başlatılmadı; oyun reklamsız kaldı.

Test sürümünün tam gizlilik metni `PRIVACY-TEST.md` içinde, uygulamadaki politika metninden belge anlık görüntüsü olarak çıkarılmıştır. Mevcut Vercel Production’ı izinsiz değiştirmeden yalnız bu test uygulamasının UMP mesajına kamuya açık test politikası bağlantısı verilebilir. Bu yeni link, Play Console’daki mevcut ana gizlilik URL’sini sessizce değiştirmez. İşletmeci metni ve UMP formunu incelemelidir; genel reklam veya Production yayını onayı değildir.

## UMP yayını öncesindeki test sonuçları (tarihsel)

Makine tarafından okunabilir ayrıntılar: [validation.json](validation.json), [native paket](native-bundle.json), [Android ölçüm matrisi](native-layout-results.json), [Chrome matrisi](web-results.json). Native runtime kaynak commit’i `534be90`; sonraki bu kanıt güncellemeleri belge dosyalarıdır.

| Kontrol | Sonuç ve sınır |
| --- | --- |
| `pnpm check` | PASS — soru bütünlüğü, TypeScript, lint ve 368/368 test |
| `pnpm export:web` ve gerçek Chrome | PASS — 24 ekran kontrolü, yatay taşma/JS hatası/reklam ağı isteği yok |
| Android debug / R8 release | PASS — ikisi de gerçek Gradle derlemesi; eski crash giderildi |
| Android 14, Google APIs emülatörü | PASS — release açılışı; 320/360/390 dp × açık/koyu × %100/%150/%200 yazı × Ana Sayfa/Gizlilik = 36 kontrol. Yüklenmiş reklam geometrisi bu kapsama dahil değil |
| Android 16, ayrı boş AOSP emülatörü | PASS — release ve development build açılışı/Gizlilik. Google Play Services yok; reklam teslimi kanıtı değil |
| Ağ hatası / arka plan / reklamsız oyun | PASS — UMP çevrimdışı hatasından sonra gezinme/arka plandan dönme; 10 gerçek soruluk yerel tur, yanlış ve cevapsız yanıtla tamamlandı ve gerçek sonuç kaydedildi. Sahte oyun kaydı enjekte edilmedi |
| UMP gerçek çağrısı | BLOKE — Google `no form(s) configured for the input app ID` döndürdü; reklam kapısı açılmadı |
| Test banner / interstitial gerçek yükleme ve kapanış | DOĞRULANAMADI — yukarıdaki hesap formu engeli. Yüklü reklamda internet kesme, arka plan, çift tetikleme ve izin geri çekme cihaz testleri de bekliyor |
| Frekans/tekrar/kapanış/ses | Birim/SDK port regresyonları PASS; gerçek reklam sunumu yerine geçmez |
| Fiziksel Samsung / iOS / gelir / AAB / Play | YAPILMADI — gerçek gelir modu kapalı, iOS runtime kapalı, mağaza onay kapısı korunuyor |

**İlk APK SHA-256 (tarihsel):** `c226af9696ecd1ef2b12499718f71588ddc1d75b6f811abc61c906507999981c`; ayrıntılar `validation.json` içindedir. Bu yerel arm64 release APK, Android Debug sertifikasıyla imzalanmış emülatör doğrulama çıktısıdır. Mevcut EAS APK’sının imzası değildir; telefondaki uygulamayı kaldırma veya üzerine uyumsuz paket kurma talimatı verilmez. Fiziksel kabul için aynı mevcut EAS imzasıyla `ads-preview` APK gerekir. API min24/target36/compile37 gerçek APK’dan okundu; reklam kimliği/AdServices izinleri APK’da yok.

Eski API 36 emülatöründe imza uyuşmazlığı saptanınca eski kurulum silinmedi; `AnlaAdsTest36` adlı ayrı boş emülatör kullanıldı. Gerçek kullanıcı hesabı, Supabase veya telefondaki veri bu testler için değiştirilmedi.

Ekran görüntüleri (gerçek uygulama, emülatör; reklam teslimi görseli değildir):

- [Android 14 — 320 dp, açık, varsayılan kapalı](screenshots/android14-320-light-default.png)
- [Android 14 — 320 dp, koyu, %200 yazı; içerik kaydırılır](screenshots/android14-320-dark-font200.png)
- [Gerçek UMP hatasında güvenli geri dönüş](screenshots/android14-real-ump-error.png)
- [Çevrimdışı oynanan turun gerçek kayıtlı sonucu](screenshots/android14-offline-real-result.png)
- [Android 16 release](screenshots/api36-release-privacy-default.png), [Android 16 development](screenshots/api36-debug-privacy-default.png)

**Önceki engel (UMP yayınıyla çözüldü; bkz. retest):** İşletmeci AdMob → Gizlilik ve mesajlaşma → Avrupa düzenlemeleri içinde bu Android uygulamasının UMP mesajını, [test politikası](PRIVACY-TEST.md) ve görünür reddet/izin ver/seçenekleri yönet erişimleriyle inceleyip yapılandırmalı. Mesaj yayınının ardından aynı native pakette gerçek form, ret/geri çekme, test banner ve interstitial yükleme/kapanış tekrar test edilmeli. İzin kapısını atlamak veya yerine sahte reklam çizmek bu engeli çözmez. Hukuki/Play uygunluğu ve gerçek reklam yayını ayrıca onay ister.
