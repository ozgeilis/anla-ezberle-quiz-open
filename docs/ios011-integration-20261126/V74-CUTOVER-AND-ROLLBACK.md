# v74 kontrollü geçiş ve geri dönüş — hazırlanmıştır, uygulanmadı

Bu belge canlı işlem izni değildir. İzole SQL kabulü GitHub run 45794437930
(job 139821360828) üzerinde geçti. Migration/test/export/snapshot aynı byte
kaynağıyla korunur; hash karşılaştırması v74-unchanged-ci-evidence.json.
Yeni SQL koşusu veya hosted kontrol yapıldığı iddia edilmez.

## İncelemeye sunulan kesin girdiler

- Migration: `supabase/migrations/20261126074656_canonical_bank_v74.sql`
  SHA256: `5280c037f167be5d29db3ceaa7ba6943e8aa5b62f9b6dedf31926d9ba4c6701f`
- Async staging: `async-v74.private.sql`, SHA256 `1bb63c3ec996d69cff59769c2627ebad0a1f952679a916a45794f308434e4d0f`
- Live staging: `live-v74.private.sql`, SHA256 `5c0460ce271c321773d6d09365c2990135e0539849114539d86a15bd898a5808`

Anahtarlı SQL, bütün Git worktree'lerinin dışında
`~/.local/share/anla-quiz-build/ios011-v74-rollout-20261126/` altında 0600
izinle saklanır. Bu dosyalar mobil bundle'a, Git'e, e-postaya veya genel
raporlara eklenmez. Üretilmesi SQL'in uygulanması değildir.

Preflight export sayımı: 3.000 async / 3.000 live, yeni 1.500; her kategoride
375 yeni, 264 live havuz. Metin ve cevapların yeniden üretimi yapılmadı;
mevcut v74 snapshot'ından birebir projeksiyon çıkarıldı.

## Aşama 0 — Salt okunur canlı ön kontrol (ayrı işlemde)

1. Doğru Frankfurt projesini, migration defterini ve sunucudaki fonksiyon
   hash'lerini onaylı kaynakla karşılaştır. v72/v73 ve timing/erasure migration
   zincirinin mevcut olduğunu doğrula. Sapma varsa DUR, otomatik düzeltme yapma.
2. `quiz_private.online_content_config` satırının tamamını ve
   `quiz_private.live_config` (dataset, enabled dahil) satırını güvenli
   işletim kaydına al. Önceki dataset'in bank-v73 olduğunu varsayma.
3. Eski v72/v73 soru/anahtar/member hash'lerini, mevcut maç/oda sayısı ve
   manifest özetlerini, skor/ödül ledger özetlerini kaydet. Tam kullanıcı
   satırlarını veya PII/anahtarları rapora aktarma. Bu yalnız rollback kanıtıdır.
4. Önceki aktif dataset'in iki validator'dan geçtiğini ve gerektiğinde geri
   alınabilecek content_approved durumunu doğrula. RLS/ACL ve ilan edilmiş
   client capability/hash'lerini karşılaştır.
5. Onaylanmış yedek/PITR erişiminin varlığını kontrol et; yeni ücretli
   hizmet veya platform ayarı açma. Backup dump'ını istemci projesine koyma.

Bu aşamada hiçbir aktif ayar değişmez. Bu görev canlı kontrolü çalıştırmadı.

## Aşama 1 — Migration ve kapalı staging (ayrı açık onay)

1. Yukarıdaki üç hash'i yeniden üretip birebir eşleştir; aynı migration'ın
   zaten uygulanmış olup olmadığını kontrol et, ikinci kez körlemesine çalıştırma.
2. Yalnız onaylanan eklemeli v74 migration'ını uygula. v72/v73 sözleşmeleri
   1.500 olarak kalır, v74 3.000 olur. Kullanıcı/skor/XP alanı değiştirilmez.
   Migration'ın lock_timeout'u 5 saniyedir; kilit beklerse DUR ve planı yeniden
   zamanla. Canlı maçları bitirme veya uygulama bağlantılarını kapatma.
3. Async staging'i tek transaction'da uygula. (id,version) veya anahtar
   uyuşmazlığı guard tarafından reddedilir; mevcut satırları zorla güncelleme.
4. Live staging ayrı transaction'dır ve idempotent değildir. Kısmi staging
   varsa ikinci INSERT'i körlemesine tekrarlama; mevcut satırları hash/validator
   ile karşılaştırıp kabul edilen transaction'ı belirle. Soruları/sürümleri
   silerek baştan kurma.
5. validate_online_bank('bank-v74') ve live_validate_dataset('bank-v74')
   sonuçlarını, 3.000/1.500/375 ve 264 havuz sayımlarını, kaynak/şık/anahtar
   projeksiyon eşitliğini ve özel anahtar ACL sınırını doğrula.
