# v73 seçenek kalitesi — yayımlanmamış aday

Aktif banka **v72 / 1.500 soru**. Bu PR tek v73 adayını geliştirir. Main, Vercel Production, canlı Supabase, aktif index/registry, eski bankalar, puan, XP ve kullanıcı kayıtları değiştirilmedi. **Yayın uygunluğu verilmedi.**

## Güncel inceleme sonucu

| Kontrol | Sonuç |
|---|---:|
| Güncel soru / benzersiz inceleme kaydı | 1.500 / 1.500 |
| Kök, dört şık, anahtar ve açıklaması ayrı incelenen | 1500 |
| Bu turda kaynak pasajıyla karşılaştırılan | 1500 |
| İlk otomatik taramada işaretlenen soru | 336 |
| Tek v73 adayında v72’ye göre değişen soru | 1015 |
| Önceki 271 değişikliğe ek olarak değişen ID | 744 |
| Kökü değişen | 460 |
| Doğru cevabın ifadesi değişen | 458 |
| Açıklaması değişen | 215 |
| Yalnız çeldiricileri değişen | 358 |
| Üç sınırlayıcı yanlış şık kalıbı: önce → sonra | 25 → 0 |
| Otomatik ton dengesizliği uyarısı: önce → sonra | 4 → 0 |
| Tek belirgin uzun/kısa şık uyarısı: önce → sonra | 85 → 13 |
| İkinci taramada herhangi bir otomatik uyarı alan soru | 170 |
| Bilinen bloke bireysel karar | 1 |
| Bağımsız uzman onayı | 0 |
| Yayın onayı / v73 etkinleştirme | Yok / Kapalı |

Sayılar örtüşebilir; otomatik uyarılar gerçek kusur veya dinî doğruluk hükmü değildir. “Ton 4 → 0” içindeki bir kayıt, “iman etmiş görünerek ikiyüzlü davranma” metninin yanlışlıkla olumlu sayılmasıydı. Algoritma ikiyüzlülüğü olumsuz olarak tanıyacak biçimde düzeltildi ve regresyon testi eklendi; bu, soru düzeltmesi diye sayılmadı. İman/Ahlak gerçek eşleştirmesindeki **260** sorunun tamamı yeniden incelendi ve kaynakla karşılaştırıldı; bu kategoride adayın değişen soru sayısı **253**.

30 × 50 kayıt önceki turdan otomatik onay devralmaz. Her kararda dört şık için ayrı yorum, gerekçe, belirsizlik/zorluk/tekrar değerlendirmesi, kaynak konumu ve aday SHA-256 özeti bulunur. Adayın ilgili içeriği değişince eski karar geçersiz olur. Özgün 220 öncelikli ID korundu ve hepsi ayrı ele alındı.

## İnceleme belgeleri

- [30 paket / 1.500 bireysel kayıt](batches/) ve [sıralı indeks](audit-round2-index.json).
- [Güncel sayılar](audit-round2-summary.json).
- [Bütün değişikliklerin eski/yeni karşılaştırması](comparison.md).
- [İkinci tur değişiklikleri](round2-comparison.md) ve [30 önemli düzeltme](round2-top30.md).
- [Açık kontroller ve bloke soru](round2-open-items.md).
- [Banka çapındaki ek çift karşılaştırması](round2-overlap-review.json).
- [Geçmiş kimliği ve yayın kapısı](VERSIONING-AND-RELEASE-GATE.md).

İlk tur `iman-review.json`, `automatic-warnings.json`, `other-suspicious.md` ve `review-examples.md` korunur. Güncel kapsam için ikinci tur özeti ve paketler esas alınır; ilk tur sayıları yeni turla toplanıp tekrar incelenmiş gibi gösterilmez.

## Kaynak ve editoryal yöntem

Öncelik Diyanet Kur’an Yolu Meali ve TDV İslâm Ansiklopedisi. Her soru için mevcut kök, anahtar, dört seçenek ve açıklama ilgili pasajla karşılaştırıldı; yorum/mezhep farklılıkları ayrıca kaydedildi. Arama özeti, boş sayfa, URL’nin varlığı veya erişim hatası doğrulama sayılmadı. Diyanet’in bazı tekil tefsir URL’leri erişim engeli döndürdüğünden resmî [Kur’an Yolu Meal PDF’si](https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf) kullanıldı; eski URL’lerin tamamının çalıştığı iddia edilmez.

PDF: 8. baskı, 2020; SHA-256 `0938e0a5b94234d2a92714e099591f502d9b70bb5cb46ed40ffff086aec7237f`. Konumlar 1 tabanlı fiziksel sayfalardır; basılı sayfa ayrıca belirtilir. Sayfa sınırını aşan pasajlar ve gerekli dipnotlar okundu. TDV kanıtlarının hash’i görüntülenen pasajların özel yerel okuma paketine aittir, bütün HTML sayfasına ait değildir. Tam kaynak metinleri ve özel önbellekler Git’e eklenmedi. Kaynak karşılaştırması bağımsız ilahiyat uzmanı onayı değildir.

