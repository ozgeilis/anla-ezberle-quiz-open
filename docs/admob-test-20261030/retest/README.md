# UMP yayımlandıktan sonra gerçek Android emülatör testi

30 Ekim 2026 · PR #18 · Kaynak runtime: `35ee7570ac31b7cf1313db50ffbb6a294510f2c4`.

Android 14 / API 34, Google APIs içeren `AnlaAdsTest34` emülatöründe gerçek native SDK çalıştırıldı. Supabase'e giriş yapılmadı; yalnız sentetik yerel misafir profili kullanıldı. Resmî SDK `TestIds` dışında reklam birimi yok. Reklamlar tıklanmadı; yalnız izin seçimleri, uygulama kontrolleri ve tam ekran reklamın Close kontrolü kullanıldı.

## Sonuçlar

| Kontrol | Sonuç / kanıt |
| --- | --- |
| UMP hesap mesajı | PASS — önceki `no form(s) configured` hatası kalktı. Doğal emülatör bölgesinde gerçek Google yanıtı NOT_REQUIRED / gdprApplies=0 |
| Avrupa UMP formu | PASS — yalnız development testinde açık EEA simülasyonu. Gerçek Google formu, uygulama adı/logosu, Consent / Do not consent / Manage options görüntülendi. Emülatör dili İngilizceydi; bu Türkçe form dilinin ayrıca doğrulandığı anlamına gelmez |
| UMP ret | PASS — ret sonrası uygulama reklam kapalı mesajı gösterdi; Ana Sayfa'da Test Ad yok |
| Tercihleri yeniden açma | PASS — gizlilik ekranından gerçek form tekrar açıldı; Manage options ekranı çalıştı |
| UMP kabul | PASS — formdaki kabul sonrası gerçek Test Ad banner yüklendi. İstekler yine NPA/test birimleriyle sınırlıydı |
| UMP iznini geri çekme | PASS — daha önce banner yüklüyken gizlilik formundan Do not consent seçildi; uygulama kapalı durumuna döndü ve banner kaldırıldı |
| Adaptive banner | PASS — gerçek Google “AdMob Adaptive Banner / Test Ad” yaratıcı içeriği yüklendi; yalnız Ana Sayfa altında |
| Yüklü banner ölçüleri | PASS — 320/360/390 dp × açık/koyu × %100/%200 yazı = 12 ekran. Test Ad etiketi ve reklam alt navigasyonun üzerinde kaldı. [Ölçüm matrisi](loaded-banner-layout.json) |
| İlk turlar / sunum | İkinci gerçek tamamlanan turdan Tekrar Oyna ile çıkarken teklif/reklam yoktu. Üçüncü gerçek tur kaydedilip Ana Sayfa'ya çıkılınca açık teklif geldi. Gerçek skor/XP önce gösterildi. Kayıt enjekte edilmedi |
| Interstitial | PASS — Test reklamını izle ve devam et seçimi sonrası Google'ın gerçek “This is an interstitial test ad” ekranı açıldı. Close ile istenen Ana Sayfa açıldı; ikinci teklif gözlenmedi |
| Yerel test iznini kapatma | PASS — banner kaldırıldı; arka plan ve soğuk yeniden başlatma sonrası kapalı tercih korundu. Veri temizlenmedi |
| Güncel release / kaynak haritası | PASS — final kaynak 35ee757 ile gerçek R8 release APK üretildi, yüklendi ve çalıştı. Native adaptör + 91 GMA JS kaynak modülü var; web adaptörü yok. [Paket kanıtı](native-bundle.json) |
| Otomatik regresyon | PASS — `pnpm check`: soru bütünlüğü, TypeScript, lint ve 370/370 test. `pnpm export:web` PASS |
| Web izolasyonu | PASS — güncel dist'te gerçek Chrome ile 24 ekran; taşma/JS hatası/reklam ağı isteği yok. [Sonuçlar](web-results.json) |

## Gerçek testte bulunan ve düzeltilen hata

UMP isteği başarıya ulaşınca eski kod `setAppMuted(true)` işlemini SDK initialize olmadan çağırıyordu. Android GMA native `IllegalStateException` ile uygulamayı kapattı; JavaScript try/catch bunu güvenle yakalayamıyordu. `initialization.ts` artık yapılandırmayı yapar, `initialize()` tamamlanmasını bekler, ardından mute ayarlar; bundan sonra reklam yüklemesine izin verilir. Eşzamanlı başlatmalar aynı Promise'i paylaşır, başarısız başlatma yeniden denenebilir. Bu sıra/concurrency/retry için regresyon testi eklendi. Düzeltmeden sonra gerçek release banner/interstitial ve development UMP testlerinde native crash buffer boştu. İlk hatalı deneme PASS sayılmaz.

