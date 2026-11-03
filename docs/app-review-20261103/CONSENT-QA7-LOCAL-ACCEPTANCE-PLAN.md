# Google gizlilik seçenekleri ve geçiş reklamı — yerel QA7 kabul planı

3 Kasım 2026. Aşağıdaki dar plan sahibi tarafından ayrıca onaylandı.
**İmzalandı ve uygulama kaldırılmadan yerel build 7 olarak kuruldu.** QA6
dosyaları korunur; yeni kodun gerçek cihaz çalışma kabulü henüz bekler.

## İncelenebilir paket

- Kaynak: `7182bb635e24382285f95df0a1d5341c5aff7dc3` (PR #30).
- Hazır Hermes JS SHA256:
  `6a482eda16ae8fdf22bab7dc3d242e8948fa2206c50b2786f10c09ba030ea728`.
- Ayrı hazırlanan kopya: Git dışı
  `app-review-20261103/consent-qa7/AnlaEzberle.app`.
- Aynı native executable QA6 ile SHA256 olarak birebir; GMA 13.10.0,
  UMP 3.1.0, ATT, ikon, mevcut provisioning ve native bağımlılıklar korunur.
  Yalnız güncel JS/varlıklar ve kopyanın yerel build numarası 7 hazırlanır.
- Gömülü public client yapılandırması geçti; service-role veya özel anahtar
  istemciye konmadı. GMA/UMP/ATT/test-mode/App ID kontrolleri geçti.
- Yalnız Google test birimleri; runtime config'te gerçek yayıncı birimleri
  bulunmaz. Native/production reklam veya Analytics açılmaz.
- 33 hedefli reklam/izin/modal testi, TypeScript ve tam lint geçti. Önceki
  modal düzeltmesinde 39 oyun/sayaç/sonuç regresyonu geçti; son izin bildirimi
  değişikliğinde bu 39 test yeniden çalışmış gibi raporlanmaz.

## Değişiklik ve belirsizlik

QA6'da yeniden açma sonrasında da form açılmadı. Bu sorun kabul testinde açık.
Yeni kaynak manuel izin eyleminin oyun/arka plan/rota/yükleme/eşzamanlı işlem
korumasına neden takıldığını gösterir. Google formu gerekli görmezse bunu
gizler/açıklar; `NOT_REQUIRED` başarılı form gösterimi gibi kaydedilmez.
`UNKNOWN` hata olarak kalır. Rıza sıfırlanmaz veya kullanıcı adına verilmez.
Bu kaynak düzeltmesi, telefondaki kesin kök nedeni bulduğumuz anlamına gelmez.

Önceki commit'in iOS modal kapanış düzeltmesi de bu kopyadadır: tam ekran
reklam native `onDismiss` sonrasında çağrılır, eksik olayda reklam güvenli
şekilde atlanır. Sıklık, 18+, kayıtlı sonuç, skor/XP ve oyun korumaları gevşemez.

## İstenen dar yerel işlem

Mevcut Apple Development kimliği, Team `W7CRC43SHP` ve kalıcı Bundle ID
`com.kovynelstudio.anlaezberle` ile yalnız ayrı kopya yeniden imzalanır.
Yeni sertifika/anahtar/capability hazırlanmaz. Mevcut iPhone 11 uygulaması
silinmeden QA7'ye güncellenir. QA6 dosyaları ve kanıtları korunur; cihazdaki
uygulamanın kodu güncellenir, yerel ilerlemenin korunduğu ayrıca doğrulanır.
Onay kapısı yalnız bu yerel işlem için kullanılır; store bayrakları açılmaz.

## Gerçek cihaz kabulü

1. Açılış ve mevcut ilerleme. Google seçeneklerinin görünürlüğü ve durum metni.
2. Form gerektiğinde açılıp kapanması; sahibi seçtiği ret/geri alma sonrasında
   izin kararının yeniden okunması, uygun değilse banner'ın kapalı kalması.
3. Form gerekli değilse doğru açıklama. Bu sonuç UMP ret testi sayılmaz;
   EEA debug ayarının fiziksel cihazda çalıştığı ayrıca kanıtlanmadı.
4. Mevcut sıklık koşullarında tam ekran test reklamının gerçekten açılması,
   kapanması ve skor/XP değişmeden doğru gezinme. Şartlar sağlanmazsa reklam
   zorlanmaz; kaçırılmış kabul olarak kalır.
5. ATT-ret ve bağlantı hatasında gizlilik/oyun güvenliği. Önceden geçen QA6
   banner/offline sonuçları yeni kaynak için otomatik kabul sayılmaz.

**Kapsam dışı:** IPA/EAS build, Apple upload/TestFlight dağıtımı, main merge,
Vercel, Supabase/Auth, Android Alpha, App Privacy Publish, App Review ve
Production yayını. Gerçek gelir reklamlarına tıklama veya gösterim testi yok.

## Onay sonrasında doğrulanan işlem

Kaynak ve hazır JS hash'i yeniden karşılaştırıldı; runtime kaynağından sonraki
commit yalnız bu planı içeriyordu. Mevcut Development sertifikasının bu
provisioning içinde bulunduğu, Team/Bundle ID, süre ve mevcut cihaz kapsamı
salt okunur doğrulandı. Yeni sertifika/provisioning oluşturulmadı.

Development preflight yalnız bu sahibinin onayladığı yerel işlem için geçti;
onay dosyası `finally` ile birebir eski hâline döndü. Store/upload/review
bayrakları kapalıdır. `codesign --verify --deep --strict` geçti; entitlements
QA6 ile birebir eşit kaldı. Son JS hash'i de değişmedi.

`devicectl` kurulumu başarılı; ayrı kurulum sonrası uygulama sorgusunda kalıcı
Bundle ID ve `bundleVersion=7` doğrulandı. Uygulama kaldırılmadı. Kurulum,
profil verilerinin görsel kabulü veya gerçek formun açıldığı anlamına gelmez;
sahibinden açılış/ilerleme ve Gizlilik → izin hazırlama sonrası yeni durum
mesajı istendi. Yeni IPA, upload veya dağıtım yapılmadı.

Gizli yerel imzalama/cihaz logları Git'e konmadı. Kişisel cihaz envanteri,
provisioning, kimlik bilgileri ve anahtarlar rapora eklenmedi.

## İlk gerçek çalışma sonucu

Yeni fiziksel Gizlilik ekranı görüldü; “Gizlilik kontrolleri tamamlandı”
yazısı ve SDK gerektirmediği için yeniden açma düğmesinin bulunmaması
doğrulandı. Sahibi hazırlama düğmesine bastıktan sonra ekranın aynı kaldığını
bildirdi. Bu sonuç UMP geri alma/ret testi olarak kabul edilmedi.

Sıklık koşulları uygulama açıkken beklendikten sonra sahibi tur sonunda tam
ekran test reklamının açıldığını ve kapatınca ana sayfaya döndüğünü bildirdi.
**Gerçek iPhone test reklamı sunumu/kapatma/gezinme geçti.** Reklam sırasında
fotoğraf alınmadı; kanıt sahibinin gözlemidir. Ayrı skor/XP karşılaştırması,
izin geri alma, yeni QA7 ATT-ret/offline kabulü bu sonucun kapsamı değildir.

Mevcut iPhone 16 simülatöründe ayrı native GMA/UMP/ATT Release kopyası daha
sonra başarıyla derlendi (yalnız arm64, yeni runtime/IPA yok). Aynı QA7 JS ile
gerçek Google Avrupa formu açıldı, kabul sonrası ayrı ATT reddedildi; Google
gizlilik düğmesi formu yeniden açtı. “İzin vermeyin” ile uygulama reklamları
kapalı gösterdi ve yerel sorular çalıştı. Bu, **simülatör** kabulüdür; fiziksel
GDPR ret testiyle karıştırılmaz. [Tam yöntem, ekran yolları ve sınırlar](QA6-PRIVACY-RECONCILIATION.md).
