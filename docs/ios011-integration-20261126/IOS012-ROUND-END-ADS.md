# iOS 0.1.2 — tur kaydı sonrası, sonuçtan önce geçiş reklamı

27 Kasım 2026. Mevcut entegrasyon dalında, marka kaynağı `49604bf` üzerine.
Yeni IPA, imzalama, cihaz kurulumu, main merge, mağaza veya backend işlemi yok.

## Son kullanıcı kararı — iki turda bir

27 Kasım, yayın hazırlığı sırasında sıklık kullanıcı tarafından **iki tamamlanan
turda bir** olarak değiştirildi. iOS'ta toplam kalıcı tur sayısı 2, 4, 6…
olduğunda hazır reklam denenir; 1, 3, 5… olduğunda doğrudan sonuç açılır.
Eski kayıtlar sayıya dahildir: bu cihazda önceki 23 turdan sonra ilk yeni tur
24 olduğu için reklam denenebilir. Uygulamayı kapatmak fazı sıfırlamaz.
Reklam yoksa bekletilmez ve aynı tur sonradan yeniden denenmez.
Android'in üç tur/beş dakika davranışı korunur.

Bu son tek satırlık politika değişikliği için 39 hedefli reklam/izin testi,
TypeScript ve değişen dosyalar lint'i geçti. Beş tur / 50 soru fixture'ında
1, 3, 5 doğrudan sonuç; 2 ve 4 saved → ad → closed → results olarak doğrulandı;
2 creative kapatıldı, 2 yeni preload yapıldı. Aşağıdaki 53 test / her tur
reklam kanıtı önceki f997dad kaynağının tarihsel kaydıdır.

## Yerleşim davranışı

Son sorunun mevcut cevap geri bildirimi tamamlanınca (doğru/yanlış/20 saniye
timeout aynı bitiş yolunu kullanır):

1. `QuizScreen` yalnız iOS solo/günlük/Hemen Oyna için tur bitişini bir kez işler.
2. `GameProvider.finish()` mevcut yerel sonucu kaydeder ve aktif soru saatini
   kapatır. Yeni `getSnapshot()` kalıcı kayıttan sonra ref'leri okur; React'in
   önceki render'ına bakılarak kayıt başarılı varsayılmaz. XP/puan hesabı değişmedi.
3. `completeRound` yalnız kaydedilmiş, mevcut, on cevaplı sonuç ve sona ermiş
   oturum için; foreground, SDK/UMP/ATT hazır ve kilitler uygunsa deneme yapar.
   Sonraki yüklemeyi beklemez. Aynı turun yinelenen callback'i/foreground dönüşü
   yeni deneme oluşturmaz; gösterim denemesi öncesi mevcut tüketilmiş sonuç
   kaydı da kalıcılaştırılır. Asenkron bekleme sonrası nesne/generation ve aktif
   uygulama yeniden kontrol edilir.
4. Hazır reklam gösterilirse native CLOSE/ERROR sonrası Results açılır.
   Hazır değilse veya gösterim başarısızsa Results doğrudan açılır. Yerel tur
   kaydı başarısızsa reklam denenmez; mevcut sonuç/yeniden kaydetme UI'si korunur.
5. `6816a42` interstitial cycle değişmedi: kapatılan nesne emekli edilir,
   listener'ları kaldırılır, güvenli durumda sonraki nesne arka planda yüklenir.
   Sona ermiş ve kaydedilmiş `/quiz` bekleme aralığı artık güvenli preload/show
   noktasıdır; gerçek aktif session varken bu izin verilmez.
6. iOS Results ekranının Ana Sayfaya Dön ve Tekrar Oyna işlemleri doğrudandır.
   Eski sonuç-çıkış çağrısı yanlışlıkla yapılsa bile iOS politikası reddeder.

