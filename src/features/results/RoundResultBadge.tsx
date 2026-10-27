import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, Platform, View } from "react-native";
import { Txt, useReducedMotion } from "../../components/ui";
import { resultArtwork } from "./artwork";
import { resultPresentation } from "./presentation";
/** Server counts remain authoritative; this component only selects the presentation. */
export function RoundResultBadge({
  correct,
  total,
}: {
  correct: number;
  total: number;
}) {
  const valid =
    Number.isInteger(total) &&
    total > 0 &&
    Number.isInteger(correct) &&
    correct >= 0 &&
    correct <= total;
  const p = valid ? resultPresentation(correct, total) : null;
  const reduced = useReducedMotion();
  const played = useRef(false);
  const [scale] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (reduced) {
      scale.setValue(1);
      return;
    }
    if (played.current) return;
    played.current = true;
    scale.setValue(0.92);
    const motion = Animated.timing(scale, {
      toValue: 1,
      duration: 450,
      useNativeDriver: Platform.OS !== "web",
    });
    motion.start();
    return () => motion.stop();
  }, [reduced, scale]);
  if (!p)
    return (
      <Txt accessibilityRole="alert" color="#FFFFFF">
        Sonuç bilgisi henüz doğrulanamadı.
      </Txt>
    );
  return (
    <View
      testID={`round-result-${p.tier}`}
      style={{ alignItems: "center", gap: 5, maxWidth: 360 }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image
          source={resultArtwork[p.tier]}
          resizeMode="contain"
          accessibilityLabel={p.label}
          style={{ width: 154, height: 154 }}
        />
      </Animated.View>
      <Txt
        accessibilityRole="header"
        size={27}
        weight="heavy"
        color={p.accent}
        style={{ textAlign: "center" }}
      >
        {p.title}
      </Txt>
      <Txt size={13} color="#EDFFF6" style={{ textAlign: "center" }}>
        {p.message}
      </Txt>
    </View>
  );
}
