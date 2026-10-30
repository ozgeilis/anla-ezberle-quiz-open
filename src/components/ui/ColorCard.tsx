import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colorCardPalettes } from "../../theme/tokens";

export type ColorCardTone = keyof typeof colorCardPalettes;
export const colorCardInk = (tone: ColorCardTone) =>
  tone === "gold" || tone === "coral" ? "#45300E" : "#FFFFFF";

/** Visual surface only; the caller owns its data, touch target and navigation. */
export function ColorCardSurface({
  tone,
  children,
  style,
  testID,
  accessibilityLabel,
}: React.PropsWithChildren<{
  tone: ColorCardTone;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}>) {
  return (
    <View
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[
        {
          flex: 1,
          minWidth: 0,
          borderRadius: 17,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,.4)",
          overflow: "hidden",
          boxShadow: "0px 3px 8px rgba(9,47,50,.10)",
        },
        style,
      ]}
    >
      {/* A native View clips the gradient reliably on iOS as well as Android. */}
      <LinearGradient
        colors={colorCardPalettes[tone]}
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ position: "absolute", inset: 0 }}
      />
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: "absolute",
          right: -24,
          top: -48,
          width: 130,
          height: 130,
          borderRadius: 65,
          borderWidth: 16,
          borderColor: "rgba(255,255,255,.06)",
        }}
      />
      {children}
    </View>
  );
}

export function ColorCardIcon({
  children,
  size = 32,
}: React.PropsWithChildren<{ size?: number }>) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 11,
        backgroundColor: "rgba(255,255,255,.19)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,.25)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}
