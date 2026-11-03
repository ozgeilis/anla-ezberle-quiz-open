import test from "node:test";
import assert from "node:assert/strict";
import { createModalDismissalGate } from "../src/features/ads/modalDismissal";

test("native dismissal is required before an interstitial may present", async () => {
  const gate = createModalDismissalGate();
  let resolved = false;
  const result = gate.wait().then((dismissed) => {
    resolved = true;
    return dismissed;
  });
  // React hiding the modal or a storage write completing is not onDismiss.
  await Promise.resolve();
  assert.equal(resolved, false);
  gate.dismissed();
  assert.equal(await result, true);
  gate.dismissed(); // Duplicate native events have no remaining waiter.
});

test("navigation, invalidation or unmount can cancel presentation safely", async () => {
  const gate = createModalDismissalGate();
  const result = gate.wait();
  gate.cancel();
  gate.dismissed();
  assert.equal(await result, false);
});

test("missing native callback skips the ad instead of blocking navigation", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const gate = createModalDismissalGate(5_000);
  const result = gate.wait();
  t.mock.timers.tick(5_000);
  assert.equal(await result, false);
});

test("replacing a waiter cancels it and cannot leave a stale timeout", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const gate = createModalDismissalGate(5_000);
  const first = gate.wait();
  t.mock.timers.tick(4_000);
  const second = gate.wait();
  assert.equal(await first, false);
  t.mock.timers.tick(1_000);
  let resolved = false;
  void second.then(() => {
    resolved = true;
  });
  await Promise.resolve();
  assert.equal(resolved, false);
  gate.dismissed();
  assert.equal(await second, true);
});
