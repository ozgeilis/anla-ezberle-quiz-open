// Startup readiness only: a cold worker must reach its unauthenticated 401 gate.
// Never accepts 503 as an integration-test pass and never prints credentials.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";
const cfg = JSON.parse(
  await readFile("/tmp/anla-online500-20261019/local-status.json", "utf8"),
);
assert.equal(cfg.API_URL, "http://127.0.0.1:55431");
let ready = false;
for (let n = 0; n < 60; n++) {
  try {
    const r = await fetch(cfg.API_URL + "/functions/v1/online-duel", {
      method: "POST",
      headers: {
        apikey: cfg.PUBLISHABLE_KEY,
        "Content-Type": "application/json",
      },
      body: '{"operation":"leaderboard","body":{}}',
      signal: AbortSignal.timeout(2000),
    });
    if (r.status === 401) {
      ready = true;
      break;
    }
    assert(
      [502, 503, 504].includes(r.status),
      "Unexpected worker readiness response",
    );
  } catch (e) {
    if (e instanceof assert.AssertionError) throw e;
  }
  await delay(1000);
}
assert(
  ready,
  "Local Edge worker did not become ready; integration tests were not skipped",
);
console.log("Local Edge worker ready at the 401 authentication gate.");
