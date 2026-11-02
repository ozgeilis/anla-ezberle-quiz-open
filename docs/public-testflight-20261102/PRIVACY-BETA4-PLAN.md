# Gizlilik metni ve Public TestFlight build4 — dar sonraki plan

**Hazır; yeni yayın/paket kabulü onayı bekliyor.** Bu belge kendi başına izin
vermez. Canlı silme-gizlilik düzeltmesi ve etkin native sosyal kabul tamamlandı;
sonraki engel web ve gömülü iOS politikasının doğru açıklamayı göstermesidir.

## 1. Yalnız politika PR #29 / web

https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/29

Main `91c1730` üzerinden tek dosya: `src/app/privacy.tsx`; commit
`b604e346f4379c13088b7e3a084cc9d5b96af60f`. Mevcut politika ve Android AdMob
metni korunur. Apple/Private Relay, şikâyet/engel, gerçek metin temizliği ve
kalan asgari denetim kayıtları, kapalı OAuth kayıtları ve iOS reklamsız beta
koşulları eklenir. TypeScript/lint/web export, gerçek yerel Chrome metni ve
PR'ın bütün GitHub/Vercel kontrolleri geçti. Gerçek Chrome'da Vercel Preview'in yeni tarih/başlıkları gösterdiği de doğrulandı. Hazır Vercel Preview:
https://anla-ezberle-quiz-git-docs-privacy-ios-saf-53d3a9-ozgeilis-6528.vercel.app/privacy

Ayrı onayla yalnız bu PR main'e alınır; mevcut Vercel web Production yayını
beklenir. Herkese açık `/privacy` HTTP/tarayıcı üzerinden tarih/yeni başlıklar ve
eski AdMob açıklamaları için tekrar doğrulanır. Bu, **App Store Production**
izni değildir. PR25/26/28 merge edilmez; Alpha, Auth, reklam ve SDK değişmez.

## 2. Yalnız yeni TestFlight adayı

Eski build2/internal ve build3/Ready to Submit korunur. Gömülü politika web
sayfası güncellenince kendiliğinden değişmez. Bu yüzden yeni build numarası4
kullanılır; eski numarayla farklı binary yüklenmez.

PR28'in runtime kaynağı `e118f7cbb578ccd4061a1564fa751c2096d320f2`.
Kabul edilmiş `4071a90074a594e9d80e02ab35d71bc63c2db551` ile runtime diff'i
**yalnız politika dosyasıdır**. Oyun/Auth/sosyal/native bağımlılıklar değişmez.
Gömülecek doğru native Hermes bundle SHA256:
`7c66a17df53a67980b6af1eeda6a9015b7a87296450a60663bafd1dd15ce4461`.

- `expo export:embed --dev false --bytecode` ile JS ve bütün native varlıklar
  birlikte üretildi. İlk OTA biçimli export native aday olarak reddedildi;
  onun bundle'ı veya eksik varlık kopyası kullanılmayacak. Doğru nihai hash
  yukarıdadır; kaynak varlık dosyalarının tümü QA kopyasında eşleşti.
- Yeni ayrı simulator QA kopyası aynı native compiled kodu kullanır. Karşılaştırma
  kopyalarından imzalar çıkarılınca native byte'lar eşleşti. Asıl arşivler,
  sertifikalar ve imzalı paketler değiştirilmedi veya silinmedi.
- Gerçek390pt iOS simülatöründe açılış, yeni tarih/başlıklar, Manrope ve geri
  ikonu görüldü. Tam sayfa kaydırmalı görsel kabul Device Hub otomasyonuyla
  doğrulanamadı; başarılı sayılmaz. Bu küçük metin değişikliği fiziksel
  iPhone'da veya TestFlight kurulumunda henüz test edilmedi.
- Kaynakların son halinde `pnpm check` tekrar430/430 geçti; TypeScript/lint ve
  soru bankası dahil. Mevcut canlı/native sosyal kabul önceki aynı işlevsel
  runtime ile geçti; yalnız bu metin güncellemesi o kontrolleri tekrar yapılmış
  gibi göstermez.

Ayrı insan kabulünden sonra, mevcut public-beta arşivinin **yeni ayrı kopyasına**
bu tam JS/varlıklar ve build4 yazılır; eski sertifika/Team/Bundle/provisioning
ile yerel App Store export yapılır. Tam Xcode native rebuild, yeni sertifika,
capability, ücretli EAS işlemi veya native bağımlılık değişikliği yok.
`publicBeta` kapısı yalnız bu exact kaynak/JS, grup1000 ve ads off için geçici
açılır, işlem sonunda tekrar false olur; tam mağaza kabulü false kalır.

Yeni IPA'da Bundle `com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP`, sürüm
0.1.0 /build4, prod APNs, Apple entitlement, debug=false ve no-ATT/ads off
kontrol edilir. IPA SHA256 kaydedilir. Sonra yalnız mevcut Connect uygulamasına
yüklenir; processing ve dış beta uygunluğu doğrulanır. Varsayılan/otomatik
Production yayın ayarlarına dokunulmaz.

Web politika ve paket doğrulaması geçince, kullanıcının daha önce verdiği
**Beta App Review** izniyle build4 Public Beta grubuna eklenir, doğru test
notları ve mevcut özel incelemeci hesabı ile harici beta incelemesine gönderilir.
Apple onayından sonra Public Link **Open to Anyone /1000** açılır ve gerçek
URL/erişim durumu doğrulanır. Bu aşamalar ayrı ayrı kaydedilir; yükleme veya
inceleme gönderimi testçilerin indirebildiği yayın olarak raporlanmaz.

## Kapsam dışı

App Store Production incelemesi/yayını, otomatik release ayarı, Android Alpha,
başka PR merge'leri, gerçek reklam/Analytics/genel push, Apple/Google provider
ve kayıt kısıtları, yeni hesap yaratma/silme, yeni sunucu değişikliği. Kamuya
katılım hesapsız oyunu açar; yeni Apple/Google kayıt hakkı vermez.
