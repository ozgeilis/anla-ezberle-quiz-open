import React, { useEffect, useState } from "react";
import { Animated, Easing, Platform, StyleSheet, View } from "react-native";
import { colors as c } from "../../theme/tokens";
import { useReducedMotion } from "../ui";

// Sabit, hafif geometri: tek 1,5 saniyelik patlama; döngü veya rastgele render yok.
export function Celebration({ enabled }: { enabled: boolean }) {
  const reduced = useReducedMotion();
  const [flight] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (reduced || !enabled) {
      flight.setValue(1);
      return;
    }
    flight.setValue(0);
    const animation = Animated.timing(flight, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: Platform.OS !== "web",
    });
    animation.start();
    return () => animation.stop();
  }, [enabled, reduced, flight]);
  if (reduced || !enabled) return null;
  return (
    <View
      testID="result-confetti"
      pointerEvents="none"
      aria-hidden
      style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}
    >
      {Array.from({ length: 14 }, (_, i) => (
        <Animated.View
          key={i}
          style={{
            position: "absolute",
            left: `${7 + ((i * 17) % 87)}%`,
            top: 30 + (i % 3) * 22,
            width: i % 3 === 0 ? 6 : 4,
            height: 10,
            borderRadius: 1,
            backgroundColor: [c.gold, c.turquoise, c.coral, c.sky][i % 4],
            opacity: flight.interpolate({
              inputRange: [0, 0.1, 0.75, 1],
              outputRange: [0, 1, 0.9, 0],
            }),
            transform: [
              {
                translateY: flight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-35, 180 + (i % 4) * 22],
                }),
              },
              {
                translateX: flight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, i % 2 === 0 ? -22 : 22],
                }),
              },
              {
                rotate: flight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [`${i * 23}deg`, `${i * 23 + 200}deg`],
                }),
              },
            ],
          }}
        />
      ))}
    </View>
  );
}
