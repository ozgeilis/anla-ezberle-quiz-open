# App Privacy karşılaştırması — beyan öncesi çalışma kâğıdı

Bu dosya Apple'a gönderilmiş son veri beyanı değildir. App Privacy formunun
güncel cevapları ve işletme uygulamalarıyla karşılaştırılmadan yayınlanmaz.
Kaynak: src/app/privacy.tsx, Auth, sosyal RPC/Edge, bildirim ve reklam modülleri;
Build 4'ün 17 native PrivacyInfo.xcprivacy dosyası ayrıca okundu.

| Veri / işlev                                       | Gerçek kapsam                                                                           | Apple formunda değerlendirme                                                                                 |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Yerel tur, XP, rozet, avatar ve tercihler          | Misafir cihaz kaydı; otomatik çevrimiçi XP aktarımı yok                                 | Yalnız cihazda kalan veriyi sunucuya toplanmış gibi beyan etme                                               |
| E-posta, sağlayıcı hesap kimliği, ad/kullanıcı adı | Supabase Auth ve çevrimiçi profil; hesaba bağlı                                         | Contact Info / Identifiers / User Content; app functionality, account management, linked to user             |
| Çevrimiçi yanıt, skor, maç, arkadaşlık ve davet    | Yetkili oyun/sosyal hizmet; hesaba bağlı                                                | Gameplay Content ve ilgili User Content/Usage Data alanlarını gerçek form tanımlarına göre eşleştir          |
| Şikâyet, açıklama ve moderasyon                    | Şikâyetçi/hedef kimlikleri, ad kopyaları, kararlar; özel moderatör erişimi              | Customer Support / Other User Content ve güvenlik amacı; hedefe şikâyetçi kimliği açıklanmaz                 |
| Push cihaz tokenı ve tercihleri                    | İsteğe ve sistem iznine bağlı; Expo/APNs/FCM, kapalı erişim                             | Device ID / app functionality; genel APNs kabulü yapılmadı                                                   |
| Teknik erişim/operasyon kayıtları                  | Vercel, Supabase, Auth e-postası sağlayıcıları                                          | IP, tanılama ve saklama kapsamı sağlayıcılarla teyit edilmeli; tüm loglar anında siliniyor deme              |
| Google / Apple                                     | Giriş kimliği ve izin verilen bilgiler; Apple relay mümkün                              | Sağlayıcıya veri aktarımı ve hesap silme açıklamalarıyla tutarlı olmalı                                      |
| Reklam / Analytics                                 | iOS adConfig Android-only; iOS talep kapalı, Analytics açılmadı                         | Android test açıklamalarını iOS'ta aktif reklam diye beyan etme; manifest tek başına ağ trafiği kanıtı değil |
| Dinî inanç çıkarımı                                | Kaynak kodda çıkarım/profil yok; sahibi de böyle bir işletme süreci olmadığını belirtti | Quiz konu içeriğini otomatik hassas inanç profili sayma; gelecekte çıkarım eklenirse yeniden değerlendir     |

Düzeltme: 17 manifestin üst seviye NSPrivacyTracking alanı tek başına yeterli
değildir. Gerçek GMA manifestinin Device ID alt kaydında
NSPrivacyCollectedDataTypeTracking=true bulundu. AppTrackingTransparency
istemi ve mikrofon izni yok. Bu nedenle bütün SDK davranışını takip yok olarak
onaylama. Ayrıntılı son karşılaştırma: [APP-PRIVACY-AUDIT.md](APP-PRIVACY-AUDIT.md).
Required Reason API manifestleri doğrulandı; nihai Nutrition Labels bunlarla
birlikte gerçek hizmet davranışına dayanmalıdır.

Hesap silme; hesap/profil, ilişkili sosyal veriler ve bağlı serbest şikâyet
metin/ad kopyalarını temizler, ortak maçlarda diğer oyuncunun puanı korunur.
Asgari karar kayıtları ile sağlayıcı operasyon loglarının kapsamı politikada
ayrıştırılmıştır. Yerel misafir geçmişi otomatik silinmez. RLS ve hesap kimliği
kontrolleri bu hazırlıkta değiştirilmedi.

3 Kasım HTTP kontrolü: /privacy, /account-delete ve /settings/help 200 döndü.
Hepsi aynı SPA kabuğunu verdi; bu sonuç render edilen politika/içerik veya
hesap silme işleminin uçtan uca kabulü değildir. Native politika Build 4'e
gömülüdür ve JS hash'i eşleşmiştir. Web tarayıcı kontrolü ayrıca tamamlanır.

Resmî rehber: https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/
