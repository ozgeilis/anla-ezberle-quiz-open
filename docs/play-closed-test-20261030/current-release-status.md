# Kapalı test gönderim durumu — 31 Ekim 2026

**HENÜZ YAYINLANMADI.** IARC ve Data Safety dahil Console paneli12/13; yeni EAS test APK'sı ve **versionCode2 kapalı test AAB'si hazır**. Ayrı onayla üretilen gerçek AAB doğrulandı; Play'e yüklenmedi.

## Tamamlanan

- [Taslak PR #20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20), PR #17/#18 zincirini korur. Main ve Vercel Production değişmedi.
- Realtime yeniden abonelik çökmesi giderildi: kaynak `a506f873d1de17b8bc98804df06f983558e48530`. `pnpm check`375/375, TypeScript/lint/soru bütünlüğü ve web export PASS; Vercel Preview kontrolü başarılı.
- [Yeni EAS APK bc3c86f5](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/bc3c86f5-e326-4984-8b19-4173282c742d) FINISHED. Aynı paket/imza, target36. Veri silmeden güncelleme, ZIP/52 ELF64 statik16KB kontrolü ve18/18 gerçek Android14 emülatör yazı/tema matrisi PASS; yeni fatal0. [Sınırlı kapsam ve görüntüler](native-retest-20261031.md), [binary kanıtı](realtime-fix-apk-evidence.json). Önceki d33a APK çökme nedeniyle kabul dışı.
- Kullanıcı onayıyla yalnız iki sentetik oyuncu oluşturulup API/native giriş ve sosyal erişim testleri yapıldı. İki özel erişim kaydı Play Console'da kaydedildi; ek Google/iş ortağı cihaz paylaşımı kapalı. Gerçek hesaplar değiştirilmedi. [Kapsam ve kanıt](reviewer-access-plan.md).
- Gizlilik, reklamEvet, resmî kurumHayır, finans/sağlıkYok, kategori/iş iletişimi, mağaza metni ve sekiz AI görsel kaynağı etiketi kaydedildi.
- 13–15,16–17,18+ hedef kitle kaydedildi. Açık IARC şart kabulünden sonra anket tamamlandı: AvrupaPEGI12, Kuzey Amerika13+; [bölgesel sonuçlar ve dayanak](iarc-20261031.md).
- On veri türünün Data Safety ayrıntıları ve son önizlemesi kaydedildi. Kullanıcı ayrı dinî profil çıkarımı/işleme süreci olmadığını doğruladı. Bu, mağazanın yayımlandığı veya Google incelemesinin geçtiği anlamına gelmez. [Beyan dayanakları](../../store/google-play/tr-TR/data-safety-draft.md).
- Ücretsiz fiyatlandırma sayfasında **Uygulamanız: Ücretsiz** ve devre dışı Kaydet doğrulandı. Buna rağmen panel kalan1 görev için satıcı hesabı gösteriyor; merchant/ödeme hesabı açılmadı.
- Genel push, Google yeni kayıt, gerçek reklam ve Analytics kapalı. Hesap silme/oyun backend'i değiştirilmedi; yalnız ayrı onaylı iki test hesabı ve aralarındaki test oyunları oluştu.

## Yayın öncesi açık işler

1. Fiziksel Samsung mevcut değil. Ürün sahibi emülatör kanıtını yalnız bir AAB üretimi için kabul etti; fiziksel kabul bekliyor. Native OAuth/iOS, fiziksel ses ve raporda belirtilen kalan reklam senaryoları tamamlandı sayılmaz.
2. [AAB build7d8591e7](closed-test-aab-run-20261031.md) **FINISHED**, kaynak8d13fc2/versionCode2, SHA `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a`. bundletool/imza/manifest/statik16KB ve kabul APK'sıyla Hermes+52 native64+11 ses içerik eşleşmesi PASS. AAB kaynaklı yerel debug APK Android16 yeni AVD'de18/18 düzen testi, quiz/sonuç/inceleme/kayıt kalıcılığı geçti. API34 EAS APK'sıyla toplam36 düzen durumu; fiziksel veya Play-signed/16KB çekirdek kabulü değildir. Tek-build kapısı yeniden false; Play yüklemesi yok. Açık P2: açık temada ikincil kişisel rekor metni düşük kontrastlı.
3. Ücretsiz sayfası ile paneldeki12/13 fiyatlandırma görevi tutarsızlığı var; bu, ücretsiz test için satıcı hesabı gerektiği şeklinde yorumlanmadı. Alpha sayfasında Yeni sürüm oluştur etkin. Ödeme profili açılmadı.
4. Mevcut Alpha kanalında yayımlanmış sürüm yok. Alpha kanalında yalnız Türkiye kaydedildi ve hedef ülke sayısı1 doğrulandı; tester grubu henüz hazır değil. Ayrı kesin SHA/track gönderim onayı gerekir. 0 tester;12 kişinin kesintisiz14 günlük katılım süresi başlamadı. Üretime başvuru kapalı.

Hiçbir Play sürümü incelemeye gönderilmedi. Main/Production merge, ücretli işlem, gerçek kullanıcı silme veya yeni native iOS dağıtımı yapılmadı. Özel Console, oturum ve kimlik bilgisi kanıtları Git dışında korunur.

## Üretilen artifact ve sonraki plan

[Test reklamlarını koruyan, onay kapısına bağlı AAB planı](closed-test-aab-plan.md) hazır. `ads-closed-test` aynı kabul APK appConfig ve EAS preview ortamını kullanır; genel production reklamları kapalı kalır. Profil hazırlığı378/378 test, web/Hermes export geçti. Onay sonrasında yalnız bu build snapshot'ı için kayıt hazırlanıp istek alındı; kapı yeniden kapatıldı, dayanak/sha korundu.

[AAB final binary kanıtı](closed-test-aab-evidence.json) ve [Android16 görüntüleri/gerçek test sınırları](closed-test-aab-run-20261031.md) hazır. Play App Signing ve kesin SHA/Alpha gönderimi için ayrı onay gerekir; tester grubu henüz hazır değildir. Google Pre-launch report yok.
