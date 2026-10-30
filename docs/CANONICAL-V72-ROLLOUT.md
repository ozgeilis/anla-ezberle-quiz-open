# v72: ortak soru bankası ve onay bekleyen sunucu geçişi

Durum: teknik hazırlık; **canlıya alınmadı**. Entegrasyon tabanı PR #8 / `aea1f8f`.
1.500 sorunun bağımsız dinî/içerik denetimi devam ediyor. Kodda `approved` ve kaynak
bağlantısı bulunması bu denetimin tamamlandığı anlamına gelmez. İçerik kayıtları,
kaynaklar, açıklamalar ve cevaplar bu çalışmada değiştirilmedi.

## 27 Ekim 2026 salt-okunur üretim tespiti

Frankfurt `mqyuihiobkomjfipxehj` üzerinde `BEGIN READ ONLY` içindeki Management API
sorguları yalnız içerik/config toplamlarını, migration sürümlerini, fonksiyon
parmak izlerini ve ACL/RLS metaverisini okudu. Kullanıcı veya maç verisi alınmadı.

| Akış | Önceki gerçek kaynak | Bu PR sonrası hazırlanan yeni kaynak |
|---|---|---|
| Yerel karma, kategori, kolay/orta/zor, günlük | index → questions-v72.ts, 1500 | Aynı v72; seçim/puan kuralları değişmedi |
| Yerel antrenman ve demo | createSession → v72 | Aynı v72; ikinci bir havuz yok |
| Yeni asenkron düello ve kabul edilen arkadaş daveti | Canlı active_scope=owner_approved_v13, 500 | bank-v72 üyeliği, 1500; dağıtım/onay bekliyor |
| Yeni canlı oda, oda sahibinin başlatması | Canlı dataset=bank-v41, enabled=true, 600 | bank-v72, 1500; dağıtım/onay bekliyor |
| Bekleyen/başlamış/bitmiş eski maç ve oda | Kayıtlı scope/dataset + değişmez manifest | Aynı eski kaynak; sonradan yeniden etiketlenmez |

Canlıda v72 henüz yok. Yedi içerik/config tablosunda RLS+FORCE RLS açık;
`anon` ve `authenticated` doğrudan SELECT izni yok.
Migration geçmişi `20261021000600`, `20261021000700`, `20261024000200` içermiyor.
Ek şema denetimi iki recent selector fonksiyonunun ve `answer_seconds` sütununun
**gerçekten bulunmadığını** doğruladı; yalnız geçmiş kaydı eksikliği değil.
Dolayısıyla üretimdeki odaların mevcut 15 saniye kuralı bu PR ile değişmez.
Önceden hazırlanan 10 saniyelik oda kuralının dağıtımı aşağıdaki açık onaya tabidir.

## Mimari ve tarihsel uyumluluk

- Aktif yerel kaynak `questions-v72.ts`; özel aktarım araçları aynı `index.ts`
  üzerinden bu kaynağa gider. v13/v41 aktif aktarım importları kaldırıldı.
- Canlı aktarım güncel v3 konu eşleştirmesini kullanır. İki aktarım ortak bütünlük
  kapısından geçer; değişmiş veya v71 olan 1500 kayıt bile yeni v72 diye üretilmez.
- `online_bank_members` yalnız sunucuda, sürümlü üyelik ve tam orijinal Question
  metaverisini tutar. Yeni soru kopyası/oyun deposu değildir. Eski `(id,version)`
  soru/anahtar satırları aynıysa yeniden kullanılır, scope alanları değiştirilmez.
  Bu nedenle yalnız `quiz_questions.content_scope` saymak v72 üyeliğini ölçmez.
- Eski async protokolündeki a/b/c/d seçenek kimlikleri korunur; orijinal o1/o2…
  kimlikleri ve kaynakların tamamı özel metaveride aynen tutulur. SQL doğrulayıcı
  seçenek metni, sıra ve doğru cevabın iki gösterimde birebir eşleşmesini denetler.
- Canlı soru JSON'u yalnız id/version/prompt/options içerir. Cevap/açıklama/kaynak
  anahtar tablosunda kalır. Async cevaplar iki oyuncu tamamlamadan, canlı cevaplar
  reveal aşamasından önce API yanıtına girmez. İstemci puan iddiası kullanılmaz.
- Tek oyunculu çevrimdışı banka doğal olarak yerel cevapları içerir; bu, çevrimiçi
  özel anahtar API'lerinin açılması anlamına gelmez. Üretilen SQL Git'e girmez.
- Yeni async seçici v72'de tur içi kavram çakışmalarını önler; mevcut son beş maçlık
  ID rotasyonunu korur. Eski scope'ların eski seçicisi tarihsel uyumluluk içindir.
