import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import { Icon, IconButton, Txt, useReducedMotion } from "../../components/ui";
import { resultArtwork } from "./artwork";
import { resultPresentation } from "./presentation";
import { useTheme } from "../../theme/tokens";

export function ResultExperience({
  correct,
  total,
  wrong,
  unanswered = 0,
  seconds,
  score,
  xp,
  isRecord,
  onHome,
  children,
}: React.PropsWithChildren<{
  correct: number;
  total: number;
  wrong: number;
  unanswered?: number;
  seconds: string;
  score: number;
  xp: number;
  isRecord: boolean;
  onHome: () => void;
}>) {
  const outcome = resultPresentation(correct, total),
    theme = useTheme(),
    reduced = useReducedMotion();
  const { width, fontScale } = useWindowDimensions();
  const hasPlayed = useRef(false);
  const [entrance] = useState(() => new Animated.Value(0));
  const [fill] = useState(() => new Animated.Value(0));
  const [burst] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (reduced) {
      entrance.setValue(1);
      fill.setValue(1);
      burst.setValue(1);
      return;
    }
    if (hasPlayed.current) return;
    hasPlayed.current = true;
    entrance.setValue(0);
    fill.setValue(0);
    burst.setValue(0);
    const animation = Animated.parallel([
      Animated.timing(entrance, {
        toValue: 1,
        duration: 560,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(fill, {
        toValue: 1,
        duration: 850,
        delay: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
      Animated.timing(burst, {
        toValue: 1,
        duration: 1550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: Platform.OS !== "web",
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [reduced, entrance, fill, burst]);
  const ink = "#F4FFF9",
    muted = "#C9E4DC";
  const panel = theme.dark ? "rgba(18,39,56,.94)" : "rgba(0,54,56,.84)";
  return (
    <LinearGradient colors={outcome.background} style={{ flex: 1 }}>
      <ScrollView
        testID={`result-${outcome.tier}`}
        contentContainerStyle={{
          width: "100%",
          maxWidth: 620,
          alignSelf: "center",
          padding: width < 360 ? 14 : 20,
          paddingBottom: 28,
        }}
      >
        <View style={{ alignItems: "flex-end", height: 44 }}>
          <IconButton
            name="x"
            label="Sonucu kapat ve ana sayfaya dön"
            onPress={onHome}
            light
          />
        </View>
        <View
          style={{ alignItems: "center", marginTop: -16, paddingBottom: 18 }}
        >
          <View
            pointerEvents="none"
            accessible={false}
            aria-hidden
            style={{
              position: "absolute",
              top: -24,
              width: 290,
              height: 240,
              borderRadius: 160,
              overflow: "hidden",
            }}
          >
            <Svg
              width="100%"
              height="100%"
              viewBox="0 0 290 240"
              accessible={false}
            >
              <Defs>
                <RadialGradient id="result-halo">
                  <Stop
                    offset="0"
                    stopColor={outcome.accent}
                    stopOpacity=".45"
                  />
                  <Stop
                    offset=".42"
                    stopColor={outcome.fill}
                    stopOpacity=".17"
                  />
                  <Stop offset="1" stopColor={outcome.fill} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Ellipse
                cx="145"
                cy="118"
                rx="145"
                ry="118"
                fill="url(#result-halo)"
              />
            </Svg>
          </View>
          {!reduced && outcome.confetti > 0 && (
            <View
              testID="result-confetti"
              pointerEvents="none"
              accessible={false}
              aria-hidden
              style={[StyleSheet.absoluteFill, { overflow: "hidden" }]}
            >
              {Array.from({ length: outcome.confetti }, (_, i) => (
                <Animated.View
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${5 + ((i * 19) % 90)}%`,
                    top: 20,
                    width: i % 3 ? 5 : 8,
                    height: 12,
                    borderRadius: 2,
                    backgroundColor: [outcome.accent, outcome.fill, "#FF916A"][
                      i % 3
                    ],
                    opacity: burst.interpolate({
                      inputRange: [0, 0.1, 0.8, 1],
                      outputRange: [0, 1, 1, 0],
                    }),
                    transform: [
                      {
                        translateY: burst.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-25, 220 + (i % 4) * 20],
                        }),
                      },
                      {
                        rotate: burst.interpolate({
                          inputRange: [0, 1],
                          outputRange: [`${i * 23}deg`, `${i * 23 + 160}deg`],
                        }),
                      },
                    ],
                  }}
                />
              ))}
            </View>
          )}
          <Animated.View
            style={{
              opacity: entrance,
              transform: [
                {
                  scale: entrance.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.88, 1],
                  }),
                },
              ],
            }}
          >
            <Image
              testID={`result-art-${outcome.tier}`}
              source={resultArtwork[outcome.tier]}
              accessibilityLabel={outcome.label}
              resizeMode="contain"
              style={{
                width: width < 360 ? 172 : 198,
                height: width < 360 ? 172 : 198,
              }}
            />
          </Animated.View>
          <Txt
            accessibilityRole="header"
            size={width < 360 ? 29 : 33}
            weight="heavy"
            color="#FFFFFF"
            style={{
              textAlign: "center",
              marginTop: 5,
              textShadowColor: "rgba(0,0,0,.32)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 3,
            }}
          >
            {outcome.title}
          </Txt>
          <Txt
            size={13}
            color="#E8F8EF"
            style={{ textAlign: "center", maxWidth: 350, marginTop: 5 }}
          >
            {outcome.message}
          </Txt>
        </View>
        <View style={{ gap: 10 }}>
          <View
            style={[
              styles.panel,
              { backgroundColor: panel, borderColor: `${outcome.accent}66` },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 6,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Txt size={14} color={ink} weight="heavy">
                Skorun{" "}
                <Txt size={24} weight="heavy" color={ink}>
                  {score.toLocaleString("tr-TR")}
                </Txt>
              </Txt>
              <Txt size={12} color={muted} weight="bold">
                {correct}/{total} doğru · {xp} XP
              </Txt>
            </View>
            {isRecord && (
              <Txt
                size={11}
                weight="heavy"
                color={outcome.accent}
                style={{ marginBottom: 10 }}
              >
                Yeni kişisel rekor!
              </Txt>
            )}
            <View
              style={{
                flexDirection: fontScale > 1.35 ? "column" : "row",
                gap: fontScale > 1.35 ? 10 : 0,
              }}
            >
              {[
                {
                  name: "check" as const,
                  value: String(correct),
                  label: "Doğru",
                  colors: ["#26F0AB", "#009871"] as const,
                },
                {
                  name: "x" as const,
                  value: String(wrong),
                  label: "Yanlış",
                  colors: ["#FF8C68", "#EF4558"] as const,
                },
                ...(unanswered
                  ? [
                      {
                        name: "minus" as const,
                        value: String(unanswered),
                        label: "Cevapsız",
                        colors: ["#FFD56B", "#C4831B"] as const,
                      },
                    ]
                  : []),
                {
                  name: "clock" as const,
                  value: seconds,
                  label: "Süre",
                  colors: ["#68BEFF", "#176DE4"] as const,
                },
              ].map((item, i) => (
                <View
                  key={item.label}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    alignItems: "center",
                    borderLeftWidth: i && fontScale <= 1.35 ? 1 : 0,
                    borderColor: theme.dark ? "#FFFFFF19" : "#0C4F4520",
                    gap: 3,
                    flexDirection: fontScale > 1.35 ? "row" : "column",
                    justifyContent:
                      fontScale > 1.35 ? "space-between" : undefined,
                  }}
                >
                  <LinearGradient colors={item.colors} style={styles.statIcon}>
                    <Icon name={item.name} color="#FFFFFF" size={18} />
                  </LinearGradient>
                  <Txt size={18} weight="heavy" color={ink}>
                    {item.value}
                  </Txt>
                  <Txt size={11} color={muted}>
                    {item.label}
                  </Txt>
                </View>
              ))}
            </View>
          </View>
          <View
            style={[
              styles.panel,
              { backgroundColor: panel, borderColor: `${outcome.accent}55` },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 6,
                marginBottom: 9,
              }}
            >
              <Txt size={13} weight="bold" color={ink}>
                Başarı Oranı
              </Txt>
              <Txt size={19} weight="heavy" color={ink}>
                %{outcome.percent.toLocaleString("tr-TR")}
              </Txt>
            </View>
            <View
              testID="result-success-meter"
              accessibilityRole="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={outcome.percent}
              accessibilityLabel="Başarı oranı"
              accessibilityValue={{ min: 0, max: 100, now: outcome.percent }}
              style={{
                height: 12,
                borderRadius: 12,
                backgroundColor: theme.dark ? "#FFFFFF16" : "#0A50431C",
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  width: `${outcome.fraction * 100}%`,
                  height: "100%",
                  transformOrigin: "left center",
                  transform: [{ scaleX: fill }],
                }}
              >
                <LinearGradient
                  colors={[outcome.accent, outcome.fill]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: "100%", borderRadius: 12 }}
                />
              </Animated.View>
            </View>
          </View>
          <View
            style={[
              styles.panel,
              {
                backgroundColor: theme.dark ? "#0E4549" : "#075A55",
                borderColor: `${outcome.accent}65`,
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
              },
            ]}
          >
            <LinearGradient
              colors={[outcome.accent, outcome.fill]}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="sun" color="#173D42" size={21} />
            </LinearGradient>
            <Txt size={12} color="#ECFFF7" style={{ flex: 1 }}>
              {outcome.advice}
            </Txt>
          </View>
          {children}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderRadius: 23,
    padding: 14,
    boxShadow: "0px 8px 20px rgba(0,12,21,.15)",
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF66",
  },
});
