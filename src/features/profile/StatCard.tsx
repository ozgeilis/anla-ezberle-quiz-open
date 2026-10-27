import React from "react";
import { View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Txt } from "../../components/ui";
import { StatGlyph, type StatIcon } from "./StatGlyph";
const palettes = {
  green: ["#00A583", "#007D6C", "#075D59"],
  blue: ["#168BCC", "#0874B8", "#105B9B"],
  gold: ["#FFE08A", "#F4BC4B", "#D59124"],
  purple: ["#9471F1", "#7650D0", "#51349A"],
  coral: ["#FFB281", "#FF9A70", "#F1815F"],
} as const;
export function StatCard({
  title,
  value,
  icon,
  tone,
  description,
}: {
  title: string;
  value: string;
  icon: StatIcon;
  tone: keyof typeof palettes;
  description?: string;
}) {
  const { width } = useWindowDimensions();
  const ink = tone === "gold" || tone === "coral" ? "#45300E" : "#FFFFFF";
  return (
    <LinearGradient
      colors={palettes[tone]}
      accessibilityLabel={description ?? `${title}: ${value}`}
      testID={`profile-stat-${tone}`}
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: 17,
        padding: width < 350 ? 9 : 12,
        minHeight: 140,
        gap: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,.4)",
        overflow: "hidden",
        boxShadow: "0px 3px 8px rgba(9,47,50,.10)",
      }}
    >
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: "absolute",
          right: -24,
          top: -48,
          width: 130,
          height: 130,
          borderRadius: 65,
          borderWidth: 16,
          borderColor: "rgba(255,255,255,.06)",
        }}
      />
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 11,
          backgroundColor: "rgba(255,255,255,.19)",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,.25)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StatGlyph name={icon} color={ink} />
      </View>
      <Txt size={12} weight="semibold" color={ink} style={{ flexGrow: 1 }}>
        {title}
      </Txt>
      <Txt
        size={tone === "purple" ? 18 : width < 350 ? 24 : 26}
        weight="heavy"
        color={ink}
        style={{
          lineHeight: tone === "purple" ? 25 : 34,
          letterSpacing: tone === "purple" ? 0 : -0.8,
        }}
      >
        {value}
      </Txt>
    </LinearGradient>
  );
}
