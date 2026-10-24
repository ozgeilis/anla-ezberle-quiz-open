import React from "react";
import { View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Avatar, Scene } from "./Artwork";
import { Icon, Tap, Txt, s } from "../ui";
import { SettingsButton, NotificationsButton } from "../ui/SettingsButton";
import { usePlayerIdentity } from "../../features/online/SocialIdentityProvider";
import { ProgressMeter } from "../ui/visuals";
import { progress } from "../../domain/scoring/progress";
import { useGameLibrary } from "../../storage/GameProvider";
import { colors as c, useTheme } from "../../theme/tokens";

/** Shared edge-to-edge illustrated scene, with a native curved surface below. */
export function ReferenceHero({
  children,
  night = false,
}: React.PropsWithChildren<{ night?: boolean }>) {
  const theme = useTheme();
  return (
    <View style={{ overflow: "hidden", backgroundColor: c.teal }}>
      <Scene variant={night ? "result" : "hero"} />
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(0,66,72,0.55)", "transparent", "rgba(0,66,72,0.15)"]}
        style={{ position: "absolute", inset: 0 }}
      />
      <View style={{ padding: 14, paddingBottom: 28 }}>{children}</View>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -23,
          left: -16,
          right: -16,
          height: 46,
          borderTopLeftRadius: 180,
          borderTopRightRadius: 180,
          backgroundColor: theme.background,
          borderTopWidth: 2,
          borderColor: c.paleGold,
        }}
      />
    </View>
  );
}
export function PlayerHeader({
  notifications = false,
}: {
  notifications?: boolean;
}) {
  const { displayName } = usePlayerIdentity();
  const { data } = useGameLibrary(),
    p = progress(data.games),
    compact = useWindowDimensions().width < 430;
  const xp = (
    <View
      style={{
        width: notifications ? "100%" : compact ? 104 : 120,
        padding: 7,
        borderRadius: 18,
        backgroundColor: "rgba(0,89,83,0.90)",
        borderWidth: 1,
        borderColor: "#22C3AC",
        gap: 4,
        flexDirection: notifications ? "row" : "column",
        alignItems: notifications ? "center" : undefined,
      }}
    >
      <View style={[s.row, { gap: 5, justifyContent: "center" }]}>
        <Icon name="star" color={c.gold} size={20} />
        <Txt weight="heavy" size={12} color={c.white}>
          Seviye {p.level}
        </Txt>
      </View>
      <View style={{ flex: notifications ? 1 : undefined }}>
        <ProgressMeter
          label="Seviye ilerlemesi"
          value={p.levelXp}
          max={250}
          tone="gold"
          onJewel
        />
      </View>
      <Txt size={10} color={c.white} style={{ textAlign: "center" }}>
        {p.level === 100 ? "En üst seviye" : `${p.levelXp} / 250 XP`}
      </Txt>
    </View>
  );
  return (
    <View style={{ gap: 8, marginBottom: 10 }}>
      <View style={[s.row, { justifyContent: "space-between", gap: 8 }]}>
        <Tap
          label="Profilini aç"
          onPress={() => router.push("/profile")}
          style={[s.row, { gap: 8, flexShrink: 1, flexGrow: 1 }]}
        >
          <Avatar variant={data.profile.avatar} size={compact ? 40 : 44} />
          <View
            style={{
              flexShrink: 1,
              maxWidth: compact ? (notifications ? 135 : 70) : 160,
            }}
          >
            <Txt size={12} color={c.white}>
              Merhaba
            </Txt>
            <Txt numberOfLines={1} weight="heavy" size={16} color={c.white}>
              {displayName}
            </Txt>
          </View>
        </Tap>
        {!notifications && xp}
        <View style={[s.row, { gap: 6 }]}>
          {notifications && <NotificationsButton />}
          <SettingsButton />
        </View>
      </View>
      {notifications && xp}
    </View>
  );
}

export function GoldHeading({
  children,
  size = 34,
}: React.PropsWithChildren<{ size?: number }>) {
  return (
    <Txt
      accessibilityRole="header"
      weight="heavy"
      size={size}
      color="#FFD65B"
      style={{
        textAlign: "center",
        letterSpacing: -1,
        textShadowColor: "#A64804",
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 0,
      }}
    >
      {children}
    </Txt>
  );
}
