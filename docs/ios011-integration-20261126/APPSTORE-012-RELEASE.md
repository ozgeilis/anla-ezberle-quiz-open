# İslami Quiz 0.1.2 — Apple inceleme gönderimi

27 Kasım 2026. **0.1.2 (18): Waiting for Review.** Apple arayüzünde gönderim
sonrası gerçek durum okundu; bu kayıt Apple inceleme onayı veya public release
anlamına gelmez. **Manually release this version = 1** korundu. Release This
Version kullanılmadı. Mevcut yayımlanmış sürüm 0.1.1 (13) olarak doğrulandı.

## Kaynak ve tek production IPA

- Uygulama kaynağı: `c3212d01b2e657dfd5f7dc72c65755c2462e1f80`.
- Marka: `49604bf`; yeni isim **İslami Quiz**, sahibinin onaylı yeşil-altın logosu.
- Banka/Hemen Oyna: PR #33 `a38d1ea`; kaynak ve ID'ler değiştirilmedi.
- Reklam yerleşimi: `f997dad`; kayıttan sonra, sonuçtan önce.
- **Son kullanıcı kararı:** `c3212d0` ile iOS'ta iki kalıcı turda bir deneme.
  Toplam kayıt sayısı çiftse ve reklam/izinler hazırsa denenir; eski kayıtlar
  bu sayıya dahildir. Home/Replay reklam tetiklemez. Android cadence değişmedi.
- Yeni reklam nesnesi ve kapanış sonrası preload: `6816a42` korunur.
- PR #25 → #26 → #28 → #30 → eksik iOS kuyruk aralığı → #33 → native kaynak
  düzeltmesi entegrasyonda ancestry ile doğrulandı. Açık PR başları değişmedi.
  Main `1c6a3d876a4ae01661feff22db5823cad4c1b926` kaldı; merge yapılmadı.

Tek production IPA: `IslamiQuiz-0.1.2-18.ipa`.
SHA256: `23921746ec58b679bd385ebab06fa63bf722abcd5f073826e711472f08db8678`.

Native kod/dependency değişmediği için yeniden tam Xcode native derlemesi
çalıştırılmadı. Test edilmiş mevcut native uygulama/arşiv ve eşleşen dSYM,
güncel Hermes JS ve derlenmiş yeni ikonla tek distribution export üretildi.
Bu yeni bir EAS cloud build veya sıfırdan native derleme olarak sunulmaz.

QA ile production JS byte eşit, SHA256:
`e997a2ec84bb988d688daa7e7de8f6611b31d515009aea88919d0e3c7465ad7f`.
Native UUID, dSYM ve QA ikon/Assets.car eşitliği doğrulandı. Final küçük ikon
PNG'si yalnız inceleme için decode edilip görüldü: doğru yeni yeşil-altın logo.
Transporter'ın katalogdan gösterdiği eski ikon, IPA içeriği kanıtı sayılmadı.

- Bundle ID `com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP` korundu.
- Kalıcı Frankfurt public istemci yapılandırması final Hermes'te doğrulandı.
- Production `live` iOS App ID/banner/interstitial kimlikleri onaylı Build 13
  ile eşit; QA sample birimleri production runtime yapılandırmasına taşınmadı.
- Apple/Google native config, Google URL scheme, iPad desteği, ATT açıklaması,
  measurement delay, Apple Sign-In ve production APNs entitlements doğrulandı.
- Store imzası/provisioning ve get-task-allow sınırı verifier'dan geçti.
- Paket sürüm/build numarası 0.1.2/18; repo Android/default sürüm alanları
  değiştirilmedi. Paket yapılandırması sırasında kullanılan geçici dosyalar
  restore edildi; credential veya public client env Git'e alınmadı.

## Gerçek Apple durumu ve metadata

- Ön yükleme envanteri: en yüksek 13, Build 18 kullanılmamıştı.
- Apple Transporter: 27 Kasım 17:46 yerel zamanda gönderildi.
- Apple build resource: `cc555e5f-ed2d-4949-95a3-c1e372aab8ae`.
- **Binary State: Validated**, version 0.1.2, build 18, App Name İslami Quiz.
- App Uses Non-Exempt Encryption: No; Missing Compliance engeli görünmedi.
- Build 18 sürüme bağlanıp kaydedildi. Add for Review/Continue ardından nihai
  Submit for Review tamamlandı; önce “1 Item Submitted”, sonra **Waiting for
  Review** görüldü. Yeni sözleşme veya hukuki taahhüt kabul edilmedi.
- İsim İslami Quiz olarak kaydedildi; eski marka izi açıklamada korunur.
  Diğer kamuya açık açıklama/anahtar kelime/URL'ler sebepsiz değiştirilmedi.
- Yalnız Türkiye, fiyat ₺0,00 doğrulandı. Mevcut 7 iPhone ve 3 iPad görseli
  korundu; yeni kaynak için çekilmiş ekran görüntüsü olarak sunulmaz.
- İncelemeci giriş/iletişim alanları korundu; kimlik bilgileri rapora alınmadı.
  Özel inceleme notu gerçek 0.1.2 içeriği ve test sınırlarıyla güncellendi.
- DSA sayfasında geliştiricinin trader olarak tanımlandığı okundu; yeni DSA
  beyanı/belgesi gönderilmedi. China uyarıları Türkiye kapsamını değiştirmedi.
