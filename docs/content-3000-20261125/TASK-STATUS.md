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

## Son kalite ve Hemen Oyna ek görevi

| Gereksinim | Durum | Kanıt / kalan işlem |
|---|---|---|
| Mevcut PR ve kaynak koruması | Doğrulandı | PR #33, aynı dal; main ve diğer worktree’ler değişmedi |
| Dört kategori / 3.000 ID | GEÇTİ | Son integrity testleri; her kategoriye 375 yeni kayıt korunuyor |
| Son zorluk ve çeldirici kontrolü | İncelendi ve test edildi | 56 örnek; beş zorluk ve üç seçenek seti düzeltmesi |
| Hemen Oyna | Tamamlandı ve test edildi | Doğrudan karma tur, dört kategori, gerçek XP seviyesine göre yumuşak dağılım |
| Tekrar Oyna devamlılığı | Tamamlandı ve test edildi | Yeni kayıtların quickPlay işareti; eski kayıt formatı korunur |
| XP / çözülenler / eski v1–v73 | GEÇTİ | 47 hedefli test içinde eski cevap/XP ve yeniden açılış |
| Gerçek tarayıcı UI kabulü | GEÇTİ | 45794437930 / cbde74c: 320/390 açık/koyu; 50 gerçek soru; 12 PNG; BROWSER-ACCEPTANCE.json. Yerel CUA kapalı; fiziksel cihaz kabulü değildir |
| Google native altyapı hatası | Yeniden doğrulandı, giderilmedi | ios/ ignore kuralı özgün podspec/Swift dosyalarını Git dışında bırakıyor; Auth yeniden yazılmadı |
| IPA/AAB, main veya mağaza yayını | Yapılmadı | Son kabul/onay sınırı korunuyor |

Son kod kabulü: **cbde74c / [CI 45794437930](https://github.com/ozgeilis/anla-ezberle-quiz-open/actions/runs/45794437930) GEÇTİ**. Tam TypeScript/lint, manifest, 40 seçili CI testi, gerçek Chromium kabulü ve izole SQL geçti. Yereldeki 47 test ayrı kapsamdır; toplanıp 87 farklı test gibi sunulmaz. Son belge kaydı kodu değiştirmez ve maliyet için aynı CI yeniden başlatılmaz.
