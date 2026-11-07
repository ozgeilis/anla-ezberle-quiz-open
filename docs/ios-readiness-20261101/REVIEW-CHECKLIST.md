# iOS yayın ve gizlilik denetimi — 1 Kasım 2026

Bu belge inceleme garantisi değildir. `Tamamlandı` yalnız kanıtlı kontroller için kullanılacak. Güncel [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) yayın öncesi yeniden kontrol edilmeli.

| Konu | Şu anki bulgu | Yayın öncesi işlem |
|---|---|---|
| Login Services 4.8 | Google birincil hesap giriş seçeneği var; eşdeğer mahremiyet seçeneği gerekliliği değerlendirildi. Native Apple istemcisi hazır, sağlayıcı kapalı | Apple gerçek giriş + relay + silme/revoke kabulü zorunlu; buton taslağı kabul sayılmaz |
| Hesap silme 5.1.1(v) | Mevcut e-posta/parola ve Google silme korunuyor. Apple-only yol henüz hazır değil | Apple yetki iptali dahil güvenli sunucu yolu; gerçek iPhone kabulü |
| Sosyal kullanıcı içeriği 1.2 | Görünen ad/kullanıcı adı ve davetler var; kod taramasında oyuncu şikâyet/engelleme/moderasyon işlemi bulunmadı | Kullanıcı içeriği filtresi, rapor/engelleme, yanıt veren moderasyon süreci ve iletişim; backend/ürün tasarımı ayrı onay gerektirir. Yayın engeli olarak tutuldu |
| Hesapsız temel oyun | Tek oyunculu/kategoriler/günlük oyun mevcut yerel altyapıyla ortak | Gerçek iOS kabulü ve review notunda hesabın zorunlu olmadığı açıkça anlatılacak |
| Reviewer erişimi | Gerçek hesap bilgisi verilmedi; yeni incelemeci hesabı oluşturulmadı | Sahibin onayladığı sentetik kalıcı hesap ve açık erişim adımları, yalnız Connect özel alanında |
| Dinî içerik | Ortak aktif v73; eski v72 geçmişi korunur. İçerik değişmedi | Kaynak doğrulaması bağımsız uzman onayı değildir; tartışmalı/yanlış dinî alıntı ve ayrımcılık riski 1.1 kapsamında editoryal kayıtlarla takip edilir |
| Yaş | Ürün hedefi 13+, çocuklara özel değil | Apple anketi gerçek sosyal/içerik/reklam davranışlarıyla doldurulacak; anket sonucu varsayılmadı |
| İşlevsellik 2.1 | Kapalı servisler/yetkisiz hesaplar çevrimiçi özelliği kullanamaz | İncelemeci için çalışır ortam, hata/cancel/boş durumlar; çalışmayan dekoratif buton yok |
| Privacy Labels | Supabase hesap/sosyal oyun kayıtları hesapla ilişkili. Yerel kayıtlar tek başına sunucuya aktarılmaz | Apple App Privacy alanlarını SDK/binary ve gerçek ağ davranışıyla sonlandır; otomatik “veri toplanmıyor” beyanı yapılmaz |
| ATT / IDFA | ATT paketi/prompt yok; iOS reklam modu off; Google SDK binary içinde kalır | SDK varlığından “izleme yok” sonucu çıkarma. IDFA erişimi/ağ akışını gerçek cihazda ölç. İzleme eklenirse önceden yeni tasarım/onay; şu anda gereksiz ATT istenmez |
| Privacy Manifest | Expo/RN/SDK manifestleri Pod kurulumuna dahil, RN aggregation açık | Nihai archive manifest/required-reason API raporu ve SDK imzalarını doğrula; simulator manifest kontrolü distribution doğrulaması değildir |
| Gizlilik URL | Mevcut /privacy Android reklam testi açıklamasına sahip | Aşağıdaki iOS metin önerisini onay sonrası yayımla; mevcut metinleri kaldırma |
| iPad | supportsTablet true korundu | Gerçek iPad simülatör düzeni, landscape/keyboard, split view ve mağaza görselleri kabulü tamamlanmadan iPad hazır denmez |

## Reklam / ses / push uygulama incelemesi

