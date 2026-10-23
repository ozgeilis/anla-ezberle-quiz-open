export const effectDuration = {
  tap: 100,
  select: 240,
  correct: 680,
  wrong: 420,
  next: 260,
  timeout: 520,
  completed: 1380,
  perfect: 1880,
  badge: 930,
  levelUp: 1450,
} as const;
export type SoundEffect = keyof typeof effectDuration;
export type SoundName = SoundEffect | "music";
export const isCelebration = (name: SoundEffect) =>
  ["completed", "perfect", "badge", "levelUp"].includes(name);
export const effectPriority = (name: SoundEffect) =>
  isCelebration(name)
    ? 3
    : ["correct", "wrong", "timeout"].includes(name)
      ? 2
      : 1;