## EEA testi üretim davranışı değildir

Formu coğrafi bölgeden bağımsız sınamak için yerel development Metro:

```sh
ADS_MODE=test ADS_TEST_BUILD=1 ADS_TEST_UMP_EEA=1 \
ADMOB_ANDROID_APP_ID=ca-app-pub-9642662711398587~8836643534 \
EXPO_PUBLIC_CONTENT_CHANNEL=production \
pnpm exec expo start --dev-client --localhost --port 8195
```

Bu bayrak yalnız açık test/local veya ads-development yapılandırmasında kabul edilir; runtime ayrıca `__DEV__` ister. Standart preview/development/production ve ads-preview'de bu zorlamanın kapalı kaldığı test edildi. UMP'nin resmî test coğrafyası kullanılır; consent sonucu taklit edilmez. EEA simülasyonu gerçek konum değişikliği, hukuki uygunluk onayı veya kullanıcılar için genel rıza değildir. Final release APK bayraksız, doğal bölgeyle derlendi. Test sunucusu iş bitiminde kapatılır; iPhone'un mevcut 8111 geliştirme sunucusu değiştirilmez.

Final yerel release APK SHA-256:
`c7b588c3747a0b9f37476292f73c42c16db0fc7d0c726a51dcefc51199126c54`.
Paket `com.kovynelstudio.anlaezberle`, min API 24, target API 36, compile API 37, arm64. Bu emülatör APK'sı yerel Android Debug sertifikasıyla imzalıdır; mevcut telefondaki EAS uygulamasının güncellemesi olarak sunulmaz. Fiziksel kabul için aynı mevcut EAS imzasıyla yeni APK gerekir. AAB/Play yüklemesi yapılmadı.

## Görsel kanıtlar

- [Gerçek UMP formu](screenshots/ump-eea-form.png), [veri tercihleri](screenshots/ump-manage-options.png), [ret sonrası durum](screenshots/ump-eea-rejected.png)
- [Gerçek adaptive test banner](screenshots/banner-loaded-default.png)
- [Üçüncü tur sonrası açık teklif](screenshots/third-round-transition.png)
- [Gerçek interstitial test reklamı](screenshots/real-interstitial-open.png), [kapanış sonrası Ana Sayfa](screenshots/after-interstitial-close.png)
- [320 dp, açık](screenshots/release-banner-320-light-1.0.png), [320 dp, koyu, %200 yazı](screenshots/release-banner-320-dark-2.0.png)
- [İzni geri çekince reklamsız Ana Sayfa](screenshots/ump-revoked-home.png), [yerel kapatma yeniden başlatma sonrası](screenshots/local-test-optout-after-restart.png)

## Yapılmayanlar ve yayın sınırı

Fiziksel Samsung, iOS native/cihaz testi, tam ekran reklam açıkken arka plana alma, çakışan iki native sunum isteği ve beş dakikalık sürenin gerçek cihazda kronometreyle yeniden testi bu turda yapılmadı. Frekans, monotonik saat, yinelenen olay ve hata güvenliği birim/SDK-port testleri bunların yerine geçirilmez. Önceki offline test gerçek bir yerel oyun turuydu; yeni reklam sunucusu ağ kesintisi/loaded-ad failure testi olarak sayılmaz. Test reklamlarının cihaz sesi fiziksel olarak dinlenmedi.

Gerçek gelir reklamı, Analytics, main, Vercel Production, Supabase ve gerçek kullanıcı verileri bu retestte değiştirilmedi. Önceden ayrı onayla yayımlanan politika-only PR #19 bu SDK entegrasyonunun yayını değildir. PR #18 taslak kalır. Fiziksel kabul ve mağaza hedef yaş/Data Safety/AdMob kategori kontrolleri ayrıca tamamlanmalı; mevcut Play onay kapısı açık değildir.

Kaynaklar: [Google UMP testi](https://developers.google.com/admob/android/privacy), [SDK ses ayarları](https://developers.google.com/admob/android/global-settings), [resmî test reklamları](https://developers.google.com/admob/android/test-ads). Bu kaynaklarla test yapılması bağımsız hukuki/Families uygunluğu onayı değildir.
