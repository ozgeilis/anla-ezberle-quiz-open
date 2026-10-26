import { PushProvider } from "../features/notifications/PushProvider";
import { SoundProvider } from "../features/audio/SoundProvider";
import { GameAudioEvents } from "../features/audio/GameAudioEvents";
import { AchievementProvider } from "../features/achievements/AchievementProvider";
import { RewardBanner } from "../features/achievements/RewardBanner";
import { SocialIdentityProvider } from "../features/online/SocialIdentityProvider";
import { InboxProvider } from "../features/online/InboxProvider";
import { InboxBanner } from "../features/online/InboxBanner";
import { OnlineProvider } from "../features/online/OnlineProvider";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Manrope_400Regular } from "@expo-google-fonts/manrope/400Regular";
import { Manrope_500Medium } from "@expo-google-fonts/manrope/500Medium";
import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";
import { Manrope_800ExtraBold } from "@expo-google-fonts/manrope/800ExtraBold";
import { GameProvider, useGame } from "../storage/GameProvider";
import { DuelProvider } from "../storage/DuelProvider";
import { colors as c, useTheme } from "../theme/tokens";
import { StorageNotice } from "../components/ui";
import { Pattern } from "../components/game/Artwork";

import * as SplashScreen from "expo-splash-screen";
import { BrandLoadingScreen } from "../branding/BrandLoadingScreen";

if (Platform.OS !== "web")
  void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppShell() {
  const { ready } = useGame();
  const theme = useTheme();
  useEffect(() => {
    // Fonts are ready when this shell mounts. Show storage/retry UI even if
    // reading local progress fails; never hold the OS splash over that UI.
    if (Platform.OS !== "web")
      void SplashScreen.hideAsync().catch(() => undefined);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.dark ? c.navy : c.canvas }}>
      <View pointerEvents="none" style={{ position: "absolute", inset: 0 }}>
        <Pattern color={c.teal} opacity={0.07} />
      </View>
      <SafeAreaView
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 960,
          alignSelf: "center",
          backgroundColor: theme.background,
          boxShadow: "0px 0px 70px rgba(0,45,50,0.12)",
        }}
      >
        <StatusBar style={theme.dark ? "light" : "dark"} />
        <StorageNotice />
        <InboxBanner />
        <RewardBanner />
        {ready ? (
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
              contentStyle: { backgroundColor: theme.background },
            }}
          />
        ) : (
          <BrandLoadingScreen fontsReady dark={theme.dark} />
        )}
      </SafeAreaView>
    </View>
  );
}
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  if (!loaded && !error) return <BrandLoadingScreen />;
  return (
    <SafeAreaProvider>
      <GameProvider>
        <SoundProvider>
          <OnlineProvider>
            <PushProvider>
              <InboxProvider>
                <SocialIdentityProvider>
                  <AchievementProvider>
                    <DuelProvider>
                      <GameAudioEvents />
                      <AppShell />
                    </DuelProvider>
                  </AchievementProvider>
                </SocialIdentityProvider>
              </InboxProvider>
            </PushProvider>
          </OnlineProvider>
        </SoundProvider>
      </GameProvider>
    </SafeAreaProvider>
  );
}
