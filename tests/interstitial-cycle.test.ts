import test from "node:test";
import assert from "node:assert/strict";
import type { InterstitialPort } from "../src/features/ads/interstitial";
import {
  createInterstitialCycle,
  INTERSTITIAL_LOAD_TIMEOUT_MS,
  INTERSTITIAL_OPEN_TIMEOUT_MS,
} from "../src/features/ads/interstitialCycle";
import { defaultAdPreferences } from "../src/features/ads/adPolicy";
import {
  answerQuestion,
  advanceQuestion,
  createSession,
  finishSession,
  expireQuestion,
  type Session,
  type GameRecord,
} from "../src/domain/game/engine";
import { gameQuestion } from "../src/content/questions/registry";
import { appendGame, emptyData, parseData } from "../src/storage/schema";
import { rewardSummary } from "../src/domain/scoring/rewards";
import { persistChange } from "../src/storage/persist";
import {
  createRoundEndAdBreak,
  finishBeforeResults,
  isSavedCompletedRound,
  leaveResults,
  oncePerRound,
} from "../src/features/ads/roundCompletion";

type Event = Parameters<InterstitialPort["listen"]>[0];
function sdk() {
  const requests: ReturnType<typeof request>[] = [];
  function request() {
    const listeners = new Map<Event, Set<() => void>>();
    let loads = 0,
      shows = 0,
      destroys = 0;
    const port: InterstitialPort = {
      load() {
        assert.equal(destroys, 0, "A retired SDK object must never load again");
        loads++;
      },
      async show() {
        assert.equal(destroys, 0);
        shows++;
        assert.equal(shows, 1, "A creative may be presented only once");
      },
      destroy() {
        destroys++;
      },
      listen(event, fn) {
        const set = listeners.get(event) ?? new Set();
        listeners.set(event, set);
        set.add(fn);
        return () => set.delete(fn);
      },
    };
    return {
      port,
      emit: (event: Event) =>
        [...(listeners.get(event) ?? [])].forEach((fn) => fn()),
      lateEvent: (event: Event) => {
        const callbacks = [...(listeners.get(event) ?? [])];
        return () => callbacks.forEach((fn) => fn());
      },
      stats: () => ({
        loads,
        shows,
        destroys,
        listeners: [...listeners.values()].reduce(
          (sum, set) => sum + set.size,
          0,
        ),
      }),
    };
  }
  return {
    requests,
    create: () => {
      const next = request();
      requests.push(next);
      return next.port;
    },
  };
}
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

