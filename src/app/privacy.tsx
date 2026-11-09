import React from "react";
import { Linking } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Page, Txt } from "../components/ui";

export default function PrivacyScreen() {
  const router = useRouter();
  return (
    <Page
      title="Gizlilik Politikası"
      subtitle="Anla & Ezberle · Kovynel Studio"
    >
      <Card style={{ gap: 14 }}>
        <Txt weight="heavy" size={20}>
          Verilerin ve hesabın üzerinde kontrol sende
        </Txt>
        <Txt size={12}>Son güncelleme: 9 Kasım 2026</Txt>
        <Txt>
          Anla & Ezberle hizmetini Kovynel Studio sunar. Gizlilik, erişim,
          düzeltme ve hesap silme talepleri için kovynelstudio@gmail.com
          adresine ulaşabilirsin. Parola, doğrulama kodu veya oturum anahtarı
          göndermeni istemeyiz.
        </Txt>
        <Txt weight="heavy">Cihazındaki veriler</Txt>
        <Txt>
          Tek oyunculu geçmiş, yerel XP ve rozetler, avatar, görünüm ve ses
          tercihleri cihazında saklanır. Misafir ilerlemesi çevrimiçi sıralamaya
          otomatik aktarılmaz. Hesabını silmek bu bağımsız oyun geçmişini
          silmez. Hesaba bağlı bekleyen çevrimiçi işlemler ve cihaz oturumu
          temizlenir; bu cihazdaki görünen isim Oyuncu olarak sıfırlanır. Diğer
          cihazlardaki yerel kayıtlar uzaktan silinemez.
        </Txt>
        <Txt weight="heavy">Çevrimiçi hizmet için işlenen veriler</Txt>
        <Txt>
          E-posta ve kimlik doğrulama verileri oturum açmak ve hesabı korumak
          için Supabase Auth tarafından işlenir. Parolan oyun tablolarına veya
          uygulamanın loglarına yazılmaz. Profil adı, benzersiz kullanıcı adı,
          avatar ve görünürlük tercihleri; arkadaşlıklar, davetler, bildirimler,
          oda/maç yanıtları ve sunucuda hesaplanan puanlar ilgili oyun ve sosyal
          özellikleri sağlamak için saklanır. Mikrofon kaydı yapılmaz.
        </Txt>
        <Txt>
          Google ile giriş kullanılabildiğinde Google hesabının doğrulanmış
          e-postası, hesap kimliği ve izin verdiğin temel profil bilgileri,
          Supabase üzerinden oturum açmak için işlenir. Google parolan
          uygulamaya aktarılmaz. Google ile yeni hesap oluşturma ve çevrimiçi
          erişim sunucu izinlerine bağlıdır.
        </Txt>
        <Txt>
          Apple ile Giriş kullanılabildiğinde Apple hesap kimliği, izin verdiğin
          e-posta ve ilk girişte paylaşılabilen ad bilgileri Supabase üzerinden
          kimlik doğrulama amacıyla işlenir. E-postamı Gizle seçilirse Apple’ın
          oluşturduğu özel iletim adresi kullanılabilir. Apple parolan
          uygulamaya aktarılmaz. Mevcut beta kapsamında Apple ve Google ile yeni
          hesap kaydı sunucudaki test izinleriyle sınırlıdır; TestFlight
          bağlantısına katılmak bu izinleri açmaz. Hesapsız oyun kullanılabilir.
        </Txt>
        <Txt weight="heavy">Kimler görebilir?</Txt>
        <Txt>
          Arama, arkadaşlık, oda ve sıralama ekranları yalnız yetkilendirilmiş
          profil ve oyun alanlarını gösterir. E-posta, parola ve oturum
          anahtarları diğer oyunculara gösterilmez. Barındırma için Vercel,
          kimlik doğrulama/veritabanı için Supabase ve hesap e-postalarının
          iletilmesi için yapılandırılmış e-posta hizmetleri kullanılır. Teknik
          erişim kayıtları güvenlik, hata inceleme ve hizmet sunumu amacıyla bu
          sağlayıcılar tarafından işlenebilir. Kullanıcı verilerini satmayız.
        </Txt>
        <Txt weight="heavy">Oyuncu güvenliği ve şikâyetler</Txt>
        <Txt>
          Etkin olduğunda engelleme ilişkileri, arkadaşlık isteği ve oyun daveti
          göndermeyi sınırlamak için saklanır. Şikâyette şikâyetçi ve hedef
          hesap kimliği, neden kodu, isteğe bağlı açıklama, hedef oyuncunun
          görünen adı ve kullanıcı adı kopyası, zaman, inceleme durumu ve
          moderatör kararı kaydedilir. Açıklamaya parola, doğrulama kodu veya
          gereksiz kişisel bilgi ekleme. Şikâyet ve denetim kayıtlarına yalnız
          yetkili moderatör erişebilir; şikâyetçi kimliği hedef oyuncuya
          gösterilmez. İtiraz ve destek için kovynelstudio@gmail.com
          kullanılabilir. Engelleme ve şikâyet etmek hesabı, XP’yi veya oyun
          geçmişini kendiliğinden silmez.
        </Txt>
        <Txt weight="heavy">Telefon bildirimleri</Txt>
        <Txt>
          Push gönderimi şu anda yalnız izinli kapalı test hesapları için
          kullanılabilir; genel kullanıma açık değildir. Yalnız isteğin ve
          telefon izninle cihaz bildirim tokenı, bağlı oturum kimliği, platform
          ve hesap bazlı bildirim tercihleri saklanır. Gönderim için token ve
          genel olay mesajı Expo Push Service üzerinden Google FCM veya Apple
          APNs ile işlenir; e-posta, parola ve soru cevapları push mesajına
          eklenmez. Bu sağlayıcıların kendi kayıt saklama süreleri ayrıca
          incelenmelidir. Ana anahtarı kapatmak alt tercihlerini silmez; sistem
          izni ayrıca telefon ayarlarından yönetilir.
        </Txt>
        <Txt>
          Hesaptan çıkışta bu cihazın push kaydı kapatılır; hesap silmede bağlı
          tokenlar ve tercihler sunucudan kaldırılır. Etkin gönderici bakımı, 90
          gündür görülmeyen veya oturumu geçersiz cihaz kayıtlarını ve 7 günü
          aşan push işlem kayıtlarını temizler. Gönderilmiş bir telefon
          bildirimi uzaktan geri çağrılamaz. Yalnız sağlayıcı alındısı gerçek
          cihaz teslimi garantisi değildir.
        </Txt>
        <Txt weight="heavy">Reklamlar ve reklam testi</Txt>
        <Txt>
          Bu web sürümünde reklam gösterilmez. Android kapalı test paketleri
          Google test reklamlarını kullanır. Bu kapsamda Google Analytics veya
          Firebase Analytics etkinleştirilmez. Reklam SDK’sının aşağıda
          açıklanan kendi teknik ölçümleri bundan ayrıdır.
        </Txt>
        <Txt>
          Reklam özelliği etkin iOS paketlerinde Google Mobile Ads ve User
          Messaging Platform kullanılır. Geliştirme ve kabul paketleri Google
          test reklamlarını; yayımlanan reklam destekli paket ise iOS’a ait
          gerçek reklam birimlerini kullanır. Bu iki yapılandırma ayrıdır.
          Google IP adresi ve bundan türetilen yaklaşık konumu, cihaz/uygulama
          tanımlayıcılarını, reklam görüntüleme ve etkileşim bilgilerini, çökme
          ve performans verilerini reklam sunumu, ölçüm, analiz ve kötüye
          kullanımı önleme amaçlarıyla işleyebilir. Hesap e-postanı, quiz
          cevaplarını, skorunu veya dinî ilgi profilini reklam isteklerine
          eklemeyiz. Gerekli Google gizlilik izinleri ve iOS’ta Apple takip
          durumu kontrol edilmeden reklam isteği başlatılmaz. Apple takip iznini
          reddettiğinde Google IDFA’yı reklam isteğine eklemez;
          kişiselleştirilmemiş reklamlar gerekli Google izinleri doğrultusunda
          yine istenebilir. Publisher first-party ID iOS’ta kapalı tutulur.
          Takip izni için oyun içi ödül verilmez, oyun özellikleri kısıtlanmaz.
          Google Analytics ve Firebase Analytics etkinleştirilmez.
        </Txt>
        <Txt>
          Reklam testi içeren Android sürümlerinde Google Mobile Ads ve Google
          User Messaging Platform kullanılır. Gerçek gelir sağlayan reklamlar
          açık değildir. Test reklamları da Google’a ağ bağlantısı kurabilir; IP
          adresi ve buna bağlı yaklaşık konum, cihaz veya uygulama
          tanımlayıcıları, reklam etkileşimleri ve tanılama bilgileri reklam
          sunumu, ölçüm ve kötüye kullanımı önleme için işlenebilir. Test
          reklamı olması veri işlenmediği anlamına gelmez. Reklam isteğine hesap
          e-postanı, quiz cevaplarını, skorunu veya dinî ilgi profili eklemeyiz.
          Android reklam kimliği izni bu test sürümünde engellenir; bu durum
          diğer teknik tanımlayıcıların hiç işlenmediği garantisi değildir.
        </Txt>
        <Txt>
          Reklam destekli iOS sürümünde yaş veya doğum tarihi istenmez ve yaşı
          bilinmeyen kullanıcıların yetişkin olduğu varsayılmaz. Bu nedenle
          reklam istekleri herkes için kişiselleştirilmemiş ayarla ve genel
          izleyiciye uygun (G) içerik sınırıyla gönderilir. Yaş onayı veya ayrı
          bir reklam açma anahtarı yoktur: gerekli gizlilik koşulları
          sağlandığında ana sayfada banner reklam ve tur sonrasında geçiş
          reklamı otomatik gösterilebilir. Yarışma ve soru sayacı sırasında
          reklam gösterilmez. Uygulama ilk açılışta Google User Messaging
          Platform (UMP) gereksinimlerini uygular; bölgende gerekiyorsa Google
          izin formu gösterilir ve Google reklam isteğine izin vermezse reklam
          başlatılmaz. Ardından iOS’ta takip için gerekli olan Apple Uygulama
          Takibi Şeffaflığı (ATT) izni istenir. ATT iznini reddedersen bu izni
          gerektiren takip yapılmaz ve IDFA kullanılmaz; takip içermeyen, izin
          verilen reklamlar yine gösterilebilir ve Google yukarıda açıklanan
          bazı reklam verilerini (ör. IP adresi, yaklaşık konum, reklam
          etkileşimi ve tanılama bilgileri) işlemeye devam edebilir. ATT
          kararını iOS Ayarlar → Gizlilik ve Güvenlik → Takip bölümünden
          değiştirebilirsin. Google’ın bölgesel gizlilik seçenekleri, bölgende
          sunuluyorsa, Ayarlar → Gizlilik → Reklam Gizlilik Tercihleri
          bölümünden tekrar açılabilir; gerekli iznin geri alınması sonraki
          reklam isteklerini durdurur. Bu işlem mevcut sağlayıcı kayıtlarını
          geriye dönük silmez. UMP tek başına bütün yerel yasal yükümlülüklerin
          karşılandığı anlamına gelmez. Google’ın veri işleme ve saklama
          koşulları da geçerlidir: https://policies.google.com/privacy
        </Txt>
        <Txt weight="heavy">Hesabını silmek</Txt>
        <Txt>
          Profil → Ayarlar → Hesap → Hesabımı Sil yolunu veya aşağıdaki web
          sayfasını kullanabilirsin. Uygulamayı yeniden yüklemek gerekmez. İki
          onay ve yeniden kimlik doğrulaması istenir. E-posta/parola hesabında
          güncel parola; desteklenen Google hesabında ise doğrulanmış hesap
          e-postasına gönderilen tek kullanımlık kod kullanılır. Servis durumu
          ve işlem sonucu silme sayfasında gösterilir. Destek talebi göndermek
          hesabın hemen silindiği anlamına gelmez.
        </Txt>
        <Txt>
          Desteklenen Apple hesabında güncel Apple doğrulaması kullanılır;
          Apple-only hesaptan uygulama parolası istenmez. Apple yetkisinin
          iptali güvenli sunucu akışında tamamlanmadan hesap silindi olarak
          gösterilmez. Ağ hatasında işlem durumu kontrol edilerek güvenli
          yeniden deneme sunulur.
        </Txt>
        <Txt>
          Başarılı silmede Auth hesabı ve oturum yenileme kayıtları, çevrimiçi
          profil/kimlik bilgileri, arkadaşlık/davetler, kişisel bildirimler,
          kendi yanıt ve puanların ve sana ait dosyalar kaldırılır. Ortak
          maçlarda kimlik bağlantın kaldırılır; diğer oyuncuların kazanılmış
          puanları korunur. İlişkili devam eden oyunlar iptal edilir. Silme geri
          alınamaz; sunucu doğrulaması olmadan tamamlandı denmez.
        </Txt>
        <Txt weight="heavy">Saklama ve teknik sınırlar</Txt>
        <Txt>
          Hesap silindiğinde bu hesaba doğrudan bağlı şikâyetlerdeki serbest
          metin ve ad/kullanıcı adı kopyaları ile ilişkili moderasyon notları
          temizlenir. Aynı notun sosyal kısıtlama gerekçesi kopyası da
          temizlenir; diğer oyuncuların kısıtlaması bu işlemle kaldırılmaz.
          Silinen hesabın kimlik bağlantıları kaldırılır. Kararların neden kodu,
          durumu ve zamanları gibi asgari denetim kayıtları yetkili inceleme
          için kalabilir. Kayıt başka bir oyuncuyla hâlâ ilişkiliyse tümüyle
          anonim olduğu söylenmez. Hesap kullanımdayken bu kayıtlar için
          otomatik süreli silme henüz uygulanmıyor; saklama ve silme talepleri
          destek adresinden izlenir.
        </Txt>
        <Txt>
          Hesap verileri hesabın kullanım süresince tutulur ve doğrulanmış silme
          işlemi sırasında etkin sistemden kaldırılır. Uygulama veritabanındaki
          ilgili Auth denetim olayları, e-posta, kullanıcı kimliği ve IP
          çıkarılarak kimliksizleştirilir. Mevcut Free ortamda zamanlanmış
          Supabase veritabanı yedeği bulunmaz. Sağlayıcıların bağımsız
          operasyon/güvenlik logları anlık hesap silmenin kapsamı dışındadır;
          panelde erişilebilen log süresi tüm iç kayıtların fiziksel silinme
          garantisi değildir. Bu iç kayıtların kesin saklama süreleri henüz
          sağlayıcıdan teyit edilmemiştir. Bu konuda ayrıntı istemek veya bir
          talebi takip etmek için destek adresini kullanabilirsin.
        </Txt>
        <Button
          title="Hesap silme sayfasını aç"
          onPress={() => router.push("/account-delete")}
        />
        <Button
          title="Kovynel Studio ile iletişim"
          variant="outline"
          onPress={() => void Linking.openURL("mailto:kovynelstudio@gmail.com")}
        />
      </Card>
    </Page>
  );
}
