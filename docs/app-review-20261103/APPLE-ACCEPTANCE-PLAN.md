# Yeni iOS yayın adayı — dar Apple kabul planı

3 Kasım 2026. **Henüz onaylanmadı ve uygulanmadı.** Bu plan mağaza yayın
izni, genel Apple kaydı, main merge veya hukuki beyan değildir.

## Salt okunur önkoşullar

- Yalnız Frankfurt `mqyuihiobkomjfipxehj`; Team `W7CRC43SHP`, native audience
  `com.kovynelstudio.anlaezberle`.
- Supabase Apple sağlayıcısı kapalı; kayıtlı Client IDs yalnız kalıcı Bundle ID.
  Allow users without an email kapalı. E-posta doğrulaması ve kayıt hook'u korunur.
- Apple oauth/deletion/revocation/signup flag'lerinin dördü false; Apple identity,
  etkin geçici Apple kayıt izni ve silme işi yok.
- Google OAuth/deletion true, Google signup false. Genel e-posta kayıt ve
  mevcut hesap silme hizmeti true. Bunlar bu kabulde değiştirilmez.
- `before_google_user_created` kaynak MD5 `7db2b669f77266fdf8a62e9b076145f7`,
  definition MD5 `086c0d25935427c53c6da988f1706c5b`.
- account-delete sürüm 13, artifact SHA
  `e930225cb036118f15aa44d157f6a87eb6df43107b9c51322329651abebeb6ad`.
  Sunucudaki 8 dosya yerel kaynakla birebir eşleşti. Yeniden deploy gerekmez.
- `anla-apple-deletion-retention` etkin, `*/5 * * * *`; command MD5
  `1ef78306ef824bcdfb5d61378821da87`. Mevcut anahtar ve cron korunur.
- Oyuncu güvenliği true, etkin moderatör 1; public tablolarda RLS eksiği 0.
- Özel Apple anahtarı/token/ciphertext okunmaz, dışarı çıkarılmaz. Mevcut sunucu
  secret adları ve kapalı silme flag'i işlem öncesi ayrıca kontrol edilir.

Her önkoşul işlem anında tekrar karşılaştırılır. Kaynak, hesap veya ayar sapmasında
işlem durur; bu belge sapma üstüne yazma izni vermez.

## Yalnız kontrollü gerçek iPhone kabulü

1. Reklamlı native adayın izin/SDK eşleşmesi, public istemci config'i ve otomatik
   kontrolleri geçmeli. Yalnız mevcut sertifika/kimlikle, cihazdaki uygulama
   silinmeden yerel kabul güncellemesi hazırlanır; eski Build 4 korunur.
2. Sahibinin açık onayı alındıktan sonra native Apple provider yalnız mevcut
   audience ile açılır. Yeni key, web Services ID/callback veya provider secret
   üretilmez. E-posta zorunluluğu/nonce doğrulaması gevşetilmez.
3. Apple oauth/deletion/revocation true ve mevcut Edge
   `APPLE_ACCOUNT_DELETION_ENABLED=true` yapılır. **signup_enabled=false kalır.**
   İlk boş izin listeli denemede yeni kullanıcı kaydının reddi doğrulanır.
4. Sahibi Apple ekranında E-postamı Gizle seçeneğini ve kimlik doğrulamasını
   kendisi tamamlar. Yalnız uygulamanın relay adresi güvenli cihaz ekranından
   okunur. Aynı Apple aktörü/e-posta ile mevcut uygulama hesabı varsa durulur.
5. Yalnız bu adrese en fazla 7 günlük izin; **en fazla bir yeni geçici Supabase
   uygulama hesabı**. Apple hesabı silme kapsamına girmez. Genel Apple/Google
   kaydı açılmaz ve before-user-created hook'u kaldırılmaz.
6. Gerçek giriş, sunucu aktörü, profil/ana ekran, kapat/aç kalıcılığı, iptal ve
   tekrar giriş denetlenir. Mevcut e-posta/Google hesapları ve yerel ilerleme
   korunur; ikinci hesap oluşturulmaz.
7. Yalnız yeni geçici uygulama hesabında taze Apple kanıtı ve son silme onayını
   sahibi tamamlar. Parola istenmemeli. Yetki iptali → güvenli silme sırası,
   identity/session temizliği, şifreli geçici token kalmaması ve yerel oyun
   geçmişinin korunması doğrulanır. Ağ/retry arızası izole testte kalır;
   gerçek kullanıcı trafiğinde hata enjeksiyonu yapılmaz.
8. Geçici izin kaldırılır, provider/3 capability/Edge flag başlangıçtaki kapalı
   değerlere döndürülür. Başarısız silmede gerçek veya belirsiz hesap silinmez;
   iş güvenli biçimde bekletilir ve kalan durum raporlanır.

## Bundan ayrı, henüz kararlaştırılmamış yayın adımı

Kontrollü kabul tamamlanması genel Apple kaydını açmaz. App Store kullanıcılarının
Google'a eşdeğer Apple girişini kullanabilmesi için kalıcı provider/3 capability,
sunucu silme flag'i ve Apple-specific signup politikası ayrıca açık bir yayın
öncesi onay gerektirir. Bu planın sonunda bayraklar kapalıysa uygulama bütün
App Review Auth gereksinimlerini tamamlamış sayılmaz. Google Cloud Testing / yeni
Google kayıt sınırı da bu planla değişmez.

Bu kabul sırasında Alpha kanalı/binary/testçi listesi, kullanıcı XP/skor/geçmişi,
main/Vercel, App Privacy Publish, TestFlight dağıtımı ve App Store Production
gönderimi değiştirilmez. Ortak Apple capability'lerinin geçici değişmesi diğer
uyumlu istemciler tarafından görülebilir; mevcut e-posta/Google akışına izin
genişlemesi uygulanmaz.
