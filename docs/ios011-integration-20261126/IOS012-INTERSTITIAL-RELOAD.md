# iOS 0.1.2 — ardışık tur sonu reklam döngüsü

Kaynak: `6816a420cd249966b7d751ea5d862f2deab03d64`, aynı `integration/ios011-native-source-20261126` dalı.
Bu görev yeni IPA, cihaz paketi, SDK yükseltmesi, main merge, hosted değişiklik
veya mağaza gönderimi yapmaz. Hedef sürüm 0.1.2 kullanıcı tarafından bu görevde
belirtildi; App Store'da yeni sürüm kaydı oluşturulmadı.

## Kök neden ve kanıtın sınırı

Eski iOS wrapper'ında LOADED/ERROR/CLOSED bekleniyor; load() sırasında bu
olaylardan hiçbiri gelmezse loading=true süresiz kalıyor. Sonraki load()
çağrıları bu bayrak nedeniyle SDK'ya hiç ulaşmıyor. Uygulama kapanıp açılınca
wrapper yeniden kurulduğu için kilit kayboluyor. Kontrollü önce/sonra testinde
aynı sessiz SDK isteği sonrası ikinci yükleme: eski kod 1 istek, yeni iOS kodu
2 istek. Bu kalıcı loading kilidi kod düzeyinde doğrulandı.

Normal CLOSE eski wrapper'da yalnız bayrakları sıfırlıyor; sonraki yükleme
AdProvider'ın route/session/foreground effect'ine bağlı. Aynı değerlerle
biten izin yenilemesinde yeni full ref oluşturulsa da effect'in yeniden
çalışacağı garanti değil. Bu nedenle kapanış ve yeni controller kurulumu
artık kendi açık preload girişine sahip. Eski kod sıradan Home route değişiminde
zaten tekrar load() çağırabiliyordu; bütün cihaz kaçırmalarının yalnız bu
nedenden olduğu iddia edilmez. SDK no-fill/ağ/olay kayıtları cihazda henüz
alınmadı. Bildirilen gerçek iPhone olayının tek nedenini kesinleştirmedik.

Üç tur/beş dakika koşulu iOS için zaten kaldırılmıştı; ona tekrar dokunulmadı.
Android aynı legacy controller ve cadence koşullarını kullanmaya devam eder.

## Hedefli değişiklik

- `src/features/ads/interstitialCycle.ts`: iOS'a özel controller; her yükleme
  için yeni SDK nesnesi, tek kullanımlı creative, kapanınca temiz listener/
  state ve sonraki preload. Eski nesneden geç gelen LOADED/CLOSE/rejected
  show, yeni nesneyi değiştiremez. dispose idempotent ve bekleyen show'u çözer.
- `runtime.native.tsx`: aynı test/live ID, NPA ve event eşleştirmesiyle port
  fabrikası; yalnız iOS yeni döngüyü seçer, Android legacy yolunu korur.
- `runtime.types.ts`: isteğe bağlı güvenli yükleme callback'i.
- `AdProvider.tsx`: doğrulanmış consent generation, yaşam döngüsü, foreground,
  rota ve aktif oyun guard'ını verir; iOS controller kurulunca açık load çağrısı.
- `tests/interstitial-cycle.test.ts`: gerçek mevcut oyun motoru ve SDK olay
  fixture'ı ile beş tur; failure, geç olay, duplicate ve cleanup regresyonları.

Controller LOADED'de yalnız ready yapar; kendiliğinden reklam göstermez.
Gösterim hâlâ kaydedilmiş sonuçtan çıkışta mevcut transition() üzerinden
başlar. Mevcut consumedResults/navigation lock, kaydedilmiş skor/XP ve
soru/aktif oyun korumaları korunur. Reklam kapanması sonucunda yalnız sonraki
reklam **yüklenir**, ikinci reklam hemen gösterilmez.

Background preload 30 saniyede yanıt gelmezse emekliye ayrılır; kullanıcı bu
isteği beklemez. Hazır olmayan reklamda show() false ile hemen döner ve
mevcut akış Home'a gider. Native sunum istendiği hâlde OPENED hiç gelmezse
10 saniyelik güvenlik sınırı geçişi serbest bırakır. OPENED gelmiş görünür
reklama süre koyulmaz; gerçek CLOSE/ERROR beklenir. Bu süreler yeni reklam
sıklığı değildir. No-fill/load error'da sınırsız anlık tekrar yapılmaz; sonraki
güvenli rota/foreground yüklemesi yeni SDK nesnesiyle deneyebilir.

## Gerçekten çalıştırılan testler

