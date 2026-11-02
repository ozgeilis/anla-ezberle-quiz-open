> **Sonuç — 2 Kasım:** Sahibi bu dar planı onayladı. Exact migration
> `e788b481…00b0d6f3`, canlı kayıtta `20261102143955` olarak uygulandı.
> Kaynak/trigger/izin eşleşmesi doğrulandı; eski silme fonksiyonu aynı kaldı.
> Yalnız sahip rolü yeniden açıldı ve taze konsol kabulünden sonra safety=true
> yapıldı. Gerçek iOS390 şikâyet/engel ve sunucu retleri, konsol karar/geri alma
> geçti. Test ilişkileri işlevsel geri kondu; tüm kabul oturumları kapatıldı.
> Aşağıdaki metin onaylanan planın geçmişidir. Güncel kanıt:
> [hosted-erasure-final-result.json](hosted-erasure-final-result.json).
> Gizlilik metni için PR #29 hazır; yayın veya yeni IPA bu izne dahil değildir.

# Şikâyet verileri ve hesap silme: yeni dar canlı plan

Durum: **hazır ve izole ortamda test edildi; canlıya uygulanmadı.**
Önceki rol/bayrak izni bu yeni migration'ı kapsamıyor. Son sahip onayı gerekir.

## Bulgu ve geri dönüş

Mevcut Auth silmede raporun hedef/şikâyetçi FK alanı NULL olurken ad kopyası,
şikâyet metni ve moderasyon notu kalabiliyordu. Notun sosyal kısıtlama gerekçesi
kopyası da değerlendirildi. Yerel, transaction içinde tekrar üretildi; canlı
hesap silinmedi. Önceki onaylı geri dönüş uygulandı: safety=false, aktif
moderatör=0; sahibin hesabı ve pasif rol satırı korundu. Konsol oturumu kapatıldı.

## Değişiklikler

Yalnız Frankfurt `mqyuihiobkomjfipxehj`:

1. Salt okunur şema/kaynak/config karşılaştırması; sapmada dur.
2. Yeni ileri migration `20261102135833_moderation_erasure_privacy.sql` SHA256
   `e788b4815fc29eb26c20e0fbef96a9590ee6a3d10748e84ae053e92000b0d6f3`.
   Auth hard-delete öncesinde ilişkili şikâyet metni/ad kopyaları, audit notu ve
   aynı notun kısıtlama gerekçesi kopyası temizlenir. İlgili açık rapor kapanır.
   Kimlik FK'leri mevcut kuralla NULL olur. Neden kodu, durum, zaman ve karar
   kaydı tutulur; bunların tümünün bütünüyle anonim olduğu iddia edilmez.
   Diğer oyuncuların kısıtlaması kaldırılmaz; yalnız kişisel gerekçe temizlenir.
   Önceden silinmiş kimliğe bağlı artık kayıtlar da aynı kuralla düzeltilir.
   **Bu metin temizliği geri alınamaz.** Son salt okunur kontrolde artık rapor
   ve audit sayısı sıfır; tekrar kontrol edilmeden uygulama yapılmaz.
   Eski silme fonksiyonu/Edge, Auth hook'u, RLS ve silme yetkileri değiştirilmez.
   Normal yetkili yönetici hard-delete işlemi de temizlikten yararlanır; hiçbir
   istemciye veya role yeni hesap silme yetkisi verilmez.
3. Migration kaydı ve yeni trigger/fonksiyon kaynağı tekrar doğrulanır.
4. `reactivate-moderation-after-erasure.sql` SHA256
   `ac9a4f72b4b966a5c2a14d1e367e92136d4b9b9225c9a9e31981ce805c559958` yalnız önceki doğrulanmış
   işletim hesabının pasif moderatör rolünü tekrar açar; safety hâlâ false.
5. Sahibi konsolda yeniden giriş yapıp gerçek rapor kuyruğunu doğrular.
6. Önceki `activate-player-safety.sql` SHA256
   `26e27ccb5e6c9e0bef9745c40ee8578f557fd65d0b8610ea8ea81bd08451cca6` ile safety açılır. Ortak backend
   olduğu için uyumlu Android istemciler de bu özelliği görebilir; Alpha kanalı,
   binary, testçi listesi ve yayın durumu değiştirilmez.
7. Yalnız mevcut iki sentetik incelemeci ile iOS simülatöründe gerçek profil,
   şikâyet, engelleme/engel kaldırma ve sunucu davet reddi kabulü yapılır.
   Yeni hesap yok; gerçek oyuncu ilişkileri kullanılmaz. Sentetik arkadaşlık ve
   bekleyen davetler normal aksiyonlarla işlevsel durumuna döndürülür; eski UUID
   ve zaman damgalarının aynen geri geldiği söylenmez. Konsol kararı/audit korunur.

Başarısızlıkta safety=false ve sahibin rolü active=false. Yeni temizleme trigger'ı
kaldırılmaz; düzeltilmiş verileri eski kişisel metinlere döndürmeye çalışılmaz.
Hesaplar, maçlar, puanlar, XP, reklamlar, push, sağlayıcılar, genel kayıt, Alpha,
App Store Production ve main bu backend planının kapsamı dışındadır.

## Gerçek testler

- `pnpm check`: 430/430; TypeScript, lint, soru bankası ve regresyonlar.
- İzole şema runner'ı: v72/v73, 20 saniye, XP, Apple silme, moderasyon/RLS,
  mevcut hesap silme ve yeni hedef/şikâyetçi/moderatör metin temizliği geçti.
- Silme rollout'u kapalıyken ret, transaction rollback, ilgisiz rapor/audit ve
  diğer oyuncu hesaplarının korunması geçti.
- `moderation-erasure-local.mjs`: gerçek yerel GoTrue Admin HTTP hard-delete ve
  öncesinde service-only silme intent'i; hesap yok, rapor/audit metni temiz,
  diğer hesap yerinde. Canlı kullanıcı hesabı silme testi değildir.
- Mevcut iOS QA kopyasında aynı kabul edilmiş JS ile gerçek parola girişi,
  bildirim/oyuncu profili, kapalı bayrakta devre dışı güvenlik butonları ve çıkış
  geçti. Yeni etkin güvenlik UI kabulü yukarıdaki canlı izni bekler.
- İleri veri düzeltme fixture'ı (önceden NULL kimlikli rapor/audit/kısıtlama) yeni migration'dan sonra temizlendi; bütün izole runner tekrar geçti.
- Rolü yeniden açan SQL de izole transaction'da test edildi; safety kapalı kaldı, rollback önceki durumu korudu.
- Son eklerden sonra TypeScript/lint tekrar geçti.
- Fiziksel iPhone'da yeni moderasyon kabulü ve TestFlight build3 kurulumu yapılmadı.

## Gizlilik metni ayrı onay sınırı

[PRIVACY-ADDENDUM-PROPOSAL.md](PRIVACY-ADDENDUM-PROPOSAL.md) mevcut politikayı
koruyan somut metin önerisidir. Henüz uygulama metnine veya herkese açık URL'ye
uygulanmadı; bu backend izni main/Vercel yayını içermez. Açık gizlilik açıklaması
ve native sosyal kabul kapanmadan Beta App Review gönderilmeyecek.
