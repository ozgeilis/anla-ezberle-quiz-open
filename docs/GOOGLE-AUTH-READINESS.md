# Google girişi ve 8 karakter parola — kapalı test adayı

**28.10.2026: Kullanıcının açık onayıyla kapalı test backend’i kuruldu.** Main, Vercel Production, genel push ve soru bankası değişmedi. Gerçek web Google girişi, oturumun yeniden yüklemede korunması, çıkış, geri dönerek iptal, tekrar giriş ve e-posta koduyla Google hesabı silme kabulü geçti. Fiziksel Android/iPhone testleri bekliyor. Google üzerinden yeni Auth hesabı kaydı sunucuda kapalıdır.

## Onaylı kapalı test — gerçekleşen durum

| Kontrol                 | Sonuç ve kanıt                                                                                                                                                                                                                                                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PR #13 kod kontrolleri  | Önceki `2afa335` kontrolleri ve Preview başarılı; son kapalı test düzeltmeleri aynı PR’da incelenir. Güncel CI sonucu PR kontrol listesinden izlenmelidir.                                                                                                                                                                                                                                                |
| Migration               | `20261027000200`, SHA-256 `d1966ee733ef3855c423661136b99f3260177d64044b3685e5adf1ebd29de8e5`, yalnız Frankfurt’a uygulandı ve migration geçmişine kaydedildi. İki yeni private tabloda forced RLS doğrulandı.                                                                                                                                                                                             |
| Auth hook               | Dashboard’da `public.before_google_user_created` etkin. Anon/authenticated çağrı yetkisi yok; Auth admin yetkili. Salt okunur SQL denemesinde yeni Google kaydı 403, eski e-posta yolu değişmeden `{}` döndü. Silinen test hesabıyla gerçek Google yeniden giriş denemesinde yeni Auth hesabı oluşmadığı ayrıca doğrulandı; uygulama oturum açmadı.                                                       |
| Google Cloud            | Marka `Anla & Ezberle`, onaylı iş destek adresi; OAuth Web client yalnız Supabase broker callback’i. External / Testing, tek onaylı test kimliği. İş hesabına yalnız OAuth Config Editor verildi; ek genel okuma/yönetici rolü verilmedi.                                                                                                                                                                 |
| Google provider         | Kullanıcı client secret’ını doğrudan Dashboard’a girdi; etkin durum yeniden okunarak doğrulandı. Secret Git’e/istemciye alınmadı. Nonce atlama ve e-postasız giriş kapalı.                                                                                                                                                                                                                                |
| Callback’ler            | Önceki beş izin korundu; yalnız native Google query callback’i, yerel 8165 ve bu PR’ın tam Preview branch adresi eklendi. Genel Vercel wildcard’ı yok; Site URL değişmedi.                                                                                                                                                                                                                                |
| Kapalı test bayrakları  | `googleOAuthEnabled=true`, `googleDeletionEnabled=true`, **`googleSignupEnabled=false`**. Sunucu `GOOGLE_ACCOUNT_DELETION_ENABLED=true`; yeni Google kayıtları açık değildir.                                                                                                                                                                                                                             |
| Canlı parola politikası | Minimum 12→8. Diğer sınıflar, e-posta doğrulama, güvenli değişim ayarları ve limitler korunur. Yeni geçici hesapta 7 ret, 8 ile güncelleme/giriş, 24 karakterle giriş ve gerçek recovery tokenı üzerinden 8 karaktere sıfırlama geçti. Gerçek sıfırlama postası teslimi test edilmedi.                                                                                                                    |
| Hesap silme regresyonu  | Önceki çalışan fonksiyonun kaynak yedeği alındı; sürüm 6 dağıtıldı. Yeni geçici parola hesabı gerçek Edge akışıyla silindi; tekrar giriş, eski JWT/refresh ve tekrarlı istek reddedildi. Yanlış parola ve istemciden actor değiştirme reddedildi.                                                                                                                                                         |
| Diğer kullanıcılar      | Silme testinin öncesi/sonrası sunucuda hesaplanan özetler: diğer Auth hesapları, profiller, arkadaşlıklar, maçlar, bildirimler ve skor defteri değişmedi. Ham kullanıcı satırları dışarı aktarılmadı.                                                                                                                                                                                                     |
| E-posta şablonu         | Tek kullanımlık kod eklendi; mevcut `ConfirmationURL` giriş seçeneği korundu. Kullanıcı gerçek e-postadaki kodu yalnız uygulamaya girerek silmeyi tamamladı; gerçek OTP teslimi **PASS**.                                                                                                                                                                                                                 |
| Google gerçek kabulü    | Gerçek Google izin ekranı → Supabase PKCE → uygulama oturumu başarılı. Önceden hazırlanan aynı UID’ye Google identity bağlandı; ikinci hesap oluşmadı, uygulama şifresi gerekmedi. Yeniden yükleme, çıkış, geri dönerek iptal ve tekrar giriş geçti. İkinci onay + e-posta kodu + SİL ile kullanıcı son silmeyi yaptı; Auth Admin ve silme doğrulama RPC’si hesabın/ilişkili verinin yokluğunu doğruladı. |
| Fiziksel cihazlar       | Android/iPhone gerçek OAuth kabulü **DOĞRULANAMADI**. Mevcut iPhone build’inde WebBrowser modülü olmadığı için aynı kimlik/imzayla yeni native build gerekir; uygulama silinmedi.                                                                                                                                                                                                                         |

