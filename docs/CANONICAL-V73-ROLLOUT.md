# v73 etkinleştirme ve çevrimiçi geçiş

**30.10.2026 güncel durum:** PR #15 `3d14c9c` ile main'e alındı; Vercel
Production v73/1500 ve dört gerçek tarayıcı turu doğrulandı. Supabase erişimi
sağlandı; salt okunur ön kontrol tamamlandı. Hiçbir canlı migration/yükleme/switch
uygulanmadı. 10 saniyelik önkoşulda silme güvenliği regresyonu tespit edildi ve
izole testte düzeltildi. Hash'i değişen önkoşul ve ücretsiz planın yedek sınırı
için [güncel plan](CANONICAL-V73-PREFLIGHT-20261030.md) onayı beklenir.

Ürün sahibi 30.10.2026 tarihinde **“v73 aktif soru bankası olsun”** talimatını verdi.
Bu izin PR #12’nin `fa81d1c` kontrol noktasındaki 1.500 soruluk içeriğin yayımlanmasına
aittir. Bağımsız ilahiyat uzmanı kabulü yoktur; varmış gibi işaretlenmedi.

## Uygulama sürümü

- Yeni yerel karma, kategori, zorluk, günlük, antrenman ve demo oturumları `index.ts`
  üzerinden **BANK_VERSION=73** kullanır. Production kanalında 1.500 soru erişilebilir.
- `questions-v73.ts` tam, bağımsız ve ürün sahibinin izin verdiği aday hash’ine
  bağlı bir snapshot’tır; uygulama editoryal araçları veya raporları import etmez.
- `questions:check`, v71/v72’nin aynı kaldığını ve v73’ün izin verilen metinden
  yeniden üretildiğini denetler. Daha sonraki metin düzeltmesi yeni banka sürümü ister.
- V72 ve daha eski registry kayıtları saklanır. Yeni kayıt doğrulaması v73’ü aynı
  kategori/konu taksonomisiyle kabul eder; eski kayıtlar yeniden yazılmaz veya puanlanmaz.
- Onaylı 30 anlam sorusunun 29’u aynıdır; yalnız ayrıca onaylanan
  `quran-meaning-v72-024` v73’te içerik sürümü 73’tür. V72 sürümü 72 olarak kalır.
- İkonlar, ekran tasarımları, XP/rozet kuralları, Auth, hesap silme ve kapalı push
  sınırlamaları değiştirilmez. PR #13/#14’ün ayrı çalışmaları bu değişiklikle ezilmez.

İzin kaydı: `src/content/questions/releases/v73.json`.
İncelenen aday hash’i: `c789f2d0fe15960fdb6d156ecf43e52234a86fe96a1cc705c30d8edec1c64517`.
1.500 bireysel karar dosyasının hash’i:
`b8e8316298c83880521ec87bc2bf4fe9b1a17097bfbc8b5f4aae930647fb1a01`.
V72 dosya hash’i değişmez:
`d1dcd3e92f4d331d187fcbf4c3459a1837ef979413a743c0d3ec4a43d7023115`.

## Çevrimiçi dağıtım için somut plan

Uygulama dosyasını main’e almak sunucu dataset’ini kendiliğinden değiştirmez.
Son belgelenen 27.10.2026 salt okunur tespitte async `owner_approved_v13`, canlı oda
`bank-v41` kullanıyordu. Bunlar güncel durum olarak varsayılamaz: yeni salt okunur
preflight ve aşağıdaki üretim SQL kapsamının açık onayı olmadan işlem yapılmaz.

1. Frankfurt `mqyuihiobkomjfipxehj` üzerinde yalnız migration sürümleri, şema,
   fonksiyon hash’leri, dataset toplamları, switch değerleri ve RLS/ACL okunur.
   Kullanıcı, oturum, maç veya profil kayıtları dışarı aktarılmaz. Yönetilen geri
   yükleme imkânı doğrulanır; mevcut Auth/push/hesap silme fonksiyonları korunur.
2. Henüz uygulanmamış önkoşullar varsa canlı tanımlarla farkları tek tek incelenir:
   `20261021000600_live_recent_question_exclusion.sql`,
   `20261021000700_async_duel_recent_questions.sql`,
   `20261024000200_live_ten_second_questions.sql`,
   `20261027000100_canonical_bank_v72.sql`.
   Toplu `supabase db push` kullanılmaz. Yeni oda süresi 10 saniye olur; eski
   odaların kayıtlı 15 saniyesi korunur. Üretim önkoşulları bu izole testte mevcuttur.
3. Yeni `20261030000100_canonical_bank_v73.sql`, v72 desteğini koruyarak v73
   dataset izinlerini ve aynı doğrulayıcı/selector’ları genişletir. V73 onay satırı
   başlangıçta **false** kalır; migration yeni oyun switch’lerini değiştirmez.
