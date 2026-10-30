# Play Console kapalı test giriş taslağı

30.10.2026: mevcut Play Console uygulaması gerçek tarayıcı üzerinden doğrulandı. Uygulama taslak, kişisel geliştirici hesabında; henüz incelemeye gönderilmedi. Gizlilik URL'si, Oyun → Soru Cevap kategorisi ve aşağıdaki iş iletişimi taslağa kaydedildi (panel son doğrulamada 4/13 görev; sayı yayın kabulü değildir). Diğer satırlar açıkça belirtilmedikçe hazırlık taslağıdır. Özel Console ekran görüntüleri Git dışında saklanır.

| Alan                | Hazırlık / gereken karar                                                                                                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Uygulama adı        | `Anla & Ezberle: İslami Quiz` (27 karakter)                                                                                                                                                                                                                |
| Varsayılan dil      | Türkçe (tr-TR)                                                                                                                                                                                                                                             |
| Tür                 | Oyun → Soru Cevap; Console taslağında kaydedildi. Etiket seçilmedi                                                                                                                                                                                         |
| Ücret               | Ürün sahibi 30.10.2026 bu turda ücretsiz dağıtımı açıkça onayladı. Console'da Ücretsiz kaydedildi ve doğrulandı; merchant hesap açılmadı                                                                                                                   |
| Kalıcı paket        | `com.kovynelstudio.anlaezberle`, önceden onaylı; mevcut uygulama panelinde aynı paket görüntülendi                                                                                                                                                         |
| Hedef kitle         | Ürün sahibi 30.10.2026 bu turda 13 yaş ve üzeri hedefini seçti. Reklam beyanı artık kayıtlı; form Uygulama Erişimi önkoşulunu bekliyor; 13–15, 16–17, 18+ seçimi henüz kaydedilmedi; IARC ayrı. 13-altı hedefi varsayılmadı                                |
| İçerik derecesi     | IARC anketi henüz doldurulmadı; tahmini yaş derecesi yazılmadı. Çevrimiçi kullanıcı etkileşimi ve kişisel profil alanları saklanmamalı                                                                                                                     |
| Reklam              | AdMob test dalında native SDK ve test reklamları ekleniyor. Reklam sunan nihai binary için “Evet”; eski reklamsız APK beyanı bu adaya taşınmaz. Test reklamı içeren aday için Console taslağına Evet kaydedildi; nihai AAB reklam modu ayrıca doğrulanacak |
| Uygulama erişimi    | Solo misafir erişimi var; sosyal/oda/sıralama için doğrulanmış yetkili hesap gerekir. İncelemeci erişimi aşağıda                                                                                                                                           |
| Data Safety         | `data-safety-draft.md` doldurma kaynağıdır; “veri toplanmıyor” seçilmez. Kesin veri türü/amaç/opsiyonellik/sağlayıcı rolleri ve saklama eksikleri hesap sahibiyle doğrulanmalı                                                                             |
| Gizlilik            | https://anla-ezberle-quiz.vercel.app/privacy — PR #19 ile ayrı onayla Production'da yayımlandı, herkese açık metin doğrulandı; Console taslağına kaydedildi                                                                                                |
| Dış hesap silme     | https://anla-ezberle-quiz.vercel.app/account-delete — gerçek güvenli akış; giriş/yeniden doğrulama gerekir                                                                                                                                                 |
| İletişim            | `kovynelstudio@gmail.com` ve mevcut web adresi Console taslağına kaydedildi; telefon eklenmedi                                                                                                                                                             |
| İkon                | `store/google-play/icon-512.png`, 512×512, 32-bit PNG; Console taslağına eklendi; uygulama ikonunun RGB pikselleri aynı                                                                                                                                    |
| Tanıtım             | `feature-graphic-1024x500.png`, 1024×500, 24-bit PNG/alfa yok; ayrı tanıtım kompozisyonu; Console taslağına eklendi                                                                                                                                        |
| Telefon görüntüleri | `phone-screenshots/` içindeki altı gerçek Android 16 emülatör yakalaması; 1080×1920, 24-bit PNG/alfa yok. Paket dizini `telefon-ekranlari/`. Console taslağına eklendi. Yer tutucu veya fiziksel Samsung kabulü değildir                                   |
| Ülkeler             | Henüz seçilmedi. Türkçe ve ilgili içerik için hedef ülkeler kararı gerekli                                                                                                                                                                                 |
| Tester grubu        | Henüz oluşmadı; tester e-posta listeleri Git'e eklenmez                                                                                                                                                                                                    |
| Play App Signing    | Console'da kurulmadı. Preview sertifikası mağaza imza onayı değildir; upload anahtarı hesabın güvenli saklama düzeniyle kesinleşmeli                                                                                                                       |
| Sürüm               | Preview 0.1.0/code1. Store AAB onay sonrası remote autoIncrement ve benzersiz artan versionCode ile üretilip ayrıca denetlenmeli                                                                                                                           |
| Kapalı test/opt-in  | Henüz track, davet/katılım URL'si veya indirilebilir Play sürümü yok; EAS bağlantısı Play opt-in değildir                                                                                                                                                  |
| 12 tester/14 gün    | Mevcut kişisel hesap panelinde 12 kişinin kesintisiz 14 gün koşulu açıkça doğrulandı. 0 kayıtlı tester; Üretime Başvur devre dışı. Sayaç başlamadı                                                                                                         |
| Pre-launch report   | AAB yüklemesi olmadığından rapor yok. Crash/ANR, erişilebilirlik, performans ve uyumluluk sonuçları üretilince ayrıca incelenmeli                                                                                                                          |

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
