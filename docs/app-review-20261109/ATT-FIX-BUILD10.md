# Apple 2.1 (ATT) düzeltmesi — Build 10 / 11 — 9 Kasım 2026

## Kök neden (doğrulandı)
Build 9'da `mayPrepareAdConsent()` yalnız `adultConfirmed` ile true dönüyordu. Temiz kurulumda
bu kapalı olduğundan UMP → ATT akışına hiç ulaşılmıyordu (Apple iPad Air M3, iPadOS 27.0.1).
Build 9 JS'i kaynaktan yeniden üretildi; tek fark gömülü geçici dosya yolu.

## Düzeltme (commit d074f2c, dal release/att-ads-fix-20261109)
- 18+ ve reklam açma ön koşulu kaldırıldı; ilk açılışta ana sayfada UMP, ardından ATT.
- Yaş bilinmiyor → yetişkin varsayılmıyor: her istek NPA + G içerik sınırı, first-party ID kapalı.
- Tur sonu geçiş reklamı soru sormadan otomatik (3. tur sonrası, 5 dk sınırı, oyun sırasında yok).
- Ayarlar → Gizlilik: yeniden kontrol + Google gizlilik seçenekleri; ATT iOS Ayarlar'dan.
- TypeScript, lint ve 458/458 test geçti.

## Paketler (native değişmedi, yalnız main.jsbundle)
| Build | Reklam | Amaç | Apple |
|---|---|---|---|
| 10 | gerçek iOS birimleri | App Store production | VALID, sürüme seçildi |
| 11 | yalnız Google test birimleri | harici/Public TestFlight | VALID, Public Beta grubuna eklendi |
JS SHA256 52a05ccb80a776e09801a6152074f9e3ea08822c77b78c0f6969c83725d83d65; native UUID F9731AC3-497A-372F-A996-2CE5629FDB91.
Her iki IPA: Apple Distribution imzası, production APNs, get-task-allow=false, 17 privacy manifest,
Frankfurt Supabase, ATT metni.

## Gerçek cihaz / simülatör kanıtı
- iPhone 11 (fiziksel): yerinde güncellemede XP korundu; temiz kurulumda ATT görüldü,
  reddedildi, uygulama ve test reklamı çalıştı; ikinci temiz kurulumda iOS ekran kaydıyla
  ATT → İzin Ver → banner → oyun (reklamsız) kaydedildi; 3. tur sonunda test geçiş reklamı otomatik açıldı.
- iPad Air 11" M3 simülatör (iPadOS 27.0, EEA debug): UMP formu → ret → ATT istenmedi, reklam yok;
  gizlilik seçeneklerinden izin → ATT sırayla → ret → reklam hazır; izin geri alındı → reklam kapalı.
- Mac'ten devicectl ekran kaydı bu iPhone'da desteklenmedi; kayıt iOS ekran kaydıyla alındı.

Kanıt dosyaları Git dışında: ~/.local/share/anla-quiz-build/att-fix-20261109/evidence.
