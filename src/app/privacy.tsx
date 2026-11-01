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
        <Txt size={12}>Son güncelleme: 30 Ekim 2026</Txt>
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
        <Txt weight="heavy">İsteğe bağlı reklam testi</Txt>
        <Txt>
          Bu web sürümünde reklam gösterilmez. Aşağıdaki açıklamalar yalnız
          reklam testi içeren Android test sürümleri içindir. Bu test kapsamında
          Google Analytics veya Firebase Analytics etkinleştirilmez. Reklam
          SDK’sının aşağıda açıklanan kendi teknik ölçümleri bundan ayrıdır.
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
          Yaş uygunluğu belirtilmemiş veya 18 yaş altında olduğunu belirten
          kullanıcılarda reklam başlatılmaz. Desteklenen test sürümünde Ayarlar
          → Gizlilik → Reklam Gizlilik Tercihleri bölümünden yetişkin olduğunu
          belirtip isteğe bağlı testi açabilirsin. Bu cihaz tercihi ve varsa
          Google izin formu tamamlanmadan reklam talep edilmez. Google’ın
          bölgesel izin seçenekleri gerektiğinde aynı bölümden tekrar açılır.
          Test iznini kapatmak sonraki reklam isteklerini durdurur; oyuna
          reklamsız devam edebilirsin. Mevcut sağlayıcı kayıtlarını geriye dönük
          silmez. UMP tek başına bütün yerel yasal yükümlülüklerin karşılandığı
          anlamına gelmez. Google’ın veri işleme ve saklama koşulları da
          geçerlidir: https://policies.google.com/privacy
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
          Başarılı silmede Auth hesabı ve oturum yenileme kayıtları, çevrimiçi
          profil/kimlik bilgileri, arkadaşlık/davetler, kişisel bildirimler,
          kendi yanıt ve puanların ve sana ait dosyalar kaldırılır. Ortak
          maçlarda kimlik bağlantın kaldırılır; diğer oyuncuların kazanılmış
          puanları korunur. İlişkili devam eden oyunlar iptal edilir. Silme geri
          alınamaz; sunucu doğrulaması olmadan tamamlandı denmez.
        </Txt>
        <Txt weight="heavy">Saklama ve teknik sınırlar</Txt>
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
