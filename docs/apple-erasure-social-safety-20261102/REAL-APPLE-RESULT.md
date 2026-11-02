# Gerçek iPhone Apple giriş / silme / yetki iptali kabulü

2 Kasım 2026. PR #26; **tek yeni geçici uygulama hesabı**, ayrı ürün sahibi
onaylarıyla sınırlandırılmış test. Apple hesabının kendisi silinmedi.

## Kaynak ve gerçek cihaz

- Runtime kaynak commit'i `4071a90074a594e9d80e02ab35d71bc63c2db551`;
  sonraki değişiklikler yalnız plan/kanıt belgeleridir.
- Fiziksel iPhone11 / iOS27.2. Team `W7CRC43SHP`, kalıcı
  `com.kovynelstudio.anlaezberle`. Mevcut Development identity/profile ile aynı
  uygulamanın üzerine kurulum; uninstall veya storage-clear yapılmadı.
- Hermes paketi SHA256
  `3d7b11b37e53de1cb332294051b03be1ca8b7fabcba0d26b5103e5c9e21852c4`;
  strict imza ve mevcut sertifika eşleşmesi geçti. Bu yerel kabul uygulamasıdır;
  yeni TestFlight yüklemesi veya dağıtılmış store build'i değildir.

## Tamamlanan gerçek testler

| Kontrol | Sonuç / kanıt |
| --- | --- |
| Boş Apple kayıt izin listesi | GEÇTİ. Native id_token isteği mevcut kayıt hook'unda403; kesin kapalı-test mesajı loglarda eşleşti. User/Apple identity oluşmadı. |
| E-postamı Gizle | GEÇTİ: sahibi uygulamaya özel relay adresini Apple ayarlarında açtı; tam adresin mevcut hesabı/identity'si yoktu. Yalnız o adres, en fazla7 günlük izinle kabul edildi. Adres kamuya açık rapora/Git'e eklenmedi. |
| Gerçek native Apple girişi | GEÇTİ. Yeni tek doğrulanmış Apple-only Supabase actor, bir session; uygulama parolası veya ikinci e-posta doğrulaması istenmedi. Uygulama ilk profil tamamlama ekranına döndü. |
| Güvenli oturum kalıcılığı | GEÇTİ. İşlem sonlandırılıp uygulama yeniden açıldı; sahibi tekrar giriş istemeden aynı profile tamamlama akışını gördü. Aynı actor/session sunucuda doğrulandı. |
| İptal ve tekrar giriş | GEÇTİ. Sahibi çıkış yaptı, Apple penceresini iptal ettiğinde giriş yapılmadığını bildirdi. İkinci giriş aynı actor/oluşturma zamanına döndü; kullanıcı/Apple identity sayısı1 kaldı. |
| Yeni hesap izninin daraltılması | GEÇTİ. Tek actor oluşturulduktan sonra exact relay izni kaldırıldı. Böylece silme sonrasında ikinci hesap oluşamaz; genel Apple signup hiç açılmadı. |
| Taze Apple kanıtı ile silme | GEÇTİ. Sahibi uygulama içindeki son SİL/Apple doğrulamasını tamamladı ve giriş ekranına döndü. Apple-only actor için sunucuda uygulama parolası yoktu. |
| Sunucu revoke-before-erase | GEÇTİ. Bu actor'un account-delete başlangıç/silme istekleri HTTP200 (deployment12). İncelenen akış Apple token exchange + revoke200 tamamlanmadan erasure çağırmaz; ağ/anahtar/kanıt hatasında silme yoluna geçmez. Güncel deployment13'ün8 dosyası aday kaynakla byte düzeyinde eşleşti. Tokenlar veya özel anahtarlar loglanmadı. |
| Cihazdaki Apple yetkisi | GEÇTİ. Sahibi Apple ile Giriş listesini yeniden açtı; Anla Ezberle kaydı görünmüyor. Kaydı kendisi manuel silmedi. Bu gerçek Apple kabulüdür; fixture sonucu yerine sunulmaz. |
| Sunucu temizliği | GEÇTİ. Geçici user, identity, session, refresh token, Apple deletion job ve admission sayıları0. Şifreli token işi kalmadı. |
| Yerel oyun ilerlemesi | GEÇTİ. Sahibi silme sonrasında seviye3, tamamlanan oyun5, toplam skor2100 değerlerini doğruladı. Gerçek Device Hub ekranında son skor200 ve3/82 rozet de görüldü. |
| Diğer hesap/oyun verileri | GEÇTİ. Diğer18 Auth hesabının ID/oluşturma özeti aynı. Skor31, arkadaşlık2, maç31, oda15 ve live reward16 satırlarının toplu içerik özetleri silme öncesiyle aynı. |
| Geçici yetkilerin kapatılması | GEÇTİ. Auth settings Apple=false; oauth/deletion/revocation/signup=false; Edge env false digest eşleşti. Admission/jobs0; test actor kaydı yok. Onaylı anahtar ve çalışan retention cron korundu. |

Makinece okunabilir kanıt: [hosted-real-apple-trial.json](hosted-real-apple-trial.json).
Gerçek cihaz görüntüsü özel yerel kanıt klasöründe tutulur; cihaz/hesap bilgileri
içerebilecek Apple ayarları ekranı kamuya açık repoya yüklenmez. Kaynak/migration,
anahtar veya şema bu kabul sırasında değiştirilmedi. Edge sürüm numaraları
başlangıç hazırlığınınv8 kaydını aşmıştır; gerçek başarılı istekler12, son kapalı
konfigürasyon13'tür. Güncel hosted dosya eşleşmesi ayrıca kontrol edilmiştir.

## Tamamlanmış sayılmayanlar

- Private Email Relay üzerinden gerçek iletilen e-posta teslimi **ÇALIŞTIRILMADI**.
  Gizli relay kimliğiyle native girişin başarısı e-posta teslim kanıtı değildir.
- Ağ/revoke/erase hata ve tekrarları izole imzalı-fixture HTTP/SQL testlerinde
  geçti; canlı Apple servisinde kasıtlı hata enjeksiyonu yapılmadı.
- Yetkili moderatör işletimi ve tam native report/block/unblock matrisi ayrı
  kabul bekliyor. Android yerel HTTP QA bağlantı hatası başarı olarak yazılmadı.
- Genel Apple rollout, PR #26 merge ve yeni TestFlight paket/dağıtım kabulü
  gerçekleşmedi. Store/TestFlight onay kapıları kapalı tutuldu. Bu sonuç bütün
  uygulamanın App Store'a hazır olduğu anlamına gelmez.
