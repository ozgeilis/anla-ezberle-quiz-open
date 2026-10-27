# Profil, geri gezinme ve içerik sayısı görünürlüğü

Referans: ürün sahibinin 27 Ekim 2026 tarihli tek ekranlık Profilim görseli.
Görsel yalnız tasarım referansıdır; örnek isimler, skorlar ve beş rozet uygulamaya
aktarılmadı. Onaylı cami/madalya/kategori/rozet/avatar dosyaları değişmedi.

## Veri kapsamı

- Beş kart **cihazdaki tamamlanan tek oyunculu kayıtları** kullanır; kapsam
  başlığın altında belirtilir. Çevrimiçi maçların tam cevap/tarih/skor geçmişi
  bu yerel modelde yoktur. Sosyal toplamlardan eksik istatistik türetilmez ve
  aynı maçı iki kaynaktan sayan bir birleştirme yapılmaz.
- Oynanan oyun ve toplam skor tamamlanan kayıtlardan, XP'den ayrı hesaplanır.
  Aynı kayıt ID'si iki kez gelirse tek sayılır; farklı ID'li gerçek tekrar
  turları oyundur, XP kuralları ayrıca mevcut sistem tarafından korunur.
- Doğruluk doğru / bütün cevaplar olarak hesaplanır. Cevapsızlar da paydada
  yer alır; sonuç ekranındaki başarı oranıyla uyumludur. Veri yoksa çizgi görünür.
- Favori kategori gerçek kayıtların kategori/konu sıklığına dayanır; veri yoksa
  “Henüz belirlenmedi”. Tarihsel kategori isimleri yeniden etiketlenmez.
- Günlük seri Europe/Istanbul takvim günlerinden oluşur. Aynı gün tek sayılır;
  dün biten seri bugün için korunur, araya boş gün girerse sıfırlanır.
- İlerleme/özet useMemo ile kayıt değişiminde hesaplanır. Takvim günü odak ve
  dakika aboneliğiyle yenilenir; sırf avatar/kimlik render'ında geçmiş taranmaz.
- Arkadaşlar mevcut yetkili friends API'sinden yalnız kabul edilen ilişkilerle
  gelir. Hesap kimliği ve iptal kontrolleri eski hesabın yanıtını göstermez.
  API'de güvenilir presence yoktur; aktiflik noktası veya zaman uydurulmaz.
- Vitrinde yalnız kazanılmış, benzersiz ve en fazla üç rozet vardır. Dokunma
  mevcut albümün detayını açar; yeni kalıcı ödül veya kazanım kuralı eklenmedi.

## Bileşen ve görünüm

PlayerIdentityCard, PlayerStatsGrid, StatCard/StatGlyph, BadgeShowcase,
FriendsPreview/useProfileFriends ayrı sorumluluklardır. Mevcut Manrope, tema,
avatarlar, BadgeArt, ProgressMeter ve güvenli sosyal API yeniden kullanılır.
Normal ölçekte üç + iki kart; büyük native fontScale'de tek sütun kullanılır.
320 dp için sayı ölçüsü/harf aralığı ayarlanır; soru/cevap dahil genel yazı
ölçeklemesi kapatılmaz. Onaylı sabit alt navigasyon dosyası değiştirilmez.

Page ortak başlığına geri kontrolü eklendi; doğrudan bağlantıda güvenli ana sayfa
fallback'i vardır. Profil, rozetler, sonuç ve bildirim detayına uygun geri
kontrolleri eklendi. Aktif canlı odadan çıkış mevcut onay/leave akışını kullanır.
Gizlilik metni kırpılmadı. Hesap silme ve push backend'i değiştirilmedi.

Banka/kategori havuz sayıları Home yardımından, kategori kartlarının metin ve
screen-reader etiketlerinden, hazırlıktan, eski kategori kartından, demo/online
havuz tanıtımlarından çıkarıldı. Oyun uzunluğu, aktif ilerleme, ödül kazanma
koşulları ve gerçek 1500 soruluk v72 verileri korunur.

## Test yöntemi ve yayın sınırları

- Unit: boş/gerçek formatlı geçmiş, skor-XP ayrımı, cevapsız oranı, kayıt ID'si
  tekrarı, İstanbul gün sınırı, seri kesintisi, vitrin üst sınırı/kilitli filtre.
- Gerçek Chromium: 320/360/390, açık/koyu; boş ve dolu geçmiş, uzun kimlik/kategori,
  üç rozetli ve boş vitrin, arkadaşlı ve boş liste, rozetten detay, doğrudan geri
  bağlantıları ve havuz tanıtımlarının yokluğu.
- Tarayıcı verileri scripts/profile-fixture.ts ile gerçek oyun motorundan üretilir;
  sosyal/Auth HTTP cevapları izole sentetik fixture'dır. Bunlar üretim hesapları
  değildir; üretimde demo istatistik açan bir flag/route eklenmedi.
- Mevcut settings-account, mobile-game-ui ve diğer CI regresyonları da çalıştırılır.
- TypeScript, lint, tüm testler, soru bütünlüğü, web ve Android/iOS export kontrolü.
- Fiziksel Android/iPhone ve işletim sistemi büyük yazı kabulü yapılmış sayılmaz.
  Native fontScale dalları ve yazı ölçekleme kodda korunur; gerçek cihaz kabulü
  kullanıcıyla ayrıca yapılmalıdır. Native paket veya kimlik değişikliği yoktur.
- Ürün sahibi testler geçince PR8/PR9/profil için main ve Vercel Production yayınına
  açık onay verdi. Canlı Supabase v72 aktivasyonu ve genel push bu onayda yoktur.
  Bu dosya üretime migration/seed/Edge dağıtım komutu değildir.
