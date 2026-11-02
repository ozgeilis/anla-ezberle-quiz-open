# Gerçek iOS simülatör kabulü — 2 Kasım 2026

Simulator: Anla iOS Readiness 390 20261101, iOS27.0 /390pt.
Aynı onaylı Hermes JS SHA256:
`3d7b11b37e53de1cb332294051b03be1ca8b7fabcba0d26b5103e5c9e21852c4`.

Eski prototip Bundle ID'li imzasız kopyada SecureStore uyarısı görüldü. Ayrı QA
kopyasının simülatör imzalama denemesi de launch hatası verdi. Bu denemeler
başarılı sayılmadı. Xcode'un mevcut PR25 workspace'i ve mevcut runtime ile
Release simulator hedefi başarılı derlendi. Doğru simulated entitlement'lar
Mach-O içinde, imza entitlement dosyası boş olacak şekilde Xcode çıktısı
kullanıldı. Eski artifact ayrı kopyada korundu; runtime indirilmedi, eski app
verisi/sertifika/provisioning silinmedi.

Bu doğru native çıktının ayrı kopyasına kabul edilmiş JS/varlıkları kondu ve
simülatörde “Anla QA” adıyla mevcut prototipin yanına kuruldu. Kalıcı Bundle ID
`com.kovynelstudio.anlaezberle` kullanıldı. App Store IPA/build3 değiştirilmedi.

## Gerçek UI sonuçları

- Ana sayfa açıldı, güvenli oturum depolaması uyarısı yok.
- Mevcut, önceden yetkilendirilmiş sentetik incelemeci hesabıyla gerçek Supabase
  parola girişi geçti; parolayı kaydetme önerisi reddedildi.
- Bildirim listesi ve kabul edilmiş arkadaşlık kartı açıldı; gerçek sentetik
  hesabın karşı oyuncu profiline gidildi.
- Yeni gizlilik kusuru nedeniyle hosted safety kapalı olduğundan Engelle ve
  Şikâyet Et devre dışı ve sunucu güncellemesi açıklaması görünür. Bu beklenen
  rollback durumudur; etkin native rapor/engel kabulü yapılmış sayılmaz.
- Ayarlar → Hesap → Hesaptan Çık çalıştı; “Oturum Kapatıldı / Yerel oyun
  kayıtların, XP ve rozetlerin korunuyor” sonucu doğrulandı.

## Kanıtlar ve sınırlar

Gerçek Device Hub ekran görüntüleri Git dışındaki kalıcı kanıt klasöründe:

- `/Users/ozge/.local/share/anla-quiz-build/public-testflight-20261102/screenshots/ios390-notifications-light.jpg`
- `/Users/ozge/.local/share/anla-quiz-build/public-testflight-20261102/screenshots/ios390-safety-rollback-disabled.jpg`

Bu iki görüntü tasarım mockup'ı değildir. TestFlight mağaza ekran görüntüsü veya
fiziksel iPhone'da yeni moderasyon kabulü değildir. Bu aşamada yeni koyu tema,
iPad veya farklı genişlikte sosyal kabul yapılmadı. Önceki PR25 kanıtları
korunur; bu küçük kabul kapsamına taşınarak yeni test yapıldı denmez.

## Onaylı yeniden açılış sonrası gerçek kabul

Yeni silme-gizlilik migration'ı canlıda uygulandıktan ve sahibi konsola yeniden
girdikten sonra safety onaylı sırayla açıldı. Mevcut iki yetkili sentetik hesap
kullanıldı; yeni hesap oluşturulmadı.

- Native iOS şikâyet formunda Diğer seçilip sentetik açıklama yazıldı. Gerçek
  gönderim sonrası “Şikâyetin alındı” çıktı; canlı DB'de aynı neden/metinle tek
  açık kayıt ve owner konsolunda aynı rapor doğrulandı.
- Native Engelle onayından sonra arkadaşlık kaldırıldı; engellenenler listesi
  hedefi gösterdi. Karşı hesabın arkadaşlık ve davet istekleri sunucuda reddedildi.
- Native Engeli Kaldır sonucu boş liste ve önceki arkadaşlığın otomatik geri
  gelmediği açıklaması gösterildi.
- Owner konsolunda aynı rapora audit'li geçici kısıtlama verildi; sunucu
  SOCIAL_RESTRICTED reddetti. Aynı kapalı rapor ID'sinden kısıtlama geri alındı.
- Sentetik arkadaşlık/davet normal aksiyonlarla işlevsel geri kondu. Native
  arkadaş kartı tekrar göründü; açık ve koyu temada profil/güvenlik formu incelendi.
- Yeni koyu tema kanıtları `ios390-safety-friend-dark.jpg` ve
  `ios390-report-form-dark.jpg`; native açık tema formu `ios390-report-form-light.jpg`,
  engellenen liste `ios390-blocked-player-light.jpg` aynı özel screenshots klasöründe.
- Tema eski Light durumuna döndü. Native “Çıkış yap” sonucunda giriş formu ve
  “Yerel kayıtların korunuyor” doğrulandı. Konsol/API kabul oturumları da kapandı.

Bu yeni kabul390pt simülatördedir; iPad/başka genişlik/fiziksel moderasyon veya
TestFlight kurulumu olarak sayılmaz. İlk otomasyon girişinde eksik aktarılan
alanlar kimlik doğrulama hatası verdi; alanlar tam girilip başarılı gerçek giriş
tekrar doğrulandı. Bu otomasyon giriş hatası başarılı test olarak sayılmadı.
