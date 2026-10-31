# Kapalı test gönderim durumu — 30 Ekim 2026

**HAZIR DEĞİL.** EAS kabul APK'sı hazır; Play kapalı test sürümü henüz yok.

## Tamamlanan

- Yeni entegrasyon dalı ve [taslak takip PR #20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20). PR #17/#18 zinciri korunuyor; PR #13 kodu mevcut adayın geçmişinde, gerçek native OAuth kabulü tamamlanmış sayılmıyor.
- Kaynak `7db5e96ac51119259015f86c0d0e95e71207fdef`: `pnpm check` 370/370, TypeScript/lint/soru bütünlüğü, web export PASS. Sonraki commitler yalnız rapordur.
- [Yeni EAS APK](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/d33a229f-cd8a-47a2-9a77-ce0bcf9d51dc): FINISHED, target API36, aynı EAS imzası, mevcut kalıcı paket, ZIP/52 ELF64 statik16KB PASS. [Tam binary kanıtı](final-apk-evidence.json). Android14 emülatörde veri silmeden güncelleme kurulumu PASS; bu binary'nin UI kabulü bekliyor.
- Önceki PR #18 gerçek Android14 emülatör UMP ret/kabul/geri çekme, gerçek test banner ve interstitial, 12 görünüm/24 web kontrolü kanıtları korunuyor. Önceki testler yeni APK'ya fiziksel kabul olarak taşınmadı.
- Play uygulaması/paket, kişisel hesap, 12 tester/14 gün gereği ve 0 tester doğrulandı.
- Gizlilik URL'si, kategori/iş iletişimi, ücretsiz fiyat, resmî kurum Hayır, test reklamı içeren aday için Reklam Evet taslağı kaydedildi. Metin, ikon, tanıtım ve altı gerçek oyun ekranı 31 Ekim AI kaynak etiketleriyle mağaza girişinde **İncelenmek üzere göndermeye hazır** kaydedildi; incelemeye gönderilmedi.
- Ürün sahibi 13+ hedefini onayladı; ilgili form incelemeci erişimi beklediği için yaş kaydı henüz yok.
- Canlı Supabase yalnız salt okunur incelendi; hesap silme/sıralama açık, Google yeni kayıt/genel push kapalı, RLS ve kısıtlı enrollment korundu.

## P0 — gönderimi durduran eksikler

1. İncelemeci sosyal özellikler için kalıcı, yeniden kullanılabilir test hesabı yok. [En fazla iki sentetik oyuncu planı](reviewer-access-plan.md) ayrı onay bekliyor; yeni gerçek/üretim hesabı oluşturulmadı.
2. Data Safety, IARC, 13+ yaş formu, son binary ile beyan uyumu tamamlanmadı. Gerçek olmayan Hayır yanıtları verilmedi.
3. Yeni APK'nın güncel oyun/UI kabulü tamamlanmadı. Fiziksel Samsung mevcut değil. CUA emülatörü uygulama olarak tanımıyor; ADB/UIAutomator alternatif UI yöntemi için açık talep istendi.
4. AAB onay kapısı hâlâ kapalı: `approved:false`, `acceptedApkSha256:null`. Fiziksel kabul yerine hangi kanıtların kabul edileceği için insan kararı yok. AAB üretilmedi/Play'e yüklenmedi.
5. Play ülke/tester/track, güvenli imzalama onayı, kesin AAB SHA ve nihai gönderim onayı bekliyor. Katılım bağlantısı, Pre-launch report ve başlayan 14 günlük sayaç yok.

## Diğer açık kabul işleri

Gerçek Android OAuth iptal/hesap değiştirme/callback; test reklamı tam ekran açıkken arka plan ve kalan native tekrar/frekans senaryoları. Fiziksel ses duyulabilirliği ve Samsung davranışları emülatör/otomatik testle kesinlenmez. Mağaza ekran görüntüsü sırası ana sayfa ilk olacak biçimde düzenlenecek. Mac'in son UI denemesinde kilitli olması nedeniyle kalan taslak işlemleri durdu.

## Güvenlik sınırı

Main, Vercel Production, gerçek reklamlar, Analytics, genel push, Auth politikaları, canlı soru bankası, gerçek kullanıcılar bu çalışmada değiştirilmedi. Ücretli plan/runner/işlem, merchant hesap, AAB submit veya Play incelemeye gönderimi yapılmadı.

## 31 Ekim devamı

Mac erişimi yeniden açıldı. Finans/sağlık yok beyanları kaydedildi, panel7/13 görev. Data Safety10 veri türüyle kısmi taslak; kullanıcı AI illüstrasyon kaynağını doğruladı, sekiz mağaza görseli etiketlenerek kaydedildi ve kalıcılığı doğrulandı. Önceki kilit engeli kalktı, diğer hesap/ADB yöntemi/AAB onay sınırları değişmedi. [Ayrıntı](console-progress-20261031.md).
