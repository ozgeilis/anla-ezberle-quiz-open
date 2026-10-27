export const effectDuration = {
  tick: 120,
  tap: 80,
  select: 140,
  correct: 460,
  wrong: 320,
  next: 160,
  timeout: 440,
  completed: 1100,
  perfect: 1550,
  badge: 750,
  levelUp: 1150,
} as const;
export type SoundEffect = keyof typeof effectDuration;
export type SoundName = SoundEffect;
export const isCelebration = (name: SoundEffect) =>
  ["completed", "perfect", "badge", "levelUp"].includes(name);
export const effectPriority = (name: SoundEffect) =>
  isCelebration(name)
    ? 3
    : ["correct", "wrong", "timeout"].includes(name)
      ? 2
      : 1;
