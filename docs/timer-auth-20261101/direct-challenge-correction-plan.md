# Davetten maç oluşturma — ek düzeltme planı (1 Kasım)

## Bulgu ve sınır

20 sn geçişinin `create` işlemi timingVersion=2 isterken mevcut
`player_matchmaking_command` içindeki davet kabulü bu alan olmadan create
çağırıyordu. Sonuç: yeni istemci de `UPDATE_REQUIRED` alır, davet pending
kalır; maç oluşmaz. Önceki geçiş testi doğrudan create/join yolunu kapsadı,
davet üzerinden create yolunu kaçırdı. Önceki başarılı testler bu yolun
başarısı olarak gösterilmez.

Hosted kaynak salt okunur doğrulandı: matchmaking prosrc MD5
`cf3e39c0494f8260131ea3e08eb15d00`; protokol alanı eksik. Yerelde aynı kaynakla
hata yeniden üretildi. Bu ek düzeltme henüz canlıya uygulanmadı.

## İncelenebilir değişiklik

- İstemci `challenge_reply` için de timingVersion=2 iletir.
- Edge aynı işlemde yalnız bu ek alanı kabul eder; Auth, CORS, gizli anahtar,
  diğer işlem listeleri ve hesap silme/push davranışı değişmez.
- Yeni ileri migration mevcut matchmaking tanımının tam hash'ini ve tek
  değişiklik yerini doğrular. Yeni kabulde protokol 2 şartını arar ve iç create
  çağrısına bu alanı ekler. ACL/owner/search_path ve diğer tanım korunur.
- Yeni davet kabulü 20 sn maç oluşturur. Eski istemci pending daveti değiştirmeden
  güncelleme hatası alır. Eski kabul edilmiş zamansız maçın tekrarı, ret ve iptal
  eski protokolle çalışır. Hiçbir eski davet/maç/puan/XP satırı migration ile
  güncellenmez; süre alanı değiştirilemez koruması kalır.

Migration `20261101131615_direct_challenge_timing_protocol.sql` SHA-256:
`5d7b05b6bd4bf3dedf71c6893f9ed07ce013584065b59961977631c165e2466a`.
Yeni Edge kaynak SHA-256:
`ae897270f75f65f3eb3047861b9ceca7026ec26938091b1e0a0ff4bd495a7cff`.
Önceki onaylı/dağıtılmış Edge kaynak SHA-256:
`aaf1ef9ae07cceeed056c95faccb34d3f90c26068d4975f1e33da286733e1ce5`.

## Yerel kanıt

`supabase/tests/direct_challenge_timing.sql` düzeltilmemiş kaynakta
`Timing v2 invitation acceptance failed: UPDATE_REQUIRED` ile başarısız oldu.
İleri migration sonrası geçti: yeni kabul/20 sn alıcı başlangıcı, tekrarın
aynı maçı döndürmesi, eski kabul edilmiş maç, legacy ret/iptal ve service-only
yetki sınırı. Tam izole canonical/20 sn/Google izin listesi/erasure SQL paketi
de geçti. Gerçek hosted davet kabulü bu düzeltme dağıtılmadan geçmiş sayılmaz.

## Ayrı onaydan sonra uygulanacak kapsam

Yalnız Frankfurt `mqyuihiobkomjfipxehj`:

1. Mevcut Edge ve matchmaking kaynaklarını/hash/ACL karşılaştır; sapmada dur.
2. Yalnız yukarıdaki Edge alan genişletmesini mevcut verify_jwt/getUser
   düzenini koruyarak dağıt. Eski SQL ek alanı yok sayar; bu tek başına sorunu
   çözmez.
3. Yukarıdaki tek yeni migration'ı 5 sn kilit sınırı/transaction ile uygula.
4. **Yeni hesap oluşturmadan**, yalnız halen mevcut iki izinli geçici uygulama
   hesabıyla gerçek arkadaş/davet kartı kabulü ve 20 sn maç başlangıcını test et.
   Gönderici olayını yetkili RPC ile oluşturma ile alıcı native/Edge ACK testi
   raporda ayrı belirtilsin; iki fiziksel cihaz testi denmesin.
5. İki geçici hesabın mevcut güvenli silme ekranı üzerinden onaylı temizliğine
   devam et; Google hesabının kendisini veya gerçek uygulama hesaplarını silme.

Main, Vercel Production, Alpha/AAB, testçi listesi, genel Google kayıt/push,
Auth politikaları, reklam ve Analytics kapsam dışıdır. İstemci kodu PR adayı
kalır. Yeni iki hesap sınırı aşılmaz. Hesap silme anındaki kullanıcı onay
adımı korunur.

## Risk ve geri dönüş

Kaynak sapması veya kilit hatası SQL transaction'ını tamamen durdurur.
Edge genişlemesi geriye uyumludur; gerekirse v17 kaynağına döndürülebilir
ancak bu davet sorununu yeniden üretir, çalışan geri dönüş olarak sunulmaz.
SQL commit sonrası sorun varsa yeni kabul testleri durdurulur, eski maçları
değiştirmeyen ileri düzeltme hazırlanır. Tam restore/PITR garantisi yoktur.
Hiçbir eski maçın timing alanı, cevap anahtarı veya kazanımı geri yazılmaz.

Bu belge ek canlı değişiklik izni değildir; önceki dar SHA onayı bu yeni
migration'ı kapsamaz. Test sonrası açık kullanıcı onayı gerekir.
