# Ayarlar ve push bildirimleri — 25 Ekim 2026

**Durum (26 Ekim): kod/yerel kabul hazır, onaylı Frankfurt kapalı test backend'i dağıtıldı; genel gönderim kapalı, gerçek telefon teslimi doğrulanmadı.**
Bu belge bir üretim dağıtım onayı değildir. Ana sayfa, kategoriler, alt navigasyon,
görseller, soru bankası ve hesap silme sunucu işlemleri değiştirilmedi.

## Uygulanan akış

Ayarlar ana sayfasında gerçek profil/seviye/XP özeti ve yedi menü bulunur.
Profil, Ses, Tema, Hesap, Bildirimler, Gizlilik ve Yardım ayrı detaylara açılır.
Tema için Açık/Koyu/Sistem önizlemeleri mevcut kişiselleştirme kayıt sistemini
kullanır. Kaydetmeden çıkmak kalıcı tercihi değiştirmez; başarısız kayıtta eski
tema korunur. Hesap silme mevcut çalışan `/account-delete` ekranına yönlenir.

Bildirimler menüsü yalnızca beş tercih anahtarını gösterir; Inbox'a bağlantı
eklemez. Ana anahtar kapatıldığında dört alt tercih saklanır. Misafir, web,
Expo Go, sunucu kapalı veya OS izni reddedilmiş durumlar etkinmiş gibi görünmez.
İzin yalnızca kullanıcının ana anahtarı açıp açıklamayı onaylamasıyla istenir.
OS izni, sunucudaki tercih ve mevcut cihaz kaydı ayrı değerlendirilir.

## Güvenlik ve gönderim modeli

- Tercihler hesap bazlıdır. En fazla altı cihaz; cihaz kaydı gerçek Auth
  oturumuna bağlıdır. RPC doğrulanmış, anonim olmayan kullanıcı ve halen mevcut
  Auth oturumu ister. İstemcinin gönderdiği kullanıcı kimliği kullanılmaz.
- Dört yeni tablo `quiz_private` içindedir; RLS ve FORCE RLS açıktır,
  `anon`/`authenticated` doğrudan tablo erişimi yoktur. Kullanıcı RPC'si yalnız
  kendi tercihlerini/kaydını yönetir. Worker RPC'si yalnız `service_role` içindir.
- Mevcut Inbox olayları aynı teslim kuyruğuna eklenir. Oda başlangıcı mevcut
  `lobby → countdown` olayından bu kuyruğa gider. Eski APK'ların tanımadığı yeni
  bir Inbox türü eklenmez; mevcut Inbox tablosu/kısıtı/API biçimi korunur.
- İzin ve tercihler claim sırasında ve Expo çağrısından hemen önce tekrar
  denetlenir. Kuyrukta benzersiz olay/cihaz anahtarları, kilitli claim ve hız
  sınırları vardır: cihaz başına 15 dakikada 6, günde 40 gönderim. Eşzamanlı worker cihaz bütçesini kilitler;
  limiti aşan işler ortak kuyruğu bloke etmek yerine bastırılır.
- Worker en fazla 30 işi, beş eşzamanlı istekte işler. Expo'nun idempotency
  anahtarı olmadığı için belirsiz HTTP sonuçları otomatik tekrar gönderilmez;
  `unknown` olarak kalır. Bu bilinçli tercih yinelenmeyi azaltırken bazı
  bildirimlerin kaybolmasına yol açabilir. Garanti edilmiş teslim vaat edilmez.
- Ticket sonrası receipt 15 dakika sonra sorgulanır. `DeviceNotRegistered`
  token'ı pasifleştirir; token özeti eski receipt'in yenilenmiş token'ı
  pasifleştirmesini engeller. `provider_accepted`, telefon teslim kanıtı değildir.