**37/37 hedefli otomatik test, TypeScript ve değişen dosyaların ESLint'i geçti.**
Kontrollü eski/yeni loading kilidi yeniden üretimi de geçti; tam uygulama
paketi ve native derleme tekrar çalıştırılmadı. Sonuç: interstitial-reload-test-results.json.

Beş tur aynı controller/process içinde, her biri gerçek bankadan 10 soru:

| Tur | Kaydedilen skor / toplam XP | Hazır SDK fixture gösterimi | Sonraki preload |
| --- | --------------------------- | --------------------------- | --------------- |
| 1   | 1000 / 100                  | 1                           | Yeni nesne      |
| 2   | 1000 / 200                  | 1                           | Yeni nesne      |
| 3   | 1000 / 300                  | 1                           | Yeni nesne      |
| 4   | 1000 / 400                  | 1                           | Yeni nesne      |
| 5   | 1000 / 500                  | 1                           | Yeni nesne      |

50 farklı soru, eski profil adı ve kayıt JSON round-trip'i korunur. Her SDK
nesnesi bir kez show, bir kez load, kapanışta listener temizliği/destroy;
beş kapanıştan sonra altıncı nesne preload edilir. Sorular sırasında show
reddedilir. Çift dokunuş/çift CLOSE ekstra gösterim veya navigation üretmez.

Bu bir gerçek AdMob sunucu/creative testi değildir: test fixture'ları
kullanıldı, ağ reklam isteği/gerçek impression/click sayısı sıfırdır. Native
React ekran gezinmesinin fiziksel kabulü veya banner görüntü testi olarak
sunulmaz. Native Banner fonksiyonu ve AdBanner dosyası byte düzeyinde korundu.

Diğer kabul: no-fill/offline → hemen devam; sessiz load timeout → yeni deneme;
show throw/rejection/native error → geçişin çözülmesi; eksik OPENED → bounded
fallback; açılmış reklam → gerçekten kapanana kadar bekleme; eski callback ve
geç promise reddi → yeni ready nesnesine etkisiz; quiz/background/consent
invalidation/dispose → yeni ağ isteği ve gösterim yok.

## Fiziksel iPhone kabulü — henüz yapılmadı

CoreDevice salt-okunur envanterinde iPhone 11 disconnected. Yeni kodu içeren
imzalı cihaz kabul uygulaması bu görevde üretilmedi/kurulmadı. Önceki QA/Build
13 veya önceki temiz simulator Release kanıtı bu yeni JS düzeltmesinin gerçek
cihaz kabulü olarak kullanılamaz.

Sonraki yetkili test paketinde yalnız Google test birimleriyle:

1. Uygulamayı silmeden güncelle; XP ve eski sonuçları karşılaştır.
2. Uygulamayı kapatmadan Hemen Oyna ile beş 10 soruluk tur tamamla. Her sonuç
   kaydedildikten sonra Ana Sayfaya Dön; hazır test interstitial açılıp gerçek
   kapatmayla Home'a dönmeli. Reklama tıklama. Her turda gerçek fill garanti
   edilemez; load/no-fill/ready ve gösterim sonuçları ayrı kaydedilmeli.
3. Ağ kapalı/no-fill durumda beklemeden Home ve yerel oyuna dönüş; ağ geri
   geldiğinde sonraki güvenli preload/yeni tur denemesi. Skor/XP değişmesin.
4. Arka plan/geri açılış, ATT-ret ve UMP-ret koşullarını koru. Soru/sayaçta
   reklam yok; bir sonuç için çift dokunuşta tek gösterim. Gerçek reklamlarda
   test tıklaması/yapay gösterim yok.

Kod 0.1.2 adayına dahil edilmeye hazırdır; fiziksel cihaz ve nihai paket
kabulü bekler. Main merge ve dağıtım ayrıca onaya bağlı kalır.

## Resmî reklam rehberleri

- https://developers.google.com/admob/ios/interstitial
- https://docs.page/invertase/react-native-google-mobile-ads/displaying-ads
- https://support.google.com/admob/answer/6201362?hl=en
- https://support.google.com/admob/answer/3342054?hl=en

Mevcut yerleşim, kaydedilmiş 10 soruluk oyun sonrası doğal içerik arasıdır.
Her dokunuşta/soruda veya bir reklam kapanır kapanmaz ikinci gösterim yoktur.
Ön yüklenen reklam hazır değilse sonraki ekran açıldıktan sonra gecikmiş
show yapılmaz. Bu teknik yerleşim incelemesi Google'ın hesap/uygulama reklam
sunumu onayı veya gelir garantisi değildir; gerçek sunum AdMob fill/limit ve
geçerli gizlilik koşullarına bağlıdır.
