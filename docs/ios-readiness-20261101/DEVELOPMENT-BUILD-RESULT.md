# Yerel imzalı iPhone kabul build'i — 1 Kasım 2026

## Kaynak ve onay

- Kaynak: `2f663edb0c38477e7f7839a1c6fa1d53331e026e`, PR #25. Derleme başlamadan 13/13 GitHub kontrolü SUCCESS.
- Sahibi yalnız yerel development planını onayladı. `developmentBuildApproved=true` ile ön kontrol geçti; işlem başlatıldıktan sonra false'a döndürüldü. Store `approved=false` ve bütün dağıtım/nihai kabul kapıları kapalı.
- Uygulama kaynakları değişmedi. Gitignore'lu native proje `ios-development` env ile yeniden üretildi; bu rapor/dokümantasyon değişiklikleri derleme kaynağına yeni uygulama davranışı eklemez.

## Gerçek imzalama ve build

1. Mevcut Keychain Development identity'si sertifika OU/Team ve geçerli private-key eşleşmesi üzerinden doğrulandı. Özel anahtar dışarı çıkarılmadı.
2. İlk `Automatic` + sabit identity denemesi Xcode tarafından conflicting provisioning settings ile **başarısız** oldu. Bu deneme başarılı build sayılmadı.
3. Apple portalında yalnız yeni App ID için **Anla Ezberle Development 20261101** profili oluşturuldu. Type Development, mevcut tek Development sertifikası ve önceden kayıtlı tek iPhone seçildi. Yeni certificate/key veya cihaz kaydı oluşturulmadı.
4. İndirilen profile'ın Team/App ID, tek sertifika fingerprint eşleşmesi, tek cihaz, development APNs ve Apple Default entitlement'ı yerelde doğrulandı. Profil özel yerel Xcode dizininde, Git dışında.
5. Tekrar derleme **Manual** signing, sabit mevcut identity ve bu profile ile çalıştı; bu denemede `-allowProvisioningUpdates` kullanılmadı. `xcodebuild` Release / iphoneos27.1 / arm64, mevcut Xcode27.1; **BUILD SUCCEEDED**.
6. `codesign --verify --deep --strict` geçti. Uygulamanın gerçek imzası ile profile'daki sertifika, mevcut sabit identity ile aynı. Bundle ID `com.kovynelstudio.anlaezberle`, Team `W7CRC43SHP`, version `0.1.0`, build `1`, minimum iOS16.4, family1+2.
7. `application-identifier` doğru. Ayrı Keychain Sharing grubu açılmadı; Apple'ın [varsayılan Keychain grubu](https://developer.apple.com/documentation/security/sharing-access-to-keychain-items-among-a-collection-of-apps) uygulama kimliğidir. İlk doğrulayıcının açık `keychain-access-groups` zorunluluğu bu nedenle düzeltildi; ekstra paylaşım entitlement'ı eklenmedi. Gerçek cihazdaki giriş ekranı ayrıca kontrol edildi.
8. Mikrofon/ATT/background audio izni yok. iOS reklamları off, native AdMob kimliği resmî sample, measurement geciktirilmiş. Apple provider veya gerçek push açılmadı.

## Yerel çıktılar

- `.app`: `/Users/ozge/.local/share/anla-quiz-build/ios-readiness-20261101/DerivedData/Build/Products/Release-iphoneos/AnlaEzberle.app`
- Özel build logu: `/tmp/anla-ios-device-build.log`; indirilmiş provisioning, cihaz ID'si ve public certificate'lar Git'e eklenmedi.
- Gömülü JS SHA256: `88144b66f65c98c1f2bc494e1f3c42882d2c6963de77cc7b96bf1e812fe3a45d`.
- Makinece okunabilir sonuç: [development-artifact.json](development-artifact.json).
- Yeni runtime indirilmedi; yalnız kendi eski simülatör Intermediates/ModuleCache temizlendi, önceki simulator `.app` Products korundu. Native prebuild temizlenen kendi `ios/` çıktısı için Pods'u mevcut kaynak/cache üzerinden tekrar kurdu.

## Fiziksel iPhone 11 / iOS27.2 — sınırlı kabul

| Kontrol | Sonuç |
|---|---|
| Yeni bundle'a kurulum | GEÇTİ; `devicectl` install success ve cihaz metadata'sında exact ID/version/build |
| Açılış | GEÇTİ; sahibi beyaz ikonlu yeni uygulamanın sorunsuz açıldığını belirtti; gerçek ekran izlendi |
| Quiz / sayaç | GEÇTİ (örnek); gerçek fiziksel ekranda soru5/10 sayaç00:20, kaydedilen soru6/10 sayaç00:18; tüm modların fiziksel kabulü değildir |
| Gerçek yerel kazanımlar | Home ekranında son skor600, XP60/100, seviye1 ve 2/82 rozet görüldü; sahte veri üretilmedi |
| Güvenli depo başlatma / giriş UI | GEÇTİ; sahibi Arkadaşlarınla Oyna → Giriş yap ekranını açtı, ekranda eski unsigned -34018 depo hatası yok. E-posta/şifre alanları boş, Google butonu görünür; session yazma/yeniden açılış kalıcılığı testi sayılmaz |
| Apple / Google / e-posta gerçek login ve silme | ÇALIŞTIRILMADI; yeni hesap oluşturulmadı, parola/kod toplanmadı, Apple provider kapalı |
| APNs / gerçek ses / sosyal maç / davetler | ÇALIŞTIRILMADI; önceki simülatör/Android testleri fiziksel kabul yerine sunulmaz |
| Eski prototip | Ajan uninstall/restore komutu çalıştırmadı. Ön kontrolde vardı, son listede yoktu; sahibi **kendisi sildiğini** açıkça doğruladı. Korundu/ilerleme taşındı diye raporlanmaz; veri geri yükleme yapılmadı |

Gerçek fiziksel PNG'ler `screenshots/physical-iphone11-*.png`, 828×1792; manifestte fiziksel olarak ayrılmıştır. App Store görseli veya bütün iOS test matrisinin tamamlanması değildir. Telefonun mevcut Text Size1 ayarı korundu; bu oturumda normal/%150/%200 fiziksel matris çalıştırılmadı.

## Açık kalanlar

Apple login/deletion/revocation ve kayıt hook'u güvenliği, moderasyon/report/block, gerçek Safari callback ve oturum kalıcılığı, fiziksel ses/APNs/sosyal kabulü hâlâ açık. İki uygulamanın aynı custom scheme'i paylaşması tasarım riski devam eder; sahibinin prototipi silmesi bu riski genel çözümle kapatmaz. Backend/Associated Domains/redirect ayarı değiştirilmedi.

TestFlight için App Store provisioning/Distribution sertifikası ve **ayrı imzalı store build onayı**, sonrasında ayrıca upload/dağıtım onayı gerekir. Bu çalışma yalnız development `.app` üretti ve tek iPhone'a kurdu; TestFlight IPA, upload, internal tester veya App Store yayını yapılmadı. Main, Android Alpha, Supabase, gerçek reklamlar ve Analytics değişmedi.
