# Data Safety çalışma formu — 30 Ekim 2026

**Taslak; Console'a gönderilmedi.** Ürün sahibi hedef kitleye 13 yaş altını da dahil etti. Families incelemesi tamamlanmadan kesin beyan değildir. “Hiç veri toplanmaz” seçilmemeli; kapalı test de Data Safety gerektirir.

| Veri | İşleme / amaç | Sınır |
| --- | --- | --- |
| E-posta ve Auth kullanıcı kimliği | Supabase Auth; hesap yönetimi, doğrulama, güvenlik | Misafir solo oyun için giriş zorunlu değil |
| Görünen ad, kullanıcı adı, seçili avatar | Profil ve oyuncu bulma | Avatarlar paket içi; fotoğraf yükleme veya telefon rehberi izni bulunmadı |
| Arkadaşlık, davet, bildirim ve oda üyeliği | Sosyal oyun | Telefon rehberi toplanmıyor; uygulama içi sosyal grafiğin form veri türleriyle eşleştirilmesi doğrulanmalı |
| Maç/oda yanıtları, skor ve sıralama tercihi | Oyun işlevi ve hile önleme | Yerel solo XP otomatik sunucu puanına dönüşmez |
| Push tokenı, platform, oturum bağlantısı ve tercihler | İzinli telefon bildirimleri | Expo Push Service/FCM; genel gönderim kapalı, test sınırlaması korunur |
| Teknik erişim/hata/güvenlik kayıtları | Supabase, Vercel ve yapılandırılmış hizmet sağlayıcıların işletimi | Kesin iç log saklama süreleri teyit bekliyor |
| Yerel geçmiş, XP, rozet, tema, efekt tercihleri | Cihazda oyun devamlılığı | Hesaptan bağımsız yerel veriler otomatik çevrimiçi aktarılmaz |

Parola özel oyun tablosunda veya uygulama logunda tutulmaz; doğrulama Auth sağlayıcısındadır. Native pakette yönetici/service-role/OAuth secret bulunmamalı; gerçek binary ayrıca taranmalıdır.

## Form kararları ve açık inceleme

- **Collected:** e-posta, kullanıcı kimliği, çevrimiçi ad/profil, oyun etkileşimleri ve izinli bildirim cihaz kimliği için evet. Amaçlar uygulama işlevi, hesap yönetimi ve güvenliktir; reklam amacı kodda bulunmadı.
- **Shared:** hizmet sağlayıcı istisnası bütün işleme için otomatik “hayır” değildir. Expo/Google/Supabase/Vercel ve kullanıcının isteğiyle diğer oyunculara gösterilen alanlar, Google'ın form tanımıyla karşılaştırılmalı. Nihai paylaşım beyanı burada yapılmıyor.
- **Encryption in transit:** istemci uçları HTTPS/WSS kullanır. Bu, uçtan uca şifreleme veya veritabanında yönetici erişimi bulunmaması iddiası değildir.
- **Deletion:** mevcut güvenli akış Auth/ilişkili kişisel verileri siler; diğer oyuncunun puanını korur. Bağımsız yerel solo geçmişi ayrıca korunur ve açıklanır.
- **Religious beliefs:** kullanıcının inancı için form alanı yok. Quiz yanıtlarından böyle bir profil çıkarılmadığı işletme açısından teyit edilmeli; uygulamanın dinî konusu bu verileri beyan dışı bırakmaz.
- **Advertising ID / microphone / location:** reklam veya kayıt işlevi yok; devralınan izinler gerçek release manifestinde ayrıca kontrol edilmeli.
- **Hedef kitle:** ürün sahibinin son açıklaması ana hedefin yetişkinler olduğu, uygulamanın çocuklara yönelik tasarlanmadığı ve okuyabilen çocukların da oynayabileceğidir. Bu açıklama otomatik çocuk-hedefli beyanına dönüştürülmez. Play yaş grupları ve mevcut çocuk kategorisi/görsellerinin beyanla uyumu henüz kesinleştirilmedi. Çocuk yaş grupları ayrıca hedeflenecekse yaş ayrımı, uygun SDK/veri işleme ve sosyal yetişkin kontrolleri doğrulanmadan Families uygunluğu beyan edilmez.

## Canlı kontrol ve iletişim

30.10.2026 salt okunur kontrol: sıralama ve hesap silme etkin; e-posta enrollment yeteneği açık; Google yeni kayıt ve genel push kapalı. Yeni üretim hesabı oluşturulmadı/silinmedi.

- Gizlilik: https://anla-ezberle-quiz.vercel.app/privacy
- Hesap silme: https://anla-ezberle-quiz.vercel.app/account-delete
- Destek: **kovynelstudio@gmail.com** (yayımlanması onaylı iş adresi)

HTTP erişimi, gerçek Google hesabı ile uçtan uca silme kabulü veya güncel çocuk gizliliği beyanı yerine geçmez.

Kaynaklar: [Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469), [Families](https://support.google.com/googleplay/android-developer/answer/9893335), [hesap silme](https://support.google.com/googleplay/android-developer/answer/13327111).
