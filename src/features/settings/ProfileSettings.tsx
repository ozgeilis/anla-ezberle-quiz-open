import React, { useState } from "react";
import { TextInput, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Avatar } from "../../components/game/Artwork";
import { Button, Card, Txt } from "../../components/ui";
import {
  type Feedback,
  FeedbackDialog,
} from "../../components/ui/FeedbackDialog";
import { useGame } from "../../storage/GameProvider";
import { fonts, useTheme } from "../../theme/tokens";
import { useOnlineAuth } from "../online/OnlineProvider";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { displayNameError } from "../online/identity";
import { SocialProfile } from "../online/SocialProfile";
import { PersonalizationDialog } from "../profile/Personalization";
import { SettingsFrame } from "./SettingsLayout";

export function ProfileSettings() {
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
