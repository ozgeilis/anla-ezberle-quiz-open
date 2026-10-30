# Korunan anlam sorusu için karar önerisi — uygulanmadı

ID: `quran-meaning-v72-024`. Aktif v72, tarihsel kayıt ve mevcut aday içeriği bu belgeyle değiştirilmez. Bu soru korunan 30 yeni anlam sorusundan biridir. Mevcut üretici ve regresyon testi bu 30 nesneyi değişmeden korur.

## Mevcut açık

Kök, Mü’minûn 23/3’te müminlerin nelerden yüz çevirdiğini soruyor. Anahtar “Boş ve yararsız işlerden”. Yanlışlar “Haksız kazanç arayışından”, “Kırıcı konuşmalardan”, “Gereksiz harcamalardan”. Bunlar geniş yararsız/zararlı davranış kavramının örnekleri olarak da anlaşılabildiğinden tek kesin cevap bakımından alt küme riski var. Kaydın durumu bu nedenle **bloke**.

## Yalnız yayımlanmamış v73 adayı için öneri

**Kök:** Mü’minûn 23/3’te öne çıkan duyarlılık aşağıdaki konulardan hangisidir?

| Seçenek ID | Önerilen metin |
|---|---|
| o1 | İhtiyaç sahiplerinin hakkının verilmesi |
| o2 — doğru | Söz ve işlerin anlamlı ve faydalı olması |
| o3 | Emanetin ve verilen sözlerin korunması |
| o4 | Yetimlerin mallarının koruma altına alınması |

**Açıklama:** Mü’minûn 23/3, anlamsız ve yararsız söz ve davranışlardan uzak durmayı anlatır. Emanetlere ve verilen sözlere sadakat aynı sûrenin 8. âyetinde ayrı bir nitelik olarak yer alır.

Dört seçenek de olumlu ve ahlâkla ilgilidir; doğru cevap tek olumlu seçenek diye seçilemez. Kök, bütün güzel davranışları değil belirli âyetin doğrudan odağını sorar. Sayısal ezber sorusu geri getirilmez. Bağımsız editörün tek cevap ve kolay seviye kabulü yine gerekir.

## Kaynak karşılaştırması

- [Diyanet Kur’an Yolu Meali](https://dijital.diyanet.gov.tr/File/Download?id=429&path=429_1.pdf), fiziksel PDF sayfa 359 / basılı 358: 23/3, 23/4 ve 23/8 birlikte okundu. PDF SHA-256: `0938e0a5b94234d2a92714e099591f502d9b70bb5cb46ed40ffff086aec7237f`.
- [TDV Mâlâyâni](https://islamansiklopedisi.org.tr/malayani), giriş ve lağv ilişkisi: 96–104. satırlardaki geniş anlam/kapsam karşılaştırıldı. Tam kaynak metni depoya kopyalanmadı.
- İnceleme: 30.10.2026, Codex kaynak karşılaştırması. Bağımsız ilahiyat uzmanı veya yayın onayı değildir.

## Uygulama sınırı

Bu öneri kabul edilirse v72 dosyası ve eski `(id, version=72)` kaydı değişmeden kalır. Yalnız v73 adayında aynı ID için `version=73` içerik oluşturulur; seçenek ID’leri ve `correctOptionId=o2` korunur. Diğer 29 anlam sorusu nesne içeriğiyle aynen kalır. Üreticideki koruma yalnız bu açıkça belgelenmiş istisnayı ve yeni sürümü kabul edecek şekilde daraltılır; eski 30 anlam sorusunun tamamı v72’de korunmaya devam eder.

Bu belge tek başına uygulama izni, main birleştirmesi, v73 etkinleştirmesi, Vercel Production veya canlı Supabase değişikliği izni değildir.
