# Kabul kaydı

| Alan | Sonuç | Sınır |
|---|---|---|
| TypeScript / lint / unit | 391 geçti | Son hata mesajı düzeltmesi dahil; istemci adayı yayımlanmadı |
| SQL | İzole entegrasyon ve onaylı hosted dağıtım geçti | Üç migration ve Edge v17; ayrıntı backend-deployment.md |
| Web export | Geçti | Fixture ve hosted public yapılandırmalı export; Production değişmedi |
| Web 320/360/390 açık/koyu | 6 matris geçti | Gerçek UI; synthetic HTTP |
| Native Android 14 | Release APK üretildi | Yerel debug imzalı QA; Play üzerine kurulmaz |
| Native yazı matrisi | **18 geçti** | Android 14 emulator, 320/360/390 × açık/koyu × font_scale 1/1.5/2 |
| Settings/hesap regresyonu | **11 grup geçti** | 320 dp iki tema; okundu/hata, modal, hesap değişimi, callback, tema Kaydet/Vazgeç/kalıcılık |
| iOS / fiziksel Samsung | Yapılmadı | Web/emülatör yerine sayılmaz |
| Gerçek push / hosted arkadaşlık | Yapılmadı | Mevcut backend değiştirilmedi |
| Main / Production / Alpha | Yapılmadı | Ayrı onay gerekir |
| Gerçek Google web | Geçti | İzinli tek iş hesabı, tek uygulama kimliği; native ek Google doğrulaması bekliyor |
| Hosted Android e-posta kaydı | Hesap oluştu ve e-posta doğrulandı | Gecikmiş bağlantıda otomatik giriş **geçmedi**: flow_state_expired |
| Hosted Android şifreli giriş | Geçti | Sahip şifreyi girdi; force-stop/relaunch kalıcılığı ve uygulamadan çıkış doğrulandı |
| Hosted canlı oda süre sınırı | Geçti | İki izinli test aktörüyle SQL RPC; 15.02 sn kabul, 20 sn sonrası ret, 5 sn reveal; iki cihaz UI testi değildir |

QA APK SHA-256: `717b254d372c83712cc3d02f5b4dba058f5b77df781d19f03cf1b4cd5d66a1da`.
Bu paket code 5 yerel QA'dır; EAS/Play sürüm tahsisi değildir. İçindeki Auth
bağlantısı yalnız loopback synthetic fixture sunucusudur. Güvenlik testi veya
gerçek kullanıcı girişi için dağıtılacak paket değildir.

Sonraki hosted QA APK SHA-256:
`cf5471472330c24981a92b8debf28ac7791f9ccef9551170cf5b9b42363f4330`.
Bu da yalnız emülatör için yerel debug imzalıdır. Gerçek Frankfurt Auth testi
bu paketle yapıldı; son `6148c2e` hata mesajı düzeltmesi henüz bu binary'de yok.
EAS/Play imzalı kabul APK'sı ve fiziksel kabul bekliyor.

Gerçek native UI ekranları ve tarayıcı kayıtları `screenshots/` içindedir. Ham UI/SQL/video çıktıları ve özel yerel Auth
kanıtları depo dışında tutulur. Gerçek kimlik bilgisi Git'e eklenmez.

Native etkileşim: istek kabulü → pasif kart; Daha Sonra → davet pending;
profilde var olan yerel 20 XP için 20/100 çubuğu görüldü. Test servisi yalnız
loopback synthetic HTTP idi; gerçek kullanıcı hesabı değiştirilmedi.

Push gezinme regresyonu: üç grup geçti (hesap kimliği koruması, izinli iç rota,
tüketilen intent tekrar açılmıyor). Gerçek bildirim teslimi testi değildir.

DB lint yerel izole veritabanında `--fail-on error` ile geçti. Yeni level
helper/projection için hata yok. Değiştirilmeyen live/push fonksiyonlarında
mevcut kullanılmayan değişken/gölgeleme ve tür dönüşümü uyarıları korunuyor;
bu görevde ilgisiz backend fonksiyonları yeniden yazılmadı.

Google/şifre sentetik tarayıcı regresyonu: **13 grup geçti**. Aynı callback
query sırasıyla iki kez exchange edilme hatası PR #22 içinde düzeltildi;
PKCE/nonce/kimlik ayrımı, iptal, foreign identity reddi, e-posta recovery
ve tarayıcı Geri iptali kontrolleri geçti. Gerçek Google OAuth değildir.

18 native yerleşim kontrolü aynı UI kaynaklarıyla tamamlandı. Son ortak
callback düzeltmesini de içeren yukarıdaki SHA’lı APK ayrıca üzerine kuruldu;
cold-start ve mevcut yerel 20/100 XP’nin korunması tekrar doğrulandı.
