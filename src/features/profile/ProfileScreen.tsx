import { brand } from "../../branding/identity";
import { ProfileAchievements } from "../achievements/ProfileAchievements";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { SettingsButton } from "../../components/ui/SettingsButton";
import React from "react";
import { ScrollView, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { ReferenceHero } from "../../components/game/ReferenceHero";
import { profileSummary } from "./summary";
import { useAchievements } from "../achievements/AchievementProvider";
import { Avatar } from "../../components/game/Artwork";
import { Card, Chip, Icon, Tap, Txt } from "../../components/ui";
import { progress } from "../../domain/scoring/progress";
import { useGame } from "../../storage/GameProvider";
import { ProgressMeter } from "../../components/ui/visuals";
import { colors as c, shadows, useTheme } from "../../theme/tokens";
export function ProfileScreen() {
  const { data } = useGame();
  const { displayName, self } = usePlayerIdentity();
  const theme = useTheme();
  const compact = useWindowDimensions().width < 360;
  const { badges } = useAchievements();
  const summary = profileSummary(data.games);
  const earned = badges.filter((b) => b.earned).length;
  const p = progress(data.games);
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        paddingBottom: 32,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <ReferenceHero>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <Tap
            label="Ana sayfaya dön"
            onPress={() => router.replace("/")}
            style={{ padding: 10 }}
          >
            <Icon name="chevron-left" color={c.white} />
          </Tap>
          <Txt
            accessibilityRole="header"
            size={26}
            weight="heavy"
            color={c.white}
          >
            Profilim
          </Txt>
          <SettingsButton />
        </View>
        <View
          style={{
            alignItems: "center",
            gap: 7,
            paddingTop: 0,
            paddingBottom: 12,
          }}
        >
          <Tap
            label="Profil avatarını düzenle"
            onPress={() =>
              router.push({ pathname: "/settings", params: { edit: "avatar" } })
            }
            style={{
              borderRadius: 90,
              padding: 6,
              borderWidth: 4,
              borderColor: c.gold,
              backgroundColor: c.emerald,
              boxShadow: shadows.reward,
            }}
          >
            <Avatar variant={data.profile.avatar} size={compact ? 104 : 116} />
          </Tap>
          <Txt
            size={compact ? 32 : 36}
            weight="heavy"
            color={c.white}
            style={{
              textAlign: "center",
              textShadowColor: c.deepTeal,
              textShadowOffset: { width: 0, height: 3 },
              textShadowRadius: 2,
            }}
          >
            {displayName}
          </Txt>
          {!!self?.profile.username && (
            <Txt
              size={15}
              weight="bold"
              color={c.tealLight}
              style={{
                backgroundColor: "rgba(0,60,65,.88)",
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 5,
              }}
            >
              @{self.profile.username}
            </Txt>
          )}
          <Chip icon="star" style={{ alignSelf: "center" }}>
            <Txt weight="heavy" size={17} color={c.teal}>
              Seviye {p.level} · {p.title}
            </Txt>
          </Chip>
          <View style={{ width: "75%", maxWidth: 320, marginTop: 4 }}>
            <ProgressMeter
              label="Seviye ilerlemesi"
              value={p.levelXp}
              max={250}
              onJewel
              tone="gold"
            />
          </View>
          <Txt
            size={14}
            weight="bold"
            color={c.white}
            style={{
              backgroundColor: "rgba(0,60,65,0.88)",
              padding: 6,
              borderRadius: 12,
            }}
          >
            {p.levelXp} / 250 XP · {p.xp} toplam XP
          </Txt>
          <Txt
            size={11}
            color={c.white}
            style={{
              backgroundColor: "rgba(0,60,65,0.85)",
              padding: 6,
              borderRadius: 12,
            }}
          >
            Bu cihazdaki ilerlemen
          </Txt>
        </View>
      </ReferenceHero>
      <View style={{ paddingHorizontal: compact ? 14 : 20, gap: 16 }}>
        <Card
          style={{
            borderColor: theme.goldBorder,
            alignItems: "center",
            marginTop: -8,
          }}
        >
          <Txt size={14} weight="bold" style={{ textAlign: "center" }}>
            Her soru yeni bir şey öğrenmek için fırsat.
          </Txt>
        </Card>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          {[
            {
              title: "Toplam Skor",
              value: summary.totalScore.toLocaleString("tr-TR"),
              icon: "award" as const,
              color: c.orange,
            },
            {
              title: "Oynanan Oyun",
              value: String(summary.games),
              icon: "play" as const,
              color: c.emerald,
            },
            {
              title: "Doğruluk Oranı",
              value:
                summary.accuracy === null
                  ? "Henüz yok"
                  : `%${summary.accuracy}`,
              icon: "target" as const,
              color: c.coral,
            },
            {
              title: "Günlük Seri",
              value: `${summary.streak} gün`,
              icon: "zap" as const,
              color: c.deepOrange,
            },
            {
              title: "Başarı Yüzdesi",
              value: `%${badges.length ? Math.round((earned / badges.length) * 100) : 0}`,
              icon: "bar-chart-2" as const,
              color: "#8055C9",
            },
            {
              title: "Favori Kategori",
              value: summary.favorite ?? "Henüz yok",
              icon: "book-open" as const,
              color: c.blue,
            },
          ].map((stat) => (
            <Card
              key={stat.title}
              style={{
                width: "47%",
                flexGrow: 1,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 9,
                minHeight: 100,
              }}
            >
              <View
                style={{
                  width: compact ? 34 : 44,
                  height: compact ? 40 : 52,
                  borderRadius: 15,
                  backgroundColor: stat.color,
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: shadows.card,
                }}
              >
                <Icon
                  name={stat.icon}
                  color={c.white}
                  size={compact ? 23 : 29}
                />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Txt size={11} weight="medium">
                  {stat.title}
                </Txt>
                <Txt
                  size={
                    stat.title === "Favori Kategori" ? 13 : compact ? 20 : 24
                  }
                  weight="heavy"
                >
                  {stat.value}
                </Txt>
              </View>
            </Card>
          ))}
        </View>
        <ProfileAchievements />
        <Txt size={11} color={theme.muted} style={{ marginTop: 20 }}>
          Yalnızca tamamlanan bilgi yarışmaları XP ve rozet kazandırır. Yerel
          kayıtlar bu cihazda tutulur; çevrimiçi sosyal başarılar sunucuda
          doğrulanır. Eski tamamlanmış oyunların korunur.
        </Txt>
        <Txt
          size={12}
          weight="bold"
          color={theme.accent}
          style={{ marginTop: 16, textAlign: "center" }}
        >
          {brand.developer}
        </Txt>
      </View>
    </ScrollView>
  );
}
