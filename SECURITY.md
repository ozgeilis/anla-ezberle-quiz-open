# Güvenli yerel çalışma

Bu yeni ana depo PUBLIC olarak doğrulanmıştır; yalnız depo sahibinin talimatıyla sınırlı Actions kontrolleri etkinleştirilir. Üretim, dağıtım ve gizli verilere erişim bu yetkinin kapsamında değildir. Görsellerin yeniden dağıtım izinleri henüz doğrulanmamıştır; [görsel provenansı](docs/ASSET-PROVENANCE.md) bir PUBLIC yayın veya hukuki uygunluk onayı değildir.

## Gizli bilgiler ve kişisel kayıtlar

- `.env.example` yalnız boş istemci ayarlarını içerir. Gerçek `.env`, yönetici/service-role anahtarları, SMTP/dağıtım token'ları ve test hesaplarını Git'e eklemeyin.
- Yönetici anahtarını `EXPO_PUBLIC_*` içine veya uygulama/Metro dizinine koymayın. Publishable anahtar, yönetici anahtarı yerine geçmez.
- Tarayıcı oturumları, HAR dosyaları, DB dökümleri, özel SQL, ekran görüntüleri ve test raporlarını depo dışında veya gitignore kapsamındaki yerel dizinlerde tutun. Gerçek hesap yerine sentetik fixture kullanın.
- `.gitignore` daha önce izlenen bir dosyayı veya Git geçmişini temizlemez. Her push öncesi staged dosyaları ve gönderilecek commit'leri ayrıca denetleyin. Şüpheli bir secret bulunursa değeri rapora yazmayın; push'u durdurup anahtar iptal/yenilemesini planlayın. Geçmişi izinsiz yeniden yazmayın.
- Hata bildirirken JWT, çerez, parola sıfırlama bağlantısı, gerçek e-posta veya oyuncu kaydı paylaşmayın. Güvenlik açığını herkese açık issue/PR yerine depo sahibine özel kanaldan bildirin.

## Korunan sınırlar

Çevrimdışı soru cevapları içerik verisidir; sunucu yetkilendirmesi yerine kullanılmaz. Dinî içerikte `approved` etiketi bağımsız uzman doğrulaması anlamına gelmez. Bu güvenlik çalışması soru bankasını, kayıtları, skor kurallarını veya Supabase yapılandırmasını değiştirmez.

Actions yalnız PUBLIC depo koşuluyla `.github/workflows` altındaki incelenmiş kontrolleri çalıştırır. Üretim sırları eklenmez; geçici yerel Supabase anahtarları yalnız runner ömründe kullanılır ve yüklenmez. PRIVATE depoda runner ayırmayın. Güncel sınırlar [CI belgesindedir](ci/README.md).
