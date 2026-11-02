# Public TestFlight — 2 Kasım 2026

Son ürün sahibi talimatı önceki mağaza dağıtım kapsamını daraltır: yalnız iOS
harici beta / Beta App Review / onaydan sonra Open to Anyone linki ve1000 kişi.
App Store Production gönderimi/yayını, otomatik yayın ayarı ve Android Alpha
değişikliği yapılmaz. Genel kayıt veya moderatör yetkisi bu izinle açılmaz.

## Gerçek Connect kontrolü

İlk kontrolde tek build 0.1.0 (2), **Internal / Ready to Test** idi. Harici grubun
Add Builds penceresi **No builds available** gösterdi. Apple'ın resmi belgesi
Internal Only build'leri yalnız iç gruplara izinli sayıyor. Eski build/arşiv ve
kanıtlar korunur; onu dış build olarak etiketlemek veya tekrar yüklemek çözüm
değildir. Yeni numaralı, Internal Only işaretlenmemiş bir aday zorunludur.

- Önkoşul iç grup: Anla & Ezberle Internal QA, otomatik dağıtım kapalı.
- İstenen dış grup: Anla & Ezberle Public Beta. 0 tester/0 build; henüz davet yok.
- Yeni 0.1.0 (3) yüklendi ve Connect'te **Ready to Submit** doğrulandı; aşağıda.
- Bağlantı yalnız uygun build ve Beta App Review kabulünden sonra oluşturulacak;
  Open to Anyone /1000 limit. İsimle App Store araması TestFlight keşif yöntemi
değildir; gerçek App Store yayını bu talimatın dışındadır.

## Üretilen ve yüklenen build 3

Mevcut arşivin ayrı kopyası ve tam fiziksel kabulü yapılmış JS/varlıkları
kullanıldı; gereksiz native yeniden derleme yapılmadı. Runtime kaynakları
`4071a90` kabulü ile aynı; yeni entegrasyonda runtime diff'i boş. Kaynak
`26a51d2`, JS SHA256 `3d7b11b37e53de1cb332294051b03be1ca8b7fabcba0d26b5103e5c9e21852c4`.

- Build 3, `com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP`.
- Distribution imzası, App Store provisioning ve gerekli entitlement/config
  doğrulaması geçti; Internal Only false. Eski build 2 değiştirilmedi.
- Yerel IPA: 30.373.722 byte, SHA256
  `de4e66411a19456b5cf1ff9a4cdca82aab4de495f480d666f14d929dbaaee0dd`.
- Xcode 2 Kasım 14:27:24 +03:00 **Upload succeeded / EXPORT SUCCEEDED**.
- Connect yükleme tarihi 2 Kasım 14:28; build ID
  `fa9e47a8-60fe-4ef4-a0dc-0e8bea209d07`, **Ready to Submit**.
- React, ReactNativeDependencies ve Hermes vendor dSYM eksiklikleri uyarı
  verdi; upload başarılı. Native crash sembol çözümleme kapsamı sınırlıdır.
- Paket hazırlığında 428/428, yerel moderatör aracı eklendikten sonra 430/430
  otomatik kontrol geçti (TypeScript, lint, banka ve regresyonlar dahil).
- Beta iletişim alanlarını sahibi girdi; açıklama ve açıkça taslak inceleme
  notları kaydedildi. Özel iletişim bilgileri depoya alınmadı.

Harici grubun build seçimi 3'ü gösteriyor. Next adımı online özellikler için
**Sign-in required / User Name / Password** istiyor. Mevcut incelemeci hesabının
bu özel Apple alanına aktarımı ve canlı moderasyon kabulü ilk aşamada tamamlanmadığı için
ilk akış Cancel ile bırakıldı. Sahip ardından mevcut incelemeci giriş bilgilerinin
yalnız Apple'ın özel alanına aktarımını onayladı; bilgiler kaydedildi ve mevcut
hesapla gerçek parola girişi/same-actor kontrolü geçti, bu kontrol oturumu yerel
olarak kapatıldı. Bilgiler depoya veya herkese açık metne yazılmadı.
Build gruba bağlanmış, incelemeye gönderilmiş veya
testçilere sunulmuş değildir. [Kalan dar plan](EXTERNAL-BETA-ACCEPTANCE-PLAN.md).

