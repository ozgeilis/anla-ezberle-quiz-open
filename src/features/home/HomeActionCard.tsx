import React from "react";
import { View } from "react-native";
import { Icon, Tap, Txt } from "../../components/ui";
import type { IconName } from "../../components/ui/primitives";
import {
  ColorCardIcon,
  ColorCardSurface,
  colorCardInk,
  type ColorCardTone,
} from "../../components/ui/ColorCard";

export function HomeActionCard({
  id,
  title,
  label,
  icon,
  tone,
  value,
  description,
  onPress,
}: {
  id: string;
  title: string;
  label: string;
  icon: IconName;
  tone: ColorCardTone;
  value?: string;
  description?: string;
  onPress: () => void;
}) {
  const ink = colorCardInk(tone);
  return (
    <Tap fill label={label} onPress={onPress}>
      <ColorCardSurface
        tone={tone}
        testID={`home-card-${id}`}
        style={{ padding: 12, minHeight: 124, gap: 8 }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ColorCardIcon size={34}>
            <Icon name={icon} size={24} color={ink} />
          </ColorCardIcon>
          <Icon name="chevron-right" size={16} color={ink} />
        </View>
        <Txt size={14} weight="semibold" color={ink} style={{ flexGrow: 1 }}>
          {title}
        </Txt>
        {value !== undefined && (
          <Txt size={26} weight="heavy" color={ink} style={{ lineHeight: 34 }}>
            {value}
          </Txt>
        )}
        {description && (
          <Txt size={11} color={ink}>
            {description}
          </Txt>
        )}
      </ColorCardSurface>
    </Tap>
  );
}

export function HomePlayButton({ onPress }: { onPress: () => void }) {
  return (
    <Tap label="Oyuna Başla" onPress={onPress}>
      <ColorCardSurface
        tone="green"
        style={{
          minHeight: 52,
          paddingVertical: 8,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Icon name="play" size={26} color="#FFFFFF" />
        <Txt
          size={16}
          weight="bold"
          color="#FFFFFF"
          style={{ flex: 1, textAlign: "center" }}
        >
          Oyuna Başla
        </Txt>
        <Icon name="chevron-right" size={18} color="#FFFFFF" />
      </ColorCardSurface>
    </Tap>
  );
}
