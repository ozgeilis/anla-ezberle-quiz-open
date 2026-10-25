import React, { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Platform,
  Text,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";

export const STUDIO_INTRO_MS = 1700;
/** Mounted once per JS cold start. No audio, storage writes, or AppState replay. */
export function StudioIntro({ onDone }: { onDone: () => void }) {
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    let mounted = true;
    let animation: Animated.CompositeAnimation | undefined;
    void AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (!mounted || reduced) return;
      fade.setValue(0);
      animation = Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.quad),
        useNativeDriver: Platform.OS !== "web",
      });
      animation.start();
    });
    const timer = setTimeout(onDone, STUDIO_INTRO_MS);
    return () => {
      mounted = false;
      clearTimeout(timer);
      animation?.stop();
    };
  }, [fade, onDone]);
  return (
    <View
      testID="studio-intro"
      style={{
        flex: 1,
        backgroundColor: "#000000",
        alignItems: "center",
        justifyContent: "center",
      }}
      onLayout={() => {
        if (Platform.OS !== "web")
          void SplashScreen.hideAsync().catch(() => undefined);
      }}
    >
      <Animated.View style={{ opacity: fade, paddingHorizontal: 24 }}>
        <Text
          accessibilityRole="header"
          style={{
            color: "#F7EFE0",
            fontSize: 24,
            fontWeight: "500",
            letterSpacing: 3,
            textAlign: "center",
          }}
        >
          Kovynel Studio
        </Text>
      </Animated.View>
    </View>
  );
}