Önemli örnekler: Ankebût 29/40’taki ses/sarsıntı anahtar uyuşmazlığı düzeltildi. Neml 27/40’ta tefsirde mümkün görülen vezir kimliği yanlış şık olmaktan çıkarıldı. Ayetlerde aynı anda doğru olabilen iki hüküm tek sorunun farklı seçeneklerine dağıtılmadı. Fitre/teyemmüm/vakıf ayrımları belirli mezhep veya kaynak anlatımıyla sınırlandı. Sırçalı Medrese’nin 1242/1243 farkı hicrî kitâbe tarihine bağlandı. Meryem 19/55 için kullanılan mealin “halkına” ifadesi korundu. Kurada ve İnşikâk 84/6’da tek kısa cevap ipucu giderildi.

## Açık kalite ve kabul noktaları

1. **`quran-meaning-v72-024` bloke:** Mü’minûn 23/3’teki geniş “boş ve yararsız işler” kavramının altına girebilen dar çeldiriciler var. Bu ID, değişmeden korunması istenen 30 v72 anlam sorusundan biri; onaysız değiştirilmedi. Bağımsız editör/ürün kararı gerekiyor.
2. Ek banka çapı kontrolünde **406** benzerlik adayı çift üretildi; **406** çiftin tamamı ayrıca anlam bakımından karşılaştırıldı. **23** çiftte aynı olgu tekrar soruluyor; bekleyen çift **0**. Bu 23 tekrar açık kalite konusu olarak tutulur; çift incelemesinin bitmesi bunların giderildiği anlamına gelmez. Beş sûre sıra numarası gibi benzer cümleli ancak farklı hedefli çiftler otomatik tekrar sayılmadı.
3. **İman/Ahlak Zor** havuzu mevcut v72’de de adayda da **7** sorudur. 10 soruluk bağımsız zor tur mevcut kuralla açılamaz. Onaysız zorluk değişikliği veya yeni soru eklenmedi; ayrı editör/ürün kararı gerekir.
4. Kalan **170** otomatik uyarı topluca hata ya da temiz diye etiketlenmedi. Özel ad uzunluğu/ortak sözcük gibi yanlış alarmlar bireysel yorumlarda açıklanır. Korunan Necm 53/39 cevabındaki “ancak” kaynağın kapsamını taşır; sözcüğün bulunması tek başına kusur sayılmaz.
5. Bağımsız uzman kabulü, v73 ile gerçek oyuncu/cihaz kabulü ve kontrollü günlük/çevrimiçi staging testi bekler. Aday aktif registry’ye veya sunucuya bağlanmadı.

## Cevap konumu, sürüm ve geçmiş

Ham dosyadaki konumlar oyuncuya gösterilen sıra değildir. Mevcut motor her turda seçenek ID’lerini karıştırıp `optionOrders` içine kaydeder. V72’nin ham dağılımı `[162, 1026, 158, 154]`; adayın güncel dağılımı [envanterdedir](summary.json). Sözcük düzeltmesi yerine şık sırası karıştırma uygulanmadı. Yalnız üsluba bakan sezgisel araç önce 80 soruda (75 doğru) tahmin üretirken son adayda 0 tahmin üretir; çekimserlik dinî doğruluk veya anlamsal temizliğin kanıtı değildir.

V72 SHA-256: `d1dcd3e92f4d331d187fcbf4c3459a1837ef979413a743c0d3ec4a43d7023115`. Korunan 30 anlam sorusu nesne içeriğiyle aynıdır. Eski ezber soruları geri getirilmedi. Yerel v2–v72 arşivlerindeki dolu `(id, version)` kimlikleriyle adayın 1015 yeni içerik sürümü çakışmaz; canlı hedef için ayrıca salt okunur kontrol gerekir. Eski oyunların cevap/sıra/puan/XP/rozetleri yeniden hesaplanmaz. Mevcut exporter draft v73’ü reddeder.

## Tekrarlanabilir kontroller

```sh
pnpm check
pnpm questions:check
pnpm exec tsx scripts/build-editorial-v73.ts --check
pnpm exec tsx scripts/build-editorial-audit.ts --check
pnpm export:web
```

Son 1.500 kayıt ve kaynak karşılaştırmasını içeren kontrol noktasında **345/345 test**, TypeScript, lint, soru bütünlüğü, iki editoryal üreticinin `--check` doğrulaması ve web export geçti. Yeni aday testi etkinleştirmeden 18 kategori/zorluk birleşiminin v72 ile aynı kullanılabilirliğini, 17 açılabilir havuzu ve 4.500 karıştırılmış gösterim sırasını denetler. Bunlar cihazda oynanmış tur veya canlı çevrimiçi kabul değildir.

## Yayın sınırı

Bu PR taslak inceleme içindir. Açık içerik sorunları, bağımsız kabul ve kullanıcının nihai yayın onayı olmadan main’e birleştirilmez. Ayrı sürüm etkinleştirme PR’ında registry/snapshot, dataset üyeliği, salt okunur kimlik çakışma kontrolü, RLS/anahtar güvenliği, kontrollü staging ve geri dönüş planı gerekir. Bu dalın kodunun bulunması v73’ü aktif etmez.
