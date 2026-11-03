# Yerel iPhone reklam kabulü — QA6

3 Kasım 2026. Bu plan App Store/TestFlight veya Android dağıtımı değildir.

- Uygulama kaynağı: `9d583298b4a97e09fe4380c7fd3c38f78bafb5b5`.
- Hazır Hermes JS SHA256:
  `4ae2e909809cf592e8a7a2483e904bffd05cbad79b0e72f38482a15e981bb2e0`.
- 24 reklam ve 39 oyun/sayaç/sonuç testi, TypeScript ve lint geçti.
- Mevcut fiziksel build 5'in ayrı .app kopyası hazırlanır. Native executable
  birebir aynı SHA'dadır; GMA 13.10.0, UMP 3.1.0, ATT, ikonlar ve mevcut
  provisioning korunur. Kopyaya güncel JS ve 63 varlık konur; yalnız kopyanın
  yerel build numarası 6 olur. Build 5 dosyası/kanıtları üzerine yazılmaz.
- Gömülü Frankfurt publishable client yapılandırması kontrolü geçti;
  administrator/özel anahtar istemciye konmaz. GMA/UMP/config son kontrolü
  imzalama ve kurulumdan önce ayrıca çalışır.
- `IOS_ADS_MODE=test`; Google TestIds kullanılır. Gerçek yayıncı birimleri
  bu paketin runtime config'inde yoktur. İlk yaş uygunluğu false kalır.
- Mevcut Apple Development kimliği/provisioning, Team `W7CRC43SHP`, Bundle
  `com.kovynelstudio.anlaezberle` ile yalnız ayrı kopya yeniden imzalanır.
  Yeni sertifika/anahtar/capability veya ücretli işlem yapılmaz.
- iPhone 11'de uygulama kaldırılmadan güncellenir; yerel ilerleme korunmalıdır.
  Kurulum bu cihazdaki uygulamayı yeni yerel QA6'ya günceller; eski build 5
  dosyası geri alınabilir şekilde korunur. Veriyi silerek geri dönüş yapılmaz.
- iOS UMP mesajının ve herkese açık gizlilik metninin yeni politikayla eşleşmesi
  beklenir. Web/main yayını ayrı onaydır; UMP mesajı mevcut form tercihine göre
  sahibi tarafından etkinleştirilir. Apple App Privacy Publish yapılmaz.
- Yaş belirsizliğinde reklam yokluğu; yetişkin ve UMP kabulü; ATT ret/geri alma;
  test banner/geçiş; gizlilik tercihini yeniden açma; çevrimdışı/hata; arka plan
  ve soru sırasında reklam yokluğu gerçek cihazda kontrol edilir. Fiziksel
  cihaz UMP tarafından test cihazı olarak tanınmadıkça EEA override çalıştı
  sayılmaz; EEA denemesi gerekirse mevcut simülatör ayrı kanıt olarak kullanılır.
- Ağ veya SDK hatası oyunu/XP'yi engellememelidir. Gerçek gelir reklamlarına
  tıklama veya impression üretme testi yoktur. Kullanıcı kod/şifre paylaşmaz.

Yeni IPA/EAS build, Apple'a yükleme, TestFlight dağıtımı, main merge, Vercel
Production, canlı Supabase, Android Alpha veya gerçek reklam etkinleştirme bu
yerel imzalama/kurulum planına dahil değildir. Uygulama mağazaya hazır ilan edilmez.
