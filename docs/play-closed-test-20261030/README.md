# Android kapalı test adayı — 30 Ekim 2026

> Bu rapor PR #17’nin reklamsız APK kanıtıdır. AdMob test dalının yeni native binary’si ve farklı reklam/gizlilik beyanı için `docs/admob-test-20261030/README.md` esas alınır; aşağıdaki eski APK reklamlı sürüm olarak sunulmaz.

**Mağazaya gönderime hazır: HAYIR.** Teknik aday ve gerçek emülatör kanıtları hazırlanmıştır; aşağıdaki kabul ve Play Console adımları henüz tamamlanmamıştır. Bu rapor fiziksel Samsung kabulü, bağımsız dinî uzman onayı veya Google inceleme onayı değildir.

## Kapsam ve sürüm

- Taban `main`: `3c91d3c611207ff5fb03e4d97797903aeabb6434` (PR #16). İlk kapalı test kapsamı main/Production değişikliği içermiyordu. Kullanıcının sonraki açık talimatı arayüz değişikliklerini ana sürüme dahil etmeyi onayladı; PR #14 bunun için ayrı, yalnız UI birleşiminde güncel main ile tekrar sınandı. Canlı Supabase, Auth ve push ayarları bu görevde değiştirilmedi.
- PR #12, daha önce onaylı PR #15 üzerinden main'e ulaştı. İstemci ve yeni sunucu oyunlarında **v73** zaten aktif. Kullanıcının son açık onayı korunur; eski görev metnindeki v72 ifadesiyle geri alınmaz. Tarihsel v72 dokunulmadı.
- PR #14 `4b16825c3aa0aac1332d75099747e193d16f42c0`: renkli ana sayfa ve skor kesilmesi düzeltmesi adayda.
- PR #13 `6673fd83b7deafd2468470080c3eeb59e2dd2147`: PKCE Google, 8 karakter parola ve Google hesap silme kodu adayda; PR hâlâ taslak. Android'de gerçek Google oturum/callback kabulü tamamlanmadı. Google yeni kayıtları açılmadı.
- Entegrasyon SHA `cb9b76958e9f6b96576e1ec5b16839c810fb4e46` ilk APK kaynağıdır.
- SDK 58'in önerdiği yama sürümleri `d3211a26f78d42e74f2809946de8a2006fb1199d` ile kilitlendi. SDK ana sürümü, paket kimliği ve görseller korunur; pnpm tedarik zinciri bekleme koruması gevşetilmedi.
- İzin düzeltmesi APK’sı `dab5d980290e18ea8573f34d30d00e10f222cca0`: kullanılmayan Android overlay/eski harici depolama izinlerini engeller ve gizlilik metnindeki eski push/Google silme açıklamalarını düzeltir. Sonraki Android Activity regresyonunda bu APK’nın native kabulü durduruldu.
- Router düzeltmesi Android kaynağı `d5edeb1b536b91ed378ac291c03ff3ee44b13a0c`; UI-main karşılığı `66ec3b9423a4fbe5475bbf9c8e85fae44dbc32d2`. Henüz native sonuç eklenmeden başarılı kabul edilmez.

## Gerçek çalıştırılan kontroller

| Kontrol | Durum ve sınır |
|---|---|
| `pnpm check` | PASS — soru bütünlüğü, TypeScript, sıfır uyarılı ESLint ve **355/355** test; yama ve son uygulama değişiklikleri sonrası tekrarlandı |
| `expo install --check` | PASS — SDK 58 önerileriyle uyumlu |
| `build-editorial-v73.ts --check` | PASS — tarihsel editoryal çıktılar yeniden üretilebilir; dinî uzman kabulü değildir |
| `pnpm export:web` | PASS — aday web derlenir; Production'a gönderilmedi |
| Android Hermes export | PASS — gerçek HBC üretildi; cihaz ses kalitesi testi değildir |
| Android 14/API 34 | Gerçek ARM64 Google APIs AVD; Google Play Services kurulu; EAS release APK temiz kuruldu ve açıldı |
| Android 16/API 36 | AVD mevcut; son APK kabul sonuçları `binary-and-native.md` içinde |
| Fiziksel Samsung A04/Android 14 | Bu görevde erişim yok; önceki sürüm kabulü yeni APK kabulü sayılmadı |
| Gerçek Google OAuth | UI ve native browser açılışı kontrol edildi; yeni AVD Chrome ilk kurulumunda duruldu; Google hesabı/izin/callback/hesap eşleşmesi geçilmiş sayılmadı |
| iPhone | Bu yeni adayın fiziksel kabulü yapılmadı; önceki iPhone kabulü bu APK'ya taşınmaz |

### İzole gerçek sunucu testleri

Yeni yerel Supabase projesi `anla-play-closed-20261030`, API `http://127.0.0.1:56631`, ayrı Docker veritabanı ve yalnız sentetik hesaplar kullanıldı. Üretim kullanıcı satırları taşınmadı. Gerçek Auth, Edge HTTP, RLS, Postgres ve Realtime çalıştırıldı; mock API ile başarı üretilmedi.

| Mevcut protokol testi | Sonuç |
|---|---|
| `social-integration.mjs` | 11 grup PASS — arama, sahiplik, kullanıcı adı yarışı, gizlilik, kota ve RLS |
| `direct-challenge-integration.mjs` | 8 grup PASS — kabul/ret/iptal/süre, aynı isteğin tekrarı, sunucu kilitli sorular/cevaplar ve ledger |
| `leaderboard-edge-integration.mjs` | 8 grup PASS — gerçek kimlikler, genel/arkadaş sıralaması, opt-out, kesin XP ve sahte kimlik reddi |
| `live-integration.mjs` | 13 grup PASS — oda/üyelik/hazır/geri sayım, 10 gerçek soru, ağ kopması/yeniden bağlanma, sunucu sonucu/ödül ve tekrarın çift XP vermemesi |
| `user-data-security-local.mjs` | 12 grup PASS — SQL ve gerçek HTTP kimlik/veri izolasyonu, yetkisiz anahtar/REST erişiminin reddi ve oturum kapanışı |
| Hesap silme HTTP kabulü | 12 kontrol PASS — aşağıda |
| Kanonik SQL ve Google Auth SQL | PASS — yalnız izole şema/yerel ortam |

Mevcut entegrasyon betikleri izole hedefe uyarlanırken yalnız API portu, Docker proje adı ve özel fixture dosya konumları değiştirildi. Protokol/assertion beklentileri gevşetilmedi. Fixture dosyaları, e-postalar, parolalar, JWT'ler ve sunucu anahtarları Git'e eklenmedi. Live testinin eski “15-second” günlük etiketi zamanlama kanıtı olarak kullanılmadı; güncel sunucu 10 saniyelik kodu ve regresyonları esas alındı.

Hesap silmede gerçek 8 karakterli parola ile oturum açıldı; 7 karakterli parola değişimi reddedildi, farklı geçerli 8 karakter kabul edildi. Kapalı özellik başarısız döndü; yanlış parola, farklı actor ekleme ve gerçekten süresi dolmuş yerel imzalı JWT reddedildi. Başarılı HTTP silmesinden sonra Auth/profil/session/refresh kayıtları yoktu; eski giriş ve refresh başarısızdı; eski istek tekrarında sahte başarı dönmedi. Diğer sentetik hesabın tam profil hash'i aynı kaldı ve giriş yapabildi; ardından o fixture da aynı doğrulanmış silme akışıyla temizlendi.

İlk silme denemesi Storage kapalı test ortamındaki eksik `storage.s3_multipart_uploads` tablosunda güvenli biçimde durdu. İzole projede gerçek Storage servisi başlatıldı ve test yeniden geçti. Bu bir üretim değişikliği değildir. Dosya sahipliği/gerçek dosya silme transferi ve Google OTP üzerinden silme bu yeni yerel HTTP kabulünde sınanmadı; boş sahiplik kümesi kullanıldı.

## Soru bankası doğruluğu

Bütünlük: 1.500 benzersiz v73 soru, dört seçenek, geçerli tek cevap anahtarı, açıklama/kaynak, güncel kategori/zorluk ve 30 anlam sorusunun koruması testlerden geçti. Bu teknik “tek anahtar” kontrolü her sorunun dinî açıdan tek tartışmasız cevabı olduğunun bağımsız onayı değildir.

Önceki ikinci tur dosyalarında 1.500 bireysel kayıt/kaynak karşılaştırması, v72'ye göre 1.039 düzeltme ve kalan 171 inceleme uyarısı kaydedilmiş. Üç sınırlayıcı çeldirici 25→0; üç olumsuz çeldirici 4→0. Bilinen bloke soru 0 olarak kayıtlı; bağımsız uzman onayı **0**. Bu oturumda 1.500 pasaj yeniden okunmuş gibi raporlanmadı. Eski editoryal raporların `activeVersion:72`/`releaseEnabled:false` etiketleri arşiv durumunu anlatır; güncel aktivasyonun kaynağı PR #15/#16'dır.

## Yayın engelleri ve öncelikler

| Öncelik | Konu | Gereken |
|---|---|---|
| Düzeltildi | Activity yenilenmesi sonrası global router çökmesi | Önceki iki APK’da native crash görüldü. `useRouter()` düzeltmesinin yeni APK’sında 3 Activity yenileme/dış bağlantı/başlat/çıkış regresyonu PASS; eski hatalı binary kullanılmaz |
| P0 | Play politika ve erişim formları tamamlanmadı | Uygulama kaydı kullanıcı tarafından oluşturuldu. Hesap türü/kimlik doğrulaması/üretim erişimi bağımsız panel kontrolüyle doğrulanmadı. IARC, hedef kitle, Data Safety ve erişim formu tamamlanmadan gönderim yok |
| P0 | Store kabul kapısı kapalı | `approved:false`, `acceptedApkSha256:null` korunur. Emülatör fiziksel kabul yerine yazılmaz. Kanıtların incelenmesi ve mevcut kabul koşuluna ilişkin açık ürün sahibi kararı gerekir |
| P0 | Tam tester erişimi kabulü yok | Misafir solo çalışır. Google yeni kayıt kapalı; yeni test kullanıcılarının mevcut hesap/izin akışı somutlaştırılıp gerçek native OAuth ve hesap izolasyonu doğrulanmalı. Genel signup/push bu amaçla sessizce açılmamalı |
| P1 | Hedef kitle/politika kesinleştirmesi | Son kullanıcı açıklaması: **ana hedef yetişkinler, çocuk odaklı ürün değil; okuyabilen çocuklar da oynayabilir**. Bu, otomatik “çocuk hedefli” kabul edilmedi. Play yaş grupları henüz seçilmedi; mevcut “Çocuklar İçin” kartı/çocuk görsellerinin beyanla tutarlılığı incelenmeli. Çocuk yaş grubu ayrıca hedeflenirse Families veri/API/sosyal yetişkin kontrolü şartları doğrulanmadan uyum iddiası kurulamaz |
| P1 | Native ses/push/iOS kabulü | Başsız emülatörde duyulma/ahenk ölçülmedi. Genel push kapalı, iOS APNs/üyelik yok; bu kabul tamamlandı denmedi |
| P1 | Bağımsız içerik ve sağlayıcı saklama incelemesi | 171 otomatik uyarı birer hata değildir; bağımsız dinî uzman kabulü ve sağlayıcı bağımsız log süreleri kesinleşmedi |
| P2 | Çok büyük yazıda uzun sayfalar | Erişilebilir metin korunur, kartlar alt alta ve sayfa kaydırılabilir; bar haricinde font büyümesi kapatılmadı |

Native ek kontrolde yakalanan router çökmesi yeni binary’de tekrar sınandı: 320 dp/%200/koyu, 360 dp/%100/açık, 390 dp/%150/koyu durumlarının üçünde oyuna giriş/çıkış çalıştı ve crash buffer temizdi. Fiziksel cihaz veya bütün olası Activity durumları için garanti verilmez.

## Mağaza dosyaları ve sonraki adım

- `store/google-play/tr-TR/listing.json`: gerçek özelliklerle güncellenmiş başlık/kısa/tam açıklama; soru havuzu büyüklüğü tanıtımı yok.
- `assets/store/play-store-icon-512.png`: onaylı ikon değişmedi.
- `store/google-play/tr-TR/feature-graphic-1024x500.png`: onaylı ikon değiştirilmeden oluşturulmuş 1024×500 tanıtım kompozisyonu; gerçek uygulama ekran görüntüsü diye sunulmaz.
- `store/google-play/tr-TR/data-safety-draft.md`: veri toplanmıyor beyanı yapılmaz; e-posta/hesap/sosyal/oyun/token/teknik veri ve sağlayıcı rolleri taslaktır, Console onayı değildir.
- Gizlilik ve hesap silme web URL'leri erişilebilir. Adaydaki düzeltilmiş metin henüz Production'da değildir.
- Reklam SDK'sı/işlevi bulunmadı; **“reklam yok” taslak beyanı** nihai paket ve işletme kararıyla teyit edilmeli. IARC derecesi tahmin edilmedi.
- Ülke seçimi, tester grubu, uygulama erişim talimatları, Play App Signing ve güvenli upload-key saklama henüz Console'da kaydedilmedi. Test hesabı şifreleri kaynak deposunda paylaşılmaz.
- Yeni kişisel geliştirici hesabı koşulu uygulanıyorsa **en az 12 testerın kesintisiz 14 gün opt-in'i** gerekir; hesap türü/tarihi doğrulanmadığından bu hesaba kesin uygulanıyor denmedi. Davet listesine eklemek opt-in değildir; süre başlamadı.
- AAB, Play yüklemesi, Pre-launch report, opt-in URL'si ve final gönderim **yok**. Henüz oluşmamış bir rapora PASS verilmez.

Sıra: aday APK/kanıt incelemesi → yaş/hedef kitle ve Console kayıt/formları → güvenli tester hesabı ve native OAuth kabulü → kabul kapısı için somut insan kararı → izin verilirse aynı adaydan production profiliyle imzalı AAB → paket/manifest/imza/16 KB tekrar denetimi → ayrı yükleme/gönderim onayı → Google Pre-launch report incelemesi → kapalı tester opt-in takibi. EAS APK test bağlantısı Google Play dağıtımı değildir.

## Resmî kaynaklar (30.10.2026 kontrol edildi)

- [Hedef API: 31.08.2026'dan itibaren yeni uygulamalar API 36+](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Yeni kişisel hesaplarda kapalı test ve üretim erişimi](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Hedef kitle beyanı; her yaşta kullanılabilir olmak ile hedeflemek ayrımı](https://support.google.com/googleplay/android-developer/answer/9867159)
- [Families veri/API ve sosyal kontrol şartları](https://support.google.com/googleplay/android-developer/answer/9893335)
- [Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469)

## Arayüzün ana sürüme alınması

Kullanıcının sonraki açık talimatıyla PR #14 main’e birleştirildi: **`89ed63edc5818ba5eb2054a0cd7fabfb415b07c6`**. Profil/kategori/ayarlar gibi önceki UI çalışmaları zaten main’deydi; kalan renkli ana sayfa, skor görünümü ve köke bağlı gezinme de eklendi. PR #13 taslak Google kodu bu UI merge’üne dahil edilmedi. Main için 351/351 yerel test ve güncel PR başlığının bütün GitHub kontrolleri PASS. Android kapalı test raporundaki ek yamalar/mağaza hazırlığı ayrı PR’dadır. Bu ana sürüm izni, AAB veya Play son gönderim onayı yerine kullanılmaz.

### Main/Vercel yayın doğrulaması

PR #14 merge SHA `89ed63edc5818ba5eb2054a0cd7fabfb415b07c6` için GitHub Vercel status **success**: https://vercel.com/ozgeilis-6528/anla-ezberle-quiz/6fwBdzsT3L9ssQR89yDhnRqCLvMr . Mevcut Production adresinde gerçek Chrome ile sayfanın asenkron içeriği hazır olana kadar beklenip Ana Sayfa, Kategoriler, Profil, Rozetler, Ayarlar, misafir Inbox ve oda kapısı olmak üzere 7 rota açıldı; yatay taşma/pageerror görülmedi. `compact-home` ve renkli günlük kart bileşeni doğrulandı. İlk ağ-idle yakalamaları içerik yüklenmeden alınmıştı; görsel kabul sayılmadı, içerik hazır kontrolüyle yenilendi. Production ana sayfa görüntüsü `screenshots/production-home.png`. Kullanıcı hesabı açılmadı/değiştirilmedi.

Kapalı test adayının ek Auth/SDK/mağaza değişiklikleri [taslak PR #17](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/17) içinde kaldı. Bu taslağın Vercel Preview durumu başarılı; taslak PR için tüm GitHub Actions çalışmış gibi gösterilmez. Ayrıntılı yerel kontroller ve gerçek APK SHA'sı yukarıdadır.

### Güncel main ile çakışmasız aday

PR #17, yayımlanan main ile normal merge üzerinden uzlaştırıldı. Tek çakışma hesap silme ekranındaki `Tap` importuydu; Google yeniden doğrulama arayüzünün kullandığı import korundu. Güvenli silme backend’i değiştirilmedi. Test edilmiş APK kaynak SHA’sı ile uzlaştırılmış head’in `src`, `assets`, uygulama/derleme/bağımlılık/config/Supabase dosyalarının Git ağaçları aynı: `artifact-evidence.json`. Bu yüzden sırf birleştirme geçmişi/rapor için yeni APK üretilmedi; yeni bir binary kabulü de iddia edilmedi.

### Play Console kaydı ve yükleme dosyaları

Ürün sahibi uygulama kaydını oluşturup uygulama panelini açtığını bildirdi (30.10.2026). Bu oturumda Console’a bağımsız erişim yok; kayıt ve beyanlar araçla doğrulanmış sayılmaz. Mağaza metinleri, 32-bit simge, 24-bit tanıtım ve altı gerçek 1080×1920 Android 16 ekranı yüklemeye uygun dosya paketine ayrıldı. `store/google-play/tr-TR/screenshots-manifest.json` kaynak son APK’yı ve değişmeyen RGB piksellerinin hash’lerini belgeler. Uygulama kaynakları, oyun kuralları ve canlı veriler bu paket adımında değiştirilmedi.

Yeni ekranlar Ana Sayfa, Kategoriler, Quiz, Sonuç, Profil ve Rozetler’i gösterir. Sonuçtaki 8 doğru/1 yanlış/1 cevapsız gerçekten oynatılan yerel turdan gelir; profil ilerlemesi bu emülatördeki tamamlanmış turlardır. Fiziksel Samsung testi veya gerçek kullanıcı kaydı olarak sunulmaz. Eski kanıt görüntüleri mağaza oranına uymadıkları için yükleme paketine alınmadı.
