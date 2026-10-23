import { useEffect, useRef } from "react";
import { useSound } from "./SoundProvider";
import type { SoundCue } from "./events";
export function useAudioObservation<T>(
  next: T | null,
  cues: (old: T | null, next: T | null) => SoundCue[],
) {
  const previous = useRef<T | null>(null),
    { play } = useSound();
  useEffect(() => {
    const events = cues(previous.current, next);
    previous.current = next;
    for (const event of events) play(event.name, event.id);
  }, [next, cues, play]);
}
