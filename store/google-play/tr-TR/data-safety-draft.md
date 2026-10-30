# Data Safety çalışma formu — 30 Ekim 2026

**Taslak; Console'a gönderilmedi.** Ürün sahibinin son açıklaması yetişkin odaklı, çocuklara yönelik olmayan bir oyun olduğudur. Play hedef yaş beyanı henüz doğrulanmadı. “Hiç veri toplanmaz” seçilmemeli; kapalı test de Data Safety gerektirir.

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

- **Collected:** e-posta, kullanıcı kimliği, çevrimiçi ad/profil, oyun etkileşimleri ve izinli bildirim cihaz kimliği için evet. Amaçlar uygulama işlevi, hesap yönetimi ve güvenliktir; AdMob test adayında aşağıdaki reklam amaçları ayrıca eklenmelidir.
- **Shared:** hizmet sağlayıcı istisnası bütün işleme için otomatik “hayır” değildir. Expo/Google/Supabase/Vercel ve kullanıcının isteğiyle diğer oyunculara gösterilen alanlar, Google'ın form tanımıyla karşılaştırılmalı. Nihai paylaşım beyanı burada yapılmıyor.
- **Encryption in transit:** istemci uçları HTTPS/WSS kullanır. Bu, uçtan uca şifreleme veya veritabanında yönetici erişimi bulunmaması iddiası değildir.
- **Deletion:** mevcut güvenli akış Auth/ilişkili kişisel verileri siler; diğer oyuncunun puanını korur. Bağımsız yerel solo geçmişi ayrıca korunur ve açıklanır.
- **Religious beliefs:** kullanıcının inancı için form alanı yok. Quiz yanıtlarından böyle bir profil çıkarılmadığı işletme açısından teyit edilmeli; uygulamanın dinî konusu bu verileri beyan dışı bırakmaz.
- **Advertising ID / microphone / location:** AdMob test adayında AD_ID manifestten engellenir; reklam SDK’sının diğer tanımlayıcı/ağ işlemleri yine beyan edilmelidir. Mikrofon veya hassas konum istenmez; nihai binary ayrıca kontrol edilmeli.
- **Hedef kitle:** ürün sahibinin son açıklaması ana hedefin yetişkinler olduğu, uygulamanın çocuklara yönelik tasarlanmadığı ve okuyabilen çocukların da oynayabileceğidir. Bu açıklama otomatik çocuk-hedefli beyanına dönüştürülmez. Play yaş grupları ve mevcut çocuk kategorisi/görsellerinin beyanla uyumu henüz kesinleştirilmedi. Çocuk yaş grupları ayrıca hedeflenecekse yaş ayrımı, uygun SDK/veri işleme ve sosyal yetişkin kontrolleri doğrulanmadan Families uygunluğu beyan edilmez.

## Canlı kontrol ve iletişim

30.10.2026 salt okunur kontrol: sıralama ve hesap silme etkin; e-posta enrollment yeteneği açık; Google yeni kayıt ve genel push kapalı. Yeni üretim hesabı oluşturulmadı/silinmedi.

- Gizlilik: https://anla-ezberle-quiz.vercel.app/privacy
- Hesap silme: https://anla-ezberle-quiz.vercel.app/account-delete
- Destek: **kovynelstudio@gmail.com** (yayımlanması onaylı iş adresi)

HTTP erişimi, gerçek Google hesabı ile uçtan uca silme kabulü veya güncel çocuk gizliliği beyanı yerine geçmez.

Kaynaklar: [Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469), [Families](https://support.google.com/googleplay/android-developer/answer/9893335), [hesap silme](https://support.google.com/googleplay/android-developer/answer/13327111).

## AdMob test adayı — beyan farkı

Bu değişiklik PR #17’nin reklamsız APK’sından ayrıdır. Önceki mağaza dosyaları reklamlı binary için aynen kullanılmamalı. Henüz Play Console’a kaydedilmedi.

- Reklam içeren ve gerçekten test banner/interstitial sunan paket için **Reklam içeriyor: Evet** beyanı gerekir; resmî test birimleri gelir yaratmasa da “reklam yok” denmez. Varsayılan production profili reklamları kapalı tutar; gönderilecek nihai binary esas alınır.
- GMA Android 25.5.0 belgelerine göre SDK IP adresi (yaklaşık konum çıkarımı), ürün/reklam etkileşimleri, tanılama ve cihaz/hesap tanımlayıcılarını reklam, analiz ve sahtekârlığı önleme amaçlarıyla otomatik toplayıp paylaşabilir. Uygulamanın AD_ID iznini kaldırması bütün tanımlayıcıları veya teknik toplamayı kaldırmaz. App Set ID/diğer SDK davranışları nihai manifest/SDK ve form tanımlarıyla değerlendirilmelidir.
- Reklam testi isteğe bağlıdır; bilinmeyen yaş/18-altı için kapalıdır. Cihazda yetişkin beyanı, yerel test izni ve uygun UMP kararı olmadan GMA initialize/load çağrılmaz. Yaş sayısı/doğum tarihi, e-posta, yanıtlar, XP veya dinî kategori bilgisi reklam isteklerine eklenmez. Bu iki yerel tercih Supabase ile eşitlenmez.
- UMP bildirimleri/veri sağlayıcısı ve bölgesel mesajlar AdMob uygulamasında ayrıca yapılandırılmalıdır. EEA/BK/İsviçre onayı ve Türkiye KVKK bakımından aydınlatma/hukuki dayanak, yurt dışı aktarım ve ilgili kişi talepleri işletmeci tarafından ayrıca değerlendirilir; bu teknik entegrasyon hukuki uygunluk görüşü değildir.
- Reklamları kapatmak sonraki istekleri durdurur; Google’ın daha önce işlediği verilerin silinmesi veya kesin saklama süresi iddiası kurulmaz.

Kaynak: [Google GMA veri açıklaması](https://developers.google.com/admob/android/privacy/play-data-disclosure), [UMP](https://developers.google.com/admob/android/privacy), [Google gizlilik](https://policies.google.com/privacy).
