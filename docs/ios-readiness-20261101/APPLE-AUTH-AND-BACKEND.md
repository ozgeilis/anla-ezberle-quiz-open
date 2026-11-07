# Apple ile Giriş: hazırlanmış istemci ve kapalı sunucu planı

## Kodun şu anki sınırı

Resmî `expo-apple-authentication ~58.0.2` ve sistemin resmi 48 pt butonu iOS için eklendi. Android/web butonu yoktur. Native kullanılabilirlik + build opt-in + sunucu yeteneği birlikte gereklidir. `apple_auth_capabilities` şu an canlıda yoktur; bulunamaması giriş düğmesini gizler. Canlı Supabase provider, hook, RLS veya kullanıcı verisi değiştirilmedi.

İstemci rastgele state/raw nonce üretir, Apple'a SHA256 nonce gönderir; Supabase'e ham nonce ve Apple identity token gönderir. Sunucudan `getUser` ile doğrulanmış, aynı ID'li, Apple identity içeren ve e-postası doğrulanmış kullanıcı okunmadan ortak oturum kaydedilmez. Başka hesabın aktif olduğu veya işlem iptal edildiği durumda aktarım durur. JWT istemcide çözümlenerek güvenilmez; token ve provider hataları log/UI'ya taşınmaz. İlk girişteki ad yalnız boş `full_name` metadata alanına yazılır; yetki veya hesap birleştirme anahtarı değildir. Null adla önceki ad silinmez. Gizli e-posta Apple relay adresi olarak sunucunun kimliğiyle kullanılır; e-posta benzerliğiyle manuel birleştirme yoktur. Oturum mevcut SecureStore/session sahibiyle saklanır; çıkış mevcut yerel oturum/push temizliğini kullanır.

Bunlar kod/birim testi düzeyindedir. Gerçek Apple giriş, relay posta teslimi, hesap bağlama ve fiziksel kalıcılık testleri henüz yapılmadı.

## Apple hesabı doğrulandı — provider açılmadan önce kalan işler

1. Team ID ve üyeliği salt okunur doğrula; App ID kullanılabilirliğini kontrol et. Kalıcı öneri `com.kovynelstudio.anlaezberle`; geliştirme prototipi ayrı kalır.
2. Aynı App ID üzerinde Sign in with Apple capability, APNs ve provisioning hazırla. Özel anahtar Git'e/sohbete alınmaz. Native-only giriş için Supabase'in güncel dokümanı esas alınır; web OAuth da istenirse Services ID, dönüş URL'si ve süreli client-secret yönetimi ayrıca gerekir.
3. Supabase Apple provider audience listesine yalnız onaylı Bundle ID ekle; nonce kontrolünü kapatma. Mevcut Google provider/redirect ve parola güvenliğini koru.
4. **Önce** mevcut Before User Created hook'unu Apple için de kapalı test izin listesini uygulayacak şekilde genişlet. Mevcut hook yalnız Google yeni hesabını sınırlıyor; Apple provider'ı tek başına açmak bu sınırı aşabilir. Hook'u kaldırmak çözüm değildir. Kimlik bağlantısında mevcut Supabase doğrulanmış e-posta kurallarını test et; relay nedeniyle ayrı hesap ihtimalini açıkla, otomatik veri taşıma yapma.
5. **Önce** Apple hesabı silmeyi ve Apple grant revocation'ı hazırla. Mevcut `account-delete` Google OTP/parola yolları korunmalı. Apple authorization code sunucuda yalnız doğrulanmış aynı aktörle eşlenmeli, Apple token exchange/revoke çağrıları sunucuda yapılmalı; credential yalnız sunucu sırrı olmalı. Süre, replay, yanlış aktör, Apple yeniden doğrulama, ağ hatası ve revocation tekrar deneme/temizlik kaydı test edilmeli. Apple tokenını uygulama tablosuna açık metin veya istemciye koyma. Kimliği doğrulamadan silmeye izin verme. Apple-only kullanıcıdan olmayan uygulama parolası isteme.
6. Private config/RLS ve dar capability RPC taslağı: `appleOAuthEnabled`, `appleDeletionEnabled`, `appleRevocationEnabled` varsayılan false. Bu üç kabul server-side tamamlanmadan istemci butonu açılmaz. Kayıt izni ayrı, süreli test allowlist'ine bağlı olur; genel kayıt açılmaz.
7. Migration ve Edge diff/hash'lerini incelemeye sun; owner onayı olmadan canlıya uygulama. Bu PR canlı migration içermiyor; Apple Team/ID/revocation kimlik bilgileri bilinmediği için onaylanmamış bir auth yolu dağıtılmıyor.
8. En fazla açıkça izin verilen yeni sentetik hesaplarla Apple ilk/tekrar giriş, cancel, relay, mevcut e-posta hesabı, yanlış kullanıcı ve hesap silme/revoke kabulü. Şu anda yeni hesap testi yetkisi yok.
9. Kabulden sonra build ve capability kaydı güncellenebilir. `config/ios-store-approval.json` kapısı şu anda kapalıdır. Anahtar, Team, App Store kayıt veya dağıtım kararı bu PR'a verilmiş sayılmaz.

