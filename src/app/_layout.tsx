import { PushProvider } from "../features/notifications/PushProvider";
import { SoundProvider } from "../features/audio/SoundProvider";
import { GameAudioEvents } from "../features/audio/GameAudioEvents";
import { AchievementProvider } from "../features/achievements/AchievementProvider";
import { RewardBanner } from "../features/achievements/RewardBanner";
import { SocialIdentityProvider } from "../features/online/SocialIdentityProvider";
import { InboxProvider } from "../features/online/InboxProvider";
import { InboxBanner } from "../features/online/InboxBanner";
import { OnlineProvider } from "../features/online/OnlineProvider";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { Manrope_400Regular } from "@expo-google-fonts/manrope/400Regular";
import { Manrope_500Medium } from "@expo-google-fonts/manrope/500Medium";
import { Manrope_600SemiBold } from "@expo-google-fonts/manrope/600SemiBold";
import { Manrope_700Bold } from "@expo-google-fonts/manrope/700Bold";
import { Manrope_800ExtraBold } from "@expo-google-fonts/manrope/800ExtraBold";
import { GameProvider, useGameDisplay } from "../storage/GameProvider";
import { DuelProvider } from "../storage/DuelProvider";
import { colors as c, useTheme } from "../theme/tokens";
import { StorageNotice } from "../components/ui";
import { Pattern } from "../components/game/Artwork";

import * as SplashScreen from "expo-splash-screen";
import { StudioIntro } from "../branding/StudioIntro";

if (Platform.OS !== "web")
  void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function AppShell({
  fontsReady,
  introDone,
  finishIntro,
}: {
  fontsReady: boolean;
  introDone: boolean;
  finishIntro: () => void;
}) {
  const { ready } = useGameDisplay();
  const theme = useTheme();
  useEffect(() => {
    if (fontsReady && ready && introDone && Platform.OS !== "web")
      void SplashScreen.hideAsync().catch(() => undefined);
  }, [fontsReady, ready, introDone]);
  // Load fonts and local progress behind the same Studio view. No second brand
  // interstitial and no blank game shell; failed storage reads expose retry UI.
  if (!introDone || !fontsReady || !ready)
    return <StudioIntro onDone={finishIntro} />;
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
        <GameAudioEvents />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: { backgroundColor: theme.background },
          }}
        />
      </SafeAreaView>
    </View>
  );
}
export default function RootLayout() {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const [loaded, error] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
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
                      <AppShell
                        fontsReady={loaded || !!error}
                        introDone={introDone}
                        finishIntro={finishIntro}
                      />
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
