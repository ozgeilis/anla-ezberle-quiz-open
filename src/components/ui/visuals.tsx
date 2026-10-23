import React from "react";
import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Icon, type IconName, Tap, Txt, s } from "./index";
import { Pattern } from "../game/Artwork";
import { collection } from "../../theme/collection";
import {
  colors as c,
  difficultyPalette,
  homePalette,
  gradients,
  radius,
  shadows,
  useTheme,
} from "../../theme/tokens";

export function ProgressMeter({
  value,
  max,
  label,
  tone = "gold",
  onJewel = false,
}: {
  value: number;
  max: number;
  label: string;
  tone?: "gold" | "mint" | "rose";
  onJewel?: boolean;
}) {
  const theme = useTheme();
  const fraction = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(fraction * max)}
      accessibilityValue={{ min: 0, max, now: Math.round(fraction * max) }}
      style={{
        height: 10,
        borderRadius: radius.pill,
        backgroundColor: onJewel ? collection.track : theme.border,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <LinearGradient
        colors={
          tone === "gold"
            ? gradients.action
            : tone === "rose"
              ? [c.softCoral, c.deepCoral]
              : ["#67FFE0", "#0EC6B2", c.turquoise]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height: "100%",
          width: `${fraction * 100}%`,
          borderRadius: radius.pill,
        }}
      />
    </View>
  );
}

export function IconMedallion({
  name,
  tone = "mint",
  size = 52,
  earned = false,
}: {
  name: IconName;
  tone?: "gold" | "mint" | "rose" | "violet";
  size?: number;
  earned?: boolean;
}) {
  const theme = useTheme();
  const surface =
    tone === "gold"
      ? theme.goldSurface
      : tone === "rose"
        ? theme.roseSurface
        : tone === "violet"
          ? theme.violetSurface
          : theme.mintSurface;
  const ink =
    tone === "gold"
      ? theme.goldInk
      : tone === "rose"
        ? theme.danger
        : theme.accent;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: surface,
        borderWidth: earned ? 2 : 1,
        borderColor: earned ? theme.goldBorder : theme.border,
        alignItems: "center",
        justifyContent: "center",
        boxShadow: earned ? shadows.reward : "none",
      }}
    >
      <Icon name={name} size={Math.round(size * 0.43)} color={ink} />
      {earned && (
        <View style={{ position: "absolute", right: -3, top: -4 }}>
          <Icon name="star" size={15} color={theme.goldInk} />
        </View>
      )}
    </View>
  );
}