## Gerçek test matrisi (şimdilik ÇALIŞTIRILMADI)

- İlk native Apple hesabı → doğrulanmış Supabase session → Profil → cold start.
- İlk isim + relay adresi; ikinci girişte null isim; aktif mevcut profilin korunması.
- Cancel / ağ kesintisi / state-nonce uyuşmazlığı / çift dokunma / sign-out veya başka hesapla yarış.
- Provider kapalı, capability yok, izin listesi dışında yeni kullanıcı → güvenli ret.
- Email/Google aynı mevcut kimlik; Apple relay farklı kimlik → sessiz hesap birleştirmesi yok.
- Apple güvenli hesap silme + Apple grant iptali + mevcut Google/parola silme regresyonu.

Kaynaklar: [Expo SDK58 AppleAuthentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/), [Supabase Apple Auth](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple), [Apple hesap silme](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion).

## Gizli e-posta / ilk isim için ek kabul

Apple Private Email Relay'e posta gönderecek gerçek SMTP gönderen adres/domain kaynakları Apple hesabında kaydedilmeli ve SPF/DKIM doğrulanmalı; mevcut posta hizmetini sırf Apple testi için değiştirme. Native giriş için ikinci bir doğrulama e-postası istenmez, fakat hesap silme/iletişim kodlarının relay'e gerçekten ulaştığı kabul edilmeden Apple hesabı genel kayda açılmaz. [Apple relay yapılandırması](https://developer.apple.com/help/account/capabilities/configure-private-email-relay-service/).

İlk Apple onayı Supabase'te başarısız olursa doğrulanmamış ad/e-posta ayrı bir yerel kullanıcı kaydına kalıcı yazılmaz. Yeniden denemede Apple ad vermeyebilir; kullanıcı mevcut profil kurulumundan adını seçebilir. İsim kaybını gidermek için başka hesaba ait veriyle eşleştirme yapılmaz. Başarılı ilk girişte ad yalnız doğrulanmış kendi Auth metadata alanına yazılır; mevcut görünen profil üzerine otomatik yazılmaz.

## Devam hazırlığı

Üyelik ve Team `W7CRC43SHP` doğrulandı, kalıcı App ID sahibinin ayrı onayıyla kaydedildi. Sign in with Apple primary ve Push capability ayrı onayla kaydedildi. Apple revoke/APNs anahtarı oluşturulmadı ve Supabase provider açılmadı. Somut değişiklik yüzeyi ve kabul sırası [SERVER-CHANGE-REVIEW.md](SERVER-CHANGE-REVIEW.md) içindedir. Bu belge migration/Edge implementasyonunun veya gerçek Apple revoke testinin tamamlandığı anlamına gelmez.
