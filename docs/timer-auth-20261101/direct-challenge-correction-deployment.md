# Ek davet düzeltmesi — canlı kabul (1 Kasım 2026)

Kullanıcı yalnız [somut ek planı](direct-challenge-correction-plan.md) onayladı.
Kaynak/ACL/hash kontrolünden sonra aşağıdakiler Frankfurt'a uygulandı.
Main, Vercel Production, Alpha/AAB, testçi listesi, Auth politikası, genel
kayıt/push, gerçek reklam ve Analytics değiştirilmedi.

## Dağıtım

- `online-duel` **v18 ACTIVE**. Kaynak SHA-256
  `ae897270f75f65f3eb3047861b9ceca7026ec26938091b1e0a0ff4bd495a7cff`.
  Onaylı önceki v17 kaynağına göre tek fark `challenge_reply` için
  `timingVersion` alanıdır. Kaynak dağıtım sonrası birebir tekrar okundu.
- Mevcut `verify_jwt=false` ve gövdedeki doğrulanmış `getUser`/confirmed/
  nonanonymous kontrolleri korunur; bu JWT'lerin sign-out sonrasındaki mevcut
  expiry davranışını değiştirmez.
- `20261101131615_direct_challenge_timing_protocol.sql`, SHA-256
  `5d7b05b6bd4bf3dedf71c6893f9ed07ce013584065b59961977631c165e2466a`.
  Hosted migration kaydı `20261101133436` / `direct_challenge_timing_protocol`.
- Matchmaking prosrc MD5 `cf3e39c0494f8260131ea3e08eb15d00` →
  `8e6b1d49bccdc03c01b83f1684627b3f`; postgres owner, service-only ACL ve
  boş search_path korundu. Eski migration dosyası değiştirilmedi.

Dağıtımın hemen öncesi/sonrası maç, oda, puan ledger, rozet ve davet tam satır
özet hash'leri aynıydı. Tam profil hash'i aynı değildi; açık native istemcinin
istek sayaçları aktiftir. Bütün profil alanlarının eşitliği iddia edilmez.
Migration oyuncu DML'i içermez. Gerçek kullanıcı satırları dışa aktarılmadı.

## Yeni QA APK ve gerçek hosted kart testi

Yerel QA APK SHA-256:
`1300e5175353eaba8df98e3e3ffcaf07a3b5b71c68361117f4ea19f108560254`.
Paket/imza, emülatördeki önceki kurulumla karşılaştırıldı; **install -r** ile
veriler silinmeden güncellendi ve Google oturumu korundu. Code 5, yerel debug
imzasıdır; EAS/Play üzerine kurulacak kabul APK'sı veya AAB değildir.
Reklam modu off; native yapılandırma/soru bankası değiştirilmedi.

Yalnız önceki iki izinli geçici hesap kullanıldı, yeni hesap oluşmadı.
Gönderici olayları yönetici SQL bağlantısından mevcut sosyal/matchmaking RPC
ile oluşturuldu; bu ikinci fiziksel oyuncunun Auth/UI testi değildir. Alıcı
işlemleri gerçek Android 14 emülatöründeki oturumdan normal Edge yolu ile yapıldı:

| Kontrol | Sonuç |
|---|---|
| Arkadaşlık isteği | Native listede gerçek olay göründü; Kabul Et → server accepted; kart pasif |
| Daha Sonra | Davet pending, match yok; yalnız ilgili bildirim read |
| Katıl | Gerçek Edge ACK; accepted; tek maç ve iki oyuncu |
| Maç başlangıcı | Oyuncu B başlayabildi; server answer_seconds=20 |
| 10 sn sonrası yanıt | İlk cevap server başlangıcından **13.67 sn** sonra kabul; timed_out=false |
| Çift dokunma | İlk pozisyonda **tek** cevap satırı |

