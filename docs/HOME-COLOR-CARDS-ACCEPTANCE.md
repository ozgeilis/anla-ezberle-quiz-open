# Ana sayfa renkli kartları ve sonuç skoru

Onaylı entegrasyon `main` (`ebda022`) temel alındı. Açık #12 içerik ve #13 Google giriş taslakları ayrı bırakıldı; bu PR bunları etkinleştirmez.

## Görünüm

- Mevcut oyuncu başlığı, cami manzarası, marka paneli ve temel yerleşim korunur.
- Oyuna Başla: beyaz yazı/oynat simgesi, zümrüt geçiş, küçük sağ ok, normal yazıda 52 dp.
- Günün Yarışması: altın geçiş ve takvim; tamamlandıysa mevcut günlük kayıt skoru, değilse kısa davet.
- Arkadaşlarınla Oyna: mavi geçiş ve oyuncular; mevcut `/live` hedefi.
- Son Skor: zümrüt ve hedef; mevcut son tamamlanmış kaydın skoru veya `—`.
- Rozetler: mor ve madalya; yalnız gerçek kazanılmış rozet sayısı / mevcut koleksiyon.
- İki sütun, 12 dp aralık, 12 dp iç boşluk, 17 dp köşe, 24 dp kart ikonları, 14 dp başlık, 11 dp açıklama. Büyük native yazı ölçeğinde (`fontScale > 1.3`) satırlar alt alta geçer; metin büyütme kapatılmaz.
- Var olan `Tap` bileşeninin anlık opaklık ve kısa native ölçek geri bildirimi / Reduced Motion davranışı kullanılır. Yeni animasyon veya bağımlılık eklenmedi.

Profilin onaylı renkleri `tokens.ts` içine taşındı. `ColorCardSurface` ve `ColorCardIcon`, profil ve ana sayfada ortak kullanılır. Profilde renkler, ikonlar, metinler, boyutlar ve veri mantığı korunur. Gerçek iPhone'da görülen gradyan köşe taşması, native `View` içinde kırpılan dekoratif gradient ile giderildi. Dekoratif katmanlar ekran okuyucudan gizlidir.

## Sonuç ekranındaki ek hata

Kullanıcının gerçek iPhone görüntüsünde büyük skor, 14 dp etiketin içine yerleştirildiği için 20 dp satır yüksekliğiyle üstten kesiliyordu. Etiket ve 24 dp sayı ayrı `Text` bileşenlerine alındı; sayı kendi 34 dp satır yüksekliğini kullanır. Header geniş metinde sarılabilir. Puan, XP, süre, sonuç kaydı ve ödül hesapları değişmez. Düzeltme aynı iPhone development build'ine Fast Refresh ile ulaştı ve cihaz görüntüsünde tam sayı doğrulandı.

## Doğrulama

| Kontrol                                          | Sonuç                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Soru bütünlüğü, TypeScript, lint, birim testleri | `pnpm check`: 328/328 PASS                                                                                                                                                                                                                                                                                                                                        |
| Web export                                       | PASS                                                                                                                                                                                                                                                                                                                                                              |
| Chrome / WebKit                                  | Her tarayıcıda 25 ana sayfa grubu PASS: 320/360/390, açık/koyu, boş/geçmişli/günlük tamamlanmış durumlar, gerçek engine fixture değerleri, tüm beş hedef, %150/%200 tarayıcı metin stresi                                                                                                                                                                         |
| Profil regresyonu                                | Mevcut 12 grup PASS: gerçek fixture istatistikleri, boş/geçmişli, uzun ad/kategori, üç kazanılmış rozet, arkadaşlar, temalar, geri dönüş ve banka sayısı gizliliği                                                                                                                                                                                                |
| Gerçek iPhone 11                                 | Mevcut uygulama silinmeden Metro 8113 üzerinden açıldı. Koyu görünüm, kayıtlı değerler, yuvarlak kartlar ve Fast Refresh ekran görüntüleriyle doğrulandı. Kullanıcı Oyuna Başla/Kategoriler, Son Skor/kişisel geçmiş ve Rozetler geçişlerini; ardından büyük sistem yazısında metin/kart görünümünü sorunsuz buldu. Kesin yazı ölçeği yüzdesi cihazdan ölçülmedi. |
| Gerçek Android                                   | Bağlı cihaz yok; fiziksel Samsung kabulü yapılmadı. Web/Chromium viewport kontrolü gerçek Android APK kabulü sayılmaz.                                                                                                                                                                                                                                            |

Sonuç ekranı regresyonu PASS: gerçek uygulama içinde 10/8/6/4/2 doğru ile beş tur oynatıldı; her sonuç 320/360/390/768 açık/koyu sekiz yerleşimde ve skorun bağımsız satır yüksekliğiyle doğrulandı. Android Hermes export PASS; bu APK veya fiziksel Android kabulü değildir. Güncel GitHub CI sonuçları PR kontrol listesinde ayrıca izlenir.

`scripts/home-card-fixture.ts` yalnız testte mevcut engine ile tamamlanmış kayıtlar üretir; uygulama tarafından import edilmez. Bütün web testlerinde çevrimiçi istekler sentetik fixture ile izoledir; canlı Supabase yazımı yoktur. Native kullanıcı kabulü, kullanıcının kendi kurulu uygulamasında yapılmıştır. Gerçek cihaz görüntüleri ve özel kullanıcı verileri Git'e eklenmez.

## Ekran kanıtları

Git dışında `artifacts/home-cards/` altında:

- `before-*-top.png` / `after-*-top.png`: aynı viewport ve sentetik profil, önce/sonra.
- `after-*-cards.png`: gerçek engine kayıtlarından hesaplanan değerler.
- `before-profile.png` / `after-profile.png`: aynı profil ile görsel karşılaştırma.
- `webkit/`: ikinci motorun açık/koyu ve metin stresi görüntüleri.
- `iphone-live-home-rounded.png`: gerçek iPhone'da köşeleri düzeltilmiş ana sayfa.
- `iphone-result-score-current.png`: gerçek iPhone'da üstten kesilmeyen sonuç skoru.

Mevcut ana sayfa eylemlerinin hedefleri korunur. Aktif turun uzunluğu dışında soru havuzunu tanıtan sayı eklenmedi. Soru bankası, cami/madalya/ikon dosyaları, XP/rozet/oda/arkadaşlık kuralları, alt navigasyon, hesap silme, genel push ve Supabase backend değişmez. Main veya Vercel Production dağıtımı yapılmaz.