for (const platform of ["ios", "android"] as const)
  test(`${platform}: five rounds / fifty questions save before ads/results; fresh preload and buttons never advertise`, async (t) => {
    const driver = sdk();
    let data = emptyData();
    data.profile.name = "Korunan Oyuncu";
    let session: Session | null = null,
      result: GameRecord | null = null;
    let preferences = { ...defaultAdPreferences },
      ready = false,
      path = "/";
    const snapshot = () => ({ data, session, result });
    let completedId: string | null = null;
    const ad = createInterstitialCycle(
      driver.create,
      (value) => (ready = value),
      () =>
        !session &&
        (["/", "/results"].includes(path) ||
          (path === "/quiz" &&
            completedId !== null &&
            isSavedCompletedRound(completedId, snapshot()))),
    );
    t.after(() => ad.dispose());
    const roundEnd = createRoundEndAdBreak(),
      finishOnce = oncePerRound();
    const events: string[] = [];
    const ports = {
      read: () => ({
        platform,
        roundEndPlacement: platform === "android",
        game: snapshot(),
        path,
        ready,
        foreground: true,
        busy: false,
        preferences,
      }),
      prepare: (id: string) => {
        completedId = id;
      },
      present: async (id: string) => {
        preferences = {
          ...preferences,
          consumedResults: [...preferences.consumedResults, id],
        };
        events.push("ad");
        await ad.show();
        events.push("closed");
      },
    };
    let serialized = "";
    ad.load();
    let adCount = 0;
    for (let round = 0; round < 5; round++) {
      const eventOffset = events.length;
      driver.requests[adCount]!.emit("loaded");
      assert.equal(ready, true);
      path = "/quiz";
      let at = 1_800_000_000_000 + round * 1_000_000;
      session = createSession("mixed", undefined, at, {
        quickPlay: true,
        timed: true,
        history: data.games,
      });
      assert.equal(await ad.show(), false, "No ad while the quiz clock runs");
      for (let i = 0; i < 10; i++) {
        const q: NonNullable<ReturnType<typeof gameQuestion>> = gameQuestion(
          session,
          session.questionIds[i]!,
        )!;
        // Real engine final answers cover correct, wrong and the full 20s timeout.
        session =
          i === 9 && (round === 2 || round === 4)
            ? expireQuestion(session, at + 20_000)
            : answerQuestion(
                session,
                i === 9 && round === 1 ? (q.correct + 1) % 4 : q.correct,
                at + 1000,
              );
        if (i < 9) {
          at += 25_000;
          session = advanceQuestion(session, at);
        }
      }
      const answered = session;
      assert.equal(answered.answers.length, 10);
      if (round === 2 || round === 4)
        assert.equal(answered.answers[9]!.timedOut, true);
      const id = session.id;
      const complete = () =>
        finishOnce(id, () =>
          finishBeforeResults(
            async () => {
              result = finishSession(answered);
              session = null;
              data = await persistChange(
                data,
                (current) => appendGame(current, result!),
                async (raw) => {
                  serialized = raw;
                },
              );
              events.push("saved");
            },
            () => roundEnd(id, ports),
            () => {
              path = "/results";
              events.push("results");
            },
          ),
        );
      const done = complete();
      assert.equal(
        complete(),
        done,
        "Duplicate finish callbacks share the same work",
      );
      // Wait for the real persistence / completion promise chain, not wall time.
      for (let i = 0; i < 12; i++) await flush();
      if (platform === "ios" && (round + 1) % 2 !== 0) {
        await done;
        assert.deepEqual(events.slice(eventOffset), ["saved", "results"]);
        assert.equal(driver.requests[adCount]!.stats().shows, 0);
        let legacy = 0;
        leaveResults(
          platform,
          id,
          () => {
            path = "/";
          },
          () => {
            legacy++;
          },
        );
        leaveResults(
          platform,
          id,
          () => {},
          () => {
            legacy++;
          },
        );
        assert.equal(legacy, 0);
        continue;
      }
      assert.deepEqual(events.slice(eventOffset), ["saved", "ad"]);
      assert.equal(path, "/quiz", "Results remain hidden until native CLOSE");
      const saved = JSON.stringify(data),
        xp = rewardSummary(data.games);
      assert.equal(serialized, saved);
      const current = driver.requests[adCount]!;
      current.emit("opened");
      await flush();
      assert.equal(path, "/quiz", "Native show() resolution is not CLOSE");
      current.emit("closed");
      await done;
      await flush();
      assert.deepEqual(events.slice(eventOffset), [
        "saved",
        "ad",
        "closed",
        "results",
      ]);
      assert.deepEqual(current.stats(), {
        loads: 1,
        shows: 1,
        destroys: 1,
        listeners: 0,
      });
      assert.equal(
        driver.requests.length,
        adCount + 2,
        "CLOSE preloads the next creative without a restart",
      );
      assert.equal(driver.requests[adCount + 1]!.stats().loads, 1);
      await roundEnd(id, ports);
      current.emit("closed");
      let home = 0,
        replay = 0,
        legacyAds = 0;
      leaveResults(
        platform,
        id,
        () => home++,
        () => legacyAds++,
        platform === "android",
      );
      leaveResults(
        platform,
        id,
        () => replay++,
        () => legacyAds++,
        platform === "android",
      );
      assert.deepEqual([home, replay, legacyAds], [1, 1, 0]);
      assert.equal(current.stats().shows, 1);
      assert.equal(JSON.stringify(data), saved);
      assert.equal(
        rewardSummary(data.games),
        xp,
        "Presentation never changes score or XP",
      );
      path = "/";
      adCount++;
    }
    assert.equal(adCount, platform === "ios" ? 2 : 5);
    assert.equal(driver.requests.length, adCount + 1);
    assert.equal(parseData(serialized).games.length, 5);
    assert.equal(new Set(data.games.flatMap((g) => g.questionIds)).size, 50);
    assert.equal(data.profile.name, "Korunan Oyuncu");
  });

test("no-fill/offline releases readiness immediately and a safe later load creates a fresh request without a retry loop", async (t) => {
  const driver = sdk();
  let ready = false;
  const ad = createInterstitialCycle(
    driver.create,
    (r) => (ready = r),
    () => true,
  );
  t.after(() => ad.dispose());
  ad.load();
  const old = driver.requests[0]!,
    lateLoaded = old.lateEvent("loaded");
  old.emit("error");
  assert.equal(await ad.show(), false);
  await flush();
  assert.equal(driver.requests.length, 1, "No infinite no-fill retries");
  ad.load();
  lateLoaded();
  assert.equal(ready, false, "Late response from failed request is ignored");
  driver.requests[1]!.emit("loaded");
  const shown = ad.show();
  driver.requests[1]!.emit("opened");
  driver.requests[1]!.emit("closed");
  assert.equal(await shown, true);
});

test("a silently stalled load expires so later rounds can request again; duplicate loads and stale callbacks stay harmless", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const driver = sdk();
  let ready = false;
  const ad = createInterstitialCycle(
    driver.create,
    (r) => (ready = r),
    () => true,
  );
  t.after(() => ad.dispose());
  ad.load();
  ad.load();
  const late = driver.requests[0]!.lateEvent("loaded");
  assert.equal(driver.requests.length, 1);
  t.mock.timers.tick(INTERSTITIAL_LOAD_TIMEOUT_MS);
  assert.equal(await ad.show(), false);
  assert.equal(driver.requests[0]!.stats().destroys, 1);
  ad.load();
  late();
  assert.equal(ready, false);
  driver.requests[1]!.emit("loaded");
  assert.equal(ready, true);
});