İstemcide başlat düğmesinden dokunmaya 16.85 sn ölçüldü; ağ/başlatma süresini
de içerdiğinden server kabul süresiyle karıştırılmaz. Sunucu ölçüsü esas alınır.
Yerel 391 test, TypeScript/lint/soru kontrolü, birleşik izole SQL ve web export
önceden geçti. Hosted v18 no-session/fake-JWT/bad-origin kontrolleri sırasıyla
401 SIGN_IN_REQUIRED / 401 SESSION_EXPIRED / 403 ORIGIN_NOT_ALLOWED döndü.
Yeni güvenlik danışmanı kategorisi oluşmadı; mevcut danışman bulguları korunur.

Gerçek native ekranlar ve makine özeti:
`../xp-notifications-20261101/screenshots/hosted-native-*.png`,
`../xp-notifications-20261101/direct-correction-deployment-result.json`.
Bu fiziksel Samsung/iOS, gerçek push teslimi veya Play-signed runtime kabulü
değildir. Süresi dolmuş davet yerleşimi önceki fixture matrisiyle sınırlıdır.

## Kalanlar

Hesap sahibi mevcut güvenli akışta Google OTP ve e-posta hesabı şifresiyle
iki son silme onayını kendisi tamamladı. Sunucu: iki Auth hesabı ve iki profil
0; sahipsiz session/identity 0. Google silinince test düellosu cancelled,
ilgili davetler kaldırıldı; karşı hesap, kendi silinmesine kadar korundu.
İki test hesabının temizliği tamamlandı; iş Google hesabının kendisi silinmedi.
Süreli test kayıt izni kaldırıldı; izin listesi boş ve genel Google kaydı kapalı.
Silme ekranı native oturumu temizledi ve sunucu başarı mesajıyla girişe döndü.
Tek oyunculu yerel geçmiş/XP korunur. Gecikmiş e-posta linkinde gerçek
hosted otomatik giriş kabulü hâlâ açık; şifreli giriş ve kalıcılık geçmiştir.
Bu dağıtım yeni Alpha/Main/Production onayı değildir.

Silme sonrası gerçek Google giriş denemesi yeni hesap oluşturmadı; kapalı
kayıt hook'u reddetti. Bu ret mevcut istemcide genel bağlantı/süre doldu
mesajına dönüşebildi. Son istemci adayı hata fragment'ini korur ve eşzamanlı
Linking/browser hata teslimini tek sonuçta toplar; güvenli hedef/nonce/PKCE,
tek kullanımlılık ve implicit token reddi korunur. Ek backend değişikliği yok.
Son native ret kabulü geçti: kapalı test yetkisi açıklaması ve girişe dönüş
tek ekranda; generic ağ/yanlış expiry/ikinci modal yok; hosted yeni hesap 0.
Ekran: `hosted-native-google-denial-single-screen.png`.

Son hata-işleme adayının QA APK SHA-256:
`26e3b4892c8fbbf627d53b5ce78ea980816af24e6345178f733baa8dae2aa014`.
**396 test**, TypeScript/lint ve web export geçti. Son tek satırlık modal
kaldırma sonrası TS/lint tekrar geçti; native derleme ve gerçek ret akışı
da tekrar kontrol edildi. Yerel debug imzası/yalnız emülatör; Play dağıtımı yok.
Gerçek başarılı Google/native login kanıtı önceki paketle alındı; iki hesap
silindikten sonraki yalnız hata-işleme değişiklikleri için yeni izinli Google
hesabı oluşturulmadı ve final happy-path yeniden geçti diye raporlanmaz.

Temizlik sonrası mevcut profillerin hash'i, puan ledger ve rozet hash'i
beklenen korunmuş değerlerle aynı. Fixture silme, bunların sahip olduğu test
odalarını/maçlarını iptal edebilir; temizlik sonrası bütün oda satırlarının
aynı kaldığı iddia edilmez. Tam veri dökümü yapılmadı.

Geçerli yeni hosted e-posta linkinin otomatik native kabulü için tek ek
hesap planı hazır; henüz uygulanmadı: `fresh-email-native-retest-plan.md`.
