> **Kapsam notu:** Aşağıdaki ayrıntılı denetim Build 4 ve o andaki 10 türlük
> Connect taslağına aittir. Son kullanıcı talimatıyla ilk iOS sürümü reklamlı
> hazırlanıyor; GMA/UMP kaldırılmıyor. Yeni aday ve canlı/test ayrımı
> [IOS-ADVERTISING.md](IOS-ADVERTISING.md) içinde. Bu dosya yeni adayın privacy
> kabulü veya Publish onayı değildir.

# App Privacy denetimi — 3 Kasım 2026

**Sonuç: mevcut 10 alanlı taslak henüz reklamlı iOS yayını için kabul edilmedi.**
Bu denetimde Connect'te cevap değiştirilmedi, Save/Publish yapılmadı. Device ID
inceleme penceresi cevap değiştirilmeden gezildi ve Cancel ile kapatıldı.
Production incelemesi/gönderimi yapılmadı. Android reklam testinin beyanı,
iOS uygulamasına otomatik taşınamaz.

## Mevcut Connect taslağı

10 veri türünün tamamı **App Functionality**, **Linked to user's identity**
olarak kayıtlı. Product Page Preview'da tracking kategorisi görünmüyor;
Device ID ayrıntısında **No, we do not use device IDs for tracking purposes**
seçili olduğu ayrıca okundu. Publish düğmesi etkin: bu, formun doğruluğunun
Apple tarafından onaylandığı anlamına gelmez.

| Veri türü             | Kod / hizmet kanıtı                                                                                     | Mevcut amaç ve kimlik bağlantısı değerlendirmesi                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Name                  | Kullanıcı profil adı; Apple ilk giriş adını Auth metadata'ya yazabilir, Google `profile` kapsamı mevcut | İşlev / bağlı doğru. OAuth kapalı veya kullanıcının paylaşmaması, desteklenen akışı yok saydırmaz   |
| Email Address         | Supabase e-posta kaydı/doğrulama, Google e-postası, Apple relay                                         | İşlev / bağlı doğru                                                                                 |
| User ID               | Auth aktörü, sağlayıcı kimliği, kullanıcı adı, oturumla yetkilendirilmiş RPC                            | İşlev / bağlı doğru                                                                                 |
| Contacts              | Sunucuda sender/recipient arkadaşlık grafiği                                                            | İşlev / bağlı doğru. Telefon rehberi okunmuyor; Apple tanımı sosyal grafiği de kapsar               |
| Gameplay Content      | Maç/oda yanıtları, doğru/yanlış, sunucu zamanı, sonuç ve skor                                           | İşlev / bağlı doğru. Salt cihazdaki misafir XP/geçmişi bu gerekçe değildir                          |
| Customer Support      | Hesaba bağlı şikâyet/itiraz ve yetkili inceleme süreci                                                  | İşlev / bağlı uygun; nadir destek verisi için isteğe bağlı istisnası burada varsayılmadı            |
| Other User Content    | Şikâyet nedeni, serbest açıklama, ad kopyaları ve kullanıcı tercihleri                                  | İşlev / bağlı doğru; keyfî serbest metni tüm olası hassas veri türleri gibi sınıflandırma           |
| Device ID             | SecureStore kurulum UUID'si, Expo push tokenı; user/session bağlantılı cihaz tablosu                    | Bildirim işlevi / bağlı doğru. Reklam SDK'sı devreye girerse ek amaç ve tracking incelemesi gerekir |
| Product Interaction   | Çevrimiçi katılım, yanıtlama ve bildirim okunma/gönderim olayları                                       | Oyun işlevi / bağlı uygun. Reklam etkileşimi bundan ayrı ek kullanımdır                             |
| Other Diagnostic Data | Auth session IP/user-agent ve hizmet güvenliği/operasyon kayıtları                                      | İşlev / bağlı uygun. GMA'nın kimliksiz SDK tanılaması aynı veri türünde başka bir kullanım olabilir |

### Sunucudan salt okunur teyit

Frankfurt'ta yalnız şema ve toplu boolean sonuçlar okundu; isim/e-posta,
parola, token, rapor metni veya kullanıcı kimliği dışarı alınmadı.

