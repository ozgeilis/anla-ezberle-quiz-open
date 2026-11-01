# 20 saniye ve Auth düzeltme adayı — 1 Kasım 2026

Bu bir yayın tamamlandı raporu değildir. Ana sürüm, Play Alpha, Production,
Frankfurt veritabanı, gerçek hesaplar ve testçi listesi değiştirilmedi.
Aday `release/play-final-candidate-20261030` üzerindeki `31e1278` entegrasyonundan
ayrıldı; onaylı yeni logo dahil mevcut çalışmalar korunuyor. PR #13 açık;
#18 ve #20 hâlâ katmanlı sürüm çalışmaları. Main'e eski Auth kodu taşınmadı.

## Kök nedenler

- Tek oyunculu motor / kayıt doğrulayıcı / demo yalnız `timingVersion=1` ve
  10.000 ms kabul ediyordu. Canlı istemcinin varsayılanı 15, sunucunun yeni oda
  varsayılanı 10 saniyeydi; gerçek oda yanıtındaki süre kullanıldığında eski
  odalar doğru gösteriliyordu. Asenkron sunucu düellosunda soru süresi yoktu.
- Frankfurt'ta salt okunur kontrol: `googleOAuthEnabled=true`,
  `googleDeletionEnabled=true`, **`googleSignupEnabled=false`**.
  `before_google_user_created` yeni Google kullanıcısını reddediyor. Dolayısıyla
  Google Cloud test listesine eklemek tek başına yeterli değil. Önceki kurulum
  belgesindeki External/Testing kısıtı ayrıca korunmalı; güncel Cloud test
  listesi bu çalışmada yeniden okunmadı. Google doğrulaması için uygulamanın
  ayrıca bir kayıt doğrulama e-postası istemesi gerekmiyor.
- E-posta callback ekranı URL gelmeyince işlem başlatmadan yükleniyor metninde
  kalıyordu. Başarılı doğrulama otomatik yönlendirme yerine elle düğme bekliyordu.
  E-posta istemcisi PKCE kullanmıyordu; Google'a ait bekleyen giriş kaydı ayrıca
  e-posta dönüşünü yanlış Google akışına yöneltebiliyordu. Bunlar kodda saptanan
  kusurlardır; gönderilmemiş telefon fotoğrafındaki eksik parametrenin kesin
  cihaz düzeyi sebebi olduğunu iddia etmiyoruz.

## Yeni kurallar ve uyumluluk

- Yeni solo, günlük, kategori/öğrenme/zorluk/aşama ve demo turları: zamanlama
  sürümü 2, **20.000 ms**. Sürüm 1: değişmeden 10.000 ms; eski zamansız kayıtlar
  zamansız kalır. Puan/XP/rozet kuralları ve soru bankası değişmez.
- Kabul aralığı `[açılış, açılış+20s)`. Geç cevap bir kez cevapsız olarak
  kilitlenir; açıklama okuma süresi yeni sorudan düşmez. Demo yeniden açılışı
  geçen süreyi geri kazandırmaz. Sayaç aynı Clock nesnesini kullanır.
- Yeni canlı odalar: 20 sn cevap + mevcut 5 sn açıklama. Eski 10/15 sn odalar,
  başlamamış olsalar dahi kayıtlı sürelerini korur. Sunucudaki mevcut dinamik
  `answer_seconds` hesapları ve kilitten sonra saat okuma davranışı korunur.
- Yeni asenkron maçlar: maçta dondurulan 20 sn; oturumda sunucunun tuttuğu soru
  açılışı. Sunucu geç cevabı reddeder; `expire` veya güncelleme isteği cevapsızı
  yalnız bir kez kaydeder. Sonraki soru için yeni sunucu açılışı döner. İnceleme
  anahtarları iki oyuncu bitirmeden açılmaz. Eski maçlar, sonradan katılan
  rakip dahil, zamansız kalır. Maç sonu puanlama aynı kalır.
