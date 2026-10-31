# Kapalı test gönderim durumu — 31 Ekim 2026

**HENÜZ YAYINLANMADI.** Onaylı versionCode2 AAB mevcut **Alpha taslağına yüklendi ve kaydedildi**. Google incelemesine gönderilmedi, kapalı test kullanıma sunulmadı;14 günlük süre başlamadı.

## Hazır ve doğrulanan

- [Taslak PR #20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20), PR #17/#18 zincirini korur. Son runtime kaynak `a506f87`: Realtime kanal yeniden abonelik çökmesi giderildi; mevcut polling ve erişim kuralları korunur.
- [EAS APK bc3c86f5](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/bc3c86f5-e326-4984-8b19-4173282c742d), aynı EAS imzasıyla veri silmeden güncellendi. Android14/API34'te18/18 düzen kontrolü, gerçek solo quiz ve test reklam kanıtı [native raporda](native-retest-20261031.md). Önceki d33a APK kabul dışı.
- [AAB7d8591e7](closed-test-aab-run-20261031.md) FINISHED; kaynak8d13fc2,0.1.0/code2,target36,SHA `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a`. İmza/bundletool/statik16KB ve kabul APK'sıyla Hermes/native/ses eşleşmeleri PASS. AAB kaynaklı yerel debug APK API36'da18/18 düzen, gerçek quiz/sonuç/kaynaklı inceleme/kayıt kalıcılığı doğrulandı. Toplam36 düzen durumu fiziksel veya Play-signed runtime kabulü değildir.
- Son kaynak kontrolleri378/378 `pnpm check`, TypeScript/lint/soru bütünlüğü, web ve Android Hermes export PASS. Bu son devam yalnız belge/kanıt günceller; testler yeniden yapılmış gösterilmez.
- Kullanıcı **yalnız taslak AAB upload** izni verdi. [Gerçek Console sonucu](play-draft-upload-result-20261031.md): paket2/target36 kabul edilip taslak kaydedildi. Liste seçimi kaydedilip reload sonrası doğrulandı; önizleme **Yayınlamaya hazır**,0 görünen hata/uyarı. Önceki tek testçi uyarısı kalktı. Önizlemedeki son Kaydet/onayla veya Google'a gönder seçilmedi.
- Console “16 KB'ı destekler” gösteriyor. Resmi Play-signed universal APK indirildi; gerçek imza, package/version ve16KB LOAD/ZIP doğrulandı. Hermes+52 native64 onaylı AAB ile aynı. [Statik kanıt](play-signed-static-evidence.json). Play APK SHA `521cf17d853426b45ecc3684e098f3303eaa8a721aaa6cef6cc2cd0ade763763`.
- Play anahtarı mevcut ve Kullanımda; EAS upload sertifikasından farklı. Anahtar değiştirilmedi. İndirilmiş Play APK **kurulmadı/çalıştırılmadı**; mevcut telefona üzerine güncelleme garanti edilmez, uygulama sildirilmez.
- IARC açık şart kabulüyle tamamlandı; [bölgesel dereceler](iarc-20261031.md).13–15/16–17/18+ hedef,10 tür Data Safety ayrıntıları, mağaza metinleri ve AI kaynak etiketleri kaydedildi. İşletme ayrı dinî inanç profilleme olmadığını doğruladı. Panel12/13; fiyat sayfası Ücretsiz, merchant açılmadı. Bu sayılar inceleme onayı değildir.
- Önceden ayrı onaylanan iki sentetik incelemeci oyuncusu ve özel Console erişim kayıtları hazır; özel parola/oturum verileri Git dışında. Gerçek hesaplara dokunulmadı. [Kapsam](reviewer-access-plan.md).
- Alpha yalnız Türkiye; geri bildirim adresi kaydedilip yeniden yüklemede doğrulandı. Kullanıcı tester e-posta listesinin hazır olduğunu bildirdi. Console'da `test` adlı **2 adresli** mevcut liste Alpha'ya seçilip kaydedildi; reload sonrası seçili ve Kaydet devre dışı. Kanal kurulumu3/4. Kişisel adresler raporlanmadı.

## Yayın öncesi açık işler

1. Mevcut test listesi ve kanal seçimi kayıtlı, ancak yalnız2 adres var. Listeye yazılmak gerçek opt-in değildir; Console'un12 kişinin kesintisiz14 gün şartı henüz sağlanmadı. Etkin katılım linki/yayımlanmış Alpha yok.
2. Fiziksel Samsung/ses, native Google OAuth ve iOS kabulü bekliyor. Play imzalı/korumalı paketin runtime ve mevcut kurulumla uyumluluğu ayrıca test edilmeli.16KB kernel ve Pre-launch report henüz yok; rapordaki kalan reklam senaryoları tamamlandı sayılmaz.
3. Açık P2: açık temada ikincil kişisel rekor yazısı düşük kontrastlı; ana skor görünür. Onaylı binary değiştirilmedi/ikinci build yapılmadı.
4. Fiyat sayfası Ücretsiz iken panel merchant görevi gösteriyor; finans hesabı açılmadı. Bu bir merchant zorunluluğu olarak varsayılmadı; mevcut Alpha formu upload kabul etti.
5. Kesin AAB SHA/Alpha/ülke/tester kapsamı ve kalan kabul eksikleriyle ayrı **incelemeye gönderim/yayın onayı** gerekir. Taslak upload izni bunun yerine kullanılmaz.

Main/Production merge, yeni Supabase/Auth/hesap silme değişikliği, genel push, gerçek reklam/Analytics açılması, gerçek kullanıcı silme veya ücretli işlem yapılmadı. Tek-build kapısı `approved:false`; yeni build izni yok. Özel Console/kimlik bilgileri ve tester adresleri Git dışında kalır.

[İlk Alpha inceleme/gönderim planı](alpha-review-submission-plan-20261031.md) somutlaştırıldı; ayrı nihai onay bekler. Yayın özetinde yönetilen yayınlama kapalı ve Gönder düğmesi gerekli panel adımlarını bekliyor. Son önizleme onayı verilmedi; merchant/finans işlemi yapılmadı.
