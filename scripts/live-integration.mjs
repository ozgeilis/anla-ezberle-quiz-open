// Auth + Edge + PostgreSQL + private Realtime acceptance. No browser automation.
// Secrets and generated question SQL must stay outside the Expo project.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, join } from "node:path";
import { homedir } from "node:os";
import { execFileSync } from "node:child_process";
import { randomUUID, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i < 0 ? undefined : process.argv[i + 1];
};
const remote = process.argv.includes("--closed-dev"),
  ref = "mqyuihiobkomjfipxehj";
const privateDir = join(homedir(), ".local/share/anla-quiz-dev/live-20261021");
await mkdir(privateDir, { recursive: true, mode: 0o700 });
let url, key, service;
if (remote) {
  assert.equal(
    arg("--project-ref"),
    ref,
    "Explicit Frankfurt closed-dev ref required",
  );
  url = `https://${ref}.supabase.co`;
  const env = await readFile(".env", "utf8").catch(() =>
    readFile(".env.local", "utf8"),
  );
  key = env.match(
    /^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=["']?([^\s"']+)/m,
  )?.[1];
  assert(key?.startsWith("sb_publishable_"), "Publishable key required");
} else {
  const cfg = JSON.parse(
    await readFile(
      arg("--status") || "/tmp/anla-quiz-phase3b/local-status.json",
      "utf8",
    ),
  );
  assert.equal(cfg.API_URL, "http://127.0.0.1:55431");
  url = cfg.API_URL;
  key = cfg.PUBLISHABLE_KEY;
  service = cfg.SERVICE_ROLE_KEY;
}
const cli = process.env.QUIZ_SUPABASE_BIN || "/tmp/anla-quiz-phase3b/supabase";
function sql(query) {
  try {
    if (remote) {
      const data = JSON.parse(
        execFileSync(
          cli,
          [
            "db",
            "query",
            "--linked",
            "--project-ref",
            ref,
            "--output-format",
            "json",
            query,
          ],
          { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
        ),
      );
      return Object.values(data.rows?.[0] ?? {})[0];
    }
    return execFileSync(
      process.env.QUIZ_DOCKER_BIN || "docker",
      [
        "exec",
        "-i",
        "supabase_db_anla-ezberle-quiz-dev-local",
        "psql",
        "-U",
        "postgres",
        "-d",
        "postgres",
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
      ],
      { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
  } catch {
    throw new Error("Private SQL assertion failed; query and results withheld");
  }
}
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log("PASS " + name);
};
async function command(user, operation, body = {}, status = 200) {
  const r = await fetch(`${url}/functions/v1/online-duel`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${user.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ operation, body }),
  });
  const data = await r.json();
  if (r.status !== status)
    throw new Error(
      `${operation}: expected HTTP ${status}, received ${r.status} (${data.error ?? "response withheld"})`,
    );
  return data;
}
function hidden(r) {
  assert(
    !r.review && !r.history.length,
    "No keys or explanations before deadline",
  );
  assert(
    !/"(?:correctOptionId|explanation|correct_option|is_correct)"/.test(
      JSON.stringify(r),
    ),
    "Key disclosure",
  );
  assert(
    r.players.every((p) => p.score === null),
    "Partial scores hidden",
  );
}
const users = [];
let saved;
if (remote)
  saved = JSON.parse(
    await readFile(
      arg("--testers-file") ??
        join(homedir(), ".local/share/anla-quiz-dev", ref, "testers.json"),
      "utf8",
    ),
  );
for (const role of ["a", "b", "c"]) {
  let email, password;
  if (remote) {
    const u = saved.users.find((u) => u.role === role);
    assert(u);
    ({ email, password } = u);
  } else {
    email = `live-${Date.now()}-${role}@example.com`;
    password = randomBytes(24).toString("base64url") + "aA!4";
    const created = await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        apikey: service,
        Authorization: `Bearer ${service}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
    assert(created.ok, "Local test user creation failed");
    const u = await created.json();
    const enrolled = await fetch(
      `${url}/rest/v1/rpc/online_duel_enroll_test_user`,
      {
        method: "POST",
        headers: {
          apikey: service,
          Authorization: `Bearer ${service}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: u.id,
          display_name: `Canlı Test ${role.toUpperCase()}`,
        }),
      },
    );
    assert(enrolled.ok, "Local enrollment failed");
  }
  const login = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert(login.ok, "Test account login failed");
  const token = await login.json();
  const u = { role, id: token.user.id, jwt: token.access_token };
  users.push(u);
  const self = await command(u, "social_self");
  if (remote && !self.profile.username)
    throw new Error(
      "Pre-provisioned test username required; existing profile not changed",
    );
  if (!self.profile.username)
    await command(u, "social_profile", {
      name: `Canlı Test ${role.toUpperCase()}`,
      username: `live_${role}_${Date.now().toString(36)}`,
      avatar: role === "a" ? 0 : 1,
      discoverable: false,
    });
}
await writeFile(
  join(
    privateDir,
    remote ? "remote-live-sessions.json" : "local-live-sessions.json",
  ),
  JSON.stringify(users),
  { mode: 0o600 },
);
const [a, b, c] = users;
pass("three independent verified Auth sessions");
const options = await command(a, "room_options");
assert.equal(options.combinations.length, 264);
assert(
  options.combinations.some(
    (c) =>
      c.available &&
      c.topic === "mixed" &&
      c.level === "easy" &&
      c.count === 10,
  ),
);
pass("server catalog and exact independent-pool eligibility");
// Operator-only oracle: read once before any countdown. Never print or send the map to clients.
const privateKeys = sql(
  "select jsonb_object_agg(id,correct_option) from quiz_private.live_keys where dataset=(select dataset from quiz_private.live_config where singleton);",
);
const oracle =
  typeof privateKeys === "string" ? JSON.parse(privateKeys) : privateKeys;
