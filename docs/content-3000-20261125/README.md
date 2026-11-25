# 3.000 soruluk banka — çalışma kaydı

26 Kasım 2026. **Çalışma sürüyor; banka henüz 3.000 soru değil ve entegrasyona hazır değil.**

İzole worktree: `/Users/ozge/Desktop/bilgi_yaris/anla-ezberle-content-3000`.
Dal: `content/question-bank-3000-20261125`, başlangıç commit'i: `3a74086`.
Aktif uygulama bankası v73 / 1.500 soru olarak korunuyor. Main, 0.1.1 yayın
worktree'si, Auth, reklamlar, Supabase ve mağazalar değiştirilmedi. Build oluşturulmadı.

## Dağılım ve yeni içerik

Kullanıcı kararı: Eski kategori atamaları korunacak; dört veri kategorisinin
her birine tam 375 yeni soru eklenecek. Bu nedenle son kategori toplamları eşit olmayacak.

| Veri kategorisi | Eski | Kaynak karşılaştırmalı aday | Yeni hedef | Son hedef |
| --------------- | ---: | --------------------------: | ---------: | --------: |
| Kur'an          |  450 |                         310 |        375 |       825 |
| Peygamberler    |  230 |                         310 |        375 |       605 |
| İslam Tarihi    |  401 |                         310 |        375 |       776 |
| Genel Bilgi     |  419 |                         310 |        375 |       794 |
| TOPLAM          | 1500 |                       1.240 |       1500 |      3000 |

`src/content/questions/expansion-v74/` içindeki 1.240 kayıt **reviewed adaydır**;
aktif uygulamaya eklenmiş veya bağımsız uzman tarafından onaylanmış değildir.
Kök, anahtar ve açıklama için gerçekten açılan resmî PDF/TDV pasajları kullanıldı.
Kaynak ve yer bilgileri `new-question-receipts-01.json`–`70.json` içinde izlenir.
Banka çapında son anlamsal tekrar kabulü ve zorluk kalibrasyonu açık tutulur.

Ekranda ayrıca altı oynanabilir kategori bulunur; bunlar dört veri kategorisiyle
aynı yapı değildir. Yeni kimliklerin ekran konu haritası henüz oluşturulmadı.
Bu eşleştirme tamamlanmadan sorular aktif oyuna alınmayacak.

## Gereksinim takibi

| Gereksinim                                                             | Durum                                       | Kanıt / kalan işlem                                                                                                                                           |
| ---------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eski 1.500 kaydın sayımı ve yapısal bütünlüğü                          | Tamamlandı ve test edildi                   | `baseline-audit.json`, 1.500 ayrı ID, yapısal hata yok                                                                                                        |
| Eski kök, cevap ve açıklamaların kaynak pasajlarıyla karşılaştırılması | Kaynak taraması tamam; düzeltme kabulü açık | `source-rechecks*.json`, `source-followups.json`: 1.500/1.500; 1.496 özgün açıklama desteklendi, dört açıklama için aday düzeltme var                         |
| Kapsam, seçenek ifadesi ve anlatım düzeltmeleri                        | Aday kodlandı                               | `wording-corrections.json`: 11 öneri; bunlar dinî hata sayısıyla özdeş değildir                                                                               |
| Eski soruların zorluk kalibrasyonu                                     | Devam ediyor                                | 475 kolay kök incelendi, 22 öneri; orta/zor bankanın tamamı için son kabul yok                                                                                |
| Eski sorularda anlamsal tekrar                                         | Devam ediyor                                | 382 token adayı okundu; ayrıca 88 aynı-bilgi grubu, en az 98 fazla kayıt; tüm olası çiftlerin benzersizliği kanıtlanmış değildir                              |
| Eski tekrarların farklı bilgilerle ikamesi                             | Devam ediyor                                | 98 kaynaklı ikame adayda hazır; banka çapında son benzersizlik kabulü açık; ID ve tarihî sürümler korunacak                                                   |
| 1.500 yeni sorunun yazımı                                              | Devam ediyor                                | 1.240 kaynak karşılaştırmalı aday; 260 yeni soru daha gerekiyor                                                                                               |
| Yeni adaylarda tekrar ve çeldirici kontrolü                            | Devam ediyor                                | 1.240 adayın yakın çift taramasında 57 kaydın içeriği yeniden ele alındı; `new-question-replacement-decisions.json`; çeldirici düzeltmeleri ayrıca kaydedildi |
| Aday düzeltmelerin tarihî kayıt koruması                               | Test edildi                                 | 128 eski ID üzerinde anlatım/zorluk düzeltmeleri ve 98 ikame (örtüşen kayıtlar var); eski anahtar ve şık ID'leri korunuyor                                    |
| Yeni ID, kaynak fişi ve şema testleri                                  | Test altyapısı hazır                        | `tests/content-expansion-baseline.test.ts`; ID/factKey/kaynak yerlerinin eşleşmesi denetlenir                                                                 |
| 3.000 soru bütünlüğü ve entegrasyon                                    | Yapılmadı                                   | Tam içerik, ikame, konu haritası, zorluk ve tekrar kabulü tamamlanmalı                                                                                        |
| Main / canlı backend / mağaza yayını                                   | Yapılmadı                                   | Bu çalışma bunlara müdahale etmez                                                                                                                             |

