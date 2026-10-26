# Mobil oyun arayüzü entegrasyonu — 26 Ekim 2026

## Kapsam ve yayın sınırı

Çalışma dalı: `integration/mobile-game-ui-20261026`. PR #2, #3, #6 ve #7'nin
birlikte kurulan `31928a4` kabul sürümü ve PR #7'nin `7c57ce8` güncellemesi
esas alındı. Ana dal ve Production için son kullanıcı onayı gerekir.

Supabase migration, hesap silme fonksiyonu, push izin listesi, genel push anahtarı,
üretim kayıtları veya Vercel alan adı bu arayüz çalışmasıyla değiştirilmez.
Kapalı push testi ve daha önceki fiziksel teslim kanıtları, yeni arayüzün cihaz
kabulü yerine kullanılamaz.

## Referans ve ortak sistem

Kullanıcının dört PNG tasarım panosu ve `README_TASARIM_OLCULERI.md` incelendi.
Referans paketi yayımlanan kaynaklara veya uygulama paketine eklenmedi.
Yazılı ölçüler, panolardaki örnek içerik ve farklılıkların önünde tutuldu.

- Manrope 400/500/**600**/700/800; başlık 28/34, sayfa 22/28, bölüm 18/24,
  kart 16/22, gövde 14/20, açıklama 12/17, etiket 11/15.
- Zümrüt, teal, krem ve koyu teal semantik renkleri merkezileştirildi.
  Açık temada ikincil metin `#586A7D`: hedef `#64748B` krem panel üzerinde AA
  kontrastını sağlamadığı için biraz koyulaştırıldı. Kontrast testi gevşetilmedi.
- Ortak buton, metin işlemi, kart, sayfa ve kaydırılabilir modal aynı UI
  modülünden sunulur. Eski büyük barrel dosyası sorumluluklara ayrıldı.
- Ana işlem 48 dp; kompakt işlem en az 44 dp; modal en fazla 380 dp,
  dış boşluk 16, iç boşluk 20, köşe 24. Büyük yazıda yükseklik büyüyebilir ve
  içerik kaydırılır. Sistem yazı ölçeği kapatılmadı.
- PR #6'nın sabit alt navigasyon dosyası değiştirilmedi.

## Ekranlar

- **Ana sayfa:** tek kompakt illüstrasyonlu hero, altın oyun başlatma,
  günlük/sosyal oyun erişimi ve küçük gerçek ilerleme özeti. Tekrarlanan katalog
  ve zorluk seçimi kaldırıldı.
- **Katalog/hazırlık:** tutarlı iki sütun, altı gerçek kategori sayısı toplamı
  1.500. Dokuz onaylı özel görsel korunur; hazırlanmamış havuzlar açılmaz.
  Kategori seçimi ayrı `/prepare` sayfasına gider. Eski bağlantılar bir kez
  tüketilir; sekmeye dönüş hazırlık ekranını tekrar açmaz. Sabit panel katalog
  içeriğini örtmez. Yalnız mevcut üç zorluk seçeneği gösterilir.
- **Quiz/sonuç:** kısa kartlar ve tipografi; aynı 10 saniye/otomatik ilerleme.
  Beş sonuç illüstrasyonu, gerçek puan/XP, inceleme, yeniden oynama ve ana sayfa.
  Paylaş/sıralama/meydan okuma yardımcı menüde korunur.
- **Gelen kutusu:** kompakt satırlar, gerçek okundu ve hata durumları.
  Arkadaşlık/davet ayrıntıları kısa modalda; profil ayrı ayrıntı görünümünde.
  Sürekli yenileme, tekrar açıklama ve açık profil formu kaldırıldı. İşlemler
  aynı sunucu ACK ve yetki kontrollerini kullanır.
- **Rozetler:** 82 gerçek başarı, tek koleksiyon, mobilde iki sütun,
  ayrıntı modalı ve en fazla üç rozet vitrini. Kilit/açılma/XP kuralları aynı.
- **Profil/sıralama/oda:** yinelenen kimlik ve istatistikler azaltıldı;
  gerçek veriler ve mevcut sosyal/oda servisleri korunur.
