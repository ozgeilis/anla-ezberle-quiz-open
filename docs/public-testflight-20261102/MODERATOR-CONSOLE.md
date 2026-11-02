# Yerel moderatör aracı

Bu araç mobil uygulama veya yeni bir Auth/rol sistemi değildir. Mevcut
`public.moderation_review` RPC'sini, yalnız doğrulanmış ve sunucuda atanmış
moderatörün gerçek Supabase oturumuyla kullanır. Rol atamaz, kayıt açmaz ve
güvenlik bayrağını değiştirmez. App binary'sine veya TestFlight build 3'e dahil
edilmez; bu araç için yeni IPA gerekmiyor.

## Çalıştırma

Node 22.13+ ile, yalnız kendi Mac'inizde:

```sh
MODERATION_SUPABASE_URL=https://PROJE.supabase.co \
MODERATION_PUBLISHABLE_KEY=sb_publishable_PUBLIC_KEY \
node scripts/moderation-console/server.mjs
```

Tarayıcıda `http://127.0.0.1:8136` açılır. Servis adresini kontrol edin; parola
ve oturum doğrudan yalnız o Supabase projesine HTTPS ile gönderilir. Node süreci
yalnız statik dosyaları ve herkese açık yapılandırmayı sunar, giriş bilgilerini
almaz. Yalnız publishable key kabul edilir; secret/service_role/legacy JWT key
reddedilir. Local test için ancak açık `MODERATION_LOCAL_TEST=1` ile 127.0.0.1
servisi kullanılabilir. Sunucu sadece loopback dinler, Host/Origin/Fetch-Site
denetler; yazma route'u ve CORS izni yoktur. CSP harici script ve iframe'i engeller.

İşletim hesabının şifresini sahibi girer; tarayıcıya kaydetmez. Oturum tokenı
yalnız sekme belleğindedir, localStorage/sessionStorage/dosya/log kullanılmaz.
Şifre gönderimden sonra temizlenir. Oturum süresi dolunca yeniden giriş gerekir;
arka planda refresh token kullanılmaz. Çıkış yalnız o yerel oturumu kapatır.

## Günlük iş akışı

1. Giriş yapın ve kuyruğu yenileyin; ilk 50 açık rapor gösterilir. Kapananlar
   çıktıktan sonra sıradakiler yenilemeyle gelir. Raporlar/audit özel tablolardadır.
2. Şikâyetin bağlamını ve destek başvurularını değerlendirin. Rapor metni HTML
   olarak çalıştırılmaz. Şikâyetçi kimliği hedef oyuncuya gösterilmez.
3. 3–500 karakter gerekçe yazıp kararı ayrıca onaylayın: kapat, iç uyarı kaydı,
   sosyal erişimi kısıtla veya kısıtlamayı kaldır. RPC yetkiyi her istekte kontrol
   eder; arayüzde buton olması sunucu izni değildir.
4. İç uyarı kendiliğinden e-posta/push göndermez. Kısıtlama sosyal iletişimi
   sınırlar; hesap, skor, XP, rozet veya geçmiş silmez. İtiraz kanalı mevcut
   `kovynelstudio@gmail.com`; iletişim gönderimi ayrıca sahibin işlemi olur.
5. Çıkış yapın. Ağ hatasında karar başarılı sayılmaz; kuyruğu yenileyip kaydı
   kontrol edin. Eski sayfayı başarı kanıtı olarak kullanmayın.

Kapanmış raporlar açık kuyruğunda görünmez. Önceki kısıtlamayı geri almak için
"Önceki sosyal kısıtlamayı kaldır" bölümünde kayıtlı rapor ID'si ve gerekçe
kullanılır. İşlem yine aynı yetki/oturum denetimli `restore` RPC'sine gider.
Karara dayanak rapor ID'sini özel işletim kaydınızda tutun, herkese açık destek
iletisine rapor veya şikâyetçi kimliği eklemeyin.

## Gerçek kabul ve sınırlar

- Otomatik HTTP testi Host/DNS rebinding, cross-origin, body kabul etmeyen server,
  secret key reddi, CSP ve private dosya/route erişim reddini doğrular.
- `local-acceptance.mjs` mevcut üç sentetik fixture ile izole gerçek
  GoTrue/Edge/PostgREST üzerinde login, yetkisiz kuyruk reddi, rapor oluşturma,
  yetkili kuyruk, audit'li karar ve logout sonrası eski JWT reddini geçti.
  Önceki local moderatör/bayrak durumu finally ile geri kondu. Hosted trafik yok.
- 430/430 proje testi, TypeScript ve lint geçti. Yerel araç için ek lint de
  çalıştırılır. Hosted sahibiyle giriş/rol/işletim ve fiziksel sosyal kabul
  henüz tamamlanmadı; bu belge bunları başarılı saymaz.
- Gerçek moderatör rolü ve ortak canlı güvenlik bayrağı ayrı sahip onayı bekler.

Tekrar üretim:

```sh
pnpm exec tsx --test tests/moderation-console.test.ts
SAFETY_STACK_FILE=/private/local-stack.json \
SAFETY_FIXTURES_FILE=/private/local-fixtures.json \
node scripts/moderation-console/local-acceptance.mjs
```

Fixture dosyaları Git dışında tutulur; script yalnız sabit loopback servis ve
beklenen izole container/database adını kabul eder. Gerçek kullanıcı yaratmaz
veya silmez. Local sentetik rapor audit'te kalır.
