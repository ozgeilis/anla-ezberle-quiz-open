# Play incelemeci erişimi — onaylı sınırlı plan ve sonuç

30.10.2026 · [PR #20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20). **31 Ekim: kullanıcı açık onayıyla uygulandı.**

## Doğrulanmış durum

Frankfurt `mqyuihiobkomjfipxehj`, salt okunur kontrol: `registrationEnabled=true`, `accountDeletionEnabled=true`; Google OAuth ve Google hesap silme açık, Google yeni kayıt kapalı; sıralama açık. Oyuncu profillerinde RLS+FORCE RLS açık. `online_duel_enroll_test_user` anonim/normal istemciden çağrılamaz, service-role ile sınırlıdır. Genel push kapalı kalır. Kullanıcı kayıtları, e-postaları veya kimlikleri bu denetimde listelenmedi.

Play Uygulama Erişimi ekranı, tüm kısıtlı alanları açabilen yeniden kullanılabilir hesap ve İngilizce talimat istiyor. Misafir solo erişimi tam sosyal erişim olarak beyan edilemez. İncelemeci hesabı ve form sonradan aşağıdaki onaylı kapsamda tamamlandı.

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

## 31 Ekim uygulama kanıtı

- Onaylı iki takma adres çakışmasızdı; desteklenen Auth Admin API ile yalnız iki yeni, e-postası doğrulanmış sentetik hesap oluşturuldu. Mevcut `online_duel_enroll_test_user` RPC ile yalnız oyuncu erişimi verildi. `auth.users` için doğrudan SQL yazılmadı.
- Gerçek parola girişi iki hesapta başarılı; profil kimliği doğrulandı. İkisi de sıralamadan hariç (`leaderboard_opt_in=false`), Auth rolü yalnız `authenticated`. RLS+FORCE RLS korundu; genel push ve Google yeni kayıt kapalı, bu iki hesapta push tokenı yok.
- Edge API'de ek oyuncu kimliğiyle yapılan profil değiştirme isteği reddedildi. Karşı hesabın katılınmamış maçına erişim reddedildi. Bu sınırlar kapsamlı bir penetrasyon testi değildir.
- İkinci oyuncudan gerçek arkadaşlık isteği gönderildi, kabul APK'sında incelemeci giriş yapıp isteği kabul etti. Gerçek düello daveti kabul edildi ve maç başlangıç sayfası açıldı. İki test oyunculu gerçek oda kuruldu/katılındı, hazır/başlat akışı ve zaman aşımıyla sonuç ekranı doğrulandı.
- Diğer 15 Auth hesabının kimlik/e-posta/yasak durumu özeti ve diğer 14 oyuncu profilinin tam satır özeti önce/sonra aynıydı. Gerçek kullanıcı satırlarına yazılmadı. Puan tablosu başlangıç özeti test başladıktan sonra alındığından önceki tüm test dönemi için ayrı puan hash karşılaştırması iddia edilmez.
- İki hesabın parolaları ve İngilizce adım talimatları yalnız Play Console **Oturum açma bilgileri** özel alanına kaydedildi; yeniden yüklemede iki kayıt ve kapalı ek Google/iş ortağı cihaz paylaşımı doğrulandı. Parolalar sohbet/Git/mağaza metni/APK'ya eklenmedi; özel yerel dosya 0600. İncelemeye gönderim yapılmadı.
- Hesaplar inceleme için kalır; bu onay kapsamında silinmedi. Yeni hesap veya yetki artırımı yapılmadı.

Bu işlemler son APK kabulü değildir: ölçü değişimi testinde `player-inbox` Realtime aboneliğinin yeniden kurulmasında çökme bulundu. PR #20'ye `a506f87` düzeltmesi ve beş regresyon testi eklendi. Yeni `bc3c86f5` APK üzerinde18/18 gerçek emülatör ölçek/tema ve abonelik çökme regresyonu geçti; fiziksel kabul ve tam sosyal akış retesti yerine geçmez. Eski APK yayıma uygun kabul edilmedi. [Güncel native sonuç](native-retest-20261031.md).
