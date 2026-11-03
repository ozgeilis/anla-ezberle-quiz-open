> **Son reklam kabulü — QA7:** Sahibinin ayrı kaynak/paket onayıyla yerel
> build 7 iPhone'a uygulama silinmeden kuruldu. Sahibi tam ekran test reklamının
> açılıp kapandığını ve ana sayfaya dönüldüğünü doğruladı. Gerçek Gizlilik
> ekranında izin kontrolü tamamlandı, SDK'nın gerekli-form bayrağı false.
> **UMP geri alma/ret simülatörde geçti; fiziksel cihaz Avrupa ret yolu açık.** Eski QA6 başarısız reklam denemesi
> geriye dönük başarılı sayılmaz. Yeni IPA/upload/main merge yoktur.
> [Güncel kanıt ve sınırlamalar](QA6-PRIVACY-RECONCILIATION.md),
> [onaylı QA7 planı ve kurulum](CONSENT-QA7-LOCAL-ACCEPTANCE-PLAN.md).

> **Web politikası:** Yalnız PR #31 ayrı onayla main'e `6af2d8a` olarak
> alındı ve Vercel'de yayımlandı; açık /privacy ve /app-ads.txt doğrulandı.
> Aşağıdaki ilk main snapshot'ı tarihseldir; PR #30 kodu main'de değildir.

> **Güncel ürün kararı:** İlk iOS sürümü reklamlı hazırlanıyor. Reklamsız
> `d11758d` denemesi main/IPA/upload olmadı; yalnız ilgili SDK dışlamaları
> hedefli kaldırıldı. Supabase paket düzeltmesi korunur. Yeni reklamlı native
> cihaz kabulü ve App Privacy henüz tamamlanmadı. [Güncel reklamlı aday](IOS-ADVERTISING.md).

> **Son reklam politikası:** Ayrı reklam açma anahtarı artık uygunluk şartı
> değildir; 18+ güvenliği ve UMP korunur. ATT reddinde Google'ın desteklediği
> IDFA'sız/NPA yolu hazırlanmıştır. Fiziksel QA6/QA7 kabul kapsamı yukarıdaki
> kanıtta ayrıdır; yeni IPA üretilmemiştir. [Politika kapsamı](AD-POLICY-UPDATE.md).

> **Kritik güncel bulgu:** Build 4 imzası/geçmiş Apple validation geçerli olsa da
> çevrimiçi istemci yapılandırması final JS paketinde yok. Tam aynı JS ile gerçek
> iPad ekranında NOT_CONFIGURED görüldü; export IPA'da beklenen Frankfurt URL
> ve publishable key yok. Yeni yapılandırılmış aday gerekiyor. Build 4 silinmez,
> fakat çevrimiçi yayın kabulü olarak kullanılamaz. Kaynak hash eşitliği ortam
> değişkenlerinin gömüldüğünü kanıtlamıyor. Ayrıntı: [paket düzeltmesi](BUNDLE-CONFIG-FIX.md).

# App Review hazırlığı — 3 Kasım 2026

Bu çalışma yayın onayı değildir. Ana dal, Android Alpha/testçiler ve canlı
Supabase ayarları değiştirilmez. Hazır binary yeniden üretilmez. Son inceleme
gönderimi ve herkese açık yayın ayrı ürün sahibi onayı bekler.

## Kaynak ve paket

Güncel remote main: `b421fe934033ccc69e1f96b37fd1bffd2300d130`.
PR25 (iOS), PR26 (Apple silme/oyuncu güvenliği), PR28 (mağaza hazırlığı) açık
ve draft. PR24 (20 saniye/XP/Auth/bildirim), PR27 (sezonluk kartlar), PR29
(gizlilik) main'de. Eski PR22/23'ün açık olması, PR24 ile gelen kodun main'de
olmadığı anlamına gelmez; içerik karşılaştırması esas alınır.

Yeni izole branch PR28'in `e443794` başından açıldı; güncel main bu branch'e
çakışmasız entegre edildi. Kullanıcıya ait hiçbir worktree silinmedi. Main'e
merge yapılmadı.

