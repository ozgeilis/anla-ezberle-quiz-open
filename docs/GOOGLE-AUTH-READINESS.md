# Google girişi ve 8 karakter parola — kapalı test adayı

**27.10.2026: Kod ve yerel kontroller hazır; gerçek Google OAuth, Android/iPhone kabulü ve canlı etkinleştirme tamamlanmadı.** Bu dal main, Vercel Production, Supabase Auth/provider ayarları ve canlı `account-delete` fonksiyonunu değiştirmedi. Google, migration uygulanmadığında veya iki hazırlık bayrağından biri kapalıysa istemcide kapalı kalır.

## Hazırlanan akış

- E-posta/şifre giriş, kayıt, doğrulama ve sıfırlama korunur. Merkezi parola kuralı 8–128; küçük/büyük Latin harf, rakam ve simge şartları korunur. Eski uzun şifreler geçerlidir. Mevcut hata metinleri 8 karakter kuralını kullanır.
- `expo-web-browser ~58.0.7`: Android/iOS sistem tarayıcısı; web aynı sekmeden yönlenir. Scheme, package/bundle ID, imza, ikon ve mevcut oturum deposu değişmez.
- Google için SDK’nin PKCE S256 işlemi, tek kullanımlık doğrulayıcı ve beş dakikalık yerel nonce vardır. Callback protokol/host/path, `flow`, nonce ve tek `code` ile doğrulanır; implicit Google tokenları ve yabancı hedefler reddedilir. URL adres çubuğundan hemen temizlenir; sağlayıcının ham hataları, tokenları ve kodları UI/loglara yazılmaz.
- Ana `OnlineProvider` tek kalıcı uygulama oturumunun sahibidir. Google PKCE transportu yalnız doğrulayıcıyı güvenli depoya yazar; kendi JWT/session verisini sadece bellekte tutar. Sunucudan `getUser` ile doğrulanmış, Google kimliği ve aynı UID eşleşmesi olan oturum mevcut istemciye aktarılır. Aktif hesap giriş sırasında değişirse aktarım reddedilir. Başarısız transport oturumu kapatılır. Eski e-posta callback davranışı değiştirilmez.
- Google için uygulama şifresi istenmez. Aynı doğrulanmış e-postadaki kimlik eşleşmesini Supabase yönetir; istemci e-posta eşitliğine göre profil/kayıt birleştirmez. Elle kimlik bağlama açılmaz. Gerçek aynı UID testi tamamlanana kadar bu davranış PASS sayılmaz.
- Google ile giriş, mevcut çevrimiçi servis izin listesine/oda yetkilerine ayrıcalık vermez. Sunucu erişim kontrolleri korunur. Hesap değişimi ve çıkışta Google giriş taslağı temizlenir.

## Salt okunur canlı gözlem

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

`config.toml` ve `config.remote.toml` içindeki 8 değeri **aday yapılandırmadır**, canlıya uygulandığı anlamına gelmez. Diğer Auth güvenlik ayarlarına dokunulmadı.

## Google kullanıcılarında güvenli hesap silme

Mevcut JWT → yeniden doğrulama → Storage/kişisel veri hazırlığı → desteklenen Auth Admin delete → silme doğrulaması zinciri korunur. E-posta/şifre hesabının parola doğrulaması değişmez.

Google kimliği bulunan hesapta ikinci onay ekranı sunucudan **8 haneli e-posta kodu** ister. E-posta ve UID yalnız doğrulanmış JWT’nin Auth kullanıcısından alınır. `signInWithOtp(shouldCreateUser:false)` kullanılır; kod istemek yeni hesap oluşturamaz. Servis rolüne özel challenge beş dakika geçerli, UID’ye bağlı ve tek denemelidir; gönderim aralığı en az 60 saniyedir. Kod, Auth tarafından doğrulanır ve dönen UID yine JWT kullanıcısıyla eşleşmelidir. `SİL` ve son onay korunur. Başarısız/yarım işlem başarı göstermez. Kod denemesi tüketilince yeni kod gerekir.

Passwordless girişin eklediği `email` identity, kullanıcının uygulama şifresi bulunduğunun kanıtı sayılmaz. Google kimliği varsa kod yolu sunulur; kullanıcı isterse mevcut şifresini kullanan eski doğrulama yolunu ayrıca seçebilir. Google kimliği olmayan e-posta/şifre hesaplarının akışı aynı kalır.