## Aday düzeltmeler

`existing-patches-v74.ts` 128 eski kayıt için aday değişiklikleri tutar.
`questions-v74.candidate.ts` bunları tarihî v73 kaydını değiştirmeden uygular;
aktif `index.ts` ve sürüm registry'si bu dosyayı kullanmaz.

Önemli kapsam düzeltmeleri: Arafat vakfesinde çoğunluk/Hanbelî başlangıç farkı;
Nesâî'nin ölüm tarihinde tercih edilen 915 ve alternatif 916 ayrımı; Nûh'un
şükreden kul oluşunda doğrulanamayan ek TDV atfının çıkarılması; Kadir gecesi
sorusunda doğrulanmamış kronoloji cümlesi yerine doğrudan âyet desteği.

`confirmed-fact-overlaps.json` 88 grupta 186 eski ID'yi içerir; 98 fazla kayıt
aynı bilgiyi farklı biçimde sorar. Bunlar 98 dinî yanlış anlamına gelmez.
Token benzerliği, anlam tekrarlarının bütününü yakalamaz. Aynı âyetteki farklı
bilgiler de sırf aynı kaynak yerini taşıdıkları için otomatik tekrar sayılmaz.

## Doğrulamanın sınırı

Otomatik testler veri biçimini, kaynak fişlerinin eşleşmesini, tarihî sürüm
özetlerini ve oyun/geçmiş/XP korumasını denetler; dinî doğruluğu kanıtlamaz.
Kaynak metinleri kısa açıklamalarla karşılaştırılır; telifli metinler topluca
repo'ya kopyalanmaz. Bağımsız ilahiyat uzmanı veya ürün sahibi yayın kabulü
verilmiş gibi işaretlenmez.

Tam 3.000 ayrı bilgi, dört kategoride 375'er yeni soru, yeterli çeldiriciler,
yeni ekran konu haritası ve eski tekrarların ikameleri bitmeden çalışma
"tamamlandı" veya "yayına hazır" olarak raporlanmayacak.

## Güncel otomatik doğrulama

25 Kasım: 500 yeni aday ve 126 eski kaydın aday düzeltmeleriyle beş seçili dosyada toplam 28 test geçti (101.469,58 ms). Tarihî v1–v71 özetleri, v72/v73 yapısı, kayıt/XP/rozet korunması, kategori kapsamı, import yolları ve benzerlik denetimi kontrol edildi. Sonraki içerik eklemeleri için hedefli kontrol ayrıca `test-results.json` içinde izlenir. Bu tam uygulama test paketi veya 3.000 soru kabulü değildir.

Tam TypeScript kontrolü ve dört hedef dosyanın ESLint kontrolü bu çalışma sırasında geçti. Desktop dosya okumasında takılan TypeScript denemeleri durduruldu ve başarılı sayılmadı. Git blobları ile aynı bağımlılıkları kullanan ayrı kaynak snapshot’ında tam TypeScript kontrolü exit 0 ile geçti; dört değişen TS dosyasının SHA-256 eşitliği ayrıca doğrulandı. Cihaz testi ve mağaza build’i yapılmadı.
