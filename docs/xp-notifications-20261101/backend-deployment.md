# Onaylı sınırlı backend dağıtımı — 1 Kasım 2026

Kullanıcının bu sohbet içindeki açık onayıyla yalnız Frankfurt
`mqyuihiobkomjfipxehj` değiştirildi. Kaynak MD5 önkoşulları ve üç SQL SHA-256
onaylanan değerlerle birebir eşleşti. Edge kaynak karşılaştırmasında yalnız
protokol alanları, `expire` ve doğruluk açıklaması yorumları değişiyordu.

| İşlem | Canlı kayıt | Sonuç |
|---|---|---|
| online-duel | sürüm 17; paket SHA `91734d4e6786a5a8ca8d50a4323e055256fc8f539a50a40455f8a2e5b53e8d42` | ACTIVE; mevcut getUser doğrulaması ve CORS korundu |
| twenty_second_questions | `20261101074832` | Yeni live/async default 20; eski maçlar NULL, eski odalar aynı |
| google_signup_test_allowlist | `20261101074841` | Önce boş oluşturuldu; RLS/FORCE RLS, client SELECT yok; hook korunuyor |
| progressive_player_levels | `20261101074850` | social_player yalnız seviye ifadesi değişti; sahiplik/ACL aynı |

MCP migration geçmişine sunucu uygulama zamanını kaydetti; depodaki orijinal
migration dosyaları yeniden adlandırılmadı veya değiştirilmedi. Onaylı dosya
SHA değerleri ilgili `migration-sha256.txt` kayıtlarındadır.

## Doğrulananlar

- 100 seviye başlangıcı ve bir önceki XP sınırı canlı SQL ile geçti;
  0/99→1, 100→2, 210→3, 330→4, 58.410→100; üstü 100.
- Mevcut 10 oda: biri 10, dokuzu 15 saniye; değerler ve tüm oda satırlarının
  MD5 özeti aynı. Eski asenkron maçların yeni süre alanı NULL kaldı.
- Profil, skor ledger ve kazanılmış rozet satırlarının dağıtım öncesi/sonrası
  toplu MD5 özetleri aynı. Kullanıcı satırları dışa aktarılmadı.
- İlgili fonksiyonların postgres sahipliği, boş search_path ve execute ACL
  değerleri korundu. Live komut kaynağı aynı kaldı; mevcut per-room süre kullanılır.
- Google OAuth/deletion true, **global Google signup false**; mevcut registration
  ve hesap silme capability değerleri değişmedi. Yalnız açıkça onaylanan iş
  hesabı için 8 Kasım 2026 07:49:51 UTC'ye kadar özel test izni eklendi.
  İzin eklenmeden önce bu e-postayla mevcut Auth hesabı olmadığı doğrulandı.
- Güvenlik advisor bulgu adları/sayıları aynı: özel deny-all RLS tabloları,
  eski leaderboard search_path/capability SECURITY DEFINER ve sızdırılmış parola
  koruması uyarıları bu değişiklikte giderilmiş gibi gösterilmedi.

Ham şema/özet/fonksiyon kanıtı `backend-deployment-evidence.json` dosyasında.
Bu kanıt gerçek OAuth veya gerçek Android teslim testi yerine geçmez.

## Hâlâ bekleyen

Webde gerçek yetkili Google kaydı/girişi ve yenileme sonrası kalıcılık geçti. Hosted e-posta/native Google callback kabulü bekliyor; en fazla
iki yeni geçici uygulama hesabı sınırı. Yeni Android kabul APK'sı ve fiziksel
Samsung testi; sonra ayrıca onaylanacak farklı versionCode'lu Alpha yayını.
Main, Vercel Production, mevcut Alpha ve testçi listesi değiştirilmedi.

