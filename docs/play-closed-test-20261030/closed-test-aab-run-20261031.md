# Onaylı kapalı test AAB denemesi — 31 Ekim 2026

Ürün sahibi somut planı “Yalnız bu AAB üretimini onaylıyorum” yanıtıyla kabul etti. Fiziksel Samsung/ses/native OAuth/iOS kabulü verilmiş sayılmadı.

- [EAS build7d8591e7](https://expo.dev/accounts/ozgeilis/projects/anla-ezberle-quiz/builds/7d8591e7-b127-49c0-92ad-59288f5d950b)
- Kaynak `8d13fc26b2c68a209970ac226dfb2a6a1d650c59`
- Profil `ads-closed-test`, dağıtımSTORE, versionCode2
- Aynı EAS Android keystore; `--freeze-credentials`, non-interactive, otomatik submit yok
- EAS proje hesabı/ücretsiz kota akışı; ücretli yükseltme yapılmadı
- İstek kabul edildi; ilk durumNEW. **AAB sonucu henüz doğrulanmadı.**

Build snapshot onaylı dosyayı içerir. Upload tamamlanıp buildID alındıktan sonra yerel/PR kapısı yeniden `approved:false` yapıldı; bir sonraki build için kalıcı açık izin bırakılmadı. Onay dayanağı ve tüketen build kimliği korunur. Bu kapatma yüklü snapshot'ı değiştirmez.

Son kaynak378/378 check geçti. Standart kapı testleri gerçek dosyanın daima false olduğunu varsaymadan bağımsız fixture ile onaysız iki profili reddeder; sadece kapalı test onayı production profilini açamaz.

Main/Production veya Supabase değişikliği, gerçek reklam/Analytics, Play yükleme/inceleme gönderimi yok. Derleme bitince artifact SHA, imza/manifest/sürüm ve16KB denetimi bu kayda eklenecek.
