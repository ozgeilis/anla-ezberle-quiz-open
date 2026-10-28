# v73 seçenek kalitesi — yayımlanmamış aday

Aktif banka **v72 / 1.500 soru**. Bu dal yalnız incelemeye hazır v73 dosyası ve editoryal kayıtlar üretir. Aktif index, geçmiş sürüm registry’si, çevrimiçi exporter, sunucu anahtarları, soru seçimi, puan ve XP kodu değiştirilmedi. Main/Production/canlı Supabase yayını yapılmadı.

## İkinci tur: 1.500 soruya genişletme — devam ediyor

**1.500 soru için 30 × 50 kayıt oluşturuldu; kayıt oluşturmak inceleme tamamlamak değildir.** Bu aşamada ilk **220** öncelikli soru ayrı ayrı yeniden değerlendirildi; **1.280** soru ikinci tur anlam incelemesini bekliyor. Önceki 260 İman/Ahlak kaydı bu yeni sayıya otomatik eklenmedi.

- Bu turda **101 yeni soru düzeltmesi** mevcut tek v73 adayına eklendi. Önceki 271 kayıt kaybolmadı; yeniden incelenenlerde gerekli açıklama düzeltmeleri de yapıldı. Adayın v72’ye göre toplam değişen soru sayısı **372**.
- Yeniden incelenen 220 sorunun **148** kaynak pasajı bu turda açılıp okundu. **51** soruda henüz giderilmemiş içerik kusuru var; kaynak okuması bekleyen kararlar ayrıca işaretli.
- İlk turdaki özgün **220** öncelikli ID `round2-priority.json` ile donduruldu. Bu 220 sorunun tamamına ayrı karar verildi; 51 açık kusur için düzeltme/kanıt işi sürüyor. Genişletilmiş kuralların yeni uyarıları bu kuyruğun yerini almıyor.
- **Yayın uygunluğu verilmedi.** Kalan 1.280 inceleme, açık düzeltmeler, kaynak karşılaştırmaları, banka çapında anlamsal tekrar kontrolü ve oyuncu kabulü tamamlanmadı.

Güncel, üretilebilir sayılar: [ikinci tur özeti](audit-round2-summary.json). [İndeks](audit-round2-index.json), [50’şer soruluk paketler](batches/), [ilk 30 önemli düzeltme](round2-top30.md) ve [bu turdaki tam değişiklik karşılaştırması](round2-comparison.md). Her karar dört şık için ayrı yorum ve incelenen adayın SHA-256 özetini içerir; aday içeriği değişirse karar yeniden inceleme olmadan geçmez.

```sh
pnpm exec tsx scripts/build-editorial-v73.ts --check
pnpm exec tsx scripts/build-editorial-audit.ts --check
```

Kaynak sayıları iki tur arasında toplanarak yeni turda okunmuş gibi gösterilmez. `summary.json` önceki çalışmayı da içeren aday envanteridir; `audit-round2-summary.json` yalnız yeni bireysel kararları sayar. Yerel kaynak önbellekleri Git’e eklenmez. Arama sonucu özeti, boş sayfa veya erişim hatası kaynak doğrulaması sayılmaz. Diyanet’in güncel canlı okuyucusunda 3/134 ile 18/77 ve 18/79 pasajları okundu; Önceki çalışmadan kalan resmî PDF (8. baskı, 2020; SHA-256 `0938e0a5…aec7237f`) tekrar bulundu ve yeni pasaj okumalarında kullanıldı. Sayfa sınırını aşan Kehf 18/77 devamı ile dipnotlar ayrıca kontrol edildi. Bu turda kanıt kaydına bağlanmayan pasajlar bekliyor olarak bırakıldı.

Önemli ikinci tur düzeltmesi: `q67-ankebut-40` için Diyanet mealinde bulunmayan “şiddetli sarsıntı” anahtarı adayda “korkunç ses” olarak düzeltildi; dört çeldirici gerçek felâket alanında dengelendi. Aktif v72’nin eski anahtarı ve tarihsel gösterimi değiştirilmedi. A‘lâ 87/9 açıklaması da kullanılan mealin anlatımıyla eşleştirildi.

