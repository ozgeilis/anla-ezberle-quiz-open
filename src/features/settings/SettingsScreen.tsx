import React, { useState } from "react";
import { Linking, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Avatar } from "../../components/game/Artwork";
import { Button, Card, Icon, Tap, Txt } from "../../components/ui";
import { Feedback, FeedbackDialog } from "../../components/ui/FeedbackDialog";
import { useGame } from "../../storage/GameProvider";
import { useTheme } from "../../theme/tokens";
import { progress } from "../../domain/scoring/progress";
import { useOnlineAuth } from "../online/OnlineProvider";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { PersonalizationDialog } from "../profile/Personalization";
import { SoundSettings } from "../audio/SoundSettings";
import { AdPrivacySettings } from "../ads/AdPrivacySettings";
import { NotificationSettings } from "../notifications/NotificationSettings";
import { ProfileAchievements } from "../achievements/ProfileAchievements";
import { brand } from "../../branding/identity";
import { SettingRow, SettingsFrame } from "./SettingsLayout";
import { ProfileSettings } from "./ProfileSettings";
import { AccountSettings } from "./AccountSettings";
export { SettingRow, SettingsFrame } from "./SettingsLayout";

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
  const router = useRouter();
  const { data } = useGame(),
    identity = usePlayerIdentity(),
    t = useTheme();
  const back = () =>
    router.canGoBack() ? router.back() : router.replace("/settings");
  const p = progress(data.games);
  if (section === "theme")
    return (
      <PersonalizationDialog
        kind="appearance"
        presentation="screen"
        onClose={back}
      />
    );
  if (section === "profile") return <ProfileSettings />;
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
      {section === "account" && <AccountSettings setFeedback={setFeedback} />}
      {section === "privacy" && (
        <>
          <AdPrivacySettings />
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