Bu, Google şifresini istemek yerine doğrulanmış hesaba ait e-posta sahipliğini yeniden doğrulayan passwordless akıştır. **Gerçek posta teslimi ve Google hesabının uçtan uca silinmesi henüz test edilmedi.** Bu nedenle Google ile yeni hesap kaydı genel kullanıma açılamaz.

Yeni yol ancak sunucuda `GOOGLE_ACCOUNT_DELETION_ENABLED=true` ve private config `deletion_enabled=true` ise açılır. Mevcut canlı parola yolu bu bayraktan bağımsızdır.

## Açılmadan önce uygulanması gereken, onay bekleyen plan

1. Mevcut Auth ayarları, redirect listesi, hook ve magic-link şablonunun güvenli yedeği alınır. Başka mevcut hook varsa **üzerine yazılmaz**; politikalar birleştirilip yeniden test edilir.
2. Google Cloud’da mevcut proje içinde yalnız OAuth Web client hazırlanır. Supabase broker’ı kullanan sistem tarayıcısı akışında Android/iOS için ayrı native Google SDK veya SHA-1 client gerekmez. Consent Audience **External / Testing**, kapsam yalnız `openid`, `email`, `profile`. Uygulama adı Anla & Ezberle, destek/mahremiyet adresi kullanıcı tarafından onaylanan `kovynelstudio@gmail.com`. Destek adresinin Cloud’da seçilebilir sahipliği doğrulanmalı; kişisel adres sessizce yayımlanmamalı. FCM servis hesabı, rolü ve anahtarı bu iş için kullanılmaz. Client secret sadece Supabase Google provider’da tutulur, istemci/Vercel public env/Git’e konulmaz. Credential oluşturmanın son UI adımı kullanıcıya bırakılır.
3. Yeni migration `20261027000200_google_auth_closed_candidate.sql` uygulanır; bayraklar **false** kalır. Auth Before User Created hook’u `public.before_google_user_created` olarak kaydedilir. Yalnız `supabase_auth_admin` çağırabilir; istemci taklit edemez. Google’a özel süreli e-posta SHA-256 izin listesi **boştur**; yeni Google hesabını hook reddeder. Mevcut e-posta kayıt politikası değişmez. Gerçek test e-postaları/secretlar SQL veya Git’e yazılmaz.
4. Supabase magic-link e-posta şablonuna `{{ .Token }}` eklenir (aday `google-reauth-otp.candidate.html`). Bu şablon değişimi paylaşılan passwordless e-posta akışına etki eder; mevcut link davranışı gerekiyorsa korunarak birleştirilir. Mevcut 8 hane, Auth OTP süresi ve hız limitleri azaltılmaz. Sunucu challenge’ı silme kanıtını ayrıca beş dakikaya sınırlar.
5. `account-delete` yeni Google OTP yolu ile dağıtılır; önce bayrak kapalı, mevcut parola hesabı regresyonu sentetik hesapla doğrulanır. Daha sonra yalnız izinli test hesapları için Google config/deletion hazırlığı açılır. Genel Google kullanıcı kaydı hook tarafından kapalı kalır; genel push, soru bankası ve çevrimiçi izinler değişmez.
6. Aynı pencerede parola minimumu **yalnız 12→8** yapılır. Diğer parola sınıfları, MFA, leaked-password mevcut durumu, hız sınırları ve kayıt izinleri değiştirilmez. 7 ret, geçerli 8 kabul, 12+ mevcut giriş/sıfırlama kontrollü hesaplarla doğrulanır. Minimumu yükselterek geri dönüş yeni 8 haneli hesapların sonraki parola güncellemesini etkiler; hesaplar silinmez.
7. Onaylı Google test kimliği Google Audience ve hash izin listesine süreli eklenir. Mevcut parola hesabıyla aynı doğrulanmış e-posta testinde **UID ve mevcut profil/oyun kayıtlarının korunması** doğrulanır. Ayrı test kimliğinde yeni hesap, iptal, hata, yeniden açılış, çıkış ve hesap izolasyonu test edilir. En fazla iki açıkça onaylı geçici hesap; gerçek kullanıcı hesabı test için silinmez.
8. Google-only geçici hesapta yanlış/eski kod, yabancı challenge, tekrar deneme ve gerçek silme testleri yapılır. Diğer oyuncu kayıtlarının değişmediği yalnız sentetik/özet kanıtla doğrulanır. Test sonucuna kadar genel erişim açılmaz.
9. Android preview ve aynı iOS kimliği/imzasıyla development build üzerine güncelleme gerekir. Mevcut iPhone test build’inin Podfile.lock’unda ExpoWebBrowser **yok**. Eski build’de Google kapalı kalır/eksik modül mesajı verir; mevcut uygulama kaldırılmaz. Expo Go testi fiziksel native kabul sayılmaz.
10. Yalnız son kabul ve **ayrı main/Production onayı** ile yayın. Google genel kayıt açılması ayrıca karar gerektirir.

