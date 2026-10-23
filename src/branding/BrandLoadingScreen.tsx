import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pattern } from "../components/game/Artwork";
import { colors as c, fonts } from "../theme/tokens";
import { brand } from "./identity";

/** Real startup/loading state only; no timer, onboarding gate or synthetic delay. */
export function BrandLoadingScreen({
  fontsReady = false,
  dark: savedDark,
}: {
  fontsReady?: boolean;
  dark?: boolean;
}) {
  const system = useColorScheme();
  const dark = savedDark ?? system === "dark";
  const ink = dark ? c.white : c.teal;
  return (
    <LinearGradient
      colors={dark ? [c.deepTeal, c.teal] : [c.cream, c.warmWhite]}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        gap: 16,
      }}
    >
      <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
        <Pattern color={dark ? c.tealLight : c.teal} opacity={0.06} />
      </View>
      <Image
        source={require("../../assets/images/icon.png")}
        accessible={false}
        style={{ width: 112, height: 112, borderRadius: 25 }}
      />
      <Text
        accessibilityRole="header"
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: ink,
          textAlign: "center",
          fontFamily: fontsReady ? fonts.heavy : undefined,
        }}
      >
        {brand.title}
      </Text>
      <Text
        style={{
          fontSize: 17,
          color: ink,
          textAlign: "center",
          fontFamily: fontsReady ? fonts.bold : undefined,
        }}
      >
        {brand.subtitle}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: ink,
          textAlign: "center",
          fontFamily: fontsReady ? fonts.regular : undefined,
        }}
      >
        {brand.slogan}
      </Text>
      <ActivityIndicator
        accessibilityLabel="Oyun hazırlanıyor"
        color={dark ? c.gold : c.teal}
        style={{ marginTop: 14 }}
      />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 1,
          color: dark ? c.tealLight : c.teal,
          marginTop: 16,
        }}
      >
        {brand.developer}
      </Text>
    </LinearGradient>
  );
}
