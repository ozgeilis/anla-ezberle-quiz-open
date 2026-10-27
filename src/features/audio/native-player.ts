import type { AudioPlayer } from "expo-audio";
import type { SoundPlayer } from "./driver.types";

type NativePlayer = Pick<
  AudioPlayer,
  "volume" | "playing" | "currentTime" | "seekTo" | "play" | "pause" | "remove"
>;

export function wrapNativePlayer(audio: NativePlayer): SoundPlayer {
  let released = false;
  let revision = 0;
  return {
    get volume() {
      return audio.volume;
    },
    set volume(value) {
      audio.volume = value;
    },
    get playing() {
      return audio.playing;
    },
    play(restart = false) {
      if (released) return;
      const id = ++revision;
      // The first short cue is already at its head: avoid a needless async bridge seek.
      if (!restart || (audio.currentTime === 0 && !audio.playing)) {
        audio.play();
        return;
      }
      void audio
        .seekTo(0)
        .then(() => {
          if (!released && id === revision) audio.play();
        })
        .catch(() => {});
    },
    pause() {
      ++revision;
      if (!released) audio.pause();
    },
    release() {
      if (released) return;
      released = true;
      ++revision;
      audio.remove();
    },
  };
}
