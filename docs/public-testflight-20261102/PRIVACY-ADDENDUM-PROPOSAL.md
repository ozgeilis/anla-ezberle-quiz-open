# Gizlilik politikası ek metni — incelemeye hazır öneri

**Uygulanmadı / yayımlanmadı.** 30 Ekim tarihli mevcut politika ve Android AdMob
test açıklamaları korunacak. Aşağıdaki ekler yeni temizleme migration'ı canlıda
doğrulandıktan sonra güncel davranış olarak yayımlanabilir. Main/Vercel yayını
ayrı onay gerektirir. Mevcut IPA build3'ün gömülü politika metni değiştirilmedi;
yalnız web sayfasını güncellemek bu gömülü metni değiştirmez. Uygulama içi metnin
aynı güncellemeyi alması yeni numaralı JS paketi/IPA değerlendirmesi gerektirir.

## Çevrimiçi hizmet için işlenen veriler — Google paragrafından sonra

Apple ile Giriş kullanılabildiğinde Apple hesap kimliği, izin verdiğin e-posta
ve ilk girişte paylaşılabilen ad bilgileri Supabase üzerinden kimlik doğrulama
amacıyla işlenir. E-postamı Gizle seçilirse Apple'ın oluşturduğu özel iletim
adresi kullanılabilir. Apple parolan uygulamaya aktarılmaz. Bu beta sürümünde
Apple ve Google ile yeni hesap kaydı sunucudaki test izinleriyle sınırlıdır;
TestFlight bağlantısına katılmak bu izinleri açmaz. Hesapsız oyun kullanılabilir.

## Kimler görebilir? — bölümünden sonra yeni bölüm

### Oyuncu güvenliği ve şikâyetler

Etkin olduğunda engelleme ilişkileri, arkadaşlık isteği ve oyun daveti göndermeyi
sınırlamak için saklanır. Şikâyette şikâyetçi ve hedef hesap kimliği, neden kodu,
isteğe bağlı açıklama, hedef oyuncunun görünen adı/kullanıcı adı kopyası, zaman,
inceleme durumu ve moderatör kararı kaydedilir. Açıklamaya parola, doğrulama kodu
veya gereksiz kişisel bilgi ekleme. Şikâyet ve denetim kayıtlarına yalnız yetkili
moderatör erişebilir; şikâyetçi kimliği hedef oyuncuya gösterilmez. İtiraz ve
destek için kovynelstudio@gmail.com kullanılabilir. Engelleme ve şikâyet etmek
hesabı, XP'yi veya oyun geçmişini kendiliğinden silmez.

## Hesabını silmek — yeniden kimlik doğrulama paragrafına ek

Desteklenen Apple hesabında güncel Apple doğrulaması kullanılır; Apple-only
hesaptan uygulama parolası istenmez. Apple yetkisinin iptali güvenli sunucu
akışında tamamlanmadan hesap silindi olarak gösterilmez. Ağ hatasında işlem
durumu kontrol edilerek güvenli yeniden deneme sunulur.

## Saklama ve teknik sınırlar — bölümüne ek

Hesap silindiğinde bu hesaba doğrudan bağlı şikâyetlerdeki serbest metin ve
ad/kullanıcı adı kopyaları ile ilişkili moderasyon notları temizlenir. Aynı
notun sosyal kısıtlama gerekçesi kopyası da temizlenir; diğer oyuncuların
kısıtlaması bu işlemle kaldırılmaz. Silinen hesabın kimlik bağlantıları kaldırılır.
Kararların neden kodu, durumu ve zamanları gibi asgari denetim kayıtları yetkili
inceleme için kalabilir. Kayıt başka bir oyuncuyla hâlâ ilişkiliyse tümüyle
anonim olduğu söylenmez. Hesap kullanımdayken bu kayıtlar için otomatik süreli
silme henüz uygulanmıyor; saklama ve silme talepleri destek adresinden izlenir.
Sağlayıcıların bağımsız güvenlik loglarının kapsamı mevcut politikadaki teknik
sınırlar bölümünde açıklandığı gibidir.

## İsteğe bağlı reklam testi — ilk paragrafına ek

Bu iOS TestFlight adayında reklam talebi ve uygulama takibi etkin değildir;
Google Analytics veya Firebase Analytics açılmamıştır. Android reklam testine
ait mevcut açıklamalar yalnız ilgili Android test sürümleri için geçerlidir.

## Yayın öncesi doğrulama

- Yeni migration ve gerçek silme sonucu doğrulanmadan bu metni canlı davranış
  gibi yayımlama.
- Mevcut politika bilgilerini ve Android reklam açıklamalarını koru.
- Tarihi gerçek yayın gününe göre güncelle.
- Web/iOS gömülü politika farkını açıkça değerlendir; eski IPA'nın kendiliğinden
  güncellendiğini iddia etme.
- Veri saklama süresi hakkında uygulanmayan otomatik silme veya kesin hukuki
  uygunluk garantisi verme. Gerekirse hukuki değerlendirme ayrıca yapılır.
