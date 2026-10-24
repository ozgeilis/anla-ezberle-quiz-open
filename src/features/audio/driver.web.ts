// expo-audio's HTMLMediaElement.volume is ignored by iOS Safari. A Web Audio
// gain graph implements the SAME central controller contract without that limitation.
import { Asset } from "expo-asset";
import { soundAssets } from "./assets";
import type { SoundName } from "./catalog";
import type { SoundDriver, SoundPlayer } from "./driver.types";
export function createSoundDriver(): SoundDriver {
  let ctx: AudioContext | null = null,
    unlocking: Promise<void> | null = null,
    disposed = false;
  const abort = new AbortController();
  const buffers = new Map<SoundName, AudioBuffer>(),
    players = new Map<SoundName, SoundPlayer>();
  return {
    async prepare() {
      const AudioCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtor) throw Error("Web Audio unavailable");
      ctx = new AudioCtor();
      const context = ctx;
      const tasks = Object.entries(soundAssets).map(async ([key, source]) => {
        const r = await fetch(Asset.fromModule(source).uri, {
          signal: abort.signal,
        });
        if (!r.ok) throw Error("Audio asset unavailable");
        const buffer = await context.decodeAudioData(await r.arrayBuffer());
        if (!disposed) buffers.set(key as SoundName, buffer);
      });
      // A missing file never prevents other effects or the game from working.
      await Promise.allSettled(tasks);
      if (!buffers.size && !disposed) throw Error("Audio assets unavailable");
    },
    unlock() {
      if (ctx && ctx.state !== "closed") {
        unlocking = ctx.resume();
        return unlocking;
      }
    },
    player(name) {
      const existing = players.get(name);
      if (existing) return existing;
      if (!ctx || disposed) throw Error("Audio not ready");
      const context = ctx,
        gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
      let source: AudioBufferSourceNode | null = null,
        revision = 0,
        offset = 0,
        started = 0;
      const pause = () => {
        revision++;
        if (!source) return;
        offset += Math.max(0, context.currentTime - started);
        const old = source;
        source = null;
        old.onended = null;
        old.stop();
        old.disconnect();
      };
      const p: SoundPlayer = {
        get volume() {
          return gain.gain.value;
        },
        set volume(v) {
          gain.gain.cancelScheduledValues(context.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
          gain.gain.linearRampToValueAtTime(v, context.currentTime + 0.035);
        },
        get playing() {
          return !!source && context.state === "running";
        },
        play(restart = false) {
          const buffer = buffers.get(name);
          if (!buffer || disposed || context.state === "closed") return;
          if (restart) {
            pause();
            offset = 0;
          }
          const request = ++revision;
          const start = () => {
            if (
              disposed ||
              request !== revision ||
              source ||
              context.state !== "running"
            )
              return;
            const node = context.createBufferSource();
            source = node;
            node.buffer = buffer;
            node.loop = false;
            node.connect(gain);
            started = context.currentTime;
            node.onended = () => {
              if (source === node) {
                source = null;
                offset = 0;
              }
              node.disconnect();
            };
            node.start(0, offset % buffer.duration);
          };
          // resume() completes asynchronously on Chromium's first gesture. Keep
          // that gesture's cue, but cancel it on navigation, mute or disposal.
          if (context.state === "running") start();
          else if (unlocking) void unlocking.then(start).catch(() => {});
        },
        pause,
        release() {
          pause();
          gain.disconnect();
        },
      };
      players.set(name, p);
      return p;
    },
    dispose() {
      disposed = true;
      abort.abort();
      for (const p of players.values()) {
        try {
          p.release();
        } catch {}
      }
      players.clear();
      buffers.clear();
      if (ctx) void ctx.close().catch(() => {});
      ctx = null;
    },
  };
}
