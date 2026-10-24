import type { SoundName } from "./catalog";
export const soundAssets: Record<SoundName, number> = {
  tap: require("../../../assets/audio/tap.wav"),
  select: require("../../../assets/audio/select.wav"),
  correct: require("../../../assets/audio/correct.wav"),
  wrong: require("../../../assets/audio/wrong.wav"),
  next: require("../../../assets/audio/next.wav"),
  timeout: require("../../../assets/audio/timeout.wav"),
  completed: require("../../../assets/audio/completed.wav"),
  perfect: require("../../../assets/audio/perfect.wav"),
  badge: require("../../../assets/audio/badge.wav"),
  levelUp: require("../../../assets/audio/levelUp.wav"),
  tick: require("../../../assets/audio/tick.wav"),
};
