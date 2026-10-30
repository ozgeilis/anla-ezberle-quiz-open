import React from "react";
import { useWindowDimensions } from "react-native";
import { Txt } from "../../components/ui";
import {
  ColorCardSurface,
  ColorCardIcon,
  colorCardInk,
  type ColorCardTone,
} from "../../components/ui/ColorCard";
import { StatGlyph, type StatIcon } from "./StatGlyph";
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
  tone: ColorCardTone;
  description?: string;
}) {
  const { width } = useWindowDimensions();
  const ink = colorCardInk(tone);
  return (
    <ColorCardSurface
      tone={tone}
      accessibilityLabel={description ?? `${title}: ${value}`}
      testID={`profile-stat-${tone}`}
      style={{
        padding: width < 350 ? 9 : 12,
        minHeight: 140,
        gap: 8,
      }}
    >
      <ColorCardIcon>
        <StatGlyph name={icon} color={ink} />
      </ColorCardIcon>
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
    </ColorCardSurface>
  );
}
