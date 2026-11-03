# QA7 dağıtım paketleri — 3 Kasım 2026

Sahibinin `iOS TESTFLIGHT VE APP STORE PRODUCTION PAKETLERİNİ HAZIRLA VE YÜKLE`
talimatı kapsamında iki farklı paket hazırlandı. Yeni özellik/reklam politikası
kodu yazılmadı. Kaynak PR30 HEAD `49597b6ccef90a1661bf1a9c4e2b50ea4a66b0c6`;
çalışan QA7 kodu `7182bb635e24382285f95df0a1d5341c5aff7dc3`.
Main `6af2d8a2a7fec0668075258d728a354b21bd30a7`; PR28 ve PR30 açık/draft,
PR31 merge edilmiş olarak kontrol edildi. Main veya diğer worktree değiştirilmedi.

## Paketler ve sınırlar

| Alan                     | TestFlight                                                                     | App Store production adayı                    |
| ------------------------ | ------------------------------------------------------------------------------ | --------------------------------------------- |
| Bundle / Team            | com.kovynelstudio.anlaezberle / W7CRC43SHP                                     | Aynı                                          |
| Version / build          | 0.1.0 (8)                                                                      | 0.1.0 (9)                                     |
| Reklam                   | Google test birimleri                                                          | Gerçek iOS banner + geçiş birimleri           |
| QA coğrafyası / override | Yok                                                                            | Yok                                           |
| EAS Build ID             | Yok; mevcut native çıktıdan yerel paketleme                                    | Yok; mevcut native çıktıdan yerel paketleme   |
| İmzalı IPA               | Hazır                                                                          | Hazır, yerelde bekliyor                       |
| Apple yükleme            | Başarılı, 2026-11-03 14:03:08 UTC                                              | Yapılmadı; gizlilik ve Apple Auth kabulü açık |
| Apple işleme             | **Validated**; processing tamamlandı                                           | Uygulanamaz                                   |
| Dağıtım kapsamı          | **Testing** — Anla & Ezberle Internal QA; internal-only, App Store'a seçilemez | Henüz dağıtılmadı                             |
| App Review / yayın       | Gönderilmedi                                                                   | Gönderilmedi                                  |

Her iki IPA'nın hash, boyut, imza/config ve test kapsamı
[artifact kaydında](qa7-distribution-artifacts.json). Yükleyicinin ürettiği gerçek
Build8 IPA'sı ayrıca korunup hash'lendi; yerel export zip hash'i de ayrı kaydedildi.
Xcode upload kimliği `d5203823-9b96-4bf4-8c6d-4cca2e3b7442`.
Build4 ve bütün önceki paketler korunur.

QA7 fiziksel uygulamasının ayrı kopyaları kullanıldı; eski Build4 native tabanı
kullanılmadı (eski pakette ATT metni yok). JS SHA
`6a482eda16ae8fdf22bab7dc3d242e8948fa2206c50b2786f10c09ba030ea728`
her iki final IPA'da birebir eşleşiyor. Native UUID ve ana dSYM eşleşiyor;
61 oyun varlığı byte karşılaştırmasında aynı. App.config'deki build/reklam modu
ve dağıtım imzası farklı; QA-only EEA override dağıtıma taşınmadı.
18+, UMP/ATT, oyun/sıklık korumaları ve yerel ilerleme mantığı değiştirilmedi.

Build8 Apple metadata ekranında Binary State **Validated**, encryption **No**,
iPhone+iPad, doğru Bundle/Team yeniden görüldü. Internal QA Builds sekmesinde
**0.1.0 (8) Internal / Testing** doğrulandı; mevcut otomatik dağıtım ayarı
değiştirilmedi. Tek testçi **Invited** durumunda, kurulum/cihaz oturumu yok.
Apple imzalı TestFlight kurulumu başarılı diye raporlanmaz.

## Gerçek doğrulamalar

- Her iki IPA: codesign deep/strict, App Store provisioning, production APNs,
  Apple capability, Team/Bundle, iPhone+iPad ve süreli profil geçti.
- Her iki final Hermes: Frankfurt public Supabase config doğrulandı;
  özel/service-role anahtar kullanılmadı.
- iOS App ID `ca-app-pub-9642662711398587~9145573216`.
  Production banner `ca-app-pub-9642662711398587/3318531464`, geçiş
  `ca-app-pub-9642662711398587/2611295311`; 3 Kasım AdMob iOS ekranında
  yeniden karşılaştırıldı. Test paketi yayıncı reklam birimi taşımıyor.
