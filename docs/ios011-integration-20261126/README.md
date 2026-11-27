# iOS 0.1.1 entegrasyon hazırlığı — 26 Kasım 2026

**Güncel yayın tercihi:** iOS'ta iki kalıcı turda bir reklam denemesi, yine
kayıttan sonra ve sonuçtan önce. Sonuç butonları reklam açmaz. Bu karar
önceki “her tur” sıklığının yerini alır; ayrıntı IOS012-ROUND-END-ADS.md.

**27 Kasım — güncel 0.1.2 reklam yerleşimi:** iOS reklam denemesi artık tur
kaydı sonrası, sonuç ekranından önce yapılır; Results Home/Replay reklam açmaz.
53 hedefli test, TypeScript ve lint geçti; yeni yerleşimin fiziksel kabulü
henüz yapılmadı. [Güncel davranış, dosyalar ve test sınırları](IOS012-ROUND-END-ADS.md).
Aşağıdaki sonuçtan çıkış tarifleri ve önceki paket kayıtları tarihsel bağlamdır.

**27 Kasım — 0.1.2 isim/logo:** İslami Quiz adı, sahibinin paylaştığı yeni logo,
merkezi asset export ve mağaza metni taslakları aynı dalda hazırlandı.
[Uygulanan alanlar, exportlar ve test sınırları](BRANDING-012.md).
Canlı mağaza değişikliği, yeni IPA ve bu ad/ikonla fiziksel kabul yapılmadı.

**Yeni iOS 0.1.2 reklam düzeltmesi:** `6816a42` — kapanış sonrası yeni
interstitial nesnesi/preload, yanıtsız yüklemeden kurtarma. 37 hedefli test,
TypeScript ve lint geçti; aynı oturumda beş tur SDK olay fixture'ıyla sınandı.
Fiziksel iPhone testi yapılmadı. `IOS012-INTERSTITIAL-RELOAD.md` ve
`interstitial-reload-test-results.json` güncel düzeltme kanıtıdır. Önceki
80 test/temiz native build kayıtları önceki kaynağa aittir; bu yeni JS'i
imzalı pakette/canlıda test edilmiş saymaz. Hedef 0.1.2 kullanıcı talimatıdır;
App Store sürüm kaydı/IPA henüz oluşturulmadı.

**Son canlı kontrol:** 0.1.1 / Build 13 Ready for Distribution; Marketing URL
doğru. App Privacy yayımlanmış 17 türle Google SDK manifestini kapsıyor.
Yeni entegre v74 güncellemesi hedefi 0.1.2; Apple sürüm kaydı oluşturulmadı.
Güncel sonuçlar: `FINAL-PREFLIGHT.md`, `GOOGLE-PRIVACY-COMPARISON.md` ve
`V74-CUTOVER-AND-ROLLBACK.md`. Aşağıdaki önceki kabul/plan kayıtları tarihsel
bağlamıyla korunur. Bu oturumda yeni build veya canlı değişiklik yapılmadı.

## Kapsam ve kaynak

Güncel main `1c6a3d876a4ae01661feff22db5823cad4c1b926`.
Tamamlanmış PR #33 `a38d1eabb2144fccac1441aade2da5b60a9ba54a` korunur.
Soru üretilmedi, v74 içeriği veya Hemen Oyna yeniden yazılmadı.
Bu görevin ayrı dalı `integration/ios011-native-source-20261126`;
içerik ve eski iOS worktree'lerine yazılmadı. Main, remote PR tabanları,
Alpha, canlı Supabase, Apple kaydı ve onaylı paketler değiştirilmedi.
IPA, archive veya imzalı dağıtım paketi üretilmedi.

## Doğrulanmış bağımlılıklar ve önerilen sıra

Canlı GitHub metadata özeti `pr-inventory.json`; yerel Git merge provası
`merge-rehearsal.json`. Prova yalnız geçici ağaç/commit nesneleri üretir;
main veya herhangi bir uzak dalı hareket ettirmez.

