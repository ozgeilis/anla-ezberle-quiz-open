# Play Console devam kaydı — 31 Ekim 2026

[PR #20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20), aynı yayın adayı. Güncel durum için [yayın özeti](current-release-status.md) esas alınır. İlk bölüm gün içindeki önceki durumu belgeler; aşağıdaki devam kayıtları kaynak/binary düzeltmesini ve yeni ücretsiz EAS buildini içerir.

## Yapılan

- Mac/Chrome erişimi yeniden kullanılabilir. Mevcut uygulamada devam edildi.
- Finansal özellik sağlamıyor beyanı kaydedildi; uygulamanın oyun XP'si parasal ödül/cüzdan/ürün değildir. Merchant/ödeme hesabı açılmadı.
- Sağlık özelliği yok beyanı kaydedildi. Quiz içeriğindeki sağlık kelimeleri tıbbi uygulama özelliği olarak sunulmadı.
- Panelde bu iki kayıt sonrası **7/13** hazırlık görevi doğrulandı. Bu Google incelemesi veya dağıtım kabulü değildir.
- Veri Güvenliği başlangıcı ve 10 veri türü yalnız **kısmi taslak** kaydedildi; amaç/paylaşım/işleme ayrıntıları ve son onay tamamlanmadı. [Form dayanakları](../../store/google-play/tr-TR/data-safety-draft.md).
- Ürün sahibi onaylı ikon ve kategori/avatar/rozet illüstrasyonlarının yapay zekâyla üretildiğini doğruladı. İkon, tanıtım kompozisyonu ve bu illüstrasyonları içeren altı gerçek ekran yakalamasının tamamına AI görsel etiketi kaydedildi. Gerçek yakalamalar sentetik UI olarak yeniden üretilmedi veya rötuşlanmadı; etiket, içerdikleri AI görsel bileşenlerinin kaynağını açıklayan muhafazakâr bir beyan olarak uygulandı.
- Mağaza girişi **İncelenmek üzere göndermeye hazır** durumunda kaydedildi. Sayfa yeniden açılarak sekiz kutunun da seçili kaldığı doğrulandı. Bu yalnız mağaza girişi durumudur; uygulama incelemeye gönderilmedi ve kapalı test yayını başlamadı.

## Bekleyen izin ve bilgiler

1. [İki sentetik incelemeci oyuncusu planı](reviewer-access-plan.md) açık onayla uygulandı; iki özel erişim kaydı Console’da kaydedildi ve yeniden yüklemede doğrulandı.
2. Kullanıcı ADB/UIAutomator yöntemini açıkça istedi. Android 14 emülatörde gerçek UI akışları test edildi; ölçek değişiminde Realtime çökmesi bulundu. Düzeltme sonrası yeni APK kabulü bekliyor.
3. AI kaynak bilgisi ve mağaza görsel etiketleme tamamlandı. Yeni politika/sözleşme kabulü veya incelemeye gönderim yapılmadı.
4. 13–15, 16–17 ve 18+ hedef kitle kaydedildi; panel10/13 görev. IARC ayrı sözleşme kabulü bekliyor. Data Safety ayrıntıları, ülke/tester/track, AAB kabul yöntemi ve nihai gönderim kararları hâlâ bekliyor.

## Değişmeyen sınırlar

Main/Production, Supabase kayıtları/şeması, genel push, gerçek reklamlar ve ayrı Analytics açılmadı. `config/android-store-approval.json` kapısı kapalı. Yeni AAB veya Play yüklemesi yok. APK bağlantısı ve SHA [önceki doğrulanmış kanıtta](final-apk-evidence.json) korunuyor. Fiziksel telefon olmaması nedeniyle test yapılmış gösterilmedi.

## Görsel kanıt

Özel Console PNG'leri Git dışında `play-final-20261031/private-console/` dizininde. Kişisel oturum, kullanıcı kimliği veya sır çıktısı depoya eklenmedi. Gerçek kaynak fotoğraflar ve uygulama varlıkları değiştirilmedi.

## Resmî kaynak kontrolü

31.10.2026 tarihinde [Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=tr), [GMA Legacy25.5.0 veri açıklaması](https://developers.google.com/admob/android/privacy/play-data-disclosure) ve Console'un gösterdiği [AI öğe beyanı](https://support.google.com/googleplay/android-developer/answer/17262077?hl=tr) açılıp okundu. Bu teknik hazırlık bağımsız hukuki veya içerik derecesi onayı değildir.

## AI beyanının kanıtı

Özel `store-listing-ai-saved.png` görüntüsünde 31 Ekim kaydı ve **İncelenmek üzere göndermeye hazır** durumu; `store-listing-ai-labels-persisted.png` ve yeniden açılan AX formunda sekiz seçili öğe doğrulandı. Görüntüler aynı özel Console dizininde tutulur. Ekran yakalamalarının kaynak APK ve piksel hash bilgileri `screenshots-manifest.json` içinde korunur; görsellerin dosyaları değişmedi. AI illüstrasyon kaynağı kullanıcı beyanıdır, bağımsız hak sahipliği incelemesi değildir.

## Yeni APK kabulünü durduran hata

`d33a229f` / `7db5e96` APK SHA doğrulanarak Android14 emülatörde açıldı. Gerçek giriş, arkadaşlık/davet, oda başlangıcı/sonucu, iki solo tur ve yanlış cevap kaynakları doğrulandı. Ancak açık/koyu ve font ölçeği matrisi sırasında 08:52 emülatör saatiyle `AccountInbox`: “cannot add postgres_changes callbacks … after subscribe()” fatal hatası görüldü. Eski APK kabul edilmedi. Ölçümde alınan 15 görüntü tam18/18 başarı sayılmıyor.

`a506f87` ortak abonelik yaşam döngüsü eski kanalın asenkron kapanmasını bekler; konu/oda adı, filtre ve yetkiler değişmez. Başka sahipli/başarısız kanala callback eklemek yerine mevcut polling korunur. Aynı koruma canlı oda aboneliğine uygulanır. Beş yeni regresyon testi, `pnpm check`375/375, TypeScript/lint/soru bütünlüğü ve `pnpm export:web` geçti. İki SVG ondalık gösterimi native uyarı üretmeyecek eşdeğer biçime getirildi.

Yeni test APK build'i `bc3c86f5-e326-4984-8b19-4173282c742d`, kaynak `a506f873d1de17b8bc98804df06f983558e48530`; ilk kayıt sırasında IN_PROGRESS idi; sonradan FINISHED ve18/18 emülatör regresyonu PASS. [Güncel native kapsam](native-retest-20261031.md). Mevcut EAS imzası donduruldu, `ads-preview`, otomatik submit yok. Yeni gerçek native retest tamamlanmadan başarı verilmez.

## Son doğrulama

IARC açık şart kabulüyle tamamlandı; [bölgesel dereceler](iarc-20261031.md). On Data Safety türü işleme ayrıntıları ve son kayıt tamamlandı; önizlemede paylaşım/toplama, HTTPS, hesap silme ve gizlilik URL'si doğrulandı. Kullanıcı ayrı dinî inanç profili çıkarımı olmadığını bildirdi. Panel12/13, tester0, üretime başvuru kapalı. Ücretsiz fiyat sayfası yeniden **Ücretsiz** gösteriyor; panelin merchant görevi için ücretli/ödeme hesabı açılmadı.

Yeni APK `bc3c86f5` FINISHED, kaynak `a506f87`,18/18 emülatör font/tema ve çökme regresyonu geçti. Gerçek Test Ad banner ve yeniden başlatma sonrası yerel kapatma doğrulandı; fiziksel cihaz ve rapordaki diğer native eksikler ayrı kalır. AAB üretilmedi/gönderilmedi. Bu devamda Supabase şeması/güvenlik ayarı değişmedi; yalnız önceden ayrı onaylanan iki sentetik test oyuncusu için kayıt ve test verisi oluştu. Gerçek hesaplara dokunulmadı.

Özel ek kanıtlar: `iarc-completed.png`, `data-safety-saved.png`, `free-price-reverified.png`. Dosyalar Git dışındaki aynı özel Console dizinindedir.

Alpha ülke seçimi kullanıcı onayıyla yalnız **Türkiye** olarak kaydedildi; Hedeflenenler(1) ve kanal kurulumu1/4 doğrulandı. Tester listesi henüz hazır değil; yeni boş/sahte liste açılmadı. Özel kanıt: `alpha-turkey-only-saved.png`.

## Onaylı AAB üretiminin son sonucu

Ürün sahibi emülatör kanıtını yalnız bir AAB üretimi için açıkça kabul etti. EAS7d8591e7 **FINISHED**, kaynak8d13fc2, versionCode2/target36. Gerçek artifact indirildi; bundletool, imza, native16KB statik kontroller ve kabul APK'sıyla bytecode/native/ses eşleşmeleri geçti. Yeni Android16 AVD'de18 düzen durumu, gerçek quiz/sonuç/kaynaklı inceleme ve yeniden açılışta skor/XP kalıcılığı doğrulandı. [AAB raporu ve sınırlamalar](closed-test-aab-run-20261031.md). Önceki “AAB üretilmedi” kayıtları gün içi tarihsel durumlardır.

Onay kapısı tekrar kapalı; ikinci build/Play upload/inceleme gönderimi yapılmadı. Alpha yalnız Türkiye; tester0, grup hazır değil. Main/Production ve sunucu güvenlik ayarları değişmedi. Fiziksel Samsung/ses, native OAuth/iOS, Play-signed ve16KB çekirdek kabulü bekliyor.

## Son devam: Play imzalama ve upload öncesi hazırlık

Mevcut Console'da Play anahtarı **Kullanımda** görüldü; yeni anahtar oluşturma/aktarma/değiştirme yapılmadı. AAB upload sertifikasıyla farklı olan dağıtım sertifikası [sınırlı upload planına](play-draft-upload-plan-20261031.md) kaydedildi. Mevcut APK'nın Play sürümüne veri koruyarak güncellenmesi henüz doğrulanmadı.

Alpha testçiler sayfasında onaylı iş destek e-postası geri bildirim adresi olarak kaydedildi ve reload sonrası görüldü. Liste hâlâ boş; opt-in düğmesi etkin değil. Yeni Alpha formunda yalnız sürüm adı ve kısa Türkçe notlarla paketsiz taslak kaydedildi. Yükle/İleri/gönderim yapılmadı; önceki “sürüm yok” ifadesi bu paketsiz taslaktan önceki gözlemdir. Mevcut Play imzalama ve otomatik koruma ayarlarına müdahale edilmedi. Kullanıcıya gerçek tester listesinin hazır olup olmadığı soruldu; liste uydurulmadı.