## Önceki tur: 260 İman/Ahlak ve 20 ek örnek

| Kontrol                                                        |     Sonuç |
| -------------------------------------------------------------- | --------: |
| Gerçek `iman_ahlak` eşleştirmesindeki sorular                  |       260 |
| Editoryal kusur/ipucu nedeniyle düzenlenen                     |       251 |
| Mevcut ayrımı korunarak bırakılan                              |         9 |
| Yalnız çeldiricileri değişen (kök, doğru metni, açıklama aynı) |       118 |
| Kökü de değişen                                                |        48 |
| Kökü aynı, seçenek metinlerinde değişiklik yapılan             |       203 |
| Doğru cevabın ifadesi yeniden yazılan                          |       128 |
| Açıklaması değişen                                             |         8 |
| Diğer kategorilerde güvenle ele alınan bariz örnekler          |        20 |
| Kaynakla karşılaştırılan düzenlenmiş soru                      | 271 / 271 |
| Korunanlar dahil kaynak karşılaştırması                        |       280 |
| Bağımsız insan editör/uzman onayı                              |         0 |
| Düzenlenmiş sorularda bağımsız inceleme bekleyen               |       271 |

Kök, doğru ifade ve açıklama sayıları birbiriyle örtüşebilir. **251 sayısı yalnız “üç kötü, bir iyi” kalıbının sayısı değildir:** konu dışı çeldirici, belirsiz kök, tek uzun cevap, dil biçimi ve kaynak bağlamı gibi editoryal sorunların toplamıdır. Bu ilk turdaki 260 İman/Ahlak sorusu tek tek okundu; bu ifade 1.500 sorunun ikinci turunun tamamlandığı anlamına gelmez. Otomatik uyarılardan “kesin çoklu doğru” veya “uzman onayı” üretilmez.

## İnceleme belgeleri

- [Tam eski/yeni karşılaştırması](comparison.md): mevcut adayın değişen bütün soruları ile İman/Ahlak envanteri; kök, dört şık, eski/yeni anahtar metni, gerekçe, kaynak URL ve yer bilgisi.
- [Öncelikli örnekler](review-examples.md): kullanıcıdaki Bakara 2/152 ve Nahl 16/90 örnekleri dahil en az 20 somut karşılaştırma.
- [260 sorunun inceleme kaydı](iman-review.json).
- [Bütün bankanın otomatik uyarıları](automatic-warnings.json) ve [diğer kategorilerin inceleme kuyruğu](other-suspicious.md).
- [Üretilen ölçümler](summary.json).
- Kaynak kanıtları: `src/content/questions/editorial-v73/sources.json`. SHA-256 ve 1 tabanlı PDF sayfaları; kaynak metni depoya kopyalanmadı. `source-compared`, Codex’in kaynak karşılaştırmasıdır; bağımsız dinî uzman onayı değildir.

İlk tur raporunda diğer kategorilerde **220 soru** otomatik uyarı aldı: Kur’an/Dualar 40, Siyer/Sahabe 42, Peygamber Kıssaları 65, Fıkıh 36, Tarih/Medeniyet 37. Bu tarihsel sayı dondurulan öncelik kuyruğudur; kesin kusurlu soru sayısı değildir. Yeni kurallarla taranan güncel uyarı sayıları ikinci tur özetinde ayrı tutulur.

## Kaynak yöntemi ve önemli düzeltmeler

Öncelik Diyanet Kur’an Yolu Meali ve TDV İslâm Ansiklopedisi. Diyanet’in bazı tekil meal/tefsir URL’leri bu oturumda erişim engeli döndürdü. Bu URL’lerin çalıştığı iddia edilmiyor. Resmî [Kur’an Yolu Meal PDF’si](https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf) kullanılarak ayet pasajları ve sayfa numaraları karşılaştırıldı. TDV sayfalarının içeriği indirildi ve ilgili kavram/olay bölümleri incelendi. Erişim başarısı ile anlamsal doğrulama ayrı tutuldu.

