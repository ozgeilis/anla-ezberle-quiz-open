import Feather from "@expo/vector-icons/Feather";
import React, { ComponentProps, useEffect, useState } from "react";
import { AccessibilityInfo, Text, TextProps } from "react-native";
import { useGameDisplay } from "../../storage/GameProvider";
import { colors as c, fonts, typography, useTheme } from "../../theme/tokens";
export type IconName = ComponentProps<typeof Feather>["name"];
export function Icon({
  name,
  size = 20,
  color = c.teal,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return (
    <Feather
      name={name}
      size={size}
      color={color}
      accessible={false}
      aria-hidden={true}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
export function Txt({
  children,
  size = 14,
  weight = "regular",
  color,
  style,
  ...props
}: TextProps & { size?: number; weight?: keyof typeof fonts; color?: string }) {
  const theme = useTheme();
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: fonts[weight],
          fontSize: size,
          color: color ?? theme.text,
          lineHeight:
            Object.values(typography).find(([value]) => value === size)?.[1] ??
            Math.ceil(size * 1.4),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function useReducedMotion() {
  const { profile } = useGameDisplay();
  const [system, setSystem] = useState(true);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setSystem);
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystem,
    );
    return () => listener.remove();
  }, []);
  return system || profile.reduceMotion;
}
