# Google gizlilik seçenekleri ve geçiş reklamı — yerel QA7 kabul planı

3 Kasım 2026. **Henüz imzalanmadı veya kurulmadı.** QA6 telefonda korunur.

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
