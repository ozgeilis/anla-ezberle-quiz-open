# Yeni EAS APK — gerçek Android 14 emülatör retesti

31 Ekim 2026 · kaynak `a506f873d1de17b8bc98804df06f983558e48530` · [EAS build bc3c86f5](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/bc3c86f5-e326-4984-8b19-4173282c742d) **FINISHED**.

APK SHA-256: `aac0b20c92e0268800312447a7f84deb3a427a7e1b68b8741efd5697fd64165f`.

## Hata ve düzeltme

Önceki `d33a229f` / `7db5e96` APK, gerçek hesapla yazı/tema değişiminde `AccountInbox` Realtime callback yeniden aboneliği yüzünden çöktü. Bu binary kabul dışıdır; eski rapordaki statik doğrulamalar hata bulunmadığı anlamına gelmez.

Supabase Realtime istemcisi aynı konudaki kanalı yeniden kullanabiliyor, `removeChannel` ise asenkron. `realtimeSubscription.ts` aynı konu için önceki kapanışı bekler, iptal edilen yeniden abonelikleri durdurur ve kapanış/kanal sahipliği başarısızlığında mevcut polling yolunu korur. Inbox ve canlı oda aynı yardımcıyı kullanır; konu adları, filtreler, özel oda ve presence ayarları değişmez. Beş regresyon testiyle birlikte `pnpm check` **375/375**, TypeScript/lint/soru bütünlüğü ve `pnpm export:web` geçti. CI/Vercel Preview kontrolü de kaynak commit için başarılı.

## Yeni binary üzerinde yapılan

| Kontrol                 | Sonuç                                                                                                                                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Güncelleme kurulumu     | `adb install -r`: Success. Önceki EAS imzası ve paket korundu; uninstall/data clear yok                                                                                                                         |
| Android API             | Emülatör Android14/API34; APK min24, target36, compile37, versionCode1                                                                                                                                          |
| Statik binary           | İmza doğrulaması PASS; ZIP 16KB PASS; 52 adet arm64/x86_64 ELF LOAD hizalaması PASS. [Binary kanıtı](realtime-fix-apk-evidence.json)                                                                            |
| Oturum/veri devamlılığı | Yetkili sentetik incelemeci adı, okunmamış gerçek davet bildirimi, son skor100 ve XP80 mevcut. Yeni gerçek hesap veya veri temizleme yok                                                                        |
| Çökme regresyonu        | 320/360/390dp × %100/%150/%200 × açık/koyu = **18/18**. Yeni kurulum zamanından sonra fatal kayıt0; eski fatal günlükte özellikle korundu                                                                       |
| Alt navigasyon          | Her genişlik/tema için üç ölçekte bar yüksekliği ve etiket yüksekliği aynı; beş etiket tek satır, sınırlar ekran içinde, dokunma alanları en az48dp. [Gerçek ölçümler](realtime-fix-layout-matrix-results.json) |
| Reklam varsayılanı      | Yetişkin beyanı/test izni kapalı; reklamlar kapalı. Yalnız test emülatöründe UI üzerinden isteğe bağlı test açıldı                                                                                              |
| UMP/native SDK          | Gerçek izin hazırlama tamamlandı ve hazır durumu görüldü. Bu release'de bölge zorlaması veya sahte izin sonucu kullanılmadı; EEA formu gösterildiği iddia edilmiyor                                             |
| Adaptive banner         | Google'ın gerçek **Test Ad / AdMob Adaptive Banner** içeriği yüklendi ve görüntülendi. Reklam tıklanmadı                                                                                                        |
| Yerel kapatma           | Test izni kapatıldı; yeniden başlatma sonrası kapalı kaldı. Test sonunda yetişkin beyanı da eski kapalı durumuna döndürüldü                                                                                     |

[Makineyle okunabilir test kapsamı](realtime-fix-native-validation.json). Ölçümler UIAutomator'ın yeni ürettiği hiyerarşiden, ekranlar ADB'nin gerçek screencap çıktısından alınır. Metinler veya reklam kreatifi resme sonradan eklenmez. UIAutomator erişemediğinde eski XML başarı sayılmadı. Kullanıcı bu emulator UI yöntemini açıkça istedi.

### Gerçek görüntüler

- [390dp normal yazı, açık tema](screenshots/realtime-fix-matrix-390-no-font100.png)
- [320dp %200 yazı, koyu tema](screenshots/realtime-fix-matrix-320-yes-font200.png)
- [Gerçek Google test banner'ı](screenshots/realtime-fix-test-banner-home.png)
- [Yeni gerçek quiz sonucu](screenshots/realtime-fix-new-apk-quiz-result.png)
- [İsteğe bağlı reklam teklifi](screenshots/realtime-fix-result-transition-offer.png), [gerçek interstitial](screenshots/realtime-fix-real-interstitial-open.png), [arka plandan dönüş](screenshots/realtime-fix-interstitial-returned-home.png)
- [Test sonunda reklamlar yeniden kapalı](screenshots/realtime-fix-ad-defaults-restored.png)

## Sınırlar

Bu kontrol fiziksel Samsung kabulü değildir. Sesler emülatörde fiziksel olarak dinlenmedi. Yeni APK'da EEA ret/geri çekme formu, açık Close düğmesiyle kapanış, gerçek beş dakikalık frekans, native Google OAuth ve iOS kabulü yeniden yapılmadı; PR #18'in önceki kanıtları korunur ve yeni APK'ya otomatik taşınmaz. 16KB statik kontrol gerçek16KB cihaz/runtime veya son AAB kontrolünün yerine geçmez.

18/18 matrisi bütün uygulama ekranlarının bütün fontlarda tam kabulü demek değildir; bu matris ana sayfa/alt navigasyon ve yeniden abonelik çökmesini kapsar. Önceki binary'deki gerçek arkadaşlık/davet/oda/solo UI testleri ayrıca [incelemeci planında](reviewer-access-plan.md) belgelenir; yeni binary'de bunların tamamı yeniden oynanmış sayılmaz.

Main, Production, Supabase şeması, Auth/push politikaları ve soru bankası değişmedi. Gerçek reklamlar veya Analytics açılmadı. AAB kapısı `approved:false`; henüz AAB üretilmedi, yüklenmedi, Play sürümü gönderilmedi. Fiziksel cihaz yokken hangi kabul kanıtının yeterli olacağı ayrı insan kararıdır.

## AAB profil hazırlığı

Native test APK kodu a506f87 olarak sabittir. Sonraki profil/test/rapor değişikliği377/377 check ve web/Android Hermes export geçti. Yeni `ads-closed-test` appConfig, EAS CLI çözümünde test edilmiş `ads-preview` ile tamamen aynı; store paketleme/versionCode hazırlığıdır, AAB henüz üretilmiş değildir. [Onay bekleyen plan](closed-test-aab-plan.md).
