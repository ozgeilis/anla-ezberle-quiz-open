# Güvenli yerel çalışma

Bu depo PRIVATE kalır. Görünürlüğü değiştirmek veya CI'ı etkinleştirmek ayrı depo sahibi onayı gerektirir. Görsellerin yeniden dağıtım izinleri henüz doğrulanmamıştır; [görsel provenansı](docs/ASSET-PROVENANCE.md) bir PUBLIC yayın veya hukuki uygunluk onayı değildir.

## Gizli bilgiler ve kişisel kayıtlar

- `.env.example` yalnız boş istemci ayarlarını içerir. Gerçek `.env`, yönetici/service-role anahtarları, SMTP/dağıtım token'ları ve test hesaplarını Git'e eklemeyin.
- Yönetici anahtarını `EXPO_PUBLIC_*` içine veya uygulama/Metro dizinine koymayın. Publishable anahtar, yönetici anahtarı yerine geçmez.
- Tarayıcı oturumları, HAR dosyaları, DB dökümleri, özel SQL, ekran görüntüleri ve test raporlarını depo dışında veya gitignore kapsamındaki yerel dizinlerde tutun. Gerçek hesap yerine sentetik fixture kullanın.
- `.gitignore` daha önce izlenen bir dosyayı veya Git geçmişini temizlemez. Her push öncesi staged dosyaları ve gönderilecek commit'leri ayrıca denetleyin. Şüpheli bir secret bulunursa değeri rapora yazmayın; push'u durdurup anahtar iptal/yenilemesini planlayın. Geçmişi izinsiz yeniden yazmayın.
- Hata bildirirken JWT, çerez, parola sıfırlama bağlantısı, gerçek e-posta veya oyuncu kaydı paylaşmayın. Güvenlik açığını herkese açık issue/PR yerine depo sahibine özel kanaldan bildirin.

## Korunan sınırlar

Çevrimdışı soru cevapları içerik verisidir; sunucu yetkilendirmesi yerine kullanılmaz. Dinî içerikte `approved` etiketi bağımsız uzman doğrulaması anlamına gelmez. Bu güvenlik çalışması soru bankasını, kayıtları, skor kurallarını veya Supabase yapılandırmasını değiştirmez.

Actions depo ayarında kapalıdır. Şablonlar `ci/workflows/*.yml.disabled` altında tutulur; `.github/workflows` içine kopyalanmaz. PRIVATE depoda kota tüketen workflow başlatmayın. Gelecekteki ayrı etkinleştirme planı [CI belgesindedir](ci/README.md).
