# Güncel kabul APK hazırlığı — 30.10.2026

Ayrı dal: `release/play-final-candidate-20261030`. PR #18 kaynakları ile main `b0d5c383489228111d40556cf556a9d6a34e24b9` birleştirildi. Tek çatışma gizlilik metnindeydi; yayımlanmış politika bilgileri ve adayın mevcut hesap/Google/push açıklamaları korundu. Main/Production değişmedi.

- `pnpm check`: PASS, 370/370 test; soru bütünlüğü, TypeScript, lint dahil.
- PR #18 gerçek Android emülatör UMP/banner/interstitial kanıtları [korundu](../admob-test-20261030/retest/README.md). Yeni fiziksel cihaz kabulü yerine sayılmaz.
- Sahip bu turda Samsung cihazın yanında olmadığını bildirdi. Fiziksel kabul BEKLİYOR.
- Ücretsiz EAS hesap okuması: Android 12/15 kullanılmış, 3 hak kalmış, ek kullanım maliyeti 0. Yeni APK yalnız `ads-preview`, mevcut EAS imzası, standart runner ve resmî test reklamlarıyla istenir.
- `production` AAB kapısı değiştirilmedi: `approved:false`, `acceptedApkSha256:null`. AAB üretilmedi/Play'e yüklenmedi. AdMob testli mağaza AAB profili henüz yok; üretim profili reklam modu kapalı. Farklı binary'nin mağaza beyanları ve kabulü ayrıca ele alınmalı.
- Gerçek reklamlar, Analytics, genel push, Auth, Supabase ve kullanıcı kayıtları değişmedi.

## Console denetimi

Mevcut uygulama/paket doğrulandı; taslak, kişisel hesap, 0 tester, 12 tester/14 kesintisiz gün gerekli, üretim başvurusu kapalı. Gizlilik URL'si, Soru Cevap kategorisi, iş destek e-postası ve mevcut web adresi taslağa kaydedildi. İncelemeye gönderilmedi. [Kontrol listesi](../../store/google-play/tr-TR/console-checklist.md) güncellendi. Fiyat/yaş grupları kullanıcı kararını bekliyor. Merchant hesap açılmadı.

## Açık kabul işleri

Aynı EAS imzalı son APK'nın Samsung A04/Android 14 kabulü, gerçek Android OAuth ve ilgili kalan native senaryolar; incelemeci erişimi; Data Safety ve IARC/yaş/reklam beyanları; kesin ücretsiz dağıtım kararı; tester/ülke/track; kabul edilmiş SHA için AAB onayı; imzalı AAB/16 KB denetimi; Play yükleme/inceleme ve gerçek kapalı test. Bunların hiçbiri tamamlanmış gösterilmez.
