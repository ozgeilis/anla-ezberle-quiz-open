export const colors = {
  teal: "#0B6863",
  emerald: "#0B6863",
  turquoise: "#14B8A6",
  gold: "#F5C451",
  orange: "#FF861C",
  blue: "#1683E8",
  coral: "#FF6471",
  cream: "#FFF9F0",
  navy: "#092F46",
  ink: "#17343A",
  white: "#FFFFFF",
  muted: "#64748B",
  creamBorder: "#EEDDC8",
  paleGold: "#FFE8B3",
  darkGold: "#8A4C00",
  deepOrange: "#BC4A00",
  deepBlue: "#0656AB",
  deepCoral: "#BA263D",
  tealLight: "#B7EAE0",
  mint: "#DDF4E6",
  successInk: "#006342",
  danger: "#B5253B",
  dangerBg: "#FFE6E8",
  canvas: "#EAEFEA",
  nightSurface: "#123C4B",
  nightCard: "#194A56",
  nightText: "#F6F1E6",
  nightMuted: "#B8D0D1",
  sky: "#81DCD7",
  sand: "#F8D098",
  bronze: "#CF8521",
  leaf: "#247D63",
  deepTeal: "#00484E",
  softCoral: "#FFA089",
  warmWhite: "#FFFDF8",
  softMint: "#E6F5F0",
  softRose: "#FDECEE",
  softViolet: "#F0ECFA",
  mustard: "#E5A51D",
  dailyRed: "#BD304A",
  dailyOrange: "#B64B30",
} as const;

/** Semantic surfaces keep text readable in either saved/system theme. */
export function themePalette(dark: boolean) {
  return {
    dark,
    background: dark ? "#0E262A" : colors.cream,
    card: dark ? "#173A3C" : colors.warmWhite,
    text: dark ? colors.nightText : "#17343A",
    muted: dark ? colors.nightMuted : "#586A7D",
    border: dark ? "#385B62" : colors.creamBorder,
    panel: dark ? "#16373D" : "#FFF5E3",
    goldSurface: dark ? "#443A24" : "#FFF0C8",
    goldInk: dark ? "#FFD373" : "#805000",
    goldBorder: dark ? "#D8AB48" : "#E3AE37",
    accent: dark ? colors.tealLight : colors.teal,
    mintSurface: dark ? "#183F3D" : colors.softMint,
    roseSurface: dark ? "#432F3B" : colors.softRose,
    violetSurface: dark ? "#33364E" : colors.softViolet,
    success: dark ? colors.tealLight : colors.successInk,
    danger: dark ? "#FFA5AC" : colors.danger,
    pattern: dark ? colors.tealLight : colors.teal,
  };
}

/** Scoped home accents: preserve semantic theme contrast without tinting other screens. */
export function homePalette(dark: boolean) {
  return {
    plaqueLight: "#087E7B",
    plaque: "#005D61",
    plaqueDeep: "#004B50",
    gold: "#F4BD51",
    goldLight: "#FFE39B",
    score: dark
      ? (["#174A59", "#123B49"] as const)
      : (["#EAF8FF", "#D9F2FF"] as const),
    scoreBorder: dark ? "#3987A4" : "#87D2EF",
    scoreInk: dark ? "#D9F5FF" : "#164655",
    scoreIcon: dark ? "#74E0DB" : "#007B80",
    badges: dark
      ? (["#4B3C23", "#392F20"] as const)
      : (["#FFF3D5", "#FFE6A7"] as const),
    badgeBorder: dark ? "#B98936" : "#F5BD55",
    badgeInk: dark ? "#FFE7B0" : "#604011",
    badgeIcon: dark ? "#FFCE6C" : "#A85C00",
    nav: dark ? "#203E40" : "#FFF0D6",
  };
}
export function difficultyPalette(
  tone: "easy" | "medium" | "hard",
  dark: boolean,
) {
  const tones = {
    easy: {
      gradient: dark
        ? (["#594516", "#3D3218"] as const)
        : (["#FFF8DD", "#FFE9A4"] as const),
      edge: dark ? "#E0AE48" : "#E9A125",
      ink: dark ? "#FFE7A5" : "#694000",
      icon: dark ? "#FFCB54" : "#AD5D00",
    },
    medium: {
      gradient: dark
        ? (["#14514E", "#133C40"] as const)
        : (["#E0FBF4", "#A9EEE8"] as const),
      edge: dark ? "#46C3BA" : "#16A8A5",
      ink: dark ? "#D2FFF5" : "#004E56",
      icon: dark ? "#6FF1DB" : "#006C72",
    },
    hard: {
      gradient: dark
        ? (["#5C3431", "#432C2C"] as const)
        : (["#FFF0E1", "#FFC7AE"] as const),
      edge: dark ? "#EF977C" : "#ED8259",
      ink: dark ? "#FFE0CD" : "#762D1D",
      icon: dark ? "#FFAD8C" : "#B43B21",
    },
  };
  return tones[tone];
}