6. Başlangıçtan önce kaydedilen aktif config ve eski hash'ler aynen kalmalı.
   bank_release_approval.content_approved=false kalır. Yeni maç/oda v74'e
   geçmez. Yeni tablo/RLS/Auth/push/reklam açılışı yapılmaz.

Bir transaction başarısızsa o transaction rollback olur. Daha önce başarılı
migration/staging'i düşürmeye gerek yoktur; eski dataset aktif kalır. Aktif
v74 yokken staging geri bırakılabilir, kullanıcı verisi silinmez.

## Aşama 2 — Yalnız yeni oyunları geçirme (ayrı açık onay)

1. İçeriğin yayın iznini onaylı kayıttan doğrula; teknik kaynak denetimini
   bağımsız ilahiyat uzmanı onayı gibi sunma.
2. Kısa transaction içinde iki singleton config satırını kilitle; Aşama 0
   değerlerinin değişmediğini doğrula. Sapma varsa DUR.
3. Yalnız bank-v74 content_approved=true yap; async active_scope ve live
   dataset'ini bank-v74'e al. live_config.enabled değerini ve bütün başka
   feature/security bayraklarını önceki haliyle koru. Kapalı bir canlı oyun
   hizmetini bu yayın kapsamında açma.
4. Commit öncesi her iki validator ve counts tekrar geçmeli. Trigger'lar
   eksik approval veya async/live uyumsuzluğunu reddeder; trigger atlama.
5. Yalnız yetkili sentetik iki hesapla yeni düello/live oda, answer/reveal,
   timeout/20 saniye, skor ve review kabulü. Yeni hesap gerekiyorsa ayrıca
   izin iste; gerçek oyuncu hesabını test/silme hesabı olarak kullanma.
6. Önceden başlamış v73 maçı/oda kendi scope/dataset/manifest/anahtarlarıyla
   bitmeli. Bu davranış izole testte doğrulandı; canlı kabul olmadan canlıda
   geçti denmez. Kullanıcı kaydı/XP veya manifestini yeniden yazma.

## Geri dönüş — uygulama sürümlerini/oyunları silmeden

- Yeni oluşturma veya grading kabulü başarısızsa, iki config satırını aynı
  kısa transaction'da önceki kaydedilmiş değerlere döndür. Önceki dataset'i
  hardcode etme, enabled ve diğer bayrakları koru. Önceki validator/approval
  durumunu kontrol et; migration veya RLS'yi düşürme.
- v74 content_approved değerini önceki duruma alarak yeniden etkinleştirmeyi
  kapat. Approval kapısı yeni config etkinleştirmeyi etkiler; mevcut v74
  maç/oda kayıtlarını veya anahtarlarını silmez. V74 ile başlamış maçı eski
  bankaya çevirme; kendi manifestiyle tamamlanmasına izin ver.
- Tamamlanmış oyun/XP/score/ledger, eski v72/v73 ve yeni v74 satırları korunur.
  DELETE/TRUNCATE, down migration veya dondurulmuş soru sürümünü değiştirme yok.
- Geri dönüş sonrasında eski dataset'te yeni oyun kabulü, hem v73 hem v74
  başlamış maçın tamamlanması ve ledger hash'leri kontrol edilir.
- Bu belge gerçek canlı cutover/rollback'in yapıldığı anlamına gelmez.
  Yeni timing/Auth/sosyal güvenlik ayarı bu plana dahil değildir.

## İzole kanıtın kapsamı

Başarılı aynı-kaynak CI: v74 tam kayıt/anahtar, 375'er yeni soru, v73 üye/
anahtar hash'lerinin korunması, v74'e geçildikten sonra v73 maçının 1.000
skorla bitmesi, 264 havuz, anon/authenticated özel anahtar reddi, yeni
20 saniyelik oyunlar ve eski timing/erasure/XP regresyonları. Yerel 80 testte
eski v1–v73 cevap/puan/XP okuması ve yeni kaydın saklanması geçti.

CI testlerindeki BEGIN/ROLLBACK ve config switch kontrolleri üretim operasyonu
yerine geçmez. Canlı preflight ve onaylanan sentinel kabulü zorunludur.

## Eşzamanlı gerçek oyun trafiği

Canlı ledger sayıları doğal oyun trafiğiyle artabilir. Bütün canlı tablo
sayısının staging boyunca değişmediği şartı konmaz; yayın transaction'ının
mevcut tamamlanmış kayıtları yeniden yazmadığı, sabitlenmiş eski satır hash'leri
ve beklenen yeni test/gerçek oyun eklemeleri ayrılarak kontrol edilir. Oyun
trafiğini durdurma veya gerçek oyuncu verisini test fixture'ı gibi geri alma yok.
