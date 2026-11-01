# Kabul kaydı

| Alan | Sonuç | Sınır |
|---|---|---|
| TypeScript / lint / unit | 390 geçti | Kod adayı; üretime uygulanmadı |
| SQL | İzole yerel tam entegrasyon geçti | Hosted migration uygulanmadı |
| Web export | Geçti | Yalnız yerel fixture build |
| Web 320/360/390 açık/koyu | 6 matris geçti | Gerçek UI; synthetic HTTP |
| Native Android 14 | Release APK üretildi | Yerel debug imzalı QA; Play üzerine kurulmaz |
| Native yazı matrisi | **18 geçti** | Android 14 emulator, 320/360/390 × açık/koyu × font_scale 1/1.5/2 |
| Settings/hesap regresyonu | **11 grup geçti** | 320 dp iki tema; okundu/hata, modal, hesap değişimi, callback, tema Kaydet/Vazgeç/kalıcılık |
| iOS / fiziksel Samsung | Yapılmadı | Web/emülatör yerine sayılmaz |
| Gerçek push / hosted arkadaşlık | Yapılmadı | Mevcut backend değiştirilmedi |
| Main / Production / Alpha | Yapılmadı | Ayrı onay gerekir |

QA APK SHA-256: `717b254d372c83712cc3d02f5b4dba058f5b77df781d19f03cf1b4cd5d66a1da`.
Bu paket code 5 yerel QA'dır; EAS/Play sürüm tahsisi değildir. İçindeki Auth
bağlantısı yalnız loopback synthetic fixture sunucusudur. Güvenlik testi veya
gerçek kullanıcı girişi için dağıtılacak paket değildir.

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
