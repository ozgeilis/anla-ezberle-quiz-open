# Public TestFlight — 2 Kasım 2026

Son ürün sahibi talimatı önceki mağaza dağıtım kapsamını daraltır: yalnız iOS
harici beta / Beta App Review / onaydan sonra Open to Anyone linki ve1000 kişi.
App Store Production gönderimi/yayını, otomatik yayın ayarı ve Android Alpha
değişikliği yapılmaz. Genel kayıt veya moderatör yetkisi bu izinle açılmaz.

## Gerçek Connect kontrolü

Tek mevcut build0.1.0(2), **Internal / Ready to Test**. Yeni harici grubun
Add Builds penceresi **No builds available** gösteriyor. Apple'ın resmi belgesi
Internal Only build'leri yalnız iç gruplara izinli sayıyor. Eski build/arşiv ve
kanıtlar korunur; onu dış build olarak etiketlemek veya tekrar yüklemek çözüm
değildir. Yeni numaralı, Internal Only işaretlenmemiş bir aday zorunludur.

- Önkoşul iç grup: Anla & Ezberle Internal QA, otomatik dağıtım kapalı.
- İstenen dış grup: Anla & Ezberle Public Beta.0 tester/0 build; henüz davet yok.
- Bağlantı yalnız uygun build ve Beta App Review kabulünden sonra oluşturulacak;
  Open to Anyone /1000 limit. İsimle App Store araması TestFlight keşif yöntemi
  değildir; gerçek App Store yayını bu talimatın dışındadır.

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

Oyuncu güvenliği kodu ve izole SQL/HTTP kabulü mevcut; hosted safety flag kapalı,
moderatör sayısı0. Sahip şikâyetleri günlük kontrol edeceğini doğruladı. Günlük
işletim/gerçek yetkili moderatör ve native sosyal kabul kapanmadan güvenli public
sosyal dağıtım tamamlandı denmez. Kayıt, provider veya yetki değişikliği gerekirse
exact actor/kapsam ve geri dönüşle ayrı onay istenir. RLS/hook kaldırılmaz.

## Resmi kaynaklar

- [Apple — dış test / Internal Only / Public Link](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers)
- [Apple — TestFlight genel akış](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview/)
- [Apple — App Review kuralları:1.2,4.8,5.1.1](https://developer.apple.com/app-store/review/guidelines/)
- [Apple — Private Relay kaynak doğrulaması](https://developer.apple.com/help/account/capabilities/configure-private-email-relay-service/)

Kaynaklar2 Kasım2026 tarihinde okundu. İnceleme sonucu Apple'a aittir; uygunluk
denetimi kesin kabul garantisi değildir. Fiili durum [state.json](state.json).
