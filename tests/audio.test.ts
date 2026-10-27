import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { SoundController } from "../src/features/audio/controller";
import type {
  SoundDriver,
  SoundPlayer,
} from "../src/features/audio/driver.types";
import { effectDuration, type SoundName } from "../src/features/audio/catalog";
import { wrapNativePlayer } from "../src/features/audio/native-player";
import {
  defaultSoundPreferences as defaults,
  parseSoundPreferences,
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
          assert.equal(
            [...players.entries()].filter(([, p]) => p.playing).length,
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
  assert.equal("musicEnabled" in defaults, false);
  assert.equal(defaults.effectsVolume, 0.5);
  assert.equal("musicVolume" in defaults, false);
  assert.deepEqual(
    parseSoundPreferences(
      JSON.stringify({
        version: 1,
        effectsEnabled: false,
        effectsVolume: 0.3,
        musicEnabled: true,
        musicVolume: 0.7,
      }),
    ),
    { version: 2, effectsEnabled: false, effectsVolume: 0.3 },
  );
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
    JSON.stringify({ ...defaults, effectsEnabled: "true" }),
    JSON.stringify({ ...defaults, version: 3 }),
  ])
    assert.throws(() => parseSoundPreferences(raw));
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
test("no music voice exists; ticks share effect mute, priority and failure isolation", async () => {
  const h = harness(true);
  await h.engine.prepare();
  h.engine.configure(defaults);
  assert.equal(h.engine.play("tick"), false);
  h.engine.activate();
  assert(h.engine.play("tick"));
  h.clock.advance(100);
  assert(h.engine.play("correct", "answer"));
  assert.equal(h.engine.play("tick"), false);
  h.engine.configure({ ...defaults, effectsEnabled: false });
  assert.equal(h.engine.play("tick"), false);
  h.engine.configure(defaults);
  h.fail();
  assert.doesNotThrow(() => h.engine.play("tick"));
  h.engine.suspendPreferences();
  assert.equal(h.engine.play("tap"), false);
  h.engine.dispose();
  assert.equal(h.clock.jobs.size, 0);
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
test("tick keeps the same audible gain when preferences change and stops immediately on mute", async () => {
  const h = harness();
  await h.engine.prepare();
  h.engine.configure(defaults);
  h.engine.play("tick");
  assert.equal(h.players.get("tick")!.volume, 0.4);
  h.engine.configure({ ...defaults, effectsVolume: 0.6 });
  assert.equal(h.players.get("tick")!.volume, 0.48);
  h.engine.configure({ ...defaults, effectsEnabled: false });
  assert.equal(h.players.get("tick")!.playing, false);
  assert.equal(h.clock.jobs.size, 0);
  h.engine.dispose();
});
test("native first cue plays without a seek and cancelled asynchronous replays stay silent", async () => {
  let plays = 0,
    seeks = 0,
    removes = 0;
  let finishSeek = () => {};
  const native = {
    volume: 0.4,
    playing: false,
    currentTime: 0,
    play() {
      plays++;
    },
    pause() {},
    remove() {
      removes++;
    },
    seekTo() {
      seeks++;
      return new Promise<void>((resolve) => {
        finishSeek = resolve;
      });
    },
  };
  const player = wrapNativePlayer(native);
  player.play(true);
  assert.equal(plays, 1);
  assert.equal(seeks, 0);
  native.currentTime = 0.12;
  player.play(true);
  assert.equal(seeks, 1);
  player.pause();
  finishSeek();
  await Promise.resolve();
  assert.equal(plays, 1, "mute/background pause cancels a late seek");
  player.play(true);
  finishSeek();
  await Promise.resolve();
  assert.equal(plays, 2, "a valid replay still rewinds and plays");
  player.play(true);
  player.release();
  finishSeek();
  await Promise.resolve();
  player.play(true);
  player.release();
  assert.equal(plays, 2);
  assert.equal(removes, 1);
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
  assert.equal("music" in manifest.files, false);
  assert(manifest.files.tick.duration <= 0.15, "tick remains a short impulse");
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
    let squares = 0;
    for (let i = 44; i < wav.length; i += 2) {
      const sample = wav.readInt16LE(i) / 32767;
      peak = Math.max(peak, Math.abs(sample));
      squares += sample * sample;
    }
    assert(peak <= 0.561);
    assert.equal(item.duration * 1000, effectDuration[name as SoundName]);
    if (name === "tick") {
      assert(peak >= 0.49, "tick must not regress to the quiet source asset");
      assert(Math.sqrt(squares / ((wav.length - 44) / 2)) >= 0.1);
    }
    assert(item.duration < 2);
  }
  assert(total < 2_000_000);
});
