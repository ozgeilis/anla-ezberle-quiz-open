# v73 canlı ön kontrolü ve dar güvenlik düzeltmesi

## Doğrulanan durum

30.10.2026 Frankfurt `mqyuihiobkomjfipxehj` Supabase MCP üzerinden salt okunur
incelendi. Proje sağlıklı, PostgreSQL 17.11, organizasyon planı **Free**.
Kullanıcı, oturum, profil veya maç satırları dışarı aktarılmadı. Gerçek/sentetik
üretim hesabı oluşturulmadı veya silinmedi. Hiçbir canlı yazma yapılmadı.

- Async yeni oyun scope'u: `owner_approved_v13`; 500 eski + 20 sentetik soru.
- Live yeni oda dataset'i: `bank-v41`, etkin; 600 soru ve 264 havuz.
- Recent selector'lar, `answer_seconds` ve canonical üyelik/onay tabloları yok.
  Onaylanan beş migration'ın tamamı migration geçmişinde de yok.
- Değişecek yedi mevcut fonksiyonun tamamı depodaki uygulanmış başlangıç
  migration'larından üretilen PostgreSQL tanımlarıyla **tam hash eşleşti**.
- V73'ün 1500 `(id,version)` girdisi sunucuya yalnız beklenen metin/anahtar
  hash'leriyle karşılaştırıldı. Ortak 98 kayıt var, metin/seçenek/anahtar
  çakışması **0**. Diğer kayıtlar yenidir. Hiçbir eski satır üzerine yazılmaz.
- Yedi içerik/config tablosunda RLS+FORCE RLS açık; `anon`/`authenticated`
  SELECT izni ve özel şemaya USAGE izni yok.

## Dağıtımdan önce yakalanan regresyon

Henüz uygulanmamış `20261024000200_live_ten_second_questions.sql`,
`quiz_private.live_guard_room()` içindeki hesap silme istisnasını, erasing_actor
ayarı varsa bütün değişikliklere izin veren bir kısa yola dönüştürüyordu.
Bu, mevcut canlı hesap silme migration'ının sınırlı alan kontrolünü zayıflatırdı.

Yapılan tek işlevsel düzeltme, mevcut canlıdaki dar koşulu aynen korumaktır:
yalnız silinen oda sahibinin kimliği kaldırılabilir ve aktif odası iptal
edilebilir. Manifest, süre, set hash'i ve başka oyuncunun kimliği değişemez.
Yeni `answer_seconds` alanı da JSON alan eşitliğine dahildir.

| SQL | SHA-256 |
| --- | --- |
| Önceden onaylanan 10 saniye önkoşulu | `bee9d6942553a5bb991dc08412bf2a34f4bed311645cdfed15abb9fde88f9160` |
| Düzeltilmiş 10 saniye önkoşulu | `a18d6ef12019f1d622d8962112cb5fa375dba84024b65e97477365857e77f15a` |
| Değişmeyen yeni v73 migration'ı | `09f228e1215788d6e2a3658df8447a4f5b1fbd935118e6ef35e9106fc55d95be` |

Diğer üç önkoşulun hash'leri [ilk plandaki](CANONICAL-V72-ROLLOUT.md) gibidir.
Henüz dağıtılmadığı doğrulanan önkoşul dosyası düzeltilmiştir; uygulanmış bir
migration'ın geçmişi veya canlı tanımı yerinde değiştirilmemiştir.

## Test kanıtı

- Yeni `supabase/tests/live_erasure_guard.sql` eski dosyada manifestin
  değiştirilebildiğini gerçekten yakaladı; düzeltilmiş dosyada geçti.
- İzole yeni PostgreSQL fixture'ında testlerin tamamı geçti: v72/v73 yükleme,
  eski maçların anahtarları/puanları, 264 havuz, sunucu cevabı, geç cevap reddi,
  yeni 10/eski 15 saniye ve ACL/RLS.
- Erasure testi yalnız yerel sentetik hesap kullanır, tüm işlem rollback olur.
  Oda sahibi anonimleştirmesi ve aktif oda iptali geçer; manifest/süre,
  başka sahip ve terminal oda yeniden açma girişimleri reddedilir.
- `pnpm check`: soru bütünlüğü, TypeScript, lint ve **351/351 test** geçti.
- Hiçbir uygulama bileşeni, Auth/hesap silme Edge Function'ı veya kullanıcı
  kuralı değiştirilmedi. Bu SQL testi gerçek Auth Admin silme kabulü değildir.

## Ücretsiz plan ve geri dönüş sınırı

Organizasyon Free planda. Yönetilen günlük geri yükleme/PITR erişimi doğrulanmış
değildir; Supabase bu özellikleri ücretli planlarda sunar. Ücretli plan/add-on
açılmayacak ve yedek almak için gerçek kullanıcı kayıtları dışarı aktarılmayacak.
[Supabase yedek belgeleri](https://supabase.com/docs/guides/platform/backups).

Bu nedenle güncellenen somut dağıtım planı, tam veritabanı restore imkânı varmış
gibi gösterilemez. Kalan risk için açık onay gerekir. Sınırlı geri dönüş:

1. Salt okunur fonksiyon/constraint/ACL metadata'sını ve eski scope değerlerini
   özel yerel dizinde sakla. Bunlar kullanıcı verisi yedeği değildir.
2. Kısa lock timeout ve transaction ile yalnız onaylı eksik SQL'leri uygula.
   Gerçek kullanıcı/maç/puan/manifest/anahtar satırlarına UPDATE/DELETE yapılmaz.
   `answer_seconds` eklenince eski odalar 15, yeni odalar 10 olarak kalır.
3. Yalnız v73 içerik yüklemesini yeni üyelikler/sürümler olarak yap. Her parçada
   çakışma reddi; iki yeni-oyun switch'i bütünlük kabulüne kadar eskide kalır.
4. 1500 soru/anahtar, 264 havuz, çapraz eşleşme ve istemci ACL'si geçince iki
   switch'i tek transaction'da v73'e al. Genel push ve kayıt kısıtları korunur.
5. Hata durumunda yeni oyun switch'lerini `owner_approved_v13` / `bank-v41`
   değerlerine döndür. V73 satırları silinmez; eski veya başlamış maçlar
   kendi manifestiyle devam eder. Tam restore ya da veri kaybını geri alma
   garantisi verilmez; canlı kullanıcı verisini değiştiren test yapılmaz.

Üretimde kontrollü yeni maç/oda testi ayrıca sentetik hesap izni gerektirir.
Bu plan mevcut gerçek hesaplar üzerinden oyun başlatma veya silme izni içermez.

## Yayın kararı

İlk sunucu planı onaylıdır. Ancak değişen önkoşul hash'i ve artık doğrulanan
Free plan geri yükleme sınırı bu belgede somutlaştırılmıştır; bu farklar
onaylanmadan üretime uygulanmayacaktır. Main/web'deki v73 yayını etkilenmez.
