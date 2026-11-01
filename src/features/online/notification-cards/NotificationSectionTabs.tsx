import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Tap, Txt } from "../../../components/ui";
import { useTheme } from "../../../theme/tokens";
export type NotificationSection = "all" | "requests" | "invites";
export function NotificationSectionTabs({
  value,
  onChange,
}: {
  value: NotificationSection;
  onChange: (value: NotificationSection) => void;
}) {
  const theme = useTheme();
  const { fontScale } = useWindowDimensions();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Bildirim türleri"
      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
    >
      {(
        [
          ["all", "Tümü"],
          ["requests", "İstekler"],
          ["invites", "Davetler"],
        ] as const
      ).map(([id, label]) => (
        <View
          key={id}
          style={{
            flexGrow: 1,
            flexBasis: fontScale > 2.1 ? "100%" : fontScale > 1.3 ? "45%" : 0,
          }}
        >
          <Tap
            fill
            role="tab"
            selected={value === id}
            label={label}
            onPress={() => onChange(id)}
            style={{
              minHeight: 44,
              padding: 8,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: value === id ? "#0B6863" : theme.card,
              borderWidth: 1,
              borderColor: value === id ? theme.accent : theme.border,
            }}
          >
            <Txt
              size={13}
              weight="semibold"
              color={value === id ? "#FFFFFF" : theme.text}
            >
              {label}
            </Txt>
          </Tap>
        </View>
      ))}
    </View>
  );
}