4. İki özel aktarım, yalnız depo dışındaki 0700 dizinde 0600 dosyalar olarak üretilir:

   ```sh
   pnpm export:online-content --out /absolute/private/async-v73.private.sql
   pnpm exec tsx scripts/export-live-content.ts /absolute/private/live-v73.private.sql
   ```

   Cevap SQL’i Git’e, CI artifact’ına, web dizinine veya uygulama paketine konmaz.
   V72 ile ortak `(id, version)` satırları yeniden kullanılır. Aynı kimlikte farklı
   metin/anahtar varsa işlem durur; `UPDATE` ile eski içerik değiştirilmez.
5. Onaylı migration ve yalnız yeni dataset yüklemesi transaction ile uygulanır.
   1.500 üyelik/soru/anahtar, 264 aday havuzu, özel anahtar ACL/RLS ve async/live
   çapraz eşleşmesi doğrulanır. Mevcut dataset’ler ve maçlar silinmez.
6. İki yeni-oyun switch’i **yalnız ayrıca incelenen üretim planı onaylanınca** açılır:

   ```sql
   BEGIN;
   SET LOCAL lock_timeout='5s';
   UPDATE quiz_private.bank_release_approval
     SET content_approved=true WHERE dataset='bank-v73';
   SELECT quiz_private.validate_online_bank('bank-v73');
   SELECT quiz_private.live_validate_dataset('bank-v73');
   UPDATE quiz_private.online_content_config SET active_scope='bank-v73' WHERE singleton;
   UPDATE quiz_private.live_config SET dataset='bank-v73' WHERE singleton;
   COMMIT;
   ```

   `enabled`, erişim izin listesi, kayıt ve push bayrakları korunur. Buradaki
   `content_approved` ürün sahibinin içerik yayını iznidir, uzman sertifikası değildir.
7. Yalnız yetkili izole/staging sentetik hesaplarıyla Auth+Edge, davet, oda,
   sunucu puanı ve cevap gizliliği uçtan uca denenir. Üretimde geçici hesap
   oluşturma/silme de ayrıca açık test kapsamı gerektirir; gerçek kullanıcıya dokunulmaz.

Yeni migration SHA-256:
`09f228e1215788d6e2a3658df8447a4f5b1fbd935118e6ef35e9106fc55d95be`.
Önkoşulların tam hash ve önceki planı [v72 geçiş belgesinde](CANONICAL-V72-ROLLOUT.md).

## Risk ve geri dönüş

Temel riskler DDL kilitlenmesi, canlı fonksiyonların hazırlanan sürümden ayrışması,
aynı `(id,version)` için farklı içerik ve yetersiz konu/zorluk havuzlarıdır. Kısa
lock timeout, tam transaction, salt okunur çakışma kontrolü ve önce izole test gerekir.
İman/Ahlak zor havuzunda mevcut 7 bağımsız soru vardır; 10 soruluk zor tur açılmaz.
Onaysız yeni soru veya zorluk değişikliği yapılmaz. Teknik testler dinî doğruluk onayı değildir.

Geri dönüş yeni oyunların iki switch’ini preflight’ta kaydedilen eski değerlere
çevirir; v73 soruları veya anahtarları silinmez. Başlamış maçlar manifestindeki
dataset/versiyonla tamamlanır. Web için önceki doğrulanmış deployment yeniden
atanabilir. Kurulu APK’nın içindeki banka ayrıca yeni build/güncelleme gerektirir;
main veya Vercel yayını mevcut APK’nın JavaScript paketini kendiliğinden değiştirmez.

## Yapılan teknik kontroller

- 351 otomatik test, TypeScript, lint ve soru bütünlüğü geçti.
- Yeni karma/günlük/altı kategori turları gerçek motorla oynanıp kaydedildi ve
  tekrar açıldı; düzeltilen cevapların yeni/eskide ayrı çözülmesi doğrulandı.
- İzole yerel PostgreSQL: eski v13/v41 fixture’ları; v72 ve v73 ayrı staging;
  tekrar async yükleme; her iki banka için iki oyunculu sunucu puanı, davet,
  oda, 264 havuz, 10 saniye kuralı, timeout/review ve ACL/RLS kabulü geçti.
- V73’e geçişten sonra bekleyen v72 düellosu eski anahtarlarla 1000 puanla
  tamamlandı; v72 manifest/üyelik/anahtarları değişmedi. Testler rollback ile bitti.
- Gerçek Chromium’da 320/390 genişlik ve açık/koyu temada dört çevrimdışı v73
  turu tamamlandı; bankVersion=73 kayıtları ve yeniden yükleme doğrulandı.
- Production web build komutu, konu manifesti ve altı font varlığı kontrolü geçti.
  Android/iOS Hermes export geçti; bu yeni APK/IPA veya fiziksel cihaz kabulü değildir.
- Yerel Realtime fixture’ında partition olmadığı için broadcast uyarıları var;
  bu SQL kabulü yeni ağ push/Realtime teslimatı kabulü değildir.

Üretim şema kontrolü, üretim SQL uygulaması, fiziksel Android/iPhone kabulü ve
yeni APK kurulumu bu belgedeki yerel sonuçlarla tamamlanmış sayılmaz.
