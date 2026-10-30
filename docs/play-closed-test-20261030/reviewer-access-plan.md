# Play incelemeci erişimi — onay bekleyen sınırlı plan

30.10.2026 · [PR #20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20). **Henüz uygulanmadı.**

## Doğrulanmış durum

Frankfurt `mqyuihiobkomjfipxehj`, salt okunur kontrol: `registrationEnabled=true`, `accountDeletionEnabled=true`; Google OAuth ve Google hesap silme açık, Google yeni kayıt kapalı; sıralama açık. Oyuncu profillerinde RLS+FORCE RLS açık. `online_duel_enroll_test_user` anonim/normal istemciden çağrılamaz, service-role ile sınırlıdır. Genel push kapalı kalır. Kullanıcı kayıtları, e-postaları veya kimlikleri bu denetimde listelenmedi.

Play Uygulama Erişimi ekranı, tüm kısıtlı alanları açabilen yeniden kullanılabilir hesap ve İngilizce talimat istiyor. Misafir solo erişimi tam sosyal erişim olarak beyan edilemez. Henüz incelemeci hesabı sağlanmadı; form kaydedilmedi.

## Önerilen kapsam

1. Önce mevcut hesap çakışması ve erişim modeli kontrol edilir. Yeni oluşturulacak **en fazla iki** sentetik e-posta/parola oyuncu hesabı: bir incelemeci ve bir oyun karşılığı. İş e-postasının sahibince onaylanacak yalnız iki özel `+play-review...` takma adresi kullanılır; gerçek mevcut hesabın parolası değiştirilmez, gerçek hesap yeniden kullanılmaz.
2. Supabase'in desteklenen Auth Admin yöntemi veya Dashboard'un yeni kullanıcı akışı kullanılır; `auth.users` içine elle SQL INSERT yapılmaz. E-posta doğrulanmış test hesabı, oyun oyuncusu yetkisi; yönetici/billing/veritabanı rolü yok. Parola/anahtar çıktıda, Git'te veya APK'da tutulmaz. Gerekli Auth yönetim yetkisi yoksa işlem yapılmaz; kullanıcıya Dashboard adımı gösterilir.
3. Yalnız iki yeni oyuncunun profili hazırlanır. Genel signup, Google signup, push, RLS, şema, banka, Edge Function ve gerçek kullanıcıların kayıtları değiştirilmez. Sıralamaya katılım kapalı tutulur; test oyunları gerçek oyuncularla yapılmaz.
4. Bu iki hesapla gerçek e-posta girişi, arkadaşlık, düello/oda erişimi ve kullanıcı değişiminde izolasyon test edilir. Yeni APK için henüz yapılmamış Android/Google OAuth/fiziksel testleri yapılmış sayılmaz. Hesap silme testi veya üçüncü hesap bu plana dahil değildir.
5. Başarılı olursa yalnız incelemeciye ayrılan yeniden kullanılabilir oyuncu giriş bilgileri **Google Play Console → Uygulama Erişimi** özel alanına, İngilizce talimatla kaydedilir. Sohbet/mağaza açıklaması/Git'e konulmaz. Bu özel bilgi aktarımına da aynı kapsamda açık onay gerekir. Yeni kimlik bilgisi oluşturmanın UI'daki son adımı gerekirse hesap sahibine bırakılır.
6. Hesaplar inceleme ve kapalı test süresince erişilebilir kalır. İnceleme bitince erişimin kapatılması ve test verilerinin temizlenmesi ayrıca planlanır; gerçek hesap veya veriler silinmez.

## Risk ve geri dönüş

İki yeni sentetik Auth/profil kaydı ve test aralarındaki oyun kayıtları oluşur. Bilgileri bilen incelemeci bu iki oyuncunun verilerine erişir; diğer kullanıcıların özel verilerine erişmemesi mevcut sunucu kuralları ve izolasyon testiyle doğrulanır. Hata/çakışma halinde işlem durur; yalnız yeni test profilleri kapatılıp oturumları iptal edilebilir. Şema veya genel güvenlik politikası değiştirilmez. Hesap silme bu kapsamda değildir.

Bu onay **AAB kapısını açmaz**, main/Production yayını veya Play'e inceleme/kapalı test gönderimi anlamına gelmez. AAB kabul yöntemi ve nihai SHA/track gönderimi ayrı kararlardır.

Resmî kaynaklar: [Play uygulama erişimi](https://support.google.com/googleplay/android-developer/answer/9859455), [Supabase Auth Admin createUser](https://supabase.com/docs/reference/javascript/auth-admin-createuser).
