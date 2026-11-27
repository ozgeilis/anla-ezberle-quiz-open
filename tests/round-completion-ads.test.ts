import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { defaultAdPreferences } from "../src/features/ads/adPolicy";
import {
  createRoundEndAdBreak,
  finishBeforeResults,
  isSavedCompletedRound,
  leaveResults,
} from "../src/features/ads/roundCompletion";
import {
  answerQuestion,
  advanceQuestion,
  createSession,
  finishSession,
  type GameRecord,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { appendGame, emptyData } from "../src/storage/schema";

function fixture() {
  let at = 1_800_000_000_000;
  let session = createSession("mixed", undefined, at, {
    timed: true,
    quickPlay: true,
  });
  for (let i = 0; i < 10; i++) {
    const q = gameQuestion(session, session.questionIds[i]!)!;
    session = answerQuestion(session, q.correct, at + 1000);
    if (i < 9) {
      at += 25_000;
      session = advanceQuestion(session, at);
    }
  }
  const result = finishSession(session);
  const state = {
    platform: "ios",
    game: {
      session: null as typeof session | null,
      result: result as GameRecord | null,
      data: appendGame(emptyData(), result),
    },
    path: "/quiz",
    ready: true,
    foreground: true,
    busy: false,
    preferences: { ...defaultAdPreferences },
  };
  let attempts = 0;
  const ports = {
    read: () => state,
    prepare: () => {},
    present: async () => {
      attempts++;
    },
  };
  return { state, result, session, ports, attempts: () => attempts };
}

test("an unfinished persistence write cannot present an ad or reveal results", async () => {
  const f = fixture(),
    run = createRoundEndAdBreak();
  f.state.game.data = emptyData();
  let release!: () => void,
    results = 0;
  const written = new Promise<void>((resolve) => {
    release = resolve;
  });
  const done = finishBeforeResults(
    async () => {
      await written;
      f.state.game.data = appendGame(f.state.game.data, f.result);
    },
    () => run(f.result.id, f.ports),
    () => results++,
  );
  await Promise.resolve();
  assert.equal(f.attempts(), 0);
  assert.equal(results, 0);
  release();
  await done;
  assert.equal(f.attempts(), 1);
  assert.equal(results, 1);
});

test("no ready ad / no-fill never waits for load; later readiness or resume cannot advertise the same round", async () => {
  const f = fixture(),
    run = createRoundEndAdBreak();
  const order: string[] = [];
  f.state.ready = false;
  await finishBeforeResults(
    async () => {
      order.push("saved");
    },
    () => run(f.result.id, f.ports),
    () => order.push("results"),
  );
  assert.deepEqual(order, ["saved", "results"]);
  assert.equal(f.attempts(), 0);
  f.state.ready = true;
  await run(f.result.id, f.ports);
  assert.equal(
    f.attempts(),
    0,
    "Late LOADED must not cover the displayed result",
  );
});

test("only a durably saved ten-answer result can advertise; failed save still reveals a retryable result", async () => {
  for (const kind of ["unsaved", "playing", "incomplete", "stale"] as const) {
    const f = fixture();
    if (kind === "unsaved") f.state.game.data = emptyData();
    if (kind === "playing") f.state.game.session = f.session;
    if (kind === "incomplete")
      f.state.game.result = {
        ...f.result,
        answers: f.result.answers.slice(0, 9),
      };
    if (kind === "stale")
      f.state.game.result = { ...f.result, id: "different-round" };
    assert.equal(isSavedCompletedRound(f.result.id, f.state.game), false);
    let revealed = false;
    await finishBeforeResults(
      async () => {},
      () => createRoundEndAdBreak()(f.result.id, f.ports),
      () => {
        revealed = true;
      },
    );
    assert.equal(revealed, true);
    assert.equal(f.attempts(), 0);
  }
  let revealed = false,
    adCalled = false;
  await assert.rejects(
    finishBeforeResults(
      async () => {
        throw Error("disk full");
      },
      async () => {
        adCalled = true;
      },
      () => {
        revealed = true;
      },
    ),
    /disk full/,
  );
  assert.equal(adCalled, false);
  assert.equal(revealed, true);
});

test("foreground, privacy, busy and route guards skip once; subsequent resume must not reopen", async () => {
  for (const change of [
    { foreground: false },
    { ready: false },
    { busy: true },
    { path: "/results" },
  ]) {
    const f = fixture(),
      run = createRoundEndAdBreak();
    Object.assign(f.state, change);
    await run(f.result.id, f.ports);
    assert.equal(f.attempts(), 0);
    Object.assign(f.state, {
      foreground: true,
      ready: true,
      busy: false,
      path: "/quiz",
    });
    await run(f.result.id, f.ports);
    assert.equal(f.attempts(), 0);
  }
  // A background transition between scheduling and eligibility also blocks it.
  const f = fixture(),
    run = createRoundEndAdBreak();
  const pending = run(f.result.id, f.ports);
  f.state.foreground = false;
  await pending;
  assert.equal(f.attempts(), 0);
});

test("presentation failure reveals results and is not attempted twice", async () => {
  const f = fixture(),
    run = createRoundEndAdBreak();
  let calls = 0,
    results = 0;
  f.ports.present = async () => {
    calls++;
    throw Error("native unavailable");
  };
  await assert.rejects(
    finishBeforeResults(
      async () => {},
      () => run(f.result.id, f.ports),
      () => results++,
    ),
    /native unavailable/,
  );
  await assert.rejects(run(f.result.id, f.ports), /native unavailable/);
  assert.equal(calls, 1);
  assert.equal(results, 1);
});

test("a stale callback cannot displace the current round gate; Android keeps result-exit delegation", async () => {
  const f = fixture(),
    run = createRoundEndAdBreak();
  const first = run(f.result.id, f.ports);
  await run("stale-round", f.ports);
  assert.equal(run(f.result.id, f.ports), first);
  await first;
  assert.equal(f.attempts(), 1);
  f.state.platform = "android";
  await createRoundEndAdBreak()(f.result.id, f.ports);
  assert.equal(f.attempts(), 1);
  let navigated = 0,
    legacy = 0;
  leaveResults(
    "android",
    f.result.id,
    () => navigated++,
    (id, next) => {
      assert.equal(id, f.result.id);
      legacy++;
      next();
    },
  );
  assert.deepEqual([legacy, navigated], [1, 1]);
});

test("production screens wire iOS save/ad/results ordering and both result buttons through the tested helpers", () => {
  const quiz = readFileSync("src/features/quiz/QuizScreen.tsx", "utf8");
  const result = readFileSync("src/features/quiz/ResultsScreen.tsx", "utf8");
  const provider = readFileSync("src/features/ads/AdProvider.tsx", "utf8");
  assert.match(quiz, /!demo && Platform.OS === "ios"/);
  assert.match(quiz, /finishBeforeResults/);
  assert.match(quiz, /await solo\.finish\(\)/);
  assert.match(quiz, /ads\.completeRound\(session.id\)/);
  assert.match(
    result,
    /leaveResults\(Platform.OS, result.id, navigate, ads.transition\)/,
  );
  assert.match(result, /onPress=\{\(\) => exit\(replay\)\}/);
  assert.match(result, /onPress=\{\(\) => exit\(home\)\}/);
  assert.match(provider, /revision === generation.current.value/);
  assert.match(provider, /ad === full.current/);
  assert.match(provider, /isSavedCompletedRound\(action.id, getSnapshot\(\)\)/);
});
