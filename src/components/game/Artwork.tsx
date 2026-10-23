import React, { useId } from "react";
import { Image, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { CategoryId } from "../../content/questions";
import { colors as c } from "../../theme/tokens";
import { isAvatarId } from "../../domain/profile/avatars";
import { Portrait } from "./Portrait";

export function Pattern({
  color = c.gold,
  opacity = 0.16,
}: {
  color?: string;
  opacity?: number;
}) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden={true}
    >
      <G opacity={opacity} stroke={color} strokeWidth="0.8" fill="none">
        {Array.from({ length: 36 }, (_, i) => (
          <G
            key={i}
            transform={`translate(${(i % 6) * 80} ${Math.floor(i / 6) * 80})`}
          >
            <Rect x="-26" y="-26" width="52" height="52" rx="2" />
            <Rect
              x="-26"
              y="-26"
              width="52"
              height="52"
              rx="2"
              transform="rotate(45)"
            />
            <Circle r="7" />
            <Line x1="35" y1="0" x2="45" y2="0" />
            <Line x1="0" y1="35" x2="0" y2="45" />
          </G>
        ))}
      </G>
    </Svg>
  );
}
function Building({
  x,
  y,
  scale = 1,
  shade = c.sand,
  domeFill = "url(#dome)",
}: {
  x: number;
  y: number;
  scale?: number;
  shade?: string;
  domeFill?: string;
}) {
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <Rect x="-38" y="0" width="76" height="100" rx="4" fill={shade} />
      <Path d="M-43 1 Q-43 -24 0 -53 Q43 -24 43 1Z" fill={domeFill} />
      <Path
        d="M-33 -1 Q-32 -20 0 -43 M-13 0 Q-14 -25 0 -43 M15 0 Q14 -25 0 -43 M33 0 Q32 -20 0 -43"
        stroke={c.tealLight}
        strokeWidth="1.3"
        opacity="0.5"
        fill="none"
      />
      <Rect x="-42" y="0" width="84" height="7" rx="2" fill={c.gold} />
      <Line x1="0" y1="-52" x2="0" y2="-65" stroke={c.gold} strokeWidth="2" />
      <Circle cx="0" cy="-68" r="3" fill={c.gold} />
      {[-24, 0, 24].map((a) => (
        <Path
          key={a}
          d={`M${a - 6} 36 V23 Q${a} 11 ${a + 6} 23 V36Z`}
          fill={c.teal}
          opacity="0.75"
        />
      ))}
      <Path d="M-14 100 V67 Q0 46 14 67 V100Z" fill={c.deepTeal} />
      <Path
        d="M-21 100 V64 Q0 35 21 64 V100"
        stroke={c.cream}
        strokeWidth="3"
        fill="none"
      />
      <Path
        d="M-36 44 H36 M-36 49 H36"
        stroke={c.bronze}
        strokeWidth="1"
        opacity="0.6"
      />
    </G>
  );
}
/** Original optimized scenery; UI remains fully native and accessible. */
export function Scene({ variant = "hero" }: { variant?: "hero" | "result" }) {
  return (
    <View
      pointerEvents="none"
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: c.teal,
      }}
    >
      <Image
        source={require("../../../assets/images/reference-ui/mosque-garden.webp")}
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
      />
      {variant === "result" && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(3,31,57,0.65)",
          }}
        />
      )}
    </View>
  );
}
export function Book({ size = 78 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" aria-hidden={true}>
      <Ellipse cx="50" cy="88" rx="38" ry="6" fill={c.navy} opacity="0.18" />
      <Path
        d="M17 83 L50 66 L83 83 M22 63 L78 91 M78 63 L22 91"
        stroke={c.deepTeal}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <Path
        d="M9 27 Q31 21 50 35 Q69 21 91 27 L87 73 Q66 67 50 82 Q34 67 13 73Z"
        fill={c.emerald}
        stroke={c.gold}
        strokeWidth="1.5"
      />
      <Path
        d="M14 22 Q33 20 50 33 Q67 20 86 22 L82 65 Q65 63 50 77 Q35 63 18 65Z"
        fill={c.cream}
      />
      <Path
        d="M50 33 V77 M22 25 L25 60 Q37 60 46 68 M78 25 L75 60 Q63 60 54 68"
        stroke={c.bronze}
        strokeWidth="1.5"
        fill="none"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <G key={i} stroke={c.bronze} strokeWidth="1" opacity="0.5">
          <Path d={`M28 ${33 + i * 5} Q36 ${33 + i * 5} 43 ${39 + i * 5}`} />
          <Path d={`M72 ${33 + i * 5} Q64 ${33 + i * 5} 57 ${39 + i * 5}`} />
        </G>
      ))}
    </Svg>
  );
}
export function Architecture({ size = 80 }: { size?: number }) {
  const dome = useId().replace(/:/g, "") + "-dome";
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" aria-hidden={true}>
      <Defs>
        <LinearGradient id={dome} x1="0" y1="0" x2="1" y2="1">
          <Stop stopColor={c.sky} />
          <Stop offset="1" stopColor={c.teal} />
        </LinearGradient>
      </Defs>
      <Ellipse cx="50" cy="92" rx="44" ry="4" fill={c.navy} opacity="0.12" />
      <G transform="translate(50 53) scale(.65)">
        <Building
          domeFill={`url(#${dome})`}
          x={0}
          y={0}
          shade={c.creamBorder}
        />
      </G>
      {[15, 85].map((x) => (
        <G key={x}>
          <Rect x={x - 4} y="35" width="8" height="55" fill={c.sand} />
          <Path
            d={`M${x - 6} 35 Q${x - 6} 25 ${x} 20 Q${x + 6} 25 ${x + 6} 35Z`}
            fill={c.turquoise}
          />
          <Rect x={x - 6} y="49" width="12" height="3" fill={c.gold} />
        </G>
      ))}
      <Line x1="50" y1="19" x2="50" y2="10" stroke={c.gold} strokeWidth="2" />
      <Circle cx="50" cy="8" r="2" fill={c.gold} />
    </Svg>
  );
}
export function Bulb({ size = 78 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" aria-hidden={true}>
      <Defs>
        <LinearGradient id="bulb" x1="0" y1="0" x2="1" y2="1">
          <Stop stopColor={c.paleGold} />
          <Stop offset="0.55" stopColor={c.gold} />
          <Stop offset="1" stopColor={c.orange} />
        </LinearGradient>
      </Defs>
      <G stroke={c.paleGold} strokeWidth="2.5" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <Line
            key={a}
            x1="50"
            y1="5"
            x2="50"
            y2="12"
            transform={`rotate(${a} 50 41)`}
          />
        ))}
      </G>
      <Path
        d="M35 67 C35 57 24 54 24 39 C24 6 76 6 76 39 C76 54 65 57 65 67Z"
        fill="url(#bulb)"
        stroke={c.paleGold}
        strokeWidth="2"
      />
      <Path
        d="M44 66 L40 43 L50 49 L60 43 L56 66"
        stroke={c.bronze}
        strokeWidth="2"
        fill="none"
      />
      <Rect x="35" y="67" width="30" height="17" rx="5" fill={c.creamBorder} />
      <Path d="M36 72 H64 M36 78 H64" stroke={c.bronze} strokeWidth="2" />
      <Path d="M42 85 Q50 97 58 85" fill={c.bronze} />
      <Path
        d="M33 36 Q33 23 44 22"
        stroke={c.white}
        strokeWidth="4"
        opacity="0.6"
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}
export function CategoryArt({
  category,
  size = 78,
}: {
  category: CategoryId;
  size?: number;
}) {
  return category === "quran" ? (
    <Book size={size} />
  ) : category === "general" ? (
    <Bulb size={size} />
  ) : (
    <Architecture size={size} />
  );
}
export function Medal({ size = 230 }: { size?: number }) {
  return (
    <Image
      accessible={false}
      aria-hidden
      source={require("../../../assets/images/reference-ui/gold-medal.webp")}
      resizeMode="contain"
      style={{ width: size, height: size }}
    />
  );
}
export function Avatar({
  variant = 0,
  size = 48,
}: {
  variant?: number;
  size?: number;
}) {
  if (!isAvatarId(variant)) variant = 0;
  if (variant >= 4) return <Portrait id={variant} size={size} />;
  const backgrounds = [c.mint, c.paleGold, c.sky, c.dangerBg];
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" aria-hidden={true}>
      <Circle
        cx="32"
        cy="32"
        r="30"
        fill={backgrounds[variant]}
        stroke={c.white}
        strokeWidth="2"
      />
      <Path
        d="M10 60 Q13 40 32 40 Q51 40 54 60"
        fill={[c.teal, c.deepBlue, c.deepCoral, c.emerald][variant]}
      />
      <Circle cx="32" cy="29" r="17" fill={c.sand} />
      <Path
        d="M15 26 Q11 10 31 9 Q48 8 49 27 Q37 23 35 17 Q28 26 15 26Z"
        fill={c.navy}
      />
      <Circle cx="26" cy="30" r="1.8" fill={c.navy} />
      <Circle cx="38" cy="30" r="1.8" fill={c.navy} />
      <Path
        d="M27 37 Q32 42 37 37"
        stroke={c.deepOrange}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <Circle cx="21" cy="35" r="2.5" fill={c.coral} opacity="0.3" />
      <Circle cx="43" cy="35" r="2.5" fill={c.coral} opacity="0.3" />
    </Svg>
  );
}

