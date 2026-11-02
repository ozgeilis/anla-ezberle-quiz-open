// Actual local GoTrue + Edge + PostgREST integration acceptance.
// Credentials stay in owner-only files outside the repository.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const cfg = JSON.parse(readFileSync(process.env.SAFETY_STACK_FILE ?? ""));
const { users } = JSON.parse(
  readFileSync(process.env.SAFETY_FIXTURES_FILE ?? ""),
);
assert.equal(cfg.API_URL, "http://127.0.0.1:18571");
const command = async (user, operation, body = {}, status = 200) => {
  const r = await fetch(cfg.API_URL + "/functions/v1/online-duel", {
    method: "POST",
    headers: {
      apikey: cfg.PUBLISHABLE_KEY,
      Authorization: `Bearer ${user.session.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ operation, body }),
  });
  const d = await r.json();
  assert.equal(
    r.status,
    status,
    `operation ${operation}: ${d.error ?? "unexpected status"}`,
  );
  return d;
};
const [a, b, c] = users;
// Fixtures are three disposable authenticated local users. Provision their
// friendship before the run; refresh sessions if expired. Never hosted accounts.
assert.equal((await command(a, "friends")).friendships.length, 1);
await command(a, "player_report", {
  playerId: b.id,
  reason: "spam",
  details: "Local synthetic report",
});
await command(a, "player_report", { playerId: b.id, reason: "spam" });
await command(
  a,
  "player_report",
  { playerId: b.id, reason: "spam", reporter: c.id },
  400,
);
await command(a, "player_block", { playerId: b.id });
assert.equal((await command(a, "friends")).friendships.length, 0);
await command(b, "friend_send", { playerId: a.id }, 403);
await command(
  b,
  "challenge_send",
  { playerId: a.id, requestId: crypto.randomUUID() },
  403,
);
assert.equal(
  (await command(b, "player_search", { query: "safety_native_1" })).players
    .length,
  0,
);
await command(c, "player_unblock", { playerId: b.id });
await command(b, "friend_send", { playerId: a.id }, 403);
assert.equal((await command(a, "blocked_players")).players.length, 1);
assert.equal((await command(b, "blocked_players")).players.length, 0);
await command(a, "player_unblock", { playerId: b.id });
await command(b, "friend_send", { playerId: a.id });
await command(b, "profile", { name: "s.i.k.t.i.r" }, 400);
const unauth = await fetch(cfg.API_URL + "/functions/v1/online-duel", {
  method: "POST",
  headers: { apikey: cfg.PUBLISHABLE_KEY },
  body: JSON.stringify({ operation: "blocked_players" }),
});
assert.equal(unauth.status, 401);
const rpc = await fetch(cfg.API_URL + "/rest/v1/rpc/player_safety_command", {
  method: "POST",
  headers: {
    apikey: cfg.PUBLISHABLE_KEY,
    Authorization: `Bearer ${b.session.access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    actor: a.id,
    operation: "player_block",
    body: { playerId: c.id },
  }),
});
assert([401, 403, 404].includes(rpc.status));
const report = await fetch(cfg.API_URL + "/rest/v1/rpc/moderation_review", {
  method: "POST",
  headers: {
    apikey: cfg.PUBLISHABLE_KEY,
    Authorization: `Bearer ${b.session.access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ operation: "queue" }),
});
assert.equal(report.status, 403);
console.log(
  "PASS actual local GoTrue JWT + Deno online-duel + PostgREST: report/idempotency, forged fields denied, reciprocal block/new invites, unblock, profanity, unauthorized API/RPC/moderator denial. No hosted traffic.",
);
