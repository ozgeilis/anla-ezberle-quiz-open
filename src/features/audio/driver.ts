// Native iOS/Android. Web resolves driver.web.ts for Safari-compatible gain control.
import type { AudioPlayer } from "expo-audio";
import { soundAssets } from "./assets";
import { wrapNativePlayer } from "./native-player";
import type { SoundName } from "./catalog";
import type { SoundDriver, SoundPlayer } from "./driver.types";
export function createSoundDriver(): SoundDriver {
  const players = new Map<SoundName, SoundPlayer>();
  let disposed = false;
  let api: typeof import("expo-audio") | null = null;
  const player = (name: SoundName) => {
    if (disposed || !api) throw Error("Audio unavailable");
    const old = players.get(name);
    if (old) return old;
    const audio: AudioPlayer = api.createAudioPlayer(soundAssets[name], {
      keepAudioSessionActive: false,
      updateInterval: 500,
    });
    audio.loop = false;
    const wrapper = wrapNativePlayer(audio);
    players.set(name, wrapper);
    return wrapper;
  };
  return {
    async prepare() {
      // Old development clients may not contain ExpoAudio yet: fail softly.
      const loaded = await import("expo-audio");
      if (disposed) return;
      api = loaded;
      await api.setAudioModeAsync({
        playsInSilentMode: false,
        allowsRecording: false,
        allowsBackgroundRecording: false,
        shouldPlayInBackground: false,
        interruptionMode: "mixWithOthers",
      });
      if (disposed) return;
      for (const name of [
        "tick",
        "tap",
        "select",
        "correct",
        "wrong",
        "next",
        "timeout",
      ] as const)
        player(name);
    },
    unlock() {},
    player,
    dispose() {
      disposed = true;
      for (const p of players.values()) {
        try {
          p.release();
        } catch {}
      }
      players.clear();
    },
  };
}
