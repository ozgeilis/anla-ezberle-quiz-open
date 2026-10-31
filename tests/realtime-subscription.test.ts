import assert from "node:assert/strict";
import { test } from "node:test";
import {
  subscribeRealtime,
  type RealtimeOwner,
} from "../src/features/online/realtimeSubscription";

class TestChannel {
  joined = false;
  constructor(readonly topic: string) {}
  on() {
    if (this.joined) throw Error("cannot add callbacks after subscribe()");
    return this;
  }
  subscribe() {
    this.joined = true;
    return this;
  }
}
function fixture() {
  let channels: TestChannel[] = [];
  const leaving: { resolve(): void; reject(): void }[] = [];
  const implementation = {
    getChannels: () => channels,
    channel(topic: string) {
      const name = `realtime:${topic}`;
      const existing = channels.find((c) => c.topic === name);
      if (existing) return existing;
      const channel = new TestChannel(name);
      channels.push(channel);
      return channel;
    },
    removeChannel(channel: TestChannel) {
      return new Promise<string>((resolve, reject) => {
        leaving.push({
          resolve() {
            channels = channels.filter((c) => c !== channel);
            resolve("ok");
          },
          reject: () => reject(Error("transport unavailable")),
        });
      });
    },
  };
  // Model the SDK's topic deduplication and callback lock, without a network.
  const client = implementation as unknown as RealtimeOwner;
  let configured = 0;
  let unavailable = 0;
  const open = (topic = "player-inbox:test") =>
    subscribeRealtime(
      client,
      topic,
      undefined,
      (channel) => {
        configured++;
        channel
          .on("postgres_changes", { event: "*", schema: "public" }, () => {})
          .subscribe();
      },
      () => {
        unavailable++;
      },
    );
  return {
    open,
    implementation,
    leaving,
    removal(index: number) {
      const item = leaving[index];
      assert(item, "Expected a pending channel removal");
      return item;
    },
    counts: () => ({ configured, unavailable }),
  };
}
const flush = () => new Promise<void>((resolve) => setImmediate(resolve));

test("effect remount waits for old topic teardown instead of mutating its joined channel", async () => {
  const f = fixture();
  const stop = f.open();
  await flush();
  const old = f.implementation.getChannels()[0];
  stop();
  const stopNext = f.open();
  await flush();
  assert.deepEqual(f.counts(), { configured: 1, unavailable: 0 });
  f.removal(0).resolve();
  await flush();
  assert.deepEqual(f.counts(), { configured: 2, unavailable: 0 });
  assert.notEqual(f.implementation.getChannels()[0], old);
  stopNext();
  await flush();
  f.removal(1).resolve();
  await flush();
  assert.equal(f.implementation.getChannels().length, 0);
});

test("cancelled remount does not subscribe later when delayed teardown completes", async () => {
  const f = fixture();
  const stop = f.open();
  await flush();
  stop();
  const cancelWaiting = f.open();
  cancelWaiting();
  await flush();
  f.removal(0).resolve();
  await flush();
  assert.deepEqual(f.counts(), { configured: 1, unavailable: 0 });
  assert.equal(f.implementation.getChannels().length, 0);
});

test("failed transport cleanup falls back without reusing a subscribed channel or rejecting", async () => {
  const f = fixture();
  const stop = f.open();
  await flush();
  stop();
  const stopNext = f.open();
  await flush();
  f.removal(0).reject();
  await flush();
  assert.deepEqual(f.counts(), { configured: 1, unavailable: 1 });
  assert.equal(f.implementation.getChannels().length, 1);
  stopNext();
  assert.equal(f.leaving.length, 1);
});

test("an existing topic owned elsewhere is neither reconfigured nor removed", async () => {
  const f = fixture();
  const existing = f.implementation.channel("player-inbox:test").subscribe();
  const stop = f.open();
  await flush();
  assert.deepEqual(f.counts(), { configured: 0, unavailable: 1 });
  stop();
  assert.deepEqual(f.implementation.getChannels(), [existing]);
  assert.equal(f.leaving.length, 0);
});

test("account/room topics remain exact and independent while another topic closes", async () => {
  const f = fixture();
  const stopA = f.open("player-inbox:account-a");
  await flush();
  stopA();
  const stopB = f.open("live:room-b");
  await flush();
  assert.deepEqual(f.counts(), { configured: 2, unavailable: 0 });
  assert(
    f.implementation
      .getChannels()
      .some((c) => c.topic === "realtime:live:room-b"),
  );
  f.removal(0).resolve();
  await flush();
  assert.equal(f.implementation.getChannels().length, 1);
  stopB();
  await flush();
  f.removal(1).resolve();
  await flush();
});
