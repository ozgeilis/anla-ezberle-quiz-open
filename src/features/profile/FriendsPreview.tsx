import React from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Avatar } from "../../components/game/Artwork";
import { Card, Icon, Tap, TextAction, Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useProfileFriends } from "./useProfileFriends";
export function FriendsPreview() {
  const router = useRouter();
  const { friends, loading, error, signedIn } = useProfileFriends(),
    t = useTheme();
  const open = () => router.push("/online/players");
  return (
    <Card style={{ padding: 12, gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Txt
          size={18}
          weight="bold"
          accessibilityRole="header"
          style={{ flexGrow: 1 }}
        >
          Arkadaşlar
        </Txt>
        <TextAction title="Tümünü Gör" onPress={open} />
      </View>
      {loading && (
        <Txt size={12} color={t.muted}>
          Arkadaşların yükleniyor…
        </Txt>
      )}
      {!!error && (
        <Txt size={12} accessibilityRole="alert">
          Arkadaşların şu anda yüklenemedi.
        </Txt>
      )}
      {!!friends.length && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        >
          {friends.slice(0, 5).map((f) => (
            <Tap
              key={f.id}
              label={`${f.player!.name}, arkadaşlarını aç`}
              onPress={open}
              style={{ width: 64, alignItems: "center", gap: 6 }}
            >
              <Avatar variant={f.player!.avatar} size={48} />
              <Txt size={11} style={{ textAlign: "center" }}>
                {f.player!.name}
              </Txt>
            </Tap>
          ))}
        </ScrollView>
      )}
      {!loading && !error && !friends.length && (
        <Txt size={12} color={t.muted}>
          {signedIn
            ? "Birlikte öğrenmek için ilk arkadaşını ekle."
            : "Arkadaşlarını görmek için hesabını bağla."}
        </Txt>
      )}
      <Tap
        label="Arkadaş ekle"
        onPress={open}
        style={{
          minHeight: 44,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon name="user-plus" color={t.accent} size={20} />
        <Txt size={13} weight="semibold" color={t.accent}>
          Arkadaş Ekle
        </Txt>
      </Tap>
    </Card>
  );
}
