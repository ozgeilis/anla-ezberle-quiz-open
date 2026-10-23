# Oyun içi ses

## Kapsam ve varlıklar

Ses, oyun durumunun gözlemcisidir; yanıt kabulü, puanlama, XP, rozet değerlendirme, süre ve sunucu kuralları değiştirilmez. Yeni sunucu, migration, Supabase tablosu, telemetri veya lig sistemi yoktur.

`assets/audio/` altında 10 özgün efekt ve 24 saniyelik özgün enstrümantal döngü bulunur. Toplam 1.529.764 bayt PCM16 mono WAV, 24 kHz. Haricî kayıt, sample, beste, tilavet veya ezan kullanılmaz. Üretim kaynağı `scripts/generate-game-audio.py`; süre/tepe/RMS/SHA-256 kayıtları `manifest.json`, varlık kullanım bilgisi aynı klasördeki README’dedir. Efektler aynı D majör pentatonik mallet/kristal ailesindedir. Yumuşak atak/sönüm, sınırlı harmonikler ve sıfıra inen efekt sonları kullanılır. Müzik döngüsünün örnek ve eğim sürekliliği ölçülür. Teknik ölçüm öznel dinleme değerlendirmesi değildir.

## Tek merkez, iki platform sürücüsü

`SoundProvider` ve saf `SoundController` uygulama kökünde bir kez yaşar. Native iOS/Android Expo SDK 58 ile uyumlu `expo-audio ~58.0.10` kullanır. Dört yaygın efekt önceden, kalanları yarışma alanına girerken hazırlanır; oynatıcılar tür başına yeniden kullanılır. Oynatıcı/buffer sayısı 11 ile sınırlıdır. Unmount tüm zamanlayıcı/oynatıcıları temizler. Eski development client’ta ExpoAudio binary modülü yoksa dinamik import hatası yakalanır; oyun sessiz çalışır. Native ses için bu modülü içeren yeni development build gerekir; JavaScript export, cihazda çalışan binary testi değildir.

Expo’nun web HTMLMediaElement.volume uygulaması iOS Safari’de programatik ses düzeyi kısıtına sahiptir. Web sürücüsü aynı yöneticinin Web Audio AudioContext/AudioBuffer/GainNode uygulamasıdır; ekstra ses bağımlılığı yoktur. Yerel Expo assetleri decode edilir, buffer’lar tekrar kullanılır. Her oynatma için gereken tek kullanımlık source node sonlandığında disconnect edilir. 48 kHz cihazda çözülmüş ses verisi yaklaşık 6 MB’dır. Safari uyumlu gain ramp’ı ve merkezi müzik fade’i kullanılır. Güvenilir pointer/klavye etkileşimi olmadan context resume/oynatma başlatılmaz. Sessiz/duyulmayan autoplay aşma hilesi yoktur; tarayıcı reddi oyunu etkilemez. Yeni sayfa açılışında kayıtlı müzik tercihi bile kullanıcı etkileşimini bekler.

