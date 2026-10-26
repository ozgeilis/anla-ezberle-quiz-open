import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { ProfileAchievements } from "../achievements/ProfileAchievements";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { SettingsButton } from "../../components/ui/SettingsButton";
import { ReferenceHero } from "../../components/game/ReferenceHero";
import { Avatar } from "../../components/game/Artwork";
import {
  Button,
  Card,
  Dialog,
  Icon,
  Tap,
  TextAction,
  Txt,
} from "../../components/ui";
import { ProgressMeter } from "../../components/ui/visuals";
import { progress } from "../../domain/scoring/progress";
import { useGameLibrary } from "../../storage/GameProvider";
import { colors as c, useTheme } from "../../theme/tokens";
import { profileSummary } from "./summary";
import { useAchievements } from "../achievements/AchievementProvider";

export function ProfileScreen() {
  const { data } = useGameLibrary(),
    { displayName, self } = usePlayerIdentity(),
    t = useTheme();
  const { social } = useAchievements(),
    p = progress(data.games),
    summary = profileSummary(data.games);
  const [details, setDetails] = useState(false);
  const stats = [
    { title: "Oynanan Oyun", value: String(summary.games) },
    {
      title: "Doğruluk Oranı",
      value: summary.accuracy === null ? "Henüz yok" : `%${summary.accuracy}`,
    },
    { title: "Toplam Skor", value: summary.totalScore.toLocaleString("tr-TR") },
  ];
  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: t.background }}
        contentContainerStyle={{
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
          paddingBottom: 24,
        }}
      >
        <ReferenceHero>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Txt
              size={22}
              weight="bold"
              accessibilityRole="header"
              color={c.white}
            >
              Profilim
            </Txt>
            <SettingsButton />
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,52,55,.92)",
              padding: 16,
              borderRadius: 20,
              gap: 12,
            }}
          >
            <View
              style={{ flexDirection: "row", gap: 12, alignItems: "center" }}
            >
              <Tap
                label="Profil avatarını düzenle"
                onPress={() => router.push("/settings/profile")}
              >
                <Avatar variant={data.profile.avatar} size={64} />
              </Tap>
              <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                <Txt size={22} weight="bold" color={c.white}>
                  {displayName}
                </Txt>
                <Txt size={12} color={c.tealLight}>
                  {self?.profile.username
                    ? `@${self.profile.username}`
                    : "Misafir Oyuncu"}
                </Txt>
                <Txt size={12} color={c.white}>
                  Seviye {p.level} · {p.xp} XP
                </Txt>
              </View>
            </View>
            <ProgressMeter
              label="Seviye ilerlemesi"
              value={p.levelXp}
              max={250}
              onJewel
              tone="gold"
            />
            <Txt size={11} color={c.tealLight}>
              {p.level === 100 ? "En üst seviye" : `${p.levelXp} / 250 XP`} · Bu
              cihazdaki ilerlemen
            </Txt>
          </View>
        </ReferenceHero>
        <View style={{ paddingHorizontal: 16, gap: 20 }}>
          <ProfileAchievements />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {stats.map((item) => (
              <Card
                key={item.title}
                style={{ flexGrow: 1, flexBasis: 80, gap: 4, padding: 12 }}
              >
                <Txt size={16} weight="semibold">
                  {item.value}
                </Txt>
                <Txt size={11} color={t.muted}>
                  {item.title}
                </Txt>
              </Card>
            ))}
          </View>
          <TextAction
            title="İstatistikleri Gör"
            onPress={() => setDetails(true)}
          />
          <Tap
            label="Arkadaşlar"
            onPress={() => router.push("/online/players")}
          >
            <Card
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Icon name="users" size={20} color={t.accent} />
              <Txt size={16} weight="semibold" style={{ flex: 1 }}>
                Arkadaşlar
              </Txt>
              {social && (
                <Txt size={12} color={t.muted}>
                  {social.metrics.friends}
                </Txt>
              )}
              <Icon name="chevron-right" size={16} color={t.muted} />
            </Card>
          </Tap>
          <Button
            title="Profili Düzenle"
            variant="outline"
            onPress={() => router.push("/settings/profile")}
          />
        </View>
      </ScrollView>
      <Dialog
        visible={details}
        title="İstatistiklerin"
        onClose={() => setDetails(false)}
      >
        {stats.map((item) => (
          <View
            key={item.title}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Txt size={14} style={{ flex: 1 }}>
              {item.title}
            </Txt>
            <Txt weight="semibold">{item.value}</Txt>
          </View>
        ))}
        <Txt>Günlük Seri · {summary.streak} gün</Txt>
        <Txt>Favori Kategori · {summary.favorite ?? "Henüz yok"}</Txt>
        <Txt size={12} color={t.muted}>
          Yerel istatistikler yalnız tamamlanmış yarışmalarından hesaplanır.
          Çevrimiçi başarılar sunucuda ayrı doğrulanır.
        </Txt>
      </Dialog>
    </>
  );
}