## Yeni adayın dar paket planı

PR25+PR26 ve güncel main'in sezonluk düzeltmesi ayrı entegrasyon worktree'sinde
korundu. Main değiştirilmez. Mevcut native bağımlılıklar/kimlik/capability aynıdır;
PR26 değişiklikleri JS ve sunucu katmanındadır. Gereksiz native derleme yerine
korunan arşivin **ayrı kopyasına** kabul edilmiş güncel Hermes JS/varlıkları
eklenir, iOS build3 kullanılır, mevcut Development imzası ile arşiv doğrulanır
ve mevcut Distribution certificate/App Store provisioning ile dış beta IPA
export edilir. Orijinal arşiv/IPA, sertifika ve provisioning korunur.

`config/ios-public-beta-export.json` yalnız bu aday için InternalOnly=false
taşır; eski internal-only export seçeneği değiştirilmez. Ayrı publicBeta kapısı
exact source SHA, Team/Bundle/Connect, kabul JS hash'i, ads off, grup/1000 limit
ve Production=false doğrular. İzin paket işlemi sırasında açılıp kapatılır;
`approved`/tam mağaza kabulü yapılmış gibi true yazılmaz. Aday hazırlama/yükleme
Beta Review gönderimi veya testçilere fiilen dağıtım olarak raporlanmaz.

## Giriş ve güvenlik

Public TestFlight katılımcıları hesap açmadan yerel quiz/kategori/günlük yarışma,
XP/rozet/profil/tema akışlarını kullanabilir. Genel e-posta kayıt kabiliyeti
sunucuda true; Apple provider ve Apple signup kapalı, Google OAuth mevcut fakat
yeni Google signup kapalı ve izin listeleri boş. TestFlight linki bu politikaları
değiştirmez. Yeni Apple/Google hesaplarının çevrimiçi erişimi çalışıyor denmez.

Fiziksel iPhone'da ayrı onaylı tek Apple test hesabı login/kalıcılık/iptal/yeniden
giriş/silme/revocation kabulünü geçti; hesap temizlendi ve geçici bayraklar
yeniden kapatıldı. Bu, genel kaydı açma izni değildir.

### 2 Kasım: gerçek işletim kabulü ve yeni gizlilik engeli

Sahibin tek kalıcı işletim hesabı doğrulandı. Önceki ayrı plan onayıyla rol
verildi; sahibi gerçek konsola giriş yaptı. Mevcut iki sentetik incelemeciyle
rapor, duplicate idempotency, yetkisiz kuyruk reddi, engelleme ve karşılıklı
istek/davet reddi geçti. Sahibiyle konsolda rapor görünümü ve audit'li
kısıtlama/geri alma çalıştı. Uygunsuz profil adı reddi de doğrulandı.
Sentetik arkadaşlık ve bekleyen davet normal aksiyonlarla işlevsel olarak geri
kondu; orijinal satır UUID/zamanı aynen geri konmuş sayılmaz.

Ek hesap silme denetiminde şikâyet/audit kişisel metninin FK NULL olduktan sonra
kaldığı **gerçek bir eksik** bulundu ve izole DB'de tekrar üretildi. Bu nedenle
onaylı geri dönüş uygulandı: **safety=false, aktif moderatör=0**; sahibin hesabı,
pasif rol ve audit korundu. Konsol ve test oturumları kapatıldı. Maç/skor/oda/
ödül ve test çiftinin dışındaki arkadaşlık hash'leri değişmedi.

Sahip yeni dar planı ayrıca onayladı. Exact ileri migration canlıda
`20261102143955` olarak uygulandı; fonksiyon MD5'i izole kaynakla eşleşti,
trigger etkin, anon/authenticated/service_role execute izinleri kapalı. Eski
hesap silme fonksiyonu aynı kaldı. Eski FK'si silinmiş rapor/audit sayısı
uygulama öncesi sıfırdı. Yeni canlı hesap silme testi yapılmadı; yerel gerçek
GoTrue HTTP ve SQL kanıtı ile canlı kaynak doğrulaması ayrı raporlanır.

