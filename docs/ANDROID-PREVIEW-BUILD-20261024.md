# Android preview — onaylı paket kimliği, 24 Ekim 2026

**APK gerçekten oluşturuldu ve indirilen binary denetlendi. Fiziksel ses kabulü henüz yapılmadı.**

- [Expo kurulum / QR sayfası](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/e729151d-6bf7-4d9a-bb95-5139eda2effa)
- [Doğrudan APK](https://expo.dev/artifacts/eas/RbCAfo-2Zs7rIceH6ZCGr_yuCsrAbo-O_0V2N7GJOmQ.apk)
- Build: `e729151d-6bf7-4d9a-bb95-5139eda2effa`, `FINISHED` / Succeeded. Oluşturma 06:44:11 UTC, bitiş 06:59:33 UTC. Ücretsiz EAS planı, üçüncü Android build; ödeme veya plan yükseltme yok.
- Kaynak: `600c8db1cdf70ac264c8c2482ebc3b70629fa821`, `feat/android-preview-play-readiness`. Kontrol edilen GitHub main `0b2a2aac5cddaf5a9fc2af5f5b1988ada83fa94a`; main’in ses entegrasyonu üzerine Android hazırlığı uygulanmıştır. main veya Vercel’e dağıtım yapılmadı.
- Mevcut `preview` profili, internal dağıtım, imzalı release APK, developmentClient=false. USB, Android Studio, Expo Go veya Metro gerekmez. İnternet çevrimiçi işlevler için gerekir.
- Kullanıcı onaylı paket: `com.kovynelstudio.anlaezberle`. Sürüm `0.1.0`, versionCode `1`. iOS `.prototype` ve auth scheme değişmedi.
- Önceki `.prototype` kurulumları silinmedi. Yeni kimlik ayrı Android veri alanıdır; yerel ilerlemenin otomatik taşındığı söylenemez. Aynı auth scheme kullanan iki kurulum birlikteyse Android dönüş bağlantısı uygulama seçimi gösterebilir; gerçek cihazda kabul bekler.

## İndirilen APK kanıtı

| Kontrol                    | Sonuç                                                                                                                                                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Boyut                      | 104.172.747 bayt                                                                                                                                                                                                |
| SHA-256                    | `d8aecea2889314276f4328ea57cf44fc4dc103d88fe374578316319d53136439`                                                                                                                                              |
| Manifest                   | Onaylı paket, target API **36**, compile API **37**                                                                                                                                                             |
| İmza                       | `apksigner verify` başarılı, v2, tek imzalayan; Play App Signing kurulumu değildir                                                                                                                              |
| Ses                        | Native ExpoAudio DEX içinde; 10 efekt + 1 müzik WAV kaynak hash’leriyle birebir eşleşiyor                                                                                                                       |
| Hermes / istemci güvenliği | Bytecode çözüldü; 21.467 gerçek string sabitinde secret anahtarı veya service-role JWT eşleşmesi yok. Mevcut Frankfurt endpoint/publishable istemci yapılandırması var; sunucu güvenliğinin tam kanıtı değildir |
| Ses izinleri               | RECORD_AUDIO / audio foreground service izni yok; önceki raporda belirtilen devralınan diğer izinlerin mağaza öncesi incelemesi hâlâ açık                                                                       |
| Expo                       | SDK 58.0.19, Expo Audio 58.0.10, EAS doctor **20/20**, yerel dependency check temiz                                                                                                                             |
| Kontroller                 | `pnpm check`: soru bütünlüğü, TypeScript, lint, **296/296 test**, 0 skip. `pnpm export:web` ve native ses yapılandırma kontrolü başarılı                                                                        |

Görseller, soru içerikleri/cevapları, geçmiş bankalar, skor/XP/rozet mantığı ve canlı Supabase verileri değiştirilmedi. EAS preview ortamında yalnız mevcut istemci URL/publishable key kullanıldı. Yönetici anahtarı eklenmedi.

## Kablosuz gerçek cihaz kabulü

Kullanıcıda artık Android telefon var; USB kablosu yok. Expo build sayfasında Install’a basıp QR kodu telefon kamerasıyla tarayabilir veya doğrudan bağlantıyı telefonda açabilir. APK indirmesine ilişkin Android onaylarını kullanıcı kendisi tamamlar. Eski uygulama veya kayıtlar silinmez; imza uyuşmazlığında durulur.

[Cihaz kabul formu](ANDROID-AUDIO-DEVICE-ACCEPTANCE.md): model/Android sürümü, doğru-yanlış-geçiş-süre sonu-sonuç-rozet-seviye sesleri, müzik, medya ses düzeyi, arka plan, yeniden açma ve tercih kalıcılığı gerçek cihazda kontrol edilecek. Süre sonu için gerçek yetkili canlı oda gerekir; süresiz solo oyunda beklenmez. Ödül testleri sahte XP/rozet eklenerek yapılmaz.

**AAB üretilmedi, Play’e gönderilmedi.** Kimlik onayı ayrı kaydedildi; `approved=false`, `acceptedApkSha256=null` olduğundan gerçek cihaz kabulü tamamlanmadan production hook’u engeller. Draft PR #2 korunur. Gizlilik, hesap silme, Data safety, mağaza erişim/derecelendirme, izin ve görsel hakları işleri [hazırlık raporunda](ANDROID-PLAY-READINESS.md) açıktır. EAS linki incelemede 13 gün erişilebilirlik gösterdi; kalıcı mağaza adresi değildir.
