import { useColorScheme } from "react-native";
import { useGameDisplay } from "../storage/GameProvider";
import { colors, themePalette } from "./palette";
export {
  colors,
  themePalette,
  homePalette,
  difficultyPalette,
} from "./palette";
export const fonts = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
  heavy: "Manrope_800ExtraBold",
} as const;
export const radius = {
  sm: 12,
  md: 16,
  card: 18,
  lg: 20,
  modal: 24,
  pill: 999,
};
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 };
export const typography = {
  hero: [28, 34],
  page: [22, 28],
  section: [18, 24],
  card: [16, 22],
  body: [14, 20],
  description: [12, 17],
  label: [11, 15],
  navigation: [10, 14],
} as const;
export const typeScale = {
  caption: 11,
  body: 14,
  option: 15,
  action: 16,
  section: 18,
  question: 20,
  score: 36,
};
export const shadows = {
  card: "0px 4px 14px rgba(72, 45, 10, 0.08)",
  answer: "0px 3px 0px rgba(72, 45, 10, 0.07)",
  button: "0px 3px 8px rgba(0, 40, 45, 0.12)",
  goldButton: "0px 3px 10px rgba(138, 76, 0, 0.18)",
  reward: "0px 7px 24px rgba(138, 76, 0, 0.14)",
  selected:
    "0px 0px 0px 2px rgba(255,189,56,0.20), 0px 6px 18px rgba(164,107,0,0.17)",
  categorySelected:
    "0px 0px 0px 2px rgba(229,165,29,0.50), 0px 6px 22px rgba(229,165,29,0.28)",
  dock: "0px -4px 16px rgba(0, 40, 45, 0.06)",
} as const;
export const gradients = {
  hero: [colors.deepTeal, colors.teal, colors.emerald],
  action: ["#FFE072", "#FFB52F", "#FF861C"],
  mustard: ["#FFE18A", colors.mustard, "#DFA21D"],
  green: [colors.emerald, colors.teal],
  reward: [colors.deepTeal, colors.teal, colors.emerald],
  warm: [colors.cream, colors.paleGold],
  daily: [colors.dailyRed, colors.deepCoral, colors.dailyOrange],
} as const;
/** Shared game-card colors, originally approved for the profile statistics. */
export const colorCardPalettes = {
  green: ["#008069", "#007D6C", "#075D59"],
  blue: ["#0874B8", "#086BAA", "#105B9B"],
  gold: ["#FFE08A", "#F4BC4B", "#D59124"],
  purple: ["#8055CD", "#7650D0", "#51349A"],
  coral: ["#FFB281", "#FF9A70", "#F1815F"],
} as const;
export function useTheme() {
  const { profile } = useGameDisplay();
  const system = useColorScheme();
  const dark =
    profile.theme === "dark" ||
    (profile.theme === "system" && system === "dark");
  return themePalette(dark);
}
export const categoryGradients = {
  quran: [colors.turquoise, colors.emerald, colors.teal],
  prophets: [colors.blue, colors.blue, colors.deepBlue],
  history: [colors.gold, colors.orange, colors.bronze],
  general: [colors.softCoral, colors.coral, colors.deepCoral],
} as const;
