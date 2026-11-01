# Kalan hosted e-posta / native kabul — tek ek geçici hesap

Bu plan henüz izin değildir. Önceki iki yeni hesap sınırı tüketildi ve iki
hesap da sahibi tarafından güvenle silindi. Silinmeleri yeni hesap hakkı
oluşturmaz; aşağıdaki tek ek fixture için açık ayrı onay gerekir.

**Onay güncellemesi:** Kullanıcı 1 Kasımda yalnız bu tek ek hesap testini açıkça
onayladı ve hazır olduğunu bildirdi. Salt okunur önkontrolde bu adrese ait
hesap sayısı 0; mevcut gerçek hesap bulunmadı. Kayıt formu hazırlandı;
şifre/kayıt ve Gmail bağlantısını Chrome'a aktarma adımları kullanıcıya
bırakıldı. Sonuç aşağıda ve birleşik kabul kaydında ayrıca kaydedildi.

## Neden

Yerel SMTP → Chrome → native otomatik giriş geçti. Hosted kayıtta ise
bağlantı yaklaşık 10 dakika sonra açıldı; e-posta doğrulandı fakat PKCE flow
expired olduğundan session oluşmadı. Manuel şifreli giriş/kalıcılık geçti.
Bu gecikmiş deneme, geçerli yeni bir aynı cihaz koduyla hosted otomatik giriş
kabulü değildir. Süresi dolan kimlik kanıtını atlayarak oturum oluşturulmaz.

## Tam kapsam

- Yalnız Frankfurt'ta bir yeni geçici e-posta uygulama hesabı:
  `kovynelstudio+timer-auth-fresh-20261101@gmail.com`.
- Önce adresin uygulama hesabı bulunmadığını salt okunur kontrol et; varsa dur.
- Mevcut Android 14 emülatör QA APK'sında sahibi şifreyi kendisi girer.
  Şifre Git'e, loga veya sohbete yazılmaz. Google hesabı oluşturulmaz.
- Sahip iş Gmail'inde yeni posta gelince linki Mac'te açmadan emülatör Chrome'a
  aktarır. Hazırlık sırasında kayıt başlatılmaz; yeni kod kısa sürede kullanılır.
- Yeni şema, migration, Auth/provider/template/redirect ayarı yok. E-posta
  doğrulama, PKCE, rate limit, yeni kayıt kancası ve RLS aynı kalır.
- Chrome → uygulama cold start → sunucudan doğrulanmış aynı UID → otomatik
  Profil kontrol edilir. Force-stop/relaunch ve güvenli çıkış kontrol edilir.
- Replay/expired/missing hataları başarı sayılmaz. E-posta sunucuda
  doğrulanmış ama geçerli session yoksa yalnız gerçek duruma uygun güvenli
  giriş yolu gösterilir; sahte session oluşturulmaz.
- Test sonunda yalnız bu yeni geçici uygulama hesabı mevcut şifreli güvenli
  silme akışıyla, sahibinin son onayıyla silinir; kalan Auth/session/profil
  satırları kontrol edilir. Yerel tek oyunculu geçmiş korunur.

## Hariç

Main, Production, Alpha/AAB, testçi listesi, gerçek hesaplar, Google kaydı/
izin listesi, genel push, reklam/Analytics ve mevcut canlı güvenlik ayarları
değişmez. Bu gerçek Android emülatör testidir; fiziksel Samsung kabulü değildir.

Başarısızlıkta tekrar tekrar yeni hesap oluşturulmaz. E-posta teslimi veya
bağlantı aktarımı gecikirse mevcut test hesabında durulur; sonuç açık kaydedilir.
Yerel PKCE/TokenHash araştırması canlı şablon değişikliği onayı değildir.

## Gerçek test sonucu

Onaylanan tek fresh hesap 15:31:25 UTC'de oluştu. Sahip taze Gmail bağlantısını
Chrome'da açtı; sunucuda 15:32:44 UTC doğrulama ve 15:32:49 UTC giriş/session=1
görüldü. Uygulama cold start ile doğrudan Profilim'e döndü; tekrar şifre girişi
olmadı. Hesap ekranında tam yetkili fixture adresi ve doğrulanmış durum kontrol
edildi. Force-stop/relaunch aynı oturumu korudu. Bu gerçek hosted Android
emülatör kabulüdür; fiziksel Samsung veya iPhone kabulü değildir.

Kanıt: `../xp-notifications-20261101/hosted-fresh-email-native-result.json`.
Önceki gecikmiş bağlantıdaki `flow_state_expired` başarısız denemesi korunur.
Sahip mevcut güvenli şifre/SİL/silme akışını tamamladı. Uygulama giriş ekranına
döndü; sunucuda üç yetkili fixture hesabı 0, sahipsiz profil/session/identity 0.
Yerel 20 XP ve son skor 200 korundu. Dördüncü hesap izni yok.