- Yeni zamanlı asenkron tur için istemci `timingVersion=2` bildirir. Eski
  istemci sayaç göstermeden böyle bir turu oynayamaz; sunucu güncelleme ister.
  HTTP gecikmesinin tamamı istemci sayacından ihtiyatlı biçimde düşülür;
  cevap kabulünde tek yetkili yine sunucudur. 24 saatlik maç davet süresi,
  ağ/güvenlik zaman aşımları ve heartbeat kuralları değişmez.

## Auth davranışı

`useAuthCallback` yalnız URL edinme, sınırlı bekleme ve doğrulama durumunu;
`verifyLink` kod/token doğrulamasını; ekran ise sunum ve recovery formunu yönetir.
Başlangıç URL'si ile Linking olayları birlikte ele alınır. Parametresiz ilk rota
sonradan gelen kodu tüketmez. Aynı kodun çift tesliminde tek exchange yapılır.
Web adresi işlenmeden önce geçmişten temizlenir; URL/kod/token loglanmaz.

Yeni e-posta istekleri güvenli depodaki PKCE doğrulayıcısını kullanır. Önceki
implicit fragment bağlantıları ve izin verilen email/recovery token-hash
bağlantıları da desteklenir. Sonrasında `getUser()` ile sunucu kimliği okunur;
OnlineProvider aynı kullanıcıyı gözlemlemeden başarı yönlendirmesi yapılmaz.
Şifre saklanmaz. Recovery sonucu normal onay akışından ayrı tutulur.

Eksik bağlantıda en geç 2 sn sonra açıklama; Auth HTTP isteğinde 15 sn sınırı;
callback görünümünde 35 sn bekleme sınırı ve yeniden deneme vardır. Başka
cihazda doğrulanan fakat bu oturumda PKCE bilgisi bulunmayan kullanıcıya
başarı uydurulmaz; güvenli giriş yolu gösterilir. Parametresiz tekrar ziyaret,
geçerli yerel oturum varsa profil ekranına döner.

## Google için kontrollü çözüm (uygulanmadı)

Ayrı migration boş, RLS korumalı ve en fazla 30 gün süreli özel izin tablosu
oluşturur. Hook kaldırılmaz; global kayıt bayrağı açılmaz. Yalnız sunucunun
OAuth'tan elde ettiği `user.email` ve `app_metadata.provider=google` kullanılır;
kullanıcının değiştirebildiği `user_metadata` yetki kaynağı değildir. Google
OAuth ve Google hesap silme önkoşulları kapalıysa izin listesi de yetmez.
İstemciler tabloyu okuyamaz/yazamaz veya hook'u çağırarak yetki kazanamaz.

Gerçek test için hem Google Cloud Testing listesinde hem özel sunucu izin
listesinde aynı, hesap sahibinin onayladığı test adresi gerekecek. Adresler,
parolalar, OAuth sırları ve test oturumları bu depoya eklenmez. Mevcut hesap
bağlama ve taze Google hesap silme kanıtı değiştirilmedi.

## Test durumu

Ayrıntılı güncel sonuçlar `acceptance.md` içinde tutulur. Mock testler gerçek
Google OAuth veya fiziksel cihaz kanıtı sayılmaz. Yerel Mailpit e-postası Gmail
veya canlı SMTP teslimi kanıtı değildir. Üretim değişiklikleri için
`rollout-plan.md` kapsamındaki ayrı onay gereklidir.

## Resmî başvuru kaynakları

- https://supabase.com/docs/guides/auth/native-mobile-deep-linking
- https://supabase.com/docs/guides/auth/sessions/pkce-flow
- https://supabase.com/docs/guides/auth/social-sign-in/auth-google
- https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook
- https://docs.expo.dev/linking/into-your-app/

Supabase changelog da incelendi. 10 Kasım TLS CBC kaldırımı bu değişikliğin
sebebi değildir; TLS 1.3 etkilenmiyor. Auth güvenliğini düşürecek TLS değişikliği
veya alakasız advisory düzeltmesi yapılmadı.
