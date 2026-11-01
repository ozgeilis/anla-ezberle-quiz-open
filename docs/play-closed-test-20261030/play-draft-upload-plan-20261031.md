# Alpha taslak AAB yükleme planı — sınırlı onay verildi

31 Ekim 2026 · Bu plan **yalnız Google Play Console'a AAB yüklemek ve taslak doğrulamak** içindir. Önceki tek-build onayı upload izni değildi. Ürün sahibi “Yalnız taslak AAB yüklemesini onaylıyorum” yanıtıyla bu kapsamı31 Ekim onayladı. Uygulama sonucu aşağıdaki devam raporunda tutulur.

## Hazır dosya ve hedef

- Uygulama `com.kovynelstudio.anlaezberle`; mevcut Anla & Ezberle kaydı.
- Hedef mevcut **Kapalı test — Alpha**, yalnız Türkiye. Başka kanal/ülke yok.
- AAB kaynak commit `8d13fc26b2c68a209970ac226dfb2a6a1d650c59`, EAS build `7d8591e7-b127-49c0-92ad-59288f5d950b`.
- Sürüm0.1.0, versionCode2, target36. Dosya83.995.235 bayt.
- SHA-256 `7cfdf8d109350ddd8cb81360e90abd9a48b2317a2b0ae421b917ba95a57ffd1a`; yerel dosya özeti yeniden doğrulandı.
- [Gerçek AAB testleri ve eksikler](closed-test-aab-run-20261031.md). Bu belge test sonuçlarını fiziksel telefon kabulüne dönüştürmez.

## Güncel Console gözlemi

Kontrol paneli12/13; Alpha kurulumu1/4, henüz testçi listesi ve yayımlanmış sürüm yok. Paket listesi **Yok**, sürüm listesi **Sürüm yok** olarak görüldü. Geri bildirim adresi `kovynelstudio@gmail.com` Alpha taslağına kaydedildi; sayfa yeniden yüklenerek kalıcılığı doğrulandı. Katılım bağlantısı henüz etkin değil.

Yeni sürüm formu açıldı ve **yalnız ad/notlar içeren, paketsiz taslak** kaydedildi. Taslak adı `0.1.0 (2) - Alpha kapalı test`. “Değişiklikler kaydedildi” ve devre dışı Taslak olarak kaydet kontrolü doğrulandı. Paket Yükle düğmesine basılmadı; İleri/inceleme/gönderim yapılmadı.

## İmzalama ve dağıtım farkı

Salt okunur incelemede mevcut Play imzalama anahtarı **Kullanımda** görüldü. Önceki “kurulmadı” notu doğrulanmamış eski gözlemdi; bu oturumda anahtar oluşturulmadı/değiştirilmedi. Console ayrıca30 Ekim tarihli önceki bir anahtar satırı gösteriyor; bu kayıt tek başına kullanıcıya paket teslim edildiğini kanıtlamaz.

- Play Console'un mevcut Digital Asset Links örneğindeki SHA-256: `C6:F5:23:D8:97:62:D8:32:CE:13:1E:49:60:2C:89:17:D9:65:CE:52:57:F0:EA:57:AC:03:DF:6C:CD:85:16:75`.
- AAB/EAS kabul APK upload sertifikası: `6D:F5:07:F0:45:B6:D7:FE:E9:14:71:53:CF:81:5B:36:A0:C4:B0:72:F2:B5:5B:6D:CD:6D:DA:54:48:63:52:B7`.

Bunlar farklıdır. AAB upload imzasının geçerli olması, mevcut telefondaki EAS APK'sının Play sürümüyle veri kaybetmeden güncellenebileceği anlamına gelmez. Gerçek Play-signed APK/cert/rotation-lineage kontrol edilene kadar üzerine kurulum garanti edilmez; kullanıcıya uygulamayı sildirerek test yaptırılmaz.

Yeni sürüm formunda mevcut varsayılanlar **Play imzalama** ve **Otomatik koruma** etkin. Sidekick ve otomatik metin çevirisi başlatılmadı. Play koruması paket davranışını etkileyebileceğinden EAS/local-debug testleri nihai Play-signed kabulünün yerine geçmez.

Kaynak: [Google Play imzalama resmi belgesi](https://support.google.com/googleplay/android-developer/answer/9842756?hl=tr). Yükleme anahtarı ile dağıtım anahtarı ayrı amaç taşır. Parçalı/cihaza özel APK ve mevcut klasik/kuantum uyumlu sertifika düzeni upload sonrası yeniden denetlenecek; anahtar değişimi bu planda yok.

## İstenen sınırlı izin ve uygulama sırası

1. Yalnız yukarıdaki SHA dosyasını mevcut Alpha taslağına yüklemek. İlk upload Google'a mevcut upload sertifikasını tanıtabilir/kaydettirebilir; farklı sertifika beklenirse durmak, anahtarı sıfırlamamak/değiştirmemek.
2. Google'ın işlediği versionCode, target API, paket ve imza/SDK/hata/uyarı raporunu okumak. Farklı binary ya da ciddi hata görülürse durmak. Tekrar build izni yok.
3. Yalnız mevcut sürüm adı ve Türkçe notlarla **taslak olarak** saklamak. İncelemeye gönderme, kullanıma sunma, üretim yayını yok.
4. Erişilebilir olursa Play'in oluşturduğu imzalı artifact/certificate bilgilerini salt okunur incelemek; APK indirmek inbound işlemdir. Emülatöre kurulum düşünülürse farklı imzalı mevcut uygulama üzerine zorlanmaz, veri temizlenmez. Gerçek Android OEM/ses ve native OAuth kabulü hâlâ bekler.
5. Sonuç ve kalan engelleri raporlamak; nihai Alpha gönderimi için tester grubu, kalan kritik bulgular ve **ayrı gönderim onayı** gerekir. Yeni sözleşme/anahtar erişimi değişikliği çıkarsa kabul edilmeden önce ayrıca değerlendirilir.

Bu izin main/Vercel Production, Supabase, genel push, gerçek reklamlar, Analytics, tester kişisel adreslerinin başka yere aktarımı veya ücretli işlem içermez. Onay kapısı false kalır. Mevcut Play imzalama/koruma ayarları değiştirilmez.

## Hazır Türkçe sürüm notları

```text
<tr-TR>
İlk kapalı test sürümü.
• Yenilenen ana sayfa, profil, kategori ve ayar ekranları.
• Süreli quiz, sonuçlar ve kaynaklı cevap inceleme.
• Arkadaşlık istekleri ve oyun davetleri.
• Büyük yazı ve açık/koyu tema iyileştirmeleri.
Bu aday yalnız resmî test reklamlarını kullanır. Görünüm, gezinme ve oyun akışıyla ilgili geri bildirimlerinizi bekliyoruz.
</tr-TR>
```

Testçilerin e-postaları/grup üyelikleri Git'e veya bu belgeye eklenmez. 0 testçi;14 günlük süre başlamadı. Testçi listesini eklemek Play hesabı erişimi, yeni Supabase hesabı veya genel push izni sağlamaz.

## Onay ve devam

Yalnız versionCode2/SHA `7cfdf8d1…7ffd1a` dosyasının mevcut Alpha taslağına yüklenmesi ve kontrollerinin incelenmesi onaylandı. Nihai inceleme/yayın izni yok. [Gerçek yükleme sonucu](play-draft-upload-result-20261031.md).
