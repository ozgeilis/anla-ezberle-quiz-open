/** Display-only progression. Awarded XP and stored game records never change. */
const MAX_LEVEL = 100;
const safeXp = (xp: number) =>
  Number.isFinite(xp) && xp > 0 ? Math.floor(xp) : 0;
const safeLevel = (level: number) =>
  Math.min(MAX_LEVEL, Math.max(1, safeXp(level)));

export const getMaxLevel = () => MAX_LEVEL;
export function getXpNeededForNextLevel(level: number) {
  const current = safeLevel(level);
  return current === MAX_LEVEL ? 0 : 100 + (current - 1) * 10;
}
export function getXpRangeForLevel(level: number) {
  const current = safeLevel(level),
    steps = current - 1,
    min = steps * 100 + 5 * steps * (steps - 1);
  return {
    min,
    max: current === MAX_LEVEL ? null : min + getXpNeededForNextLevel(current),
  };
}
export function getLevelFromXp(totalXp: number) {
  const xp = safeXp(totalXp);
  let level = 1;
  while (level < MAX_LEVEL && xp >= getXpRangeForLevel(level + 1).min) level++;
  return level;
}
export function getLevelProgress(totalXp: number) {
  const xp = safeXp(totalXp),
    level = getLevelFromXp(xp),
    range = getXpRangeForLevel(level),
    requiredXp = getXpNeededForNextLevel(level),
    atMax = level === MAX_LEVEL,
    levelXp = atMax ? 0 : xp - range.min;
  return {
    level,
    levelXp,
    requiredXp,
    nextLevelXp: atMax ? 0 : requiredXp - levelXp,
    levelPercent: atMax ? 100 : (levelXp / requiredXp) * 100,
    atMax,
  };
}
