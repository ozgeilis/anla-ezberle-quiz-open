# Anla & Ezberle geliştirme kuralları

- Kapsama uygun, davranışı koruyan değişiklikler yap. Dosyaları yalnız kısaltmak için yeniden yazma.
- Oyun kuralları, arayüz, veri erişimi ve sunucu işlemlerini ayrı sorumluluklarda tut. Büyüyen ekranların anlamlı bölümlerini bileşenlere ayır.
- Mevcut ortak UI, tema, saklama ve servis altyapısını yeniden kullan. Aynı işlev için ikinci sistem, gereksiz bağımlılık veya soyutlama ekleme.
- Tekrarlanan mantığı azalt; gereksiz iç içe koşullardan kaçın. TypeScript tip güvenliğini koru, gerekçesiz `any` kullanma.
- Ayarlar menüsü ile profil/hesap işlemlerini, kişiselleştirme taslağı ile görsel önizlemeleri, push tercihleri ile bildirim yönlendirmesini ayrı tut.
- Kullanıcı değişimindeki iptal/kimlik kontrollerini, kaydetmeden çıkma davranışını, sessiz/ses tercihlerini ve sunucu doğrulamalarını koru.
- Geçici ve kullanılmayan kodu bağımlılıklarını kontrol ederek kaldır. Soru bankaları, geçmiş kayıt uyumluluğu, kullanıcı verileri ve onaylı görsellere zarar verme.
- PR entegrasyonunda güncel dalları, tekrarları ve çakışmaları incele; başka çalışmaları ezme. Kullanıcının main/Production ve backend onay sınırlarını koru.
- Refaktörden sonra ilgili otomatik davranış testlerini, TypeScript ve lint kontrollerini çalıştır. Arayüz taşındığında mevcut tarayıcı akışlarıyla görünüm ve etkileşimleri doğrula.
- Yapılmamış gerçek cihaz testlerini başarılı raporlama. Kimlik bilgilerini, kullanıcı kayıtlarını ve özel test çıktılarını Git'e koyma.
