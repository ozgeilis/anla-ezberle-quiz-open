# Play Console kapalı test giriş taslağı

Uygulama kaydı oluşturuldu ve uygulama paneli açıldı (ürün sahibi beyanı, 30.10.2026; araç üzerinden bağımsız panel doğrulaması yapılamadı). Aşağıdakiler Console'a kaydedilmiş veya onaylanmış beyanlar değildir.

| Alan | Hazırlık / gereken karar |
|---|---|
| Uygulama adı | `Anla & Ezberle: İslami Quiz` (27 karakter) |
| Varsayılan dil | Türkçe (tr-TR) |
| Tür | Oyun; kategori/etiketler için Quiz/Trivia seçenekleri Console'da teyit edilmeli |
| Ücret | Ücretsiz taslağı; ücretli ürün/abonelik/ödeme SDK'sı bulunmadı. Geri alınamaz fiyatlandırma kararını hesap sahibi verir |
| Kalıcı paket | `com.kovynelstudio.anlaezberle`, önceden onaylı. Başka uygulamada kayıtlı olmadığı Console'da henüz doğrulanmadı |
| Hedef kitle | Son açıklama: yetişkinlere yönelik; çocuk odaklı değil. Okuyabilen çocukların oynayabilmesi ayrı bir hedef yaş seçimi değildir. Gerçek tasarım/görsellerle uyumlu yaş grupları formu hesap sahibiyle kesinleştirilmeli; otomatik 13-altı veya yetişkin kısıtı işaretlenmedi |
| İçerik derecesi | IARC anketi henüz doldurulmadı; tahmini yaş derecesi yazılmadı. Çevrimiçi kullanıcı etkileşimi ve kişisel profil alanları saklanmamalı |
| Reklam | Kodda reklam SDK'sı/işlevi bulunmadı; “Hayır” taslağı. Nihai işletme beyanı henüz girilmedi |
| Uygulama erişimi | Solo misafir erişimi var; sosyal/oda/sıralama için doğrulanmış yetkili hesap gerekir. İncelemeci erişimi aşağıda |
| Data Safety | `data-safety-draft.md` doldurma kaynağıdır; “veri toplanmıyor” seçilmez. Kesin veri türü/amaç/opsiyonellik/sağlayıcı rolleri ve saklama eksikleri hesap sahibiyle doğrulanmalı |
| Gizlilik | https://anla-ezberle-quiz.vercel.app/privacy — erişilebilir, aday metin güncellemesi Production'a otomatik taşınmış sayılmamalı |
| Dış hesap silme | https://anla-ezberle-quiz.vercel.app/account-delete — gerçek güvenli akış; giriş/yeniden doğrulama gerekir |
| İletişim | `kovynelstudio@gmail.com`, onaylı iş adresi |
| İkon | `store/google-play/icon-512.png`, 512×512, 32-bit PNG; uygulama ikonunun RGB pikselleri aynı |
| Tanıtım | `feature-graphic-1024x500.png`, 1024×500, 24-bit PNG/alfa yok; ayrı tanıtım kompozisyonu |
| Telefon görüntüleri | `phone-screenshots/` içindeki altı gerçek Android 16 emülatör yakalaması; 1080×1920, 24-bit PNG/alfa yok. Paket dizini `telefon-ekranlari/`. Yer tutucu veya fiziksel Samsung kabulü değildir |
| Ülkeler | Henüz seçilmedi. Türkçe ve ilgili içerik için hedef ülkeler kararı gerekli |
| Tester grubu | Henüz oluşmadı; tester e-posta listeleri Git'e eklenmez |
| Play App Signing | Console'da kurulmadı. Preview sertifikası mağaza imza onayı değildir; upload anahtarı hesabın güvenli saklama düzeniyle kesinleşmeli |
| Sürüm | Preview 0.1.0/code1. Store AAB onay sonrası remote autoIncrement ve benzersiz artan versionCode ile üretilip ayrıca denetlenmeli |
| Kapalı test/opt-in | Henüz track, davet/katılım URL'si veya indirilebilir Play sürümü yok; EAS bağlantısı Play opt-in değildir |
| 12 tester/14 gün | 13.11.2023 sonrası kişisel geliştirici hesabı koşulu uygulanıyorsa gerekir. Bu hesabın türü/tarihi/üretim erişimi doğrulanmadı; hiçbir sayaç başlamadı |
| Pre-launch report | AAB yüklemesi olmadığından rapor yok. Crash/ANR, erişilebilirlik, performans ve uyumluluk sonuçları üretilince ayrıca incelenmeli |

