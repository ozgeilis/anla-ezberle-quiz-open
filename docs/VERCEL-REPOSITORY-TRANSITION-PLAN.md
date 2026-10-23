# Vercel: yeni ana depoya geçiş planı

Hedef kaynak: `ozgeilis/anla-ezberle-quiz-open`, `main`. Eski depo `ozgeilis/anla-ezberle-quiz` PRIVATE kalır; PR #89 eski depoda birleştirilmez. **Bu belge planıdır; Git bağlantısı, alan adı veya canlı dağıtım değiştirilmemiştir. Uygulama adımları ayrıca kullanıcı onayı gerektirir.**

## Mevcut durum ve doğrulama sınırı

- Yerel eski Vercel bağlantı kaydındaki proje adı: `anla-ezberle-quiz`.
- Kaynakta kullanılan kanonik HTTPS adresi: `https://anla-ezberle-quiz.vercel.app`.
- Vercel yönetim API'si salt-okunur sorguda 403 döndürdü; kayıtlı erişim oturumunun süresi dolmuş. Bu yüzden güncel Git bağlantısı, proje seviyesindeki override'lar, tüm domain'ler ve ortam değişkeni envanteri doğrulanmış sayılmaz. Hiçbir değer/token rapora alınmadı. Geçiş onayından önce kullanıcı mevcut Vercel hesabında oturum açmalı ve metadata yeniden okunmalı.
- Yeni bir Vercel projesi oluşturulmaz; mevcut proje kimliği, sahiplik/team, domain atamaları ve deployment geçmişi korunur. Git bağlantısı varsa aynı proje üzerinde değiştirilir; proje şu an Git'e bağlı değilse aynı projeye yeni depo bağlanır.

Kaynak `vercel.json` içindeki hedef ayarlar:

| Alan                 | Korunacak kaynak değeri                                           |
| -------------------- | ----------------------------------------------------------------- |
| Framework            | Özel/`null`                                                       |
| Install              | `pnpm install --frozen-lockfile`                                  |
| Build                | `pnpm export:web:test`                                            |
| Output               | `dist`                                                            |
| Clean URLs           | `true`                                                            |
| Asset rewrite        | `/assets/node_modules/:directory(.*)/:file` → `/web-assets/:file` |
| SPA rewrite          | `/:path*` → `/`                                                   |
| Güvenlik header'ları | noindex/nofollow, no-referrer, nosniff, frame DENY                |

Dashboard override'ları bu tablodan farklıysa sessizce değiştirilmez; önce gerçek mevcut ayarlar kaydedilip fark değerlendirilir. Root Directory ve Node sürümü şu an yönetim API'sinden doğrulanamadı. CI Node 24 kullanıyor diye Vercel Node sürümü otomatik yükseltilmez; mevcut uyumlu sürüm ve root ayarı korunur.

## Ortam değişkenleri ve Supabase

Kaynak exporter `EXPO_PUBLIC_SUPABASE_URL` ve `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ister; production içerik kanalını kendisi ayarlar. Vercel'deki gerçek anahtar değerleri GitHub'a/Actions'a taşınmaz. API erişimi yeniden sağlandığında yalnız değişken adları, Production/Preview/Development kapsamları, branch override'ları ve türleri kaydedilir; değerler loga/rapora yazılmaz. Bu liste şu an canlı Vercel envanteri olarak doğrulanmış değildir.

Aynı proje kullanıldığı için var olan env değerleri silinmez veya yeniden oluşturulmaz. Yönetici/service-role/SMTP anahtarı `EXPO_PUBLIC_*` değişkenine eklenmez. Kaynakların PUBLIC olması, test runner'larına üretim anahtarı verme gerekçesi değildir.

Kanonik adres korunacağından Supabase Site URL, Redirect URLs, kullanıcılar, tablolar, erişim kuralları ve maçlar değiştirilmez. Preview URL için redirect izni varmış gibi davranılmaz veya wildcard eklenmez. E-posta doğrulama/şifre sıfırlama kabulü, yayın onayından sonra mevcut kanonik adres üzerinde yetkili test hesaplarıyla yapılır.

## Onay sonrası uygulanacak sıra

1. Vercel oturumunu kullanıcı kendi hesabında yeniler. Mevcut proje kimliği/team, Git bağlantısı, domain'ler, root/build/install/output/Node ayarları, env kapsamları ve mevcut production deployment kimliği salt-okunur yeniden doğrulanır. Son çalışan deployment rollback hedefi olarak kaydedilir.
2. Yeni main SHA ve başarılı CI koşuları sabitlenir. Görsel asset ve soru bankası özetleri karşılaştırılır; eski depoda hiçbir merge yapılmaz.
3. Kullanıcı onayı kapsamındaysa aynı Vercel projesinde, yeni kaynak SHA'dan bir Preview build hazırlanır. Yeni proje/domain veya üretim verisi oluşturulmaz. Ses, orijinal görseller, SPA yolları ve paket izolasyonu kontrol edilir. Preview adresi Supabase Auth yönlendirme izni olarak varsayılmaz.
4. GitHub Vercel uygulamasının yeni depoya erişimi kontrol edilir. Gerekli uygulama yetkilendirmesini depo sahibi tamamlar; eski repoya verilen erişim veya PRIVATE görünürlüğü kaldırılmaz.
5. **Git bağlantısının değiştirilmesi otomatik production build tetikleyebilir.** Bu adım ve canlı yayın onayı alınmadan uygulanmaz. Onaydan sonra mevcut projenin Git kaynağı yeni repo/main olarak ayarlanır; proje silinip yeniden import edilmez. Domain ve env'lere dokunulmaz.
6. Build'in sabitlenen SHA'yı kullandığı doğrulanır. Üretim paketinde yönetici anahtarı bulunmadığı kontrol edilir. Yeni deployment hazır/sağlıklı değilse production'a alınmaz.
7. Onaylanan deployment mevcut kanonik domain'de doğrulanır: `/`, `/profile`, `/achievements`, `/online`, `/online/auth` doğrudan açılış, görsel/WAV/font yükleme, açık/koyu tema ve ses tercihleri. Ardından yetkili hesaplarla giriş, e-posta dönüşleri ve oda katılımı denenir; kullanıcı veya geçmiş veri silinmez.
8. Önceki ve sonraki proje/domain/env metadata karşılaştırılır; production SHA ve kanıtlar raporlanır. Bu tamamlanmadan geçiş başarılı sayılmaz.

## Geri dönüş

Sorun olursa aynı projenin kaydedilen son sağlıklı deployment'ı yeniden production'a alınır. Gerekirse Git bağlantısı kaydedilen önceki kaynağa döndürülür. Yeni/eskı depo veya commit'ler silinmez; force-push, DB reset, migration geri alma veya kullanıcı/veri taşıma yapılmaz. Domain satın alma/transferi gerekmez.

Resmî başvuru: [Vercel Git bağlantıları](https://vercel.com/docs/git), [CLI Git komutları](https://vercel.com/docs/cli), [ortam değişkenleri](https://vercel.com/docs/environment-variables).