- `react-native-google-mobile-ads 17.4.0` New Architecture uyumlu. Paket iOS Google Mobile Ads 13.10.0 / UMP 3.1.0 bekliyor; Pod kilidiyle doğrulanacak. Ortak `config/admob.js` gerçek reklamları her zaman kapalı tutuyor. Yeni iOS profilleri ADS_MODE=off; mevcut Android test profilleri aynen kaldı. iOS sample App ID kullanılır, gerçek iOS AdMob uygulaması açılmadı.
- Reklam kapalıyken AdProvider SDK initialization ve ad requests başlatmamalı. Android izin engeli iOS IDFA engeli değildir. Non-personalized flag tek başına ATT/App Privacy yükümlülüklerini kaldırmaz. iOS reklam testi ayrı cihaz/UMP/yaş kabulü olmadan açılmayacak.
- Ses `playsInSilentMode=false`, kayıt ve background playback=false. Sessiz anahtarına saygı; foreground interruption mantığı ortak. Simülatörde çıkış üretmek fiziksel hoparlör/telefon görüşmesi kabulü değildir.
- Telefon push izni uygulama açılışında değil, Bildirim Ayarları ana anahtarıyla istenir. ExpoNotifications mevcut paket ve route işleyicisi ortak. iOS APNs entitlement, Apple Team/provisioning ve EAS APNs key bekler. Simülatör uygulama içi Inbox, gerçek APNs teslim testi sayılmaz. Genel push kapalı test sınırları değişmedi.
- Deep link scheme `anla-ezberle-quiz` korundu. Mevcut `/online/auth` PKCE/OTP callback ortak. Safari→native aynı cihaz, cold start, iptal, süre aşımı, recovery ve session persistence fiziksel test planında. Başka cihazda kimlik kanıtı yoksa sahte oturum üretilmez. Associated Domains/App Links otomatik eklenmedi; sahipliği doğrulanmış AASA dosyası ve domain seçimi ayrı plandır.

## /privacy için önerilen ek metin (HENÜZ YAYIMLANMADI)

“iOS hazırlık ve test sürümlerinde aynı Supabase hesap ve çevrimiçi oyun altyapısı kullanılır. Apple ile Giriş kullanılabildiğinde Apple'ın doğruladığı hesap kimliği ve e-posta adresi (seçtiysen Apple'ın gizli aktarım adresi), ilk onayda verdiğin ad ile birlikte oturum oluşturmak için işlenir. Apple parolan uygulamaya verilmez. Ad bilgisi yalnız profil gösterimi içindir. Apple girişi ve Apple hesabıyla hesap silme, güvenli sunucu yapılandırması tamamlanmadan etkinleştirilmez.

Bu iOS hazırlık sürümünde reklam talepleri, gerçek reklamlar ve Analytics kapalıdır; Google reklam SDK'sı native pakette bulunabilir. Android reklam testi açıklamaları otomatik olarak iOS'ta reklam gösterildiği anlamına gelmez. iOS'ta izleme izni istenmez; gelecekte reklam/izleme davranışı değiştirilirse izin ve politika açıklamaları ayrıca güncellenir. iOS telefon bildirimleri yalnız cihaz izni, APNs kurulum kabulü ve kapalı test yetkisiyle kullanılabilir.”

## App Privacy beyanı çalışma tablosu — nihai beyan değil

| Veri | Amaç / ilişki | Kontrol gereği |
|---|---|---|
| E-posta / kimlik / kullanıcı adı | Hesap, güvenlik ve sosyal profil; hesapla ilişkili | Apple relay ve giriş sağlayıcılarının gerçek akışı |
| Avatar / görünen ad / arkadaşlık / davetler | Uygulama işlevi ve diğer oyunculara izinli görünürlük | İsimler kullanıcı içeriği; moderasyon ve visibility |
| Oyun yanıtları / online skor-XP / oda kayıtları | Oyun sunumu ve güvenli doğrulama; hesapla ilişkili | Yerel ve online kayıtlar ayrı, dinî inanç çıkarımı yapılmıyor |
| Push tokenı / cihaz ve oturum ilişkisi | İsteğe bağlı kapalı test bildirimleri | APNs/Expo veri paylaşımı ve retention |
| IP / sağlayıcı teknik kayıtları | Hizmet, güvenlik ve teşhis | Supabase/Vercel/Apple/Google'nun gerçek toplaması; SDK ölçümü |
| Cihazdaki tema/ses/yerel geçmiş | Yalnız yerel depolama | Toplanmış sunucu verisi diye otomatik beyan etme |

Kaynaklar: [Apple 4.8/1.2/5.1](https://developer.apple.com/app-store/review/guidelines/), [hesap silme ve Apple token iptali](https://developer.apple.com/help/app-review/guideline-reference/5-1-1-account-deletion), [Google iOS UMP](https://developers.google.com/admob/ios/privacy), [Supabase Apple](https://supabase.com/docs/guides/auth/social-sign-in/auth-apple).
