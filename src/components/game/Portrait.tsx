import React, { useId } from "react";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

// Original vector artwork, authored for Anla & Ezberle. Both portrait groups
// share the same slender proportions and simple, warm drawing style.
const styles = [
  {
    skin: "#E5AC7D",
    shade: "#BD7E59",
    fabric: "#087C7B",
    light: "#38CFC3",
    outfit: "#143F59",
    hair: "#30252B",
    back: "#B6EEE0",
    covered: true,
    cut: 0,
  },
  {
    skin: "#83533E",
    shade: "#603D32",
    fabric: "#B83967",
    light: "#F092A9",
    outfit: "#086B65",
    hair: "#28212C",
    back: "#FFE1CF",
    covered: true,
    cut: 1,
  },
  {
    skin: "#F2CDB2",
    shade: "#CD9576",
    fabric: "#245DAD",
    light: "#80C8FA",
    outfit: "#734A74",
    hair: "#46303A",
    back: "#CFEAF7",
    covered: true,
    cut: 2,
  },
  {
    skin: "#BB805B",
    shade: "#91583F",
    fabric: "#BA7425",
    light: "#FFD271",
    outfit: "#18585D",
    hair: "#332C31",
    back: "#FFEDBC",
    covered: true,
    cut: 3,
  },
  {
    skin: "#F2CDB2",
    shade: "#CD9576",
    fabric: "#087C7B",
    light: "#38CFC3",
    outfit: "#087C7B",
    hair: "#61402E",
    back: "#B6EEE0",
    covered: false,
    cut: 0,
  },
  {
    skin: "#83533E",
    shade: "#603D32",
    fabric: "#B83967",
    light: "#F092A9",
    outfit: "#B83967",
    hair: "#292334",
    back: "#FFE1CF",
    covered: false,
    cut: 1,
  },
  {
    skin: "#E5AC7D",
    shade: "#BD7E59",
    fabric: "#245DAD",
    light: "#80C8FA",
    outfit: "#245DAD",
    hair: "#AE542F",
    back: "#CFEAF7",
    covered: false,
    cut: 2,
  },
  {
    skin: "#BB805B",
    shade: "#91583F",
    fabric: "#BA7425",
    light: "#FFD271",
    outfit: "#665083",
    hair: "#262B3D",
    back: "#FFEDBC",
    covered: false,
    cut: 3,
  },
] as const;

export function Portrait({ id, size }: { id: number; size: number }) {
  const v = styles[id - 4] ?? styles[0];
  const uid = useId().replace(/:/g, "") + "portrait";
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
      accessible={false}
    >
      <Defs>
        <LinearGradient id={uid + "bg"} x1="0" y1="0" x2="1" y2="1">
          <Stop stopColor={v.back} />
          <Stop offset="1" stopColor="#FFFFFF" />
        </LinearGradient>
      </Defs>
      <Circle
        cx="50"
        cy="50"
        r="48"
        fill={`url(#${uid}bg)`}
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <G transform="translate(5 0) scale(.9 1)">
        <Path
          d="M22 88Q27 70 42 69H58Q73 70 78 88Q50 101 22 88Z"
          fill={v.outfit}
        />
        {!v.covered && (
          <>
            <Path
              d={
                v.cut === 2
                  ? "M24 63V35Q24 12 50 13Q76 14 76 36V63Q64 75 24 63Z"
                  : "M21 73Q15 27 32 18Q48 5 69 20Q84 32 78 74Z"
              }
              fill={v.hair}
            />
            {v.cut === 1 && (
              <G fill={v.hair}>
                {[
                  [27, 25],
                  [19, 36],
                  [21, 51],
                  [25, 66],
                  [72, 27],
                  [80, 39],
                  [80, 55],
                  [74, 70],
                ].map(([x, y], i) => (
                  <Circle key={i} cx={x} cy={y} r="8" />
                ))}
              </G>
            )}
            <Rect x="42" y="61" width="16" height="16" rx="6" fill={v.shade} />
          </>
        )}
        {v.covered && (
          <>
            <Path
              d="M20 78Q15 55 22 32Q26 12 50 12Q74 12 79 34Q85 58 80 79L62 88L36 87Z"
              fill={v.fabric}
            />
          </>
        )}
        <Ellipse cx="50" cy="44" rx="22" ry="28" fill={v.skin} />
        <Ellipse cx="34" cy="52" rx="4" ry="2.5" fill="#E77475" opacity=".2" />
        <Ellipse cx="66" cy="52" rx="4" ry="2.5" fill="#E77475" opacity=".2" />
        <Path
          d="M35 37Q39 34 43 37M57 37Q61 34 65 37"
          stroke={v.hair}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <G fill="#23323B">
          <Ellipse cx="39" cy="44" rx="2.4" ry={v.cut === 1 ? 2.1 : 3} />
          <Ellipse cx="61" cy="44" rx="2.4" ry={v.cut === 1 ? 2.1 : 3} />
        </G>
        <Path
          d={v.cut === 2 ? "M45 57Q50 60 55 56" : "M43 56Q50 63 57 56"}
          fill="none"
          stroke={v.skin === "#83533E" ? "#38232D" : "#94444B"}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {v.covered ? (
          <>
            <Path
              d="M25 40Q24 16 50 16Q76 16 75 40Q67 28 51 25Q37 27 25 40Z"
              fill={v.fabric}
            />
            <Path
              d="M26 41Q34 29 51 25Q64 27 74 40"
              stroke={v.light}
              strokeWidth="1.6"
              fill="none"
              opacity=".5"
            />
            <Path
              d="M24 53Q30 72 51 76Q70 71 77 54L72 81L54 91L28 81Z"
              fill={v.fabric}
            />
            <Path
              d="M32 71Q48 81 68 73"
              stroke={v.light}
              strokeWidth="1.3"
              fill="none"
              opacity=".4"
            />
          </>
        ) : (
          <>
            <Path
              d={
                v.cut === 2
                  ? "M25 40Q24 14 50 16Q77 14 75 44L65 30Q51 34 39 26Q35 37 25 40Z"
                  : v.cut === 3
                    ? "M25 40Q19 14 48 14Q77 13 75 40Q59 37 50 25Q41 35 25 40Z"
                    : "M25 39Q22 16 46 15Q70 10 76 38Q59 34 54 25Q42 32 25 39Z"
              }
              fill={v.hair}
            />
            {v.cut === 3 && (
              <Path
                d="M22 45Q18 54 25 64M77 46Q82 56 74 65"
                stroke={v.hair}
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </>
        )}
      </G>
    </Svg>
  );
}