Onaylı iki geçici Supabase test hesabı da test sonunda silindi; yeni test hesabı kalmadı. İş Google hesabının kendisi korunur. Özel test kimlikleri, parolalar, oturumlar ve ham denetim çıktıları Git dışında erişimi kısıtlı klasörde tutulur.

Preview: https://anla-ezberle-quiz-git-feat-google-auth-pas-fcc27e-ozgeilis-6528.vercel.app/online

Yerel gerçek Auth kabulü: `http://127.0.0.1:8165/online`. Bu kaynak mevcut Edge CORS listesinde zaten izinliydi; Preview için hesap silme CORS sınırı genişletilmedi.

## Hazırlanan akış

- E-posta/şifre giriş, kayıt, doğrulama ve sıfırlama korunur. Merkezi parola kuralı 8–128; küçük/büyük Latin harf, rakam ve simge şartları korunur. Eski uzun şifreler geçerlidir. Mevcut hata metinleri 8 karakter kuralını kullanır.
- `expo-web-browser ~58.0.7`: Android/iOS sistem tarayıcısı; web aynı sekmeden yönlenir. Scheme, package/bundle ID, imza, ikon ve mevcut oturum deposu değişmez.
- Google için SDK’nin PKCE S256 işlemi, tek kullanımlık doğrulayıcı ve beş dakikalık yerel nonce vardır. Callback protokol/host/path, `flow`, nonce ve tek `code` ile doğrulanır; implicit Google tokenları ve yabancı hedefler reddedilir. URL adres çubuğundan hemen temizlenir; sağlayıcının ham hataları, tokenları ve kodları UI/loglara yazılmaz.
- Ana `OnlineProvider` tek kalıcı uygulama oturumunun sahibidir. Google PKCE transportu yalnız doğrulayıcıyı güvenli depoya yazar; kendi JWT/session verisini sadece bellekte tutar. Sunucudan `getUser` ile doğrulanmış, Google kimliği ve aynı UID eşleşmesi olan oturum mevcut istemciye aktarılır. Aktif hesap giriş sırasında değişirse aktarım reddedilir. Başarısız transport oturumu kapatılır. Eski e-posta callback davranışı değiştirilmez.
- Google için uygulama şifresi istenmez. Aynı doğrulanmış e-postadaki kimlik eşleşmesini Supabase yönetir; istemci e-posta eşitliğine göre profil/kayıt birleştirmez. Elle kimlik bağlama açılmaz. Gerçek aynı UID testi tamamlanana kadar bu davranış PASS sayılmaz.
- Google ile giriş, mevcut çevrimiçi servis izin listesine/oda yetkilerine ayrıcalık vermez. Sunucu erişim kontrolleri korunur. Hesap değişimi ve çıkışta Google giriş taslağı temizlenir.

