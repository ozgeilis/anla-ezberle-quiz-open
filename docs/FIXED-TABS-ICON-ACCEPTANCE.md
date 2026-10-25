# Sabit alt navigasyon ve onaylı ikon — 25 Ekim 2026

Bu çalışma `feat/fixed-tabs-approved-icon` dalında, mevcut Android/kategori
çalışmasını korumak için `feat/approved-special-category-art` (`e61b0ff`) üzerine
hazırlanmıştır. PR #2 ve #3 değiştirilmemiştir. Başlangıçta kontrol edilen main:
`d16b5a05e34fc433aa94efa8b90e6284eaf822ac`.

## Dar kapsam

- Yalnız PremiumTabBar etiketlerinde React Native Text, allowFontScaling=false,
  numberOfLines=1; 10 dp yazı / 14 dp satır, 20 dp ikon.
- Beş eşit sütun, her sekmede 48 dp dokunma yüksekliği; çerçeve ve padding dahil
  çubuk 57 dp. Mevcut kök SafeAreaView cihaz alt boşluğunu ayrıca ayırır;
  ikinci safe-area eklenmemiştir. Otomatik font küçültme kaldırılmıştır.
- Tam erişilebilir sekme adları ve selected bilgisi korunmuştur. Ortak Txt,
  sorular, açıklamalar ve uygulama geneli font ölçeği değiştirilmemiştir.
- Sağlanan üç runtime PNG birebir kopyalanmıştır. 512 px mağaza ikonu
  assets/store/play-store-icon-512.png olarak korunur. Android arka planı
  #005F65; paket kimliği ve app.json değişmemiştir.
- Ana sayfa, kategori çizimleri, oyun, hesap silme, sunucu ve stüdyo açılışına
  bu görev kapsamında değişiklik yapılmamıştır.

## Yapılan kontroller

- pnpm install --frozen-lockfile: başarılı.
- pnpm check: soru bütünlüğü 1500, TypeScript, lint ve 307/307 test başarılı.
- pnpm export:web: başarılı.
- Android prebuild --no-install: başarılı; tracked config/package değişmedi.
- Gerçek web uygulamasında 320/360/390 × açık/koyu × Chrome OS metin ölçeği
  1/1.5/2: 18 ekran görüntüsü ve DOM ölçümü. Her ölçümde çubuk 57 px,
  dokunma alanları 48 px, etiketler 10 px / 14 px tek satır ve kesilmeden sığıyor.
  Beş sekmeye tıklanarak hedef yollar ve seçili durumlar doğrulandı.
  Bu tarayıcı emülasyonu Android/iOS'un gerçek native fontScale kabulü değildir.
- Sağlanan 1024 px icon opak, 1024 px foreground şeffaf, favicon 256 px,
  mağaza ikonu 512 px. Dört dosyanın kaynakla SHA-256/bayt eşleşmesi doğrulandı.
- Ayrı inceleme görselinde Android 108:72 foreground yerleşimiyle circle ve
  rounded-square/squircle maskeleri ile iOS yuvarlatılmış maske, açık/koyu zemin
  ve 48 px görünüm kontrol edildi. Kaynak assetler değiştirilmedi.

## Gerçek APK

- EAS Free planı, preview/internal APK, FINISHED.
- Build: https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/2ad467d5-8754-4e55-85c5-a7c5484a2d5c
- Kaynak commit: bb0d50b3fcae9ce595c68f10815490e2b7c45164.
- İndirme: https://expo.dev/artifacts/eas/w594WNlldA8EO6vRo0GX7ZvNF26jnJ9pJ_WBOH4MCjM.apk
- SHA-256: 4491bdb2fdc491f1a040e65102d6c87c84c994d9fd87b3b20dbf6690c1d07808.
- Paket com.kovynelstudio.anlaezberle, sürüm 0.1.0 (1), target API 36.
- İmza geçerli ve önceki aynı paketli APK ile sertifika eşleşir.
- 15/15 native launcher/round/foreground yoğunluk kaynağı APK içinde yerel
  Expo prebuild çıktısıyla bayt düzeyinde eşleşmiştir. Adaptive XML foreground
  ve mevcut arka plan kaynağına bağlıdır.
- Ayrı, yeni API 36 emülatörüne APK kurulumu başarılıdır; eski telefon kurulumu
  veya verileri silinmemiştir. Emülatör ekranı kontrol aracına bağlanamadığından
  native görsel kabul yapılmamıştır. Yerel Android Studio sync ayrıca IDE PATH'i
  node'u bulamadığı için başarısızdır; başarılı EAS build'i bununla karıştırılmaz.

## Cihaz kabulü ve Git sınırı

25 Ekim 2026 tarihinde kullanıcı, Samsung A04 / Android 14 için gönderilen APK,
yeni ikon ve 100/150/200% sistem yazı boyutunda beş alt sekmenin kontrolü sorusuna
"Test ettim, GitHub'a aktarımı onaylıyorum" yanıtını vermiştir. Bu, kullanıcı
tarafından bildirilen cihaz kabulüdür; bağımsız araç ölçümü veya yeni native ekran
görüntüsü olarak sunulmaz. iOS gerçek launcher, TalkBack ve VoiceOver kabulü
açıktır. Diğer içeriklerin font ölçeği bu görevde değiştirilmemiştir.

Kullanıcının test ve onay koşulu karşılandığından dal GitHub'a aktarılıp mevcut
PR #3 dalını hedefleyen dar kapsamlı bir PR ile sunulur. Main'e merge veya üretim
dağıtımı bu aktarımın parçası değildir.
Main ile PR #2/#3 arasında özellikle hesap silme dosyalarında mevcut çakışmalar
vardır; bu dar görevde çözülmemiş, eski sürümleri main üzerine taşınmamıştır.
APK devam eden PR #3 tabanını test eder; güncel production main'in yerini almaz.
Entegrasyon sırasında yalnız bu dar diff uygun güncel dala taşınıp tekrar
doğrulanmalıdır; PR #2/#3'ün tamamı bu onayla main'e alınmaz.
Üretim, Vercel, Supabase ve Google Play Console değişmemiştir.

Ham test logları, ekran görüntüleri, ikon maske önizlemeleri, APK ve QR yerel
`tabs-icon-acceptance-20261025` kabul klasöründedir; build/Git'e katılmaz.
