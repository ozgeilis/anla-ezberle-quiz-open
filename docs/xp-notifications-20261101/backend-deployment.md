# Onaylı sınırlı backend dağıtımı — 1 Kasım 2026

Kullanıcının bu sohbet içindeki açık onayıyla yalnız Frankfurt
`mqyuihiobkomjfipxehj` değiştirildi. Kaynak MD5 önkoşulları ve üç SQL SHA-256
onaylanan değerlerle birebir eşleşti. Edge kaynak karşılaştırmasında yalnız
protokol alanları, `expire` ve doğruluk açıklaması yorumları değişiyordu.

| İşlem | Canlı kayıt | Sonuç |
|---|---|---|
| online-duel | sürüm 17; paket SHA `91734d4e6786a5a8ca8d50a4323e055256fc8f539a50a40455f8a2e5b53e8d42` | ACTIVE; mevcut getUser doğrulaması ve CORS korundu |
| twenty_second_questions | `20261101074832` | Yeni live/async default 20; eski maçlar NULL, eski odalar aynı |
| google_signup_test_allowlist | `20261101074841` | Önce boş oluşturuldu; RLS/FORCE RLS, client SELECT yok; hook korunuyor |
| progressive_player_levels | `20261101074850` | social_player yalnız seviye ifadesi değişti; sahiplik/ACL aynı |

MCP migration geçmişine sunucu uygulama zamanını kaydetti; depodaki orijinal
migration dosyaları yeniden adlandırılmadı veya değiştirilmedi. Onaylı dosya
SHA değerleri ilgili `migration-sha256.txt` kayıtlarındadır.

## Doğrulananlar

- 100 seviye başlangıcı ve bir önceki XP sınırı canlı SQL ile geçti;
  0/99→1, 100→2, 210→3, 330→4, 58.410→100; üstü 100.
- Mevcut 10 oda: biri 10, dokuzu 15 saniye; değerler ve tüm oda satırlarının
  MD5 özeti aynı. Eski asenkron maçların yeni süre alanı NULL kaldı.
- Profil, skor ledger ve kazanılmış rozet satırlarının dağıtım öncesi/sonrası
  toplu MD5 özetleri aynı. Kullanıcı satırları dışa aktarılmadı.
- İlgili fonksiyonların postgres sahipliği, boş search_path ve execute ACL
  değerleri korundu. Live komut kaynağı aynı kaldı; mevcut per-room süre kullanılır.
- Google OAuth/deletion true, **global Google signup false**; mevcut registration
  ve hesap silme capability değerleri değişmedi. Yalnız açıkça onaylanan iş
  hesabı için 8 Kasım 2026 07:49:51 UTC'ye kadar özel test izni eklendi.
  İzin eklenmeden önce bu e-postayla mevcut Auth hesabı olmadığı doğrulandı.
- Güvenlik advisor bulgu adları/sayıları aynı: özel deny-all RLS tabloları,
  eski leaderboard search_path/capability SECURITY DEFINER ve sızdırılmış parola
  koruması uyarıları bu değişiklikte giderilmiş gibi gösterilmedi.

Ham şema/özet/fonksiyon kanıtı `backend-deployment-evidence.json` dosyasında.
Bu kanıt gerçek OAuth veya gerçek Android teslim testi yerine geçmez.

## Hâlâ bekleyen

Webde gerçek yetkili Google kaydı/girişi ve yenileme sonrası kalıcılık geçti. Hosted e-posta/native Google callback kabulü bekliyor; en fazla
iki yeni geçici uygulama hesabı sınırı. Yeni Android kabul APK'sı ve fiziksel
Samsung testi; sonra ayrıca onaylanacak farklı versionCode'lu Alpha yayını.
Main, Vercel Production, mevcut Alpha ve testçi listesi değiştirilmedi.