## 27.10.2026 başlangıç gözlemi — değişikliklerden önce

Frankfurt `mqyuihiobkomjfipxehj` Dashboard ve public Auth settings üzerinden:

| Ayar                               | Gözlenen durum                                     |
| ---------------------------------- | -------------------------------------------------- |
| Google provider                    | Kapalı                                             |
| Uygulama kayıt yeteneği RPC        | `registrationEnabled=true` (salt okunur)           |
| Hesap silme yeteneği RPC           | `accountDeletionEnabled=true` (salt okunur)        |
| Auth yeni kayıt izni               | Açık (`disable_signup=false`)                      |
| E-posta doğrulama                  | Açık                                               |
| Minimum parola                     | **12** (henüz canlıda 8 değil)                     |
| Parola sınıfları                   | Küçük/büyük harf, rakam, simge                     |
| Güvenli e-posta/şifre değişimi     | Açık                                               |
| Elle kimlik bağlama / anonim giriş | Kapalı                                             |
| E-posta OTP                        | **8 hane / 3600 saniye**                           |
| Sızmış parola koruması             | Mevcut Free planda kapalı; bu çalışma değiştirmedi |
| Google Cloud `anla-ezberle-push`   | “Google Auth Platform not configured yet”          |

Bu tablo 27.10 başlangıç durumunu gösterir. 28.10 onaylı işlemde canlı minimum yalnız 8 olarak değiştirildi; uygulama kodu henüz PR dalındadır, main/Production yayımlanmadı. Diğer Auth güvenlik ayarlarına dokunulmadı.

## Google kullanıcılarında güvenli hesap silme

Mevcut JWT → yeniden doğrulama → Storage/kişisel veri hazırlığı → desteklenen Auth Admin delete → silme doğrulaması zinciri korunur. E-posta/şifre hesabının parola doğrulaması değişmez.

Google kimliği bulunan hesapta ikinci onay ekranı sunucudan **8 haneli e-posta kodu** ister. E-posta ve UID yalnız doğrulanmış JWT’nin Auth kullanıcısından alınır. `signInWithOtp(shouldCreateUser:false)` kullanılır; kod istemek yeni hesap oluşturamaz. Servis rolüne özel challenge beş dakika geçerli, UID’ye bağlı ve tek denemelidir; gönderim aralığı en az 60 saniyedir. Kod, Auth tarafından doğrulanır ve dönen UID yine JWT kullanıcısıyla eşleşmelidir. `SİL` ve son onay korunur. Başarısız/yarım işlem başarı göstermez. Kod denemesi tüketilince yeni kod gerekir.

Passwordless girişin eklediği `email` identity, kullanıcının uygulama şifresi bulunduğunun kanıtı sayılmaz. Google kimliği varsa kod yolu sunulur; kullanıcı isterse mevcut şifresini kullanan eski doğrulama yolunu ayrıca seçebilir. Google kimliği olmayan e-posta/şifre hesaplarının akışı aynı kalır.

Bu, Google şifresini istemek yerine doğrulanmış hesaba ait e-posta sahipliğini yeniden doğrulayan passwordless akıştır. **28.10: Gerçek posta teslimi ve Google bağlantılı geçici hesabın uçtan uca silinmesi web üzerinde geçti.** Google hesabının kendisi silinmedi. Fiziksel cihaz kabulü ve ayrı genel yayın onayı olmadığı için Google ile yeni hesap kaydı kapalı kalır.

Yeni yol ancak sunucuda `GOOGLE_ACCOUNT_DELETION_ENABLED=true` ve `quiz_private` config `deletion_enabled=true` ise açılır. Mevcut canlı parola yolu bu bayraktan bağımsızdır.

