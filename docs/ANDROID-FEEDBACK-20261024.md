# Android geri bildirimi — yeniden kabul adayı

Cihaz: **Samsung Galaxy A04, Android 14** (kullanıcı beyanı). Önceki APK gerçek cihazda denendi; dokunma gecikmesi/büyük metin/müzik nedeniyle kabul edilmedi. Yeni binary’de fiziksel kabul ayrıca yapılacak.

## Dokunma ve render maliyeti

- Ortak Tap, önce onPress/oyun eylemini çalıştırır; kısa sesi görsel commit sonrasına erteler. Ses hatası/seek/depolama cevap kabulünü bekletmez. Web’in gerçek kullanıcı hareketiyle ses açma davranışı korunur.
- Kategori/zorluk seçimi öncelikli, uygunluk hesabı `useDeferredValue` ile ayrı güncellenir; beklerken başlatma kapalıdır. Aynı gerçek bağımsız seçim algoritması kullanılır; sınırlar gevşetilmedi.
- Beş aşama için tekrarlanan uygunluk hesabı memoize edildi. Kavram anahtarları nesne ve kaynak alanlarıyla güvenli cache kullanır; değiştirilmiş fixture eski cache’e takılmaz.
- Tarihsel banka indeksleri yalnız ilk kullanımlarında kurulur; geçmiş soru/cevap snapshot’ları değiştirilmez.
- Profil/tema/ana sayfa veri abonelikleri aktif cevaptan ayrıldı; rozet sağlayıcı değeri memoize edildi. Sayaç yalnız kendi yaprağını günceller; tüm soru ekranı her saniye yeniden çizilmez.
- Aynı Mac’te soğuk/sıcak kategori hesaplama örneği önce 39/34/31 ms, cache sonrası 26/11/9 ms. Bu Android giriş gecikmesi ölçümü veya kesin çözüm kanıtı değildir. Fiziksel A04 yeniden kabulü gerekir.

## Süre / kayıt uyumu

Yeni tek oyunculu ve günlük turda soru görünür/cevaplanabilir olduğunda 10 saniye başlar. `performance.now()` monotonic süreyi kayıt zamanı üzerine yansıtır; interval sayısı süre kaynağı değildir. Geciken callback veya arka plan ekstra süre vermez. Yanıt, timeout ve çift dokunuş ortak ref/motor kilidinden geçer. Süre sonrasında geç tıklama timeout’u doğru cevaba çeviremez.

Yanıt sonrası sayaç durur. Açıklama okunurken yeni sayaç yoktur; sonraki sorunun görünmesi yeni 10 saniyeyi açar. Yeni kayıtta `timingVersion=1`, timeout için `option=-1`, `timedOut=true` ve açılış/deadline bilgisi vardır. Eski 0–3 cevaplı kayıtlar aynı biçimde kalır. Şema süre/durum uyumunu doğrular; puan/XP yalnız doğru cevaptan gelir. Sonuç ve inceleme cevapsızı ayrı gösterir. Yeni yerel demo turları da 10 saniye kullanır; eski demo event log’ları geriye dönük değiştirilmez.

Canlı odalarda istemci, sunucunun `settings.seconds` değerini kullanır. Yerel migration yeni odalara 10 saniye, eski odalara dondurulmuş 15 saniye verir; 5 saniyelik reveal korunur. Başlamış odanın süresi değiştirilemez. **Frankfurt’a uygulanmadı.** Asenkron online düello şu an soru açılış/deadline’ını sunucuda saklamıyor; istemcide zaman aşımı uydurulmadı. Bu mod için ayrıca sürümlü sunucu kuralı gerekir.

## Ses / arayüz

Menü müziği dosyası, runtime mantığı ve ayarları kaldırıldı. Eski v1 müzik alanları yok sayılarak efekt tercihleri v2’ye güvenle okunur; depolama anahtarı değişmedi. 10 kısa eski efekt byte-identical kalır. Yeni 65 ms analog tik `scripts/generate-game-audio.py` içindeki özgün çift sönümlü sentezden üretilir; kayıt/örnek/üçüncü taraf melodi yok. Tek efekt kanalı önceliği tikin geri bildirime binmesini engeller; aynı efekt anahtarı/düzeyiyle kapanır.

Soru 19 px, şık 15 px; ABCD ve boşluklar küçüldü. Gerçek web kontrolünde kart dokunma alanları 52–54 px, 320/360/390/768 px açık/koyu temada yatay taşma yok. Büyük sistem yazısı ve gerçek iOS görünümü native kabul bekler. Kaynak, konu/zorluk ve teknik sürüm etiketleri soru alanından kaldırıldı; gerçek açıklama/kaynak erişimi korunur. Görsel assetler, avatarlar, soru içerikleri ve cevap anahtarları değiştirilmedi.

