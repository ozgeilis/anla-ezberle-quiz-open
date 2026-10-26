import React, { useEffect, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSound } from "../../features/audio/SoundProvider";
import type { SoundEffect } from "../../features/audio/catalog";
import { useTheme } from "../../theme/tokens";
import { useReducedMotion } from "./primitives";
export function Tap({
  children,
  onPress,
  disabled,
  label,
  style,
  selected,
  role = "button",
  fill = false,
  sound,
}: React.PropsWithChildren<{
  onPress: () => void;
  sound?: SoundEffect | false;
  disabled?: boolean;
  label: string;
  selected?: boolean;
  role?: "button" | "radio" | "tab";
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
}>) {
  const audio = useSound();
  const [scale] = useState(() => new Animated.Value(1));
  const [focused, setFocused] = useState(false);
  const theme = useTheme();
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      scale.stopAnimation();
      scale.setValue(1);
    }
  }, [reduce, scale]);
  const animate = (to: number) => {
    if (!reduce)
      Animated.spring(scale, {
        toValue: to,
        useNativeDriver: Platform.OS !== "web",
        speed: 40,
        bounciness: 2,
      }).start();
  };
  return (
    <Animated.View
      style={{ transform: [{ scale }], ...(fill ? { flex: 1 } : {}) }}
    >
      <Pressable
        accessibilityRole={role}
        aria-checked={role === "radio" ? !!selected : undefined}
        aria-selected={role === "tab" ? !!selected : undefined}
        accessibilityLabel={label}
        accessibilityState={{
          disabled: !!disabled,
          ...(role === "radio" ? { checked: !!selected } : { selected }),
        }}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onPress={() => {
          // Gameplay/selection owns the gesture. Audio runs after the visual
          // commit; native player creation must never sit before onPress.
          onPress();
          if (sound !== false) {
            const cue = sound ?? (role === "radio" ? "select" : "tap");
            requestAnimationFrame(() =>
              setTimeout(() => {
                audio.activate();
                audio.play(cue);
              }, 0),
            );
          }
        }}
        onPressIn={() => animate(0.98)}
        onPressOut={() => animate(1)}
        style={({ pressed }) => [
          {
            minHeight: 44,
            minWidth: 0,
            ...(fill ? { flex: 1 } : {}),
            opacity: disabled ? 0.65 : pressed ? 0.9 : 1,
          },
          style,
          Platform.OS === "web"
            ? {
                outlineColor: theme.goldBorder,
                outlineStyle: "solid",
                outlineWidth: focused && !disabled ? 2 : 0,
                outlineOffset: 3,
              }
            : undefined,
        ]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
