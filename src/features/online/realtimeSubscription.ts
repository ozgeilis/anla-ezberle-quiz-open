import type { SupabaseClient } from "@supabase/supabase-js";

export type RealtimeOwner = Pick<
  SupabaseClient,
  "channel" | "getChannels" | "removeChannel"
>;
type Channel = ReturnType<RealtimeOwner["channel"]>;
const removals = new WeakMap<RealtimeOwner, Map<string, Promise<void>>>();

/** Keep a topic's asynchronous teardown ahead of its next React effect. */
export function subscribeRealtime(
  client: RealtimeOwner,
  topic: string,
  options: Parameters<RealtimeOwner["channel"]>[1],
  configure: (channel: Channel) => void,
  unavailable: () => void,
): () => void {
  let closed = false;
  let owned: Channel | undefined;
  let pending = removals.get(client);
  if (!pending) {
    pending = new Map();
    removals.set(client, pending);
  }
  const queue = pending;
  const release = () => {
    const channel = owned;
    owned = undefined;
    if (!channel) return;
    const removed = Promise.resolve()
      .then(() => client.removeChannel(channel))
      .then(
        () => {},
        () => {},
      );
    queue.set(topic, removed);
    void removed.then(() => {
      if (queue.get(topic) === removed) queue.delete(topic);
    });
  };
  void (async () => {
    await queue.get(topic);
    if (closed) return;
    try {
      // A failed teardown or another owner must degrade to polling, not reuse
      // a subscribed channel: current Realtime rejects adding callbacks to it.
      if (client.getChannels().some((c) => c.topic === `realtime:${topic}`)) {
        unavailable();
        return;
      }
      owned = client.channel(topic, options);
      configure(owned);
    } catch {
      release();
      if (!closed) unavailable();
    }
  })();
  return () => {
    closed = true;
    release();
  };
}
