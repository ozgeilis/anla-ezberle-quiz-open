# Gerçek iOS simülatör ve fiziksel cihaz görüntüleri

Bu klasörde yalnız bu PR'ın native iOS simülatöründen alınmış ekranlar tutulacak. Android görselleri iPhone çerçevesine yerleştirilmez. İzinli olmayan gerçek oyuncu verileri kullanılmaz. Sosyal fixture ekranı kullanılırsa adında `fixture` ve manifestte sentetik olduğu açıkça belirtilir; gerçek servis testi sayılmaz.

Mağaza planı: iPhone'un zorunlu büyük ekran ölçülerinde güncel Apple [screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/) üzerinden son yükleme doğrulaması. iPad supportsTablet=true olduğundan iPad görselleri de gerekli. Farklı ölçüye büyütülmüş görüntü gerçek cihaz testi diye sunulmayacak.

Önerilen sıra: Ana Sayfa, Kategoriler, Quiz, sonuç/açıklama, Rozetler, Profil. Gerçek Apple giriş ve online oda kabulünden önce bu özellikleri çalışıyor gösteren mağaza görseli üretilmeyecek. Kullanıcı adı, e-posta, kod, JWT, provider ekranı veya özel hesap bilgisi mağaza görseline dahil edilmez.

Simülatörün saati/status barı CLI ile yalnız sunum için düzenlenebilir; bu ağ/cihaz kanıtı üretmez. Test edilen OS/cihaz/commit ve ölçüler raporda ayrıca yazılacak.

1 Kasım 2026 resmî Apple tablosunda zorunlu iPhone sınıfı **Dynamic Island medium** olarak belirtiliyor: 1179×2556 veya 1206×2622 portre; desteklenen iPad için 13-inch 2064×2752 veya 2048×2732. 390 pt iPhone13 Pro'nun 1170×2532 test görseli bu ana sınıfın gerçek ölçüsü diye sunulmaz. iPad ve büyük Dynamic Island görselleri gerçek ilgili simülatörden alınmalı; mağaza kabulü bu ölçülerle Connect'te ayrıca doğrulanmalı. iPhone Duo için Nisan2027 sonrası SDK27.1 koşulu aynı sayfada belirtiliyor; gelecek gönderim tarihinde tekrar kontrol gerekir.

## Bu dalda alınan gerçek kanıtlar

`manifest.json` 15 native PNG'nin SHA256 ve gerçek piksel ölçüsünü kaydeder. iPhone13 Pro 390pt (1170×2532): Home, kategori, hazırlık, quiz, sonuç, açıklama, gerçek tur sonrası profil, koyu ayarlar/bildirim tercihleri, büyük metin Home/Profile ve yeniden açılış. iPad13 M4: gerçek 2064×2752 portrait Home, 2752×2064 landscape profil ve quiz. iPad tam tur ve online akış kabulü değildir. Örnek turdaki yerel kazanımlar gerçekten oynanarak oluştu; hosted hesap veya sahte başarı üretilmedi.

Bunlar ham simülatör PNG'leridir ve alpha kanalı içerebilir. Mağazaya yüklenmiş görseller değildir; nihai App Store yüklemesinde opaque RGB export ve Connect ölçü doğrulaması gerekir. iPhone ana zorunlu Dynamic Island ölçüsü henüz üretilmedi; 390pt görselleri başka cihaz ölçüsüne büyütülmedi.

## İmzalı fiziksel iPhone kabulü

`physical-iphone11-home.png`, `physical-iphone11-quiz.png`, `physical-iphone11-signin.png`: gerçek iPhone11/iOS27.2, 828×1792; Device Hub Screenshot düğmesiyle cihazdan alınmıştır. Yerel gerçek skor600/XP60, sayaç00:18 ve boş giriş formu görünür. Sahibinin oynadığı yeni development uygulamasıdır; Apple/Google login, session kalıcılığı veya bütün cihaz kabulü sayılmaz. Manifestte `actual-physical-iphone11-screenshot` ile ayrılır. App Store zorunlu Dynamic Island ölçülerinin yerine geçmez.
