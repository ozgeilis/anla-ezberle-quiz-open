> 1 Kasım güncellemesi: Kullanıcı bu sınırlı backend planını onayladı ve uygulandı.
> Kanıt: [dağıtım kaydı](../xp-notifications-20261101/backend-deployment.md).
> Aşağıdaki metin onaya sunulmuş özgün kapsam/geri dönüş planıdır.

# Onay bekleyen sunucu ve kapalı test planı

Henüz uygulanmadı. Bu belge main merge, Vercel Production, Play AAB yüklemesi,
Alpha gönderimi veya genel Google/push/Analytics izni değildir.

## Kapsam ve önkoşullar

Yalnız Frankfurt `mqyuihiobkomjfipxehj`. Yeni sentetik test hesabı oluşturmak ve
hesap sahibinin Google onayıyla gerçek OAuth yapmak için ayrıca sınırlı test
izni gerekir. Mevcut hesapların şifresi, e-postası veya izinleri değiştirilmeyecek.
Testçi listesi bu depodan veya Play'den okunarak otomatik içeri alınmayacak.

Aşağıdaki iki migration'ın tam SHA-256 değerleri `migration-sha256.txt` dosyasında.
İlk migration uygulanmadan önce, 1 Kasım salt okunur denetimindeki fonksiyon
kaynaklarının MD5 değerleri de otomatik karşılaştırılır. Farklılık varsa işlem
veri değiştirmeden durur; yeniden inceleme/onay gerekir. MD5 burada yalnız
kaynak sapması belirleme kontrolüdür, kimlik doğrulama aracı değildir.

| Fonksiyon                  | Mevcut kaynak MD5                |
| -------------------------- | -------------------------------- |
| online_duel_command        | d8a35cd739366eb732b2276720dd6e1e |
| match_view                 | 827043b5d05d42d2d8437d58b3242d3c |
| live_room_command          | a130dbe4f25bbac8c2086bd49d04630e |
| before_google_user_created | a160aecbf5e919510163b95bfd7ef3be |

## Önerilen uygulama sırası

1. Migration geçmişini/şemayı ve mevcut varsayılanları tekrar salt okunur
   kontrol et. `answer_seconds=10`, asenkron maçta yeni zaman alanlarının yokluğu
   ve yukarıdaki kaynaklar beklenir. Gerçek kullanıcı kayıtlarını dışa aktarma.
2. `online-duel` Edge Function'ın yalnız bu PR'daki protokol genişletmesini
   dağıt: `timingVersion` alanları ve `expire` işlemi. JWT/getUser, erişim/RLS,
   cevap anahtarları, CORS ve kapalı test kuralları korunur. Eski SQL bu ek
   alanı yok sayar; henüz yeni APK yayımlanmaz.
3. `20261101053234_twenty_second_questions.sql` uygula. 5 sn kilit bekleme
   sınırı var; tek transaction, eski oda/maç sürelerine UPDATE yok. Tablo
   kısıtları, yeni varsayılanlar, server-side asenkron süre ve görünüm protokolü
   birlikte değişir. Silinmiş rakibin `Silinmiş Oyuncu` gösterimi korunur.
4. `20261101054043_google_signup_test_allowlist.sql` uygula. Tablo BOŞ oluşur.
   Hook yerinde kalır; `signup_enabled=false` ve Cloud External/Testing
   değişmez. OAuth istemci sırrı/provider ayarı değişmez.
5. Hesap sahibinin ayrı onayladığı yalnız test adresini, örneğin 7 günlük
   süreyle, özel sunucu listesine ve gerekiyorsa Google Cloud Testing listesine
   ekle. Google Cloud Production'a geçme. Çevrimiçi oyun yetkileri ayrıca mevcut
   kurallara tabi; OAuth oturumu bu yetkileri kendi başına vermez.
6. Auth redirect listesinde native `/online/auth`, webde onaylı tam origin ve
   recovery için `?purpose=recovery` dönüşünü dar izinlerle doğrula. Genel
   wildcard ekleme. Mevcut ConfirmationURL e-posta şablonu PKCE kodu döndürmeye
   uygunsa değiştirme; değişiklik gerekiyorsa önce yeni somut şablonu onaya sun.
7. Yeni güvenli test APK'sında yalnız onaylı sentetik hesaplarla gerçek Google,
   Gmail/Chrome ve e-posta callback kabulünü yap. Google hesabının kendisini
   silme; geçici uygulama hesabını silmek de ayrı açık izin gerektirir.
8. Kabul sonrası EAS'nin güncel remote versionCode değerini kontrol ederek,
   mevcut upload imzasıyla farklı code kullanan Alpha AAB hazırla. Bu PR'daki
   yerel QA APK numarası bir Play tahsisi değildir. **Yeni AAB yüklemesi ve
   incelemeye gönderim için ayrıca nihai yayın onayı al.**

## Riskler ve geri dönüş

- CHECK/kolon ekleme tablo kilidi alır; kilit beklemesi 5 sn aşarsa transaction
  durur. Başlamış odaların tarihleri/manifesti/süresi yeniden yazılmaz.
- Eski asenkron istemci yeni zamanlı maçta sayaç göstermediğinden güncelleme
  gerekir; sunucu o istemciyi sessizce 20 saniyelik oyuna sokmaz. Mevcut eski
  maçların kayıtları okunur ve aynı zamanlama ile devam eder.
- Google listesi adres bazlı kişisel veridir: yalnız onaylı adres, son kullanma
  tarihi, özel şema. Listeden çıkarmak yeni kaydı keser; mevcut oturumu veya
  hesabı silmez. Süre sonu kayıtları yetkili bakımda silinebilir.
- Sorunda yeni Google test adreslerini kaldır; hook/config global kapalı
  değerlerini koru. Önce yeni AAB yayını durur; mevcut Alpha geri çekilmez.
- Süre geri dönüşü yalnız **yeni** odalar için default 10; yeni asenkron maçlar
  için default NULL yapmaktır. Mevcut 20 saniyelik maç/oda olduğu gibi sürer.
  Yeni kolonları/cevapları silme, eski soruları/puanları yeniden yazma. Yeni
  fonksiyonlar korunur; eski fonksiyonu geri koymak 20 sn kayıtlarını bozabilir.
- Yönetilen tam restore/PITR garantisi bu çalışma kapsamında doğrulanmadı.
  Geri dönüş veri silme veya tam yedek geri yükleme planı değildir.
