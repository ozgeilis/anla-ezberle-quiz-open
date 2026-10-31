# Onaylı kapalı test AAB denemesi — 31 Ekim 2026

Ürün sahibi somut planı “Yalnız bu AAB üretimini onaylıyorum” yanıtıyla kabul etti. Fiziksel Samsung/ses/native OAuth/iOS kabulü verilmiş sayılmadı.

- [EAS build7d8591e7](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/7d8591e7-b127-49c0-92ad-59288f5d950b)
- Kaynak `8d13fc26b2c68a209970ac226dfb2a6a1d650c59`
- Profil `ads-closed-test`, dağıtımSTORE, versionCode2
- Aynı EAS Android keystore; `--freeze-credentials`, non-interactive, otomatik submit yok
- EAS proje hesabı/ücretsiz kota akışı; ücretli yükseltme yapılmadı
- İlk durumNEW ardından FINISHED. Son artifact indirildi ve aşağıdaki kapsamda doğrulandı.

Build snapshot onaylı dosyayı içerir. Upload tamamlanıp buildID alındıktan sonra yerel/PR kapısı yeniden `approved:false` yapıldı; bir sonraki build için kalıcı açık izin bırakılmadı. Onay dayanağı ve tüketen build kimliği korunur. Bu kapatma yüklü snapshot'ı değiştirmez.

Son kaynak378/378 check geçti. Standart kapı testleri gerçek dosyanın daima false olduğunu varsaymadan bağımsız fixture ile onaysız iki profili reddeder; sadece kapalı test onayı production profilini açamaz.

Main/Production veya Supabase değişikliği, gerçek reklam/Analytics, Play yükleme/inceleme gönderimi yok. Gerçek artifact ve Android16 sonuçları aşağıdadır.

## Gerçek AAB sonucu

**FINISHED**, EAS tamamlanma zamanı `2026-10-31T07:59:30.490Z`.

- Boyut83.995.235 bayt; SHA-256 `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a`.
- Paket `com.kovynelstudio.anlaezberle`, versionName0.1.0, versionCode2, min24/target36/compile37, debuggablefalse.
- Resmî Google bundletool1.18.3 `validate` PASS; aracın yayınlanan SHA-256 özeti indirme dosyasıyla eşleşti.
- JAR imzası kriptografik olarak doğrulandı; upload sertifikası kabul EAS APK'sıyla aynı. Self-signed Android sertifikası, CA zinciri güveni iddiası değildir. Play App Signing ve nihai Play dağıtım sertifikası henüz doğrulanmadı.
- BundleConfig16KB,52 adet64-bit ELF16KB LOAD hizası ve AAB'den yerel üretilen APK'nın `zipalign -c -P 16 4` kontrolü PASS. Android16 emülatör çekirdeği4096 bayt sayfalı; bu gerçek16KB kernel testi değildir.
- Hermes bytecode ve52 native64 kitaplık kabul APK'sıyla **birebir aynı**.11 ses dosyasının içerik SHA'ları da aynı; AAB/APK kaynak dosya yolları farklı olabildiğinden içerik hash'i karşılaştırıldı. Fiziksel duyulabilirlik kabulü verilmedi.
- Ad-ID/AdServices, mikrofon ve overlay izinleri yok. AAB assetlerinde isimli secret örüntüleri tarandı; aynı Hermes'in daha önce çözümlenmiş SDK `sb_secret_` prefix false-positive'i haricinde eşleşme yok. Bu bütün olası native secret biçimleri için mutlak garanti değildir.

[Tam binary kanıtı](closed-test-aab-evidence.json).

## Android16 gerçek yerel test

AAB'den bundletool ile universal APK üretildi. **Yalnız yeni `AnlaAabValidation36` test AVD'si için ayrı yerel debug sertifikası** kullanıldı; EAS AAB imzası değiştirilmedi/anahtarı indirilmedi. Bu debug APK telefondaki EAS uygulamasına güncelleme olarak sunulmaz. Eski Android14 AVD verileri korundu; yeni paket yalnız yeni AVD'ye temiz kuruldu.

