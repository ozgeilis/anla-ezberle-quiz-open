# İlk Alpha inceleme gönderimi — 31 Ekim 2026

Ürün sahibi [kesin planı](alpha-review-submission-plan-20261031.md) “Mevcut 2 kişilik listeyle ilk Alpha incelemesini onaylıyorum” yanıtıyla kabul etti. Mevcut code2/SHA `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a`, Alpha/Türkiye/test listesi sınırları korunur. Bu belge deneme/gönderim durumunu ayırır; Google kabulü varmış gibi raporlamaz.

## Uygulanan hazırlık

Gerçek önizlemede2 (0.1.0)/target36, Yayınlamaya hazır/0 uyarı doğrulandı. Son Kaydet seçildi; “Yaptığınız değişiklik kaydedildi… Yayınlama özeti sayfasına gidin” mesajıyla sürüm onayı kaydedildi. Yayın özetinde aynı Alpha0.1.0(2),Türkiye,test listesi ve önceden hazırlanan mağaza/beyan kapsamı görüldü. Yönetilen yayınlama kapalı tutuldu.

Gönderim öncesi hızlı kontroller başladı. Tek somut engel **Tamamlanmamış reklam kimliği beyanı** idi. Bu, önceki gözlemdeki genel panel/merchant mesajından daha kesin engeldir; fiyat/satıcı hesabı açma işlemine girilmedi.

## Reklam kimliği beyanı

Yüklü AAB ve Play imzalı APK manifest kanıtında `com.google.android.gms.permission.AD_ID` ve AdServices kimlik izinleri yok. `app.config.ts` bunları açıkça engeller; doğrudan istemci Advertising ID API kullanımı eklenmedi. Google Mobile Ads25.5.0 resmi açıklaması Android reklam kimliği toplamayı manifest güncellemesiyle önlemeyi belgeliyor. Bu teknik dayanakla mevcut test sürümü için **Hayır** seçilip kaydedildi; seçili Hayır, devre dışı Kaydet ve “Değişiklik kaydedildi” mesajı doğrulandı.

Bu beyan “hiçbir cihaz tanımlayıcısı işlenmez” anlamına gelmez. App Set ID/SDK tanılama/etkileşim/ağ ve isteğe bağlı push tanımlayıcılarına ilişkin önceki Data Safety/gizlilik beyanları korunur. Reklam içeriyor=Evet ile Advertising ID=Hayır farklı sorulardır. Gerçek reklam/Analytics açılmadı, AD_ID izni eklenmedi, binary değiştirilmedi.

Resmi kaynaklar: [Google Play Advertising ID](https://support.google.com/googleplay/android-developer/answer/6048248), [GMA25.5.0 veri açıklaması](https://developers.google.com/admob/android/privacy/play-data-disclosure), özellikle Android ad ID koleksiyonunun manifestten engellenmesi bölümü. SDK'nın diğer otomatik tanımlayıcı davranışları bu teknik önlemle yok sayılmaz.

## Güncel işlem durumu

Beyan sonrası hızlı kontrol engeli kalktı ve “14 değişikliği incelemeye gönder” etkinleşti. Mevcut kapsam tekrar okundu,14 değişiklik onay penceresi açıldı ve “Değişikliği incelemeye gönder” seçildi. Yeni sözleşme/finans/kimlik/ödeme profili veya farklı paket/kitle adımı çıkmadı.

## Google incelemesine alınan gönderim

Son onaydan sonra yayın özeti başlığı **İncelenmekte olan değişiklikler** oldu. İlk gözlemde hızlı otomatik kontroller sürüyordu; son kontrolde bu aşama tamamlandı ve Console “Değişiklikleriniz şu anda inceleniyor” gösterdi. Gönderim etkinliği ve ayrıntısında **Gönderim 1**, **14 değişiklik**, **31 Ekim 2026 14:12 (Europe/Istanbul)** ve **İncelemede** doğrulandı. Son durum **Google incelemesinde**; incelemenin bittiği veya dağıtımın açıldığı ileri sürülmez.

[Gerçek Console gönderim ayrıntısı](https://play.google.com/console/u/0/developers/7664498455265286877/app/4972691036167063391/publishing/submission-activity/1/details). Son doğrulama: 2026-10-31 11:15:16 UTC / 14:15:16 Europe/Istanbul. Console gönderim zamanı dakika hassasiyetindedir. Alpha satırındaki “Tam kullanıma sunma işlemini başlat” ifadesi bu kapalı test kanalı içindedir; herkese açık Production yayını değildir.

Gönderim kapsamındaki ana satırlar: Alpha0.1.0(2),Türkiye,test adlı2 adresli liste, geri bildirim kanalı,Türkçe mağaza girişi,IARC,13+ hedef,gizlilik URL'si,Reklam Evet,Data Safety,sağlık özelliği yok ve Soru Cevap oyun kategorisi. İki sentetik incelemeciye ait önceden onaylı özel erişim talimatları korunur. Genel kayıt/push veya gerçek reklamlar açılmadı.

Yönetilen yayınlama kapalı kaldı; Google kabul ederse yalnız mevcut kapalı kitleye açılma izni kullanıcıdan alındı. Henüz kabul/ret veya etkin opt-in bağlantısı doğrulanmadı.12 gerçek opt-in/14 gün tamamlandı denmez. Play-signed runtime/fiziksel Samsung/ses/native OAuth/iOS ve16KB kernel eksikleri [planın](alpha-review-submission-plan-20261031.md) parçası olarak açık kalır.

Main, Vercel Production, Supabase/veritabanı/Auth, gerçek kullanıcılar, uygulama binary'si, imza anahtarları ve gerçek reklam/Analytics ayarları bu turda değişmedi. Tek-build kapısı false; ikinci AAB üretilmedi.