Build4: `0.1.0 (4)`, Bundle `com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP`,
Connect uygulama `6829516832`, build UUID
`746dd05e-19cb-4f00-b38b-e9b994fc5a12`.
Runtime `e118f7cbb578ccd4061a1564fa751c2096d320f2`; IPA ve JS hash'leri
[readiness.json](readiness.json) içindedir. `src`, app/Expo config, dependency
lock ve EAS profilleri Build4 kaynağıyla aynı. İlk kaynak karşılaştırmasında yeni IPA gerekmiyor görünüyordu; aşağıdaki final paket yapılandırma denetimi bu sonucu değiştirdi.
Apple önceki yüklemeyi Validated / Ready to Submit olarak işledi; Internal Only
değil. Yeni oturumda durum ayrıca doğrulanır. Tarihsel pre-upload doğrulama
JSON'undaki uploaded=false değeri, sonradan doğrulanan yüklemeyi geri almaz.

## Zorunlu kontrol tablosu

| Gereksinim                    | Durum / kanıt                                                                            | Kalan işlem                                                                 |
| ----------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Main, PR ve worktree denetimi | Tamamlandı; remote main ve bütün PR'lar okundu                                           | Main entegrasyonu son onay                                                  |
| Build4 kaynak eşitliği        | Runtime diff boş; simülatör JS SHA eşleşti                                               | Yeni runtime değişirse yeni aday kabulü                                     |
| 20 saniye, XP100 ve geçmiş    | 435 test (ilk denetim), banka bütünlüğü ve izole SQL geçti                               | Gerçek iPhone güncel aday kabulü                                            |
| Apple giriş/silme/revoke      | Kod/migration mevcut; önceki tek gerçek iPhone denemesi başarılı, test hesabı temizlendi | Canlı Apple bayrakları şu an false; yeni release kabulü olmadan hazır değil |
| Google giriş/yeni kayıt       | OAuth true, yeni kayıt false                                                             | Kısıtlı Audience/test izni ile genel kullanıcı erişimini karıştırma         |
| E-posta ve oturum             | Kaynak/regresyonlar mevcut; registration true                                            | Güncel gerçek iPhone callback/oturum testi bekliyor                         |
| İncelemeci ve ikinci hesap    | Mevcut iki hesap doğrulanmış/etkin, yeni hesap oluşturulmadı                             | Taze parola girişi ve sosyal erişim; yalnız Connect özel alanı              |
| Şikâyet/engel/moderasyon      | Kod ve canlı migration var; safety true, 1 moderatör; izole SQL geçti                    | Güncel cihaz kabulü ayrı                                                    |
| RLS/advisors                  | Public tablolarda RLS açık                                                               | Mevcut uyarılar ayrı raporlanır; kendiliğinden canlı düzeltme yok           |
| Sezonluk kartlar              | PR27 main'de, adayda korunuyor                                                           | Simülatörde altı kategori + Karma; sezonluk kart yok                        |
| Reklam/Analytics              | iOS off; gerçek reklam veya Analytics açılmadı                                           | Nihai App Privacy ve SDK manifest karşılaştırması                           |
| Mağaza metni/görseller        | Önceki taslaklar ve gerçek iOS kanıtları korunuyor                                       | Zorunlu Dynamic Island medium ve iPad13 ekranları, Connect kaydı            |
| App Store sürümü              | Mevcut kayıt önceki kontrolde 1.0; binary 0.1.0                                          | Aynı sürüme eşleştirme; bu tek başına yeni binary gerekçesi değil           |
| Fiyat/ülke/manual release     | Hazırlık bekliyor                                                                        | Ücretsiz, gerçek ülke seçimi, otomatik yayın kapalı kabulü                  |
| DSA/sözleşmeler               | Önceki DSA In Review; Free Agreement Active                                              | Taze Apple oturumu; hukuki onay yalnız sahibi                               |
| TestFlight 422                | Ayrı destek kaydı 103016925563                                                           | App Review gönderimi denenmedi; çalışacağı varsayılmaz                      |
| Fiziksel cihaz                | Sahibi 3 Kasımda mevcut build 2 üzerinde sınırlı gerçek cihaz kontrolü yaptı             | 20 sn/skor sırası/kesilmeme/tur güncelleme geçti; exact yeni aday bekliyor  |

