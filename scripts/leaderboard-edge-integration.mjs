// Auth + Edge + PostgreSQL acceptance. Existing local disposable accounts only.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
const cfg = JSON.parse(
  await readFile("/tmp/anla-online500-20261019/local-status.json", "utf8"),
);
assert.equal(cfg.API_URL, "http://127.0.0.1:55431");
const { users } = JSON.parse(
  await readFile(
    "/tmp/anla-online500-20261019/v13-browser-fixtures.json",
    "utf8",
  ),
);
const docker = process.env.QUIZ_DOCKER_BIN ?? "docker";
const sql = (q) =>
  execFileSync(
    docker,
    [
      "exec",
      "-i",
      "supabase_db_anla-ezberle-quiz-dev-local",
      "psql",
      "-U",
      "postgres",
      "-d",
      "postgres",
      "-At",
      "-v",
      "ON_ERROR_STOP=1",
    ],
    { input: q, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  ).trim();
const request = async (jwt, operation, body = {}, status = 200) => {
  const r = await fetch(cfg.API_URL + "/functions/v1/online-duel", {
    method: "POST",
    headers: {
      apikey: cfg.PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: "Bearer " + jwt } : {}),
    },
    body: JSON.stringify({ operation, body }),
  });
  assert.equal(r.status, status, operation + " status");
  return r.json();
};
const [a, b] = users;
for (const u of [a, b]) {
  const r = await fetch(cfg.API_URL + "/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: {
      apikey: cfg.PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: u.email, password: u.password }),
  });
  assert.equal(r.status, 200, "local auth");
  u.jwt = (await r.json()).access_token;
}
const before = sql(
  `select jsonb_agg(row_to_json(p)) from quiz_private.player_profiles p where id in('${a.id}','${b.id}');`,
);
const ids = [a, b].map((u) => `'${u.id}'`).join(",");
const existing = sql(
  `select count(*) from quiz_private.friendships where sender in(${ids}) and recipient in(${ids});`,
);
assert.equal(
  existing,
  "0",
  "Disposable pair must not have an existing friendship",
);
const previousLimits = JSON.parse(
  sql(
    `select coalesce(jsonb_agg(row_to_json(l)),'[]') from quiz_private.leaderboard_limits l where player_id in(${ids});`,
  ),
);
sql(
  `update quiz_private.leaderboard_limits set calls=0,window_at=clock_timestamp() where player_id in(${ids});`,
);
const enabled = sql("select enabled from quiz_private.leaderboard_config;");
let friendId;
const checks = [];
const pass = (s) => {
  checks.push(s);
  console.log("PASS " + s);
};
try {
  sql("update quiz_private.leaderboard_config set enabled=false;");
  await request(a.jwt, "leaderboard", {}, 503);
  await request(a.jwt, "self");
  pass(
    "Disabled ranking leaves legacy duel API available (non-destructive rollback)",
  );
  sql("update quiz_private.leaderboard_config set enabled=true;");
  await request(null, "leaderboard", {}, 401);
  await request(a.jwt, "leaderboard", { actor: b.id }, 400);
  await request(a.jwt, "leaderboard", { xp: 9999 }, 400);
  await request(
    a.jwt,
    "leaderboard_settings",
    { enabled: true, score: 9999 },
    400,
  );
  pass("Auth required; actor/score spoofing rejected by actual Edge");
  const marker = Date.now().toString(36);
  for (const [i, u] of [a, b].entries()) {
    const old = await request(u.jwt, "social_self");
    await request(u.jwt, "social_profile", {
      ...old.profile,
      username: `rank_${i}_${marker}`,
      discoverable: true,
    });
    await request(u.jwt, "leaderboard_settings", { enabled: true });
  }
  let r = await request(a.jwt, "leaderboard", { scope: "global", limit: 1 });
  assert(r.entries.length <= 1);
  assert(r.self.optIn);
  assert(
    r.self.games > 0,
    "Use real completed local duel, never inject client XP",
  );
  assert.equal(r.self.xp, (await request(a.jwt, "social_self")).player.xp);
  assert(r.self.entry.rank >= 1);
  pass("Existing completed duel projects exact canonical XP and self rank");
  if (r.nextCursor) {
    const second = await request(a.jwt, "leaderboard", {
      scope: "global",
      limit: 1,
      cursor: r.nextCursor,
    });
    assert(second.entries.every((e) => e.player.id !== r.entries[0].player.id));
    pass("HTTP keyset page has no duplicate");
  }
  const empty = await request(a.jwt, "leaderboard", { scope: "friends" });
  assert.equal(empty.entries.length, 0);
  await request(a.jwt, "friend_send", { playerId: b.id });
  assert.equal(
    (await request(a.jwt, "leaderboard", { scope: "friends" })).entries.length,
    0,
    "Pending excluded",
  );
  friendId = (await request(b.jwt, "friends")).friendships.find(
    (f) => f.player?.id === a.id,
  ).id;
  await request(b.jwt, "friend_accept", { friendshipId: friendId });
  r = await request(a.jwt, "leaderboard", { scope: "friends" });
  assert.equal(r.entries.length, 1);
  assert.equal(r.entries[0].player.id, b.id);
  pass("Pending excluded; accepted friend alone appears");
  await request(b.jwt, "leaderboard_settings", { enabled: false });
  assert.equal(
    (await request(a.jwt, "leaderboard", { scope: "friends" })).entries.length,
    0,
  );
  pass("Opt-out takes effect across accounts immediately");
  await request(a.jwt, "leaderboard_settings", { enabled: false });
  assert.equal((await request(a.jwt, "leaderboard_self")).self.entry, null);
  pass("Own hidden rank is null, not an estimate");
  const publicRest = await fetch(
    cfg.API_URL + "/rest/v1/rpc/player_leaderboard_command",
    {
      method: "POST",
      headers: {
        apikey: cfg.PUBLISHABLE_KEY,
        Authorization: "Bearer " + a.jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ actor: b.id, operation: "leaderboard", body: {} }),
    },
  );
  assert(
    publicRest.status === 401 ||
      publicRest.status === 403 ||
      publicRest.status === 404,
  );
  pass("REST cannot invoke service-only SQL RPC with another actor");
} finally {
  if (friendId)
    await request(a.jwt, "friend_remove", { friendshipId: friendId }).catch(
      () => {},
    );
  const profiles = JSON.parse(before),
    lit = (v) => (v === null ? "null" : `'${String(v).replaceAll("'", "''")}'`);
  for (const p of profiles)
    sql(
      `update quiz_private.player_profiles set display_name=${lit(p.display_name)},username=${lit(p.username)},avatar=${p.avatar},discoverable=${p.discoverable},leaderboard_opt_in=${p.leaderboard_opt_in},social_window=${lit(p.social_window)},social_count=${p.social_count},friend_window=${lit(p.friend_window)},friend_count=${p.friend_count} where id='${p.id}';`,
    );
  for (const l of previousLimits)
    sql(
      `update quiz_private.leaderboard_limits set window_at='${l.window_at}',calls=${l.calls} where player_id='${l.player_id}';`,
    );
  sql(`update quiz_private.leaderboard_config set enabled=${enabled === "t"};`);
}
if (process.env.LEADERBOARD_REPORT)
  await writeFile(
    process.env.LEADERBOARD_REPORT,
    JSON.stringify({ passed: true, target: "isolated-local", checks }, null, 2),
  );
console.log(
  checks.length +
    " actual Auth/Edge/SQL leaderboard groups passed; local profile preferences restored.",
);