- Eski v1–v71 snapshot/modülleri, questions-1500.ts, eski SQL migration/seed ve
  test fixture'ları korundu. Registry, generator ve tarihsel test bağımlılıkları
  mevcut. **Silinen banka dosyası yok**; kör arşiv temizliği yapılmadı.
- 30 yeni anlam/kavrama sorusu her iki çıktıda var; emekli e150-quran-001…030
  yeni üyelikte yok, eski sürümlerle okunabilir. Toplam hâlâ tam 1500.

## Havuz yeterliliği

11 konu (karma dahil) × 8 mevcut seviye × 3 soru sayısı = 264 kombinasyon.
225 kombinasyon bağımsız 5/10/15 soruluk tur verebiliyor; **39 kombinasyon yetersiz**.
Örneğin Kur'an / zor / 10 ve 15. Bunlar boş feasibility witness ile kullanılamaz
kalır; başka konu/zorluktan doldurulmaz. Mevcut seviye ve soru sayısı kuralları
korunmuştur. Her kombinasyonun adayları tam uygun konu/zorluk üyeliğiyle test edilir.
Özel/çocuk kategorilerinin hazırlık ve oynanabilirlik durumları değiştirilmedi.

## İncelenecek TAM SQL ve üretim önkoşulları

Bu dosya bir otomatik dağıtım talimatı değildir. Aşağıdaki adımların tamamı ayrı
onay, tamamlanmış bağımsız içerik incelemesi ve güncel yedek/erişim kontrolü bekler.
Hiçbir `supabase db push` veya fonksiyon dağıtımı bu görevde çalıştırılmadı.

1. Salt-okunur preflight'ı tekrar yap: canlı eski scope/dataset değerlerini, fonksiyon
   tanımlarını/hash'lerini, RLS/ACL ve mevcut migration geçmişini özel dizine kaydet.
   Yönetilen yedek/PITR erişimini doğrula. Kullanıcı/oturum satırlarını dışarı aktarma.
2. Önceden hazırlanan ve henüz canlıda olmayan SQL'leri ayrı ayrı incele/onaylat:
   - `supabase/migrations/20261021000600_live_recent_question_exclusion.sql`
   - `supabase/migrations/20261021000700_async_duel_recent_questions.sql`
   - `supabase/migrations/20261024000200_live_ten_second_questions.sql`
   Bunlar mevcut public command fonksiyonlarını yeniler. Güncel canlı tanımlarla
   farkı tekrar incele; canlıda sonradan yapılan bir düzeltmeyi ezme. Son dosya
   eski odaları 15 saniyede sabitler, yalnız yeni odalarda 10 saniye varsayar.
   Genel toplu migration push kullanma; ilgisiz değişiklik uygulama.
3. Yeni TAM şema SQL'i: `supabase/migrations/20261027000100_canonical_bank_v72.sql`.
   Üyelik, RLS/ACL, immutability, 1500 doğrulayıcıları ve içerik-onay kapılarını
   ekler. Eski maç/puan/XP satırlarına UPDATE/DELETE yapmaz, iki switch'i açmaz.
4. Yetkili operatör, sadece depo dışındaki 0700 dizinde 0600 özel SQL üretir:
   ```sh
   pnpm export:online-content --out /absolute/private/path/async-v72.private.sql
   pnpm exec tsx scripts/export-live-content.ts /absolute/private/path/live-v72.private.sql
   ```
   Bunlar veri/cevap içerir; Git, web, uygulama paketi, CI artifact veya rapora
   eklenmez. Aynı id/version farklı metin/anahtarla karşılaşırsa aktarım durur;
   eski kaydı değiştirmek veya soru sürümünü keyfî artırmak çözüm değildir.
5. Onaylanan özel async yüklemesini, sonra live yüklemesini transaction içinde
   uygula. `validate_online_bank('bank-v72')`, `live_validate_dataset('bank-v72')`
   ve çapraz eşleşmeyi doğrula. Eski dataset'leri silme. Switch'ler hâlâ eskidir.
6. Yetkili staging/izole ortamda yalnız sentetik hesaplarla Auth+Edge+oyun uçtan
   uca testi yap; burada PostgreSQL sunucu akışları test edildi, fiziksel cihaz
   veya yeni canlı Edge teslimatı yapılmadı. Üretimde test hesabı oluşturma/silme
   de bu görev kapsamında yetkilendirilmiş değildir.
