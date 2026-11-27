import type { GameRecord, Session } from "../../domain/game/engine";
import { canOfferInterstitial, type AdPreferences } from "./adPolicy";

type RoundSnapshot = {
  session: Session | null;
  result: GameRecord | null;
  data: { games: readonly GameRecord[] };
};

export function isSavedCompletedRound(id: string, state: RoundSnapshot) {
  return (
    !state.session &&
    state.result?.id === id &&
    state.result.questionIds.length === 10 &&
    state.result.answers.length === 10 &&
    state.data.games.some((game) => game.id === id)
  );
}

/** Share the current round's work, including skips: resume must not retry it. */
export function oncePerRound() {
  let current: { id: string; task: Promise<void> } | null = null;
  return (id: string, action: () => Promise<void>) => {
    if (current?.id === id) return current.task;
    const task = Promise.resolve().then(action);
    current = { id, task };
    return task;
  };
}

type RoundEndState = {
  platform: string;
  roundEndPlacement?: boolean;
  game: RoundSnapshot;
  path: string;
  ready: boolean;
  foreground: boolean;
  busy: boolean;
  preferences: AdPreferences;
};
export function createRoundEndAdBreak() {
  const once = oncePerRound();
  return (
    id: string,
    ports: {
      read(): RoundEndState;
      prepare(id: string): void;
      present(id: string): Promise<void>;
    },
  ): Promise<void> => {
    const initial = ports.read();
    // An old callback cannot replace the gate for a different current round.
    if (
      (initial.platform !== "ios" && !initial.roundEndPlacement) ||
      initial.game.result?.id !== id
    )
      return Promise.resolve();
    return once(id, async () => {
      const state = ports.read();
      if (!isSavedCompletedRound(id, state.game)) return;
      ports.prepare(id);
      if (
        !canOfferInterstitial({
          platform: state.platform,
          roundEndPlacement: state.roundEndPlacement,
          trigger: "round-complete",
          resultId: id,
          completedRounds: state.game.data.games.length,
          saved: true,
          ready: state.ready,
          foreground: state.foreground,
          path: state.path,
          playing: false,
          busy: state.busy,
          preferences: state.preferences,
          now: Date.now(),
          monotonicElapsedMs: Infinity,
        })
      )
        return;
      await ports.present(id);
    });
  };
}

/** Providers retain/report save errors; ads must never trap the final result. */
export async function finishBeforeResults(
  save: () => Promise<void>,
  beforeResults: () => Promise<void>,
  reveal: () => void,
) {
  try {
    await save();
    await beforeResults();
  } finally {
    reveal();
  }
}

export function leaveResults(
  platform: string,
  id: string,
  navigate: () => void,
  legacyExit: (id: string, navigate: () => void) => void,
  roundEndPlacement = false,
) {
  if (platform === "ios" || roundEndPlacement) navigate();
  else legacyExit(id, navigate);
}
