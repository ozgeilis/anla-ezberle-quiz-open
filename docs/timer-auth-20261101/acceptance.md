# Kabul durumu — 1 Kasım 2026

Adaydır; main, Vercel Production, Alpha, canlı Auth/SQL/Edge Function değişmedi.

| Kontrol | Sonuç / sınır |
| --- | --- |
| `pnpm check` | 384 test geçti; TypeScript, lint, soru kontrolü geçti |
| `pnpm export:web` | Geçti |
| `build-editorial-v73.ts --check` | Geçti; içerik dosyaları değiştirilmedi |
| Yerel PostgreSQL entegrasyonu | İzole, schema-only test veritabanında geçti; eski/yeni süre, RLS, erasure regresyonu dahil |
| Yerel DB lint | Hata yok; değiştirilmemiş fonksiyonlarda mevcut uyarılar var |
| Gerçek web turları | 320/360/390 dp × açık/koyu: altı tam tur; her soru 20'den başlıyor, skor kaydı/reload geçti |
| Sonuç geçişi | DOM commit gözlemcisi altı turda boş oyun/sonuç mesajı görmedi |
| Gerçek yerel Auth/SMTP | Tarayıcı kayıt → Mailpit bağlantısı → PKCE oturumu → otomatik profil → reload geçti |
| Android 14 emülatör | Gerçek native kayıt → yerel SMTP bağlantısını Chrome'da açma → cold-start otomatik profil geçti |
| Android kalıcı oturum | Force-stop/relaunch sonrası doğrulanmış hesap ve çıkış işlemi mevcut; SecureStore korunuyor |
| Android sayaç | Native 00:20; 10 sn sonrası cevap kabulü, arka plan süre aşımı, tam tur sonucu geçti |
| Gerçek Google OAuth | Henüz yapılmadı: özel sunucu izin listesi ve hesap sahibinin yetkilendirmesi gerekiyor |
| Gmail / fiziksel Samsung / iPhone | Bu adayda yapılmadı |
| Canlı oda/düello 20 sn | SQL yerel entegrasyonu geçti; canlı migration dağıtılmadı, mevcut canlı varsayılan 10 sn |

## Sonuç geçişi düzeltmesi

Provider tamamlanan turu yerel kayda yazarken aktif session'ı kaldırıyordu.
Quiz ekranı aynı anda boş oyun metnini gösteriyor, kayıt bitince sonuç rotası
açılıyordu. Son yanıtın session görünümü yalnız bu geçiş süresince korunur.
Kayıt tamamlanmadan yeni oyun ekranına düşmez. Kayıt, puan/XP ve hata halinde
sonucu yeniden kaydetme davranışı değiştirilmedi.

## Android test paketi

Yerel QA release APK SHA-256:
`fbf8d830ae5e3960c151863ceceff6202653193bc5912391bfa7328715d98c8c`.

Paket `com.kovynelstudio.anlaezberle`, yerel QA code 5. Bu numara EAS/Play için
tahsis edilmiş değildir. **Yerel debug sertifikalıdır; mevcut Play/Samsung
uygulamasının üzerine kurulması için dağıtılacak APK değildir.** Yalnız yeni
izole emülatörde kullanıldı. Yerel HTTP Auth için cleartext izni gitignored
native QA dosyasındadır; Expo config'e veya kaynaklara eklenmedi. Yayın paketi
ve canlı kimlik bilgileri değiştirilmedi. Test emülatöründe Chrome kullanım/
çökme paylaşımı kapalı, Google hesabı eklenmedi.

Özel test çıktıları, bağlantılar, parolalar ve tokenlar repo dışındadır.
Ekran görüntüleri `screenshots/` içindedir. Tarayıcı testlerini fiziksel cihaz
kabulü olarak değerlendirmeyin. Backend/Google/Play için sonraki somut plan
`rollout-plan.md` içindedir; ayrı onay gerekir.

## Sonuç geçişi ek kanıtı

Android 14 emülatörde on soruluk tur tamamlandı. Son geçişin 8 saniyelik
ekram kaydında 100 video karesi Vision OCR ile tarandı: boş oyun metni 0,
skor başlığı bulunan 62 kare. Sonuç ekranı ayrıca görsel olarak açılıp incelendi.
Bu yöntem tüm cihazlarda tek karelik hatayı matematiksel olarak dışlamaz; altı
web turundaki DOM commit gözlemiyle birlikte aday regresyon kanıtıdır.
