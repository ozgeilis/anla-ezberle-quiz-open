# 3.000 soruluk banka — v74

26 Kasım 2026. İlk dal korunuyor: `content/question-bank-3000-20261125`.
Son doğrulanmış dal: `content/question-bank-3000-validated-20261126`.
Kaynak tabanı: `3a74086dfa8fc65b3ee2a7e5e91eee9e2b874fce` (mevcut iOS çalışma kaynağı).
Bu dalda v74, 3.000 soruyla uygulamaya bağlandı. Main, diğer worktree’ler,
Android Alpha, iOS paketleri ve canlı Supabase değiştirilmedi.

## Gerçek dağılım

Kullanıcının kararı: dört mevcut veri kategorisine **375’er yeni soru**;
eski kategori kimlikleri ve atamaları korunur. Altı oyun ekranı ayrı ve sürümlü
konu haritası kullanır; bunlar dört veri kategorisiyle karıştırılmaz.

| Kategori | Eski | Yeni | Toplam | Kolay | Orta | Zor |
|---|---:|---:|---:|---:|---:|---:|
| Kur’an | 450 | 375 | 825 | 210 | 498 | 117 |
| Peygamberler | 230 | 375 | 605 | 220 | 233 | 152 |
| İslam Tarihi | 401 | 375 | 776 | 139 | 367 | 270 |
| Genel Bilgi | 419 | 375 | 794 | 328 | 319 | 147 |
| TOPLAM | 1500 | 1500 | 3000 | 897 | 1417 | 686 |

Zorluklar her soru ve gerçek seçenekleri üzerinden yeniden değerlendirildi.
İlk planın 1.000/1.000/1.000 tahmini gerçekleşmiş gibi sunulmaz; sırf sayıları
üçe bölmek için bir soru kolay veya zor yapılmadı. Kur’an kategorisi orta,
tarih kategorisi orta/ileri bilgi yönünden daha yoğundur. Dağılım eşit değildir;
her kategoride ve altı oyun ekranının her seviyesinde oynanabilir bağımsız
10 soruluk turlar doğrulandı. Ayrıntılar: `final-metrics.json`.

## Eski bankanın denetimi ve değişiklikler

- 1.500 eski soru için kaynak pasajı karşılaştırması ve kök/dört şık/anahtar
  okuması kayıt altına alındı. Kanıtlar: `source-rechecks*.json`,
  `source-followups.json`, `old-options-difficulty-review-01.json`–`15.json`.
- Kaynak taramasında dört açıklama için ek/uyumsuz ifade düzeltmesi, yedi
  kapsam uyarısı ve bir doğru seçenek ifadesi hassasiyeti kaydedildi. Sonuncusu
  “derin su” yerine kaynağın desteklediği “su birikintisi” ifadesidir;
  bunlar hatalı cevap anahtarlarının toplam sayısı değildir ve örtüşebilir.
- 131 aynı-bilgi grubunda 146 fazla eski kayıt bulundu ve farklı, kaynaklı
  bilgilerle değiştirildi. `existing-replacement-receipts.json` 146 ayrı ID’nin
  kaynak yerini ve içerik özetini doğrular. Tarihî banka değiştirilmedi.
- 563 eski kaydın en az bir alanı değişti: 507 zorluk, 154 kök, 151 açıklama,
  148 seçenek seti ve 158 kaynak kaydı. Alan sayıları örtüşür; 563 dinî hata
  bulunduğu anlamına gelmez. ID, kategori, doğru seçenek ID’si ve şık ID sırası korunur.

## Yeni soruların denetimi

1.500 yeni ID’nin tamamında Diyanet Kur’an Yolu Meali, Diyanet Hadislerle İslâm
veya TDV İslâm Ansiklopedisi pasajları gerçekten karşılaştırıldı. Ayet/TDV
madde/PDF fiziksel sayfa yerleri 87 kaynak fişi dosyasında, içerik SHA-256’sıyla
birlikte bulunur. PDF’ler ve telifli kaynakların tam metni Git’e konmadı.

Tüm yeni soruların kök ve anahtarları son zorluk turunda yeniden okundu.
Tekrarlayan sınırlayıcı/ilgisiz seçenek sinyali veren 294 kayıt ayrıca okundu;
290’ında dört seçenek açıkça yeniden düzenlendi, dördünde karşıtlık sorunun
ölçtüğü ayrım olduğu için korundu. `new-distractor-quality-review.json` ve
üç `new-option-refinements-final-*.json` dosyası önce/sonra kanıtlarını içerir.

Anlam taraması yalnız birebir metne dayanmaz. Kaynak/factKey denetimi,
Jaccard yakın çiftler ve kök+cevap üzerinde TF-IDF kullanıldı. Son TF-IDF
çalışmasında her sorunun en yakın üç adayı tarandı; >=0,40 eşiğindeki yeni
çiftler okunup önceki kararlarla uzlaştırıldı. `cross-bank-tfidf*.json`
kararları saklar. Eşik veya algoritma, bütün olası anlam tekrarlarının
matematiksel kanıtı değildir; farklı kişilere ait aynı cevap otomatik tekrar sayılmaz.