const oracleDataset = sql(
  "select dataset from quiz_private.live_config where singleton;",
);
const expectedOracleCount = { "bank-v41": 600, "bank-v72": 1500, "bank-v73": 1500 }[
  oracleDataset
];
assert(
  oracle &&
    expectedOracleCount &&
    Object.keys(oracle).length === expectedOracleCount,
  "Complete private test oracle required",
);
const requestId = randomUUID();
let room = await command(a, "room_create", { requestId });
assert(/^[A-Z2-9]{6}$/.test(room.code));
assert(
  (await command(a, "room_create", { requestId })).id === room.id,
  "Create retry must preserve room",
);
const id = room.id,
  code = room.code;
await command(a, "room_start", { roomId: id }, 409);
await command(b, "room_join", { code });
await command(c, "room_get", { roomId: id }, 404);
await command(
  b,
  "room_settings",
  { roomId: id, topic: "mixed", level: "easy", count: 5 },
  403,
);
await command(
  a,
  "room_settings",
  { roomId: id, topic: "ramazan", level: "easy", count: 5 },
  409,
);
pass("private join, membership, host-only settings, closed seasonal content");
await command(a, "room_ready", { roomId: id, ready: true });
await command(b, "room_ready", { roomId: id, ready: true });
room = await command(a, "room_settings", {
  roomId: id,
  topic: "mixed",
  level: "easy",
  count: 5,
});
assert(
  room.players.every((p) => !p.ready),
  "Settings reset readiness",
);
await command(a, "room_settings", {
  roomId: id,
  topic: "mixed",
  level: "easy",
  count: 10,
});
pass("settings reset all ready flags");
const clients = [];
async function subscribe(user, roomId, allowed) {
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  clients.push(client);
  await client.realtime.setAuth(user.jwt);
  const channel = client.channel(`live:${roomId}`, {
    config: { private: true, presence: { key: user.id } },
  });
  let events = 0;
  channel.on("broadcast", { event: "changed" }, ({ payload }) => {
    assert(
      Object.keys(payload).every((k) =>
        ["roomId", "revision", "id"].includes(k),
      ),
      "Broadcast must carry only invalidation metadata",
    );
    if (payload.id)
      assert(
        /^[a-f0-9-]{36}$/.test(payload.id),
        "Platform message id must be opaque",
      );
    events++;
  });
  const state = await new Promise((resolve) => {
    const timer = setTimeout(() => resolve("TIMEOUT"), 12000);
    channel.subscribe((s) => {
      if (["SUBSCRIBED", "CHANNEL_ERROR", "TIMED_OUT"].includes(s)) {
        clearTimeout(timer);
        resolve(s);
      }
    });
  });
  assert(
    allowed ? state === "SUBSCRIBED" : state === "CHANNEL_ERROR",
    "Private Realtime authorization failed",
  );
  if (allowed)
    assert(
      (await channel.track({ connected: true })) === "ok",
      "Presence tracking failed",
    );
  return { client, channel, events: () => events };
}
try {
  const ca = await subscribe(a, id, true),
    cb = await subscribe(b, id, true);
  await subscribe(c, id, false);
  pass("private Realtime membership and Presence authorization");
  await command(a, "room_ready", { roomId: id, ready: true });
  await command(b, "room_ready", { roomId: id, ready: true });
  room = await command(a, "room_start", { roomId: id });
  assert(room.state === "countdown");
  assert(room.players.length === 2);
  pass("two ready players and server three-second countdown");
  if (process.argv.includes("--smoke")) {
    await command(a, "room_leave", { roomId: id });
    pass("host departure safely cancels room without rewards");
  } else {
    // A concurrent five-question room exercises equal ranking without extending the timed run.
    let tie = await command(b, "room_create", { requestId: randomUUID() });
    await command(a, "room_join", { code: tie.code });
    await command(b, "room_settings", {
      roomId: tie.id,
      topic: "mixed",
      level: "easy",
      count: 5,
    });
    await command(a, "room_ready", { roomId: tie.id, ready: true });
    await command(b, "room_ready", { roomId: tie.id, ready: true });
    tie = await command(b, "room_start", { roomId: tie.id });
    async function phase(user, rid, pos, ph) {
      for (let n = 0; n < 90; n++) {
        const v = await command(user, "room_get", { roomId: rid });
        if (v.position === pos && v.phase === ph) return v;
        await new Promise((r) => setTimeout(r, 1000));
      }
      throw new Error("Server phase did not advance");
    }
    const getKey = (r) => {
      const value = oracle[r.question.id];
      assert(typeof value === "string", "Missing private test oracle key");
      return value;
    };
    const tieQ = await phase(a, tie.id, 1, "answer");
    const tieKey = getKey(tieQ);
    await command(a, "room_answer", {
      roomId: tie.id,
      position: 1,
      optionId: tieKey,
      requestId: randomUUID(),
    });
    await command(b, "room_answer", {
      roomId: tie.id,
      position: 1,
      optionId: tieKey,
      requestId: randomUUID(),
    });
    let savedRequest;
    for (let pos = 1; pos <= 10; pos++) {
      room = await phase(a, id, pos, "answer");
      const other = await command(b, "room_get", { roomId: id });
      assert(
        JSON.stringify(room.question) === JSON.stringify(other.question),
        "Both players must see identical ordered options",
      );
      hidden(room);
      hidden(other);
      const keyValue = getKey(room),
        wrong = room.question.options.find((o) => o.id !== keyValue).id;
      const answerA = {
        roomId: id,
        position: pos,
        optionId: pos <= 9 ? keyValue : wrong,
        requestId: randomUUID(),
      };
      await command(a, "room_answer", answerA);
      await command(a, "room_answer", answerA);
      await command(
        a,
        "room_answer",
        { ...answerA, optionId: answerA.optionId === wrong ? keyValue : wrong },
        409,
      );
      savedRequest = answerA;
      if (pos !== 8) {
        const answerB = {
          roomId: id,
          position: pos,
          optionId: pos <= 7 ? keyValue : wrong,
          requestId: randomUUID(),
        };
        await command(b, "room_answer", answerB);
        if (pos === 4) {
          await cb.client.removeChannel(cb.channel);
          const resume = await command(b, "room_get", { roomId: id });
          assert(
            resume.answer?.requestId === answerB.requestId,
            "Lost response must recover locked answer",
          );
          await command(b, "room_answer", answerB);
        }
      }
      const afterAnswers = await command(a, "room_get", { roomId: id });
      if (afterAnswers.phase === "answer") hidden(afterAnswers);
      else
        assert(
          afterAnswers.phase === "reveal" &&
            Date.parse(afterAnswers.serverNow) >=
              Date.parse(afterAnswers.deadline),
          "Answer keys must never unlock before the server deadline",
        );
      room = await phase(a, id, pos, "reveal");
      assert(
        room.review?.explanation?.length > 0 && room.review.sources.length > 0,
        "Review and sources unlock only after deadline",
      );
      if (pos === 8)
        await command(
          b,
          "room_answer",
          {
            roomId: id,
            position: pos,
            optionId: keyValue,
            requestId: randomUUID(),
          },
          409,
        );
      if (pos === 4) {
        await subscribe(b, id, true);
        const recovered = await command(b, "room_get", { roomId: id });
        assert(
          recovered.position === 4 && recovered.phase === "reveal",
          "Reconnect must use current server phase",
        );
        pass("transport disconnect, lost response and idempotent reconnect");
      }
      console.log(`PROGRESS server-timed question ${pos}/10 complete`);
    }
    for (let n = 0; n < 50; n++) {
      room = await command(a, "room_get", { roomId: id });
      if (room.state === "completed") break;
      await new Promise((r) => setTimeout(r, 1000));
    }
    assert(room.state === "completed", "Automatic server completion");
    const pa = room.players.find((p) => p.id === a.id),
      pb = room.players.find((p) => p.id === b.id);
    assert(
      pa.score === 900 &&
        pa.correct === 9 &&
        pa.wrong === 1 &&
        pa.unanswered === 0 &&
        pa.rank === 1 &&
        pa.won,
      "A score/result mismatch",
    );
    assert(
      pb.score === 700 &&
        pb.correct === 7 &&
        pb.wrong === 2 &&
        pb.unanswered === 1 &&
        pb.rank === 2 &&
        !pb.won,
      "B score/result mismatch",
    );
    assert(
      room.reward.xp === 110 && room.reward.bonus === 20,
      "Verified XP/bonus mismatch",
    );
    assert(room.history.length === 10, "Final own answer review");
    pass(
      "ten real 15-second questions, synchronized order, deadline/key gates, 900/700 server scores",
    );
    pass("server reward, winner bonus and sourced own-answer review");
    const before = sql(
      `select md5(string_agg(row_to_json(w)::text,'|' order by player_id)) from quiz_private.live_rewards w where room_id='${id}';`,
    );
    await command(a, "room_answer", savedRequest);
    await command(a, "room_get", { roomId: id });
    assert(
      before ===
        sql(
          `select md5(string_agg(row_to_json(w)::text,'|' order by player_id)) from quiz_private.live_rewards w where room_id='${id}';`,
        ),
      "Rewards changed on replay",
    );
    pass("completed answer replay cannot change scores or grant XP twice");
    tie = await command(a, "room_get", { roomId: tie.id });
    assert(
      tie.state === "completed" &&
        tie.players.every((p) => p.score === 100 && p.rank === 1 && !p.won),
      "Equal scores must share rank without a random winner",
    );
    pass("equal first-place ranks, no arbitrary winner or win bonus");
    assert(ca.events() > 0, "No real Realtime invalidation received");
    pass("server broadcast delivered to separate authenticated session");
  }
  const denied = await fetch(`${url}/rest/v1/rpc/live_room_command`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${a.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      actor: b.id,
      operation: "room_get",
      body: { roomId: id },
    }),
  });
  assert(!denied.ok, "Client may not impersonate actor through RPC");
  pass("service-only command rejects authenticated direct-RPC impersonation");
  await writeFile(
    resolve(
      process.env.LIVE_ACCEPTANCE_OUTPUT || "/tmp/anla-live-acceptance.json",
    ),
    JSON.stringify(
      {
        target: remote ? "Frankfurt closed-dev" : "local Supabase",
        checks,
        passed: checks.length,
        timed: !process.argv.includes("--smoke"),
        note: "Independent Auth/HTTP/WebSocket sessions; no claim of physical-device or browser UI acceptance.",
      },
      null,
      2,
    ),
  );
} finally {
  await Promise.all(clients.map((client) => client.removeAllChannels()));
}
console.log(`Live acceptance complete: ${checks.length} checks passed.`);