Android ve web sonuç-çıkış yolu korunur. Android'in üç tur/beş dakika kuralı,
reklam kimlikleri, banner, native runtime, UMP, ATT, NPA/G kontrolleri değişmedi.
Demo düello ve çevrimiçi oyun ekranlarına yeni reklam eklenmedi.

## Değişen kaynaklar

- `src/features/quiz/QuizScreen.tsx`: save → ad → Results bitiş sıralaması.
- `src/features/quiz/ResultsScreen.tsx`: iOS çıkış/replay reklam çağrısını kaldırma.
- `src/storage/GameProvider.tsx`: güncel, salt okunur ref snapshot erişimi.
- `src/features/ads/roundCompletion.ts`: tek tur kapısı, güvenli tamamlanma,
  platforma göre sonuç çıkışı ve sıralama.
- `src/features/ads/adPolicy.ts`: iOS round-complete; Android legacy placement.
- `src/features/ads/AdProvider.tsx`: yeni tetikleyici, taze kayıt/nesne kontrolleri
  ve kaydedilmiş tur sonundaki güvenli preload.

## Bu değişiklik için gerçekten çalıştırılan kontroller

- TypeScript `tsc --noEmit`: GEÇTİ.
- Tüm depo ESLint `eslint . --max-warnings=0`: GEÇTİ.
- Sekiz ilgili test dosyasında **53/53** test: GEÇTİ.
- Gerçek domain motoruyla aynı JS oturumunda 5 tur / 50 soru, native SDK olay
  fixture'ı: her turda **saved → ad → closed → results**. Son soruda doğru,
  yanlış ve tam 20 saniyelik timeout; 5 farklı creative, 5 CLOSE ve 5 yeni
  preload. Kayıt/XP reklam boyunca değişmedi.
- Reklam hazır değil/no-fill, geç gelen LOADED, depolama hatası, native hata,
  background/disposal, yinelenen final/CLOSE, stale callback ve iOS Home/Replay
  reklam açmama: GEÇTİ. Android eski cadence/delegation testleri de geçti.
- Auth, 3.000 soru ve Hemen Oyna kaynakları değiştirilmedi; mevcut timer,
  Quick Play/XP, sonuç ve UMP/ATT regresyon testleri bu 53 kontrol içindedir.
- Yeni yerleşim için fiziksel iPhone: **ÇALIŞTIRILMADI**.
- Yeni native build/IPA: **ÇALIŞTIRILMADI**, talimat gereği.

Komut:

```
tsx --test tests/ads.test.ts tests/interstitial-cycle.test.ts \
  tests/round-completion-ads.test.ts tests/ios-ads.test.ts \
  tests/question-timer.test.ts tests/feedback-transition.test.ts \
  tests/quick-play.test.ts tests/result-presentation.test.ts
```

Önceki `49604bf` yerel QA15 cihaz kabulünde yeni isim/logo, Google/Apple ve
normal e-posta doğrulama, eski 18 oyunun korunması ve aynı işlemde beş test
reklamı doğrulanmıştı. Bu kanıt **eski sonuçtan çıkış** yerleşimine aittir;
yeni ad-before-results yerleşiminin fiziksel başarısı sayılmaz.

## İzinli sonraki paket aşamasında kısa fiziksel kabul

Uygulamayı silmeden aynı Bundle ID'ye test reklamlı güncelleme kur. Tek açılışta
beş 10 soruluk tur: son cevap/timeout → kayıt → TEST reklamı → sonuç sırasını
kontrol et. Her turda en fazla bir deneme; Results Home ve Replay'de reklam yok.
Hazır reklam yokken anında sonuç, background dönüşünde çift reklam olmaması,
önceki kayıtlar ve XP'nin korunması ayrıca doğrulanmalı. Test reklamı kullanılmalı;
production reklamına tıklama veya yapay gösterim oluşturma.

Bu fiziksel kabul ve yetkili paket doğrulaması tamamlanmadan yeni yerleşim
production cihazında test edilmiş sayılmaz.
