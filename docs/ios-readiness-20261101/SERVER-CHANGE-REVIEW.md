# Apple güvenliği için ayrı backend incelemesi — henüz dağıtılabilir değişiklik değil

Bu dosya uygulanacak değişiklik sözleşmesidir. PR #25 istemcisi hazırdır; aşağıdaki migration/Edge implementasyonu ve gerçek servis kabulü **henüz yoktur**. Üyeliğin etkinleşmesi bu işleri otomatik tamamlamaz. Apple provider ve üç capability bayrağı canlıda açılmadı. Yeni hesap testi izni verilmedi.

## Sıra ve değişiklik yüzeyi

1. Salt okunur drift kontrolü: `public.before_google_user_created(jsonb)` son gövdesi, hook bağlantısı, `online_service_capabilities`, Google config/izin listesi, `account-delete` dağıtım sürümü ve silme RPC'leri. Önceki 20 saniye/XP migration'ları değiştirilmez.
2. Yeni CLI migration'ı: `quiz_private.apple_auth_config` (tek satır; oauth/deletion/revocation/signup false), `apple_signup_test_allowlist` (normalize tam adres, en fazla 7 günlük test izni; başlangıçta boş), `apple_deletion_challenges` (rastgele UUID, actor, hash'lenmiş nonce, son kullanma zamanı, tüketim durumu). Tablolar private schema, FORCE RLS; anon/authenticated erişimi yok. Servis operasyonları dar RPC'lerle, sabit `search_path` ve açık rol grant'leriyle yapılır. Geçmiş kullanıcı/XP/oda satırları güncellenmez.
3. Mevcut hook genişletilir; ikinci hook sistemi kurulmaz. Güvenilir Auth `app_metadata.provider=apple` dalında üç güvenlik bayrağı, mevcut registration yeteneği ve süreli tam-adres izni birlikte gerekir. Google dalı aynı kalır. `user_metadata`, istemci rol/e-posta/ID beyanı yetki değildir. Apple relay adresi henüz bilinmiyorsa deneme reddedilir; wildcard relay domain izni veya genel signup açılmaz. İlk test için gerçek/relay adresinin sahibi tarafından kontrollü eşleştirilmesi planlanır.
4. `apple_auth_capabilities()` yalnız üç boolean döndürür; izin listesi, adres, Apple subject veya token döndürmez. Migration sonunda false kalır. Sunucu hook'u istemci düğmesinden bağımsız kısıtlama uygular.
5. Mevcut `account-delete/handler.ts` içine ek Apple proof dalı; `erase.ts` tek silme yolu olarak kalır. Ayrı ve istemciye güvenen ikinci silme servisi oluşturulmaz. Mevcut parola/Google OTP yolları ve request limitleri korunur.

## Apple silme ve yetki iptali protokolü

- `begin-apple-delete`: bearer JWT sunucuda `getUser` ile doğrulanır; anonim/Apple identity'si olmayan aktör reddedilir. Aktör ve Apple subject, güvenilir Auth identity kaydından okunur. Kullanıcının yeniden onayı için kısa ömürlü tek kullanımlık challenge/nonce oluşturulur.
- iOS native yeniden Apple doğrulaması; istemci yalnız bu silme niyetine ait taze authorization code/identity token/challenge ve açık `DELETE` onayını gönderir. Aynı hesap, state/nonce ve aktif işlem kontrolü istemcide de sürer; hesap değişiminde işlem iptal edilir.
- Edge, Apple token exchange'i **sunucu tarafında** yapar. Apple issuer, izinli kalıcı audience, imza/JWKS, süre, nonce ve subject doğrulaması zorunludur. Auth actor ↔ Apple identity ↔ Apple response eşleşmesi yoksa silme yoktur. Yalnız JWT payload'ını decode etmek yeterli değildir. Apple authorization code tek kullanımlık ve kısa sürelidir; replay/yarış için challenge atomik claim edilir.
- Gerekli Apple Key ID, Team, client ID ve `.p8` yalnız sunucu sırlarında tutulur. Native login için secret gerekmemesi, server revocation için anahtar gerekmeyeceği anlamına gelmez. Tarayıcıdaki yeni anahtarın son oluşturma/indirme adımı kullanıcı devri gerektirir.
- Apple revoke başarılı olmadan normal silme başarı sonucu verilmez. Apple ağ hatası/HTTP başarısı fakat yerel erase hatasında güvenli yeniden deneme tasarlanır. Retry için refresh token gerekiyorsa private şifreli job kaydı ve anahtar rotasyonu/TTL tasarımı ayrıca incelenir; plaintext token tablosu kurulmaz. Hatalar token, kod veya e-posta döndürmez. Geri dönüş veya kayıp durumda destek adımı açık olur; kullanıcı sonsuz beklemeye bırakılmaz.
- Aynı actor için mevcut `eraseAccount` temizliği ve `verify_account_deletion` kanıtı tamamlanır. Gerçek hesap testi/silme yok; yalnız ayrıca onaylanan sentetik hesap.

## Zorunlu testler ve canlı kapı

Yerel SQL/RLS: anon/authenticated private erişimi reddi; hook Google/e-posta regresyonu; Apple kapalı/izin dışı/süresi dolmuş kayıt reddi; metadata spoof; RPC veri sızdırmama; challenge süresi, replay ve aynı anda claim.

Edge: JWT yok/yanlış aktör/anonim, provider veya subject uyuşmazlığı, kötü imza/audience/issuer/nonce, eski kod, Apple iptal/ağ hatası, revoke sonrası erase hatası ve tekrar deneme, aynı cevabın iki kez silme başlatmaması. Mevcut Google/parola silme testleri yeniden çalışır. Mock test, Apple revoke servis kabulü sayılmaz.

Gerçek iPhone + izinli sentetik hesap: ilk/tekrar native Apple giriş; adın ikinci sefer null gelmesi; Hide My Email; relay SMTP teslimi; cold start kalıcılık; yanlış hesapla silme reddi; kendi hesabını silme ve Apple grant iptali. SPF/DKIM ve Apple relay gönderici kaydı ayrıca doğrulanır.

Somut migration ve Edge diff'leri, SHA256, local SQL/HTTP test kanıtı ve geri dönüş önce ayrı PR/plan incelemesine sunulur. Sonra sahibi canlı uygulama ve hesap kapsamını ayrıca onaylar. Bu belgede imzalı IPA veya canlı dağıtım onayı talep edilmez.

Kaynaklar: [Supabase Apple native Auth](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple), [Before User Created sözleşmesi](https://supabase.com/docs/guides/auth/auth-hooks/before-user-created-hook), [Apple hesap silme](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion), [Apple revocation](https://developer.apple.com/documentation/signinwithapplerestapi/revoke-tokens).
