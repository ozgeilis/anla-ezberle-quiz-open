> 1 Kasım güncellemesi: Kullanıcı bu sınırlı backend planını onayladı ve uygulandı.
> Kanıt: [dağıtım kaydı](../xp-notifications-20261101/backend-deployment.md).
> Aşağıdaki metin onaya sunulmuş özgün kapsam/geri dönüş planıdır.

# Onay bekleyen seviye projection geçişi

Yalnız Frankfurt `mqyuihiobkomjfipxehj`; henüz uygulanmadı.
Migration: `20261101065301_progressive_player_levels.sql`.
Tam SHA-256 `migration-sha256.txt` içindedir.

1. Salt okunur fonksiyon kontrolünü tekrar et. 1 Kasımda `social_player(uuid)`
   sahibi postgres, SECURITY DEFINER, boş search_path ve kaynak MD5
   `07adcdefdd04c7bc19589690d6d6eceb` doğrulandı. Farklıysa dur.
2. Onaydan sonra tek transaction migration uygula. Yeni private immutable
   `player_level(numeric)` helper'ı; mevcut `social_player` içindeki yalnız
   `least(100,floor(x.xp/250)+1)` ifadesi değiştirilir. Diğer kaynak/ACL/sahiplik,
   XP toplamı, paylaşım filtresi ve achievement alanları korunur. Kaynak MD5 ve
   tek ifade kontrolü uygulanmadan önce çalışır; sapma halinde rollback olur.
3. Salt okunur 0/99/100/210/330/58410/cap sınırları ve eski/yeni social XP
   eşitliğini, mevcut ACL ve advisor'ları doğrula. Gerçek oyuncu verisini
   test amacıyla değiştirip puan verme. Sentetik test gerekiyorsa yalnız
   ayrıca izin verilen hesaplarla yap.
4. Yeni istemci APK/Preview kabulü. Eski uygulamalar yerel profilde eski eğriyi
   kullanabilir; hesap verisi kaybolmaz, güncelleme sonrasında aynı toplam XP
   yeni seviye olarak görünür. 100 sınırı ve mevcut unvanlar korunur.

Risk/geri dönüş: seviye görüntüsü toplam XP korunarak değişir; yüksek eski
seviyelerde gösterilen seviye düşebilir. Bu XP kaybı değildir. Bir sorun olursa
ayrı incelenen forward rollback, yalnız social projection ifadesini eski eğriye
döndürür. XP/ledger/ödül/geçmiş satırları geri yazılmaz veya silinmez; helper
kalsın. İşlem 5 sn kilit bekleme sınırındadır; tablo schema değişikliği yoktur.

Bu izin main/Production merge, Play AAB yükleme/yayın, soru bankası, genel push,
Auth kayıtlarını açma, gerçek reklam veya Analytics izni değildir. PR #22'nin
süre/Google test planı ayrı belgelenmiştir; birleştirilmiş onay verilirse iki
planın açık kapsamı birlikte uygulanabilir.
