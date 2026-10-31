# Alpha taslak AAB yükleme devamı — 31 Ekim 2026

Ürün sahibinin “Yalnız taslak AAB yüklemesini onaylıyorum” izni [somut plana](play-draft-upload-plan-20261031.md) bağlıdır. Kaynak/runtime veya sürüm değiştirilmeden aynı83.995.235 bayt AAB seçildi. Yüklemeden hemen önce SHA-256 `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a` yeniden hesaplanıp eşleşti; build kapısı false kaldı.

Mevcut Alpha sürüm1 taslağında `closed-test-8d13fc2.aab` dosyası UI dosya seçicisinden gönderildi. Console önce84MB yüklemeyi, ardından “yüklemeniz dağıtım için optimize edilirken bu sayfadan ayrılabilirsiniz” işleme durumunu gösterdi. Sonrasında “1 uygulama paketi yüklendi” bildirimi ve2 (0.1.0)/API24+/target36 satırı görüldü. **Taslak olarak kaydet** seçildi; “Değişiklikler kaydedildi” ve devre dışı kaydet düğmesiyle paket kaydı doğrulandı.

Testçi sekmesinde kullanıcı tarafından hazırlanmış `test` adlı2 kişilik liste göründü; adresler açılmadı veya Git'e alınmadı. Seçim taslağında bekleyen Kaydet durumu vardı; kullanıcı tarafından yapılan bu değişiklik değiştirilmedi. Liste üyeliği, kayıtlı opt-in katılımcı sayısı değildir.

İncelemeye gönderme/kullanıma sunma, anahtar değişimi, main/Production veya sunucu değişikliği yapılmadı. Paket kaydı ve aşağıdaki sınırlı kontroller tamamlandı; Google incelemesi veya mağaza yayını tamamlandı sayılmaz.

## Google önizleme kontrolleri

Kaydedilen taslaktan **yalnız önizlemeye** geçilerek hata/uyarı ayrıntısı okundu. Önizlemede hata listelenmedi, **1 uyarı** var: “Henüz bu sürüm için herhangi bir test kullanıcısı belirtmediğinizden, hiçbir kullanıcı bu sürümü kullanamayacak.” Bu, test listesinin kanala henüz kaydedilmediğiyle tutarlı. Önizlemedeki **Kaydet/onayla** seçilmedi; incelemeye gönderme yapılmadı.

Paket ayrıntıları:19.450 desteklenen cihaz,4 ABI (`arm64-v8a`, `armeabi-v7a`, `x86`, `x86_64`),API24+,target36. Console **16 KB'ı destekler** gösteriyor. Bu statik paket analizi16KB kernel testi veya tüm cihaz garantisi değildir.87 kaynak yerelleştirmesi SDK kaynaklarını da içerir;87 uygulama dili eklendiği anlamına gelmez. Uygulama Türkçe kalır.

Google önizleme indirme tahmini24.8MB/13sn; cihaz/bağlantıya bağlı tahmindir,84MB AAB veya115MB universal APK boyutuyla aynı metrik değildir. Paketle ReTrace eşlemesi ve native debug sembolleri bağlı görünüyor; bunlar indirilmeyip mevcut durumda korundu. Pre-launch report, crash/ANR veya tüm SDK politikalarının bağımsız kabulü bu ekrandan çıkarılmadı.

## Gerçek Play imzalı APK'nin statik doğrulaması

Paket ayrıntıları→İndirilenler'deki **İmzalandı, evrensel APK** resmi Play dosyası indirildi. Bu inbound işlem yeni upload/anahtar değişimi değildir. Dosya114.735.904 bayt; SHA-256 `521cf17d853426b45ecc3684e098f3303eaa8a721aaa6cef6cc2cd0ade763763`.

- `apksigner verify` PASS; v2/v3/v3.2 imzaları doğrulandı. API37+ klasik ve PQC imzaları da araç çıktısında mevcut; bütün sertifika hash'leri [JSON kanıtında](play-signed-static-evidence.json).
- Klasik Play sertifikası `c6f523d89762d832ce131e49602c8917d965ce5257f0ea57ac03df6ccd851675`, önceki Console gözlemiyle aynı. EAS upload sertifikası farklı; imza kabulü mevcut cihaza üzerine kurulum kabulü değildir. Mevcut uygulama silinmedi/değiştirilmedi.
- Paket/sürüm/min/target beklenenle aynı. Hermes bytecode ve52 native64 kitaplık onaylı AAB ile birebir aynı;52 ELF LOAD hizası ve APK16KB ZIP hizası PASS.
- Play işleme sonrası tek ek manifest izni `com.android.vending.CHECK_LICENSE`; mevcut otomatik koruma/mağaza dağıtım düzeniyle tutarlı. Önceki izinler kaldırılmadı. Ad ID/AdServices/mikrofon/overlay izinleri yok. Yeni Analytics veya gerçek reklam yapılandırması yapılmadı.
- **Bu Play-signed APK çalıştırılmadı/telefona kurulmadı.** Önceki API34/API36 runtime testleri EAS ve yerel debug-signed adaya aittir. Play koruması/imza farkının runtime davranışı ve OEM/ses/native OAuth testleri hâlâ kabul bekler.

## Testçi girişinin kullanıcıya hazırlanması

Mevcut `test` listesi düzenleme penceresi açıldı; adresler araç çıktısında maskelendi, dosyaya/Git'e yazılmadı. Kullanıcıya eksik Google hesaplarını doğrudan Console'a ekleyip önce listeyi, sonra seçili listeyi kanal sayfasında kaydetmesi istendi. Kullanıcı kaydı henüz doğrulanmadı;2 adres ile12 gerçek opt-in tester koşulu sağlandı denmez. Katılım linki henüz etkin değildi;14 gün başlamadı.

## Korunan sınırlar

Bu tur yeni AAB üretmedi; build onay kapısı false. Paket kaldırılmadı, imza değiştirilmedi, farklı kanal/ülke açılmadı. Main/Vercel Production, Supabase, genel push, gerçek reklamlar/Analytics ve gerçek kullanıcı verileri değişmedi. Alpha taslağı **Google incelemesine gönderilmedi**, kullanıma sunulmadı. Sıradaki yayımlama onayı ancak tester seçimi ve kalan kontrol kapsamı açıkça gösterilerek istenecek.