- Kuyruk süresi bir saat, teslim metaverisi en fazla yedi gün, aktif görülmeyen
  cihaz kaydı 90 gündür. Temizlik worker çalıştığında gerçekleşir. Çıkışta
  onaylanmış cihaz kaydı iptali beklenir; silinen/sona eren oturum gönderemez.
  Hesap silinmesi yeni kişisel tablolara FK CASCADE ile yayılır; mevcut silme
  backend'inin güvenlik kuralları değiştirilmez.
- Push içeriği genel mesajlardır; e-posta, parola, cevap anahtarı veya skor
  taşımaz. Token/servis cevabı/hata ayrıntıları loglanmaz. Bildirim verisi URL
  taşımaz; yalnız sürüm, kaynak ve UUID'ler içerir. Hedef sunucudan sahiplik ve
  olay geçerliliği kontrolüyle çözülür. Başka hesaba ait paket yönlendirilmez.
- OS izni uygulama arka plandayken değişirse sunucu bunu anında bilemez;
  uygulama tekrar etkin olduğunda kaydı iptal eder. Sağlayıcıya zaten kabul
  ettirilmiş bir push geri çağrılamaz.

## Gerçekleştirilen kontroller

| Kontrol                               | Sonuç          | Kapsam                                                                                                     |
| ------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------- |
| `pnpm check`                          | PASS: 309/309  | Soru bütünlüğü, TypeScript, lint; 299 mevcut + 10 yeni test                                                |
| İzole yerel PostgreSQL kabulü         | PASS: 23       | Gerçek SQL/RLS/RPC; sentetik hesap/oturum satırları; sonunda ROLLBACK                                      |
| Ayarlar/hesap tarayıcı smoke          | PASS: 27 grup  | İzole sentetik HTTP fixture; gerçek Chrome ve uygulama bileşenleri                                         |
| Açık/koyu responsive ekranlar         | PASS: 48 ekran | 320/360/390 × sekiz görünüm; yatay taşma yok                                                               |
| Android/iOS/web Expo export           | PASS           | JS/Hermes/web çıktısı; imzalı native build değildir                                                        |
| Android/iOS prebuild                  | PASS           | Bildirim plugin'i, Android channel/izin ve iOS entitlement üretimi                                         |
| Android Firebase/EAS kurulumu         | PASS           | Onaylı package için FCM V1 anahtarı atandı; yalnız preview file env                                        |
| Gerçek Firebase dosyasıyla prebuild   | PASS           | İzole Android fixture; Google Services dosyası ve Gradle plugin'i                                          |
| Gerçek Android token/teslim/tıklama   | DOĞRULANAMADI  | Yeni APK başarıyla üretildi; fiziksel test bekleniyor                                                      |
| Gerçek iOS token/teslim/tıklama       | DOĞRULANAMADI  | Ücretli Apple Developer üyeliği yok                                                                        |
| Frankfurt kapalı test endpoint/kuyruk | PASS           | Yalnız onaylı migration + push-dispatch v1; genel kapalı, yalnız iki sentetik hesap; zamanlayıcı çalışıyor |

SQL testi: RLS/izin sınırları, rollout kapalı durum, çok cihaz, hesap izolasyonu,
alt tercihlerin korunması, gerçek olay trigger'ı, yinelenme, tercih tekrar kontrolü,
token yenilenmesi, receipt, oturum iptali, Auth CASCADE ve diğer kullanıcının
korunması; oda tercihi/üyelik/başlangıç ve güvenli hedef çözümü. SQL senaryosunda
gerçek Auth HTTP girişi veya gerçek Expo servisi kullanılmaz.

UI smoke: ayrı isim/kullanıcı adı, hata/çakışma ve hesap değiştirme akışlarının
yanında yeni menüler, Inbox'tan ayrım, tema önizleme/iptal/yeniden açma/kaydetme,
yenilemede kalıcılık ve simüle edilmiş depolama hatası.

Tekrar üretim (yalnız mevcut yerel Supabase Docker şeması, sunucu verisi kopyalanmaz):