Siccîn’in tek bir tartışmasız yer/defter tanımına indirgenmesi yerine Mutaffifîn 83/9’daki kayıt niteliği soruldu. Târık 86/4’te gözetleyenin kimliğine ilişkin farklı yorumlar tek hükme indirilmedi. İnfitâr, Beled ve Duhâ sorularında açıkça Kur’an Yolu mealinin ilgili ifadesine bağlı kökler kullanıldı. Aynı anlamlı “örtü/perde” ve “kıyamet/hesap günü” seçenekleri ayrıştırıldı. Kaynaklardaki ihtilaflar yapay zorlaştırma için kullanılmadı.

Zorluk ve kategori etiketleri korunmuştur; her satırdaki bağımsız inceleme, güçlenen çeldiricilerin zorluk etiketini yeniden değerlendirmelidir. Kaynak karşılaştırması, pilot oyuncu testi veya uzman değerlendirmesi yerine geçmez.

## Cevap konumu ve geçmiş

Ham v72 dosyasında doğru seçeneklerin konumları `[162, 1026, 158, 154]`; güncel adayın dağılımı [aday envanterinde](summary.json). Değiştirilmeyen kayıtları sırf eşitlemek için değiştirmedik. Oyuncuya gösterilen sıra ham dizi sırası değildir: mevcut oyun motoru her turda seçenek ID’lerini karıştırıp `optionOrders` içine kaydeder. 80 tur/800 gösterimde dört konumun dağılımı ve tarihi sıra çözümlemesi test edildi. ID veya `o2` değerinin ekrandaki sabit “B” anlamına geldiği varsayılmaz.

v72 SHA-256: `d1dcd3e92f4d331d187fcbf4c3459a1837ef979413a743c0d3ec4a43d7023115`.

30 v72 anlam sorusu adayda nesne içeriğiyle aynen korunur. Eski ezber soruları aktif bankaya geri getirilmez. Eski tamamlanmış kayıtların cevapları, seçenek sıraları, puanları, XP ve rozetleri yeniden hesaplanmaz.

## Tekrarlanabilir kontroller

```sh
pnpm exec tsx scripts/build-editorial-v73.ts --check
pnpm questions:check
pnpm typecheck
pnpm lint
pnpm test
pnpm export:web
```

Önceki ilk turda `pnpm check` **333/333 test**, TypeScript, lint ve soru bütünlüğüyle geçti; web export başarılı. İkinci tur 220 soruluk kontrol noktasında `pnpm check` **339/339**, TypeScript, lint ve soru bütünlüğüyle geçti; aday ve 30 paket üretimi `--check` ile doğrulandı. `pnpm export:web` bu kontrol noktasında yeniden başarıyla tamamlandı. Staged diff Gitleaks taramasında gizli anahtar bulunmadı. Tarihsel v1–v72 kayıtları ve mevcut günlük/çevrimiçi banka testleri başarılı. **v73 ile canlı günlük/çevrimiçi oyun veya fiziksel cihaz testi yapılmadı:** aday registry’ye bağlanmadı ve sunucuya yüklenmedi.

## Yayın kapısı

Bu PR yalnız taslak/inceleme içindir. Adaydaki bütün değişikliklerin bağımsız editör/uzman incelemesi ve kullanıcının nihai onayından sonra ayrı sürüm etkinleştirme değişikliği gerekir: v73 registry/snapshot ve sürüm-temelli konu eşleştirmesi, kontrollü çevrimiçi import/hash doğrulaması, günlük/oda uyumluluğu ve geri dönüş planı. Bu dalın merge edilmesi tek başına v73’ü etkinleştirmez; onaysız merge de yapılmayacaktır.