`reviewedAt` alanına insan incelemesi uydurulmadı. Bağımsız ilahiyat uzmanı
onayı iddia edilmiyor. `approved`, kullanıcının içerik ekleme görevi kapsamında
kaynak/veri kontrolü biten bu geliştirme dalındaki oynanabilirliği ifade eder;
main/mağaza veya canlı backend yayını yapılmış demek değildir.

## Entegrasyon ve geçmiş koruması

- `questions-v74.ts` araç/editoryal bağımlılık içermeyen statik runtime snapshot’ıdır.
  `scripts/build-bank-v74.ts --check` aday, manifest ve snapshot eşitliğini denetler.
- Bankalar v1–v73, özellikle v73’ün SHA-256’sı aynen korunur. Yeni turlar v74;
  eski sonuçlar kendi banka sürümü ve şık sırasıyla okunur, yeniden puanlanmaz.
- Yeni geniş kategori sürümü 3, öğrenme konusu sürümü 4’tür. Eski sürüm 1/2/3
  konu atamaları ayrı kalır; kayıt doğrulaması banka/konu sürümünü çapraz denetler.
- Normal, günlük, dört veri kategorisi, 18 ekran/zorluk ve 30 ekran/aşama
  turu için soru görünümü, tamamlama, skor ve JSON kayıt dönüşü test edilir.
- Çevrimiçi dışa aktarım v74’te 3.000, açıkça istenen v72/v73’te 1.500 satırdır.
  Cevaplar açığa çıkarılmaz ve eski soru/sürüm satırlarının üzerine yazılmaz.

## Sunucu için ayrı yayın gereği

`20261126074656_canonical_bank_v74.sql` yalnız yeni veri kümesini tanımaya
hazırlar; içerik onayı false kalır. Hiçbir aktif küme, oda, maç, Auth veya RLS
politikası değiştirilmez. Yerel/CI kabul dosyaları hazırdır. Canlı çevrimiçi
oyunların 3.000 soruya geçmesi için ayrıca doğrulanmış staging ve açık yayın
onayı gerekir; mevcut canlı oyunların v74 kullandığı iddia edilmez.
Bkz. `V74-SERVER-ROLLOUT.md`.

## Test durumu ve kalan kabul

Entegrasyon öncesi 33 içerik/geçmiş testi, TypeScript ve hedefli lint geçti.
İlk tam entegrasyon koşusunda eski aktif-sürüm beklentileri ortaya çıktı;
bunlar tarihî snapshot’lara açıkça bağlanarak düzeltildi. Başarısız olan ilgili
modüllerin yeniden koşusunda **139/139 test geçti**. Son tam koşu **481 test: 480 geçti, 1 taban kaynak eksikliği nedeniyle başarısız**.
Tam TypeScript ve tam lint geçti. Yeni worktree’deki son v74 kontrolünde
**16/16 test** ve v71–v74 canonical dosya kontrolü geçti.
Ayrıntılar `test-results.json` içindedir.

Bu worktree tabanında `modules/google-native-signin/ios/GoogleNativeSignInModule.swift`
Git’te bulunmuyor. Aynı üretim worktree’sinde bu yok sayılan native kaynak
mevcut; soru görevi adına kopyalanıp Auth değişikliği olarak commit edilmedi.
Tam testteki bu dosya eksikliği ayrıca raporlanır; yeni bankanın başarısı olarak gizlenmez.

Yerel Docker API’si yanıt vermedi. Mac açıldıktan sonra da Docker API ve uygulama
arayüzü zaman aşımına uğradı; yerel kabul çalışmadı.
Yerel SQL kabulü çalışmadı; diğer projelerin Docker ortamı yeniden başlatılmadı.
Bunun yerine [GitHub izole kabulü](https://github.com/ozgeilis/anla-ezberle-quiz-open/actions/runs/45781366636)
geçti: 34 seçili test, v74 sunucu staging/sayım/havuz/ACL ve eski banka regresyonları.
[Güçlendirilmiş geçiş kabulü de geçti](https://github.com/ozgeilis/anla-ezberle-quiz-open/actions/runs/45782057697):
v73’te başlayan gerçek sentetik maç, v74 seçildikten sonra v73 anahtarlarıyla tamamlandı.
V72’nin eski kategori sürümü 1 etiketli önizlemeleri de kendi tarihî sözleşmeleriyle
korunur; bunun için son yerel geçmiş kontrolünde 29/29 test geçti.
Fiziksel cihaz testi, yeni IPA/AAB, main merge, canlı veri işlemi ve mağaza yayını yapılmadı.