## Güvenli incelemeci erişimi

İncelemeci hesapları daha önce onayla oluşturulan `+play-review` ve
`+play-opponent` sentetik hesaplardır; bu PR parola veya token içermez. Auth
doğrulaması ve erişim uygunluğu salt okunur olarak kontrol edilir. Güncel gerçek
giriş geçmeden "Apple giriş yapabilir" denmez. Gereksiz üçüncü hesap açılmaz.
Yalnız Apple'ın özel App Review Sign-In alanı kullanılır; beta alanında mevcut
bilginin olması Production review alanının da dolu olduğunu kanıtlamaz.

Hesapsız tek oyunculu, günlük, kategori, XP, profil ve rozetler erişilebilirdir.
Sosyal test için kontrollü ikinci hesap gerekir; gerçek oyuncuya rapor veya davet
testi yapılmaz. Yeni hesap gerekirse resmi Auth admin yöntemi ve güvenli parola
saklama kullanılır; SQL ile auth.users kaydı uydurulmaz.

## Yayın için açık kararlar

Google görünürken eşdeğer özel e-posta girişinin Apple tarafında kapalı olması,
4.8 açısından giderilmesi gereken bir yayın engelidir. Bu tespit genel Apple
veya Google kaydını açma izni değildir. Mevcut kapalı kayıt, provider, silme ve
RLS ayarları korunur. Çalışmayan girişin yalnız gizlenmesi "tamamlandı" sayılmaz.
Uygulanacak dar canlı plan ve gerçek Apple/iPhone kabulü ayrıca hazırlanır.

Önce review metadata, gerçek ekranlar, test raporu ve bu açık kararlar
tamamlanır. Sonra main entegrasyonu ve App Review gönderimi için ayrı açık onay
istenir. Bu dosyadaki hiçbir olumlu test sonucu bu izinleri otomatik vermez.

`node scripts/check-app-review-readiness.mjs` eksik kanıt varken çıkış kodu1
verir. Bu beklenen yayın engelidir; başarılı mağaza kabulü diye raporlanmaz.

## Resmî kaynaklar

