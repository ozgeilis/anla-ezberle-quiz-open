import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Card, Tap, TextAction, Txt } from "../../components/ui";
import { BadgeArt } from "../achievements/BadgeArt";
import { useAchievements } from "../achievements/AchievementProvider";
import { useGameLibrary } from "../../storage/GameProvider";
import { showcaseBadges } from "../achievements/presentation";
import { useTheme } from "../../theme/tokens";
export function BadgeShowcase() {
  const { badges } = useAchievements(),
    { data } = useGameLibrary(),
    t = useTheme();
  const preview = showcaseBadges(badges, data.showcase ?? []);
  return (
    <Card style={{ gap: 12, padding: 12, borderColor: t.goldBorder }}>
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
          Rozet Vitrini
        </Txt>
        <TextAction
          title="Tümünü Gör"
          onPress={() => router.push("/achievements")}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {preview.map((b) => (
          <Tap
            key={b.id}
            label={`${b.title}, rozet detayını aç`}
            onPress={() =>
              router.push({
                pathname: "/achievements",
                params: { badge: b.id },
              })
            }
            style={{
              flex: 1,
              minWidth: 0,
              alignItems: "center",
              gap: 8,
              paddingVertical: 4,
            }}
          >
            <BadgeArt badge={b} earned size={66} />
            <Txt size={11} style={{ textAlign: "center" }}>
              {b.title}
            </Txt>
          </Tap>
        ))}
      </View>
      {!preview.length && (
        <Txt size={12} color={t.muted}>
          İlk rozetini kazandığında burada sergileyebilirsin.
        </Txt>
      )}
    </Card>
  );
}
