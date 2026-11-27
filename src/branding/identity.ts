/** Product identity is separate from package IDs, URL schemes and store listing fields. */
const titleLines = ["İslami", "Quiz"] as const;

export const brand = {
  title: titleLines.join(" "),
  titleLines,
  legacyTitle: "Anla & Ezberle",
  subtitle: "İslami Bilgi Yarışması",
  slogan: "Bilgini sına, öğren, ilerle!",
  developer: "Kovynel Studio",
} as const;
