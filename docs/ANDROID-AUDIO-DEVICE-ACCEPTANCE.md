# Android APK yeniden kabulü — Samsung Galaxy A04 / Android 14

24 Ekim 2026: Kullanıcı önceki `e729151d` APK’sında belirgin dokunma gecikmesi ve büyük soru/şık yazıları bildirdi; menü müziğini reddetti. Önceki APK yeni kabul sayılmaz. Yeni build aşağıdaki değişikliklerle yeniden denenmelidir. USB gerekmez; Expo Install/QR üzerinden bağımsız APK kurulur. Eski kurulum ve kayıtlar silinmez.

## Yeni APK’da kontrol listesi (henüz cihazda doğrulanmadı)

- Kategori/zorluk seçimi hemen görsel geri bildirim vermeli; uygunluk hesaplanırken başlatma kapalı kalmalı. İki seçim sırası da çalışmalı; kategorinin dışına/benzer sorulara kaçış olmamalı.
- Doğru ve yanlış cevap tek dokunuşla kilitlenmeli; ses, depolama veya animasyon cevabı bekletmemeli. Fiziksel gecikme ölçülmedi; masaüstü profili Android kabulü değildir.
- Her yeni tek oyunculu/günlük/demo sorusu 10 saniyeden başlamalı; yanıt sonrası durmalı. Açıklamayı okumak yeni süreyi tüketmemeli. Sonraki soruda yeni 10 saniye başlamalı.
- Hiç dokunmadan süreyi bitir: doğru yanıt/açıklama/kaynak açılmalı; soru cevapsız ve puanı 0 olmalı. Sonuçta doğru + yanlış + cevapsız = 10; XP yalnız doğru yanıtlardan gelmeli. Aynı soruya hızlı çift basma puanı değiştirmemeli.
- 8. saniyede arka plana al, 5 saniye sonra dön: yeni süre verilmemeli; eski sorunun süresi bitmiş olmalı. Açıklama sırasında arka plana gidip dönmek sonraki soruyu başlatmamalı.
- Menü müziği ve müzik ayarları bulunmamalı. Eski müzik tercihi oyunu veya efekt tercihini bozmamalı.
- Kısa 10 oyun efekti ve özgün tik sesini dinle. Efektleri kapatınca tik dahil hepsi susmalı. Son 3 saniye hafif görsel vurgu olmalı; doğru/yanlış sesi tikle üst üste binmemeli.
- Android medya sesi %0/%50/%100, efekt düzeyi, arka plan, geri dönüş ve uygulamayı yeniden açmada tercih kalıcılığını kontrol et. Ses yüksekliği/çatlama/gecikme gerçek dinleme gerektirir.
- 19 px soru, 15 px şık, en az 48 dp şık kartları okunaklı olmalı. Büyük sistem yazı ayarında uzun metin kaydırılabilmeli; kesilme olmamalı. Mevcut görseller/avatarlar korunmalı.
- Hesabımı Sil ekranı üretim servisi onayı yoksa **etkin değil** demeli. Gerçek hesabını test için silme. Yerel sentetik hesaplarla sunucu silme testleri ayrı yapılmıştır.
- Çevrimiçi canlı odanın süresini sunucu belirler: henüz uygulanmamış 10 saniyelik sunucu migration’ı varmış gibi davranılmaz. Eski 15 saniyelik odalar kendi kurallarını korur. Asenkron online düello istemcide zorla zaman aşımına uğratılmaz.

## Kabul kaydı

- Model: Samsung Galaxy A04 (kullanıcı beyanı)
- Android: 14 (kullanıcı beyanı)
- Önceki APK: performans / tipografi / müzik nedeniyle yeniden çalışma istendi
- Yeni APK commit / SHA-256: yeni build raporunda
- Yeni APK fiziksel performans, ses ve süre kabulü: **BEKLİYOR**
- AAB / Google Play gönderimi: **YAPILMADI**

Kalıcı paket onayı geçerlidir: `com.kovynelstudio.anlaezberle`. Yeni APK kabulü alınmadan `approved=false` ve boş `acceptedApkSha256` değiştirilmez.
