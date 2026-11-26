# Son kalite kontrolü ve Hemen Oyna — 26 Kasım 2026

Aynı PR #33 / `content/question-bank-3000-validated-20261126` dalında devam edildi.
Başlangıç commit’i `98a9a6b`. PR açık ve taslak; main’e birleştirilmedi.
Diğer açık iOS PR’ları (#25, #26, #28, #30), 0.1.1 worktree’si ve
üretim kaynakları bu çalışmaya karıştırılmadı.

## İçerik

Önceki 3.000 soruluk tam kaynak/seçenek denetimi ve benzerlik kararları yeniden
kullanıldı. Dört veri kategorisinin her birinde sekiz kolay, üç orta ve üç zor
olmak üzere **56 soru** kök, dört şık, anahtar ve açıklamasıyla tekrar okundu.
Kolay örnekler yıl/terim/ayrıntı sinyalleri öne alınarak seçildi. Bu örneklem,
3.000 soruya yeni bir insan/ilahiyat uzmanı incelemesi yapıldığı iddiası değildir.

Yeni yanlış anahtar, birden fazla doğru şık veya yeni aynı-bilgi tekrarı bu
son örneklemde doğrulanmadı. **Sekiz hedefli düzeltme** yapıldı:

| Soru | Düzeltme | Gerekçe ve kaynak |
|---|---|---|
| new74-history-003 | Kolay → Orta | Mesnevî’nin özgün dili, temel ibadetten ziyade edebiyat bilgisi. TDV Mesnevî (Mevlânâ), giriş, satır 96 |
| new74-history-026 | Kolay → Orta | Işık-gölge/perspektif, sanat tarihi ayrıntısı. TDV Minyatür, 94–95 |
| v9-general-007 | Kolay → Orta | Fıkıh usulünde sünnet/kıyas/istihsan ayrımı. TDV Sünnet (Peygamber), 71 ve 111–112 |
| new74-prophets-373 | Orta → Zor | Berâ rivayetindeki belirli elbise rengi ileri ayrıntı. Diyanet Hadislerle İslâm cilt 6, fiziksel PDF 333, T1724 |
| new74-general-375 | Orta → Zor | Belirli gök/yıldız rivayetini hatırlama. Diyanet Hadislerle İslâm cilt 1, fiziksel PDF 311, M6466 |
| new74-quran-372 | Üç çeldirici yenilendi | Saf 61/8’deki benzetme için bütün şıklar aynı nur tasviri üzerinde. Diyanet Kur’an Yolu Meali fiziksel PDF 592 |
| new74-quran-368 | Üç çeldirici yenilendi | Bütün şıklar doğrulanmamış bilginin tasdik/ret yöntemi üzerinde. Diyanet Hadislerle İslâm cilt 1, fiziksel PDF 541, B7362 |
| e150-general-004 | Üç çeldirici yenilendi | İlgisiz kelime silme/tekrarlama yerine nefes ve duraklama ayrımları. TDV Sekte 96–97 |

Kimlikler, kategori atamaları, cevap anahtarları ve şık ID sıraları korunur.
1.500 yeni soru yeniden yazılmadı. Kaynak fişlerinin içerik SHA-256’ları,
manifest ve statik v74 snapshot’ı birlikte güncellendi. Eski v1–v73 dosyaları
aynı kaldı. Ayrıntılı önce/sonra: `final-quality-quick-play-review.json`.
Yeni dağılım `final-metrics.json` içinde; sayısal eşitlik için etiket değiştirilmedi.

Kaynaklar: [Minyatür](https://islamansiklopedisi.org.tr/minyatur),
[Mesnevî](https://islamansiklopedisi.org.tr/mesnevi--mevlana),
[Sünnet](https://islamansiklopedisi.org.tr/sunnet--peygamber),
[Sekte](https://islamansiklopedisi.org.tr/sekte),
[Diyanet meal](https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf),
[Hadislerle İslâm](https://hadislerleislam.diyanet.gov.tr/).

## Hemen Oyna

Mevcut `GameProvider.start` / `createSession` ve bağımsız soru seçicisi
kullanılır. Ana sayfadaki ana düğme doğrudan 10 soruluk karma tur açar;
"Kategori ve zorluk seç" ayrı, görünür seçenek olarak korunur. Mevcut altı
oyun ekranı ile dört veri kategorisi aynı şey değildir; hiçbir kategori ID’si silinmez.

Zorluk oranı yeni bir kayıttan değil, mevcut `rewardSummary` ve
`getLevelFromXp` sonucundan gelir. XP hesabı, seviye eşikleri ve ödüller değişmedi.

| Mevcut seviye | Kolay | Orta | Zor |
|---|---:|---:|---:|
| 1 | 10 | 0 | 0 |
| 2 | 9 | 1 | 0 |
| 5 | 6 | 4 | 0 |
| 7–9 | 4 | 6 | 0 |
| 10–14 | 3 | 6 | 1 |
| 15–19 | 2 | 6 | 2 |
| 20–100 | 1 | 6 | 3 |

İlk yedi seviyede her seviyede yalnız bir kolay soru orta soruya dönüşür.
Zor sorular ilk kez 10. seviyede, tek soruyla başlar. Bir sonraki seviyeye
gelince daha zor soru sayısı en fazla bir artar. Tur içinde kolaylar önce,
ortalar sonra, zorlar en son gelir; aynı zorluktakiler karışıktır.

Her turda dört veri kategorisi temsil edilir. Dört kategori tanığı seçilirken
aynı bilgi/kavram anahtarları dışlanır; kalan altı soru mevcut bağımsız seçim
çözücüsüyle tamamlanır. Geçmiş sorular ve anlam anahtarları önce mevcut
`unseenQuestionPool` ile çıkarılır. Uygun yeni havuz tükenmişse daha zor veya
çözülmüş sorulara sessizce geçilmez; kullanıcı kategori/zorluk seçmeye yönlendirilir.

Bu davranış yalnız `quickPlay: true` çağrısına aittir. Günlük yarışma,
elle seçilen kategori/zorluk/aşamalar ve eski kayıt biçimi değişmedi.
Yeni Hemen Oyna kayıtlarında isteğe bağlı `quickPlay: true` bilgisi taşınır;
sonuç ekranındaki Tekrar Oyna böylece aynı kademeli akışa döner. Eski kayıtlara
alan eklenmez veya migrasyon uygulanmaz. Kayıt doğrulayıcısı bu işareti yalnız
v74 ve kategori filtresiz karma turlar için kabul eder.
20 saniye, reklam geçişi, Auth, hesap silme, sosyal özellikler ve skor mantığı değişmedi.

## Google native kaynak eksikliği

Hata soru bankasından önceki `3a74086` tabanında da var: Git yalnız
`modules/google-native-signin/expo-module.config.json` dosyasını içeriyor.
Kök `.gitignore` dosyasındaki sınırlandırılmamış `ios/` kuralı, modülün altındaki
`GoogleNativeSignIn.podspec` ve `GoogleNativeSignInModule.swift` dosyalarını da
yok sayıyor. Aynı özgün dosyalar iOS release worktree’sinde mevcut; değiştirilmedi,
tahminle yeniden oluşturulmadı veya içerik PR’ına kopyalanmadı.

Hedefli yeniden testte iki Google native testinden biri geçti, Swift dosyasını
okuyan test ENOENT ile başarısız oldu. Mevcut binary bu görevde değişmedi.
Git’ten temiz iOS derlemesi için özgün native modül dosyalarının ilgili iOS
çalışmasında doğrulanıp kayda alınması gerekir. Bu nedenle bütün uygulama
yayın engelleri giderilmiş gibi raporlanmaz.

## Test ve yayın sınırı

Yalnız değişen içerik ve oyun akışı kontrolleri çalıştırıldı: **47 hedefli test,
TypeScript ve değişen dosyaların lint kontrolü geçti.** Önceki tam paket
sonucu (482 test / 481 başarılı) tarihî kanıt olarak korunur, bu tur yeniden
çalışmış gibi gösterilmez. Güncel hedefli sonuçlar `test-results.json` içindeki
`finalQualityQuickPlay` alanında ve PR CI’sında izlenir.

Yerel web export gerçek kaynakla geçti; yerel tarayıcı aracı Work ayarlarında
kapalıydı. İzole CI Chromium testi; gerçek düğme/rota, 320/390 genişlik,
açık/koyu tema, dört kategori, ilk tur 10 kolay, 20 saniye, sonuç, depolama
ve yeniden açılışı kontrol etti ve **geçti**. Bu bir fiziksel iPhone/Android testi değildir.

Yeni IPA/AAB, mağaza gönderimi, canlı Supabase veya main merge yapılmadı.
0.1.1’e dahil etmeden önce: PR #33’ün kaynak/inceleme kabulü, iOS native
kaynak eksikliğinin ilgili yayın dalında çözümü, onaylı birleştirme sırası ve
ayrı paket/yayın kabulü gerekir. Canlı v74 soru kümesi etkinleştirmesi de ayrı onaylıdır.

## Son kabul kanıtı

[CI 45794437930](https://github.com/ozgeilis/anla-ezberle-quiz-open/actions/runs/45794437930)
**cbde74c1ece3ca00fdfe6378231925e38fc0a846** uygulama/test kaynağı için tamamen geçti:
tam TypeScript, tam lint, manifest, 40 seçili içerik/geçmiş/Hemen Oyna testi,
web export, gerçek Chromium ve izole Supabase SQL. Yerelde 47 test farklı,
kısmen örtüşen kapsamdadır; toplam 87 ayrı test iddia edilmez.

Gerçek tarayıcıda 320 ve 390 genişlik × açık/koyu olmak üzere dört senaryo,
beş tam tur / 50 soru tamamlandı. İlk turda 10 kolay; 390/açık tekrar turunda
9 kolay + 1 orta ve 20 farklı ID doğrulandı. Dört kategori, 20 saniye, skor,
kayıt/yeniden açılış ve elle kategori seçimine dönüş geçti. 12 gerçek PNG ve
kabul JSON'u [CI artifact'ında](https://github.com/ozgeilis/anla-ezberle-quiz-open/actions/runs/45794437930/artifacts/15103443970).
Dosya SHA-256'ları ve görsel kontrol kaydı `BROWSER-ACCEPTANCE.json` içindedir.
Ana sayfa, soru ve skor görüntüleri ayrıca gözle incelendi; 320 genişlikte
skorun üstü kesilmiyor. Bu testler canlı hesap kullanmadı, uzak istekler engelliydi.

İzole SQL'de v74 tam 3.000 kayıt ve özel anahtar/ACL sınırı, v73 kaynaklarının
ve başlamış maçın korunması, 264 havuz birleşimi, sunucu puanlaması,
20 saniyelik yeni maçlar ve eski sürelerin değişmezliği geçti. Gerçek canlı
Supabase'e bağlanılmadı veya migration uygulanmadı.

İlk CI denemesi Playwright/Ubuntu 26.04 uyumsuzluğunda başarısız oldu; çalıştırıcı
Ubuntu 24.04'e sabitlendi. İkinci deneme uzun kurulumun ardından tarayıcı testi sürerken teşhis için
durduruldu; kısmi ekranları korundu. Son koşuda kurulum/test ayrı adımlar ve
sınırlı beklemelerle tamamen geçti. Bu ara denemeler başarı gibi gösterilmez.

Son belge commit'i yalnız kanıt ve durum kayıtlarını günceller; uygulama,
içerik, migration ve test kaynakları başarılı cbde74c ile birebir aynıdır.
Gereksiz CI tekrarı önlenir. PR #33 açık/taslak olarak kalır. Temiz Git iOS
native kaynak engeli ve 0.1.1 bütünleştirme/yayın onayı hâlâ gereklidir.