export function IllustratedPanel({
  children,
  artwork,
  minHeight = 180,
}: React.PropsWithChildren<{ artwork?: React.ReactNode; minHeight?: number }>) {
  const compact = useWindowDimensions().width < 360;
  return (
    <LinearGradient
      colors={gradients.reward}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: radius.lg,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: c.teal,
        padding: compact ? 18 : 22,
        minHeight,
      }}
    >
      <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
        <Pattern color={c.tealLight} opacity={0.08} />
      </View>
      <View style={[s.row, { gap: compact ? 10 : 18, alignItems: "center" }]}>
        <View style={{ flex: 1, minWidth: 0, gap: 10 }}>{children}</View>
        {artwork && (
          <View pointerEvents="none" style={{ flexShrink: 0 }}>
            {artwork}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

export function JewelStat({
  title,
  value,
  icon,
  blue = false,
  twoColumns = false,
}: {
  title: string;
  value: number | string;
  icon: IconName;
  blue?: boolean;
  twoColumns?: boolean;
}) {
  return (
    <LinearGradient
      colors={blue ? ["#126FAD", "#184677"] : ["#067B70", "#07505A"]}
      style={{
        flex: 1,
        flexBasis: twoColumns ? "45%" : 90,
        minWidth: 0,
        borderRadius: radius.md,
        padding: 14,
        gap: 7,
        borderWidth: 1,
        borderColor: blue ? "#5EB7F1" : "#26BEA9",
        boxShadow: collection.glow,
        overflow: "hidden",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -20,
          right: -20,
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: collection.glass,
        }}
      />
      <Icon name={icon} color={c.gold} size={22} />
      <Txt size={27} weight="heavy" color={c.white}>
        {value}
      </Txt>
      <Txt size={12} color={collection.secondary}>
        {title}
      </Txt>
    </LinearGradient>
  );
}

export function DifficultyTile({
  title,
  icon,
  hint,
  selected,
  onPress,
  small = false,
  tone,
}: {
  title: string;
  icon: IconName;
  hint?: string;
  selected?: boolean;
  onPress: () => void;
  small?: boolean;
  tone?: "easy" | "medium" | "hard";
}) {
  const theme = useTheme();
  const paint = tone ? difficultyPalette(tone, theme.dark) : null;
  const content = (
    <>
      {!!paint && (
        <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
          <Pattern color={paint.edge} opacity={0.12} />
          <View
            style={{
              position: "absolute",
              top: 2,
              left: 12,
              right: 12,
              height: 1,
              backgroundColor: "rgba(255,255,255,0.65)",
            }}
          />
        </View>
      )}
      <View
        style={[
          s.row,
          { gap: small ? 5 : 6, flexWrap: "wrap", justifyContent: "center" },
        ]}
      >
        <Icon
          name={selected ? "check-circle" : icon}
          color={paint?.icon ?? (selected ? theme.goldInk : theme.accent)}
          size={small ? 18 : 23}
        />
        <Txt
          weight="heavy"
          size={small ? 14 : 17}
          color={paint?.ink ?? (selected ? theme.goldInk : theme.text)}
        >
          {title}
        </Txt>
      </View>
      {!!hint && (
        <Txt
          size={12}
          color={paint?.ink ?? theme.muted}
          style={{ textAlign: "center" }}
        >
          {hint}
        </Txt>
      )}
    </>
  );
  return (
    <Tap
      label={`${small ? "" : "Zorluk: "}${title}`}
      role={small ? "button" : "radio"}
      selected={selected}
      onPress={onPress}
      style={{
        minHeight: small ? 54 : 108,
        borderRadius: small ? radius.pill : radius.md,
        borderWidth: 2,
        borderColor: selected
          ? theme.goldBorder
          : (paint?.edge ?? theme.border),
        backgroundColor: selected ? theme.goldSurface : theme.card,
        boxShadow: selected ? shadows.selected : shadows.card,
        overflow: "hidden",
      }}
    >
      {paint ? (
        <LinearGradient
          colors={paint.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flex: 1,
            minHeight: small ? 50 : 104,
            padding: small ? 8 : 12,
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={{
            flex: 1,
            minHeight: small ? 50 : 104,
            padding: small ? 10 : 12,
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          {content}
        </View>
      )}
    </Tap>
  );
}

/** Purely presentational: callers retain the real count, empty state and navigation. */
export function HomeSummaryCard({
  tone,
  label,
  value,
}: {
  tone: "score" | "badges";
  label: string;
  value: string | number;
}) {
  const theme = useTheme(),
    paint = homePalette(theme.dark);
  const compact = useWindowDimensions().width < 360;
  const ink = tone === "score" ? paint.scoreInk : paint.badgeInk;
  const edge = tone === "score" ? paint.scoreBorder : paint.badgeBorder;
  return (
    <LinearGradient
      colors={tone === "score" ? paint.score : paint.badges}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: edge,
        overflow: "hidden",
        minHeight: 90,
        padding: compact ? 10 : 12,
        flexDirection: "row",
        alignItems: "center",
        gap: compact ? 6 : 8,
        boxShadow: shadows.card,
      }}
    >
      <View
        pointerEvents="none"
        aria-hidden
        accessible={false}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: -8,
          width: 70,
        }}
      >
        <Pattern color={edge} opacity={0.22} />
      </View>
      {tone === "badges" && (
        <View
          pointerEvents="none"
          aria-hidden
          accessible={false}
          style={{ position: "absolute", top: 7, right: 29 }}
        >
          <Svg width={31} height={24} viewBox="0 0 31 24" aria-hidden>
            <Path
              d="M9 1l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z M25 13l1 3 4 1-4 1-1 4-1-4-3-1 3-1Z"
              fill={paint.badgeBorder}
              opacity={0.65}
            />
          </Svg>
        </View>
      )}
      <Icon
        name={tone === "score" ? "bar-chart-2" : "award"}
        color={tone === "score" ? paint.scoreIcon : paint.badgeIcon}
        size={compact ? 24 : 28}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt size={12} color={ink}>
          {label}
        </Txt>
        <Txt
          size={compact ? 18 : 20}
          weight="heavy"
          color={ink}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {value}
        </Txt>
      </View>
      <Icon name="chevron-right" size={18} color={ink} />
    </LinearGradient>
  );
}
