# v73 seçenek kalitesi — yayımlanmamış aday

Aktif banka **v72 / 1.500 soru**. Bu dal yalnız incelemeye hazır v73 dosyası ve editoryal kayıtlar üretir. Aktif index, geçmiş sürüm registry’si, çevrimiçi exporter, sunucu anahtarları, soru seçimi, puan ve XP kodu değiştirilmedi. Main/Production/canlı Supabase yayını yapılmadı.

## İnceleme sonucu

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

Kök, doğru ifade ve açıklama sayıları birbiriyle örtüşebilir. **251 sayısı yalnız “üç kötü, bir iyi” kalıbının sayısı değildir:** konu dışı çeldirici, belirsiz kök, tek uzun cevap, dil biçimi ve kaynak bağlamı gibi editoryal sorunların toplamıdır. Bütün sorular tek tek okundu; otomatik denetim bunların yalnız bir bölümünü yakalıyor. Otomatik uyarılardan “kesin çoklu doğru” veya “uzman onayı” üretilmez.

## İnceleme belgeleri

- [Tam eski/yeni karşılaştırması](comparison.md): 260 İman/Ahlak ve 20 diğer kategori; kök, dört şık, eski/yeni anahtar metni, gerekçe, kaynak URL ve yer bilgisi.
- [Öncelikli örnekler](review-examples.md): kullanıcıdaki Bakara 2/152 ve Nahl 16/90 örnekleri dahil en az 20 somut karşılaştırma.
- [260 sorunun inceleme kaydı](iman-review.json).
- [Bütün bankanın otomatik uyarıları](automatic-warnings.json) ve [diğer kategorilerin inceleme kuyruğu](other-suspicious.md).
- [Üretilen ölçümler](summary.json).
- Kaynak kanıtları: `src/content/questions/editorial-v73/sources.json`. SHA-256 ve 1 tabanlı PDF sayfaları; kaynak metni depoya kopyalanmadı. `source-compared`, Codex’in kaynak karşılaştırmasıdır; bağımsız dinî uzman onayı değildir.

Diğer kategorilerde **220 soru** otomatik uyarı aldı: Kur’an/Dualar 40, Siyer/Sahabe 42, Peygamber Kıssaları 65, Fıkıh 36, Tarih/Medeniyet 37. Bunlar inceleme kuyruğudur; kesin kusurlu soru sayısı değildir. Diğer kategorilerden 20 bariz örnek bu adayda ele alındı; kalanın nihai editoryal kararı verilmedi.

## Kaynak yöntemi ve önemli düzeltmeler

Öncelik Diyanet Kur’an Yolu Meali ve TDV İslâm Ansiklopedisi. Diyanet’in bazı tekil meal/tefsir URL’leri bu oturumda erişim engeli döndürdü. Bu URL’lerin çalıştığı iddia edilmiyor. Resmî [Kur’an Yolu Meal PDF’si](https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf) kullanılarak ayet pasajları ve sayfa numaraları karşılaştırıldı. TDV sayfalarının içeriği indirildi ve ilgili kavram/olay bölümleri incelendi. Erişim başarısı ile anlamsal doğrulama ayrı tutuldu.

Siccîn’in tek bir tartışmasız yer/defter tanımına indirgenmesi yerine Mutaffifîn 83/9’daki kayıt niteliği soruldu. Târık 86/4’te gözetleyenin kimliğine ilişkin farklı yorumlar tek hükme indirilmedi. İnfitâr, Beled ve Duhâ sorularında açıkça Kur’an Yolu mealinin ilgili ifadesine bağlı kökler kullanıldı. Aynı anlamlı “örtü/perde” ve “kıyamet/hesap günü” seçenekleri ayrıştırıldı. Kaynaklardaki ihtilaflar yapay zorlaştırma için kullanılmadı.

Zorluk ve kategori etiketleri korunmuştur; her satırdaki bağımsız inceleme, güçlenen çeldiricilerin zorluk etiketini yeniden değerlendirmelidir. Kaynak karşılaştırması, pilot oyuncu testi veya uzman değerlendirmesi yerine geçmez.

## Cevap konumu ve geçmiş

Ham v72 dosyasında doğru seçeneklerin konumları `[162, 1026, 158, 154]`; adayda `[204, 893, 204, 199]`. Değiştirilmeyen kayıtları sırf eşitlemek için değiştirmedik. Oyuncuya gösterilen sıra ham dizi sırası değildir: mevcut oyun motoru her turda seçenek ID’lerini karıştırıp `optionOrders` içine kaydeder. 80 tur/800 gösterimde dört konumun dağılımı ve tarihi sıra çözümlemesi test edildi. ID veya `o2` değerinin ekrandaki sabit “B” anlamına geldiği varsayılmaz.

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

Bu oturumda `pnpm check` **333/333 test**, TypeScript, lint ve soru bütünlüğüyle geçti; web export başarılı. Tarihsel v1–v72 kayıtları ve mevcut günlük/çevrimiçi banka testleri başarılı. **v73 ile canlı günlük/çevrimiçi oyun veya fiziksel cihaz testi yapılmadı:** aday registry’ye bağlanmadı ve sunucuya yüklenmedi.

## Yayın kapısı

Bu PR yalnız taslak/inceleme içindir. 271 değişikliğin bağımsız editör/uzman incelemesi ve kullanıcının nihai onayından sonra ayrı sürüm etkinleştirme değişikliği gerekir: v73 registry/snapshot ve sürüm-temelli konu eşleştirmesi, kontrollü çevrimiçi import/hash doğrulaması, günlük/oda uyumluluğu ve geri dönüş planı. Bu dalın merge edilmesi tek başına v73’ü etkinleştirmez; onaysız merge de yapılmayacaktır.