## Hesap silme: yerelde gerçek, production kapalı

Ayarlar → Hesabımı Sil ve uygulama gerektirmeyen `/account-delete` web rotası hazır. İki onay, mevcut parola ile yeniden kimlik kanıtı, gerçek Auth `getUser` kontrolü ve doğrulanmış kullanıcıya bağlı sunucu işlemi var. İstemci actor/e-posta kimliği seçemez; yönetici anahtarı istemciye girmez. Başarı yalnız atomik RPC sonucuyla gösterilir; yerel solo veriler ayrı korunur.

`20261024000100_account_deletion.sql` yalnız yerel DB’de uygulandı. Auth/profil/sosyal/notification/kişisel yanıt/puan/oda ilişkileri tek transaction’da kaldırılır; kalan oyuncuların kazanılmış skorları korunur. Ortak maçtaki kişi bağlantıları NULL ve görünümü “Silinmiş Oyuncu” olur. Aktif ilişkili maçlar iptal edilir. Normal cevap/ödül immutability ve client erişim yasakları devam eder. Hata transaction’ı geri alır. Platform operasyon logları/yedekleri için saklama politikasının tamamlandığı iddia edilmez.

Gerçek yerel Auth + Edge HTTP testi: 8 kontrol geçti (geçersiz JWT, rollout kapalı, aktör override, başka parola, gerçek silme, silinen JWT, diğer hesabın korunması, yeniden istek). SQL testi ilişkili veri silme/rollback/diğer skor/immutability korumasını doğruladı. Testte oluşturulan sentetik hesaplar temizlendi; rollout tekrar **false**.

**Canlı migration / Edge deploy / flag / Vercel yayını yapılmadı.** APK mevcut production sunucusunda bu hizmetin etkin olmadığını açıkça gösterir. `https://anla-ezberle-quiz.vercel.app/account-delete` henüz çalışan silme linki olarak raporlanamaz. `/privacy` bilgi ekranı ve Play Veri Güvenliği taslağı eklendi; destek adresi, log/yedek saklama süresi ve nihai politika/yayın kabulü açık kalır. Google Play’e gönderilmedi.

## Somut production planı — ayrıca onay gerekir

1. Frankfurt migration öncesi FK/trigger/RLS/migration durumunu salt-okunur doğrula; beklenmeyen farkta dur.
2. Yalnız hesap silme migration’ını uygula, `account-delete` Edge’i mevcut yönetilen sunucu anahtarlarıyla dağıt; flag kapalı kalsın. Sentetik kapalı test, silme ve kalan oyuncu skorunu doğrula; ardından etkinleştirme.
3. Canlı 10 saniye migration’ını ayrıca doğrula/uygula; devam eden eski odalar 15 saniye kalmalı. Asenkron düelloya otomatik zaman sınırı ekleme.
4. Gizlilik ve Veri Güvenliği eksiklerini kapat; onaylanan web sürümünü dağıt, `/account-delete` ve `/privacy` linklerini gerçekten çalıştırarak doğrula. Sonra Play formuna gir.
5. Yeni APK’da A04/Android 14 ses/süre/performance kabulü; ancak bundan sonra AAB değerlendirmesi. Mevcut AAB hook’u kapalı kalır.

## Son otomatik sonuçlar

- TypeScript, lint, soru bütünlüğü ve **303/303 test**, 0 skip: başarılı.
- Web export ve native ses/izin yapılandırma kontrolü: başarılı.
- Yerel Supabase’de **6/6 SQL paketi**: hesap silme, başarı albümü, asenkron soru geçmişi, canlı soru geçmişi, canlı odalar ve 10 saniye. Tüm fixture’lar rollback ile korunur.
- Eski SQL fixture’larında iki uyumsuzluk bulundu ve düzeltildi: başarı testi yalnız eski 6 kuralı sayıyordu; artık mevcut 12 kuralın ID/metrik/hedeflerini tam olarak karşılaştırıyor. Canlı geçmiş fixture’ı yasak `1` karakterli davet kodu üretiyordu; izinli 22–27 son ekleri kullanıyor. Ürün doğrulaması/izinleri gevşetilmedi.
- Gerçek tarayıcıda yanlış yanıt, süre dolumu, kaynak/açıklama, 10 soruyu bitirme ve 2 doğru / 5 yanlış / 3 cevapsız / 200 puan / 20 XP sonucu ve kayıt başarı bildirimi doğrulandı. Yerel bağımsız origin kullanıldı; gerçek kullanıcı verisi değiştirilmedi.
- Android native fiziksel kabul, iOS native VoiceOver/büyük sistem yazısı ve production hesap silme/web yayını açık.
