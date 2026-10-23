import { visitedSubjectCount } from "../game/play-categories";
import { rewardSummary, creditedRounds } from "./rewards";
import { GameRecord, stats } from "../game/engine";
export interface Badge {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  symbol: "flag" | "check-circle" | "star" | "compass";
}
export function progress(games: readonly GameRecord[]) {
  const correct = games.reduce((sum, g) => sum + stats(g).correct, 0);
  const xp = rewardSummary(games);
  const level = Math.min(100, Math.floor(xp / 250) + 1);
  const credited = creditedRounds(games);
  const creditedCorrect = credited.reduce(
    (sum, g) => sum + stats(g).correct,
    0,
  );
  const focused = new Set(
    credited.filter((g) => g.mode === "focus").map((g) => g.focus),
  );
  const badges: Badge[] = [
    {
      id: "first",
      title: "İlk adım",
      description: "İlk yarışmanı tamamla.",
      earned: games.length > 0,
      symbol: "flag",
    },
    {
      id: "five",
      title: "Bilgi ışığı",
      description: "Toplam 5 doğru cevaba ulaş.",
      earned: creditedCorrect >= 5,
      symbol: "check-circle",
    },
    {
      id: "perfect",
      title: "Kusursuz tur",
      description: "Bir yarışmada 10 soruyu da doğru yanıtla.",
      earned: credited.some((g) => stats(g).correct === 10),
      symbol: "star",
    },
    {
      id: "explorer",
      title: "Meraklı kâşif",
      description: "4 farklı kategoride odaklı tur tamamla.",
      earned: focused.size === 4 || visitedSubjectCount(credited) >= 4,
      symbol: "compass",
    },
  ];
  return {
    xp,
    level,
    levelXp: level === 100 ? 250 : xp % 250,
    nextLevelXp: level === 100 ? 0 : 250 - (xp % 250),
    title: playerTitle(level),
    best: Math.max(0, ...games.map((g) => stats(g).score)),
    badges,
    correct,
  };
}

export function playerTitle(level: number) {
  return level >= 100
    ? "Yüzüncü seviye kâşifi"
    : level >= 75
      ? "Keşif rehberi"
      : level >= 50
        ? "Deneyimli araştırmacı"
        : level >= 35
          ? "Bilgi araştırmacısı"
          : level >= 20
            ? "Bilgi ustası"
            : level >= 10
              ? "Bilge yolcu"
              : level >= 5
                ? "Bilgili kâşif"
                : level >= 3
                  ? "Meraklı kâşif"
                  : "Yeni yolcu";
}
