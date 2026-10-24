import React, { useId } from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  G,
  Circle,
  Text as SvgText,
} from "react-native-svg";
import { Txt } from "../ui";
import { colors as c, fonts, homePalette } from "../../theme/tokens";
import { brand } from "../../branding/identity";

const arch =
  "M180 5 C169 23 124 25 114 51 C94 40 62 48 58 71 C35 65 17 82 20 104 C6 110 5 126 10 140 L10 285 Q10 309 34 309 H326 Q350 309 350 285 V140 C355 126 354 110 340 104 C343 82 325 65 302 71 C298 48 266 40 246 51 C236 25 191 23 180 5 Z";

/** Native content over a local SVG ornament; the existing city stays visible around it. */
export function HomeTitlePlaque() {
  const id = `home-arch-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360;
  const palette = homePalette(false);
  return (
    <View
      testID="home-title-plaque"
      style={{
        width: "100%",
        maxWidth: 340,
        alignSelf: "center",
        marginTop: -6,
        marginBottom: 10,
        paddingHorizontal: 16,
        paddingTop: 58,
        paddingBottom: 13,
        alignItems: "center",
        minHeight: 238,
      }}
    >
      <View
        pointerEvents="none"
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        aria-hidden
        style={{ position: "absolute", inset: 0 }}
      >
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 360 316"
          preserveAspectRatio="none"
          aria-hidden
        >
          <Defs>
            <LinearGradient id={`${id}-panel`} x1="0" y1="0" x2="0.8" y2="1">
              <Stop stopColor={palette.plaqueLight} />
              <Stop offset="0.58" stopColor={palette.plaque} />
              <Stop offset="1" stopColor={palette.plaqueDeep} />
            </LinearGradient>
            <LinearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
              <Stop stopColor={palette.goldLight} />
              <Stop offset="0.55" stopColor={palette.gold} />
              <Stop offset="1" stopColor="#B97C24" />
            </LinearGradient>
          </Defs>
          <Path
            d={arch}
            fill="#002C34"
            opacity="0.45"
            transform="translate(0 5)"
          />
          <Path
            d={arch}
            fill={`url(#${id}-panel)`}
            stroke={`url(#${id}-rim)`}
            strokeWidth="2.6"
          />
          <Path
            d={arch}
            fill="none"
            stroke={palette.goldLight}
            strokeWidth="0.7"
            opacity="0.55"
            transform="translate(5 5) scale(.972)"
          />
          <G fill="#00373F" opacity="0.92">
            <Path d="M40 132V111Q49 99 58 111V132H66V89Q66 80 80 70Q94 80 94 89V132H104V106Q114 90 124 106V132H137V82Q137 65 158 52Q179 65 179 82V132H193V104Q204 88 215 104V132H226V91Q226 79 242 68Q258 79 258 91V132H270V111Q280 96 290 111V132Z" />
            {[102, 132, 213, 265].map((x, i) => (
              <G key={x}>
                <Path
                  d={`M${x} 119V${i % 2 ? 63 : 72}h7v${i % 2 ? 56 : 47}Z M${x - 1} ${i % 2 ? 63 : 72}q-2-9 4-15q7 6 4 15Z`}
                />
                <Path
                  d={`M${x + 3} ${i % 2 ? 48 : 57}v-8`}
                  stroke="#00373F"
                  strokeWidth="1.6"
                />
              </G>
            ))}
          </G>
          <Path
            d="M184 28 A13 13 0 1 0 197 43 A10 10 0 0 1 184 28Z"
            fill={palette.goldLight}
          />
          <G fill={palette.goldLight} opacity="0.85">
            <Path d="M48 100l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z M310 99l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z M73 252l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z M294 253l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
            <Circle cx="213" cy="42" r="1.3" />
            <Circle cx="142" cy="41" r="1" />
          </G>
          <G fill="none" stroke={palette.gold} strokeWidth="1" opacity="0.6">
            <Path d="M28 172v32m-5-29h10m-12 7q7-12 14 0v19q-7 9-14 0Z M332 172v32m-5-29h10m-12 7q7-12 14 0v19q-7 9-14 0Z" />
          </G>
        </Svg>
      </View>
      <Txt
        accessibilityRole="header"
        weight="heavy"
        size={compact ? 32 : 36}
        color={c.white}
        style={{
          textAlign: "center",
          lineHeight: compact ? 40 : 44,
          textShadowColor: "#002F37",
          textShadowOffset: { width: 0, height: 3 },
          textShadowRadius: 1,
        }}
      >
        Anla &
      </Txt>
      {fontScale > 1.2 ? (
        <Txt
          weight="heavy"
          size={compact ? 42 : 48}
          color={palette.goldLight}
          style={{ textAlign: "center" }}
        >
          Ezberle
        </Txt>
      ) : (
        <View
          accessible
          accessibilityRole="header"
          accessibilityLabel="Ezberle"
          style={{ width: "100%", height: compact ? 54 : 60 }}
        >
          <Svg
            width="100%"
            height="100%"
            viewBox="0 0 400 104"
            aria-hidden
            accessible={false}
          >
            <Defs>
              <LinearGradient id={`${id}-letters`} x1="0" y1="0" x2="0" y2="1">
                <Stop stopColor="#FFF2A8" />
                <Stop offset="0.42" stopColor="#FFCF40" />
                <Stop offset="1" stopColor="#FF8E19" />
              </LinearGradient>
            </Defs>
            <SvgText
              x="200"
              y="81"
              textAnchor="middle"
              fontFamily={fonts.heavy}
              fontWeight="800"
              fontSize="79"
              letterSpacing="-3"
              fill="#AD4B00"
              stroke="#AD4B00"
              strokeWidth="2.5"
            >
              Ezberle
            </SvgText>
            <SvgText
              x="200"
              y="77"
              textAnchor="middle"
              fontFamily={fonts.heavy}
              fontWeight="800"
              fontSize="79"
              letterSpacing="-3"
              fill={`url(#${id}-letters)`}
              stroke="#FFE39B"
              strokeWidth="0.7"
            >
              Ezberle
            </SvgText>
          </Svg>
        </View>
      )}
      <Txt
        size={compact ? 13 : 15}
        weight="heavy"
        color={c.white}
        style={{
          textAlign: "center",
          textShadowColor: "#002D34",
          textShadowOffset: { width: 0, height: 2 },
          textShadowRadius: 1,
        }}
      >
        İslami Bilgi Oyunu
      </Txt>
      <View
        style={{
          borderRadius: 22,
          borderWidth: 1,
          borderColor: "#2E9D98",
          backgroundColor: palette.plaqueDeep,
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginTop: 9,
          maxWidth: "100%",
        }}
      >
        <Txt
          size={compact ? 11 : 12}
          weight="bold"
          color={c.white}
          style={{ textAlign: "center" }}
        >
          {brand.slogan}
        </Txt>
      </View>
    </View>
  );
}
