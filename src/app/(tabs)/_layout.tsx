import React from "react";
import { View } from "react-native";
import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import { tr } from "../../localization/tr";
import { Icon, Tap, Txt } from "../../components/ui";
import {
  colors as c,
  homePalette,
  shadows,
  useTheme,
} from "../../theme/tokens";

function PremiumTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const theme = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Ana gezinme"
      style={{
        flexDirection: "row",
        backgroundColor: homePalette(theme.dark).nav,
        borderTopWidth: 1,
        borderColor: theme.border,
        paddingVertical: 4,
        paddingHorizontal: 4,
        boxShadow: shadows.dock,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
    >
      {tr.tabs.map((tab) => {
        const name = tab.href === "/" ? "index" : tab.href.slice(1);
        const route = state.routes.find((r) => r.name === name);
        if (!route) return null;
        const active = state.routes[state.index]?.key === route.key;
        return (
          <View key={route.key} style={{ flex: 1, minWidth: 0 }}>
            <Tap
              role="tab"
              label={tab.label}
              selected={active}
              sound={false}
              onPress={() => {
                const event = emitter.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!active && !event.defaultPrevented)
                  navigateToTab(route.key);
              }}
              style={{
                alignItems: "center",
                justifyContent: "center",
                minHeight: 48,
                gap: 2,
                borderRadius: 15,
                paddingHorizontal: 1,
                backgroundColor: active ? theme.mintSurface : "transparent",
              }}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={active ? theme.accent : theme.muted}
              />
              <Txt
                size={10}
                weight={active ? "heavy" : "medium"}
                color={active ? theme.accent : theme.muted}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                {tab.label}
              </Txt>
              {active && (
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: 15,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: c.gold,
                  }}
                />
              )}
            </Tap>
          </View>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const theme = useTheme();
  // Lazy first mount; thereafter retain each screen/scroll/selection instead of
  // replacing the route on every tap. No audio, storage, or network awaits here.
  return (
    <Tabs
      tabBar={(props) => <PremiumTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        animation: "none",
        freezeOnBlur: true,
        sceneStyle: { backgroundColor: theme.background },
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="categories" />
      <Tabs.Screen name="ranking" />
      <Tabs.Screen name="achievements" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