Önceden var olan advisor açıklamaları:
[RLS](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy),
[search_path](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable),
[parola koruması](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Gerçek servis kabulü — web (mock değil)

Yeni geçici test hesabı #1 yalnız izinli iş Google kimliğiyle oluşturuldu.
Google hesap seçimi → Supabase PKCE → otomatik `/profile` dönüşü geçti.
Sayfa yenileme sonrasında `/online` gerçek sunucu hesabını “E-posta doğrulandı”
olarak gösterdi. Çıkıştan sonra yeniden Google girişi geçti; sunucuda tek
hesap/tek Google identity bulunuyor. İkinci uygulama e-posta doğrulaması veya
uygulama şifresi istenmedi. Google'ın mevcut temel profil/e-posta rızasıyla
normal giriş tamamlandı; Cloud audience/provider secret değiştirilmedi.

İşlem anında ayrı kullanıcı onayıyla yalnız şu yerel callback eklendi:
`http://127.0.0.1:8121/online/auth?flow=google&attempt=*`.
Önceki sekiz callback korundu; toplam dokuz. Site URL ve CORS değişmedi.
Ayrı worktree'nin dış node_modules symlink'i web asset export'unda fontları
kök dışına taşıdığından yerel bağımlılıklar frozen/offline kuruldu; tekrar
`pnpm export:web:test` geçti. Bu ortam düzeltmesi repo kaynak değişikliği değildir.

Yeni hesabın gerçek düellosu 20 saniyeyle oluşturuldu. UI'da 2 saniye kalırken
7. soruya gönderilen yanıt sunucuda `timed_out=false` kaydedildi. Beş önceki
süre aşımı gerçek sunucuda kaydedildi; yinelenen pozisyon yok. Kesin 20 saniye
sonrası ANSWER_LATE sınırı bu web etkileşimiyle yeniden kanıtlanmadı; izole SQL
regresyonunda geçmiştir. Bu test fiziksel Android kabulü değildir.

Hook mantığı için dört yönetici SELECT denetimi geçti: izinli iş adresi kabul,
başka Google adresi ret, email akışı korunuyor, user_metadata ile izin spoof
edilemiyor. MCP üzerinden `SET ROLE supabase_auth_admin` izni olmadığı için
ayrı rol taklidi çalıştırılamadı; yetki genişletilmedi. Gerçek Google kaydının
başarısı hosted Auth hook çağrısının çalıştığına ayrıca kanıttır.

## Gerçek canlı oda / native paket

Yeni test hesabına yalnız sentetik `qa_google_1101` kullanıcı adı kaydedildi;
keşfedilebilirlik açılmadı. Gerçek live oda komutu bir bekleme odası oluşturdu,
UI **20 saniye/soru** gösterdi. İkinci oyuncu olmadan başlangıç kilidi doğru
şekilde korundu. Gerçek iki oyunculu başlangıç/deadline kabulü henüz yapılmadı.

Frankfurt public URL/publishable key ile yeni yerel QA release APK derlendi:
SHA-256 `cf5471472330c24981a92b8debf28ac7791f9ccef9551170cf5b9b42363f4330`.
Android 14 emülatöre `install -r` ile kuruldu; uninstall/data clear yapılmadı.
Önceki yerel profilin 20 XP ve son skor kaydı korundu. Bu debug anahtarlı
code 5 QA paketidir; Play sürümüne üzerine kurulacak EAS kabul paketi değildir.
Reklam modu off; gerçek reklam/Analytics/push açılmadı.

İkinci ve son geçici hesap için native kayıt ekranı hazırlandı; e-posta
alanı onaylı iş adresinin yeni test alias'ıdır. Şifre alanları doldurulmadı;
kimlik bilgisi oluşturma adımı hesap sahibine bırakıldı. Bu hesap henüz
oluşturulmuş veya e-posta akışı geçmiş sayılmıyor.

Edge olumsuz erişim kontrolü gerçek endpoint üzerinde geçti:
`edge-security-results.json` — oturumsuz 401, sahte JWT 401, izin dışı origin 403.


Gerçek test hesabı işlemleri sonrasında koruma denetimi tekrarlandı: test
hesapları hariç profil/ledger/rozet ve dağıtım öncesindeki oda satırları aynı
MD5 özetlerini verdi. Yeni test odası 20 saniyedir. E-posta kayıt denemesi
emülatör DNS çözümleme sorunu nedeniyle servise ulaşamadı; hesap oluşmadığı
sunucuda doğrulandı. Başarılı kayıt/otomatik native giriş olarak sayılmadı.


Emülatör DNS sorunu aynı AVD/veri korunarak, açılışta Mac'in etkin DNS
çözücülerini kullanarak giderildi. Supabase hostname çözümleme ve ping geçti;
kayıt formu hesap sahibinin şifre girişine yeniden hazırlandı. Kaynağa kalıcı
DNS/HTTP/TLS istisnası eklenmedi. Bağımsız frozen/offline node_modules ortamında
`pnpm check` tekrar geçti: TypeScript, lint, soru bütünlüğü, **390/390 test**.
