import React, { useState } from "react";
import { ScrollView, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Pattern } from "../../components/game/Artwork";
import {
  Button,
  Card,
  Dialog,
  Icon,
  IconName,
  Tap,
  Txt,
} from "../../components/ui";
import { Feedback, FeedbackDialog } from "../../components/ui/FeedbackDialog";
import { useGame } from "../../storage/GameProvider";
import { colors as c, fonts, gradients, useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "../online/OnlineProvider";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { displayNameError } from "../online/identity";
import { SocialProfile } from "../online/SocialProfile";
import {
  PersonalizationDialog,
  PersonalizationKind,
} from "../profile/Personalization";
import { brand } from "../../branding/identity";
export function SettingsScreen() {
  const { session } = useOnlineAuth();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  return (
    <>
      <AccountSettings
        key={session?.user.id ?? "guest"}
        setFeedback={setFeedback}
      />
      <FeedbackDialog feedback={feedback} onClose={() => setFeedback(null)} />
    </>
  );
}
function AccountSettings({
  setFeedback,
}: {
  setFeedback: React.Dispatch<React.SetStateAction<Feedback | null>>;
}) {
  const { data, updateProfile } = useGame(),
    auth = useOnlineAuth(),
    identity = usePlayerIdentity(),
    theme = useTheme();
  const params = useLocalSearchParams<{ edit?: string }>();
  const [editor, setEditor] = useState<PersonalizationKind | null>(
    params.edit === "avatar" ? "avatar" : null,
  );
  const [name, setName] = useState(data.profile.name),
    [onlineName, setOnlineName] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [info, setInfo] = useState<"help" | "about" | null>(null);
  const draftName = onlineName ?? identity.self?.profile.name ?? "";
  const back = () =>
    router.canGoBack() ? router.back() : router.replace("/profile");
  const row = (
    label: string,
    subtitle: string,
    icon: IconName,
    action: () => void,
  ) => (
    <Tap
      label={label}
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 18,
        backgroundColor: theme.mintSurface,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.card,
        }}
      >
        <Icon name={icon} color={theme.accent} />
      </View>
      <View style={{ flex: 1, gap: 3 }}>
        <Txt weight="heavy" size={16}>
          {label}
        </Txt>
        <Txt size={12} color={theme.muted}>
          {subtitle}
        </Txt>
      </View>
      <Icon name="chevron-right" size={18} color={theme.accent} />
    </Tap>
  );
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <LinearGradient colors={gradients.hero} style={{ padding: 18, gap: 8 }}>
        <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
          <Pattern opacity={0.08} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Tap
            label="Ayarlardan geri dön"
            onPress={back}
            style={{
              width: 44,
              minHeight: 44,
              borderRadius: 22,
              backgroundColor: "rgba(0,40,48,.5)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="chevron-left" color={c.white} />
          </Tap>
          <View style={{ flex: 1 }}>
            <Txt
              accessibilityRole="header"
              size={28}
              weight="heavy"
              color={c.white}
            >
              Ayarlar
            </Txt>
            <Txt size={12} color={c.tealLight}>
              Profilin, görünümün ve hesabın tek yerde.
            </Txt>
          </View>
        </View>
      </LinearGradient>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Card style={{ gap: 14 }}>
          <Txt accessibilityRole="header" weight="heavy" size={21}>
            Profil ve Hesap
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Avatar variant={data.profile.avatar} size={58} />
            <View style={{ flex: 1 }}>
              <Txt size={21} weight="heavy">
                {identity.displayName}
              </Txt>
              <Txt size={12} color={theme.muted}>
                {identity.self?.profile.username
                  ? `@${identity.self.profile.username}`
                  : auth.session
                    ? "Kullanıcı adını oluştur"
                    : "Misafir Oyuncu"}
              </Txt>
            </View>
          </View>
          {row(
            "Avatarını değiştir",
            "Karakterini ön izle, Kaydet ile uygula.",
            "user",
            () => setEditor("avatar"),
          )}
          {!auth.session && (
            <>
              <Txt weight="bold">Bu cihazdaki oyuncu adın</Txt>
              <TextInput
                accessibilityLabel="Yerel oyuncu adı"
                value={name}
                onChangeText={setName}
                maxLength={24}
                placeholder="Oyuncu"
                placeholderTextColor={theme.muted}
                style={{
                  fontFamily: fonts.medium,
                  minHeight: 52,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                  color: theme.text,
                  backgroundColor: theme.background,
                  fontSize: 16,
                }}
              />
              <Button
                title={busy ? "Kaydediliyor…" : "Oyuncu Adını Kaydet"}
                icon="save"
                disabled={busy || !name.trim() || /[\u0000-\u001f]/.test(name)}
                onPress={() => {
                  setBusy(true);
                  void updateProfile({ name: name.trim() })
                    .then((saved) =>
                      setFeedback({
                        tone: saved ? "success" : "error",
                        title: saved
                          ? "Oyuncu Adın Kaydedildi"
                          : "Profil Kaydedilemedi",
                        message: saved
                          ? "Bu cihazdaki adın güncellendi. Oyun kayıtların korundu."
                          : "Mevcut profilin korundu. Yeniden dene.",
                      }),
                    )
                    .finally(() => setBusy(false));
                }}
              />
            </>
          )}
          {auth.session ? (
            <>
              <Txt weight="bold">İsim / Görünen Ad</Txt>
              <TextInput
                accessibilityLabel="Görünen ad"
                value={draftName}
                onChangeText={setOnlineName}
                maxLength={24}
                placeholder="Görünen adın"
                placeholderTextColor={theme.muted}
                style={{
                  fontFamily: fonts.medium,
                  minHeight: 52,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: theme.border,
                  color: theme.text,
                  backgroundColor: theme.background,
                  fontSize: 16,
                }}
              />
              {!!displayNameError(draftName) && (
                <Txt size={12} color={theme.muted}>
                  {displayNameError(draftName)}
                </Txt>
              )}
              <Button
                title={busy ? "Kaydediliyor…" : "Görünen Adı Kaydet"}
                icon="save"
                disabled={
                  busy || !identity.self || !!displayNameError(draftName)
                }
                onPress={() => {
                  setBusy(true);
                  void identity
                    .saveName(draftName)
                    .then(() => {
                      setOnlineName(null);
                      setFeedback({
                        tone: "success",
                        title: "Görünen Adın Kaydedildi",
                        message:
                          "Profilin ve ana sayfadaki ismin güncellendi. @kullanıcı_adın değişmedi.",
                      });
                    })
                    .catch((e) =>
                      setFeedback({
                        tone: "error",
                        title: "İsim Kaydedilemedi",
                        message:
                          e instanceof Error && !("code" in e)
                            ? e.message
                            : "İsim kaydedilemedi. Önceki bilgilerin korundu; yeniden dene.",
                      }),
                    )
                    .finally(() => setBusy(false));
                }}
              />
              <Txt size={12} color={theme.muted}>
                Benzersiz olması gerekmez. Arkadaşların seni aşağıdaki
                @kullanıcı_adın ile arar.
              </Txt>
              {identity.self?.profile.username &&
                identity.self.profile.avatar !== data.profile.avatar && (
                  <Button
                    title="Avatarını çevrimiçi eşitle"
                    icon="user-check"
                    variant="outline"
                    disabled={busy}
                    onPress={() => {
                      setBusy(true);
                      void identity
                        .syncAvatar()
                        .then(() =>
                          setFeedback({
                            tone: "success",
                            title: "Avatarın Eşitlendi",
                            message:
                              "Çevrimiçi avatarın güncellendi. İsmin, kullanıcı adın ve gizlilik seçimin korundu.",
                          }),
                        )
                        .catch(() =>
                          setFeedback({
                            tone: "error",
                            title: "Avatar Eşitlenemedi",
                            message:
                              "Önceki çevrimiçi avatarın korundu. Yeniden dene.",
                          }),
                        )
                        .finally(() => setBusy(false));
                    }}
                  />
                )}
              <Txt size={13}>{auth.session.user.email}</Txt>
              <View
                style={{ flexDirection: "row", gap: 7, alignItems: "center" }}
              >
                <Icon name="check-circle" color={theme.success} size={18} />
                <Txt size={13} color={theme.success}>
                  E-posta doğrulandı
                </Txt>
              </View>
              <Button
                title="Hesaptan Çık"
                icon="log-out"
                variant="outline"
                disabled={busy}
                onPress={() => {
                  setBusy(true);
                  void auth
                    .signOut()
                    .then(() =>
                      setFeedback({
                        tone: "information",
                        title: "Oturum Kapatıldı",
                        message:
                          "Yerel oyun kayıtların, XP ve rozetlerin korunuyor.",
                      }),
                    )
                    .catch(() =>
                      setFeedback({
                        tone: "error",
                        title: "Çıkış Tamamlanamadı",
                        message: "Bağlantını kontrol edip yeniden dene.",
                      }),
                    )
                    .finally(() => setBusy(false));
                }}
              />
            </>
          ) : (
            <>
              <Txt size={13} color={theme.muted}>
                Çevrimiçi özellikler için doğrulanmış hesabınla giriş yap.
                Cihazındaki ilerlemen korunur; bulut hesabına otomatik
                aktarılmaz.
              </Txt>
              <Button
                title="Hesap Oluştur / Giriş Yap"
                icon="log-in"
                onPress={() => router.push("/online")}
              />
              {row(
                "E-posta doğrulama bağlantısı iste",
                "Doğrulama bekleyen hesabın için.",
                "mail",
                () => router.push("/online/verify-email"),
              )}
            </>
          )}
        </Card>
        {!!auth.session && <SocialProfile />}
        <Card style={{ gap: 12 }}>
          <Txt accessibilityRole="header" weight="heavy" size={21}>
            Görünüm
          </Txt>
          {row(
            "Görünüm ayarlarını aç",
            `${data.profile.theme === "system" ? "Sistem teması" : data.profile.theme === "dark" ? "Koyu tema" : "Açık tema"} · Ön izleyerek seç`,
            "sun",
            () => setEditor("appearance"),
          )}
          <Txt size={12} color={theme.muted}>
            Açık, koyu veya sistem temasını ön izle. Değişiklik yalnızca Kaydet
            ile uygulanır.
          </Txt>
        </Card>
        <Card style={{ gap: 12 }}>
          <Txt accessibilityRole="header" weight="heavy" size={21}>
            Bildirimler
          </Txt>
          {row(
            "Bildirimleri görüntüle",
            "Davetler, arkadaşlık istekleri ve maç sonuçları.",
            "bell",
            () => router.push("/online/inbox"),
          )}
          <Txt size={12} color={theme.muted}>
            Uygulama içi bildirimler desteklenir. Kilit ekranına push bildirimi
            bu sürümde gönderilmez.
          </Txt>
        </Card>
        <Card style={{ gap: 10 }}>
          <Txt accessibilityRole="header" weight="heavy" size={21}>
            Gizlilik
          </Txt>
          <Txt size={13}>
            {auth.session
              ? "Oyuncu aramasında görünürlüğünü yukarıdaki Kullanıcı Adı ve Gizlilik kartından yönetebilirsin. Değişiklik aynı profil kaydıyla uygulanır."
              : "Oyuncu aramasında görünürlüğünü hesabınla giriş yaptıktan sonra yönetebilirsin."}
          </Txt>
          <Txt size={12} color={theme.muted}>
            Çevrimiçi rozet paylaşımı ve vitrin tercihlerin Profilim →
            Başarılarım bölümünde korunur. Sıralama sekmesindeki ayrı katılım
            tercihin varsayılan kapalıdır; genel listede görünmek için oyuncu
            aramasında bulunma da açık olmalı.
          </Txt>
        </Card>
        <Card style={{ gap: 12 }}>
          <Txt accessibilityRole="header" weight="heavy" size={21}>
            Diğer
          </Txt>
          {row("Uygulama hakkında", brand.developer, "info", () =>
            setInfo("about"),
          )}
          {row(
            "Yardım",
            "Oyun, hesap ve kayıtların hakkında.",
            "help-circle",
            () => setInfo("help"),
          )}
        </Card>
      </ScrollView>
      {editor && (
        <PersonalizationDialog
          key={editor}
          kind={editor}
          onClose={() => setEditor(null)}
        />
      )}
      <Dialog
        visible={!!info}
        title={
          info === "about" ? "Anla & Ezberle" : "Nasıl yardımcı olabiliriz?"
        }
        onClose={() => setInfo(null)}
      >
        <Txt>
          {info === "about"
            ? `İslami Bilgi Oyunu · ${brand.developer}\nBilgini sına, öğren, ilerle!`
            : "Kategori ve zorluğu seçerek 10 soruluk yarışmaya başlayabilirsin. Yerel ilerlemen bu cihazda saklanır. Çevrimiçi oyun için e-postanı doğrula ve benzersiz kullanıcı adını oluştur. Doğrulama e-postası gelmezse spam klasörünü kontrol et; yeni bağlantı istemeden önce 60 saniye bekle."}
        </Txt>
        <Button title="Tamam" onPress={() => setInfo(null)} />
      </Dialog>
    </View>
  );
}
