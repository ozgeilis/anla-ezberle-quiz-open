import React, { useState } from "react";
import { Linking, ScrollView, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Avatar } from "../../components/game/Artwork";
import { Button, Card, Icon, IconName, Tap, Txt } from "../../components/ui";
import { Feedback, FeedbackDialog } from "../../components/ui/FeedbackDialog";
import { useGame } from "../../storage/GameProvider";
import { fonts, useTheme } from "../../theme/tokens";
import { progress } from "../../domain/scoring/progress";
import { useOnlineAuth } from "../online/OnlineProvider";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { displayNameError } from "../online/identity";
import { SocialProfile } from "../online/SocialProfile";
import { PersonalizationDialog } from "../profile/Personalization";
import { SoundSettings } from "../audio/SoundSettings";
import { NotificationSettings } from "../notifications/NotificationSettings";
import { ProfileAchievements } from "../achievements/ProfileAchievements";
import { brand } from "../../branding/identity";

export const settingSections = {
  profile: {
    title: "Profil",
    subtitle: "Profilini ve avatarını düzenle",
    icon: "user",
  },
  sound: {
    title: "Ses",
    subtitle: "Ses efektlerini ayarla",
    icon: "volume-2",
  },
  theme: {
    title: "Tema",
    subtitle: "Açık, koyu veya sistem temasını seç",
    icon: "sun",
  },
  account: {
    title: "Hesap",
    subtitle: "Giriş, hesap güvenliği ve hesap silme",
    icon: "shield",
  },
  notifications: {
    title: "Bildirimler",
    subtitle: "Bildirim tercihlerini yönet",
    icon: "bell",
  },
  privacy: {
    title: "Gizlilik",
    subtitle: "Gizlilik politikası ve veri tercihleri",
    icon: "lock",
  },
  help: {
    title: "Yardım",
    subtitle: "Destek ve uygulama hakkında",
    icon: "help-circle",
  },
} as const;
export type SettingSection = keyof typeof settingSections;
const back = () =>
  router.canGoBack() ? router.back() : router.replace("/settings");
