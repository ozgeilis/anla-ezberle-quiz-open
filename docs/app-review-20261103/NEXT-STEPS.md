# Kalan kabul ve onaylar

Bu belge canlı değişiklik çalıştırmaz ve mevcut onayları genişletmez.

1. **Apple oturumu:** yenilendi. Türkçe ad/alt başlık/kategoriler ve sürüm metni
   kaydedildi; Build 4 taslağa bağlandı, manuel yayın seçildi. App Review'a
   ekleme veya gönderim yapılmadı. App Privacy, ekranlar, yaş/content rights,
   ücretsiz fiyat, ülkeler ve özel reviewer alanları ayrıca doğrulanacak.
2. **Giriş uygunluğu:** mevcut Google görünür, Apple capability cevaplarının
   üçü false. Genel Google kaydı false, Apple kayıt izinleri sınırlı. 4.8 ve
   çalışan kayıt/silme için bu durumun giderilmesi zorunlu. Bayrakları veya
   provider'ı kendiliğinden açma. Önce tam canlı kaynak/anahtar/cron/precondition
   karşılaştırması, sonra ayrı dar plan ve sahibi onayı; Apple signup hook/RLS
   korunacak. Mevcut süreli izin listesi genel yayın izni değildir.
3. **Gerçek Apple kabulü:** ayrı geçici hesap izni, fresh native proof,
   mevcut hesapla eşleşme, relay, iptal, kalıcılık, revoke ve güvenli silme.
   Önceki test hesabı silindi; yeni izin olmadan başka hesap oluşturma/silme.
   Apple private key, ciphertext veya token kanıt raporuna konmayacak.
4. **İncelemeci:** mevcut iki sentetik hesabın doğrulanmış ve etkin olduğu
   güncel sunucu kontrolünde görüldü. Taze parola girişi ve gerçek sosyal
   erişim kabulü gerekiyor. Parolalar yalnız uygulama ve özel App Review
   alanında kullanılacak, Git'e/rapora konmayacak. Yeni hesap gerekmiyorsa açma.
5. **Fiziksel cihaz:** sahibi artık hazır. iPhone 11'de mevcut sürüm 0.1.0 (2)
   bulundu; bu testi Build 4/TestFlight kabulü sayma. Mevcut uygulama/veriler
   silinmeden oynanış ve görsel kabul alınacak. Tam Build 4 exact paket kabulü
   ayrıca kalacak; sırf bu nedenle onaysız imzalama veya yeniden yükleme yapma.
6. **Mağaza:** gerçek iPhone 16 opaque ekranlar hazır; Build 4 iPad ekranları ve
   Connect yükleme kabulü bekliyor. Yaş anketi içerik bazında doldurulmalı,
   13+ hedefi otomatik derecelendirme değildir. iOS dağıtım ülkeleri sahibinden
   netleştirilecek. DSA'nın önceki In Review durumu son onay değildir.
7. **Kaynak:** bu branch PR28 + güncel main entegrasyonudur; runtime kaynakları Build 4 ile
   aynı olsa da final client env eksikliği yeni paket gerektiriyor. Main merge ayrı onay bekler. Başka PR/worktree, Android Alpha,
   sertifika, keystore ve test kanıtları korunur.
8. **Son adım:** bütün zorunlu kanıtlar tamamlanınca yalnız seçilen Build 4,
   metadata ve backend durumu için son App Review gönderim onayı istenir.
   Manuel yayın korunur; review onayı otomatik herkese açık yayın izni değildir.

HTTP 422 için tekrar döngüsü yok. Harici beta ve Production App Review ayrı
durumlardır. Mevcut destek kaydının gerçek yanıtı okunmadan neden tahmin edilmez.

Yeni görsel optimizasyonu ayrı worktree/PR olarak yürütülür; onaylı birleşim olmadan bu yayın adayına eklenmez ve başarılı Build 4/artifacts değiştirilmez.