## Kontrollü dağıtım planı

Aşağıdaki planın kapalı test kapsamı onaylandı. Gerçekleşen adımlar ve kalan kabul engelleri yukarıdaki tabloda ayrılmıştır; bu liste körlemesine yeniden uygulanmamalıdır.

1. Mevcut Auth ayarları, redirect listesi, hook ve magic-link şablonunun güvenli yedeği alınır. Başka mevcut hook varsa **üzerine yazılmaz**; politikalar birleştirilip yeniden test edilir.
2. Google Cloud’da mevcut proje içinde yalnız OAuth Web client hazırlanır. Supabase broker’ı kullanan sistem tarayıcısı akışında Android/iOS için ayrı native Google SDK veya SHA-1 client gerekmez. Consent Audience **External / Testing**, kapsam yalnız `openid`, `email`, `profile`. Uygulama adı Anla & Ezberle, destek/mahremiyet adresi kullanıcı tarafından onaylanan `kovynelstudio@gmail.com`. Destek adresinin Cloud’da seçilebilir sahipliği doğrulanmalı; kişisel adres sessizce yayımlanmamalı. FCM servis hesabı, rolü ve anahtarı bu iş için kullanılmaz. Client secret sadece Supabase Google provider’da tutulur, istemci/Vercel public env/Git’e konulmaz. Credential oluşturmanın son UI adımı kullanıcıya bırakılır.
3. Yeni migration `20261027000200_google_auth_closed_candidate.sql` uygulanır; bayraklar **false** kalır. Auth Before User Created hook’u `public.before_google_user_created` olarak kaydedilir. Yalnız `supabase_auth_admin` çağırabilir; istemci taklit edemez. Google `signup_enabled=false` kalır; hook Google üzerinden bütün yeni Auth kayıtlarını reddeder. Kapalı test yalnız açıkça onaylı, önceden oluşturulan geçici Auth hesaplarıyla yürür. Ek e-posta/hash izin tablosu tutulmaz. Mevcut e-posta kayıt politikası değişmez. Gerçek test e-postaları/secretlar SQL veya Git’e yazılmaz.
4. Supabase magic-link e-posta şablonuna `{{ .Token }}` eklenir (aday `google-reauth-otp.candidate.html`). Bu şablon değişimi paylaşılan passwordless e-posta akışına etki eder; mevcut link davranışı gerekiyorsa korunarak birleştirilir. Mevcut 8 hane, Auth OTP süresi ve hız limitleri azaltılmaz. Sunucu challenge’ı silme kanıtını ayrıca beş dakikaya sınırlar.
5. `account-delete` yeni Google OTP yolu ile dağıtılır; önce bayrak kapalı, mevcut parola hesabı regresyonu sentetik hesapla doğrulanır. Daha sonra yalnız izinli test hesapları için Google config/deletion hazırlığı açılır; `signup_enabled` kapalı kalır. Genel Google kullanıcı kaydı hook tarafından kapalı kalır; genel push, soru bankası ve çevrimiçi izinler değişmez.
6. Aynı pencerede parola minimumu **yalnız 12→8** yapılır. Diğer parola sınıfları, MFA, leaked-password mevcut durumu, hız sınırları ve kayıt izinleri değiştirilmez. 7 ret, geçerli 8 kabul, 12+ mevcut giriş/sıfırlama kontrollü hesaplarla doğrulanır. Minimumu yükselterek geri dönüş yeni 8 haneli hesapların sonraki parola güncellemesini etkiler; hesaplar silinmez.
7. Onaylı Google test kimliği Google Audience ve kullanıcıya ait test kimliğiyle eşleşen yeni geçici Supabase Auth hesabı önceden oluşturulur. Mevcut parola hesabıyla aynı doğrulanmış e-posta testinde **UID ve mevcut profil/oyun kayıtlarının korunması** doğrulanır. Ayrı test kimliğinde yeni hesap, iptal, hata, yeniden açılış, çıkış ve hesap izolasyonu test edilir. En fazla iki açıkça onaylı geçici hesap; gerçek kullanıcı hesabı test için silinmez.
8. Google-only geçici hesapta yanlış/eski kod, yabancı challenge, tekrar deneme ve gerçek silme testleri yapılır. Diğer oyuncu kayıtlarının değişmediği yalnız sentetik/özet kanıtla doğrulanır. Test sonucuna kadar genel erişim açılmaz.
9. Android preview ve aynı iOS kimliği/imzasıyla development build üzerine güncelleme gerekir. Mevcut iPhone test build’inin Podfile.lock’unda ExpoWebBrowser **yok**. Eski build’de Google kapalı kalır/eksik modül mesajı verir; mevcut uygulama kaldırılmaz. Expo Go testi fiziksel native kabul sayılmaz.
10. Yalnız son kabul ve **ayrı main/Production onayı** ile yayın. Google genel kayıt açılması ayrıca karar gerektirir.