7. Bağımsız içerik onayı ve son teknik kabul alındığında, ONAYLANMIŞ bakım
   penceresinde yalnız aşağıdaki transaction ile iki yeni-oyun switch'ini değiştir:
   ```sql
   BEGIN;
   SET LOCAL lock_timeout='5s';
   UPDATE quiz_private.bank_release_approval
     SET content_approved=true WHERE dataset='bank-v72';
   SELECT quiz_private.validate_online_bank('bank-v72');
   SELECT quiz_private.live_validate_dataset('bank-v72');
   UPDATE quiz_private.online_content_config SET active_scope='bank-v72' WHERE singleton;
   UPDATE quiz_private.live_config SET dataset='bank-v72' WHERE singleton;
   COMMIT;
   ```
   `enabled` mevcut durumunu korur; bu SQL genel push, kullanıcı erişimi veya
   içerik inceleme durumlarını değiştirmez. Canlı/client flag açma gerekmiyor.
8. Yeni iki kontrollü maç ve bir oda ile yeni dataset, sunucu puanı, gizli cevap,
   tekrar önleme ve eski maç görüntüleme kontrolü yapılmadan genel kabul verme.
   Bu testlerin canlı sentetik hesap kapsamı ayrıca onaylanmalıdır.

### Risk ve geri dönüş

DDL kilitlenmesi, eski satır/version çakışması ve yetersiz havuzlar temel risklerdir.
Migration önce staging'de denenmeli; kısa lock_timeout ve transaction kullanılmalı.
İçerik onayı yanlışlıkla verilirse teknik testler dinî doğruluğu garanti etmez.

Ön kontrolde değerler hâlâ v13/v41 ise yeni oyunlar için geri dönüş TAM SQL'i:
```sql
BEGIN;
SET LOCAL lock_timeout='5s';
UPDATE quiz_private.online_content_config SET active_scope='owner_approved_v13' WHERE singleton;
UPDATE quiz_private.live_config SET dataset='bank-v41' WHERE singleton;
UPDATE quiz_private.bank_release_approval SET content_approved=false WHERE dataset='bank-v72';
COMMIT;
```
Gerçek preflight farklı değer gösterirse bu sabitleri o onaylı snapshot ile değiştir.
Yeni/eskiden başlamış maçlar kendi dataset'leriyle tamamlanır. v72 satırlarını,
anahtarlarını veya migration'ı aşağı alma/silme; bunu yapmak geçmişi bozar.

## Kabul ve sınırlar

- `pnpm check`: soru üretim bütünlüğü, TypeScript, lint ve 325 otomatik test.
- İzole, şema-only yerel PostgreSQL: geçmiş v13/v41 fixture'ları, v72 stage,
  tekrar yükleme, eski manifest/ledger/key korunması, içerik onayı olmadan iki
  switch'in reddi, 264 kombinasyon, iki oyunculu async puan/review, arkadaş daveti,
  canlı oda hazır/başlat/cevap/timeout/review, rollback ve ACL kontrolleri.
- Var olan async/live tekrar önleme ve 10 saniye/tarihsel 15 saniye SQL testleri.
- İzole kopyada Realtime mesaj partition'ı olmadığından broadcast uyarıları var:
  SQL davranışı geçti; bu çalışma yeni Realtime ağ teslimi kabulü değildir.
- Gerçek Chromium: 320/390 genişlik, açık/koyu temada dört çevrimdışı 10 soruluk
  tur tamamlandı; v72 kayıtları ve yeniden açma doğrulandı.
- Web production-channel export ve Android/iOS Hermes export: uyum kontrolü.
  Yeni APK/IPA kurulmadı; fiziksel Android/iPhone kabulü yapıldığı iddia edilmez.
- Bu PR yalnız Preview'de denenir. Main, Vercel Production, canlı Supabase
  içerikleri, hesap silme, genel push ve kullanıcı kayıtları değiştirilmedi.

## Onaylanacak SQL dosyalarının SHA-256 değerleri

- `20261021000600_live_recent_question_exclusion.sql`: `6daabfd2b0cc4127cdedbddecf4ee6b2b3732b02b43c39bb8a6d9bf29ec5d31a`
- `20261021000700_async_duel_recent_questions.sql`: `447d1299110d06680f7d866c63b0b6bdee1605f5f0779cc845743a7cfbd019d1`
- `20261024000200_live_ten_second_questions.sql`: `a18d6ef12019f1d622d8962112cb5fa375dba84024b65e97477365857e77f15a`
- `20261027000100_canonical_bank_v72.sql`: `db673ca0f74804898f3491e1e17e70864a9a8d36b144ddaf8e1880341cc06d23`

30.10.2026 düzeltmesi: henüz dağıtılmamış 10 saniye önkoşulunun önceki hash'i
`bee9d6942553a5bb991dc08412bf2a34f4bed311645cdfed15abb9fde88f9160` idi.
Bu sürüm canlı oda silme istisnasını gereğinden fazla genişletiyordu. Yeni dosya
mevcut dar istisnayı aynen korur; üretim kapsamındaki bu fark için ayrı onay beklenir.
Güncel [v73 ön kontrolü ve değişen plan](CANONICAL-V73-PREFLIGHT-20261030.md).