Beş ana sekme açıldı.320/360/390dp × %100/%150/%200 × açık/koyu **18/18** ölçü geçti; bar/etiket boyutu sabit, dokunma alanları en az48dp. Yeni fatal kayıt0. [Matris](aab-api36-layout-matrix.json), [sekme gözlemleri](aab-api36-tabs-smoke.json). Bu sonuç, önceki Android14 EAS APK'sındaki18 testle toplam36 düzen durumudur; bütün ekranların tüm erişilebilirlik veya sosyal akış kabulü değildir.

Gerçek görüntüler: [Ana Sayfa](screenshots/aab-api36-home.png), [Kategoriler](screenshots/aab-api36-categories.png), [Sıralama](screenshots/aab-api36-leaderboard.png), [Rozetler](screenshots/aab-api36-badges.png), [Profil](screenshots/aab-api36-profile.png), [320dp koyu/%200](screenshots/aab-api36-320-dark-font200.png).

## Quiz, açıklamalar ve kayıt kalıcılığı

AAB kaynaklı uygulamada gerçek 10 soruluk yerel tur tamamlandı: **1 doğru,4 yanlış,5 cevapsız;100 skor,10 XP,01:08**. Sonuçtaki skor tam görünür. Yanlış/cevapsız inceleme ekranında9 kayıt, kaynak bağlantıları ve açıklamalar görüldü. Uygulama süreçten kapatılıp yeniden açıldığında Son Skor100 ve XP10 korundu; yeni fatal0. Yeni izole misafir verileridir; gerçek hesaplara test kaydı eklenmedi.

Sınırlama: süreli screenshot/OCR yardımcı scripti10 dokunma denemesinden sonra sonuç ekranını algılamadan bitti. Bu otomasyon başarılı sonuç algılaması olarak sayılmadı. Ardından taze UIAutomator hiyerarşisi ve gerçek görüntülerle tamamlanan sonuç doğrudan doğrulandı; dokunma denemelerinin tamamının cevap kabul edildiği iddia edilmez.

[Görüntü: sonuç](screenshots/aab-api36-quiz-result.png) · [kaynaklı inceleme](screenshots/aab-api36-answer-review.png) · [yeniden açılışta kayıt](screenshots/aab-api36-restart-persistence.png).

Açık P2 görsel bulgu: açık temadaki ikincil “Yeni kişisel rekor!” mint yazısı düşük kontrastlı. Ana skorun kesilmesi görülmedi. Bu kozmetik takip maddesi gizlenmedi; bir-build onayı kapsamında yeni kaynak değişikliği/ikinci build yapılmadı.

## Kalan yayın adımı

AAB teknik doğrulaması kapalı testin yayımlandığı anlamına gelmez. Test grubu henüz hazır değil;0 katılımcı,14 günlük süre başlamadı. Alpha yalnız Türkiye. Kesin AAB SHA/track ve Play App Signing kapsamıyla **ayrı yükleme/gönderim onayı** gerekir. Google Pre-launch report henüz yok. Main/Production, gerçek reklamlar, Analytics, genel push ve gerçek hesaplar değişmedi.

Fiziksel Samsung/ses, native Google OAuth ve iOS, gerçek Play-signed dağıtım,16KB çekirdek ve raporda belirtilen reklam kabul eksikleri korunur.

Resmî yöntem: [Android bundletool belgesi](https://developer.android.com/tools/bundletool), [Google bundletool1.18.3 yayını](https://github.com/google/bundletool/releases/tag/1.18.3).

## Sonraki imzalama gözlemi

[Upload öncesi devam kontrolünde](play-draft-upload-plan-20261031.md) mevcut Play anahtarı Kullanımda görüldü. Yukarıdaki “henüz doğrulanmadı” ifadesi AAB üretim anına aittir. Nihai Play-signed artifact/üzerine güncelleme testi hâlâ yapılmadı; AAB ve statik kontroller değişmedi.