- **Ayarlar:** yedi ayrı detay sayfası; tema önizleme Kaydet olmadan kalıcı
  tercihi değiştirmez. Bildirimler gelen kutusuna değil tercihlere gider.
- **Açılış:** yazı tipleri ve yerel kayıtlar tek siyah Studio görünümünün
  arkasında yüklenir. İkinci marka yükleme bileşeni kullanılmaz; artık hiçbir
  bağlantısı kalmayan `BrandLoadingScreen.tsx` kaldırıldı. 1.700 ms stüdyo
  animasyonu, sessizlik ve arka plandan dönüş davranışı korundu.

## Veri ve varlık koruması

Birleşik temel `0320162` ile karşılaştırıldığında `assets/`, `src/content/`,
`src/domain/`, `src/storage/`, `supabase/` ve sabit alt navigasyon aynı kaldı.
Cami, altın madalya, kategori PNG'leri, avatarlar, uygulama ikonu ve ses dosyaları
üretilmedi, sıkıştırılmadı veya değiştirilmedi. Mevcut bağımsız kaynak denetimi
statüsü değiştirilmedi; kod testleri içerik doğruluğu onayı sayılmaz.

## Tekrarlanabilir kontroller

- `pnpm check`: soru bütünlüğü, TypeScript, sıfır uyarılı lint, **319/319 test**.
- `pnpm export:web:test`: gerçek mevcut public istemci yapılandırmasıyla web
  export ve 6 font/ikon dosyası için Vercel varlık manifesti.
- `node scripts/check-audio-config.mjs`: kalıcı Android kimliği, mikrofon ve
  arka plan ses yetkilerinin eklenmemesi.
- `scripts/settings-account-smoke.mjs`: 29 tarayıcı grubu; kimlik alanları,
  giriş/kayıt hata durumları, okundu ACK/idempotency, tema kayıt/iptal/başarısızlık.
- `scripts/mobile-game-ui-smoke.mjs`: 320/360/390/768, açık/koyu; tüm temel
  ekranlar, rozet ayrıntısı, sentetik iki oyunculu lobi, quiz ve yavaş font açılışı.
- `scripts/visual-categories-smoke.mjs`: sayılar, zorluk filtreleri, dokuz kapalı
  kategori, 18 kategori/zorluk uygunluk kontrolü, gerçek sorudan başlatma ve
  bozuk geçmişi silmeden güvenli durdurma.
- `scripts/result-experience-smoke.mjs`: beş gerçek 10 soruluk tur, 10/8/6/4/2
  sonuç, eski kayıtların aynı kalması, her sonuçta sekiz responsive/tema görünümü.
- `scripts/leaderboard-smoke.mjs`: sekiz fixture grubu, gerçek skor yazmadan.
- `scripts/audio-smoke.mjs`: kısa efektler, tik, sessiz tercih ve eski kayıtlar.

HTTP fixture testleri yalnız `example.invalid` sentetik kimlikleri ve yerel
bellekteki DTO'ları kullanır. Gerçek sunucu işlemleri, push teslimi veya fiziksel
iOS/Android kabulü olarak raporlanmaz. Ekran görüntüleri ve özel loglar Git dışında
saklanır; CI artefakt ömrü bir gündür. CI standart GitHub-hosted runner kullanır,
üretim sırlarına erişim eklenmez.

## Cihaz kabulü ve nihai onay

Samsung Galaxy A04 / Android 14 için yeni APK üzerinde ana sayfa, arkadaşlık
isteği, davet, gelen kutusu, oda, quiz, sonuç, rozet, profil ve ayarlar; normal,
%150 ve %200 yazı ölçeğinde açık/koyu tema ile kontrol edilmelidir. Önceki APK
kabulü bu sürüme aktarılmaz. Fiziksel iOS testi de ayrıca yapılmalıdır.

Bu belge cihaz kabulü veya Production yayını onayı değildir. Preview, APK,
commit/PR ve tamamlanan kontrol sonuçları teslim raporunda ayrıca belirtilir.
