# Gerçek Build 4 simülatör ekranları

3 Kasım 2026, iPhone 16 / iOS 27.0, 1179×2556. Oyun uygulamasının kendi
ekranlarından alındı; Android çerçevesi, sahte skor veya sentetik mockup yok.
Oynanan turlar cihazda gerçek kayıt oluşturdu. JS SHA Build 4 ile aynı.

Ham PNG'ler yerel kanıt dizininde korunur. Buradaki JPEG'ler yalnız opaque
format dönüşümüdür; kırpma, büyütme, yeniden tasarım veya AI düzenleme yok.
Her dosyanın ham/export SHA ve ölçüsü manifest.json içindedir. App Store'a
yüklendiği veya bütün ekran boyutlarında kabul edildiği iddia edilmez.

- Ana sayfa ve kategoriler: çalışmayan sezonluk kartlar görünmez.
- Quiz: gerçek soru, dört seçenek ve 20 saniyelik motorun devam eden sayacı.
- Sonuç: 1 doğru / 9 boş, skor 100, XP 10.
- Açıklamalar: gerçek cevap ve kaynak bağlantıları.
- Profil açık/koyu: günlük tur dahil 2 oyun, toplam 100 skor, 10/100 XP.

iPad 13 ana sayfa, kategoriler ve 20 saniyelik quiz başlangıcı 2064×2752 olarak eklendi; tüm tur ve online kabul değildir. App Store yükleme kontrolü bekliyor. Önceki PR25'in
iPad ve fiziksel iPhone görselleri tarihsel kanıttır; yeni exact Build 4 kabulü
yerine kullanılmaz. Hiçbir giriş bilgisi veya özel kullanıcı verisi içermez.

Build 4 ekranları oyun görsellerini doğrular; bu binary’de çevrimiçi yapılandırma eksikliği sonradan bulundu. Yeni adayın online kabulü bu görsellerden çıkarılmaz. İlk yanlış açılan prototip ekranı dışlandı ve bu manifest/Git klasörüne alınmadı.

Apple sürüm taslağında 7 iPhone ve 3 iPad dosyası işlenmiş olarak doğrulandı; bu App Review gönderimi değildir.
