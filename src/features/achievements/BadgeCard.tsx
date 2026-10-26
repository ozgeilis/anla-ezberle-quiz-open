import React from "react";
import { View } from "react-native";
import { Tap, Txt } from "../../components/ui";
import { ProgressMeter } from "../../components/ui/visuals";
import type { BadgeState } from "../../domain/achievements/evaluate";
import { useTheme } from "../../theme/tokens";
import { BadgeArt } from "./BadgeArt";
import { badgePresentation, badgeProgressCaption } from "./presentation";
export const BadgeCard = React.memo(function BadgeCard({
  badge: b,
  onPress,
}: {
  badge: BadgeState;
  onPress: () => void;
}) {
  const t = useTheme(),
    state = badgePresentation(b);
  return (
    <Tap
      fill
      label={`${b.title}. ${state.label}. ${badgeProgressCaption(b)}. Ayrıntıları aç`}
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: 18,
        padding: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: b.earned ? t.goldBorder : t.border,
        backgroundColor: b.earned ? t.goldSurface : t.card,
      }}
    >
      <View testID={`badge-${b.id}`} style={{ flex: 1, gap: 8 }}>
        <View style={{ alignItems: "center" }}>
          <BadgeArt badge={b} earned={b.earned} size={72} />
        </View>
        <Txt size={14} weight="semibold">
          {b.title}
        </Txt>
        <Txt size={11} color={t.muted}>
          {b.description}
        </Txt>
        <View style={{ marginTop: "auto", gap: 4 }}>
          <ProgressMeter
            label={`${b.title} ilerlemesi`}
            value={Math.round(b.fraction * 100)}
            max={100}
          />
          <Txt size={11} color={t.muted}>
            {badgeProgressCaption(b)} · {state.label}
          </Txt>
        </View>
      </View>
    </Tap>
  );
});