| Sıra | Kaynak                              | Durum / birleştirme koşulu                                                                                                                                                                                                                                                                                 |
| ---- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | #24 Alpha entegrasyonu              | Zaten main'de. #18, #20, #22 ve #23 başları main'in atası; eski açık taslakları yeniden merge etmek gerekmiyor. Kapatılmadılar.                                                                                                                                                                            |
| 1    | #25, `b861d6b`                      | iOS yapılandırması ve Apple giriş temeli; açık/taslak, onaylı merge gerekir.                                                                                                                                                                                                                               |
| 2    | #26, `f04199c`                      | #25 üzerine Apple silme/yetki iptali ve sosyal güvenlik.                                                                                                                                                                                                                                                   |
| 3    | #28, `e443794`                      | #26 üzerine moderasyon kabulü ve beta hazırlığı; güncel privacy metni korunarak çakışma çözülmeli.                                                                                                                                                                                                         |
| 4    | #30, `bec601e`                      | #28 üzerine public istemci config ve UMP/ATT/reklam altyapısı; eski privacy metni main'deki #32 metnini geri almamalı.                                                                                                                                                                                     |
| 5    | `bec601e..3a74086`                  | Hiçbir açık PR'ın inceleme aralığında olmayan ek iOS sürüm kuyruğu. ATT ilk-açılış düzeltmesi `d074f2c`, tur başına reklam `d46eefc`, native Google istemcisi `4ab72e9`, tur bildirimi düzeltmesi `3a74086`; ayrıca kanıt belgeleri var. Bu aralık için inceleme/birleştirme köprüsü gerekli. Atlanmamalı. |
| 6    | #33, `a38d1ea`                      | Tabanı main değil `content/question-bank-3000-base-20261126` = `3a74086`. Önce kuyruk main'e ulaşmalı, sonra #33 doğru main tabanına yönlendirilip farkı yeniden doğrulanmalı. Mevcut tabanına merge etmek main'e entegrasyon değildir.                                                                    |
| 7    | Native kaynak düzeltmesi, `c01884a` | Ignore + özgün Swift/podspec + paketleme testi; bu izole dalda hazır. Alternatif olarak native Google kuyruğuyla birlikte, #33'ten önce alınabilir.                                                                                                                                                        |

Zincir ancestry'sini koruyan merge commit'leri veya bilinçli yeniden tabanlama
kullanılmalı. Sırayı doğrulamadan squash edip alt PR'ları eski tabanda bırakmak,
aynı değişiklikleri tekrar taşır. #27, #29, #31 ve #32 zaten main'dedir.

İzole entegrasyon dalında `db0b516`, güncel main'i içeriğe birleştirir;
tek içerik çakışması `src/app/privacy.tsx` olup main'deki 9 Kasım açıklaması
birebir korunur. `public/app-ads.txt` de main'den gelir. Bunun main'e merge
edildiği iddia edilmez; başka dallara/PR'lara uygulanmadı.

## Native kaynak kök nedeni ve çözüm

`.gitignore` ve `.easignore` içindeki sınırlandırılmamış `ios/` kuralı,
`modules/google-native-signin/ios/` dizinini de dışlıyordu. Commit `4ab72e9`
yalnız Expo modül tanımını ve JS/config/plugin/testi kaydetmişti; native dosyalar
ayrı iOS worktree'sinde kalmıştı. Bu, önceki ENOENT test hatasının nedeni.

İki ignore dosyasında yalnız `/ios/` ve `/android/` kullanılır. Kök native
projeler CNG çıktısı olarak dışarıda kalır; elle yazılmış yerel Expo modülü
Git ve EAS paketlemesine girer. Özgün Swift ve podspec, eski worktree'den
birebir alınıp `c01884a` commit'ine kaydedildi. Kod veya SDK sürümü değiştirilmedi:

- Swift SHA256: `1536cf1fb3747cb1ac70c80a1f21e060c65cb39a2c378ee1f96e84a1ee348604`
- podspec SHA256: `b3110e6a222f076443b316ef069e1b9c0822df11f998676e286934358d795f91`

Bu kaynakları config plugin içinde metin olarak yeniden üretmek yerine takip
etmek, Expo'nun yerel modül yaklaşımıdır. Mevcut plugin yalnız Google'ın
Objective-C bağımlılıkları için modular headers ekler; davranışı değişmedi.

Resmî kaynaklar:

- https://docs.expo.dev/workflow/customizing/
- https://docs.expo.dev/workflow/continuous-native-generation/
- https://expo.dev/blog/how-to-add-native-code-to-your-app-with-expo-modules

## Temiz kaynak doğrulaması

Ayrı detached worktree:
`/Users/ozge/.local/share/anla-quiz-build/anla-ezberle-ios011-clean-checkout-20261126`
Kaynak commit: `db0b516`. Eski `ios/`, Pods veya DerivedData kopyalanmadı;
prebuild, Pod kurulumu ve derleme dizini sıfırdan üretildi. JS paketlerinin
aynı lockfile'a ait mevcut node_modules'u ve CocoaPods indirme önbelleği yeniden
kullanıldı. Bu, ağdan sıfır bağımlılık kurulumu testi değildir; uygulamanın
Git dışı Swift/podspec dosyalarına veya eski native build çıktısına dayanılmaz.

