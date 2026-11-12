# iOS 0.1.1 — Marketing URL ve tur sonu reklam sıklığı

11 Kasım 2026: kullanıcı 0.1.1 sürümünü, tek production IPA ve Apple'a yüklemeyi onayladı. İncelemeye gönderim ve yayın ayrıca onay bekler; manuel yayın korunur.

Temel: onaylı Build 10, kaynak d074f2cd0110a3bf6ab275d3dd288299aa5958fc. Yeni ve kullanılmamış build numarası 12; Apple listesinde en yüksek build 11 olarak doğrulandı. Native derleme yapılmadan Build 10 arşivinin ayrı kopyası kullanılacak. Özellik, SDK, üretim reklam birimleri, Auth, backend ve görseller korunur.

Ek kullanıcı talimatı yalnız iOS reklam sıklığını değiştirir: kaydedilmiş ilk tamamlanan turdan itibaren, sonuçtan çıkışta hazır interstitial denenir. Beş dakika ve üç tur bekleme iOS'ta kaldırılır; Android dalında aynen kalır. Soru/aktif oyun, arka plan, eşzamanlı işlem ve aynı sonuç için tekrar gösterim engelleri korunur. Reklam hazır değilse geçiş yükleme beklemeden sürer. Sonuç/XP önce kaydedilir. UMP, ATT, NPA, G içerik sınırı ve publisher first-party-ID-off değişmez.

Değişen runtime: src/features/ads/adPolicy.ts ve src/features/ads/AdProvider.tsx. Hedefli reklam testleri 25/25, TypeScript ve bu üç dosyada lint geçti. Yeni gerçek cihaz testi veya gerçek reklam gösterimi yapılmadı.

AdMob: tamamlanan oyun seviyeleri/turları doğal ara olarak tanımlanır. Reklam önceden yüklenir; tamamlanma callback'iyle sonradan açılmaz, her dokunuşta reklam gösterilmez. Her tur birden fazla soru/etkileşim içerir. Bu yerleşim incelemesi Google'ın uygulama onayı ya da gelir garantisi değildir. Yapay gösterim/tıklama oluşturulmaz.

Kaynaklar: https://developers.google.com/admob/ios/interstitial ve https://support.google.com/admob/answer/6201362?hl=en

App Store taslağı 0.1.1 oluşturuldu. Marketing URL https://anla-ezberle-quiz.vercel.app ve sıklık değişikliğini açıklayan Türkçe sürüm notu kaydedildi. Yeni build işlenince seçilecek ve App Review notu eski beş dakika/üç tur ifadesini taşımayacak şekilde güncellenecek. Mevcut özel incelemeci hesabı ve iletişim bilgileri korunacak.

Tek IPA 0.1.1 (12) üretildi; native UUID Build 10 ile aynı. İmza/provisioning, 188 kaynak ve 17 gizlilik manifesti ile sürüm alanları dışındaki production yapılandırması doğrulandı. IPA SHA256: 61461d8a9e27eea347c513369b39a6357fcc8e473efbd10ac1de3c08e5bdd602. JS SHA256: a3b0f4c36e751fe66b4426c0dadb138fe9b075057592a259e0b5779065380c17. Transporter 11 Kasım 2026 17:11 yerel saatte gönderildi olarak gösterdi; Apple processing doğrulaması ayrıca bekleniyor. App Review notu yeni sıklıkla güncellendi ve kaydedildi. İncelemeye gönderim yapılmadı.


## Final Apple verification — 2026-11-11

Transporter upload completed. Apple reports Binary State **Validated**, version **0.1.1**, build **12**, Ready to Submit. Build UUID: `c9b0acb0-2de5-4fd2-9e3b-e5571e314959`. Build 12 is selected and saved in the 0.1.1 Prepare for Submission draft. Marketing URL is `https://anla-ezberle-quiz.vercel.app`; manual release remains selected. Review notes describe the iOS-only cadence change. No App Review submission or public release was performed.

Only targeted cadence/package checks were repeated; no new physical-device acceptance is claimed. app-ads.txt crawler verification is not resolved merely by saving this draft: the Developer Website must become live after review/release, followed by an actual AdMob verification.
