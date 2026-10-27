import { StyleSheet } from "react-native";
import { colors as c, radius, shadows, space } from "../../theme/tokens";
export const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  card: {
    borderRadius: radius.card,
    padding: space.lg,
    borderWidth: 1,
    boxShadow: shadows.card,
  },
  button: {
    minHeight: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden",
    boxShadow: shadows.button,
    marginVertical: 0,
  },
  buttonContent: {
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    minHeight: 46,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: space.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: c.paleGold,
  },
  backdrop: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(9,47,70,0.7)",
  },
  dialog: {
    width: "100%",
    maxWidth: 380,
    padding: 20,
    borderRadius: 24,
    gap: 8,
  },
});