### Yönlendirmeler

- Google Web client authorized redirect URI: `https://mqyuihiobkomjfipxehj.supabase.co/auth/v1/callback`
- Supabase redirect izinleri: `anla-ezberle-quiz://online/auth?**`, **yalnız doğrulanmış Preview origin** `/online/auth?**`, `http://127.0.0.1:8165/online/auth?**` (kontrollü yerel test). Üretim `https://anla-ezberle-quiz.vercel.app/online/auth?**` ancak yayın onayıyla.
- Canlı `account-delete` CORS listesi Preview origin’lerini kabul etmez. Bu güvenlik sınırı bu PR’da genişletilmedi. Gerçek silme deneyi mevcut izinli yerel `http://127.0.0.1:8165` veya native istemcide yürütülür; Preview’deki silme arayüzü sentetik HTTP ile incelenir. Üretim origin’i zaten izinlidir. Preview üzerinden gerçek silme ayrıca istenirse yalnız o tam origin için ayrı onay ve dar sunucu değişikliği gerekir.
- Uygulama başlangıçta `flow=google&attempt=<rastgele-nonce>` ekler. Tam Google callback’i yalnız mevcut origin/scheme ile kabul eder. Keyfî Vercel alt alanı wildcard’ı eklenmez. EAS Update/Production kanalına yayın yok.

### Geri dönüş

Önce `oauth_enabled=false`: istemci yeni Google girişini sunmaz. Yeni kayıt hook’u kapalı kalır. Provider açılmışsa yeni Google girişlerini durdurmak için provider kapatılabilir; ancak **mevcut Google-only kullanıcıların hesap silme erişimi açık tutulur**. Onaylı test hesapları varken deletion yolu rastgele kapatılmaz. Mevcut kullanıcı verileri ve ek tablolar silinmez; eski Auth/e-posta şablonu ve fonksiyon artifact’i güvenli yedekten döndürülebilir. Auth/parola ayarları ayrıca değerlendirilir. Main’e rollback/force-push yok.

## Test kanıtı ve sınırlar

