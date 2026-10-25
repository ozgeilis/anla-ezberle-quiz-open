import React from "react";
import { Linking } from "react-native";
import { router } from "expo-router";
import { Button, Card, Page, Txt } from "../components/ui";

export default function PrivacyScreen() {
  return (
    <Page
      title="Gizlilik Politikası"
      subtitle="Anla & Ezberle · Kovynel Studio"
    >
      <Card style={{ gap: 14 }}>
        <Txt weight="heavy" size={20}>
          Verilerin ve hesabın üzerinde kontrol sende
        </Txt>
        <Txt size={12}>Son güncelleme: 25 Ekim 2026</Txt>
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
        <Txt weight="heavy">Hesabını silmek</Txt>
        <Txt>
          Profil → Ayarlar → Hesabımı Sil yolunu veya aşağıdaki web sayfasını
          kullanabilirsin. Uygulamayı yeniden yüklemek gerekmez. İki onay ve
          güncel hesap parolası istenir. Otomatik silme e-posta/parola
          hesaplarını destekler; ek kimlik doğrulaması gereken hesaplarda destek
          üzerinden sahiplik doğrulaması gerekir. Servis durumu ve işlem sonucu
          silme sayfasında gösterilir. Destek talebi göndermek hesabın hemen
          silindiği anlamına gelmez.
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
