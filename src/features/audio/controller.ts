import {
  effectDuration,
  effectPriority,
  isCelebration,
  type SoundEffect,
} from "./catalog";
import type { SoundDriver, SoundPlayer } from "./driver.types";
import { defaultSoundPreferences, type SoundPreferences } from "./preferences";
interface Clock {
  now(): number;
  set(fn: () => void, ms: number): unknown;
  clear(id: unknown): void;
}
const clock: Clock = {
  now: Date.now,
  set: (fn, ms) => setTimeout(fn, ms),
  clear: (id) => clearTimeout(id as ReturnType<typeof setTimeout>),
};
interface Cue {
  name: SoundEffect;
  id?: string;
}
// One short effect voice. No audio timer affects game time or state.
export class SoundController {
  private preferences = { ...defaultSoundPreferences };
  private prefsReady = false;
  private backendReady = false;
  private active = true;
  private unlocked: boolean;
  private disposed = false;
  private route = "";
  private seen = new Set<string>();
  private queue: Cue[] = [];
  private current: { cue: Cue; player: SoundPlayer } | null = null;
  private effectTimer: unknown = null;
  private lastUiAt = -Infinity;
  constructor(
    private driver: SoundDriver,
    web = false,
    private time: Clock = clock,
  ) {
    this.unlocked = !web;
  }
  async prepare() {
    await this.driver.prepare();
    if (this.disposed) return;
    this.backendReady = true;
    this.warmQuiz();
  }
  configure(preferences: SoundPreferences) {
    this.preferences = { ...preferences };
    this.prefsReady = true;
    if (!preferences.effectsEnabled || preferences.effectsVolume === 0)
      this.stopEffects();
    else if (this.current)
      this.safe(() => {
        this.current!.player.volume = preferences.effectsVolume * 0.8;
      });
    this.warmQuiz();
  }
  suspendPreferences() {
    this.prefsReady = false;
    this.stopEffects();
  }
  activate() {
    if (this.disposed) return;
    this.unlocked = true;
    try {
      const resumed = this.driver.unlock();
      if (resumed) void resumed.catch(() => {});
    } catch {
      /* Unsupported audio never interrupts a gesture or game. */
    }
  }
  setActive(active: boolean) {
    this.active = active;
    if (!active) {
      this.stopEffects();
    }
  }
  setRoute(route: string) {
    if (route === this.route) return;
    // Saved game rewards legitimately travel from quiz to its results page.
    const rewards =
      route === "/results"
        ? this.queue.filter((c) => isCelebration(c.name))
        : [];
    const keep =
      route === "/results" &&
      this.current &&
      isCelebration(this.current.cue.name);
    if (!keep) this.stopEffects();
    this.queue = rewards;
    this.route = route;
    this.warmQuiz();
    this.drain();
  }
  play(name: SoundEffect, id?: string): boolean {
    if (this.disposed) return false;
    // Consume muted/hidden events too; unmuting must never replay old rewards.
    if (id) {
      if (this.seen.has(id)) return false;
      this.seen.add(id);
      if (this.seen.size > 512)
        this.seen.delete(this.seen.values().next().value!);
    }
    if (!this.allowed()) return false;
    const priority = effectPriority(name),
      cue = { name, id };
    if (priority === 1 && this.time.now() - this.lastUiAt < 90) return false;
    if (this.current) {
      if (isCelebration(name)) {
        if (this.queue.length < 3) {
          this.queue.push(cue);
          return true;
        }
        return false;
      }
      if (priority <= effectPriority(this.current.cue.name)) return false;
      this.stopEffects();
    }
    if (priority === 1) this.lastUiAt = this.time.now();
    return this.start(cue);
  }
  private warmQuiz() {
    if (
      !this.backendReady ||
      !this.prefsReady ||
      !this.preferences.effectsEnabled ||
      this.disposed ||
      !["/quiz", "/duel/play", "/live", "/online"].includes(this.route)
    )
      return;
    for (const name of Object.keys(effectDuration) as SoundEffect[])
      this.safe(() => {
        this.driver.player(name);
      });
  }
  private allowed() {
    return (
      this.backendReady &&
      this.prefsReady &&
      this.active &&
      this.unlocked &&
      this.preferences.effectsEnabled &&
      this.preferences.effectsVolume > 0 &&
      !this.disposed
    );
  }
  private safe(fn: () => void) {
    try {
      fn();
    } catch {
      /* No audio error escapes into gameplay. */
    }
  }
  private start(cue: Cue) {
    try {
      const player = this.driver.player(cue.name);
      player.volume =
        this.preferences.effectsVolume * (cue.name === "tick" ? 0.3 : 0.8);
      player.play(true);
      this.current = { cue, player };
      this.effectTimer = this.time.set(() => {
        this.effectTimer = null;
        this.safe(() => player.pause());
        this.current = null;
        this.drain();
      }, effectDuration[cue.name] + 30);
      return true;
    } catch {
      return false;
    }
  }
  private drain() {
    if (this.current || !this.allowed()) return;
    const cue = this.queue.shift();
    if (cue && !this.start(cue)) this.drain();
  }
  private stopEffects() {
    if (this.effectTimer !== null) this.time.clear(this.effectTimer);
    this.effectTimer = null;
    if (this.current) this.safe(() => this.current!.player.pause());
    this.current = null;
    this.queue = [];
  }
  dispose() {
    this.disposed = true;
    this.stopEffects();
    this.safe(() => this.driver.dispose());
    this.seen.clear();
  }
}
