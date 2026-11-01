import React, { useState } from "react";
import { View } from "react-native";
import { Txt } from "../../components/ui";
import { useTheme } from "../../theme/tokens";
import { useAds } from "./AdProvider";

function BannerSlot() {
  const { bannerRuntime } = useAds();
  const theme = useTheme();
  const [width, setWidth] = useState(0),
    [loaded, setLoaded] = useState(false),
    [failed, setFailed] = useState(false);
  if (!bannerRuntime || failed) return null;
  const Banner = bannerRuntime.Banner;
  return (
    <View
      testID="home-test-ad"
      onLayout={(event) => setWidth(Math.floor(event.nativeEvent.layout.width))}
      style={{
        marginTop: loaded ? 24 : 0,
        gap: 8,
        alignItems: "center",
        height: loaded ? undefined : 0,
        overflow: "hidden",
      }}
    >
      {loaded && (
        <Txt size={11} color={theme.muted}>
          Test reklamı
        </Txt>
      )}
      {width > 0 && (
        <Banner
          key={width}
          width={width}
          onLoaded={() => setLoaded(true)}
          onFailed={() => setFailed(true)}
        />
      )}
    </View>
  );
}
export function AdBanner() {
  const { bannerRuntime } = useAds();
  return bannerRuntime ? <BannerSlot /> : null;
}
