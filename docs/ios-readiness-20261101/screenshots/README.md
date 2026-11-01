# Gerçek iOS simülatör görüntüleri

Bu klasörde yalnız bu PR'ın native iOS simülatöründen alınmış ekranlar tutulacak. Android görselleri iPhone çerçevesine yerleştirilmez. İzinli olmayan gerçek oyuncu verileri kullanılmaz. Sosyal fixture ekranı kullanılırsa adında `fixture` ve manifestte sentetik olduğu açıkça belirtilir; gerçek servis testi sayılmaz.

Mağaza planı: iPhone'un zorunlu büyük ekran ölçülerinde güncel Apple [screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications/) üzerinden son yükleme doğrulaması. iPad supportsTablet=true olduğundan iPad görselleri de gerekli. Farklı ölçüye büyütülmüş görüntü gerçek cihaz testi diye sunulmayacak.

Önerilen sıra: Ana Sayfa, Kategoriler, Quiz, sonuç/açıklama, Rozetler, Profil. Gerçek Apple giriş ve online oda kabulünden önce bu özellikleri çalışıyor gösteren mağaza görseli üretilmeyecek. Kullanıcı adı, e-posta, kod, JWT, provider ekranı veya özel hesap bilgisi mağaza görseline dahil edilmez.

Simülatörün saati/status barı CLI ile yalnız sunum için düzenlenebilir; bu ağ/cihaz kanıtı üretmez. Test edilen OS/cihaz/commit ve ölçüler raporda ayrıca yazılacak.