- Yayımlanmış **17** App Privacy türü ve Device ID tracking beyanı korundu.
  **24/24** SDK manifesti onaylı Build 13 ile byte eşit; yeni Publish yapılmadı.

Kamuya açık What's New alanına yalnız istenen metin kaydedildi:

> 3.000 soruluk genişletilmiş soru bankası, yenilenen tasarım ve daha akıcı bir oyun deneyimi!
>
> - Yeni Hemen Oyna özelliği
> - İyileştirmeler ve hata düzeltmeleri

## v74 canlı geçişi — ayrı dar onaylarla tamamlandı

Önce yalnız migration/kapalı staging, doğrulama sonrasında ayrıca etkinleştirme
onayı alındı. Üç dosyanın SHA256 değerleri önceden sunulan planla eşleşti.

- Canonical migration ledger sürümü `20261126074656`, `canonical_bank_v74`.
  Migration aracının oluşturduğu yeni ledger ID'si aynı kaynak dosyasıyla
  eşlendi; aynı migration ikinci kez uygulanmadı.
- Async 3.000 soru/üye; live 3.000 soru, 3.000 anahtar, **264** havuz.
- Yeni 1.500 sorunun her eski kategorisinde 375 ek bulundu.
- Her iki v74 validator ve v73 validator'ları geçti. Eski online üyelik,
  live soru, anahtar ve havuz hash'leri başlangıçla eşit kaldı.
- İçe aktarımlar araç boyut sınırı nedeniyle sıkıştırılmış taşıma ile, açık
  kaynak SHA kontrolü ve tek transaction içinde çalıştırıldı. İlk envelope
  kontrolü veri yazılmadan rollback oldu; düzeltilmiş zarfla staging tamamlandı.
  Anahtarlı girdiler/taşıma araçları Git ve mobil paketin dışında tutuldu.
- Etkinleştirme dosyası SHA256
  `95d9008a567cd786990da368256694fbff778106e759f60fe5c9b666a8275208`.
- Son gerçek durum: online active_scope **bank-v74**, live dataset **bank-v74**,
  live enabled **true** (önceki değer korundu), v74 content_approved **true**.
- Mevcut incelemeci için sunucu seçicisinden 10 soru üretildi; hepsinin v74
  üyeliği doğrulandı. Bu **salt okunur sunucu seçimi/validator kabulüdür**,
  iki oyuncuyla fiziksel cihazda yeni çevrimiçi maç/oda testi değildir.
- Anahtar/üyelik tabloları FORCE RLS altında; anon/authenticated SELECT kapalı.
  Kullanıcı, mevcut maç/oda, XP, Auth politikası veya başka güvenlik bayrağı
  değiştirilmedi. Ortak bankayı uyumlu istemciler alabilir; Android Alpha
  kanalı/binary/testçi listeleri değiştirilmedi.
- Geri dönüş dosyası hazır; aktive edilmiş oyun kayıtlarını silmeden sonraki
  yeni oyunları önceki v73 config'ine döndürür. Geri dönüş çalıştırılmadı.

## Testlerin gerçek kapsamı

- İki tur politikası için **39/39** hedefli reklam/izin testi, TypeScript ve
  değişen dosyaların lint'i geçti. Önceki yerleşim değişikliğindeki 53 test ve
  depo genelinde lint sonucu farklı, önceki kaynağın kanıtı olarak korunur.
- Gerçek oyun motoruyla 5 tur/50 soru SDK fixture'ında 1/3/5 sonuç; 2/4
  saved → ad → closed → results. Hazır olmayan reklam, save/presentation
  hatası, duplicate callback, background/disposal ve Results butonları kapsandı.
- Fiziksel QA17 karşılığında 25 → **33** oyun; sekiz yeni turun her biri
  10 soru, v74 ve Hemen Oyna. Eski kayıtlar/profil byte eşit korundu.
- Sahibi **iki TEST reklamının sonuçtan önce açıldığını**, kapanınca sonuç
  geldiğini ve Home/Replay'in ek reklam açmadığını doğruladı. Son reklamsız
  turlarda sonuç/XP çalıştı. Reklam gelmemesinin SDK nedeni yakalanmadı;
  “no-fill doğrulandı” veya bütün uygun turlarda gösterim geçti denmez.
- Yeni kayıtlarda son soru timedOut işareti yoktu; bu yeni kaynaktaki fiziksel
  final-timeout kabulü sayılmaz. Otomatik timeout kabulü ve önceki değişmeyen
  timer cihaz kanıtı ayrı tutulur. Kesintisiz native SDK olay izi alınamadı;
  debugger bağlantısı kayboldu. Bu nedenle aynı PID'de 5/5 native reklam
  gösterimi/preload kanıtı iddia edilmez.
- Google native/Apple/email doğrulama için aynı gün `49604bf` fiziksel kabulü
  kullanıldı: sonraki değişiklikler Auth kaynaklarını/native modülleri değiştirmedi.
- Gerçek production reklamına test tıklaması/yapay gösterim yapılmadı.

Sonraki zorunlu aşama Apple inceleme kararıdır. Onay gelirse manuel public
release için uygulama sahibi ayrıca izin vermelidir; bu gönderim o izin değildir.