```sh
pnpm install --frozen-lockfile
pnpm check
node scripts/check-push-local.mjs
pnpm export:web
# Mevcut settings-account-ui CI işi fixture export + gerçek tarayıcı smoke'unu çalıştırır.
```

Yerel SQL runner ayrı bir boş veritabanına yalnız şemayı kopyalar; kaynak
veritabanını resetlemez ve hosted bağlantı kullanmaz. Sağlayıcıya ait `pg_cron`
nesneleri bu izole fixture'a alınmaz. Test sonrasında şema fixture'ı yerelde kalır.

Ses CI'sinde mevcut tam sayfa geçişleri ve gerçek AudioContext kontrolleri
korunur. Playwright 1.56'da upstream tarafından belgelenen reload çökmesi
nedeniyle yalnız ses runner'ı 1.59.0'a sabitlendi; test atlama/otomatik retry
ya da başarısızlığı başarıya çevirme yoktur. İlgili upstream kayıt:
[WebKit reload regression #37766](https://github.com/microsoft/playwright/issues/37766).
Aynı zamanda tam sayfa kapanışında web ses kaynakları bırakılır; BFCache için
saklanan sayfa ise yalnız duraklatılır. Bu kontroller fiziksel Safari/iOS kabulü değildir.

## Frankfurt kapalı test uygulaması — 26 Ekim

Kullanıcı PR #7 kapalı test planını açıkça onayladı. Yalnız Frankfurt
`mqyuihiobkomjfipxehj` hedeflendi. İlk dry-run iki ilgisiz eski migration da
listediği için durduruldu. Orijinal dosyalara veya migration geçmişine müdahale
edilmeden ayrı dağıtım klasöründeki kapsam daraltıldı. İkinci dry-run yalnız
onaylı `20261025000100_push_notifications.sql` dosyasını gösterdi; SHA-256
`446488aa4a72e7deb92ef80b934108b9282a6ca73d640bc1a38ea30f9ed832f7`
doğrulandı ve yalnız bu migration uygulandı. Seed/role dosyası çalıştırılmadı.
İlgisiz 20261021000600/20261021000700 dosyaları uygulanmadı veya uygulanmış
olarak işaretlenmedi.

- `push-dispatch` ACTIVE v1. Eksik/yanlış dispatcher bearer 401, doğru bearer
  200 ve sıfır gönderim/receipt verdi. İki mevcut Edge Function değiştirilmedi.
- `push_config.enabled=false`; yalnız iki sentetik hesap allowlist'te, cihaz
  tokenı henüz yok. Yeni `anla-push-dispatch-v1` dakika zamanlayıcısı kapalı test
  kapsamında **etkin**. İlk üç gerçek çalışma HTTP 200, sıfır hata/gönderim verdi.
  Mevcut diğer zamanlayıcı korunuyor. Cron komutunda düz metin anahtar yok; Vault kullanılıyor.
- Expo Viewer robotu ve yalnız sunucu tarafında iki sır kullanıldı. Hesap çapında
  Enhanced push security kullanıcı onayıyla etkinleştirildi. Viewer tokenıyla
  gerçek Expo boş receipt isteği kabul edildi; bu, telefon teslim testi değildir.
- İlk Expo tokenı oluşturulurken özel araç çıktısında görünmesi nedeniyle iptal
  edildi. Yerine oluşturulan Viewer tokenı çıktıya yazılmadan özel dosyaya alındı,
  pano temizlendi ve sayfa hemen yenilendi. Yalnız yeni token sunucuya yüklendi;
  ilk token yeniden etkinleştirilmemeli. Git/uygulama/CI'ye token eklenmedi.
- İki yeni sentetik hesapla **10 hosted Auth/RPC kontrolü** geçti: gerçek oturum,
  anonim/worker reddi, tercihler/hesap izolasyonu, kapalı rollout ve iptal edilmiş
  oturumun reddi. İkinci hesap mevcut canlı hesap-silme akışında kendi parolasıyla
  silindi; Auth yokluğu ve yeniden girişin reddi doğrulandı. Kullanıcı daha sonra yalnız bir yeni geçici karşı hesabı ayrıca onayladı;
  silinen hesabın yerine bu hesap oluşturuldu. İki etkin sentetik hesabın gerçek
  oturumla kapalı rollout erişimi ve alt tercihleri tekrar doğrulandı. Gerçek
  hesap silinmedi. Bu hesaplar fiziksel kabul için korunuyor.
- Migration öncesi 29 mevcut tablonun yalnız toplu satır sayısı/içerik özeti
  alındı; migration sonrasında tamamı aynıydı. Kullanıcı/cevap satırı dışarı
  aktarılmadı. Son testler ve iki yeni sentetik profil hazırlandıktan sonra yalnız bu yeni
  profiller dışlanarak 29 tablonun özeti yeniden aynı bulundu.

### pg_net platform sınırı

Yönetilen `supabase_admin` sahipliği nedeniyle proje `postgres` rolüyle
`REVOKE` komutları etkili olmadı; kaldırılmış izin gibi raporlanmıyor. `net`
kuyruk tabloları PUBLIC SQL grant taşır. **Data API üzerinden net şeması
406/PGRST106 ile reddedildi**, `anon`/`authenticated` NOLOGIN ve platform dışı
LOGIN rolü yok. Vault decrypted-secret okuma uygulama rollerine kapalıdır.
Bununla birlikte doğrudan DB bağlantısı kurabilen güvenilen platform/DB rolleri
bekleyen HTTP başlıklarını okuyabilir. Vault bu geçici başlığı gizlemez.
Yalnız sınırlı dispatcher bearer kullanılır; Expo tokenı kuyrukta yer almaz.
`net` hiçbir zaman API'ye açılmamalı; yeni doğrudan DB LOGIN rolleri güvenlik
incelemesi gerektirir. Bu platform sınırı API/NOLOGIN denetimleriyle değerlendirildi. Zamanlayıcı
yalnız iki test hesabı için çalışır; kayıtlı cihaz olmadığından gerçek telefon
gönderimi veya teslimi henüz iddia edilmez.
Kaynaklar: [Supabase pg_net izinleri](https://supabase.com/docs/guides/database/extensions/pg_net),
[REVOKE sınırı](https://supabase.com/kb/troubleshooting/revoking-access-to-pg_net-objects-has-no-effect),
[HTTP başlıkları](https://supabase.com/kb/troubleshooting/database-roles-can-read-request-headers-queued-by-pg_net).

### Kod/paket taraması

Değişen dosyaların redakte taramasında kimlik bilgisi bulgusu yoktu. Tüm ağaçtaki
eski `dedup_key` konu anahtarı kimlik bilgisi değildir. Önceki web JS ve çözülmüş
Hermes string taramaları özel anahtar örüntüsü bulmadı. Her yeni APK ayrıca
incelenmeli. Bunlar bağımsız kapsamlı güvenlik denetimi, gerçek telefon teslimi,
TalkBack/VoiceOver veya native büyük yazı kabulünün yerine geçmez.

## Kalan kabul ve genel yayına geçiş planı — genel yayın için ayrıca açık onay gerekir

1. Mevcut açık PR #2/#3/#6 ile entegrasyon sırasını çöz. Bu dal main tabanlıdır;
   onların görsel/oyun değişikliklerini içermez. Bu dalın Android package değeri,
   kullanıcının önceden onayladığı ve kabul ettiği APK'daki
   `com.kovynelstudio.anlaezberle` kimliğine hizalandı (PR #2 ile aynı).
   iOS bundle kimliği değiştirilmedi. Yeni kabul APK'sı hazırlanırken önceki
   kabul edilen özellikler korunmalı. EAS projectId mevcut projeye aittir.
2. Kullanıcının açık onayıyla ücretsiz Spark planında `anla-ezberle-push`
   Firebase projesi oluşturuldu; Analytics, Gemini ve ücretli deneme açılmadı.
   Android uygulaması `com.kovynelstudio.anlaezberle` adına kaydedildi ve FCM V1
   etkin görüldü. Ayrı `expo-push-sender` hesabına yalnız kullanıcının ayrıca
   onayladığı Firebase Cloud Messaging API Admin rolü verildi. Kullanıcı JSON
   özel anahtarını kendisi oluşturdu. İlk indirilemeyen anahtarı kullanıcı iptal
   edip yenisini oluşturdu; Cloud'da yalnız yeni etkin anahtar görüldü. Yerel
   JSON'un proje/servis hesabı/RSA anahtar türü doğrulandı ve mevcut EAS projesinde
   doğru Android kimliğinin yalnız FCM V1 alanına atandı. Play Store gönderim
   kimlik bilgisi eklenmedi; imzalama anahtarı değiştirilmedi.
   `google-services.json` proje/package eşleşmesi doğrulanarak yalnız **preview**
   ortamında EAS secret file environment `GOOGLE_SERVICES_JSON` olarak yüklendi.
   `app.config.ts` gerçek dosyayı çözdü; izole Android prebuild Google Services
   dosyasını ve Gradle plugin'ini üretti. Bu, APK build veya cihaz testi değildir.
   İki dosyanın özel yerel kopyaları proje dışında tutulur; özel servis hesabı
   anahtarı uygulama paketine, Git'e, Metro'ya veya CI'ye konulmaz. Ücretli plan
   başlatılmadı; Supabase'e FCM anahtarı yüklenmedi.
3. iOS için ücretli Developer üyeliği edinilmeden APNs tamamlanmış sayılmaz.
   Kullanıcı üyeliği sağladıktan sonra EAS Credentials'ta doğru bundle için APNs
   anahtarı/provisioning hazırlanır. Sertifika/özel anahtar Git'e eklenmez.
4. Backend için dar yetkili Expo erişim token'ı ve rastgele dispatcher secret
   yalnız Supabase sunucu sırlarında `EXPO_ACCESS_TOKEN` ve
   `PUSH_DISPATCH_SECRET` olarak tanımlanır. EAS projesinde Expo push enhanced
   security açılması ayrıca onaylanır. Mevcut CLI token'ları kopyalanmaz.
5. Canlı şema/migration geçmişini yeniden salt okunur doğrula. CLI dry-run
   **yalnız** aşağıdaki migration'ı göstermeli; başka pending migration görünürse
   dur. Onay kapsamı bu dosya ve `push-dispatch` dağıtımıyla sınırlı olmalıdır:
   `20261025000100_push_notifications.sql`, SHA-256
   `446488aa4a72e7deb92ef80b934108b9282a6ca73d640bc1a38ea30f9ed832f7`.
   Migration dört yeni özel tablo, yardımcı/RPC fonksiyonları ve iki trigger
   ekler; eski tablo/satır/kısıt silmez. Hesap silme fonksiyonuna dokunmaz.
6. Onaydan sonra migration + Edge Function dağıtılır. Varsayılan `enabled=false`
   korunur. Worker `verify_jwt=false` kullanır fakat her istekte yalnız özel
   dispatcher bearer'ını doğrular; kullanıcı JWT'si ile çalıştırılamaz.
   Çağrı planı: mevcut pg_cron/pg_net durumu incelendikten sonra Vault'ta tutulan
   secret ile dakikada bir server-side POST. Uzantı/Vault/scheduler izin değişikliği
   gerekiyorsa o da onaya dahildir. Secret'ı cron komutuna düz metin gömme.
7. Ayrı staging varsa önce orada; yoksa sadece onaylı test kullanıcı UUID'lerini
   `test_actors` listesine al. İki yetkili sentetik hesap, gerçek Samsung A04 /
   Android 14 ve yeni preview APK ile test et. Yeni iOS cihaz build'i ayrıca
   gerekir. Expo Go ve önceki APK bu kodu içermez.
8. Cihaz kabulü: izin kabul/ret, token, foreground/background/terminated teslim,
   cold tap + login, arkadaşlık/davet/sonuç/oda hedefleri, alt tercih/ana anahtar
   kapama, yeniden açma/kalıcılık, iki cihaz, token rotasyonu, OS iznini kaldırma,
   logout ve sentetik hesap silme. Diğer hesap/puan değişmezliğini kontrol et.
   Gerçek hesap silme bu planın parçası değildir; test hesabı için de açık onay gerekir.
9. Tüm teknik ve fiziksel kabul geçince ayrı onayla `enabled=true`, test listesi
   temizlenmesi ve istemci dağıtımı. Gizlilik sayfasındaki hazırlık ifadesini
   yalnız gerçekten etkinleştirilen platformlar için güncelle.

**Risk ve geri dönüş:** yeni trigger/RPC'lerin yükü, FCM/APNs yapılandırma hatası,
sağlayıcı kesintisi ve belirsiz gönderim kaybı. Sorunda önce
`push_config.enabled=false`, `test_actors='{}'`, sonra yalnız yeni scheduler'ı
durdur; gerekirse önceki istemciyi kullan. Sağlayıcıya verilmiş push geri
alınamaz. Eski tabloları silerek veya `db reset` ile geri dönüş yapılmaz.
Kapalı rollout mevcut Inbox ve oyun akışlarını kullanmaya devam eder.

Resmî kaynaklar:
[Expo setup](https://docs.expo.dev/push-notifications/push-notifications-setup/),
[FCM V1](https://docs.expo.dev/push-notifications/fcm-credentials/),
[ticket/receipt ve teslim sınırları](https://docs.expo.dev/push-notifications/sending-notifications/),
[Supabase sunucu sırları](https://supabase.com/docs/guides/functions/secrets).

## Ayrı Android kabul adayı

`integration/settings-push-preview-20261026` dalındaki `31928a4` merge commit'i,
kullanıcının cihazda kabul ettiği PR #2/#3/#6 yığınını odaklı bu çalışmayla
birleştirir. Main ve PR #6 değiştirilmedi. Kabul edilmiş Home, alt navigasyon,
assets, içerik ve oyun alanlarında bu yığına göre diff sıfır. Bu adayda frozen
install, `pnpm check` **319/319**, 27 ayarlar tarayıcı grubu, 7 gerçek Chrome ses
grubu, web/Android/iOS export ve native ses izin kontrolü geçti. Yerel ses
runner'ında yalnız tarayıcı başlatıcısı mevcut Chrome'a yönlendirildi; test
assertion'ları değiştirilmedi. 159 web/Android çıktı dosyasında mevcut beş özel
kimlik bilgisiyle birebir eşleşme yoktu.

Preview APK EAS build kimliği `dc4dd4cc-453a-4440-8d79-ce966ff4a75a`.
EAS **FINISHED** (26 Ekim 15:50:49 UTC). APK indirildi; `apksigner verify`
geçti, önceki kabul APK'sıyla imza aynı. Package
`com.kovynelstudio.anlaezberle`, target SDK **36**. Expo Notifications/FCM
servisleri ve POST_NOTIFICATIONS izni mevcut; mikrofon izni yok. 1.717 APK
girdisinde bilinen özel sunucu/FCM anahtarı eşleşmesi yok. İki mevcut cami/madalya
assetinin özgün dosya özeti APK içinde eşleşti. APK SHA-256:
`5eae29c74f7fbbf1b6b37c6456cd301025693f2a7b539f0d0b03866d4ff3a7b9`.
Kurulum: https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/dc4dd4cc-453a-4440-8d79-ce966ff4a75a

Bu, telefon izni/token kaydı/gerçek teslim kanıtı değildir. Samsung A04 /
Android 14 cihaz kabulü bekleniyor; token veya parola rapora yazılmayacak.