- GMA/UMP/ATT varlığı ve gecikmeli ölçüm, test/live ayrımı geçti.
- 19 reklam/consent/modal hedefli test + 15 store-artifact/upload/release gate
  testi geçti. Son gruptaki kasıtlı bozuk-plist negatif testi stderr'de
  InvalidFileException üretir; TAP sonucu 15/15 geçer.
- Mevcut QA7 fiziksel tam ekran test reklamı → ana sayfa kabulü korunur.
  Yeni App Store imzalı Build8'in iPhone kurulumu henüz test edilmedi.
- Avrupa UMP geri alma/ret ve reklam reddinden sonra oyun kabulü gerçek
  iOS simülatöründendir; fiziksel iPhone testi olarak sunulmaz.
- TypeScript/lint/banka için daha önceki QA7 sonuçları kullanıldı;
  runtime kaynağı değişmediğinden bu işlemde yeniden çalıştırılmadı.

Xcode yüklemesi başarılıdır; ancak sekiz prebuilt Expo/React/Hermes framework'ü
için eksik dSYM yükleme uyarısı vardır. Ana uygulama dSYM'i eşleşir. Bu uyarılar
binary reddi değildir; ilgili framework çökme izlerinin sembolleştirilmesi eksik
kalabilir. Mevcut semboller silinmedi, yeni büyük native build başlatılmadı.

Mevcut cache içinde beş Expo framework'ünün eşleşen dSYM'i ayrıca bulundu
ve iki arşive koruyucu olarak eklendi. Bu, daha önceki Build8 sembol yükleme
uyarılarını düzelttiği iddiası değildir; ayrı sembol yüklemesi veya tekrar IPA
yüklemesi yapılmadı. React, ReactNativeDependencies ve Hermes için eşleşen
sembol bu cache incelemesinde bulunamadı.

## Production yüklemesini durduran kabul koşulları

Salt okunur Frankfurt kontrolü: Apple OAuth/deletion/revocation **false**;
Google OAuth/deletion **true**, Google signup **false**; e-posta kayıt/silme
**true**, oyuncu güvenliği **true**. Hiçbiri değiştirilmedi. Önceki Apple gerçek
cihaz testinin başarı kaydı, şu an kapalı yayın sağlayıcısı için kabul sayılmaz.
Açılacak provider/izin listesi/silme bayrakları ayrı canlı plan onayı gerektirir.

[14 veri türü ve altı SDK amacı](QA6-PRIVACY-RECONCILIATION.md) halen açık:
Device ID, Product Interaction, Other Diagnostic Data, Coarse Location,
Advertising Data, Performance Data için SDK'nın DeveloperAdvertising amacı
mevcut NPA/first-party-ID-off kullanımına göre kesinleştirilmedi. Tracking'in
tümü No yapılamaz; ATT izinli SDK Device ID için Tracking Yes kaydı korunur.
Formda Publish yapılmadı; bu altı amaç otomatik yok sayılmadı.
Bu yayın kabul engelleri nedeniyle Build9 **yüklemeye uygun** işaretlenmedi.

AdMob iOS durumu **İnceleme gerekli**. UMP iOS mesajı **Yayınlandı**;
Android mesajı korunuyor. Gerçek birimlerin bulunması gelir/gösterim onayı değildir.
Production IPA çalıştırılıp gerçek gösterim/tıklama üretilmedi.

TestFlight internal-only yüklemesi genel kayıt veya Apple provider açmaz;
yetkili mevcut e-posta test hesapları ve misafir oyun akışıyla sınırlıdır.
Apple hesap giriş/silme kabulü veya herkese açık dağıtım için uygunluk anlamına
gelmez. Eski public beta HTTP422 / destek 103016925563 ayrı açık kayıttır;
Build8 internal yüklemesi bu harici gönderim hatasını çözüldü saymaz.

## Sonraki sürüm planı — başlatılmadı

İlk App Store güncellemesinde güvenli yaş politikası, 18+ yerine uygun alternatif,
UMP/ATT/NPA ve ayrıca reklam açma şartı olmadan uygun gösterim birlikte
incelenecek. Mevcut QA7 davranışı donduruldu; bu plan için yeni kod, branch,
PR veya build başlatılmadı. Bu belgedeki iki paket yalnız mevcut kaynak dağıtımıdır.

Resmî kapsam: [Apple internal-only dağıtımı](https://developer.apple.com/tutorials/develop-in-swift/test-your-beta-app).
Internal-only paket App Review/App Store dağıtımında kullanılamaz.