export function SettingRow({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Tap
      label={title}
      onPress={onPress}
      style={{
        minHeight: 64,
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: t.border,
        backgroundColor: t.card,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: t.mintSurface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={20} color={t.accent} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
        <Txt size={16} weight="semibold">
          {title}
        </Txt>
        <Txt size={12} color={t.muted}>
          {subtitle}
        </Txt>
      </View>
      <Icon name="chevron-right" size={18} color={t.muted} />
    </Tap>
  );
}
export function SettingsFrame({
  title,
  children,
}: React.PropsWithChildren<{ title: string }>) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.background }}>
      <View
        style={{
          padding: 16,
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          backgroundColor: t.mintSurface,
          borderBottomWidth: 1,
          borderColor: t.border,
        }}
      >
        <Tap
          label="Ayarlardan geri dön"
          onPress={() =>
            router.canGoBack()
              ? router.back()
              : router.replace(title === "Ayarlar" ? "/profile" : "/settings")
          }
          style={{
            width: 44,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 14,
            backgroundColor: t.card,
          }}
        >
          <Icon name="chevron-left" color={t.accent} />
        </Tap>
        <Txt
          size={22}
          weight="heavy"
          accessibilityRole="header"
          style={{ flex: 1 }}
        >
          {title}
        </Txt>
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 24,
          gap: 12,
          width: "100%",
          maxWidth: 720,
          alignSelf: "center",
        }}
      >
        {children}
      </ScrollView>
    </View>
  );
}
export function SettingsScreen({ section }: { section?: string }) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { session } = useOnlineAuth();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const selected = section ?? (edit === "avatar" ? "profile" : undefined);
  return (
    <>
      <SettingsContent
        key={`${session?.user.id ?? "guest"}:${selected ?? "menu"}`}
        section={selected}
        setFeedback={setFeedback}
      />
      <FeedbackDialog feedback={feedback} onClose={() => setFeedback(null)} />
    </>
  );
}
function SettingsContent({
  section,
  setFeedback,
}: {
  section?: string;
  setFeedback: React.Dispatch<React.SetStateAction<Feedback | null>>;
}) {
  const { data } = useGame(),
    auth = useOnlineAuth(),
    identity = usePlayerIdentity(),
    t = useTheme();
  const p = progress(data.games);
  const [busy, setBusy] = useState(false);
  if (section === "theme")
    return (
      <PersonalizationDialog
        kind="appearance"
        presentation="screen"
        onClose={back}
      />
    );
  if (section === "profile") return <ProfileDetails />;
  if (section === "notifications")
    return (
      <SettingsFrame title="Bildirim Ayarları">
        <NotificationSettings />
      </SettingsFrame>
    );
  if (section === "sound")
    return (
      <SettingsFrame title="Ses Ayarları">
        <SoundSettings />
      </SettingsFrame>
    );
  const heading =
    section && section in settingSections
      ? settingSections[section as SettingSection].title
      : "Ayarlar";
  const navigate = (s: SettingSection) =>
    router.push({ pathname: "/settings/[section]", params: { section: s } });
  return (
    <SettingsFrame title={heading}>
      {!section && (
        <>
          <Tap
            label="Profil detaylarını aç"
            onPress={() => navigate("profile")}
            style={{
              padding: 16,
              borderRadius: 20,
              backgroundColor: t.mintSurface,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Avatar variant={data.profile.avatar} size={52} />
            <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
              <Txt weight="heavy" size={20}>
                {identity.displayName}
              </Txt>
              <Txt size={12} color={t.accent}>
                Seviye {p.level} · {p.xp} XP
              </Txt>
              <View
                style={{
                  height: 5,
                  borderRadius: 4,
                  backgroundColor: t.border,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${(p.levelXp / 250) * 100}%`,
                    height: 5,
                    backgroundColor: t.accent,
                  }}
                />
              </View>
            </View>
            <Icon name="chevron-right" color={t.accent} />
          </Tap>
          <Txt size={13} weight="bold" color={t.muted}>
            Hesap ve Uygulama
          </Txt>
          {(["profile", "sound", "theme", "account"] as const).map((s) => (
            <SettingRow
              key={s}
              {...settingSections[s]}
              onPress={() => navigate(s)}
            />
          ))}
          <Txt size={13} weight="bold" color={t.muted} style={{ marginTop: 8 }}>
            Diğer
          </Txt>
          {(["notifications", "privacy", "help"] as const).map((s) => (
            <SettingRow
              key={s}
              {...settingSections[s]}
              onPress={() => navigate(s)}
            />
          ))}
        </>
      )}
      {section === "account" && (
        <>
          <Card style={{ gap: 12 }}>
            <Txt weight="bold">
              {auth.session ? "Çevrimiçi hesabın" : "Misafir Oyuncu"}
            </Txt>
            {auth.session ? (
              <>
                <Txt>{auth.session.user.email}</Txt>
                <Txt size={12} color={t.muted}>
                  {auth.session.user.email_confirmed_at
                    ? "E-posta doğrulandı"
                    : "E-posta doğrulamanı tamamla"}
                </Txt>
                <Button
                  title="Şifremi sıfırla"
                  variant="outline"
                  onPress={() => router.push("/online/forgot-password")}
                />
                <Button
                  title={busy ? "Çıkış yapılıyor…" : "Hesaptan Çık"}
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
                          title: "Çıkış tamamlanamadı",
                          message: "Bağlantını kontrol edip yeniden dene.",
                        }),
                      )
                      .finally(() => setBusy(false));
                  }}
                />
              </>
            ) : (
              <>
                <Txt size={13}>
                  Yerel oyun geçmişin bu cihazda korunur. Çevrimiçi özellikler
                  için hesabını bağla.
                </Txt>
                <Button
                  title="Hesap Oluştur / Giriş Yap"
                  onPress={() => router.push("/online")}
                />
              </>
            )}
            <Button
              title="E-posta doğrulama"
              variant="outline"
              onPress={() => router.push("/online/verify-email")}
            />
          </Card>
          <Card style={{ gap: 10, borderColor: t.danger }}>
            <Txt weight="bold" color={t.danger}>
              Hesap silme
            </Txt>
            <Txt size={13}>
              Kalıcı silme ve güvenli kimlik doğrulaması için mevcut hesap silme
              ekranına geç.
            </Txt>
            <Button
              title="Hesabımı Sil"
              icon="trash-2"
              variant="danger"
              onPress={() => router.push("/account-delete")}
            />
          </Card>
        </>
      )}
      {section === "privacy" && (
        <>
          <ProfileAchievements editable />
          <Card style={{ gap: 12 }}>
            <Txt weight="bold">Verilerin ve gizlilik</Txt>
            <Txt size={13}>
              Yerel tek oyunculu ilerlemen bu cihazda; çevrimiçi profilin
              hesabında saklanır. Oyuncu arama görünürlüğünü mevcut profil
              düzenleyicisinden yönetebilirsin.
            </Txt>
            <Button
              title="Gizlilik Politikasını Aç"
              variant="outline"
              onPress={() => router.push("/privacy")}
            />
            <Button
              title="Profil görünürlüğünü yönet"
              variant="outline"
              onPress={() => navigate("profile")}
            />
          </Card>
        </>
      )}
      {section === "help" && (
        <Card style={{ gap: 12 }}>
          <Txt size={19} weight="heavy">
            Anla & Ezberle
          </Txt>
          <Txt>{brand.developer}</Txt>
          <Txt size={13}>
            Kategori ve zorluğu seç, yarışmanı tamamla. Çevrimiçi oyun için
            doğrulanmış hesabınla giriş yap. Hesap silme ve gizlilik bilgileri
            uygulama kurulmadan da web sitemizde açılabilir.
          </Txt>
          <Button
            title="kovynelstudio@gmail.com"
            icon="mail"
            variant="outline"
            onPress={() =>
              void Linking.openURL("mailto:kovynelstudio@gmail.com").catch(() =>
                setFeedback({
                  tone: "information",
                  title: "Destek",
                  message:
                    "kovynelstudio@gmail.com adresine e-posta gönderebilirsin.",
                }),
              )
            }
          />
        </Card>
      )}
      {section && !(section in settingSections) && (
        <>
          <Txt>Böyle bir ayar bölümü bulunamadı.</Txt>
          <Button
            title="Ayarlara Dön"
            onPress={() => router.replace("/settings")}
          />
        </>
      )}
    </SettingsFrame>
  );
}
function ProfileDetails() {
  const { data, updateProfile } = useGame(),
    auth = useOnlineAuth(),
    identity = usePlayerIdentity(),
    t = useTheme();
  const { edit } = useLocalSearchParams<{ edit?: string }>();
  const [avatar, setAvatar] = useState(edit === "avatar"),
    [nameInput, setName] = useState<string | null>(null),
    [busy, setBusy] = useState(false),
    [feedback, setFeedback] = useState<Feedback | null>(null);
  const name = nameInput ?? identity.displayName;
  const validation = auth.session
    ? displayNameError(name)
    : !name.trim() || /[\u0000-\u001f]/.test(name)
      ? "Geçerli bir oyuncu adı yaz."
      : null;
  return (
    <SettingsFrame title="Profil Detayları">
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Avatar variant={data.profile.avatar} size={64} />
          <View style={{ flex: 1 }}>
            <Txt size={21} weight="heavy">
              {identity.displayName}
            </Txt>
            <Txt size={12} color={t.muted}>
              {identity.self?.profile.username
                ? `@${identity.self.profile.username}`
                : "Misafir Oyuncu"}
            </Txt>
          </View>
        </View>
        <Button
          title="Avatarını değiştir"
          icon="user"
          variant="outline"
          onPress={() => setAvatar(true)}
        />
        <Txt weight="bold">İsim / Görünen Ad</Txt>
        <TextInput
          accessibilityLabel={auth.session ? "Görünen ad" : "Yerel oyuncu adı"}
          maxLength={24}
          value={name}
          onChangeText={setName}
          style={{
            fontFamily: fonts.medium,
            fontSize: 16,
            padding: 12,
            minHeight: 48,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: t.border,
            color: t.text,
            backgroundColor: t.background,
          }}
        />
        {!!validation && (
          <Txt size={12} color={t.muted}>
            {validation}
          </Txt>
        )}
        <Button
          title={
            busy
              ? "Kaydediliyor…"
              : auth.session
                ? "Görünen Adı Kaydet"
                : "Oyuncu Adını Kaydet"
          }
          disabled={busy || !!validation || (!!auth.session && !identity.self)}
          onPress={() => {
            setBusy(true);
            void (async () => {
              try {
                if (auth.session) await identity.saveName(name);
                else if (!(await updateProfile({ name: name.trim() })))
                  throw Error();
                setFeedback({
                  tone: "success",
                  title: auth.session
                    ? "Görünen Adın Kaydedildi"
                    : "Oyuncu Adın Kaydedildi",
                  message:
                    "Profilin ve ana sayfadaki ismin güncellendi. Diğer bilgilerin korundu.",
                });
              } catch {
                setFeedback({
                  tone: "error",
                  title: "İsim Kaydedilemedi",
                  message: "Önceki bilgilerin korundu. Yeniden dene.",
                });
              } finally {
                setBusy(false);
              }
            })();
          }}
        />
        {auth.session &&
          identity.self?.profile.avatar !== data.profile.avatar && (
            <Button
              title="Avatarını çevrimiçi eşitle"
              variant="outline"
              disabled={busy}
              onPress={() => {
                setBusy(true);
                void identity
                  .syncAvatar()
                  .catch(() =>
                    setFeedback({
                      tone: "error",
                      title: "Eşitlenemedi",
                      message: "Önceki avatarın korundu. Yeniden dene.",
                    }),
                  )
                  .finally(() => setBusy(false));
              }}
            />
          )}
      </Card>
      {auth.session && <SocialProfile />}
      {avatar && (
        <PersonalizationDialog kind="avatar" onClose={() => setAvatar(false)} />
      )}
      <FeedbackDialog feedback={feedback} onClose={() => setFeedback(null)} />
    </SettingsFrame>
  );
}
