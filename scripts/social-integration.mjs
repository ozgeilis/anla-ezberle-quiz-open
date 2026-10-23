// Explicit isolated local / closed-development target only. Never prints credentials.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
const remote = process.argv.includes("--closed-dev");
assert(
  remote || process.argv.includes("--local"),
  "Explicit test target required",
);
const ref = "mqyuihiobkomjfipxehj";
const cli = process.env.QUIZ_SUPABASE_BIN ?? "supabase";
let url, key, users;
if (remote) {
  const projects = JSON.parse(
    execFileSync(cli, ["projects", "list", "--output-format", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
  assert(
    projects.projects.some(
      (p) =>
        p.ref === ref &&
        p.name === "anla-ezberle-quiz-dev" &&
        p.region === "eu-central-1",
    ),
  );
  url = `https://${ref}.supabase.co`;
  const env = await readFile(process.env.SOCIAL_CLIENT_ENV, "utf8");
  key = env.match(/^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m)?.[1]?.trim();
  users = JSON.parse(
    await readFile(
      join(homedir(), ".local/share/anla-quiz-dev", ref, "testers.json"),
      "utf8",
    ),
  ).users;
} else {
  const cfg = JSON.parse(
    await readFile("/tmp/anla-online500-20261019/local-status.json", "utf8"),
  );
  assert.equal(cfg.API_URL, "http://127.0.0.1:55431");
  url = cfg.API_URL;
  key = cfg.PUBLISHABLE_KEY;
  users = JSON.parse(
    await readFile(
      "/tmp/anla-online500-20261019/v13-browser-fixtures.json",
      "utf8",
    ),
  ).users;
}
function sql(query) {
  try {
    if (remote) {
      const result = JSON.parse(
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
      return result.rows?.[0] ? Object.values(result.rows[0])[0] : null;
    }
    const raw = execFileSync(
      process.env.QUIZ_DOCKER_BIN ?? "docker",
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
      { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    throw new Error("Database test failed (private output suppressed)");
  }
}
for (const u of users) {
  const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: u.email, password: u.password }),
  });
  assert.equal(r.status, 200, "Test account login");
  u.jwt = (await r.json()).access_token;
}
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log(`PASS ${name}`);
};
async function command(user, operation, body = {}, expected = 200) {
  let data, status;
  if (remote) {
    const r = await fetch(`${url}/functions/v1/online-duel`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${user.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, body }),
    });
    status = r.status;
    data = await r.json();
  } else {
    data = sql(
      `select public.player_social_command('${user.id}','${operation}','${JSON.stringify(body).replaceAll("'", "''")}'::jsonb);`,
    );
    status = data?.status ?? 200;
  }
  assert.equal(
    status,
    expected,
    `${operation} expected ${expected}, received ${status}`,
  );
  return data;
}
const [a, b, c] = users;
const ids = users.map((u) => `'${u.id}'`).join(",");
const before = sql(
  `select jsonb_agg(jsonb_build_object('id',id,'name',display_name,'username',username,'avatar',avatar,'discoverable',discoverable,'count',social_count,'window',social_window,'friendCount',friend_count,'friendWindow',friend_window)) from quiz_private.player_profiles where id in (${ids});`,
);
const ledgerBefore = sql(`select count(*) from quiz_private.score_ledger;`);
const existing = sql(
  `select count(*) from quiz_private.friendships where sender in (${ids}) and recipient in (${ids});`,
);
assert.equal(
  Number(existing),
  0,
  "Test accounts must have no existing mutual friendship",
);
const suffix = randomUUID().replaceAll("-", "").slice(0, 8);
const names = [`testa_${suffix}`, `testb_${suffix}`, `testc_${suffix}`];
const profile = (username, discoverable = true) => ({
  username,
  name: "Sosyal Test",
  avatar: 2,
  discoverable,
});
try {
  for (const u of users) await command(u, "social_self");
  pass("persistent Auth accounts accepted");
  for (const name of [
    "",
    "ABCD",
    "aa",
    "çilek",
    "admin",
    "diyanet",
    "nazi123",
    "a".repeat(21),
  ]) {
    assert.equal(
      (await command(a, "username_check", { username: name })).available,
      false,
    );
    await command(a, "social_profile", profile(name), 400);
  }
  pass(
    "invalid, uppercase, reserved and inappropriate usernames rejected on server",
  );
  assert.equal(
    (await command(a, "username_check", { username: names[0] })).available,
    true,
  );
  await command(a, "social_profile", profile(names[0]));
  assert.equal(
    (await command(b, "username_check", { username: names[0] })).available,
    false,
  );
  await command(b, "social_profile", profile(names[0]), 409);
  const raceName = `race_${suffix}`;
  const race = await Promise.all(
    [a, b].map(async (u) => {
      if (!remote) {
        return sql(
          `select public.player_social_command('${u.id}','social_profile','${JSON.stringify(profile(raceName))}'::jsonb);`,
        );
      }
      const r = await fetch(`${url}/functions/v1/online-duel`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${u.jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: "social_profile",
          body: profile(raceName),
        }),
      });
      return r.json();
    }),
  );
  assert.equal(race.filter((r) => r.saved).length, 1);
  assert.equal(race.filter((r) => r.error === "USERNAME_TAKEN").length, 1);
  pass("atomic uniqueness and concurrent rename race");
  for (let i = 0; i < users.length; i++)
    await command(users[i], "social_profile", profile(names[i], i !== 2));
  const search = await command(a, "player_search", {
    query: "testb_" + suffix,
  });
  assert.equal(search.players.length, 1);
  assert.deepEqual(
    Object.keys(search.players[0]).sort(),
    [
      "id",
      "name",
      "username",
      "avatar",
      "xp",
      "level",
      "achievementsShared",
      "badgeIds",
      "showcase",
    ].sort(),
  );
  assert.equal(search.players[0].id, b.id);
  assert.equal(
    (await command(a, "player_search", { query: names[2] })).players.length,
    0,
  );
  await command(a, "player_search", { query: "%__" }, 400);
  pass(
    "real search excludes private profiles, wildcard injection and private fields",
  );
  await command(a, "friend_send", { playerId: a.id }, 409);
  await command(a, "friend_send", { playerId: c.id }, 404);
  await command(a, "friend_send", { playerId: b.id });
  await command(a, "friend_send", { playerId: b.id }, 409);
  await command(b, "friend_send", { playerId: a.id }, 409);
  let friendship = (await command(b, "friends")).friendships.find(
    (f) => f.player?.id === a.id,
  );
  assert(friendship.incoming);
  await command(a, "friend_accept", { friendshipId: friendship.id }, 403);
  await command(c, "friend_accept", { friendshipId: friendship.id }, 404);
  await command(c, "friend_remove", { friendshipId: friendship.id }, 404);
  await command(b, "friend_remove", { friendshipId: friendship.id });
  pass(
    "self, duplicate, hidden target and unauthorized operations denied; rejection works",
  );
  await command(a, "friend_send", { playerId: b.id });
  friendship = (await command(b, "friends")).friendships.find(
    (f) => f.player?.id === a.id,
  );
  await command(b, "friend_accept", { friendshipId: friendship.id });
  assert.equal(
    (await command(a, "friends")).friendships.find(
      (f) => f.id === friendship.id,
    )?.state,
    "accepted",
  );
  await command(b, "social_profile", profile(names[1], false));
  assert.equal(
    (await command(a, "player_search", { query: names[1] })).players.length,
    0,
  );
  assert(
    (await command(a, "friends")).friendships.find(
      (f) => f.id === friendship.id,
    )?.player,
  );
  await command(a, "friend_remove", { friendshipId: friendship.id });
  pass("accept, privacy toggle, friends list and removal work");
  sql(
    `update quiz_private.player_profiles set social_count=0,social_window=now(),friend_count=19,friend_window=now() where id='${a.id}';`,
  );
  await command(b, "social_profile", profile(names[1], true));
  await command(a, "friend_send", { playerId: b.id });
  const lastRequest = (await command(b, "friends")).friendships.find(
    (f) => f.player?.id === a.id,
  );
  await command(b, "friend_remove", { friendshipId: lastRequest.id });
  await command(a, "friend_send", { playerId: b.id }, 429);
  pass("hourly friend quota survives request deletion");
  const privileges = sql(
    "select jsonb_build_object('table',has_table_privilege('authenticated','quiz_private.friendships','select'),'rpc',has_function_privilege('authenticated','public.player_social_command(uuid,text,jsonb)','execute'),'anon',has_function_privilege('anon','public.player_social_command(uuid,text,jsonb)','execute'),'rls',(select relrowsecurity and relforcerowsecurity from pg_class where oid='quiz_private.friendships'::regclass));",
  );
  assert.deepEqual(privileges, {
    table: false,
    rpc: false,
    anon: false,
    rls: true,
  });
  pass("default-deny forced RLS and service-only RPC");
  sql(
    `update quiz_private.player_profiles set social_count=0,social_window=now() where id='${a.id}';`,
  );
  for (const operation of ["friend_send", "friend_accept", "friend_remove"])
    await command(
      a,
      operation,
      operation === "friend_send"
        ? { playerId: "invalid" }
        : { friendshipId: "invalid" },
      400,
    );
  assert.equal(
    Number(
      sql(
        `select social_count from quiz_private.player_profiles where id='${a.id}';`,
      ),
    ),
    3,
  );
  pass("malformed identifiers consume quota and cannot bypass throttling");
  sql(
    `update quiz_private.player_profiles set social_count=60,social_window=now() where id='${a.id}';`,
  );
  await command(a, "player_search", { query: names[1] }, 429);
  pass("server request quota enforced");
  assert.equal(
    sql(`select count(*) from quiz_private.score_ledger;`),
    ledgerBefore,
  );
  pass("score ledger unchanged; no client XP accepted");
  if (remote) {
    const r = await fetch(`${url}/functions/v1/online-duel`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ operation: "friends" }),
    });
    assert.equal(r.status, 401);
    const spoof = await fetch(`${url}/functions/v1/online-duel`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${b.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: "social_profile",
        body: { ...profile(names[1]), xp: 9999 },
      }),
    });
    assert.equal(spoof.status, 400);
    const duel = await fetch(`${url}/functions/v1/online-duel`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${b.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation: "self", body: {} }),
    });
    assert.equal(duel.status, 200);
    pass(
      "Edge rejects anonymous/spoofed fields; existing duel API remains available",
    );
  }
} finally {
  sql(
    `delete from quiz_private.friendships where sender in (${ids}) and recipient in (${ids});`,
  );
  for (const p of before) {
    const literal = (v) =>
      v === null ? "null" : `'${String(v).replaceAll("'", "''")}'`;
    sql(
      `update quiz_private.player_profiles set display_name=${literal(p.name)},username=${literal(p.username)},avatar=${p.avatar},discoverable=${p.discoverable},social_count=${p.count},social_window=${literal(p.window)},friend_count=${p.friendCount},friend_window=${literal(p.friendWindow)} where id='${p.id}';`,
    );
  }
}
if (process.env.SOCIAL_REPORT)
  await writeFile(
    process.env.SOCIAL_REPORT,
    JSON.stringify(
      { target: remote ? "closed-development" : "local", checks, passed: true },
      null,
      2,
    ) + "\n",
  );
console.log(
  `${checks.length} social integration groups passed; test profiles restored.`,
);