### Yönlendirmeler

- Google Web client authorized redirect URI: `https://mqyuihiobkomjfipxehj.supabase.co/auth/v1/callback`
- Supabase redirect izinleri: `anla-ezberle-quiz://online/auth?**`, **yalnız doğrulanmış Preview origin** `/online/auth?**`, `http://127.0.0.1:8189/online/auth?**` (kontrollü yerel test). Üretim `https://anla-ezberle-quiz.vercel.app/online/auth?**` ancak yayın onayıyla.
- Uygulama başlangıçta `flow=google&attempt=<rastgele-nonce>` ekler. Tam Google callback’i yalnız mevcut origin/scheme ile kabul eder. Keyfî Vercel alt alanı wildcard’ı eklenmez. EAS Update/Production kanalına yayın yok.

### Geri dönüş

Önce `oauth_enabled=false`: istemci yeni Google girişini sunmaz. Yeni kayıt hook’u kapalı kalır. Provider açılmışsa yeni Google girişlerini durdurmak için provider kapatılabilir; ancak **mevcut Google-only kullanıcıların hesap silme erişimi açık tutulur**. Onaylı test hesapları varken deletion yolu rastgele kapatılmaz. Mevcut kullanıcı verileri ve ek tablolar silinmez; eski Auth/e-posta şablonu ve fonksiyon artifact’i güvenli yedekten döndürülebilir. Auth/parola ayarları ayrıca değerlendirilir. Main’e rollback/force-push yok.

## Test kanıtı ve sınırlar

- `pnpm check`: TypeScript, lint, soru bütünlüğü, **332/332 test** başarılı.
- İzole Postgres 17 konteyneri, ağ/port/volume yok: `supabase/tests/google_auth.sql` başarılı. Kapalı varsayılan, rol izinleri, hash/süreli izin listesi, diğer e-posta politikası, UID ayrımı, cooldown, replay, expiry ve Auth FK cascade denetlendi. Bu test hosted Auth hook kaydının yapıldığı anlamına gelmez.
- Gerçek Chromium, sentetik HTTP: **12 Google/parola grubu**; 320/360/390 açık/koyu, 7/8/12 sınırları, eski recovery callback’i, PKCE S256, nonce, yabancı UID ve iptal. **Mock provider gerçek Google başarısı değildir.**
- Mevcut ayarlar/hesap tarayıcı regresyonu: **29 grup** başarılı. Gerçek e-posta veya canlı kullanıcı mutasyonu yok.
- Web export başarılı. Android ve iOS Hermes bytecode export başarılı; JS export imzalı native build değildir.
- Gerçek Google Cloud OAuth client, gerçek Google login/same-email linking, posta teslimi, Google-only hesap silme, fiziksel Android/iPhone callback: **DOĞRULANAMADI / onaylı yapılandırma ve cihaz testi bekliyor**.

## Kaynaklar

[Supabase Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [kimlik bağlama](https://supabase.com/docs/guides/auth/auth-identity-linking), [native deep link](https://supabase.com/docs/guides/auth/native-mobile-deep-linking), [Before User Created](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook), [passwordless e-posta](https://supabase.com/docs/guides/auth/auth-email-passwordless), [Expo Authentication](https://docs.expo.dev/guides/authentication/), [Expo WebBrowser](https://docs.expo.dev/versions/latest/sdk/webbrowser/).

SDK sürüm kontrolü: Yeni WebBrowser paketi Expo’nun önerdiği 58.0.7 sürümünde. Mevcut Expo 58.0.19 / dev-client 58.0.15 / router 58.0.26 için sırasıyla .20 / .16 / .27 yama önerisi görüldü; kapsam dışı toplu native yükseltme yapılmadı. Mevcut pnpm sürüm yaş politikası küresel olarak değiştirilmedi; kurucunun eklediği istisna yalnız resmî `expo-web-browser@58.0.7` sürümüne bağlıdır.
