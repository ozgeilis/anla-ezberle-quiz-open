# Ayarlar ve push bildirimleri — 25 Ekim 2026

**Durum: kod ve yerel kabul hazır; gerçek telefon push'u etkin veya doğrulanmış değildir.**
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

| Kontrol                             | Sonuç          | Kapsam                                                                |
| ----------------------------------- | -------------- | --------------------------------------------------------------------- |
| `pnpm check`                        | PASS: 309/309  | Soru bütünlüğü, TypeScript, lint; 299 mevcut + 10 yeni test           |
| İzole yerel PostgreSQL kabulü       | PASS: 23       | Gerçek SQL/RLS/RPC; sentetik hesap/oturum satırları; sonunda ROLLBACK |
| Ayarlar/hesap tarayıcı smoke        | PASS: 27 grup  | İzole sentetik HTTP fixture; gerçek Chrome ve uygulama bileşenleri    |
| Açık/koyu responsive ekranlar       | PASS: 48 ekran | 320/360/390 × sekiz görünüm; yatay taşma yok                          |
| Android/iOS/web Expo export         | PASS           | JS/Hermes/web çıktısı; imzalı native build değildir                   |
| Android/iOS prebuild                | PASS           | Bildirim plugin'i, Android channel/izin ve iOS entitlement üretimi    |
| Gerçek Android token/teslim/tıklama | DOĞRULANAMADI  | Firebase projesi/FCM V1 açık; EAS kimlik bilgisi ve yeni APK henüz yok |
| Gerçek iOS token/teslim/tıklama     | DOĞRULANAMADI  | Ücretli Apple Developer üyeliği yok                                   |
| Canlı push endpoint/kuyruk          | MEVCUT DEĞİL   | Üretim migration/function uygulanmadı                                 |

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

## Salt okunur canlı inceleme

Kaynak ağacının redakte edilmiş gizli bilgi taramasında yeni değişikliklerde
bulgu yok. Tüm dosya taramasındaki tek bulgu, mevcut içerik denetimindeki
`dedup_key` konu anahtarıdır; kimlik bilgisi değildir ve değiştirilmedi.
Web JavaScript ve çözülmüş Android/iOS Hermes string'lerinde özel anahtar
örüntüsü bulunmadı. Ham Hermes dosyasındaki SDK'nın `sb_secret_` sabiti bitişik
string tablosu nedeniyle yanlış eşleşti; derleyicinin bytecode dökümüyle ayrıldı.
Bu statik tarama gerçek push teslimi veya bağımsız kapsamlı güvenlik denetimi
yerine geçmez. Native büyük yazı ve ekran okuyucu kabulü açık kalır.

Frankfurt `mqyuihiobkomjfipxehj` projesinde yalnız schema/migration metaverisi
salt okunur transaction ile incelendi; kullanıcı satırı dışarı aktarılmadı.
Hesap silme migration'ı mevcut ve `accountDeletionEnabled=true`. Gereken
arkadaşlık/davet/maç/oda/Inbox tabloları mevcut. Inbox RLS/FORCE RLS açık.
`push_config` ve `push_settings` yok; Edge Functions listesinde yalnız mevcut
`account-delete` ve `online-duel` var. Canlı veri/izin/function/ayar değiştirilmedi.

## Üretime geçiş planı — ayrıca açık onay gerekir

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
   özel anahtarını kendisi oluşturdu; Cloud konsolunda etkin anahtar görüldü.
   Yerel dosya yolu henüz bulunamadığından içerik kontrolü/EAS yüklemesi yapılmadı.
   Android istemci yapılandırması indirimi de henüz doğrulanmadı.
   `google-services.json` yalnız EAS file environment
   `GOOGLE_SERVICES_JSON` olarak tutulur. `app.config.ts` package uyumunu denetler.
   FCM V1 servis hesabı özel anahtarı yalnız EAS Credentials'a yüklenir;
   uygulama paketine, Git'e, Metro'ya veya CI'ye konulmaz. Ücretli plan başlatılmaz.
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