- `pnpm check`: TypeScript, lint, soru bütünlüğü, **332/332 test** başarılı.
- İzole Postgres 17 konteyneri, ağ/port/volume yok: `supabase/tests/google_auth.sql` başarılı. Kapalı varsayılan, rol izinleri, Google yeni kayıt kapısı, diğer e-posta politikası, UID ayrımı, cooldown, replay, expiry ve Auth FK cascade denetlendi. Bu test hosted Auth hook kaydının yapıldığı anlamına gelmez.
- Gerçek Chromium, sentetik HTTP: **13 Google/parola grubu**; 320/360/390 açık/koyu, 7/8/12 sınırları, eski recovery callback’i, PKCE S256, nonce, yabancı UID, iptal ve tarayıcıdan geri dönülen Google denemesinden sonra eski e-posta recovery akışı. **Mock provider gerçek Google başarısı değildir.**
- Mevcut ayarlar/hesap tarayıcı regresyonu: **29 grup** başarılı. Gerçek e-posta veya canlı kullanıcı mutasyonu yok.
- Web export başarılı. Android ve iOS Hermes bytecode export başarılı; JS export imzalı native build değildir.
- Gerçek Google Cloud Web client, Google login/same-email aynı UID, posta teslimi, şifresiz Google bağlantılı hesap silme: **web PASS**. İlk izin ekranında bekleme süre aşımına uğradı (`bad_oauth_state`); yeni kısa deneme geçti. Fiziksel Android/iPhone callback: **DOĞRULANAMADI / yeni build ve cihaz kabulü bekliyor**.
- Gerçek silme sonrası eski Google girişine dönüldüğünde yeni hesap oluşmadı. Sağlayıcı hata dönüşü nonce sınırında güvenli reddedildi; ham hata/kod/token gösterilmedi. Google hata ekranı e-posta doğrulama veya şifre sıfırlamaya yönlendirmez, doğrudan giriş ekranına döner. Web giriş ekranına geri dönüşte (bfcache dahil) ve açık e-posta giriş/posta isteğinde terk edilen Google nonce/verifier temizlenir; aktif Google callback’inin PKCE sınırı korunur.
- Kod gönderimi, silme ve yerel temizlik ayrı bekleme durumlarıdır. Kod gönderilirken silme işlemi başlamış gibi metin gösterilmez; gerçek tarayıcı testinde yanıt bekletilerek doğrulanır.
- Google consent ekranı testte Supabase proje alan adını gösterdi. Genel yayın öncesinde marka/domain bağlantıları ve gerekiyorsa Google marka doğrulaması tamamlanmalıdır; ücretli custom-domain veya Production değişikliği yapılmadı.

## Kaynaklar

[Supabase Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [kimlik bağlama](https://supabase.com/docs/guides/auth/auth-identity-linking), [native deep link](https://supabase.com/docs/guides/auth/native-mobile-deep-linking), [Before User Created](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook), [passwordless e-posta](https://supabase.com/docs/guides/auth/auth-email-passwordless), [Expo Authentication](https://docs.expo.dev/guides/authentication/), [Expo WebBrowser](https://docs.expo.dev/versions/latest/sdk/webbrowser/).

SDK sürüm kontrolü: Yeni WebBrowser paketi Expo’nun önerdiği 58.0.7 sürümünde. Mevcut Expo 58.0.19 / dev-client 58.0.15 / router 58.0.26 için sırasıyla .20 / .16 / .27 yama önerisi görüldü; kapsam dışı toplu native yükseltme yapılmadı. Mevcut pnpm sürüm yaş politikası küresel olarak değiştirilmedi; kurucunun eklediği istisna yalnız resmî `expo-web-browser@58.0.7` sürümüne bağlıdır.

CI düzeltmesi: Yeni tablolar mevcut `quiz_private` şemasına eklenir; ayrı `private` şeması varsayımı kaldırıldı. GitHub’ın temiz Supabase kurulumunda tüm migration zinciri, `supabase_admin` ile rollback-only Google SQL testi ve `account-delete/index.ts` Deno tip kontrolü çalıştırılır.

Kapalı test ve veri azaltma: Google yeni kayıt kapısı, mevcut `public_enrollment_enabled` ayarına ek ayrı bir `signup_enabled=false` koşuludur. Kod Google yeni kaydını ancak iki kayıt izni ile OAuth/silme hazırlığı birlikte açıkken kabul edebilir; bu onay kapalı testte verilmedi. Mevcut doğrulanmış Auth hesabına Google kimliği bağlanması Supabase tarafından yönetilir. Yeni private tablolar yalnız bayraklar ve Auth kullanıcı FK’sine bağlı, süreli silme challenge’ları tutar; zorunlu/forced RLS açıktır. Auth admin yalnız ayar bayraklarını okuyabilir. E-posta/hash tablosu tutulmadığından hesap silme sonrasında ayrı bir kimlik kalıntısı oluşmaz.