Önceden var olan advisor açıklamaları:
[RLS](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy),
[search_path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable),
[parola koruması](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Gerçek servis kabulü — web (mock değil)

Yeni geçici test hesabı #1 yalnız izinli iş Google kimliğiyle oluşturuldu.
Google hesap seçimi → Supabase PKCE → otomatik `/profile` dönüşü geçti.
Sayfa yenileme sonrasında `/online` gerçek sunucu hesabını “E-posta doğrulandı”
olarak gösterdi. Çıkıştan sonra yeniden Google girişi geçti; sunucuda tek
hesap/tek Google identity bulunuyor. İkinci uygulama e-posta doğrulaması veya
uygulama şifresi istenmedi. Google'ın mevcut temel profil/e-posta rızasıyla
normal giriş tamamlandı; Cloud audience/provider secret değiştirilmedi.

İşlem anında ayrı kullanıcı onayıyla yalnız şu yerel callback eklendi:
`http://127.0.0.1:8121/online/auth?flow=google&attempt=*`.
Önceki sekiz callback korundu; toplam dokuz. Site URL ve CORS değişmedi.
Ayrı worktree'nin dış node_modules symlink'i web asset export'unda fontları
kök dışına taşıdığından yerel bağımlılıklar frozen/offline kuruldu; tekrar
`pnpm export:web:test` geçti. Bu ortam düzeltmesi repo kaynak değişikliği değildir.

Yeni hesabın gerçek düellosu 20 saniyeyle oluşturuldu. UI'da 2 saniye kalırken
7. soruya gönderilen yanıt sunucuda `timed_out=false` kaydedildi. Beş önceki
süre aşımı gerçek sunucuda kaydedildi; yinelenen pozisyon yok. Kesin 20 saniye
sonrası ANSWER_LATE sınırı bu web etkileşimiyle yeniden kanıtlanmadı; izole SQL
regresyonunda geçmiştir. Bu test fiziksel Android kabulü değildir.

Hook mantığı için dört yönetici SELECT denetimi geçti: izinli iş adresi kabul,
başka Google adresi ret, email akışı korunuyor, user_metadata ile izin spoof
edilemiyor. MCP üzerinden `SET ROLE supabase_auth_admin` izni olmadığı için
ayrı rol taklidi çalıştırılamadı; yetki genişletilmedi. Gerçek Google kaydının
başarısı hosted Auth hook çağrısının çalıştığına ayrıca kanıttır.

## Gerçek canlı oda / native paket

Yeni test hesabına yalnız sentetik `qa_google_1101` kullanıcı adı kaydedildi;
keşfedilebilirlik açılmadı. Gerçek live oda komutu bir bekleme odası oluşturdu,
UI **20 saniye/soru** gösterdi. İkinci oyuncu olmadan başlangıç kilidi doğru
şekilde korundu. Gerçek iki oyunculu başlangıç/deadline kabulü henüz yapılmadı.

Frankfurt public URL/publishable key ile yeni yerel QA release APK derlendi:
SHA-256 `cf5471472330c24981a92b8debf28ac7791f9ccef9551170cf5b9b42363f4330`.
Android 14 emülatöre `install -r` ile kuruldu; uninstall/data clear yapılmadı.
Önceki yerel profilin 20 XP ve son skor kaydı korundu. Bu debug anahtarlı
code 5 QA paketidir; Play sürümüne üzerine kurulacak EAS kabul paketi değildir.
Reklam modu off; gerçek reklam/Analytics/push açılmadı.

İkinci ve son geçici hesap için native kayıt ekranı hazırlandı; e-posta
alanı onaylı iş adresinin yeni test alias'ıdır. Şifre alanları doldurulmadı;
kimlik bilgisi oluşturma adımı hesap sahibine bırakıldı. Bu hesap henüz
oluşturulmuş veya e-posta akışı geçmiş sayılmıyor.

Edge olumsuz erişim kontrolü gerçek endpoint üzerinde geçti:
`edge-security-results.json` — oturumsuz 401, sahte JWT 401, izin dışı origin 403.


Gerçek test hesabı işlemleri sonrasında koruma denetimi tekrarlandı: test
hesapları hariç profil/ledger/rozet ve dağıtım öncesindeki oda satırları aynı
MD5 özetlerini verdi. Yeni test odası 20 saniyedir. E-posta kayıt denemesi
emülatör DNS çözümleme sorunu nedeniyle servise ulaşamadı; hesap oluşmadığı
sunucuda doğrulandı. Başarılı kayıt/otomatik native giriş olarak sayılmadı.


Emülatör DNS sorunu aynı AVD/veri korunarak, açılışta Mac'in etkin DNS
çözücülerini kullanarak giderildi. Supabase hostname çözümleme ve ping geçti;
kayıt formu hesap sahibinin şifre girişine yeniden hazırlandı. Kaynağa kalıcı
DNS/HTTP/TLS istisnası eklenmedi. Bağımsız frozen/offline node_modules ortamında
`pnpm check` tekrar geçti: TypeScript, lint, soru bütünlüğü, **390/390 test**.


## Native hosted e-posta kaydı — doğrulama aşaması

DNS düzeltmesinden sonra hesap sahibi şifre alanlarını kendisi girip kaydı
tekrar gönderdi. Gerçek Android 14 uygulamasında “Doğrulama Bekleniyor”
göründü. Hosted Auth SELECT: bu test alias'ı için **tek hesap**,
`email_confirmed_at IS NULL`. İzin verilen iki geçici uygulama hesabı sınırına
ulaşıldı; yeni hesap oluşturulmayacak.

Yerel tarayıcı kontrolü kapalı olduğundan gerçek Gmail bağlantısına araçla
ulaşılamadı; araç oturumu yenilenince de aynı erişim hatası sürdü. Hesap
sahibine bağlantıyı Mac'te tüketmeden Android Chrome'a elle aktarma adımı
hazırlandı. Android uygulaması force-stop edildi; callback sonrası açılış
cold-start olarak kontrol edilecek. Bu aşamada otomatik oturum veya
Chrome→uygulama sonucu henüz başarılı sayılmıyor.


## Gecikmiş native doğrulama sonucu — kritik açık kabul

E-posta bağlantısı gerçek Android Chrome'dan uygulamaya döndü. Hesap
sunucuda **doğrulandı**, fakat oturum açılamadı. Hosted log, tek `/verify` 303
ve tek `/token` 422, `grant_type=pkce`, `flow_state_expired` gösteriyor.
Sadece UI gözleminden “e-posta doğrulanmadı” sonucu çıkarılmadı.

Kayıt/flow oluşturma 11:15:31 UTC, e-posta doğrulama ve kod üretimi 11:25:19 UTC.
`last_sign_in_at` NULL ve session sayısı 0. Bu nedenle bu senaryo **otomatik
giriş başarısı değildir**. Ayrıntı: `hosted-email-expired-result.json`.
Resmî [PKCE belgesi](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
kısa ömürlü/tek kullanımlık kod ve akışı yeniden başlatma şartını açıklıyor;
canlı kayıtta kod üretim zamanı yenilenmiş olsa da flow oluşturma zamanı
korunmuş ve sunucu expired döndürmüştür. Kesin sunucu hatasıyla sınırlı
raporlanır; PKCE kaldırılmadı, süre veya Auth satırları değiştirilmedi.

UI'daki eski genel “Bağlantının süresi doldu. Yeni bir bağlantı iste.” metni,
doğrulanmış e-postayı da yeniden doğrulama döngüsüne yönlendiriyordu.
Adayda mesaj artık **doğrulamayı tamamladıysa güvenli giriş ekranını**, henüz
verifiye etmediyse yeni bağlantıyı öneriyor. İstemci yalnız e-posta adresinden
hesap doğrulandı iddiasında bulunmuyor; sahte oturum üretilmiyor. Bu metin
düzeltmesi oturum sorununu çözmüş gibi gösterilmez; regresyon testi eklendi.

Aynı doğrulanmış test hesabıyla e-posta/şifre girişi hesap sahibine hazırlandı.
Yeni hesap oluşturulmadı; güvenli mevcut giriş ve kalıcılık kabulü bekliyor.
Fresh signup→otomatik native session kabulünün bu hosted adayda başarılı
sayılması için ek kontrollü tekrar gerekir; 2/2 yeni hesap sınırı korunuyor.


## Mevcut hesap girişi ve kalıcılık — gerçek Android geçti

Hesap sahibi aynı doğrulanmış test hesabının şifresini uygulamaya girdi;
çevrimiçi düello ekranı açıldı. Hosted Auth: confirmed=true, session sayısı 1.
UI sunucu hesabını “E-posta: doğrulandı · Çevrimiçi hesap” gösterdi.
Uygulama force-stop ile kapatılıp native deep link ile yeniden açıldı;
güvenli depodaki oturum korundu, tekrar şifre istenmedi. Ekran kanıtları:
`hosted-native-password-session.png`, `hosted-native-session-relaunch.png`.
Bu gerçek şifre girişi/kalıcılık kanıtıdır; signup callback'in otomatik
oturumu olarak sayılmaz.

## Gecikme için izole yerel regresyon / alternatif araştırması

`scripts/auth-delayed-confirmation-local.ts` yalnız kesin loopback 55631/55634
GoTrue/Mailpit ve adı sabit yerel Docker DB'yi kullanır. Canlıya bağlanamaz.
Her fixture yeni `.invalid` adreslidir; yalnız bu yerel fixture'ın flow zamanı
10 dakika geriye alınır. Gerçek yerel SMTP ConfirmationURL → PKCE exchange
expired hatasını yeniden üretti. Aynı yaşta ikinci fixture'da mevcut
verifyEmailLink token_hash/verifyOtp desteğiyle server-verified session geçti;
aynı tokenın başka client'ta tekrarı reddedildi. Parola/token/link loglanmaz.

`delayed-confirmation-local-result.json` iki kontrolü kaydeder. Bu doğrudan
SDK/domain entegrasyonudur; native Gmail veya hosted template kabulü değildir.
Kaynak: [Email templates](https://supabase.com/docs/guides/auth/auth-email-templates).
TokenHash alternatifi **canlıda etkinleştirilmedi**. Mevcut Alpha/main callback
kodunda token_hash desteği olmadığı kontrol edildi; global template değişikliği
eski sürümü bozabilir. E-posta linkindeki bearer tokenın custom-scheme üzerinden
taşınması ayrıca değerlendirilmeden PKCE yerine geçirilmez. Yeni client/HTTPS
handoff ve dar opt-in şablon planı gerekirse ayrıca incelenip onaylanmalıdır.

Son kod kontrolü: **391/391 test**, TypeScript/lint/soru bütünlüğü geçti;
Frankfurt public bundle `pnpm export:web:test` geçti. Yeni mesaj henüz Play'deki
pakette yok. Mevcut QA native kabul paketi SHA `cf547147…63f4330` idi; bu son
metin değişikliği sonraki derlemeye girecek. Main/Production/Alpha değişmedi.


Native hesap değişimi: hesap sahibinin başarılı girişinden sonra test e-posta
hesabından uygulamanın mevcut “Hesaptan Çık” işlemiyle çıkıldı; hosted
`auth.sessions` sayısı 0 doğrulandı. Yeni gerçek Google akışı Android'deki
sistem tarayıcısını açtı (`accounts.google.com`). İş hesabının Google giriş
adımı hesap sahibine bırakıldı; native OAuth sonucu henüz bekleniyor.

## Hosted canlı oda: iki izinli aktör / gerçek saat sınırı

Mevcut iki yetkili geçici aktörle mevcut `live_room_command` kullanılarak
create → join → ready → start çalıştırıldı. Kaynak MD5'i beklenenle aynıydı.
Başlangıç zamanı değiştirilmeden gerçek saat beklendi: iki aktörde aynı
deadline/20 sn; **15.02 sn** yanıt kabul edildi, aynı request tekrarında tek
cevap kaldı, farklı ikinci request `ANSWER_LOCKED` oldu. 20 saniye sonrasındaki
diğer oyuncu yanıtı `ANSWER_LATE`; sonraki görünüm reveal/5 sn idi.

Bütün test tek transaction içinde **ROLLBACK** edildi. İkinci geçici oyuncunun
yalnız test için gereken username ayarı, oda/üyeler/yanıtlar ve olası push
kuyruğu da kalıcı yazılmadı. Yeni hesap, canlı Auth ayarı, gerçek kullanıcı
veya eski oda değişikliği yapılmadı. Bu SQL RPC entegrasyon kanıtıdır; gerçek
iki cihaz UI'sı, Edge kimlik doğrulaması veya push teslimi değildir.
Özet: `hosted-live-boundary-result.json`.

## Gerçek Android Google testi — kısa deneme geçti

Hesap sahibinin ilk ek Google doğrulaması uzun sürdü. Chrome Production ana
sayfasına düştü; native uygulamaya dönülmedi, hosted yeni giriş/oturum yoktu.
Auth loglarının bu denemesinde expiry ifadesi vardı. Kullanıcının “ana sayfa
açıldı” yanıtı tek başına native Auth kabulü olarak kullanılmadı.

Yeni kısa deneme: native Google butonu → gerçek Google hesap seçimi → yalnız
aynı izinli iş kimliği → otomatik native **Profilim**. Hosted son giriş
`2026-11-01T13:07:32.664661Z`, tek uygulama hesabı/tek Google identity doğrulandı.
Webde önceki test oturumu + yeni native oturum iki session'dır, iki hesap değildir.
Force-stop/relaunch sonrasında Hesap ekranı aynı iş e-postasını ve doğrulanmış
durumu gösterdi; önceki e-posta fixture kimliği görünmedi. Yeni uygulama
şifresi veya ikinci doğrulama e-postası istenmedi. Yeni hesap oluşturulmadı.

Kanıt: `hosted-google-native-result.json` ve
`screenshots/hosted-google-native-session-relaunch.png`. Gerçek Android 14
emülatörüdür; fiziksel Samsung/iOS testi değildir. Aynı iki geçici hesabın
son entegrasyon ve güvenli temizliği bekliyor.

## Açık: davet kabulünün timing protokolü

Hosted matchmaking fonksiyonunun mevcut MD5'i
`cf3e39c0494f8260131ea3e08eb15d00`. İç create, timingVersion olmadan çağrılıyor;
20 sn motoru yeni davet kabulünü UPDATE_REQUIRED ile durduruyor. Önceki
create/join testi bu yolu kapsamamıştı. Sorun kaynakta ve izole yerelde
doğrulandı; yeni ileri düzeltme ve eski maç uyumluluğu yerelde geçti.
Bu yeni migration ve Edge alanı **henüz canlıya uygulanmadı**. Ayrı plan:
`../timer-auth-20261101/direct-challenge-correction-plan.md`.

**Sonraki güncelleme:** Kullanıcının ek plan onayı alındı; Edge v18 ve
`20261101133436` migration'ı uygulandı. Yeni native QA APK ile gerçek hosted
arkadaşlık kabulü / Later / Katıl / 20 sn maç başlangıcı geçti. Tek maç/iki
oyuncu, ilk cevabın 13.67 sn'de kabulü ve çift dokunmada tek satır sunucuda
doğrulandı. Güncel dağıtım ve sınırlar:
`../timer-auth-20261101/direct-challenge-correction-deployment.md`.
