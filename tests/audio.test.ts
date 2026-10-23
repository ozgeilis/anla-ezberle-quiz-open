import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { SoundController } from "../src/features/audio/controller";
import type {
  SoundDriver,
  SoundPlayer,
} from "../src/features/audio/driver.types";
import type { SoundName } from "../src/features/audio/catalog";
import {
  defaultSoundPreferences as defaults,
  parseSoundPreferences,
  menuMusicAllowed,
} from "../src/features/audio/preferences";
import {
  quizAudioCues,
  liveAudioCues,
  duelAudioCues,
  type LiveAudioState,
} from "../src/features/audio/events";
class TestClock {
  t = 0;
  id = 0;
  jobs = new Map<number, { fn: () => void; at: number }>();
  now = () => this.t;
  set = (fn: () => void, ms: number) => {
    const id = ++this.id;
    this.jobs.set(id, { fn, at: this.t + ms });
    return id;
  };
  clear = (id: unknown) => {
    this.jobs.delete(id as number);
  };
  advance(ms: number) {
    const end = this.t + ms;
    for (;;) {
      const next = [...this.jobs.entries()]
        .filter(([, j]) => j.at <= end)
        .sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      this.t = next[1].at;
      this.jobs.delete(next[0]);
      next[1].fn();
    }
    this.t = end;
  }
}
function harness(web = false) {
  const clock = new TestClock(),
    starts: SoundName[] = [],
    players = new Map<SoundName, SoundPlayer>();
  let released = 0,
    failure = false;
  const driver: SoundDriver = {
    prepare: async () => {},
    unlock: () => {},
    player(name) {
      if (failure) throw Error("Unavailable playback");
      if (players.has(name)) return players.get(name)!;
      let playing = false;
      const p: SoundPlayer = {
        volume: 0,
        get playing() {
          return playing;
        },
        play() {
          if (name !== "music")
            assert.equal(
              [...players.entries()].filter(
                ([n, p]) => n !== "music" && p.playing,
              ).length,
              0,
              "only one effect voice",
            );
          starts.push(name);
          playing = true;
        },
        pause() {
          playing = false;
        },
        release() {
          playing = false;
          released++;
        },
      };
      players.set(name, p);
      return p;
    },
    dispose() {
      for (const p of players.values()) p.release();
    },
  };
  return {
    engine: new SoundController(driver, web, clock),
    clock,
    starts,
    players,
    fail: () => {
      failure = true;
    },
    released: () => released,
  };
}
test("audio preferences preserve explicit mute, validate values and do not share the game store", () => {
  assert.deepEqual(parseSoundPreferences(null), defaults);
  assert.equal(defaults.effectsEnabled, true);
  assert.equal(defaults.musicEnabled, false);
  assert.equal(defaults.effectsVolume, 0.5);
  assert.equal(defaults.musicVolume, 0.5);
  assert.deepEqual(
    parseSoundPreferences(
      JSON.stringify({ ...defaults, effectsEnabled: false }),
    ),
    { ...defaults, effectsEnabled: false },
  );
  for (const raw of [
    "{",
    "null",
    "[]",
    JSON.stringify({ ...defaults, effectsVolume: 2 }),
    JSON.stringify({ ...defaults, musicVolume: -1 }),
    JSON.stringify({ ...defaults, effectsEnabled: "true" }),
    JSON.stringify({ ...defaults, version: 2 }),
  ])
    assert.throws(() => parseSoundPreferences(raw));
  for (const path of ["/quiz", "/duel/play", "/results", "/live", "/online"])
    assert.equal(menuMusicAllowed(path), false);
  assert(menuMusicAllowed("/settings"));
  assert(menuMusicAllowed("/"));
});
test("accepted effects deduplicate across renders, throttle rapid taps, and consume muted events", async () => {
  const h = harness();
  await h.engine.prepare();
  h.engine.setRoute("/");
  assert.equal(h.engine.play("correct", "not-loaded"), false);
  h.engine.configure(defaults);
  assert(h.engine.play("correct", "accepted-1"));
  assert.equal(h.engine.play("correct", "accepted-1"), false);
  h.clock.advance(1000);
  for (let n = 0; n < 20; n++) h.engine.play("tap");
  assert.deepEqual(h.starts, ["correct", "tap"]);
  h.engine.configure({ ...defaults, effectsEnabled: false });
  assert.equal(h.engine.play("wrong", "muted-answer"), false);
  h.engine.configure(defaults);
  assert.equal(h.engine.play("wrong", "muted-answer"), false);
  h.clock.advance(1000);
  h.engine.play("wrong", "accepted-2");
  assert.equal(h.starts.at(-1), "wrong");
  h.engine.configure({ ...defaults, effectsVolume: 0 });
  assert.equal(h.engine.play("correct", "zero-volume"), false);
  h.engine.dispose();
});
test("celebration queue is bounded, serial, and survives only the quiz-to-results transition", async () => {
  const h = harness();
  await h.engine.prepare();
  h.engine.configure(defaults);
  h.engine.setRoute("/quiz");
  h.engine.play("correct", "a");
  h.engine.play("completed", "r");
  h.engine.play("badge", "b");
  h.engine.play("levelUp", "l");
  assert.equal(h.engine.play("perfect", "queue-full"), false);
  h.engine.setRoute("/results");
  h.clock.advance(6000);
  assert.deepEqual(h.starts, ["correct", "completed", "badge", "levelUp"]);
  h.engine.play("perfect", "r2");
  h.engine.play("badge", "b2");
  h.engine.setRoute("/");
  h.clock.advance(6000);
  assert.equal(h.starts.filter((n) => n === "badge").length, 1);
  h.engine.dispose();
  assert.equal(h.released(), h.players.size);
  assert.equal(h.clock.jobs.size, 0);
});
test("music requires saved opt-in and browser gesture, fades, pauses for quiz/background, and errors never escape", async () => {
  const h = harness(true);
  await h.engine.prepare();
  h.engine.configure(defaults);
  h.engine.setRoute("/");
  h.engine.activate();
  assert.equal(h.starts.length, 0);
  h.engine.configure({ ...defaults, musicEnabled: true });
  h.clock.advance(300);
  assert.deepEqual(h.starts, ["music"]);
  assert.equal(h.players.get("music")!.volume, 0.175);
  h.engine.setRoute("/quiz");
  assert.equal(h.players.get("music")!.playing, false);
  h.engine.setActive(false);
  h.engine.setRoute("/");
  h.clock.advance(300);
  assert.equal(h.starts.length, 1);
  h.engine.setActive(true);
  h.clock.advance(300);
  assert.equal(h.starts.length, 2);
  h.engine.configure(defaults);
  h.clock.advance(300);
  assert.equal(h.players.get("music")!.playing, false);
  h.fail();
  assert.doesNotThrow(() => h.engine.play("correct", "broken"));
  assert.equal(h.engine.play("wrong", "broken-2"), false);
  h.engine.suspendPreferences();
  assert.equal(h.engine.play("tap", "storage-unreadable"), false);
  h.engine.dispose();
  h.clock.advance(10000);
  assert.equal(h.clock.jobs.size, 0);
  const cold = harness(true);
  await cold.engine.prepare();
  cold.engine.setRoute("/");
  cold.engine.configure({ ...defaults, musicEnabled: true });
  cold.clock.advance(1000);
  assert.equal(cold.starts.length, 0);
  cold.engine.dispose();
});
test("hidden/background feedback is dropped and cannot be replayed after resume", async () => {
  const h = harness();
  await h.engine.prepare();
  h.engine.configure(defaults);
  h.engine.setRoute("/");
  h.engine.play("correct", "a");
  h.engine.play("badge", "b");
  h.engine.setActive(false);
  h.clock.advance(5000);
  assert.deepEqual(h.starts, ["correct"]);
  assert.equal(h.engine.play("wrong", "offline-received"), false);
  h.engine.setActive(true);
  assert.equal(h.engine.play("wrong", "offline-received"), false);
  assert.equal(h.starts.length, 1);
  h.engine.dispose();
  assert.equal(h.engine.play("tap"), false);
});
test("quiz, async duel and live cues use accepted/revealed state and never disclose hidden answer keys", () => {
  const q = { id: "game", cursor: 0, answer: null, hidden: false };
  assert.deepEqual(quizAudioCues(null, { ...q, answer: true }), []);
  assert.equal(quizAudioCues(q, { ...q, answer: true })[0]!.name, "correct");
  assert.equal(quizAudioCues(q, { ...q, answer: false })[0]!.name, "wrong");
  assert.equal(
    quizAudioCues(
      { ...q, hidden: true },
      { ...q, hidden: true, answer: true },
    )[0]!.name,
    "select",
  );
  assert.deepEqual(
    quizAudioCues({ ...q, answer: true }, { ...q, answer: true }),
    [],
  );
  assert.equal(
    quizAudioCues({ ...q, answer: true }, { ...q, cursor: 1 })[0]!.name,
    "next",
  );
  const d = { id: "match", answers: 0, completed: false, perfect: false };
  assert.equal(duelAudioCues(d, { ...d, answers: 1 })[0]!.name, "select");
  assert.deepEqual(
    duelAudioCues({ ...d, answers: 1 }, { ...d, answers: 1 }),
    [],
  );
  assert.deepEqual(duelAudioCues(null, { ...d, completed: true }), []);
  assert.equal(
    duelAudioCues(d, { ...d, completed: true, perfect: true })[0]!.name,
    "perfect",
  );
  const live: LiveAudioState = {
    id: "room",
    position: 1,
    phase: "answer",
    state: "playing",
    reviewed: false,
    correct: null,
    perfect: false,
  };
  assert.deepEqual(liveAudioCues(live, { ...live }), []); // local zero timer/pending answer has no authority
  const revealing = { ...live, phase: "reveal" };
  const reviewed = { ...revealing, reviewed: true, correct: true };
  assert.deepEqual(liveAudioCues(live, revealing), []);
  assert.equal(liveAudioCues(revealing, reviewed)[0]!.name, "correct");
  assert.deepEqual(liveAudioCues(reviewed, { ...reviewed }), []);
  for (const [correct, name] of [
    [true, "correct"],
    [false, "wrong"],
    [null, "timeout"],
  ] as const)
    assert.equal(
      liveAudioCues(live, {
        ...live,
        phase: "reveal",
        reviewed: true,
        correct,
      })[0]!.name,
      name,
    );
  assert.deepEqual(
    liveAudioCues(null, { ...live, phase: "completed", state: "completed" }),
    [],
  );
  assert.equal(
    liveAudioCues(live, {
      ...live,
      state: "completed",
      phase: "completed",
      perfect: true,
    })[0]!.name,
    "perfect",
  );
});
test("original audio files match reproducible manifest, stay bounded and contain no clipping", () => {
  const manifest = JSON.parse(
    readFileSync(
      new URL("../assets/audio/manifest.json", import.meta.url),
      "utf8",
    ),
  );
  assert.equal(Object.keys(manifest.files).length, 11);
  let total = 0;
  for (const [name, item] of Object.entries(manifest.files) as [
    string,
    { sha256: string; duration: number },
  ][]) {
    const wav = readFileSync(
      new URL(`../assets/audio/${name}.wav`, import.meta.url),
    );
    total += wav.length;
    assert.equal(createHash("sha256").update(wav).digest("hex"), item.sha256);
    assert.equal(wav.toString("ascii", 0, 4), "RIFF");
    assert.equal(wav.readUInt16LE(22), 1);
    assert.equal(wav.readUInt32LE(24), 24000);
    assert.equal(wav.readUInt16LE(34), 16);
    let peak = 0;
    for (let i = 44; i < wav.length; i += 2)
      peak = Math.max(peak, Math.abs(wav.readInt16LE(i)) / 32767);
    assert(peak <= 0.561);
    if (name !== "music") assert(item.duration < 2);
    if (name === "music") {
      // Adjacent PCM samples need not be identical: compare first derivatives
      // across the join to its neighbors, detecting a click rather than a tone.
      const first = wav.readInt16LE(44),
        second = wav.readInt16LE(46);
      const last = wav.readInt16LE(wav.length - 2),
        penultimate = wav.readInt16LE(wav.length - 4);
      const join = first - last;
      assert(
        Math.abs(join - (last - penultimate)) < 80 &&
          Math.abs(second - first - join) < 80,
        "continuous loop waveform and slope",
      );
    }
  }
  assert(total < 2_000_000);
});