- Expo prebuild: GEÇTİ; package.json değişmedi.
- Expo Apple autolinking: GEÇTİ; GoogleNativeSignIn temiz checkout modül yoluna bağlandı.
- Android autolinking: GEÇTİ; Apple-only modül Android'e eklenmedi.
- Pod install: GEÇTİ; GoogleNativeSignIn 1.0.0 / GoogleSignIn 10.1.0 bulundu.
- Üretilen URL scheme'leri: uygulama deep link'i ve Google reversed-client-ID mevcut.
- Apple Sign-In entitlement, ATT metni ve delayed AdMob measurement mevcut.
- Xcode Release arm64 simülatör derlemesi: **GEÇTİ**, 480 saniye, exit 0 / BUILD SUCCEEDED; GoogleNativeSignInModule.swift temiz checkout yolundan derlendi. `clean-build-evidence.json` log/hash ve binary kanıtını içerir.

Derleme imzasızdır, test reklam yapılandırması ve sentetik public istemci
bağlantısı kullanır; gerçek sunucu girişi veya production paket kabulü değildir.
Distribution imzası, IPA ve upload kapsam dışıdır. Disk 3 GiB rezervinin
altına yaklaşırsa kontrol durur; eski build/cache/simülatör silinmez.

## Birlikte çalışma ve hedefli testler

80 hedefli test geçti (0 başarısız): Google native + PKCE, Apple giriş/silme,
mevcut hesap silme, public istemci config, iOS reklam/UMP/ATT koşulları,
Hemen Oyna, v74 kayıt/puan ve XP seviyeleri. Tam TypeScript ve değişen testin
ESLint'i geçti. Bu görev tam eski paketi tekrar çalıştırmadı.

Yeni paketleme regresyonu, gerçek Git indeksindeki Swift/podspec'i okur;
Git ve EAS ignore kurallarını izole geçici depolarda uygulayıp modülü koruduğunu,
kök native projeleri ve gizli dosyaları dışladığını doğrular. Önceki native
ENOENT testi artık 3/3 geçti.

`source-equality.json`, Google/Apple Auth, reklam politikası, depolama/XP,
20 saniye, v74 snapshot, Hemen Oyna, app.json/eas.json ve public build resolver
olmak üzere 13 korunan kaynağın PR #33 ile birebir eşitliğini kaydeder.
Özgün native iki dosyanın hash'i de aynı. Canlı kullanıcı/XP yazımı yapılmadı.

PR #33'ün önceki gerçek Chromium kanıtı korunur: 320/390 açık/koyu, 50 soru,
20 saniye, kaydetme/yeniden açılış ve dört kategori. Bu görev fiziksel cihazda
Google veya Apple girişini tekrar gerçekleştirmiş sayılmaz.

## 0.1.1 Marketing URL / reklam ve paket durumu

11 Kasım yerel kayıtları (`docs/app-review-20261111/IOS011-PLAN.md` ve Git dışı
`ios-011-20261111/verified-artifact.json`) 0.1.1 (12), Validated,
Marketing URL `https://anla-ezberle-quiz.vercel.app`, seçili build ve manuel yayın
hazırlığını kaydeder. Bu kayıt bugünkü App Store Connect durumunun yeniden
sorgulandığı anlamına gelmez; inceleme/yayın ve Developer Website görünürlüğü
bu görevde canlı doğrulanmadı.

Build 12, Build 10 native'inden ve iki reklam sıklığı dosyasından hazırlanmıştı;
native Google modülü ve 3.000 soru/Hemen Oyna güncellemesi onda yoktur.
Ayrıca eski yerel 0.1.1 (13) native arşivi mevcut; korunur. Bu da bu görevin
v74 paketi değildir. Eski IPA'yı yeni entegre kodu içeriyormuş gibi kullanmayın.

`d46eefc` zaten iOS sonuç çıkışında ilk kaydedilmiş turdan itibaren hazır
interstitial deniyor; beş dakika/üç tur yalnız Android dalında korunuyor.
Soru/aktif oyun, kayıt tamamlanması, aynı sonuç için tekrar, foreground,
UMP/ATT, NPA ve G sınırı korumaları değişmedi. Kod yeniden değiştirilmedi. Mevcut iOS canlı reklam resolver sonucu, Build 12 kanıtındaki App ID/birim ve davranış alanlarıyla birebir eşleşti; `production-config-comparison.json` yalnız config kabulüdür, reklam isteği veya gelir testi değildir.

Kaynak app.json varsayılanı hâlâ 0.1.0/prototip kimliktir; kayıtlı Store
kimliği ortamla seçiliyor. EAS ios-testflight test reklam profilidir; gerçek
reklamlı Store adayında ayrıca doğrulanmış canlı iOS ortamı gerekir.
İleride yetkili paket aşamasında 0.1.1 ve Apple'da kullanılmamış build numarası
sabitlenmeli, doğru public Supabase config'in final JS'e gömüldüğü doğrulanmalı.
Approval kapıları false bırakıldı; önceki paket kabulü yeni entegre kodun
kabulü gibi taşınmadı. Yeni paket bu görevde üretilmedi.

## Yayın öncesi açık riskler

