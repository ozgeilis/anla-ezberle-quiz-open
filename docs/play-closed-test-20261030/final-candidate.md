# Güncel kabul APK hazırlığı — 30.10.2026

Ayrı dal: `release/play-final-candidate-20261030`. PR #18 kaynakları ile main `b0d5c383489228111d40556cf556a9d6a34e24b9` birleştirildi. Tek çatışma gizlilik metnindeydi; yayımlanmış politika bilgileri ve adayın mevcut hesap/Google/push açıklamaları korundu. Main/Production değişmedi.

- `pnpm check`: PASS, 370/370 test; soru bütünlüğü, TypeScript, lint dahil.
- PR #18 gerçek Android emülatör UMP/banner/interstitial kanıtları [korundu](../admob-test-20261030/retest/README.md). Yeni fiziksel cihaz kabulü yerine sayılmaz.
- Sahip bu turda Samsung cihazın yanında olmadığını bildirdi. Fiziksel kabul BEKLİYOR.
- Ücretsiz EAS hesap okuması: Android 12/15 kullanılmış, 3 hak kalmış, ek kullanım maliyeti 0. Yeni APK yalnız `ads-preview`, mevcut EAS imzası, standart runner ve resmî test reklamlarıyla istenir.
- `production` AAB kapısı değiştirilmedi: `approved:false`, `acceptedApkSha256:null`. AAB üretilmedi/Play'e yüklenmedi. AdMob testli mağaza AAB profili henüz yok; üretim profili reklam modu kapalı. Farklı binary'nin mağaza beyanları ve kabulü ayrıca ele alınmalı.
- Gerçek reklamlar, Analytics, genel push, Auth, Supabase ve kullanıcı kayıtları değişmedi.

## Console denetimi

Mevcut uygulama/paket doğrulandı; taslak, kişisel hesap, 0 tester, 12 tester/14 kesintisiz gün gerekli, üretim başvurusu kapalı. Gizlilik URL'si, Soru Cevap kategorisi, iş destek e-postası ve mevcut web adresi taslağa kaydedildi. İncelemeye gönderilmedi. [Kontrol listesi](../../store/google-play/tr-TR/console-checklist.md) güncellendi. Ürün sahibi ücretsiz dağıtım ve 13+ hedef kitleyi bu turda onayladı; Console kaydı ayrıca doğrulanacak. Merchant hesap açılmadı.

## Açık kabul işleri

Aynı EAS imzalı son APK'nın Samsung A04/Android 14 kabulü, gerçek Android OAuth ve ilgili kalan native senaryolar; incelemeci erişimi; Data Safety ve IARC/yaş/reklam beyanları; ücretsiz fiyatlandırmanın Console kaydı; tester/ülke/track; kabul edilmiş SHA için AAB onayı; imzalı AAB/16 KB denetimi; Play yükleme/inceleme ve gerçek kapalı test. Bunların hiçbiri tamamlanmış gösterilmez.

## EAS kabul derlemesi

Kaynak: `7db5e96ac51119259015f86c0d0e95e71207fdef`. `ads-preview`, mevcut uzak Android keystore ile `--freeze-credentials --non-interactive --no-wait`. [Build d33a229f-cd8a-47a2-9a77-ce0bcf9d51dc](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/d33a229f-cd8a-47a2-9a77-ce0bcf9d51dc). **FINISHED**. [Binary kanıtı](final-apk-evidence.json): paket aynı, API min24/target36/compile37, sürüm0.1.0/code1, önceki EAS APK sertifikasıyla birebir aynı imza; ZIP ve 52 ELF64 16 KB statik denetimi PASS. SHA-256 `00c4abeae9c913f8b65c5319851615ffc1694ffd5136caaf0a4896cba6451ac6`. Fiziksel test henüz yok; bu yeni EAS APK ayrıca emülatörde oynanmış olarak raporlanmaz. Önceki #18 runtime emülatör kanıtları ayrıdır. `pnpm export:web` da PASS.

Mağaza metni, ikon, tanıtım görseli ve altı gerçek oyun ekranı Console'a **taslak** kaydedildi. Varsayılan yükleme sırası profil/rozet/sonuç/quiz/ana sayfa/kategoriler; son yayımlama öncesi ana sayfa ilk olacak şekilde sıra ayrıca düzenlenmeli. Ücretsiz fiyatlandırma kaydı doğrulandı (öncesinde yanlışlıkla Ücretli seçiliydi). Resmî kurum uygulaması: Hayır kaydedildi. Hedef kitle formu Reklamlar ve Uygulama Erişimi önkoşulları nedeniyle henüz açılamadı; 13+ kararı dosyada korundu. Hiçbir beyan incelemeye gönderilmedi.

## Son ek doğrulamalar

- Yeni EAS APK, `AnlaClosedTest34` / Android 14 emülatöründeki önceki uygulamanın üzerine `adb install -r` ile **Success**; uninstall veya clear-data yok. İlk kurulum tarihi korunup güncelleme tarihi değişti. Bu yalnız kurulum doğrulamasıdır. Güncel CUA aracı emülatörü listelenebilir uygulama olarak tanımadığı için yeni binary'nin görsel/oyun kabulü yapılmış gösterilmez.
- Manifestte dört reklam tanımlayıcı/AdServices izni engelli. Assets üzerinde belirtilen gizli anahtar örüntü taraması yapıldı. Ham Hermes belleğindeki bir `sb_secret_` uyarısı, resmî hermesc ile çözülen string tablosunda yalnız SDK'nın 10 karakterlik sabit öneki olarak doğrulandı; gizli anahtar değeri değil. Taramanın kapsamı binary içindeki her sırrın yokluğunu ispatlamaz.
- Kurulum QR'ı üretildi ve macOS Vision ile hedef EAS URL'sine çözüldüğü doğrulandı; özel teslim klasöründedir.
- Frankfurt salt okunur son kontrol: e-posta enrollment/hesap silme/sıralama açık; Google OAuth/silme açık ama Google yeni kayıt kapalı; genel push kapalı; oyuncu profili FORCE RLS açık, enrollment RPC yalnız service-role. Hiçbir canlı kayıt değiştirilmedi.
- Reklam beyanı test reklamı gösteren adaya göre Evet olarak taslağa kaydedildi; nihai AAB farklı olursa beyan yeniden denetlenir.
- [İncelemeci erişim planı](reviewer-access-plan.md) en fazla iki yeni sentetik oyuncu ve yalnız Play özel alanına kimlik bilgisi aktarımı için ayrı onay bekliyor.
