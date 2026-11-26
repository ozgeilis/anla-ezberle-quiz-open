# v74 sunucu yayın planı — uygulanmadı

Bu belge canlı işlem izni değildir. Yerel/CI kabulü geçmeden ve kullanıcı
ayrıca onaylamadan migration/staging/aktivasyon yapılmaz.

1. Güncel sunucu migration sırası ve aktif async/live kümeleri salt okunur doğrulanır.
2. Yalnız eklemeli `20261126074656_canonical_bank_v74.sql` incelenir.
   v72/v73 için 1.500, v74 için 3.000 sınırı; özel fonksiyon ACL’leri,
   `search_path=''`, içerik onayı kapısı ve değişmez eski sürümler korunur.
3. `scripts/check-canonical-bank-local.ts` izole veritabanında eski v72/v73
   ve v74 kabulünü çalıştırır: 3.000/1.500 yeni kayıt, 375’er ekleme,
   264 havuz, anahtar gizliliği, eski maçların bitirilebilmesi, skor ve ACL.
4. İncelenen migration ve iki dışa aktarım yalnız ayrı canlı onay kapsamıyla
   uygulanır. Üretilen cevap anahtarlı SQL Git dışında saklanır.
5. Staging sonrası v74 doğrulayıcıları, eski satır özetleri ve aktif kümenin
   değişmediği kontrol edilir. Bu aşama yeni oyunları henüz v74’e geçirmez.
6. Ayrı etkinleştirme onayıyla v74 içerik onayı ve yalnız yeni oyunların
   async/live kümesi değiştirilir. Eski maç/oda kendi scope/dataset’ini korur.
7. Geri dönüş yeni oyunların önceki etkin kümeye alınmasıdır. Maçlar, odalar,
   soru sürümleri veya kullanıcının XP/geçmişi silinmez.

Yeni tablo, RLS politikası, Auth kancası, service-role istemci anahtarı,
reklam veya bildirim değişikliği yoktur. Soru zamanlamasına müdahale edilmez.

İlgili resmî teknik kaynaklar: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security),
[Supabase değişiklik kaydı](https://supabase.com/changelog.md).
CLI, mevcut CI ile aynı 2.121.0 sürümünde yalnız boş migration dosyası
oluşturmak için kullanıldı. Canlı proje bağlantısı veya credential okunmadı.
