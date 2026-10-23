import React from "react";
import { View } from "react-native";
import { Slot, router, usePathname } from "expo-router";
import { tr } from "../../localization/tr";
import { Icon, Tap, Txt } from "../../components/ui";
import {
  colors as c,
  homePalette,
  shadows,
  useTheme,
} from "../../theme/tokens";
export default function TabLayout() {
  const path = usePathname();
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Slot />
      </View>
      <View
        accessibilityRole="tablist"
        accessibilityLabel="Ana gezinme"
        style={{
          flexDirection: "row",
          backgroundColor: homePalette(theme.dark).nav,
          borderTopWidth: 1,
          borderColor: theme.border,
          paddingVertical: 7,
          boxShadow: shadows.dock,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingHorizontal: 6,
        }}
      >
        {tr.tabs.map((tab) => {
          const active = path === tab.href;
          return (
            <View key={tab.href} style={{ flex: 1 }}>
              <Tap
                role="tab"
                label={tab.label}
                selected={active}
                onPress={() => router.replace(tab.href)}
                style={{
                  alignItems: "center",
                  minHeight: 54,
                  justifyContent: "center",
                  gap: 4,
                  minWidth: 0,
                  borderRadius: 18,
                  paddingHorizontal: 2,
                  backgroundColor: active ? theme.mintSurface : "transparent",
                }}
              >
                <Icon
                  name={tab.icon}
                  size={22}
                  color={active ? theme.accent : theme.muted}
                />
                <Txt
                  size={10}
                  weight={active ? "heavy" : "medium"}
                  color={active ? theme.accent : theme.muted}
                >
                  {tab.label}
                </Txt>
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: active ? 16 : 0,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: c.gold,
                  }}
                />
              </Tap>
            </View>
          );
        })}
      </View>
    </View>
  );
}
