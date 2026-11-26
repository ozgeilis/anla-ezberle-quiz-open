# Gereksinim kontrolü — 26 Kasım 2026

| Gereksinim | Durum | Kanıt / kalan işlem |
|---|---|---|
| Eski 1.500 kök, dört şık ve kaynak | Tamamlandı | 15 seçenek inceleme günlüğü; source-rechecks ve followups |
| Kapsam/ifade/açıklama düzeltmeleri | Tamamlandı ve test edildi | 563 kayıtta alan değişikliği; eski key ve option ID’leri korunuyor |
| Eski anlam tekrarları | Bulunanlar giderildi | 131 grup, 146 ikame; kaynak ve içerik SHA fişleri |
| 1.500 kaynaklı yeni soru | Tamamlandı ve test edildi | 87 kaynak fişi, 1.500 yeni ID |
| Yeni kategori kotası | Tamamlandı ve test edildi | Dört kategorinin her birine 375 |
| Zorluk kalibrasyonu | İncelendi; dağılım eşit değil | 3.000 soru yeniden ele alındı; gerçek dağılım final-metrics içinde, etiketler eşit üçte bir için zorlanmadı |
| Çeldiriciler | İncelendi ve düzeltildi | Son taramada 294 kayıt okundu; 290 açık seçenek seti düzeltmesi |
| Tekrar taraması | Tamamlandı; yöntem sınırı açık | Jaccard + TF-IDF + kaynak/factKey; eşik altı tüm olası çiftler için mutlak benzersizlik kanıtı iddia edilmez |
| 3.000 kayıt ve kaynak bütünlüğü | Tamamlandı ve test edildi | 16 son v74 testi ve manifest eşitliği |
| Uygulamanın v74’e bağlanması | Tamamlandı; yalnız izole dal | Statik runtime snapshot; konu sürümleri geniş 3 / öğrenme 4 |
| Eski oyun, cevap, skor, XP | Tamamlandı ve test edildi | V1–v73 frozen kayıtlar; yeni oyun sonrası JSON dönüşü ve ödül eşitliği |
| Tam TypeScript / lint | GEÇTİ | test-results.json |
| Tam otomatik test paketi | BAŞARISIZ: 481/482 geçti | Taban Git kaynağında yok sayılan Google native Swift dosyası eksik; içerik değişikliği bu dosyayı değiştirmedi |
| Sunucu v74 migration ve staging kodu | Hazır; canlıya uygulanmadı | Kapalı onay bayrağı, değişmez v72/v73, 3000 sayımı |
| İzole SQL kabulü | Son GitHub CI koşusu GEÇTİ; yerelde çalışmadı | 45783982572, kod 895624a; v73 maçı v74 geçişinden sonra eski anahtarlarıyla tamamlandı |
| Gerçek cihaz / yeni iOS veya Android paketi | ÇALIŞTIRILMADI | Bu görevde build ve mağaza dağıtımı yapılmadı |
| Main / canlı Supabase / mağazalar | Değiştirilmedi | Ayrı onay sınırı korunuyor |
