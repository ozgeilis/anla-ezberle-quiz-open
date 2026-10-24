import React from "react";
import { router } from "expo-router";
import { Button, Card, Page, Txt } from "../components/ui";
export default function PrivacyScreen() {
  return (
    <Page
      title="Gizlilik ve Verilerin"
      subtitle="Anla & Ezberle · Kovynel Studio"
    >
      <Card style={{ gap: 14 }}>
        <Txt weight="heavy" size={20}>
          Yerel ve çevrimiçi veriler ayrı tutulur
        </Txt>
        <Txt>
          Tek oyunculu oyun geçmişi, yerel XP/rozetler, avatar ve görünüm/ses
          tercihleri cihazında saklanır. Misafir ilerlemesi çevrimiçi sıralamaya
          otomatik yüklenmez.
        </Txt>
        <Txt>
          Çevrimiçi hesap kullandığında e-posta ve kimlik doğrulama bilgileri
          Supabase Auth tarafından işlenir. Profil adı/kullanıcı adı, avatar,
          görünürlük tercihleri, arkadaşlıklar, davetler, oda/maç yanıtları ve
          sunucuda hesaplanan puanlar çevrimiçi özellikleri sağlamak için
          saklanır. Parolan uygulamanın oyun tablolarına veya uygulama loglarına
          yazılmaz.
        </Txt>
        <Txt>
          Oyuncu arama/sıralama yalnız izin verilen profil alanlarını gösterir;
          e-posta ve oturum anahtarları yayımlanmaz. Bu sürümde ses kaydı
          yapılmaz; kısa oyun efektleri cihazda oynatılır.
        </Txt>
        <Txt>
          Hesap silme etkinleştirildiğinde kendi sunucu hesabın ve ilişkili
          kişisel verilerin silinir; diğer oyuncuların kazanılmış puanlarını
          koruyan ortak geçmişte kimlik bağlantıların kaldırılır. Yerel tek
          oyunculu kayıtlar ve başka cihazlardaki yerel veriler ayrı kalır.
        </Txt>
        <Button
          title="Hesap silme ve servis durumu"
          onPress={() => router.push("/account-delete")}
        />
        <Txt size={12}>
          Mağaza yayını hazırlığı: hizmet sağlayıcıların operasyon/güvenlik
          logları ve yedek saklama süreleri, veri sorumlusu iletişim adresi ve
          nihai politika metni henüz doğrulanmamıştır. Bu bilgi ekranı
          tamamlanmış Google Play gizlilik uygunluğu onayı değildir.
        </Txt>
      </Card>
    </Page>
  );
}
