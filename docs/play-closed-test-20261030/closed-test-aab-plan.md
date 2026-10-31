# Kapalı test AAB — onay bekleyen somut plan

31 Ekim 2026 · [PR #20](https://github.com/ozgeilis/anla-ezberle-quiz-open/pull/20). **Yalnız hazırlık; AAB üretimi veya gönderimi başlamadı.**

## İncelenebilir kabul kanıtı

- [EAS APK bc3c86f5](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/bc3c86f5-e326-4984-8b19-4173282c742d), kaynak `a506f873d1de17b8bc98804df06f983558e48530`.
- APK SHA-256 `aac0b20c92e0268800312447a7f84deb3a427a7e1b68b8741efd5697fd64165f`.
- [Gerçek Android14 emülatör retesti](native-retest-20261031.md):18/18 genişlik/font/tema, yeni fatal0, gerçek quiz/sonuç, UMP hazırlama, banner ve interstitial gözlemleri. Fiziksel Samsung, ses duyulabilirliği, native OAuth/iOS ve belirtilen diğer kabul eksikleri yerine geçmez.
- Son profil değişikliğiyle `pnpm check`378/378, TypeScript/lint/soru bütünlüğü, web export ve Android Hermes export başarılı. Önceki testlerde başarısızlık gizlenmedi; hata düzeltildikten sonra tüm check tekrar çalıştırıldı.

## Hazırlanan profil

`ads-closed-test`, mevcut `production` profilinden store/AAB, release-client ve otomatik versionCode artırmayı alır. EAS ortamı özellikle **preview**: kabul APK'sında kullanılan mevcut Frankfurt yayımlanabilir istemci yapılandırması ve Google Services dosyası korunur. Boş production ortamına yeni sır/ayar kopyalanmaz. `EXPO_PUBLIC_CONTENT_CHANNEL=production` aktif banka seçimini korur; yeni Supabase yayını değildir.

EAS CLI ile iki profil gerçekten çözümlendi. `ads-preview` ile `ads-closed-test` **tüm appConfig alanlarında aynı**; reklam modu test, gerçek reklam kapalı, EEA zorlaması kapalı. [Değerleri açıklamayan yapılandırma kanıtı](closed-test-profile-evidence.json).

Yalnız resmî Google TestIds kullanılabilir. Genel `production` profili reklamları kapalı tutar. Test profilinin farklı parent/ortam, dağıtım, APK, debug coğrafya veya canlı reklam override'ları regresyon testleriyle reddedilir. İki store profili de aynı `config/android-store-approval.json` onayını ve istemci ortam kontrollerini zorunlu kılar; kapı **hâlâ false**. Onay kaydının `approvedProfile` değeri çalıştırılan profille aynı olmak zorunda; kapalı test onayı genel production profilini açmaz. Ayrı geçici test dosyalarıyla olumlu/olumsuz profil ve paket/sha kapıları doğrulandı. Yeni profil kapıyı aşmaz.

## İstenen sonraki izin kapsamı

1. Ürün sahibinin, belirtilen APK SHA ve belgelenmiş emülatör kanıtını **yalnız kapalı test AAB üretimi için** kabul edip etmediğini açıkça belirtmesi gerekir. Fiziksel test yapılmış gibi kayıt tutulmaz; kabul dayanağı ve kalan eksikler ayrıca belgelenir.
2. Onay gelirse yalnız bu kaynak/profil için onay kaydı hazırlanır ve mevcut EAS Android imzası dondurularak aşağıdaki komut çalıştırılır. Yalnız mevcut ücretsiz kota kullanılabilir; ücretli devam/plan yükseltme yapılmaz.

```sh
pnpm dlx eas-cli@25.3.0 build --platform android --profile ads-closed-test \
  --non-interactive --freeze-credentials --no-wait --json
```

3. Gerçek AAB bitmeden başarı raporlanmaz. Son artifact SHA, paket, artan versionCode, min/target API, manifest, imza, native bağımlılıklar, secret örüntü taraması ve16KB uyumluluğu ayrıca kontrol edilir. Erişim/kota sorunu varsa işlem durur. `autoIncrement` mevcut uzak Android build sürümünü artırır; bu beklenen ve raporlanacak tek EAS sürüm değişikliğidir.
4. Bu izin main/Production merge, gerçek reklam, Analytics, genel push, Supabase değişikliği, Play yükleme veya sürüm gönderimi izni değildir. AAB SHA hazır olduğunda **yükleme/gönderim için ayrı son onay** gerekir. Google Play App Signing kayıt/şartları ve Pre-launch report erişimi de mevcut duruma göre ayrıca incelenir.

## Mağaza durumu ve risk

IARC/Data Safety/incelemeci erişimi kaydedildi. İlk dağıtım için ürün sahibinin **yalnız Türkiye** seçimi Alpha kanalında kaydedilip doğrulandı; tester listesi henüz hazır değil.12 kişinin kesintisiz14 günlük katılımı başlamadı. Test katılımcıları ile incelemeci için oluşturulan iki sentetik uygulama hesabı aynı sayaç değildir.

Ücretsiz fiyatlandırma sayfası doğrulandı; panelde merchant görevinin kalması, ödeme hesabı açma izni veya gerekliliği olarak yorumlanmaz. Alpha'da Yeni sürüm oluştur etkin; sürüm yok. Dağıtım veya yeni güvenlik yetkisi sessizce açılmaz.

Risk: emülatör fiziksel Samsung'a özgü ses, GPU, OEM veya ağ davranışlarını garanti etmez; native OAuth kabulü tamamlanmadı. Aynı appConfig/paketleme kanıtı AAB'nin kendisinin testini kaldırmaz. Üretim ve gerçek kullanıcılar etkilenmez; onay geri çekilirse kapı yeniden kapatılır, üretilmiş artifact gönderilmez. Otomatik submit yapılandırması yoktur.