test("show rejection, native error and missing OPENED release navigation; an opened ad waits for actual dismissal", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const driver = sdk();
  const ad = createInterstitialCycle(
    driver.create,
    () => {},
    () => true,
  );
  t.after(() => ad.dispose());
  ad.load();
  driver.requests[0]!.emit("loaded");
  driver.requests[0]!.port.show = () =>
    Promise.reject(Error("presentation unavailable"));
  assert.equal(await ad.show(), false);
  await flush();
  driver.requests[1]!.emit("loaded");
  const failed = ad.show();
  driver.requests[1]!.emit("error");
  assert.equal(await failed, false);
  await flush();
  driver.requests[2]!.emit("loaded");
  const stalled = ad.show();
  t.mock.timers.tick(INTERSTITIAL_OPEN_TIMEOUT_MS);
  assert.equal(await stalled, false);
  ad.load();
  driver.requests[3]!.emit("loaded");
  let closed = false;
  const visible = ad.show().then((value) => {
    closed = true;
    return value;
  });
  driver.requests[3]!.emit("opened");
  t.mock.timers.tick(INTERSTITIAL_OPEN_TIMEOUT_MS * 20);
  await flush();
  assert.equal(closed, false, "No arbitrary timeout over a visible ad");
  driver.requests[3]!.emit("closed");
  assert.equal(await visible, true);
});

test("privacy/gameplay/background boundaries block preloads and disposal cancels queued work and a pending show", async (t) => {
  const driver = sdk();
  let allowed = false;
  const ad = createInterstitialCycle(
    driver.create,
    () => {},
    () => allowed,
  );
  t.after(() => ad.dispose());
  ad.load();
  assert.equal(driver.requests.length, 0);
  allowed = true;
  ad.load();
  driver.requests[0]!.emit("loaded");
  const shown = ad.show();
  driver.requests[0]!.emit("opened");
  allowed = false;
  driver.requests[0]!.emit("closed");
  assert.equal(await shown, true);
  await flush();
  assert.equal(driver.requests.length, 1);
  allowed = true;
  ad.load();
  driver.requests[1]!.emit("loaded");
  const pending = ad.show();
  ad.dispose();
  ad.dispose();
  assert.equal(await pending, false);
  await flush();
  ad.load();
  assert.equal(driver.requests.length, 2);
  assert.equal(driver.requests[1]!.stats().destroys, 1);
});

test("a stale CLOSE or rejected show promise cannot retire the next loaded creative", async (t) => {
  const driver = sdk();
  let ready = false;
  const ad = createInterstitialCycle(
    driver.create,
    (value) => (ready = value),
    () => true,
  );
  t.after(() => ad.dispose());
  ad.load();
  const old = driver.requests[0]!;
  old.emit("loaded");
  let rejectOld: (error: Error) => void;
  old.port.show = () =>
    new Promise((_, reject) => {
      rejectOld = reject;
    });
  const lateClose = old.lateEvent("closed"),
    shown = ad.show();
  old.emit("opened");
  old.emit("closed");
  assert.equal(await shown, true);
  await flush();
  driver.requests[1]!.emit("loaded");
  lateClose();
  rejectOld!(Error("late native response"));
  await flush();
  assert.equal(ready, true);
  assert.equal(driver.requests[1]!.stats().destroys, 0);
  const next = ad.show();
  driver.requests[1]!.emit("opened");
  driver.requests[1]!.emit("closed");
  assert.equal(await next, true);
});

test("synchronous load/show and cleanup failures do not leave loading or navigation locked", async (t) => {
  const driver = sdk();
  let badLoad = true;
  const ad = createInterstitialCycle(
    () => {
      const port = driver.create();
      if (badLoad)
        port.load = () => {
          throw Error("offline");
        };
      return port;
    },
    () => {},
    () => true,
  );
  t.after(() => ad.dispose());
  assert.doesNotThrow(() => ad.load());
  assert.equal(await ad.show(), false);
  badLoad = false;
  ad.load();
  driver.requests[1]!.emit("loaded");
  driver.requests[1]!.port.show = () => {
    throw Error("native presentation failed");
  };
  assert.equal(await ad.show(), false);
  await flush();
  driver.requests[2]!.emit("loaded");
  driver.requests[2]!.port.destroy = () => {
    throw Error("native cleanup failed");
  };
  const shown = ad.show();
  driver.requests[2]!.emit("opened");
  assert.doesNotThrow(() => driver.requests[2]!.emit("closed"));
  assert.equal(await shown, true);
});