- `auth.sessions`: IP ve user-agent alanları var; dolu kayıt bulundu.
- `auth.audit_log_entries`: bu kontrolde kayıt yok; önceki genel log açıklaması
  bu tabloda hâlen IP bulunduğu gibi okunmamalı. Supabase dış operasyon logları
  ve session kaydı ayrı kapsamdır. Kesin bütün sağlayıcı saklama süreleri teyit edilmedi.
- Arkadaşlık sender/recipient, kullanıcıya bağlı canlı yanıtlar/maçlar, profil
  adı/kullanıcı adı/avatar kodu/görünürlük ve bildirim read_at alanları mevcut.
- Şikâyetler reporter/target/reason/details/ad kopyası; moderasyon notu/kararı
  ile özel tablolarda saklanır. Verinin özel veya RLS korumalı olması,
  Apple anlamında toplanmadığı anlamına gelmez.
- Push config `enabled=false`, yalnız 2 test aktörü tanımlı; ayrıca geçmişten
  aktif cihaz kaydı var. Bu, bugün gerçek bildirim gönderildiğini kanıtlamaz.
  Bazı hesaplarda kullanılabilen/verisi tutulan özelliği genel formdan saklama.
- Bu anda `full_name/name` veya `avatar_url/picture` Auth metadata kaydı
  bulunmadı. Bu, gelecekte izinli OAuth akışının bu alanları alamayacağı
  anlamına gelmez; kod Google profile kapsamı ve Apple ilk ad aktarımı içerir.

## iOS reklamının gerçek durumu

`adConfig.ts` reklam runtime'ını yalnız **Android + test modu** için açar.
AdProvider, dinamik SDK importunu ve UMP/initialize/reklam yüklemeyi bu koşulla
korur. iOS'ta reklam talebi için uygulama yolu açık değildir; gerçek reklam
ve Analytics açılmadı. Yayımlanacak iOS uygulamasında reklam olması ürün
hedefidir; bu hedef mevcut adayın çalışır reklam özelliği olduğu anlamına gelmez.

Build 4 IPA'da GMA ve UMP native kaynakları mevcut. Native tabanın lockfile'ı
GMA **13.10.0**, UMP **3.1.0**, React Native bağlayıcısı **17.4.0** gösterir.
Google'ın güncel veri açıklaması 13.12.0 içindir; eski SDK yerine bu sürümün
bütün davranışını varsaymak yerine **paketin kendi manifesti de okundu**.

Gerçek Build 4 Info.plist: `GADDelayAppMeasurementInit=true`, resmî iOS test App
ID'si var; ATT purpose string ve SKAdNetworkItems yok. Bunlar tek başına bütün
SDK ağ trafiğinin durduğunu kanıtlamaz. Native binding `initialize` çağrısında
GMA `startWithCompletionHandler` çalıştırır; kaynakta ayrı otomatik ad başlatma
yolu bulunmadı. Bu oturumda paket özelinde dinamik ağ/SDK veri akışı testi yapılmadı.

### IPA içindeki GMA manifestinin bildirimi

Bu tablo manifestteki potansiyel SDK veri kullanımını kaydeder; çalışan kapalı
iOS akışının bu verileri gerçekten gönderdiği iddiası değildir.

| Veri                  | Kimlikle bağlı | Tracking | Bildirilen amaç                                           |
| --------------------- | -------------- | -------- | --------------------------------------------------------- |
| Device ID             | Evet           | **Evet** | Third-Party Advertising, Developer Advertising, Analytics |
| Coarse Location       | Evet           | Hayır    | Third-Party Advertising, Developer Advertising, Analytics |
| Advertising Data      | Evet           | Hayır    | Third-Party Advertising, Developer Advertising, Analytics |
| Product Interaction   | Evet           | Hayır    | Third-Party Advertising, Developer Advertising, Analytics |
| Performance Data      | Hayır          | Hayır    | Third-Party Advertising, Developer Advertising, Analytics |
| Other Diagnostic Data | Hayır          | Hayır    | Third-Party Advertising, Developer Advertising, Analytics |
| Crash Data            | Hayır          | Hayır    | Analytics                                                 |

