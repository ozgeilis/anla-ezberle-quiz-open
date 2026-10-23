import React, { useEffect, useState } from "react";
import { Animated, Platform, View } from "react-native";
import { Tap, Txt, useReducedMotion } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useAchievements } from "./AchievementProvider";
import { BadgeArt } from "./BadgeArt";
export function RewardBanner() {
  const { reward, dismiss } = useAchievements(),
    theme = useTheme(),
    reduced = useReducedMotion(),
    [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!reward.length) return;
    if (!reduced) {
      scale.setValue(0.94);
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: Platform.OS !== "web",
        speed: 22,
        bounciness: 3,
      }).start();
    }
    const timer = setTimeout(dismiss, 4500);
    return () => {
      clearTimeout(timer);
      scale.stopAnimation();
    };
  }, [reward, reduced, scale, dismiss]);
  if (!reward[0]) return null;
  return (
    <Animated.View
      style={{
        transform: [{ scale: reduced ? 1 : scale }],
        padding: 8,
        backgroundColor: theme.goldSurface,
      }}
    >
      <Tap
        label="Rozet ödül bildirimini kapat"
        onPress={dismiss}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 8,
        }}
      >
        <BadgeArt badge={reward[0]} earned size={55} />
        <View style={{ flex: 1, gap: 3 }}>
          <Txt
            accessibilityLiveRegion="polite"
            weight="heavy"
            color={theme.goldInk}
          >
            Yeni rozet! {reward[0].title}
            {reward.length > 1 ? ` +${reward.length - 1}` : ""}
          </Txt>
          <Txt size={12} color={theme.text}>
            {reward[0].description} Albümüne eklendi.
          </Txt>
        </View>
      </Tap>
    </Animated.View>
  );
}