## İncelemeci ve test erişimi

Hesap gerektirmeden açılış → Ana Sayfa → Oyuna Başla → Kategoriler → zorluk → solo quiz/sonuç/inceleme; rozet, yerel profil ve ayarlar erişilebilir. Sonuçlar bu cihazda tutulur.

Gerçek çevrimiçi ekranlar için **henüz bu yayın adayına özel incelemeci hesabı atanmadı**. Gerekli: üretim verilerine erişmeyen, yalnız oyun oyuncusu yetkili sentetik hesap(lar), açık sahibi/temizleme planı ve izinli enrollment. Yeni üretim hesabı açma onayı bu görevden varsayılmadı. Doğrulama kodu gerektirmeyen güvenli inceleme yöntemi hazırlanmalı; kod/parola/token bu depoya veya mağaza açıklamasına yazılmaz. Gerekli incelemeci bilgileri yalnız Play Console'un uygulama erişimi alanına girilir. Genel kayıt/push/Google kayıt sınırları incelemeyi kolaylaştırmak için kapatılıp açılmaz.

Google testing izin listesi ve Supabase kimlikleri farklı şeylerdir. Google yeni kayıt kapalıyken yeni testerın düğmeye basıp hesap açabileceği vaat edilmez. Mevcut izinli Google kullanıcısı için gerçek native callback/oturum/hesap silme kabulü ayrı yapılmalı. Giriş iptali, hesap değiştirme ve bağlantı kesilmesi testi de gerçek Google kabulünden önce tamamlanmış sayılmaz.

## Gönderim sırası

1. Son hatasız APK ve test SHA'sını incele; mevcut `android-store-approval.json` koşulu için açık insan kararı al.
2. Hesap sahibi Console kaydı/yaş ve politika beyanlarını tamamlasın; sentetik incelemeci erişimi hazırlansın.
3. Onaylı kaynak ve production profiliyle AAB üret; manifest, imza, sürüm, sır taraması ve 16 KB uyumluluğunu gerçek AAB'de tekrar denetle.
4. Hangi AAB SHA'sının, hangi kapalı track ve ülke/tester grubuna yükleneceğini göstererek ayrı son gönderim onayı al. Otomatik submit yok.
5. Google incelemesi ve Pre-launch report sonuçlarını incele; P0/ANR/crash engellerini düzelt.
6. Gerçek katılım/opt-in olduktan sonra tester sürelerini takip et. İnceleme bitmeden “indirilebilir”, gereken süre dolmadan “üretim erişimine uygun” deme.

## Mağaza görsellerinin teknik kabulü

Altı yeni telefon görüntüsü son APK’da gerçek yerel oyun akışından alındı; kodlanmış RGB pikselleri yakalamayla aynı. Önceki çok uzun test görüntüleri mağaza dosyası olarak kullanılmadı. `screenshots-manifest.json` kaynak APK, kaynak yakalama hash’leri ve yükleme dosyası/RGB hash’lerini içerir. Onaylı uygulama görselleri değişmedi; mağaza ikonunun yalnız opak alfa kanalı eklendi, tanıtım ve ekran görüntülerinin opak alfa kanalı kaldırıldı. Her PNG boyutu, türü, dosya sınırı ve ekran oranı doğrulandı. Dosya uygunluğu görsel hakları veya Play inceleme onayı değildir.

[Resmî grafik koşulları](https://support.google.com/googleplay/android-developer/answer/9866151) (30.10.2026): simge 512×512/32-bit; tanıtım 1024×500/24-bit; telefon görüntüsü en az 320/en çok 3840 px, uzun kenar kısa kenarın en fazla iki katı, alfa yok.
