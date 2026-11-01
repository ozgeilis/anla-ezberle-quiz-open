# Gerçek APK ve Android kabul kanıtları

## Router düzeltilmiş son APK

- [Expo kurulumu](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/7b26b1a6-947e-4602-ab46-b0570a7bba52) — **FINISHED**.
- [APK](https://expo.dev/artifacts/eas/UDlPfGbxI4flCaDy5KdcEAmIHzgpJE2zeLqWJTTad0k.apk)
- Kaynak **`d5edeb1b536b91ed378ac291c03ff3ee44b13a0c`**; SHA-256 **`ec51741fdac9e073e36e3cb1b80989df8d6af2721be65155cb75932cb630c80b`**; 111.021.669 byte.
- Paket/version/API ve sertifika önceki adayla aynı. APK imza/ZIP16KB ve 52 ELF64 LOAD hizalaması tekrar geçti.
- Android 16 üzerinde İman ve Ahlak/Kolay 10 soru, 8 doğru/1 yanlış/1 cevapsız, çift dokunma ve 800 puan/80 XP sonucu gerçek native olarak tekrarlandı. Android 14 Activity regresyonu aşağıda kaydedilir.
- Önceki `dab5d98` APK’sındaki global router sorunu bu yeni kaynakta `useRouter()` ile düzeltilmiştir; aşağıdaki eski bağlantı test geçmişidir, son kurulum bağlantısı değildir.


## Önceki aday APK — router regresyonunda başarısız

- [Expo kurulumu](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/b6745d39-e4dd-480e-95e1-53bb0a21405e)
- [İmzalı APK](https://expo.dev/artifacts/eas/mA0U7_yLZ-ucDEaQb1ZrTOFufd5SZHqW5ODaURDFmpY.apk)
- EAS durumu **FINISHED**, 30.10.2026 13:20:39 UTC; preview/internal, developmentClient=false.
- Kaynak: **`dab5d980290e18ea8573f34d30d00e10f222cca0`**. Sonraki rapor/görsel commit'leri APK'nın yeniden derlendiği anlamına gelmez.
- SHA-256: **`fb534b66191132cbcdce9eb510971670b497ddf4ce218d4e42c47d43df6d4907`**; 111.021.461 byte.
- Paket `com.kovynelstudio.anlaezberle`, versionName **0.1.0**, versionCode **1**, targetSdk **36**, compileSdk **37**, minSdk **24**.
- `apksigner verify` PASS; sertifika SHA-256 `6df507f045b6d7fee9147153cf815b36a0c4b072f2b55b6dcd6dda54486352b7`. İlk ve son preview APK'da aynı. Play App Signing kabulü veya AAB imzası olarak sunulmaz.
- `zipalign -c -P 16 -v 4` PASS. Ayrıca APK içindeki arm64-v8a ve x86_64 için 26’şar, toplam 52 ELF kitaplığının bütün LOAD segment hizalamaları en az 16 KB olarak okundu. Bu statik kontrol 16 KB cihaz/laboratuvar kabulü veya gelecekteki AAB'nin teslim kontrolü yerine geçmez.
- Audio, Notifications, WebBrowser ve Hermes native sınıfları gerçek DEX içinde bulundu. Android ABI'leri arm64-v8a, armeabi-v7a, x86, x86_64.
- Overlay, READ/WRITE_EXTERNAL_STORAGE, RECORD_AUDIO, AD_ID ve hassas konum izinleri yok. Bildirim/audio/ağ, badge ve SecureStore'dan devralınan biyometrik izinler manifestte mevcut; uygulamada biyometrik giriş sunulmaz. Bu izinler kamera/mikrofon kaydı yapıldığı anlamına gelmez.
- APK'da özel anahtar ve service-role JWT taraması bulgu vermedi. Ham Hermes byte taraması `sb_secret_` ön ekini komşu stringlerle birleştirip şüphe üretti; gerçek bytecode string tablosunda bunun **yalnız SDK'nın 10 karakterlik `sb_secret_` literal'i olduğu**, anahtar değeri olmadığı doğrulandı. Git değişiklik aralığında gitleaks bulgusu yok.

**P0 bulgu:** Android Activity yeniden oluşturulması/dış hazırlık bağlantısı sonrasında modül düzeyi router bazı çağrılarda kapanmış köprüye bağlı kaldı ve Start işlemi JS çökmesi verdi. Bu APK mağaza kabulü değildir. Aynı iz baseline crash kaydında da var. Yeni köke bağlı `useRouter()` düzeltmesinin APK sonucu ayrıca eklenir.

## Sürüm ayrımı

İlk baseline APK `567699f1-92bc-4547-973a-89217257da65`, kaynak `cb9b769`, SHA-256 `f42f5769f7c8563904ecc8c720948717080142d506e9ae9bcf03083f25ef862f`. İlk ayrıntılı akış/screenshot kabulü bunda yapıldı. SDK yama adayı için başlayan `9f0c9f15-12eb-403b-b1f3-d38e3a30ff17`, manifest düzeltmesi nedeniyle gereksiz tamamlanmasın diye iptal edildi. Nihai bağlantı yukarıdakidir; bu iki eski denemeyle karıştırılmamalı.

## Native matris

Gerçek AVD `AnlaClosedTest34`: Android 14/API 34, ARM64 Google APIs, Hypervisor.Framework, 2 GB RAM, density 320. Her iki APK bu emülatörde çalıştı. Nihai APK `install -r` ile güncellendi; imza/paket aynı, ilerleme kaldı. `AnlaClosedTest36`: Android 16/API 36, ARM64; nihai APK temiz kuruldu. Sıfır geçmiş/XP gösterildi. İki emülatör de başsız ve sesi kapalıdır; fiziksel Samsung veya işitsel kalite kabulü değildir.

320/360/390 dp × açık/koyu × 1/1.5/2 yazı ölçeği × ana sayfa/profil/ayarlar: **54 baseline + 54 nihai gerçek native görüntü**. Ana sayfa ve profildeki 36 matris durumunda beş alt sekmenin dokunma alanı en az 48 dp yükseklikte; etiket satır kutusu her ölçekte 14 dp, tek satır. Normal genişliklerde kartlar iki sütun; büyük yazıda tek sütun/uzun kaydırma erişilebilirlik uyarlamasıdır. Bu test sistem yazısını uygulama genelinde kapatmaz.

Gerçek native ekran görüntüleri aşağıdaki `screenshots/` dizininde seçili örneklerdir. Tam matris ve özel test kayıtları yerel kabul klasöründe kalır; kullanıcı kayıtları veya kimlik bilgileri burada yayımlanmaz. Arkadaş/inbox/oda görüntüleri **misafir giriş kapılarıdır**, giriş yapılmış sosyal ekranların native kabulü diye gösterilmez. Gerçek authenticated sosyal/oda protokolü ayrı yerel Auth/Edge entegrasyonunda test edildi.

Baseline turda 8 doğru + 1 yanlış + 1 cevapsız = 800 puan, 80 XP; ilk doğru cevaba çift dokunma çift puan vermedi. Kaynaklı inceleme ekranında yanlış ve cevapsız soru/açıklamalar görünür. Günlük tur uçak bağlantıları kapalıyken aynı sonuçla tamamlandı, rozet kazandı; Wi-Fi/veri açılıp uygulama force-stop/yeniden açıldıktan sonra geçmiş/XP korundu. Karma/Zor da gerçek 10 soruyla oynandı. Son APK'nın ek kabul sonuçları aşağıda güncellenir.

## Tamamlanmayan kabul

Fiziksel Samsung ses/titreşim/gecikme, gerçek native Google hesabıyla OAuth/callback, iOS, Google Pre-launch report ve imzalı store AAB bu raporla PASS yapılmaz. `approved=false` ve fiziksel kabul SHA'sı `null` kalır. Preview versionCode=1 bir mağaza upload planı değildir; ilk store üretimi onaydan sonra remote autoIncrement ile daha yüksek benzersiz versionCode almalı ve gerçek AAB tekrar denetlenmelidir.

## Router düzeltmesinin native regresyon sonucu

Android 14: 320 dp/%200/koyu, 360 dp/%100/açık, 390 dp/%150/koyu sistem ayarı değişimi → dış `prepare` bağlantısı → Start → gerçek quiz → çıkış → ana sayfa: **3/3 PASS**, yeni fatal crash yok. Büyük yazıda aşağıdaki butona önce kaydırmak gerekir; görünmeyen buton koordinatına dokunulmuş ilk test adımı kabul olarak sayılmadı. Sonuçlar `router-regression.json` içindedir. Son APK’nın 54’lü matrisi yeniden üretilmedi; önceki aynı UI matrisi ile yeni üç native regresyon ayrı sunulur.

`-baseline` adlı ekranlar ilk APK’ya, `fixed` adlı ekranlar son Router-düzeltilmiş APK’ya aittir. Ana sayfa/profil/ayarlar `dab5d98` matrisi ile görsel olarak aynıdır; sonrasında bu görsellere tasarım değişikliği yapılmadı.

Son düzeltilmiş APK ile Android 14/Karma/Orta turu: 7 doğru, 1 yanlış, 2 cevapsız; **700 puan, 70 XP**. Bir soru normal 10 saniyede, bir soru uygulama 11,2 saniye arka planda tutulduğunda cevapsız kaldı. Dönüşte eski soruya ek süre/puan verilmedi. Çift dokunma ve otomatik sonuç tekrar kontrol edildi.
