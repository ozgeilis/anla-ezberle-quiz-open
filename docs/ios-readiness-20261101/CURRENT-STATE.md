# PR #25 devamı — doğrulanmış durum

Tarih: 1 Kasım 2026. Bu kayıt Android Alpha veya main üzerinde bir işlem yetkisi vermez.

## Apple / Connect

- Apple Developer Program üyeliği aktif; bireysel üyelik. Team `W7CRC43SHP`. Mevcut program lisansının 1 Kasım günü zaten kabul edildiği görüldü; bu çalışma yeni sözleşme kabul etmedi veya ücretli işlem yapmadı.
- Certificates, Identifiers & Profiles ve App Store Connect Apps erişimi açıldı. Yeni App ID kayıt yetkisi gerçek kayıtla doğrulandı.
- Sahibi son onay ekranında ayrıca izin verdi; `Anla Ezberle` / `com.kovynelstudio.anlaezberle` kaydedildi. Eski `com.anlaezberle.quiz.prototype` kaydı korundu.
- Sahibi ayrıca onay verince yeni App ID üzerinde **Sign in with Apple (primary)** ve **Push Notifications** kaydedildi; edit sayfası tekrar açıldı, iki değer true ve Save disabled görüldü. Broadcast false. APNs key/sertifika oluşturulmadı.
- App Store Connect kaydı oluşturuldu: **Anla & Ezberle: İslami Quiz**, Türkçe, iOS, SKU `anlaezberle-ios`, Apple ID **6829516832**. İlk Create cevabı hata gösterdi; tekrar kayıt oluşturmadan liste yenilendi ve kaydın oluştuğu doğrulandı.
- [TestFlight](https://appstoreconnect.apple.com/teams/38b04e22-235f-4480-ab4b-32527bfe50f8/apps/6829516832/testflight): **No Builds**. Beta açıklaması, `kovynelstudio@gmail.com` feedback adresi ve mevcut `/privacy` URL'si Saved olarak doğrulandı. Review kişi/telefon alanları, reviewer hesabı ve kişisel veriler girilmedi. İç grup planı hazır; tester eklenmedi.
- Yerel Keychain'de bu Team'e ait, private key ile eşleşen **bir geçerli Apple Development** kimliği doğrulandı (CN parantezi yerine sertifika OU/Team ve geçerli identity fingerprint eşleşmesi kontrol edildi). Bu Team için Apple Distribution kimliği bulunmadı. Özel anahtar okunmadı, aktarılmadı veya Git'e alınmadı.

## Kod ve yapılandırma

Default/prototip kimliği korunur. Yalnız yeni `ios-testflight` profili kayıtlı kalıcı kimlik ve Team'i seçer; yeni `ios-development` profili de kayıtlı kimliğe açık profile env ile geçer ve ayrı `developmentBuildApproved` kapısı kapalıdır. Eski `development` profili prototipi korur. Yeni profiller mevcut `preview` EAS ortamından aynı Frankfurt public istemci yapılandırmasını alır; sunucu veya mevcut Android EAS profilleri değiştirilmez.

EAS `config --profile` önizlemesinin worker'daki `EAS_BUILD_PROFILE` değişkenini vermediği görüldü. Bu nedenle profilin `IOS_BUILD_TARGET` işareti kullanıldı. **Gerçek EAS config çıktısı** TestFlight için kalıcı Bundle ID, `W7CRC43SHP`, store/Release, `autoIncrement=buildNumber` ve production APNs plugin'ini artık birlikte üretiyor. Bu salt okunur kontroldür; build/credential oluşturmaz.

`config/ios-store-approval.json`: Team/App ID/Connect olguları kaydedildi; **approved=false**, fiziksel/Auth-silme/review kabulü false. İmzalı distribution build kapısı kapalı. Yeni read-only `scripts/verify-ios-store.mjs`, ilerideki çıkarılmış IPA `.app` için kimlik/Team/profile expiry/debug/APNs/Apple capability/iPad/izin kontrollerini hazırlar. Sentetik metadata testleri gerçek IPA doğrulaması sayılmaz.

## Gerçek native simülatör kabulü

Yerel arm64 **Release BUILD SUCCEEDED**, `CODE_SIGNING_ALLOWED=NO`; iOS27.0 mevcut runtime, Xcode27.1 SDK, minimum16.4. Metro gerektirmeyen gömülü JS bundle SHA ve native privacy/Pod kanıtı `simulator-artifact.json` içindedir. Sonraki değişiklikler build profili/kimlik doğrulayıcısı/dokümantasyondur; bu kabul uygulamasında gerçek Apple login ek bir kabul kazanmış değildir.

| Kontrol | Sonuç / kapsam |
|---|---|
| iPhone13 Pro 390pt açılış/ana sayfa/kategoriler/hazırlık | GEÇTİ; gerçek native UI, ekran görüntüleri |
| 10 soruluk Kolay tur / 20sn / otomatik ilerleme | GEÇTİ; 1 doğru, 2 yanlış, 7 cevapsız; skor100, XP10; gerçek yerel tur |
| Sonuç / yanlış cevap açıklamaları ve kaynaklar | GEÇTİ; skor rakamı tam görünür; sürekli kare kaydı olmadığı için tek karelik flash yokluğu kesin kabul edilmez |
| Profil / kademeli XP / gerçek yerel istatistik | GEÇTİ; 10/100XP, seviye1, 1 oyun, %10, toplam100 |
| Tema seç → Kaydet / koyu tema | GEÇTİ; kayıt öncesi tema uygulanmadı; kayıt sonrası koyu |
| Bildirim ayarları | GEÇTİ; gelen kutusuna yönlenmedi, misafir/uygun olmayan cihaz uyarısı doğru |
| Avatar önizle / Vazgeç | GEÇTİ; mevcut 12 seçenek, tesettürlü/tesettürsüz çizimler; seçim kaydedilmeden çıkış |
| Büyük sistem yazısı | GEÇTİ (örnek kapsam); Device Hub Text Size3→7, Home/Profile kartları tek sütun; sonra3'e döndürüldü; yüzde eşlemesi iddia edilmez |
| Force close → yeniden aç | Yerel XP10 ve koyu tema korundu; Supabase session kalıcılığı testi değildir |
| iPad13 M4, portrait Home / landscape Profile / Orta quiz | GEÇTİ (smoke); 20'den başlayan soru, doğru cevap100 ve otomatik ilerleme; tam iPad turu/online/klavye kabulü yapılmadı |
| 320/375/430pt native tam matris | ÇALIŞTIRILMADI; 390 ve iPad ölçüleri diğer ölçüler yerine sunulmaz. 320pt eski iPhone/runtime desteği ayrıca değerlendirilir |
| Gerçek arkadaş isteği/davet kartı, oda ve cross-platform | ÇALIŞTIRILMADI; izinli iOS test hesabı yok; Android kabulü taşınmadı |
| Apple/Google/Safari gerçek giriş ve hesap silme | ÇALIŞTIRILMADI; Apple provider kapalı; yeni sentetik hesap yetkisi yok |
| Fiziksel iPhone/APNs/sessiz anahtarı/ses çıkışı | ÇALIŞTIRILMADI |

### İmzasız uygulamanın Keychain sınırı — açık engel

Online ekranda “Oturum depolamasına erişilemiyor” görüldü. Bu `.app` imzasında entitlements yok. Yalnız güvenli hata özetiyle simülatör `securityd` logunda **errSecMissingEntitlement (-34018)** ve application-identifier/keychain-access-groups eksikliği doğrulandı. Token veya kişisel loglar dışarı çıkarılmadı. Güvenli depoyu plaintext fallback ile değiştirmek çözüm değildir ve yapılmadı.

Sonraki Auth kabulü normal entitlements içeren, ayrıca onaylanmış iOS development build'i üzerinde yapılmalı. Bu imzasız UI kabulünden gerçek login/kalıcılık sonucu çıkarılmaz. [Apple Keychain entitlement açıklaması](https://developer.apple.com/documentation/security/errsecmissingentitlement).

## Açık güvenlik ve dağıtım kapıları

1. Apple güvenli silme/revocation, hook ve dar capability RPC implementasyonu + SQL/Edge/gerçek servis testleri: **eksik**, ayrı [sunucu inceleme planı](SERVER-CHANGE-REVIEW.md). Provider kapalı kalır.
2. Kullanıcı adları/davetler için şikâyet, engelleme ve moderasyon: **eksik**, görünmezden gelinmez; yayın kabulü verilmedi.
3. Yeni kalıcı uygulama ile prototip aynı custom scheme'i paylaşır. Dar Universal Link/AASA ve gerçek callback kabulü ayrı planlanır; eski uygulama silinmez, yerel veriler kendiliğinden taşınmış sayılmaz.
4. App Store provisioning/Distribution sertifikası/APNs key/Apple revoke key, relay SMTP kaydı ve gerçek gizlilik beyanı henüz hazırlanmış credential değildir.
5. İmzalı build üretimi, IPA yükleme, iç TestFlight dağıtımı ve ileride dış test/App Review **ayrı onay** ister. Bu çalışmada hiçbiri yapılmadı. Main merge yok, Android Alpha/testçiler/signing değişmedi.

İlk sonraki somut adım [yerel development build planı](DEVELOPMENT-BUILD-PLAN.md); mevcut Development identity ve yeni Bundle ID ile Keychain/gerçek iPhone kabulünü mümkün kılar. Henüz yürütülmedi, ayrı onay gerekir. Store IPA kapısı bununla açılmaz.
