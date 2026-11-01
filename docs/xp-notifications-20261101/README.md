# Artan seviye ve kompakt bildirim adayı — 1 Kasım 2026

Bu çalışma PR #22'nin `e29e56d` kaydının üzerine ayrı worktree'de hazırlanır.
Süre, PKCE callback, sonuç geçişi ve mevcut logo/reklam/push çalışmaları korunur.
Görevlerin tamamı `../WORK-TRACKER-20261101.md` içinde takip edilir.

## Seviye hesabı

`src/domain/scoring/levels.ts` tüm istemciler için ortak kaynaktır. Seviye L'den
L+1'e maliyet `100 + (L-1)*10`; L'nin başlangıcı
`100*(L-1) + 5*(L-1)*(L-2)` XP'dir. Seviye 100 başlangıcı **58.410 XP**.
100'de çubuk %100, sonraki hedef/kalan 0; fazladan toplam XP kesilmez.
Negatif, NaN/sonsuz veya desteklenmeyen runtime değerleri güvenli başlangıca
iner. Ondalıklı XP seviye karşılaştırmasında aşağı yuvarlanır.

Kazanılmış XP hesaplayan `rewardSummary` ve skor/rozet kuralları değişmez.
Kayıtlı oyunlara, XP ledger'ına veya oyuncu verilerine migration UPDATE yoktur.
Mevcut `playerTitle` aralıkları aynıdır. Eski veri fixture'larının byte içeriği
korunur; testlerde yalnız yeni türetilmiş seviye/ilerleme beklentileri değişti.

Profil, ReferenceHero, Ayarlar çubuğu, sonuç ekranının seviye atlama kontrolü,
sosyal profiller, arkadaş oyuncu detayları, sıralama ve seviye ses gözlemcisi
aynı yardımcıyı kullanır. Çevrimiçi XP ile yerel XP birleştirilmez. Sunucu eski
`level` gönderse bile yeni istemci seviyeyi doğrulanmış XP'den türetir.
Sıralama sırası/puanı veya cursor algoritması değiştirilmedi.

## Bildirim arayüzü

- `NotificationCard`: ortak yüzey, avatar/ikon, başlık, açıklama, zaman ve
  okundu/okunmamış erişilebilir etiketi; kart başlığı ayrıntıyı açar.
- `FriendRequestCard`, `GameInviteCard`: aynı ölçüde kompakt 44 dp dokunma alanlı
  butonlar. Normal yazıda yan yana; büyük yazıda alt alta.
- `NotificationSectionTabs`: Tümü / İstekler / Davetler. Büyük yazıda iki satır,
  daha da büyük yazıda tek sütun; kelimeler dar üçlü sütuna sıkıştırılmaz.
- `useInboxFriends`: kart başına istek yerine liste için tek friends çağrısı;
  actor değişimi, unmount, işlem kilidi, hata ve server ACK korunur.
- `replyFriendRequest`: liste ve push/ayrıntı aynı mevcut API işlemini kullanır.

**Daha Sonra ret değildir.** Daveti pending tutar; ilgili bildirim varsa mevcut
okundu işlemini kullanır. Yeni deferred backend durumu veya ikinci bildirim
sistemi oluşturulmadı. Katıl, yalnız sunucu kabulü ve dönen matchId sonrasında
maçı açar. Yanıtlanmış/süresi dolmuş davetlerde katıl işlemi gösterilmez.
Kabul/ret başarı sayılmazsa başarı metni verilmez. Bildirim ayrıntısına listeden
girişte kimlik korunur ve mevcut okundu akışı işler. Push rotası değişmedi.

Referanstaki alt menü kopyalanmadı; beş sabit sekme korunur. Örnek oyuncu,
zorluk/soru sayısı veya olmayan mod üretim UI'sına eklenmedi. Testlerdeki
synthetic HTTP verileri yalnız izole önizlemedir; ekran görüntülerinde gerçek
oyuncu veya yeni başarı verisi iddiası yoktur.

## Test kanıtları

- `pnpm check`: **390 test**, TypeScript, lint ve soru bütünlüğü geçti.
- 99 seviyenin bütün sınırları, verilen örnekler, 58.410 cap, bozuk XP ve %100
  çubuk birim testleri geçti.
- İzole SQL: aynı 99 eşik, ACL, privacy ve social projection; migration öncesi
  ve sonrası oyuncu/skor/canlı ödül/maç/başarı satırları birebir aynı. Süre,
  RLS, immutable eski cevaplar ve hesap silme regresyonu geçti.
- Gerçek Chromium: 320/360/390 × açık/koyu; profil 60/100, tarihsel kayıtlar,
  arkadaş kabul tek istek, erteleme, davete katılma ve doğru maç rotası,
  süre dolumu, filtreler, boş liste, hata/yeniden deneme kontrolü.
  Sunucudan eski `level=2` gelen 300 XP oyuncu sosyal/sıralama UI'da seviye 3.
- Android 14 için yerel QA release derlemesi üretildi; fiziksel cihaz kabulü
  değildir. Native matris ve son Settings regresyon sonucu `acceptance.md`
  dosyasında ayrıca son durumuyla raporlanır.

Web testleri gerçek DOM/React Native Web ekranlarını kullanır fakat HTTP
servisleri sentetiktir. Bunlar gerçek OAuth/push teslimi veya canlı arkadaşlık
uçtan uca testi yerine gösterilmez. Gerçek Auth/SMTP Chrome → Android kanıtı
ayrı PR #22 / `../timer-auth-20261101/acceptance.md` dosyasındadır.

Main, Vercel Production, Alpha, testçi listesi, canlı XP/SQL, gerçek reklam ve
Analytics değiştirilmedi. Sunucu geçişi için `rollout-plan.md` ayrı onay ister.
