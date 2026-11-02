# Harici beta için kalan dar kabul planı

Bu belge henüz canlı yetki/özellik değişikliği onayı değildir. Mevcut build
0.1.0 (3), Connect'te **Ready to Submit**; Public Beta grubu mevcut. İletişim
bilgileri sahibi tarafından girilip kaydedildi. İnceleme gönderilmedi.

Sonraki gelişme: Sahip incelemeci bilgilerinin yalnız Apple'ın özel alanına
aktarılmasını onayladı; kayıt ve gerçek parola login/same-actor kontrolü geçti.
Tek kalıcı işletim hesabının oluşturulmasına ayrıca izin verdi; hesap oluştu ve
e-posta doğrulandı, güvenli giriş adımı bekleniyor. **Rol/bayrak izni verilmedi.**

Yerel işletim aracı ve kabul kanıtı [MODERATOR-CONSOLE.md](MODERATOR-CONSOLE.md).
Canlıda uygulanmamış dar operasyonlar:

- `enroll-owner-moderator.sql` SHA256
  `b49f335064022017d255a255870eb4e13b19922c646c0139666f1eb97f47bc36`
- `activate-player-safety.sql` SHA256
  `26e27ccb5e6c9e0bef9745c40ee8578f557fd65d0b8610ea8ea81bd08451cca6`

İki dosya izole DB'de mevcut fixture'ın gerçek Auth oturumu ve rollback
transaction'ında denendi: doğrulanmış sahip/oturum rol kontrolü, tek rol, bayrak
açma ve tekrar işlemde drift reddi geçti. Transaction sonunda önceki satırlar
geri geldi. Bu deneme hosted yetki veya canlı özellik etkinleştirmesi değildir.

## 1. İncelemecinin mevcut test hesabı

Önceden onaylanmış iki sentetik Play incelemeci hesabı sunucuda doğrulanmış
olarak mevcut. Yeni hesap veya parola üretmeden, yalnız `+play-review` hesabının
mevcut giriş bilgilerini Connect'in **özel Beta App Review / Sign-In** alanına
aktarmak için ayrıca izin istenir. Bilgiler Git'e, inceleme notlarına, herkese
açık beta açıklamasına veya sohbete yazılmaz. `+play-opponent` yalnız kontrollü
karşılıklı sosyal kabul testi için kullanılır. Gerçek oyuncular kullanılmaz.

Parolalar öncesinde/sonrasında değiştirilmez. Parolanın geçersiz olduğu veya
hesap sahibinin/kimliğinin beklenenden farklı olduğu anlaşılırsa durulur.
İncelemeciye Türkçe gezinme adımları ve hesap gerektirmeyen oyun akışı açıklanır.

## 2. Sahibe ait moderatör hesabı ve dar yetki

2 Kasım salt okunur kontrolde `kovynelstudio@gmail.com` için oyun hesabı yok,
aktif moderatör sayısı 0 ve güvenlik bayrağı false. Sahip şikâyetleri en az
günlük incelemeyi üstlendi. Hesap henüz varmış gibi rol verilmez.

Onaydan sonra sahip mevcut e-posta kayıt/doğrulama akışında kendisine ait tek
kalıcı işletim hesabını oluşturur; parolayı yalnız kendisi girer. Doğrulanmış
e-posta, tekil Auth UUID, anonim olmayan kimlik ve gerçek oturum kontrol edilir.
Bu kayıt bir geçici silme hesabı değildir. OAuth provider/kayıt hook'u açılmaz.

Yalnız bu doğrulanmış UUID, `quiz_private.moderators` tablosuna active=true
olarak alınır. Bu izin rapor kuyruğu ve audit'li `dismiss`, `warn`, `restrict`,
`restore` işlemleridir; Supabase proje/SQL/service_role yöneticiliği verilmez.
Kullanıcı metadata'sı yetki kaynağı değildir. Mevcut RPC gerçek `auth.sessions`
satırı gerektirir. Yetkisiz hesap RPC reddi ve sahibiyle kuyruk okuma denenir.

Yerel işletim aracı yalnız mevcut oturum + `moderation_review` RPC kullanacak;
service_role anahtarı içermeyecek. Parola/oturum günlüğü ve kalıcı tarayıcı
depolaması kullanılmayacak. İşletim kabulü yokken özellik açılmış sayılmaz.

## 3. Şikâyet/engelleme canlı kabulü

Önce mevcut private şema, RPC/Edge kaynakları ve config karşılaştırılır; sapmada
durulur. İncelemeye hazır kaynak dışında migration veya Edge dağıtımı yapılmaz.
Yalnız `quiz_private.player_safety_config.enabled=true` değişikliği önerilir.

**Bu bayrak ortak backend'e aittir:** uyumlu Android istemciler de güvenlik
özelliğini görebilir. Android Alpha kanalı, binary'si, testçi listesi ve yayın
durumu değişmez. Bu ortak backend etkisi ayrı onayın açık kapsamıdır.

Yalnız mevcut iki sentetik incelemeciyle: profil/uygunsuz ad reddi, şikâyet
gönderimi ve idempotency, yetkisiz kuyruk reddi, sahibiyle rapor görme/karar,
engelleme, karşılıklı istek/davet reddi, engeli kaldırma ve yeniden izin kontrol
edilir. Gerçek arkadaşlık/davetler test için değiştirilmez. Test öncesi ilgili
sentetik ilişkiler kaydedilir; test sonrası normal aksiyonlarla eski duruma
döndürülür. Test raporu audit'te saklanır, gerçek oyuncu raporu olarak sunulmaz.
Hesap, oyun, skor veya XP silinmez. Fiziksel iPhone kabulü ayrı etiketlenir.

Başarısızlıkta güvenlik bayrağı önceki false değerine alınır, yeni moderatör
active=false olur. Rapor/audit silinmez. Sorun çözülmeden harici beta gönderilmez.

## 4. Beta App Review ve Public Link

İncelemeci erişimi ve sosyal kabul geçtiğinde taslak review notları gerçek
sonuçlarla değiştirilir. Build 3 Public Beta grubuna bağlanır, `What to Test`
tamamlanır ve yalnız **Beta App Review** için gönderilir. Apple kararı beklenir.
Onaydan sonra link **Open to Anyone / 1000 kişi** olarak açılır ve gerçek URL
doğrulanır. Şu anda public link yoktur ve testçiler build 3'ü indiremiyor.

Apple/Google genel kaydı kapalı kalır; davetsiz katılımcılar hesapsız oyuna
başlayabilir. Yeni OAuth hesabının çalıştığı iddia edilmez. Provider açılması,
genel kayıt veya izin listesi genişletilmesi bu planın dışındadır.

## Kapsam dışında

App Store Production gönderimi/yayını, otomatik yayın/dağıtım ayarı, Android
Alpha işlemi, yeni build, yeni sertifika, RLS/hook azaltılması, gerçek reklam,
Analytics, genel push, kullanıcı verisi silme ve gerçek hesaplarla silme testi.