export function CardCorners() {
  return (
    <View
      pointerEvents="none"
      aria-hidden
      style={{ position: "absolute", inset: 0 }}
    >
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            position: "absolute",
            width: 36,
            height: 36,
            ...(i < 2 ? { top: 8 } : { bottom: 8 }),
            ...(i % 2 === 0 ? { left: 8 } : { right: 8 }),
            transform: [{ rotate: `${[0, 90, 270, 180][i]}deg` }],
          }}
        >
          <Svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
            <G fill="none" stroke={c.bronze} strokeWidth=".8" opacity=".5">
              <Path d="M2 34V14Q2 2 14 2H34M8 28V15Q8 8 15 8H28M2 20L20 2M5 14L14 5L23 14L14 23Z" />
              <Circle cx="14" cy="14" r="3" />
            </G>
          </Svg>
        </View>
      ))}
    </View>
  );
}
export function Cup({ size = 50 }: { size?: number }) {
  const id = useId().replace(/:/g, "") + "-cup";
  return (
    <Svg width={size} height={size} viewBox="0 0 80 86" aria-hidden>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop stopColor={c.paleGold} />
          <Stop offset=".4" stopColor={c.gold} />
          <Stop offset="1" stopColor={c.orange} />
        </LinearGradient>
      </Defs>
      <Ellipse
        cx="40"
        cy="80"
        rx="26"
        ry="4"
        fill={c.deepOrange}
        opacity=".25"
      />
      <Path
        d="M20 16H6V27Q6 44 27 44M60 16H74V27Q74 44 53 44"
        fill="none"
        stroke={c.gold}
        strokeWidth="6"
      />
      <Path
        d="M18 10H62L58 38Q54 56 40 56Q26 56 22 38Z"
        fill={`url(#${id})`}
        stroke={c.paleGold}
        strokeWidth="2"
      />
      <Path
        d="M40 28L43 34L50 35L45 40L46 47L40 44L34 47L35 40L30 35L37 34Z"
        fill={c.bronze}
      />
      <Path d="M35 55H45V69H35Z" fill={c.gold} />
      <Rect x="22" y="69" width="36" height="10" rx="4" fill={`url(#${id})`} />
      <Path
        d="M27 18L30 35"
        stroke={c.white}
        strokeWidth="3"
        strokeLinecap="round"
        opacity=".6"
      />
    </Svg>
  );
}