Sahibi tekrar gerçek konsol girişi yaptı. Exact owner rolü ve safety bayrağı
onaylı sırayla yeniden açıldı. iOS390 simülatöründe gerçek native formdan
sentetik rapor gönderildi ve canlı DB/konsolda bulundu. Native engelleme ve
engeli kaldırma, karşı oyuncunun sunucuda istek/davet reddi, sahibiyle audit'li
kısıtlama ve geri alma geçti. Açık/koyu tema görüntüleri incelendi. İki sentetik
hesabın arkadaşlığı ve bekleyen daveti normal aksiyonlarla işlevsel geri kondu;
engel/kısıtlama ve açık rapor kalmadı. Native/API/konsol kabul oturumları kapandı.
Maç/skor/oda/ödül ve test dışı arkadaşlık hash'leri aynı. Güvenlik advisor grupları
değişmedi; sızdırılmış parola korumasının mevcut kapalı durumu değiştirilmedi.

[Kesin canlı sonuç](hosted-erasure-final-result.json),
[iOS ekran kabulü](IOS-SIMULATOR-ACCEPTANCE.md),
[yerel moderatör aracı](MODERATOR-CONSOLE.md).

Gizlilik metni **ayrı PR #29** olarak hazır: yalnız mevcut metne Apple,
şikâyet/veri temizliği, kapalı kayıt ve iOS reklamsız beta açıklamaları ekler.
TypeScript/lint/web export ve gerçek yerel Chrome önizlemesi geçti. Main/Vercel
onayı henüz yok. Build3'ün gömülü metni eski kalır; bu bir web yayınıyla kendiliğinden
değişmez. Yeni numaralı iOS adayının metin eşitliği ve ayrı paket kabulü hazırlanır.
Beta App Review henüz gönderilmedi; gerçek Public Link yoktur.

## Resmi kaynaklar

- [Apple — dış test / Internal Only / Public Link](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers)
- [Apple — TestFlight genel akış](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)
- [Apple — App Review kuralları:1.2,4.8,5.1.1](https://developer.apple.com/app-store/review/guidelines/)
- [Apple — Private Relay kaynak doğrulaması](https://developer.apple.com/help/account/capabilities/configure-private-email-relay-service/)

Kaynaklar2 Kasım2026 tarihinde okundu. İnceleme sonucu Apple'a aittir; uygunluk
denetimi kesin kabul garantisi değildir. Fiili durum [state.json](state.json).

## Politika eşitliği için hazırlanan build4

PR29'un yalnız politika metni PR28'e de alındı. Runtime kaynak commit'i e118f7c;
onaylı işlevsel runtime'a göre tek değişen dosya `src/app/privacy.tsx`.
Son kaynaklarla `pnpm check`430/430 tekrar geçti. Doğru native `export:embed`
JS+varlıkları ve ayrı simulator QA kopyası hazır; eski arşivler/IPA'lar korunur.

Nihai Hermes SHA256 `7c66a17df53a67980b6af1eeda6a9015b7a87296450a60663bafd1dd15ce4461`.
Gerçek iOS390 ekranında yeni tarih/başlıklar, Manrope ve geri ikonu doğrulandı.
Tam kaydırmalı sayfa kabulü araçla doğrulanamadı; fiziksel yeni politika ve
TestFlight kurulumu yapılmadı. Hatalı OTA biçimli ilk hazırlık aday kabul
edilmedi; doğru native export ve tam varlıklar kullanılacak.

[Yeni dar web/paket planı](PRIVACY-BETA4-PLAN.md) ayrı onay bekliyor.
PR29 Vercel Preview gerçek Chrome'da güncel metni gösteriyor; public Production
URL henüz güncellenmedi. Build4 App Store IPA'sı üretilmedi/yüklenmedi.
