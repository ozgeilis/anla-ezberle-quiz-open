# İlk iOS sürümü: reklamlı yayın adayı

3 Kasım 2026. Sahibinin son talimatı reklamsız ilk sürüm tercihinin yerine
geçmiştir. Main merge, canlı backend, App Privacy Publish ve App Review gönderim
onayları bundan ayrı kalır. Bu belge gerçek reklam sunumu veya mağaza yayını değildir.

## Önceki reklamsız talimatla yapılanlar ve hedefli düzeltme

`d11758d` iOS GMA/UMP autolinking'ini ve Expo eklentisini kaldırmış, SDK'sız
iOS runtime eklemiş, politika metni ve son paket kontrollerini buna uyarlamıştı.
Kod yalnız PR #30 dalına push edilmişti. Main'e merge, IPA veya Apple'a upload
yapılmadı. SDK'sız simülatör Release derlendi; devam eden cihaz derlemesi yeni
talimat gelince kontrollü durduruldu (exit 75). iPhone'a o aday kurulmadı.

Artık iOS native GMA/UMP ve config plugin tekrar korunur. SDK'sız runtime ve
iOS autolink dışlaması kaldırılır. Son paket kabulü SDK yokluğunu değil,
doğru iOS App ID, GMA/UMP/ATT varlığı, gecikmeli measurement ve gömülü test/live
modu ile birim eşleşmesini denetler. SDK yokluğu aracı yalnız eski kanıtı okumak
için korunur; aktif yayın kapısı değildir. Supabase URL/publishable client key
denetimi, Apple güvenliği, nested privacy manifest okuması ve bütün eski kapılar
korunmuştur. Servis veya özel anahtar istemciye/Git'e eklenmez.

## Gerçek AdMob kayıtları

Sahibi mevcut AdMob hesabında iOS uygulamasını ve iki birimi oluşturdu;
platform ve kimlikler gerçek UI'dan okundu. Bunlar public tanımlayıcılardır.

| Kayıt | Public kimlik |
| --- | --- |
| iOS App ID | `ca-app-pub-9642662711398587~9145573216` |
| Ana sayfa banner | `ca-app-pub-9642662711398587/3318531464` |
| Tur sonu geçiş | `ca-app-pub-9642662711398587/2611295311` |

Android App ID farklıdır; Android birimleri kullanılmaz. Build ortamında
`ADMOB_IOS_APP_ID`, `ADMOB_IOS_BANNER_ID`, `ADMOB_IOS_INTERSTITIAL_ID` kullanılır.
Bu oturumdaki değerler Git dışındaki public-client env dosyasındadır.

- `IOS_ADS_MODE=test`: gerçek iOS App ID ile UMP, **Google TestIds** ile reklam;
  yayıncının gerçek birimleri runtime config'e bile eklenmez.
- `IOS_ADS_MODE=live`: kayıtlı iOS App ID ve iki farklı, aynı yayıncıya ait birim
  zorunlu; eksik/yanlış/Android App ID tekrarı build sırasında reddedilir.
- EAS iOS profilleri kabul tamamlanana kadar güvenli test modundadır. Nihai
  gelir adayında explicit live ortamı ve son paket kontrolü gerekir; test paketi
  yanlışlıkla gelir sürümü diye raporlanamaz.
- Canlı moda geçişte ayrı yerel tercih anahtarı vardır. Eski test reklamı izni
  gerçek reklam iznine otomatik dönüşmez.

AdMob hesabı doğrulanıyor; iOS uygulaması mağazaya bağlı değil ve **İnceleme
gerekli**. Birim oluşturulması gelir sunumu onayı değildir. Mağaza bağlantısı,
app-ads.txt ve Google app readiness incelemesi ayrıca tamamlanmalıdır.

## İzinler ve oyun güvenliği

GMA 13.10.0, UMP 3.1.0 ve bağlayıcı 17.4.0 korunur; gereksiz sürüm yükseltilmedi.
SDK58 resmi `expo-tracking-transparency` 58.0.2 eklendi. Yalnız iOS bağlanır;
Android autolinking dışlaması gerçek CLI çıktısında doğrulandı.

- Yaşı belirsiz/reşit olmayan oyuncuda UMP/reklam başlatılmaz; mevcut 18+
  reklam uygunluğu ve isteğe bağlı tercih korunur. Genel oyun 18+ yapılmaz.
- UMP refresh → gerekli form → `canRequestAds`/temel amaç izinleri → Apple ATT
  kontrolü → SDK configure/initialize → reklam load sırası kullanılır.
