# v73: geçmiş kimliği ve yayın kapısı

Bu dal içerik adayıdır; aktif banka sürümü 72’dir. `questions-v72.ts`, v1–v72 arşivleri, registry, günlük seçim, puan/XP ve çevrimiçi exporter değiştirilmedi.

## Doğrulanan mevcut yapı

- `quiz_private.quiz_questions` anahtarı `(id, version)`; `quiz_answer_keys` aynı kimliğe bağlıdır.
- `online_bank_members` üyeliği `(dataset, id)` üzerinden bir `(id, version)` satırını gösterir. Canlı soru ve anahtar tabloları dataset ile ayrılır.
- Mevcut canonical migration yalnız `bank-v72` kapsamını kabul eder. Mevcut exporter yalnız aynen aktif v72’yi, onaylı kaynak/inceleme durumuyla üretir; draft v73’ü kabul etmez.
- Mevcut SQL üreticisi aynı `(id, version)` için farklı kök, seçenek, anahtar veya açıklama bulursa işlemi durdurur. Çakışan satırı güncellemez; son eklemeler `ON CONFLICT DO NOTHING` kullanır.

Bunlar depodaki şema/exporter incelemesidir. Bu görevde canlı Supabase’e bağlanılmadı; orada yeni sürüm anahtarı için boşluk bulunduğu iddia edilmiyor.

Yerel v2–v72 arşivleri ayrıca adayda değişen soruların `(id, version)` kimlikleriyle karşılaştırılır. `editorial-v73.test.ts` bu kimliklerden biri herhangi bir eski snapshot’ta kullanılmışsa başarısız olur. Bu kontrol noktasındaki 874 yeni içerik sürümünde yerel çakışma yoktur. Bu test canlı tabloları kontrol etmez; yayından önce aşağıdaki salt okunur hedef denetimi yine zorunludur. v1’in farklı eski veri modeli ve kayıt gösterimi ayrı geçmiş regresyon testleriyle korunur.

## Ayrı yayın PR’ında gereken strateji

1. Düzenlenen her soru mevcut v72 soru sürümünden bir yüksek içerik sürümüyle hazırlanır. Bu dalın henüz yayımlanmayan v73 revizyonları aynı aday kimliği altında gelişebilir; yayımlanmış bir içerik sürümü bu şekilde değiştirilemez.
2. Yayından önce canlı hedefte salt okunur çakışma kontrolü gerekir. `(id, version)` varsa içerik ve anahtar byte/semantik özeti aynı olmalıdır. Farklıysa **durulur**; yeni boş sürüm seçilir, eski satırın üzerine yazılmaz.
3. Yeni `bank-v73` üyeliği ve canlı dataset’i ayrı hazırlanır. Değişmeyen soruların mevcut sürümü üyelikle yeniden kullanılabilir. Eski satırın `content_scope` değeri yeni banka diye yeniden etiketlenmez. Bu ayrım mevcut exporter’a körlemesine `72 → 73` değişikliğiyle uygulanamaz.
4. Dataset kısıtları, özel anahtar erişimi ve RLS için ayrı, onaylı migration gerekir. Eski v72 üyelikleri ve cevap anahtarları kalır; geçmiş maçlar tamamlandıkları banka ve kaydedilmiş seçenek sırasıyla çözülür.
5. Kaynak/uzman ve ürün sahibi onayı, 1.500 bireysel ikinci tur kaydı, açık kritiklerin kapatılması, kapalı staging ve oyuncu kabulü tamamlanmadan release kapısı açılmaz.
6. Etkinleştirme yalnız yeni oyunları etkiler. Devam eden ve tamamlanmış oyunlar taşınmaz, yeniden puanlanmaz; XP/rozetler yeniden hesaplanmaz. Geri dönüş yeni oyun kapsamını v72’ye çevirir, eski dataset’i silmez.

Bu belge v73 import’unun veya canlı günlük/oda oyunlarının hazır olduğu anlamına gelmez. Sunucu deployment/migration/seed yapılmadı. Yeni cevap anahtarlarını istemciye taşıyan bir yol eklenmedi.