Referanslar: [Expo Audio SDK 58](https://docs.expo.dev/versions/latest/sdk/audio/), kullanılan paketin `AudioPlayer.web.ts` iOS Safari volume uyarısı ve `plugin/build/withAudio.js` izin üretimi. Native mod: playsInSilentMode=false, interruptionMode=mixWithOthers, recording/background kapalı, keepAudioSessionActive=false. Böylece başka uygulamanın müziği durdurulmaz veya sesi kısılmaz. Tarayıcı fiziksel sessiz anahtarının durumu bir web API’siyle okunamaz; gerçek iPhone kabulü ayrıca gereklidir.

## Tercihler ve yaşam döngüsü

Ayarlar → Ses ve Müzik: Ses Efektleri, Arka Plan Müziği, Efekt Ses Seviyesi, Müzik Ses Seviyesi ve Efekti dene. Varsayılan efekt açık, iki ses düzeyi %50, müzik kapalı. Büyük +/− alanlarıyla %10 adım, erişilebilir değer/ayarlama eylemleri, gerçek kaydedilen yüzde gösterilir. Kullanıcı değişikliği AsyncStorage’a yazılmadan uygulanmaz; hata eski tercihi korur. Okuma bozuksa kayıt üstüne yazılmaz, sesler susturulur ve yeniden okuma sunulur. Oyun çalışmaya devam eder.

Aynı mevcut AsyncStorage altyapısında yalnız cihaza ait ayrı `@anla-ezberle-quiz/preferences/audio/v1` anahtarı kullanılır. İlerleme/profil/geçmiş kaydı veya çevrimiçi kimlik anahtarları değiştirilmez. Ses tercihleri hesaplar arası puan/kimlik verisi taşımaz.

Müzik yalnız açıkça izinli menülerde kullanıcı açarsa çalar; quiz/results/demo/live/asenkron maç alanlarında durur. Foreground/visibility değişiminde arka plana geçen tüm efekt ve müzik hemen durur, bekleyen kutlamalar düşürülür. Dönüşte eski efektler yeniden çalmaz; izinli menüde kayıtlı müzik tercihi tarayıcı izin verirse devam edebilir. Menü fade’i 240 ms; geri planda fade beklenmez. Efektler kendi müziğini hafifçe bastırabilir, başka uygulamaların sesini etkilemez.

## Gerçek olay sözleşmesi

- Tap ortak UI düğmesi; radio ve kategori seçimi yumuşak select. Seri dokunuşlar 90 ms sınırı ve tek efekt sesi ile kontrol edilir.
- Solo cevap sesi yalnız yeni kabul edilmiş `chosen` geçişinden, gerçek doğruluğa göre gelir. Rerender/elapsed timer/tercih değişimi tekrar tetiklemez. Gerçek cursor geçişi next üretir.
- Demo ve asenkron düelloda açıklanmamış doğru cevabı sesle ele vermemek için kabul sesi nötrdür. Sunucunun henüz kabul etmediği pending cevap ses üretmez. Canlı oyunda doğru/yanlış/timeout yalnız sunucunun reveal/review durumundan gelir; yerel sayacın sıfıra gelmesi yeterli değildir.
- Solo sonuç aynı game ID için bir defa completed veya perfect üretir. Canlı/asenkron sonuç yalnız gözlenen yeni completed geçişinde; geçmiş tamamlanmış maçı açmak kutlamaz.
- Yerel rozet sesi yalnız mevcut oturumda tamamlanıp kaydedilen oyunla yeni kazanılan rozet grubuna; sosyal rozet sesi yalnız ilk snapshot’tan sonra yeni sunucu ödülüne aittir. Geçmiş albüm yüklenirken çalmaz.
- Yerel seviye sesi yalnız yeni kaydedilmiş sonuçla gerçek `progress` artışına; çevrimiçi seviye sesi aynı hesabın mevcut sunucu profilinde gözlenen artışa aittir. Hesap değişimi veya ilk yükleme artış sayılmaz.
- Olay kimlikleri en fazla 512 girdilik geçici bellekte tekilleştirilir. Kapalı/arka planda gelen olaylar da tüketilir; sonradan açmak geçmişi çaldırmaz. Aynı anda bir efekt ve bir düşük sesli müzik sesi vardır. En fazla üç gerçek kutlama sıraya alınır. Düşük öncelikli UI sesleri yoğun geri bildirim sırasında atlanabilir. Quiz→results geçişinde gerçek ödül kuyruğu korunur; başka sayfaya geçişte durdurulur.

## Kabul ve sınırlar

`tests/audio.test.ts`: tercihler, kapalı/yüklenmemiş durum, tekrar/seri basma, tek ses/kuyruk, müzik izin/fade/arka plan, oynatma hataları, duraklatma/temizleme, accepted/revealed olaylar ve WAV bütünlüğü için yedi hedefli test. Önceki 288 test korunur.

`scripts/check-audio-config.mjs`: Expo introspection sonucunda gerçek üretilen iOS plist / Android manifest denetlenir; mikrofon izni, audio background mode ve ses foreground servisleri yoktur. Paket/scheme kimlikleri aynıdır.

CI `game-audio.yml` gerçek Chromium ve WebKit AudioContext’inde yerel dosya decode, nonzero örnek sinyali, gain, autoplay, kalıcı tercih/reload, yazma hatasında geri alma, kapalı cevaplama, offline buffer, iki gerçek 10-soruluk UI turu, 240→340 XP gerçek seviye atlama, yeni rozet, sıradan/mükemmel sonuç ve 320/390/tablet açık-koyu arayüzünü denetler. Test probe’u yalnız CI sayfasına enjekte edilir; uygulamaya gönderilmez. Sentetik geçmiş/oracle özel `/tmp` dosyasındadır, Expo/GitHub artifact’e girmez. Üretime hesap/puan eklenmez.

CI sonucu PR’da raporlanır. WebKit, fiziksel Mobile Safari veya iPhone sessiz modu testi sayılmaz. Native bundle export ve yapılandırma denetimi de fiziksel iOS/Android testi değildir. Gerçek cihaz, sessiz anahtar, Bluetooth/kulaklık kesintisi, telefon araması ve başka uygulamayla fiziksel ses karışımı kabulü ayrıca raporlanmalıdır. Öznel ses kalitesi kullanıcı dinlemesiyle de değerlendirilmelidir.
