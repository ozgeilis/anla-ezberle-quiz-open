# Android APK: gerçek cihaz ses kabulü

Durum: **BEKLİYOR**. Kullanıcı 24 Ekim 2026 tarihinde fiziksel Android telefona erişimi olduğunu, USB kablosu bulunmadığını belirtti. Kablosuz APK kurulumu yeterlidir; cihazda ses kabulü henüz yapılmadı. ADB listesinde bağlı cihaz yok. Web/CI testleri, native konfigürasyon veya APK'nın derlenmesi cihazda ses duyulduğu anlamına gelmez.

Bu form gerçek APK kurulumu ve kullanıcı dinlemesiyle doldurulur. Model, Android sürümü, APK SHA-256 ve test tarihi kaydedilmeli; e-posta, parola, JWT veya özel maç bilgileri rapora eklenmemeli. Mevcut uygulama/kayıtlar silinmemeli. İmza uyuşmazlığında uygulamayı kaldırmak yerine durulmalı.

## Kurulum

[24 Ekim onaylı kimlik APK’sının kurulum sayfasını](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/e729151d-6bf7-4d9a-bb95-5139eda2effa) telefonda aç veya bilgisayardaki Install QR kodunu tara. USB, Android Studio, Expo Go veya Metro gerekmez. APK'yı yalnız verilen resmî build adresinden indir; gerekiyorsa yalnız bu indirme için ilgili tarayıcının uygulama yükleme onayını kendin ver. Kurulumdan sonra uygulama Metro veya bilgisayar bağlantısı olmadan açılmalı. Bu bir Google Play yayını değildir. Kullanıcı 24 Ekim’de `com.kovynelstudio.anlaezberle` kimliğini onayladı; yeni kabul APK’sı bu kimlikle üretilir. Önceki `.prototype` APK’ları yeni kimliğin cihaz kabulü sayılmaz. Eski uygulamayı kaldırmayın; iki kimlik ayrı yerel veri alanı kullanır ve otomatik ilerleme aktarımı yoktur.

## Efektler (her satır henüz cihazda test edilmedi)

| Ses       | Gerçek tetikleyici / beklenen davranış                                                                                                               |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| tap       | Menü düğmesine dokun; kısa dokunma sesi, seri basmada yığılma yok.                                                                                   |
| select    | Kategori/zorluk seçimini değiştir; yumuşak seçim sesi.                                                                                               |
| correct   | Tek kişilik turda gerçekten doğru yanıt ver; bir kere doğru sesi.                                                                                    |
| wrong     | Gerçekten yanlış yanıt ver; bir kere yanlış sesi, açıklama ve doğru yanıt korunur.                                                                   |
| next      | Sonraki soruya geç; gerçek soru değişiminde tek geçiş sesi.                                                                                          |
| timeout   | Yetkili iki hesapla canlı odada bir soruyu yanıtsız bırak; yalnız sunucunun açıklama aşamasında süre sonu sesi. Süresiz solo modda bu ses beklenmez. |
| completed | Kusursuz olmayan bir turu gerçekten bitir; sonuç sesi bir kere. Sonucu tekrar açmak yeniden çaldırmaz.                                               |
| perfect   | 10/10 doğruyla gerçek turu bitir; kusursuz sonuç sesi.                                                                                               |
| badge     | Gerçek bir yeni rozet kazan; ses bir kere. Eski rozet albümünü açmak ses üretmez.                                                                    |
| levelUp   | Mevcut gerçek XP eşiğini aşarak seviye kazan; ses bir kere. Sahte XP/rozet ekleme veya eski kayıtları sıfırlama yapılmaz.                            |

Sonuç/rozet/seviye aynı anda gelirse gerçek kutlamalar kısa sırayla çalabilir. Düşük öncelikli dokunma sesinin kutlama sırasında atlanması kasıtlıdır. Sunucuya gönderilmemiş veya henüz açıklanmamış rekabetçi cevap sesle ele verilmemelidir.

## Müzik, Android ve kalıcılık

1. İlk kurulum: efekt açık %50, müzik kapalı %50. Var olan tercih varsa yeni varsayılanla üzerine yazılmamalı.
2. Ayarlar → Ses ve Müzik: Efekti dene; uygulama efekt düzeyini %0/%50/%100 dene. Sonra ilk değere geri getir.
3. Android'in **medya** sesini %0/%50/%100 değiştir; çıkışın OS medya sesiyle uyumunu dinle. Zil/sessiz/DND, Bluetooth ve kulaklık davranışlarını ayrı kaydet; iOS/web sonucu Android kanıtı değildir.
4. Müziği aç; izinli ana menüde çalmalı. Soru ve sonuç ekranına geçince durmalı. Müzik kapalıyken kendiliğinden başlamamalı.
5. Home ile arka plana al ve ekranı kilitle; müzik/efekt hemen durmalı. Uygulamaya dönünce eski cevap/kutlama sesleri yeniden çalmamalı.
6. Uygulamayı son uygulamalardan kapatıp tekrar aç; efekt/müzik tercihleri ve seviyeleri kalmalı. Mevcut skor/XP/rozetler korunmalı.
7. Yerel turda interneti kapat; paketli efektler çalışmalı. Çevrimiçi maçta sunucu onayı bekleyen cevaba doğru/yanlış sesi erken verilmemeli. Yeniden bağlanınca aynı kabul iki kere çalmamalı/puanlanmamalı.
8. Başka bir uygulamanın müziği, telefon araması ve ses çıkışı değişimiyle kesintileri dinle; mikrofon izni veya arka plan ses servisi istememeli.

## Kabul kaydı

- Cihaz / Android: bekliyor
- APK build kimliği: `e729151d-6bf7-4d9a-bb95-5139eda2effa`
- APK SHA-256: `d8aecea2889314276f4328ea57cf44fc4dc103d88fe374578316319d53136439`
- 10 efekt: test edilmedi
- Müzik / medya düzeyi / arka plan / yeniden açma: test edilmedi
- Kayıtlar / tercih kalıcılığı: cihazda test edilmedi
- Öznel ses yüksekliği, çatlama veya gecikme: dinleme bekliyor
- Karar: **APK KABUL EDİLMEDİ; AAB ÜRETİMİ BEKLİYOR**

Başarılı gerçek cihaz kabulünden ve kalıcı Android paket kimliğine kullanıcı onayından önce `config/android-store-approval.json` onaylanmaz. Paket kimliği değişirse o kimlikle yeni APK kabulü gerekir.
