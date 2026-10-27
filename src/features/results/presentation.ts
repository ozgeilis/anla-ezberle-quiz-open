/** Per-round presentation only. Does not award XP or permanent achievements. */
export type ResultTier =
  "perfect" | "excellent" | "steady" | "beginning" | "learning";
const tiers = {
  perfect: {
    title: "Mükemmel!",
    message: "Tüm soruları doğru cevapladın. Muhteşem bir başarı!",
    advice: "Bu güzel sonucu yeni konular keşfederek pekiştir.",
    label: "Altın şampiyonluk kupası",
    accent: "#FFE178",
    fill: "#00DCA0",
    background: ["#00644F", "#003E43", "#072D43"],
  },
  excellent: {
    title: "Harika!",
    message:
      "Soruları başarıyla tamamladın. Bilgilerini güçlendirmeye devam et!",
    advice: "Düzenli pratik bilgilerini daha da kalıcı kılar.",
    label: "Altın yıldızlı başarı madalyası",
    accent: "#FFD265",
    fill: "#00D8A1",
    background: ["#006653", "#004348", "#072D43"],
  },
  steady: {
    title: "Gayet iyi!",
    message: "Biraz daha pratikle çok daha iyi sonuçlar elde edebilirsin.",
    advice: "Yanlışlarını incele, bir sonraki turda hedefe biraz daha yaklaş.",
    label: "Hedef tahtası ve isabet eden altın ok",
    accent: "#FFD06B",
    fill: "#FFCA45",
    background: ["#58433C", "#293745", "#0C263A"],
  },
  beginning: {
    title: "İyi bir başlangıç!",
    message: "Her yeni soru öğrenmek için bir fırsat. Güzel ilerliyorsun!",
    advice: "Küçük adımlar büyük bir öğrenme yolculuğuna dönüşür.",
    label: "Bronz madalya ve yükselen yıldız",
    accent: "#FFC28B",
    fill: "#F6A158",
    background: ["#654133", "#314343", "#102E40"],
  },
  learning: {
    title: "Pes etme!",
    message:
      "Hatalar öğrenmenin bir parçası. Tekrar denediğinde daha iyi yapabilirsin!",
    advice: "Açıklamalara göz at; öğrendiğin her bilgi seninle kalır.",
    label: "Öğrenme kitabı ve gelişim filizi",
    accent: "#8EF6DE",
    fill: "#40D6BF",
    background: ["#176272", "#154653", "#0D2B40"],
  },
} as const;
export function resultPresentation(correct: number, total: number) {
  if (
    !Number.isInteger(total) ||
    total < 1 ||
    !Number.isInteger(correct) ||
    correct < 0 ||
    correct > total
  )
    throw new RangeError("Invalid result counts");
  const tier: ResultTier =
    correct === total
      ? "perfect"
      : correct * 100 >= total * 80
        ? "excellent"
        : correct * 100 >= total * 60
          ? "steady"
          : correct * 100 >= total * 40
            ? "beginning"
            : "learning";
  return {
    tier,
    ...tiers[tier],
    fraction: correct / total,
    percent: Math.round((correct / total) * 1000) / 10,
    confetti: tier === "perfect" ? 24 : tier === "excellent" ? 12 : 0,
  };
}
