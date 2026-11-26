# Son entegrasyon kontrolü — 26 Kasım 2026

İlk kaynak `6a78687`; yalnız bu entegrasyon dalında kanıt/plan tamamlanır.
PR #33 ve main/diğer worktree kaynakları değişmez. Yeni kod, SDK, soru, IPA,
canlı SQL veya App Store kaydı değişikliği yok.

## Git durumu

Main `1c6a3d876a4ae01661feff22db5823cad4c1b926`; #33 `a38d1ea`.
Açık PR başları önceki `pr-inventory.json` ile aynı. Entegrasyon dalında main
ve #33 ancestry'si mevcut. Gizlilik metni ve app-ads.txt main ile byte eşit;
banka/Hemen Oyna kaynağı #33 ile byte eşit. Ayrı yeni branch açılmadı.

Doğru sıra: #25 → #26 → #28 → #30 → bec601e..3a74086 → #33 → c01884a.
#33 tabanı content/question-bank-3000-base-20261126 olduğundan main'e doğrudan
ulaştığı varsayılmaz. Ara iOS kuyruk commit'leri ayrı inceleme aralığı olarak
korunmalı; önceki privacy çakışması mevcut entegrasyon dalında çözülüdür.
Main'e merge onayı henüz yok, işlem yapılmadı.

## Değişmeyen testlerin yeniden kullanılması

80 hedefli test ve temiz unsigned simulator Release kabulü `db0b516` için
gerçekten geçti. Bu görevde uygulama/test/native kaynak değişmediği için
aynı testler ve derleme gereksiz yere tekrar çalıştırılmadı.

v74 migration, SQL testi, izole DB sürücüsü, iki export modülü ve snapshot
başarılı izole CI `45794437930` / `cbde74c` ile birebir aynı. SHA eşitliği
`v74-unchanged-ci-evidence.json`; GitHub job 139821360828 adımları yeniden
okundu ve SQL acceptance success görüldü. Bu taze bir SQL koşusu değildir.
Yerel Docker salt-okunur erişim denemesinde yanıt vermedi; yeniden başlatılmadı.

## Public production istemci yapılandırması

Git dışı `public-client.env` dosyası, mevcut Frankfurt endpoint'i ve
publishable key içeriyor; service-role/secret key eklenmedi. Anahtar rapora
veya Git'e yazılmadı, yalnız SHA-256 ve boolean kontrolü kaydedildi.
`production-client-preflight.json` source/env kontrolüdür. Yeni production
paketi yoktur; nihai Hermes içindeki public config kabulü henüz yapılamaz.
Gerçek iOS AdMob resolver eşitliği önceki raporda korunur; hiçbir reklam isteği
veya gerçek reklam tıklaması yapılmadı.

## Apple canlı kontrolü

Apple oturumu kullanıcı tarafından yenilendi. Salt okunur sayfalar:
- Distribution: **0.1.1 / Build 13 / Ready for Distribution**.
- Marketing URL: **https://anla-ezberle-quiz.vercel.app**; alan read-only.
- Manuel yayın radio değeri seçili; otomatik yayın seçilmedi/değiştirilmedi.
- Build Uploads: en yüksek görünen 13, Complete, Nov 12, 2026 6:51 AM;
  14 görünmüyor. **14 bir sonraki adaydır, rezerve edilmedi.** Paket günü
  yeniden kontrol edilmelidir. Yeni sürüm/build alanı değiştirilmedi.
- App Privacy: Published 14 days ago, **17 tür**; SDK'nın sekiz türünün
  amaç/linked/tracking kapsamı uyumlu. Gereken Google SDK form düzeltmesi yok.

Canlı 0.1.1 durumu, 11 Kasım tarihli Prepare for Submission kaydının yerini
alır. Apple yeni bir binary güncellemesi için yeni App Store sürümü oluşturma
akışını öngörür: https://developer.apple.com/help/app-store-connect/update-your-app/create-a-new-version .
**Entegre v74 adayı için 0.1.2 öneriliyor; kullanıcı onayı yok, oluşturulmadı.**
Yayımlanmış 0.1.1 Build 13 yeni entegre adayın kodu olarak kullanılmaz.

Özel App Review ekranının AX çıktısı incelemeci alanını maskesiz döndürdü;
hiçbir ham snapshot/kimlik bilgisi kanıt dosyasına, Git'e veya rapora alınmadı.
Sonraki UI çıktıları filtrelendi. Bu nedenle yalnız incelemeci uygulama
parolasının güvenli yenilenmesi ayrı kullanıcı onayı/elle credential adımı
olarak açık tutulur. Hesap veya parola bu görevde değiştirilmedi.

## Gerçek iPhone kabulüne hazırlık

CoreDevice salt-okunur envanterinde iPhone 11, developer mode enabled,
**disconnected** göründü. Fiziksel etkileşim/giriş/oyun/QA reklam testi yapılmadı.
Mevcut temiz build imzasız simülatör uygulamasıdır; iPhone'a kurulabilir güncel
entegre Development QA paketi henüz üretilmedi. Yeni IPA bu görevde yasak.

Sonraki dar onay, yalnız aynı Team/Bundle ile mevcut uygulamayı silmeden
Development QA test güncellemesi hazırlayıp kurmayı, test reklamı kullanmayı
kapsayabilir. Production IPA/upload veya backend açılışı bununla karıştırılmaz.
Kısa liste README içindedir: mevcut yetkili hesaplarla Google/Apple/email,
iptal/oturum yeniden açılışı, yerel XP ve eski v73 sonuçları, Hemen Oyna,
20 saniye ve sonuçtan çıkışta test interstitial. Yeni hesap/silme testi
istenirse kapsamı ayrıca açıkça onaylanmalı; gerçek hesap silinmez.

## Yayın kapıları

- GitHub entegrasyon kaynağı hazır; tam main farkı geniş iOS PR zincirini
  içerir, yalnız native iki dosya olarak sunulmamalı. final-git-preflight.json
  önceki 6a78687 kaynağının 589 dosyalık farkını kategori bazında kaydeder;
  bu tur yalnız yeni kanıt/plan belgeleri eklenir. Main merge onayı bekler.
- SDK privacy engeli kapandı; 17 mevcut tür korunur. Manifest değiştirilmedi.
- v74 migration + özel export hash'leri planlı; canlı drift kontrolü,
  kapalı staging ve etkinleştirme ayrı onayları bekler. V74-CUTOVER-AND-ROLLBACK.md.
- Sürüm numarası kararı, gerçek iPhone QA ve final artifact client/ads/config
  kabulü olmadan production IPA aşaması hazır sayılmaz. Önceki 12/13 korunur.
- App Privacy Publish/App Review/public release bu görevde yapılmaz.
