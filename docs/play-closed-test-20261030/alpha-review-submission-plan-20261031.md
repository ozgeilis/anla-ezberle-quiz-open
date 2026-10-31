# İlk Alpha inceleme/gönderim planı — ayrı nihai onay bekliyor

31 Ekim 2026 · Önceki izin yalnız AAB üretimi ve ardından **taslak upload** içindi. Bu belge bu izinleri genişletmez. Aşağıdaki işlemler uygulanmadı.

## Kesin paket ve kitle

- Mevcut `com.kovynelstudio.anlaezberle`, yalnız **Kapalı test — Alpha**, yalnız **Türkiye**.
- Yüklü AAB0.1.0/code2,target36, EAS7d8591e7, kaynak `8d13fc26b2c68a209970ac226dfb2a6a1d650c59`.
- AAB SHA-256 `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a`.
- Kaydedilmiş **`test` adlı2 adresli** mevcut liste. Adresler bu belgede/Git'te yok.12 testçi varmış gibi davranılmayacak; yeni adres/grup/genel erişim bu izinle eklenmeyecek.
- Listeye eklenmek Google opt-in değildir. Kapalı test yayımlandıktan sonra katılım bağlantısıyla kayıt gerekir. Console'un12 kişinin kesintisiz14 gün şartı henüz sağlanmadı; ilk gönderim üretim erişimi değildir.

## Hazır doğrulama ve eksikler

[Gerçek upload/Console kontrolü](play-draft-upload-result-20261031.md): Alpha taslağı kayıtlı, test listesi seçimi reload sonrası kalıcı, önizleme **Yayınlamaya hazır**,0 görünen hata/uyarı. [Play imzalı APK statik kanıtı](play-signed-static-evidence.json) ve önceki API34/API36 toplam36 düzen durumu hazır. Son kaynak kontrolleri378/378; son eklemeler yalnız belgedir.

Google'ın paket doğrulaması dinî içerik uzman onayı, fiziksel Samsung/ses, native OAuth/iOS, Play-signed runtime,16KB kernel veya Google Pre-launch report yerine geçmez. Bu testler hâlâ bekliyor. Açık P2 ikincil açık-tema rekor metni kontrastı korunur. Sonraki kapalı test amacı gerçek tester geri bildirimini toplamaktır; yayın tamamlandı/üretime hazır iddiası yok.

## Onay verilirse yapılacak işlem

1. Aynı AAB/code2/Alpha/Türkiye/test listesi sınırlarını yeniden okuyup doğrulamak. Yeni paket/build, imza değişimi veya özellik açma yok.
2. Mevcut **Önizle ve onayla → Kaydet** ile yalnız bu sürümü yayın özetine hazırlamak. Bu adım şimdiye kadar uygulanmadı.
3. Yayın özetindeki paket/ülke/tester ve mevcut mağaza/beyan kapsamını incelemek: Türkçe mağaza girişi, içerik derecesi,13+ hedef, gizlilik URL'si, test reklamlarına uygun Reklam Evet, Data Safety ve özel incelemeci erişim talimatları. Farklı paket/kitle veya yeni kişisel veri aktarımı çıkarsa durmak.
4. Gerekli kontroller tamamlanmış ve Gönder düğmesi etkinse yalnız bu **ilk Alpha kapalı test** için Google incelemesine göndermek. Yeni sözleşme kabulü, ödeme/satıcı hesabı/kimlik/finans bilgisi girişi, anahtar yetkisi veya başka zorunlu karar çıkarsa durmak; bu plan bunları onaylamaz.
5. Google inceleme durumu/ilk katılım bağlantısını doğrulamak. Ret/ek gereklilik varsa aynen raporlamak. Onay gelmeden indirilebilir denmez. İşlem süresi garanti edilmez.

## Yayınlama etkisi

Mevcut **Yönetilen yayınlama devre dışı**. Bu yüzden izin, Google kabul ederse sürümün **yalnız mevcut2 adresli test listesi ve Türkiye** kapsamına sunulabileceğini içerir; tekrar genel kamuya yayın izni değildir. Bu ayar değiştirilmez. Yönetilen yayınlamayı açmak istenirse ayrıca değerlendirilecek; mevcut ayar için onay varmış gibi varsayılmaz.

Son gönderim için aynı emülatör kanıtını ilk sınırlı kapalı testin kabul dayanağı olarak kullanma kararı kullanıcıya aittir. Fiziksel test yapılmış diye kayıt tutulmaz.

## Mevcut kilit ve durma koşulları

Yayın özetindeki Gönder düğmesi şu an pasif; kontrol paneli adımlarını bekliyor. Son sürüm kaydı/onayı henüz verilmedi. Panel ayrıca12/13 ve merchant/fiyat görevi gösteriyor, ancak gerçek fiyat sayfası **Ücretsiz**. Bu nedenle merchant hesabı zorunlu diye finans sürecine girilmeyecek veya ücretli→ücretsiz geçiş hilesi uygulanmayacak. Sürüm onayından sonra kilit devam ederse somut hata ve güvenli destek/kurulum adımı raporlanacak; onay kendiliğinden başka işlem yetkisine dönüşmez.

Resmî referans: [Google Play uygulama fiyatları](https://support.google.com/googleplay/android-developer/answer/6334373?hl=en), [geliştirici/ödeme ve satıcı profili ayrımı](https://support.google.com/googleplay/android-developer/answer/13628312?hl=tr). Yeni finans hesabı açma bu planın dışındadır.

## Kapsam dışında

Üretim/public Play yayını, main merge, Vercel Production, Supabase değişikliği/yeni gerçek hesaplar, genel push/yeni Google kayıt açılması, gerçek reklam/Analytics, yeni AAB üretimi, mevcut uygulamayı silme veya yeniden puanlama yok. Test APK→Play üzerine güncelleme uyumluluğu henüz garanti edilmez. Mevcut kapalı hesap erişim kuralları korunur; listede olmak uygulama Auth hesabı/online yetki oluşturmaz. Misafir solo erişimi mevcut olduğu gibi kalır.