- iOS ATT reddi/kısıtında **hiç reklam isteği yapılmaz**. Bu aday redden sonra
  NPA ile takip iznini aşmaya çalışmaz. Oyun ve XP kullanılmaya devam eder.
- Pasif refresh ATT penceresi açmaz. Kullanıcının başlattığı gizlilik akışında
  istenebilir; sistem reddini tekrar tekrar sorarak aşmaz. Kimlik numarası
  okunmaz/loglanmaz. Publisher first-party ID iOS'ta kapatılır.
- NPA istekleri korunur; bunun veri toplanmadığı veya ATT gerekmediği anlamına
  geldiği varsayılmaz. Reklam SDK ölçümleri App Privacy'de ayrıca değerlendirilir.
- Arka plana gidince iOS reklam hazırlığı geçersizleşir; tekrar öne gelince
  izin kontrolü yenilenir. İzin ekranındaki kısa `inactive` durumu, gerçek
  background ile karıştırılmaz.
- UMP bilgi ve SDK başlatma ağ beklemeleri 15 saniyede güvenli hata verir;
  oyuncunun izin formunu okumasına bu süre sınırı uygulanmaz.
- Banner ana sayfada; geçiş reklamı kayıtlı sonucun ardından mevcut isteğe
  bağlı çıkışta, ilk iki turdan sonra ve en az beş dakika arayla sunulur.
  Quiz, sayaç, cevap, sonuç önce gösterimi, Auth, oda veya silme sırasında
  reklam gösterimi yoktur. Başarısız reklam geçişi oyunu kilitlemez.

## Gerçek durum ve kalanlar

- İlk bütün kontrol: TypeScript/lint/banka + 449 test geçti. Son ek paket ve
  Android izolasyon kontrolleriyle **451/451** geçti. Sonraki değişiklikler için
  ilgili testler tekrar çalıştırılır.
- iOS native prebuild ve Pods tamamlandı: GMA/UMP/ATT gerçekten bağlı.
- Ayrı iOS UMP taslağı sahibi tarafından kaydedildi; Android mesajı yayınlı
  kalıyor. iOS mesajı henüz yayınlanmış sayılmaz.
- Yeni yerel cihaz paketi imza, Team/provisioning, gömülü Supabase config ve
  GMA/UMP/ATT/50 SKAdNetwork kaydı kontrolünü geçti. Kalıcı Bundle ID ile
  mevcut uygulama silinmeden fiziksel iPhone’a 0.1.0 (5) kuruldu.
  [Sanitize artifact kanıtı](ios-advertising-artifact.json). Kaynak `0343888`,
  JS SHA `44261763…68c995a`. Gerçek reklam/ret/offline/oturum kabulü,
  final IPA ve Apple binary validation **henüz tamamlanmadı**.
- QA EEA coğrafya ayarı yalnız Google tarafından tanınan test cihazlarında
  etkindir; fiziksel cihaz kaydı doğrulanmadan zorlanmış EEA kabulü sayılmaz.
  Store/live config bu override’ı taşıyamaz.
- Expo native config null değerini boş nesneye normalize ettiğinden artifact
  guard yalnız null/boş nesneyi test birimi yokluğu olarak kabul eder; gerçek
  birim içeren nesneyi reddeder. Bu varyant için ek regresyon geçti.
- Apple provider ve güvenli silme bayrakları kapalıdır. Dar canlı kabul ve
  nihai Apple kayıt politikası için [ayrı plan](APPLE-ACCEPTANCE-PLAN.md)
  onayı gerekir; bu reklam geliştirmesi onları kendiliğinden açmaz.
- Mevcut App Privacy 10 türü reklamlı aday için yeterli kabul edilmedi.
  [Önceki ayrıntılı denetim](APP-PRIVACY-AUDIT.md) ve yeni final manifest ile
  ek veri türleri/amaçlar uzlaştırılmadan Publish yapılmaz.
- Yaş anketi: Advertising **Yes**, Messaging/Chat **No**. Contests Frequent;
  bankadaki iki içki referansı nedeniyle Alcohol References Infrequent önerilir.
  Formlar sahibi tarafından tamamlanır; bu değişiklikler agent tarafından kaydedilmedi.

Kaynaklar:

- https://developers.google.com/admob/ios/privacy
- https://developers.google.com/admob/ios/privacy/strategies
- https://developers.google.com/admob/ios/privacy/data-disclosure
- https://docs.expo.dev/versions/latest/sdk/tracking-transparency/
- https://docs.expo.dev/modules/autolinking/
- https://support.google.com/admob/answer/14538460
- https://support.google.com/admob/answer/9363762
