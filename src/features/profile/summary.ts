import { categoryName } from "../../content/questions";
import { dateKey, stats, type GameRecord } from "../../domain/game/engine";
import { learningTopicName } from "../../domain/game/learning";
import { playCategoryName } from "../../domain/game/play-categories";

/** Presentation only: reads completed records without changing rewards/history. */
export function profileSummary(games: readonly GameRecord[], now = new Date()) {
  const records = [...new Map(games.map((g) => [g.id, g])).values()];
  const summaries = records.map(stats);
  const answers = summaries.reduce(
    (n, g) => n + g.correct + g.wrong + (g.unanswered ?? 0),
    0,
  );
  const correct = summaries.reduce((n, g) => n + g.correct, 0);
  const days = new Set(records.map((g) => dateKey(new Date(g.completedAt))));
  const day = new Date(`${dateKey(now)}T12:00:00+03:00`);
  if (!days.has(dateKey(day))) day.setUTCDate(day.getUTCDate() - 1);
  let streak = 0;
  while (days.has(dateKey(day))) {
    streak++;
    day.setUTCDate(day.getUTCDate() - 1);
  }
  const categories = new Map<string, number>();
  for (const g of records) {
    const label = g.playCategory
      ? playCategoryName(g.playCategory)
      : g.learningTopic
        ? learningTopicName(g.learningTopic)
        : g.focus
          ? categoryName(g.focus)
          : null;
    if (label) categories.set(label, (categories.get(label) ?? 0) + 1);
  }
  const favorite = [...categories].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return {
    totalScore: summaries.reduce((n, g) => n + g.score, 0),
    games: records.length,
    accuracy: answers ? Math.round((correct / answers) * 100) : null,
    streak,
    favorite,
  };
}
