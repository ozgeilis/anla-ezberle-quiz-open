import { visitedSubjectCount } from "../game/play-categories";
import { GameRecord, stats } from "../game/engine";
import { progress } from "../scoring/progress";
import { uniqueRounds, creditedRounds } from "../scoring/rewards";
import { badgeCatalog, BadgeDefinition, Metric } from "./catalog";
export type AchievementMetrics = Record<Metric, number>;
export interface SocialAchievements {
  earned: string[];
  metrics: {
    friends: number;
    opponents: number;
    wins: number;
    perfect: number;
    liveRounds?: number;
    liveWins?: number;
    livePerfect?: number;
    liveFriends?: number;
  };
  shared: boolean;
  showcase: string[];
}
export interface BadgeState extends BadgeDefinition {
  earned: boolean;
  available: boolean;
  fraction: number;
  goals: { label: Metric; value: number; target: number }[];
}
const metrics = (games: readonly GameRecord[]): AchievementMetrics => ({
  rounds: games.length,
  correct: games.reduce((sum, g) => sum + stats(g).correct, 0),
  perfect: games.filter((g) => stats(g).correct === 10).length,
  daily: games.filter((g) => g.mode === "daily").length,
  topics: visitedSubjectCount(games),
  friends: 0,
  opponents: 0,
  wins: 0,
  liveRounds: 0,
  liveWins: 0,
  livePerfect: 0,
  liveFriends: 0,
});
export function achievements(
  games: readonly GameRecord[],
  social?: SocialAchievements,
): BadgeState[] {
  const rounds = uniqueRounds(games),
    general = metrics(rounds),
    oldProgress = progress(games),
    legacy = oldProgress.badges;
  const credited = creditedRounds(games);
  const topics = new Map<string, AchievementMetrics>();
  for (const b of badgeCatalog)
    if (b.group === "category" && !topics.has(b.subject!))
      topics.set(
        b.subject!,
        metrics(rounds.filter((g) => g.learningTopic === b.subject)),
      );
  return badgeCatalog.map((b) => {
    // All seasonal subjects remain editorial previews. There is no supported
    // seasonal GameRecord or playable selector; dates and question keywords are
    // never accepted as evidence. Add a versioned playable record adapter first.
    const available =
      b.group !== "seasonal" && (b.group !== "social" || !!social);
    const m =
      b.group === "category"
        ? topics.get(b.subject!)!
        : b.group === "social"
          ? { ...general, ...social?.metrics }
          : general;
    const old = legacy.find((x) => x.id === b.id);
    const goals = b.requirements.map((r) => ({
      label: r.metric,
      value: Math.min(r.target, m[r.metric]),
      target: r.target,
    }));
    const earned =
      old?.earned ??
      (available &&
        (b.group === "social"
          ? !!social?.earned.includes(b.id)
          : goals.every((g) => g.value >= g.target)));
    // Preserve the four legacy achievements without rewriting their identities.
    if (old) {
      const value =
        b.id === "first"
          ? Math.min(1, games.length)
          : b.id === "five"
            ? Math.min(5, oldProgress.xp / 10)
            : b.id === "perfect"
              ? Math.max(0, ...credited.map((g) => stats(g).correct))
              : Math.max(
                  new Set(
                    credited
                      .filter((g) => g.mode === "focus")
                      .map((g) => g.focus),
                  ).size,
                  visitedSubjectCount(credited),
                );
      if (b.id === "perfect") goals[0]!.target = 10;
      goals[0]!.value = Math.min(goals[0]!.target, value);
    }
    return {
      ...b,
      available,
      earned,
      goals,
      fraction: earned
        ? 1
        : available
          ? Math.min(...goals.map((g) => g.value / g.target))
          : 0,
    };
  });
}
export function nextAchievement(badges: readonly BadgeState[]) {
  return (
    badges
      .filter((b) => b.available && !b.earned)
      .sort(
        (a, b) =>
          b.fraction - a.fraction ||
          Number(a.group !== "general") - Number(b.group !== "general"),
      )[0] ?? null
  );
}
