# Veri Güvenliği / hesap silme taslağı — yayımlanmadı

Kovynel Studio / Anla & Ezberle. Play Console’a gönderilmiş veya hukuken onaylanmış beyan değildir.

- Yerel solo kayıtları, XP/rozet, avatar, tema ve efekt tercihleri cihazda; otomatik rekabetçi puan aktarımı yok.
- Çevrimiçi kimlik/e-posta, profil, kullanıcı adı/avatar/görünürlük, arkadaşlık, bildirim, davet, maç/oda yanıt ve puanları Supabase ile işlenir. “Hiç veri toplanmaz” seçilmez.
- Ses kaydı yok. Kısa efektler ve tik cihazda sentezden üretilmiş dosyalardan oynatılır; mikrofon izni yok. Menü müziği kaldırıldı.
- Yeni hesap silme: Auth hesabı/ilişkili kişisel kayıtlar atomik silinir; kalan oyuncuların puanları korunur, ortak kayıtlardan silinen kişinin bağlantıları çıkarılır. Cihaz yerel geçmişi ayrı korunur. Bu süreç yalnız yerel sentetik hesaplarla doğrulandı; production etkin değil.
- Web silme yolu `/account-delete`, gizlilik bilgisi `/privacy` hazırlandı; mevcut Vercel adresinde çalıştığı deployment onayından sonra doğrulanmalı. Yayınlanmadan bu URL’ler çalışan silme hizmeti diye Play Console’a girilmez.
- Destek/veri sorumlusu iletişim adresi, operasyon/güvenlik logları ve yedek saklama süreleri, hizmet sağlayıcı silme prosedürleri, veri aktarımı/paylaşım sınıflandırması ve nihai politika metni ayrıca tamamlanmalı. Süre veya iletişim bilgisi uydurulmadı.

Resmî gereksinim: https://support.google.com/googleplay/android-developer/answer/13327111
