# Reklamlı iOS adayı — App Privacy çalışma tablosu

**Publish yapmayın.** Bu çalışma, mevcut 10 türlük taslağın reklamlı aday için
nasıl genişletileceğini gösterir. Gerçek iPhone kabulü ve final dağıtım paketinin
manifest/config eşleşmesi henüz tamamlanmadı. Formlarda agent cevap değiştirmedi.

Referans: mevcut native Pods'taki **GMA 13.10.0 / UMP 3.1.0** manifestleri,
[hash ve birebir alan kaydı](advertising-sdk-manifests.json). Google'ın güncel
web belgesi 13.12.0 içindir; kurulu sürüm yerine otomatik geçmez.

## Mevcut alanlar

| Alan | İşlem | Amaç / Linked / Tracking |
| --- | --- | --- |
| Name | Koru | App Functionality / Yes / No |
| Email Address | Koru | App Functionality / Yes / No |
| User ID | Koru | App Functionality / Yes / No |
| Contacts (sosyal grafik; telefon rehberi değil) | Koru | App Functionality / Yes / No |
| Gameplay Content | Koru | App Functionality / Yes / No |
| Customer Support | Koru | App Functionality / Yes / No |
| Other User Content | Koru | App Functionality / Yes / No |
| Device ID | Genişlet | App Functionality'yi koru; Third-Party Advertising ve Analytics ekle; Linked Yes; **Tracking Yes** |
| Product Interaction | Genişlet | App Functionality'yi koru; Third-Party Advertising ve Analytics ekle; Linked Yes; SDK manifestinde Tracking No |
| Other Diagnostic Data | Genişlet | App Functionality'yi koru; SDK için Third-Party Advertising ve Analytics ekle; uygulama Auth session logları hesaba bağlı olduğundan toplam Linked Yes; SDK manifestinde Tracking No |

Hesap e-postası, oyuncu adı, arkadaş grafiği, quiz cevapları veya skor reklam
isteklerine eklenmiyor. SDK'nın teknik ölçüm/Analytics amacı, Google Analytics
veya Firebase Analytics ürünü kullanıldığı anlamına gelmiyor.

## Eklenecek dört tür

| Alan | Amaçlar için kod/SDK kanıtı | Linked | Tracking |
| --- | --- | --- | --- |
| Coarse Location | GMA: Third-Party Advertising, Analytics; UMP: App Functionality. IP'den türetilen yaklaşık konum dahil | Yes (GMA); yalnız UMP kullanımının No olması toplamı No yapmaz | No (manifest) |
| Advertising Data | GMA: Third-Party Advertising, Analytics | Yes | No (manifest) |
| Crash Data | GMA: Analytics | No (manifest; ayrıca hesaba bağlı crash telemetry yok) | No |
| Performance Data | GMA: Third-Party Advertising, Analytics; UMP: App Functionality | No (13.10.0 manifesti; yeni SDK sürümünde yeniden kontrol gerekir) | No |

Bu birleşim **14 veri türü** eder. "Reklam kişiselleştirilmedi" veya "yalnız
test reklamı" diye dört türü yok saymayın. Kişiselleştirilmemiş reklam talebi,
SDK'nın reklam ölçümünü/veri işlemesini bütünüyle kapatmaz.

## Publish öncesi açık iki kontrol

1. GMA manifesti Device ID, Product Interaction, Coarse Location, Advertising
   Data, Performance Data ve Other Diagnostic Data için ayrıca
   `DeveloperAdvertising` amacı bildiriyor. Apple bu amacı uygulamanın kendi
   reklamı/pazarlaması olarak tanımlar. Uygulamada house-ad/campaign veya
   pazarlama iletişimi yok. **Yalnız gelir hedefi nedeniyle otomatik seçmeyin;
   SDK'nın bu adayda kalan kullanımını kesinleştirmeden kesin No da vermeyin.**
   Manifestteki bu amaç ile formun altı alanı uzlaştırılmadan taslağa tam
   doğruluk/yayın kabulü verilmez. Kaynak manifest açıkça kaydedilmiştir.
2. GMA manifestindeki Device ID tracking kullanımı için yeni aday ATT durumunu
   kontrol eder. Son hedefli politika ATT reddini bütün reklamlar için kapı
   olmaktan çıkarmıştır: Google'ın resmî açıklamasına göre IDFA gönderilmez;
   NPA ve kapalı publisher first-party ID ile UMP'nin izin verdiği istekler
   yapılabilir. İzin reddi, tekrar açılış ve sistemden izin geri alma davranışı
   yeni politikayı içeren gerçek iPhone paketinde ayrıca kabul edilmeli. Başka
   veriler reklam ağı tarafından üçüncü taraf veriyle birleştiriliyorsa ilgili
   türlerin Tracking cevabı da buna göre genişletilmeli; yalnız bu tabloda
   manifest No olduğu için koşulsuz onaylanmış sayılmıyor.

Mevcut kaynak iOS'ta ATT reddinden sonra IDFA'sız/NPA reklam isteyebilir;
oyunu veya XP'yi izne bağlamaz. Publisher first-party ID kapalı, doğrudan
IDFA okuma/loglama yok. UMP'nin gerekli işlevsel izin kontrolü ayrıdır; UMP
reddinde veya izin okuma hatasında reklam başlatılmaz. Ayrı reklam açma
anahtarının kaldırılması, SDK veri toplamayı kapattığımız anlamına gelmez.
Dolayısıyla 14 türlük çalışma tablosu otomatik daraltılmaz; ATT onayı verilmiş
durumlarda SDK Device ID tracking ihtimali nedeniyle bu alanı topluca No
yapmayın. App Privacy uygulamanın bütün izin durumlarını kapsamalıdır.

Henüz kurulu fiziksel build 5 önceki opt-in/ATT-blok politikasını taşır;
bu kaynak değişikliği build 5'e uygulanmamıştır. Yeni politika için cihaz/ağ
kabulü ve final paket doğrulaması bekler. PR #31'in ayrı web taslağı da eski
opt-in/ATT-ret cümlelerini taşıyor: bu içerik senkronize edilmeden yeni
politikanın doğru kamu açıklaması sayılmamalı; bu görevde diğer worktree'ye
müdahale edilmedi ve politika yayımlanmadı.

Precise Location, telefon rehberi, mesajlaşma, mikrofon/fotoğraf, ödeme veya
dinî inanç profili çıkarımı özellikleri bulunmadığından bunları sırf uygulama
konusu veya gelir hedefi için eklemeyin. Sosyal rapor metni, özel mesajlaşma
özelliği olduğu anlamına gelmez. Gerçek ek veri kullanımı bulunursa tekrar incelenir.

## Formdan ayrı yayın ayarları

- Yaş anketinde Advertising Yes; Messaging/Chat No.
- App Privacy Publish yalnız sahibinin işlemi.
- UMP iOS taslağı ayrı; Android mesajı korunur. UMP Publish, Apple App Privacy
  Publish ile aynı işlem değildir.
- Gizlilik politikası metni ve app-ads.txt web yayını ayrıca main/Vercel onayı
  gerektirir. Taslakta bulunmaları herkese açık URL'nin güncellendiğini kanıtlamaz.

Kaynaklar:

- https://developer.apple.com/app-store/app-privacy-details/
- https://developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacycollecteddatatypes/nsprivacycollecteddatatypepurposes
- https://developers.google.com/admob/ios/privacy/data-disclosure
- https://developers.google.com/admob/ios/privacy/strategies
- https://developers.google.com/admob/ios/privacy/idfa
- https://developer.apple.com/app-store/user-privacy-and-data-use/
