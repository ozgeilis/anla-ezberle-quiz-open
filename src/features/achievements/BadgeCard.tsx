import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Button, Icon, Txt } from "../../components/ui";
import { ProgressMeter } from "../../components/ui/visuals";
import { Pattern } from "../../components/game/Artwork";
import type { BadgeState } from "../../domain/achievements/evaluate";
import { useTheme, colors as c, shadows } from "../../theme/tokens";
import { BadgeArt } from "./BadgeArt";
import { badgePresentation, badgeProgressCaption } from "./presentation";

export function BadgeCard({
  badge: b,
  showcased,
  onShowcase,
}: {
  badge: BadgeState;
  showcased: boolean;
  onShowcase: () => void;
}) {
  const theme = useTheme(),
    state = badgePresentation(b),
    upcoming = state.tone === "upcoming";
  const locked = !b.earned;
  const colors = theme.dark
    ? locked
      ? (["#24454B", "#183B42"] as const)
      : (["#365B46", "#153E3B"] as const)
    : locked
      ? (["#EFECE5", "#E1DDD5"] as const)
      : (["#FFF0B8", "#FFFAED"] as const);
  return (
    <LinearGradient
      testID={`badge-${b.id}`}
      colors={colors}
      style={{
        flex: 1,
        borderRadius: 24,
        padding: 10,
        gap: 6,
        overflow: "hidden",
        borderWidth: b.earned ? 2 : 1,
        borderColor: b.earned ? c.gold : theme.border,
        boxShadow: b.earned ? shadows.reward : shadows.card,
      }}
    >
      <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
        <Pattern color={b.earned ? c.gold : theme.muted} opacity={0.08} />
      </View>
      <View
        style={{
          alignSelf: upcoming ? "stretch" : "flex-start",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          paddingHorizontal: 8,
          paddingVertical: 5,
          borderRadius: 16,
          backgroundColor: upcoming
            ? theme.goldSurface
            : b.earned
              ? c.emerald
              : theme.card,
        }}
      >
        <Icon
          name={state.icon}
          size={12}
          color={b.earned ? c.white : theme.text}
        />
        <Txt size={10} weight="heavy" color={b.earned ? c.white : theme.text}>
          {state.label}
        </Txt>
      </View>
      <View style={{ alignItems: "center" }}>
        <BadgeArt badge={b} earned={b.earned} size={88} />
      </View>
      <Txt size={14} weight="heavy">
        {b.title}
      </Txt>
      <Txt size={12} color={theme.muted}>
        {b.description}
      </Txt>
      <View style={{ marginTop: "auto", paddingTop: 6, gap: 7 }}>
        <ProgressMeter
          label={`${b.title} ilerlemesi`}
          value={Math.round(b.fraction * 100)}
          max={100}
        />
        <Txt size={11} weight="bold" color={theme.text}>
          {badgeProgressCaption(b)}
        </Txt>
        {b.group === "social" && !b.available && (
          <Txt size={11} color={theme.muted}>
            İlerleme için hesabına giriş yap.
          </Txt>
        )}
        {b.earned && (
          <Button
            title={showcased ? "Vitrinden çıkar" : "Vitrine ekle"}
            variant="orange"
            compact
            onPress={onShowcase}
          />
        )}
      </View>
    </LinearGradient>
  );
}
