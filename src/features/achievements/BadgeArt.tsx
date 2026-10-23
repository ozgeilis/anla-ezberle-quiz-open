import React, { useId } from "react";
import { Image, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Polygon,
  Path,
  G,
  Ellipse,
} from "react-native-svg";
import { Icon, Txt } from "../../components/ui";
import { BadgeDefinition } from "../../domain/achievements/catalog";
import { badgeMetals } from "../../theme/collection";

/** All effects are static vectors: Reduce Motion never needs an exception. */
export function BadgeArt({
  badge,
  size = 112,
  earned = false,
}: {
  badge: BadgeDefinition;
  size?: number;
  earned?: boolean;
}) {
  const uid = `medal${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const tier = badge.tier ?? (badge.group === "general" ? "gold" : "silver");
  const metal = earned
    ? badgeMetals[tier]
    : {
        ...badgeMetals.silver,
        light: "#F4F2EB",
        rim: "#C7C8C5",
        base: "#A7AEAD",
        shade: "#6E7D80",
        face: "#8F9D9D",
        ink: "#F9F9F2",
      };
  if (earned && badge.subject === "quran")
    return (
      <Image
        accessible={false}
        aria-hidden
        source={require("../../../assets/images/reference-ui/book-gem.webp")}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  return (
    <View
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      aria-hidden
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox="0 0 140 140">
        <Defs>
          <LinearGradient id={`${uid}rim`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={metal.light} />
            <Stop offset="0.24" stopColor={metal.rim} />
            <Stop offset="0.5" stopColor={metal.base} />
            <Stop offset="0.72" stopColor={metal.light} />
            <Stop offset="1" stopColor={metal.shade} />
          </LinearGradient>
          <LinearGradient id={`${uid}face`} x1="0" y1="0" x2="0.9" y2="1">
            <Stop offset="0" stopColor={metal.base} />
            <Stop offset="1" stopColor={metal.face} />
          </LinearGradient>
          <RadialGradient id={`${uid}glow`}>
            <Stop
              offset="0"
              stopColor={metal.rim}
              stopOpacity={earned ? 0.48 : 0.22}
            />
            <Stop offset="1" stopColor={metal.rim} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Circle cx="70" cy="64" r="67" fill={`url(#${uid}glow)`} />
        <Ellipse cx="70" cy="124" rx="31" ry="6" fill="#001F29" opacity="0.2" />
        <Path
          d="M42 88 L31 129 L50 120 L63 133 L72 95 L82 133 L93 120 L112 128 L98 85Z"
          fill={metal.shade}
        />
        <Path
          d="M45 90 L38 121 L51 113 L60 125 L68 94 M75 94 L83 125 L92 113 L104 121 L95 90"
          fill={metal.base}
          stroke={metal.rim}
          strokeWidth="1.2"
        />
        <G fill="none" stroke={metal.rim} strokeWidth="1.5" opacity="0.7">
          <Path d="M26 96 Q9 72 24 43 M114 96 Q131 72 116 43" />
          {[0, 1, 2, 3].map((i) => (
            <G key={i}>
              <Ellipse
                cx={18 - (i % 2) * 2}
                cy={53 + i * 10}
                rx="3"
                ry="6"
                transform={`rotate(-32 ${18 - (i % 2) * 2} ${53 + i * 10})`}
                fill={metal.base}
              />
              <Ellipse
                cx={122 + (i % 2) * 2}
                cy={53 + i * 10}
                rx="3"
                ry="6"
                transform={`rotate(32 ${122 + (i % 2) * 2} ${53 + i * 10})`}
                fill={metal.base}
              />
            </G>
          ))}
        </G>
        {tier === "diamond" ? (
          <Polygon
            points="70,12 105,26 121,63 105,98 70,112 35,98 19,63 35,26"
            fill={`url(#${uid}rim)`}
            stroke={metal.light}
            strokeWidth="1.5"
          />
        ) : (
          <Circle
            cx="70"
            cy="63"
            r="48"
            fill={`url(#${uid}rim)`}
            stroke={metal.light}
            strokeWidth="1.5"
          />
        )}
        <Circle
          cx="70"
          cy="63"
          r="41"
          fill={`url(#${uid}face)`}
          stroke={metal.light}
          strokeWidth="2"
        />
        <Circle
          cx="70"
          cy="63"
          r="36.5"
          fill="none"
          stroke={metal.light}
          strokeOpacity="0.4"
          strokeWidth="0.7"
          strokeDasharray="1 4"
        />
        <Path
          d="M33 49 Q45 18 80 24 M39 89 Q67 112 100 82"
          stroke={metal.light}
          strokeWidth="2.7"
          strokeLinecap="round"
          opacity="0.65"
          fill="none"
        />
        <Path
          d="M37 43 Q59 21 91 34 L43 81 Q31 62 37 43"
          fill={metal.light}
          opacity="0.13"
        />
        {[
          { x: 11, y: 32, s: 5 },
          { x: 126, y: 40, s: 6 },
          { x: 121, y: 104, s: 4 },
          { x: 29, y: 15, s: 3 },
          { x: 71, y: 7, s: 4 },
        ].map(({ x, y, s }, i) => (
          <Path
            key={i}
            d={`M${x} ${y - s} l${s / 3} ${s * 0.7} ${s * 0.7} ${s / 3} -${s * 0.7} ${s / 3} -${s / 3} ${s * 0.7} -${s / 3} -${s * 0.7} -${s * 0.7} -${s / 3} ${s * 0.7} -${s / 3}Z`}
            fill={metal.light}
            opacity={earned ? 1 : 0.8}
          />
        ))}
      </Svg>
      <View
        style={{
          position: "absolute",
          top: size * 0.29,
          left: 0,
          right: 0,
          alignItems: "center",
          gap: 0,
        }}
      >
        <Icon
          name={earned ? badge.icon : "lock"}
          size={size * 0.27}
          color={metal.ink}
        />
        {!!badge.tier && (
          <Txt
            size={Math.max(8, size * 0.075)}
            weight="heavy"
            color={metal.ink}
          >
            {{ bronze: "I", silver: "II", gold: "III", diamond: "IV" }[tier]}
          </Txt>
        )}
      </View>
    </View>
  );
}
