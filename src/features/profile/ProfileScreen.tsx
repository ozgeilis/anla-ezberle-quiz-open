import React, { useMemo, useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { SettingsButton } from "../../components/ui/SettingsButton";
import { BackButton } from "../../components/ui/BackButton";
import { Txt } from "../../components/ui";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { useFocusEffect } from "expo-router";
import { dateKey } from "../../domain/game/engine";
import { progress } from "../../domain/scoring/progress";
import { useGameLibrary } from "../../storage/GameProvider";
import { useTheme } from "../../theme/tokens";
import { profileSummary } from "./summary";
import { PlayerIdentityCard } from "./PlayerIdentityCard";
import { PlayerStatsGrid } from "./PlayerStatsGrid";
import { BadgeShowcase } from "./BadgeShowcase";
import { FriendsPreview } from "./FriendsPreview";
export function ProfileScreen() {
  const { data } = useGameLibrary(),
    { displayName, self } = usePlayerIdentity(),
    t = useTheme();
  const p = useMemo(() => progress(data.games), [data.games]);
  // Recalculate calendar-dependent streak on a new day, without rescanning on
  // unrelated profile/avatar/settings renders.
  const [today, setToday] = useState(() => dateKey());
  useFocusEffect(
    useCallback(() => {
      setToday(dateKey());
      const timer = setInterval(() => setToday(dateKey()), 60000);
      return () => clearInterval(timer);
    }, []),
  );
  const summary = useMemo(
    () => profileSummary(data.games, new Date(`${today}T12:00:00+03:00`)),
    [data.games, today],
  );
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: t.background }}
      contentContainerStyle={{
        width: "100%",
        maxWidth: 760,
        alignSelf: "center",
        padding: 16,
        paddingBottom: 24,
        gap: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <BackButton />
        <Txt
          size={23}
          weight="bold"
          accessibilityRole="header"
          style={{ flex: 1 }}
        >
          Profilim
        </Txt>
        <SettingsButton />
      </View>
      <PlayerIdentityCard
        name={displayName}
        username={self?.profile.username}
        avatar={data.profile.avatar}
        progress={p}
      />
      <PlayerStatsGrid summary={summary} />
      <BadgeShowcase />
      <FriendsPreview />
    </ScrollView>
  );
}
