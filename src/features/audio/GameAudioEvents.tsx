import { useEffect, useRef } from "react";
import { useGame } from "../../storage/GameProvider";
import { progress } from "../../domain/scoring/progress";
import { usePlayerIdentity } from "../online/SocialIdentityProvider";
import { useOnlineAuth } from "../online/OnlineProvider";
import { useSound } from "./SoundProvider";
export function GameAudioEvents() {
  const { data, ready, result } = useGame(),
    { play } = useSound();
  const { self } = usePlayerIdentity(),
    { session } = useOnlineAuth();
  const local = useRef<number | null>(null),
    online = useRef<{ actor?: string; level?: number }>({});
  useEffect(() => {
    if (!ready) return;
    const level = progress(data.games).level,
      old = local.current;
    local.current = level;
    if (
      old !== null &&
      level > old &&
      result &&
      data.games.some((g) => g.id === result.id)
    )
      play("levelUp", `level:${result.id}`);
  }, [data.games, ready, result, play]);
  const actor = session?.user.id,
    level = self?.player?.level;
  useEffect(() => {
    const previous = online.current;
    online.current = { actor, level };
    if (
      actor &&
      previous.actor === actor &&
      level !== undefined &&
      previous.level !== undefined &&
      level > previous.level
    )
      play("levelUp", `online-level:${actor}:${level}`);
  }, [actor, level, play]);
  return null;
}