- [App Review: login, hesap silme, kullanıcı içeriği](https://developer.apple.com/app-store/review/guidelines/)
- [Ekran görüntüsü ölçüleri](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/)
- [Ücretsiz/ücretli sözleşme ayrımı](https://developer.apple.com/help/app-store-connect/manage-agreements/sign-and-update-agreements/)
- [App Privacy](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/)

Apple'ın belgesi Paid Apps Agreement'i ücretli uygulama veya IAP satışı için
istiyor. İleride reklam geliri hedefi, bu aşamada ücretli uygulama/IAP satıldığı
anlamına gelmez. Gereksiz ücretli sözleşme kabul edilmez. DSA kimlik/iletişim ve
son beyanı sahibi tamamlar; stüdyo markası kurulmuş şirket gibi gösterilmez.

## 3 Kasım gerçek simülatör kabulü

Mevcut Build 4 ile aynı JS SHA taşıyan mevcut native simülatör uygulaması,
yeni iPhone 16 / iOS 27.0 test cihazına kuruldu; yeni IPA veya runtime indirilmedi.
Gerçek 1179×2556 ekranlar [screenshots](screenshots/README.md) klasöründe.

- Kur’an ve Dualar / Kolay: 10 soru, ilk cevap doğru, kalan dokuz süre aşımı.
  Sonuç: 100 skor, 10 XP, 1 doğru, 0 yanlış, 9 boş. Açıklama ekranı açıldı.
- Günlük yarışma: 10 soru gerçekten tamamlandı, sonuç 0 skor / 10 yanlış.
  Tamamlandı kartı ve geçmiş yönlendirmesi görüldü. Yanıt sonrası seçenekler
  devre dışı kaldı; fazladan yanıt kaydı yapılmadı.
- Profil: 2 oyun, 100 toplam skor, %5 doğruluk, seviye 1 ve 10/100 XP.
  İlk adım ve Bugünün Keşfi rozetleri gerçek oynanışla kazanıldı.
- Açık/koyu tema, kategori kartları, soru ve sonuç metinleri kontrol edildi.
  VoiceOver ilk kullanım öğreticisi sırasında Mac kilitlendi: tam ekran okuyucu
  kabulü yapılmadı. Yeni simülatörde VoiceOver/klavye yakalama geri alınacak.
- Bu sonuçlar fiziksel iPhone, TestFlight kurulumu, gerçek OAuth, APNs teslimi
  veya bütün canlı oyun modlarının native kabulü değildir. iPad için önceki
  gerçek ekranlar korunuyor; güncel Build 4 iPad tekrarı henüz yapılmadı.

Yerel tam kontrol 434/434 geçti. İzole PostgreSQL ve Apple silme HTTP/JOSE
protokol testleri geçti; Apple uçları fixture olduğundan gerçek Apple servisi
kabulü sayılmaz. Mevcut export IPA deep/strict codesign, distribution profile,
Team/Bundle/build ve JS SHA doğrulaması geçti. İlk doğrulamada yanlışlıkla
Development archive kullanımı reddedildi; dağıtım için doğru export IPA ayrıca
ve başarıyla kontrol edildi. Hiçbir imza değiştirilmedi.

Mağaza metinleri [STORE-METADATA.tr.md](STORE-METADATA.tr.md), İngilizce özel
inceleme yönergeleri [REVIEW-NOTES.en.md](REVIEW-NOTES.en.md), veri beyanı
çalışma kâğıdı [PRIVACY-INVENTORY.md](PRIVACY-INVENTORY.md) içindedir. Bunlar
Connect'e kaydedildi veya yayınlandı anlamına gelmez. Sonraki dar işlemler ve
onay ayrımı [NEXT-STEPS.md](NEXT-STEPS.md) içindedir.

## Son hazırlık durumu

Yeni kontrol dahil `pnpm check` **440/440** geçti. İlk eklemede Node Buffer
import'u lint tarafından reddedildi; açık `node:buffer` import'u ile düzeltildi
ve tam kontrol yeniden geçti. Yeni final-config guard eski Build 4'ü doğru
biçimde reddetti, yapılandırılmış yeni Hermes adayını kabul etti.

Connect'te Türkçe ad/alt başlık, Games/Trivia + Education, açıklama/keyword/
support, 0.1.0 sürümü ve manuel yayın kaydedildi. Mevcut Build 4 taslağa bağlandı;
sonradan bulunan paket kusuru nedeniyle gönderilmeyecek. Özel reviewer giriş
ve iletişim alanları mevcut Beta Review kaydından güvenli aktarıldı; eşleşme ve
kayıt doğrulandı, içerikleri Git'e/rapora alınmadı. Yeni hesap/parola yok.

Ücretsiz fiyat çizelgesi onaylandı; sahibi iOS için yalnız Türkiye'yi seçti.
Availability sayfasında Türkiye **Available on App Release**, diğer ülkeler
**Not Available**, toplam 1 ülke görüldü. Bu yüzden DSA'nın AB dağıtım yükümlülüğü
bu ülke planına otomatik yayın engeli olarak yazılmaz; hesap Trader doğrulaması
ayrı izlenir, 422'nin nedeni olduğu iddia edilmez.

Apple taslağında **7 iPhone + 3 iPad** JPEG dosyasının adları ve işlenmiş sayıları
görüldü; Save disabled. İncelemeye gönderim/yayın yapılmadı. App Privacy formu,
yaş/content-rights ve hukuki teyitler hâlâ açık. Eski planların tarihsel olumlu
ifadeleri son bu snapshot'ın yerini tutmaz.

Mevcut incelemeciyle gerçek Auth ve izinli eski 8121 web önizlemesinde korumalı
arkadaş listesi/karşılıklı sentetik arkadaş ve davet kontrolleri görüldü. Yeni
8138 origin'in sosyal CORS reddi raporlandı, güvenlik listesi genişletilmedi.
İki web test oturumundan çıkıldı. Bu, yeni native adayın iki oyunculu room/duel
ve fiziksel Apple/Google kabulü değildir.