UMP manifesti Coarse Location, Performance Data ve Product Interaction'ı
kimlikle ilişkilendirilmeyen, tracking olmayan App Functionality verileri
olarak bildirir. Firebase/Google Analytics ürünü kurulmamış olsa da GMA'nın
kendi ölçümleri ayrıca Analytics amacı oluşturabilir.

**Önceki “17 manifestte NSPrivacyTracking=true yok” tespiti eksikti:** üst seviye
anahtara bakılmıştı. GMA `NSPrivacyCollectedDataTypes` içindeki Device ID
öğesinde `NSPrivacyCollectedDataTypeTracking=true` var. Üst seviye anahtarın
olmaması veya false olması bütün alt alanların tracking=false olduğunu göstermez.

## Form için uygulanabilir kararlar

1. Yukarıdaki hesap, sosyal ve oyun verileri için App Functionality / Linked Yes
   korunabilir; bunları reklam geliri hedefi nedeniyle reklama kullanılan veri
   diye işaretleme. E-posta, quiz yanıtı, profil veya dinî ilgi verisi reklam
   isteklerine ekleyen kod bulunmadı. Telefon numarası/adres/rehber, özel mesaj,
   mikrofon, fotoğraf yükleme, ödeme veya inanç çıkarımı özellikleri yok.
2. **Şimdi dört ek reklam alanını tahminen işaretleyip Publish yapma.** Reklamlı
   iOS adayının kabulünde Coarse Location, Advertising Data, Crash Data ve
   Performance Data kontrol edilmeli; gerçekten toplananlar eklenmeli.
3. GMA aktif olacaksa Device ID ve Product Interaction için yalnız işlev seçimi
   yeterli değildir: gerçek SDK kullanımına göre Third-Party Advertising ve
   Analytics eklenir. Other Diagnostic Data için SDK ölçüm amaçları da incelenir.
   Developer's Advertising or Marketing, yalnız reklam geliri elde etmekle aynı
   şey değildir; bizim/partnerin gerçek kullanımı ve yukarıdaki SDK bildirimi
   uzlaştırılmadan otomatik seçilmez.
4. SDK crash/performance verisini anonim/bağsız işleyeceği doğrulanırsa, uygulama
   bu veri türlerini başka bir yoldan hesaba bağlamıyorsa Linked No seçilebilir.
   Device ID ve hesap bağlantılı olaylar için “ad/soyad yok” gerekçesiyle Linked
   No seçilmez. IP'den konum çıkarılmayan güvenlik logu otomatik Coarse Location değildir.
5. Tracking cevabı için ATT penceresi görünmüyor veya non-personalized ads isteği
   var diye kesin No deneme. SDK'nın başka şirket verisiyle reklam eşleştirmesi
   doğrulanırsa ilgili veri türü Tracking Yes ve izin öncesi işlemi engelleyen
   uygun ATT akışı gerekir. Yalnız formda Yes seçmek izin eksikliğini çözmez.
   Tracking yapmayan yapı seçilecekse bunu SDK ayarı ve gerçek paket testiyle
   doğrula. Mevcut GMA manifestiyle gerekçesiz “her şey tracking No” onayı verilmedi.
6. Son beyan ve gizlilik politikası, seçilen **tam iOS paketine** bağlanmalı.
   Android testine ait açıklamalar ve gelecekteki reklam hedefi, yanlış iOS
   beyanını doğru yapmaz. Build 4 client config kusuru nedeniyle yeni iOS
   paket gereksinimi ayrıca açıktır; bu denetimde binary/hosted ayar değiştirilmedi.

Kaynaklar (3 Kasım 2026):

- https://developer.apple.com/app-store/app-privacy-details/
- https://developer.apple.com/app-store/user-privacy-and-data-use/
- https://developers.google.com/admob/ios/privacy/data-disclosure
- https://developers.google.com/admob/ios/privacy/strategies
- https://developers.google.com/admob/ios/global-settings
- https://supabase.com/docs/guides/auth/audit-logs
- https://docs.expo.dev/push-notifications/faq/
