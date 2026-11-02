import { useEffect, useState } from "react";
import { onlineClient } from "../client";
// One short-lived capability request per actor, shared by profile cards.
const cache = new Map<string, { until: number; value: Promise<boolean> }>();
function capability(actor: string) {
  const old = cache.get(actor);
  if (old && old.until > Date.now()) return old.value;
  cache.clear();
  const client = onlineClient();
  const value = client
    ? Promise.resolve(client.rpc("player_safety_capabilities"))
        .then(({ data, error }) => !error && data?.enabled === true)
        .catch(() => false)
    : Promise.resolve(false);
  cache.set(actor, { until: Date.now() + 30000, value });
  return value;
}
export function useSafetyReady(actor: string | undefined) {
  const [state, setState] = useState<{ actor?: string; ready: boolean }>();
  useEffect(() => {
    let alive = true;
    if (actor)
      void capability(actor).then((ready) => {
        if (alive) setState({ actor, ready });
      });
    return () => {
      alive = false;
    };
  }, [actor]);
  return state?.actor === actor && state?.ready === true;
}