1. Yukarıdaki PR sırası ve eksik iOS kuyruk aralığı incelenip onayla main'e alınmalı.
2. Native kaynak derleme kanıtı gerçek Google/Apple/OAuth sunucu kabulünün yerini tutmaz.
3. Yeni 0.1.1 paketi iPhone 11'de aşağıdaki kısa listeyle kabul edilmeli.
4. v74 sunucu migration/staging/aktivasyonu canlıya uygulanmadı; çevrimiçi
   yeni v74 havuzunu açmak ayrı sunucu planı/onayı gerektirir. Eski maçlar kendi
   bankasında korunur; yerel v74 çalışması tek başına canlı v74 kabulü değildir.
5. Marketing URL / Developer Website ve AdMob crawler/app-ads doğrulaması
   ayrı mağaza/AdMob kontrolü bekler; dosyanın varlığı crawler onayı değildir.
6. Apple build/version, üretim reklam ortamı, gömülü public client config ve
   approval kapıları yetkili paket aşamasında doğrulanmalı.
7. **Kapandı:** canlı App Privacy'de 17 tür yayımlanmış; GoogleSignIn'in
   sekiz türünün amaç/kimlik/tracking kapsamı eşleşiyor. PhoneNumber,
   OtherDataTypes ve OtherUsageData zaten ekli, UserID Analytics mevcut.
   Form düzeltmesi gerekmedi. google-sdk-privacy.json önceki gerçek manifest
   kanıtıdır; güncel karşılaştırma GOOGLE-PRIVACY-COMPARISON.md içindedir.
8. Pod kurulumu AppAuth/GTMAppAuth/GoogleSignIn için deprecation uyarısı verdi;
   kurulum başarısız olmadı. Bu görev SDK yükseltmez; release öncesi SDK
   destek/manifest değerlendirmesinde uyarı göz ardı edilmemeli.

## iPhone 11 — kısa kabul listesi (henüz çalıştırılmadı)

- Uygulamayı silmeden yetkili test güncellemesini kur; önce/sonra oyun, XP,
  avatar ve eski skorları karşılaştır. QA'da yalnız test reklamları kullan.
- Mevcut Google hesabıyla native giriş; iptal, yeniden giriş ve uygulamayı
  kapatıp açınca aynı oturum. Başka hesap aktifken sessiz hesap değiştirmemeli.
- Apple giriş/iptal/kalıcılık. Silme-yetki iptali yalnız ayrıca yetkilendirilmiş
  geçici uygulama hesabında; gerçek hesabı silme.
- E-posta kayıt/doğrulama/callback ve şifre sıfırlamayı yalnız yetkili test
  hesabıyla, taze bağlantıyı aynı cihazda kullanarak doğrula. Süresi dolmuş
  bağlantıda güvenli hata olmalı, bekleme ekranında takılmamalı.
- Hemen Oyna: kategori sormadan dört kategorili 10 soru; 20 saniye, doğru/
  yanlış/timeout, önce skor, XP kaydı. Tekrar Oyna ve kategori/zorluk seçimi.
- Eski bir v73 sonucu ve açıklamalarını aç; anahtar/puan değişmesin.
- UMP ardından gerekli ATT; önceki denied/authorized durumda tekrar pencere
  bekleme. Ret/çevrimdışı durumda yerel oyun ve XP çalışsın.
- Her kaydedilmiş iOS turun sonuçtan çıkışında hazır test geçişi en fazla bir
  kez; hazır değilse bekletmeden Home. Soru/sayaç sırasında reklam yok.
- Arkadaş isteği, bildirim ve daveti iki yetkili test oturumuyla dene; engel/
  şikâyet ve hesap silme güvenliği korunmalı. Gerçek oyuncuları kullanma.

Bunlar kabul planıdır, cihazda başarılı test iddiası değildir. Main merge,
canlı sunucu, imzalı paket ve mağaza dağıtımı için ayrı onay sınırları korunur.

## Tamamlanan native kabul

İmzasız, test reklamlı simülatör uygulamasının Bundle ID'si doğru; sürüm/build
0.1.0 (1), kaynak varsayılanıdır ve dağıtım adayı değildir. Google client,
Apple authentication ve test reklam modu gerçek gömülü EXConstants config'inde
doğrulandı; yerel modül ExpoModulesProvider'a dahil. Derleme sonunda yaklaşık
5.6 GiB boş alan vardı. Yeni IPA/Distribution signing/upload yapılmadı.

Simülatördeki 24 gizlilik manifesti, eski device IPA'sındaki 17 manifestle
aynı platform/paket olmadığı için doğrudan boyut veya veri toplama farkı
kanıtı sayılmaz. Google SDK'sının kendi yeni manifest beyanları ayrıca
incelendi ve yayın riski olarak açık tutuldu.
