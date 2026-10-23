// Real local Supabase Auth + Edge + PostgreSQL acceptance. No client mocks.
// Credentials remain outside Git and are never printed. This script refuses a
// remote URL; provisioning remote testers requires a separately approved flow.
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { randomUUID, randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { resolve, relative, dirname, isAbsolute } from "node:path";

const file = process.argv[2];
if (!file)
  throw new Error(
    "Usage: node scripts/online-integration.mjs /absolute/path/local-status.json",
  );
const privateRelative = relative(process.cwd(), dirname(resolve(file)));
assert(
  isAbsolute(privateRelative) || privateRelative.startsWith(".."),
  "Local status and fixtures must stay outside Expo project",
);
const cfg = JSON.parse(await readFile(file, "utf8"));
assert.equal(cfg.API_URL, "http://127.0.0.1:55431", "Local-only safety guard");
const url = cfg.API_URL;
const service = cfg.SERVICE_ROLE_KEY;
const key = cfg.PUBLISHABLE_KEY;
assert(service && key?.startsWith("sb_publishable_"));
const docker = process.env.QUIZ_DOCKER_BIN ?? "docker";
const container = "supabase_db_anla-ezberle-quiz-dev-local";
function sql(query) {
  return execFileSync(
    docker,
    [
      "exec",
      "-i",
      container,
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
}
const checks = [];
function pass(name) {
  checks.push(name);
  console.log(`PASS ${name}`);
}
const users = [];
for (const role of ["a", "b", "c"]) {
  const email = `quiz-${Date.now()}-${role}@example.com`;
  const password = randomBytes(24).toString("base64url") + "aA!4";
  const response = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  assert.equal(response.status, 200, "Admin test-account provisioning");
  const account = await response.json();
  assert.match(account.id, /^[a-f0-9-]{36}$/);
  const enrollment = await fetch(
    `${url}/rest/v1/rpc/online_duel_enroll_test_user`,
    {
      method: "POST",
      headers: {
        apikey: service,
        Authorization: `Bearer ${service}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: account.id,
        display_name: `Test oyuncu ${role.toUpperCase()}`,
      }),
    },
  );
  assert.equal(enrollment.status, 200);
  assert.equal((await enrollment.json()).enabled, true);
  const login = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert.equal(login.status, 200);
  const session = await login.json();
  users.push({
    id: account.id,
    email,
    password,
    jwt: session.access_token,
    refresh: session.refresh_token,
    role,
  });
}
assert.equal(new Set(users.map((u) => u.id)).size, 3);
const [a, b, c] = users;
const fixturePath = new URL("./browser-fixtures.json", `file://${file}`)
  .pathname;
await writeFile(
  fixturePath,
  JSON.stringify({ url, publishableKey: key, users }),
  { mode: 0o600 },
);
await chmod(fixturePath, 0o600);
pass(
  "A/B distinct verified Auth accounts; unauthorized third account provisioned locally",
);
async function command(
  user,
  operation,
  body = {},
  expected = 200,
  endpoint = `${url}/functions/v1/online-duel`,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${user.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ operation, body }),
  });
  const payload = await response.json();
  assert.equal(
    response.status,
    expected,
    `${operation} returned ${response.status}: ${payload.error ?? "unexpected"}`,
  );
  return payload;
}
assert.deepEqual((await command(a, "self")).profile, { name: "Test oyuncu A" });
assert.deepEqual((await command(c, "self")).matches, []);
assert.equal(
  sql(
    "select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='quiz_private' and c.relkind='r' and c.relrowsecurity and c.relforcerowsecurity;",
  ),
  "9",
);
assert.equal(
  sql(
    "select has_schema_privilege('authenticated','quiz_private','USAGE') or has_function_privilege('authenticated','public.online_duel_command(uuid,text,jsonb)','EXECUTE') or has_function_privilege('anon','public.online_duel_command(uuid,text,jsonb)','EXECUTE');",
  ),
  "f",
);
assert.equal(
  sql("select active_scope from quiz_private.online_content_config where singleton=true;"),
  "synthetic_test",
  "Staged real question pool must remain disabled by default",
);
const direct = await fetch(`${url}/rest/v1/rpc/online_duel_command`, {
  method: "POST",
  headers: {
    apikey: key,
    Authorization: `Bearer ${a.jwt}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ actor: a.id, operation: "self", body: {} }),
});
assert([401, 403, 404].includes(direct.status));
for (const table of [
  "online_content_config",
  "quiz_answer_keys",
  "quiz_attempts",
  "player_profiles",
  "score_ledger",
  "matches",
]) {
  const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { apikey: key, Authorization: `Bearer ${a.jwt}` },
  });
  assert([401, 403, 404].includes(response.status));
}
const forbiddenEnroll = await fetch(
  `${url}/rest/v1/rpc/online_duel_enroll_test_user`,
  {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${a.jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: c.id, display_name: "Forbidden change" }),
  },
);
assert([401, 403, 404].includes(forbiddenEnroll.status));
const privateSchema = await fetch(`${url}/rest/v1/quiz_answer_keys?select=*`, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${a.jwt}`,
    "Accept-Profile": "quiz_private",
  },
});
assert.equal(privateSchema.status, 406);
await command({ ...a, jwt: "invalid" }, "self", {}, 401);
await command(a, "create", { requestId: randomUUID(), score: 1000 }, 400);
pass(
  "9 default-deny RLS tables; private schema/answer keys/raw records and service RPC inaccessible to clients; forged identity/score rejected",
);
let m = await command(a, "create", { requestId: randomUUID() });
const id = m.id,
  token = m.inviteToken;
assert.match(token, /^[0-9a-f]{64}$/);
await command(a, "join", { token }, 409);
await command(c, "get", { matchId: id }, 404);
await command(b, "join", { token });
await command(c, "join", { token }, 410);
await command(b, "start", { matchId: id }, 409);
let ma = await command(a, "start", { matchId: id });
const manifest = ma.questions;
assert.equal(manifest.length, 10);
assert.equal(new Set(manifest.map((q) => q.id)).size, 10);
assert.equal(ma.review.length, 0);
assert(ma.players.every((p) => p.score === null && p.correct === null));
assert(!JSON.stringify(ma).includes("correctOptionId"));
pass(
  "Unpredictable invitation, no self-join/third participant/third-account read; A-before-B enforced; keys hidden",
);
function option(question, correct) {
  const n = Number(question.id.slice(-2));
  return String.fromCharCode(97 + (((n % 4) + (correct ? 0 : 1)) % 4));
}
const first = {
  matchId: id,
  position: 1,
  optionId: option(manifest[0], true),
  requestId: randomUUID(),
};
const duplicate = await Promise.all([
  command(a, "answer", first),
  command(a, "answer", first),
]);
assert(duplicate.every((v) => v.answers.length === 1));
await command(
  a,
  "answer",
  { ...first, optionId: option(manifest[0], false) },
  409,
);
await command(a, "answer", { ...first, requestId: randomUUID() }, 409);
// Real transport loss: the proxy waits for the real API transaction to return,
// then destroys the downstream socket instead of delivering its response.
const proxy = createServer(async (req, res) => {
  try {
    const chunks = [];
    for await (const piece of req) chunks.push(piece);
    const upstream = await fetch(`${url}/functions/v1/online-duel`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${a.jwt}`,
        "Content-Type": "application/json",
      },
      body: Buffer.concat(chunks),
    });
    await upstream.arrayBuffer();
    assert.equal(upstream.status, 200);
    res.destroy();
  } catch {
    res.destroy();
  }
});
proxy.listen(0, "127.0.0.1");
await once(proxy, "listening");
const second = {
  matchId: id,
  position: 2,
  optionId: option(manifest[1], true),
  requestId: randomUUID(),
};
await assert.rejects(() =>
  command(a, "answer", second, 200, `http://127.0.0.1:${proxy.address().port}`),
);
proxy.close();
ma = await command(a, "get", { matchId: id });
assert.equal(ma.answers.length, 2);
ma = await command(a, "answer", second);
assert.equal(ma.answers.length, 2);
pass(
  "Concurrent duplicate answer scored once; changed/re-keyed answer rejected; real dropped HTTP response resumes/retries without double scoring",
);
for (let i = 2; i < 10; i++)
  ma = await command(a, "answer", {
    matchId: id,
    position: i + 1,
    optionId: option(manifest[i], i < 8),
    requestId: randomUUID(),
  });
assert.equal(ma.state, "waiting_for_result");
assert(ma.players.every((p) => p.score === null));
assert.equal(ma.review.length, 0);
let mb = await command(b, "start", { matchId: id });
assert.deepEqual(mb.questions, manifest);
assert.equal(mb.manifestHash, ma.manifestHash);
assert.equal(mb.answers.length, 0);
mb = await command(b, "answer", {
  matchId: id,
  position: 1,
  optionId: option(manifest[0], true),
  requestId: randomUUID(),
});
assert.equal(mb.answers.length, 1);
assert.equal((await command(a, "get", { matchId: id })).answers.length, 10);
await command(c, "get", { matchId: id }, 404);
for (let i = 1; i < 10; i++)
  mb = await command(b, "answer", {
    matchId: id,
    position: i + 1,
    optionId: option(manifest[i], i < 6),
    requestId: randomUUID(),
  });
assert.equal(mb.state, "completed");
assert.deepEqual(
  mb.players.map((p) => p.score),
  [800, 600],
);
assert.deepEqual(
  mb.players.map((p) => [p.correct, p.wrong]),
  [
    [8, 2],
    [6, 4],
  ],
);
assert.equal(mb.result.winner, "a");
assert.equal(mb.review.length, 10);
await command(
  b,
  "answer",
  {
    matchId: id,
    ...{
      position: 1,
      optionId: option(manifest[0], true),
      requestId: randomUUID(),
    },
  },
  410,
);
await command(a, "start", { matchId: id }, 410);
assert.equal(
  sql(`select count(*) from quiz_private.score_ledger where match_id='${id}';`),
  "2",
);
assert.equal(
  sql(
    `select sum(score) from quiz_private.score_ledger where match_id='${id}';`,
  ),
  "1400",
);
pass(
  "Same frozen 10-question/version/order manifest; separate answers; authoritative 800–600 result and exactly two ledger entries; terminal match cannot re-score",
);
let tie = await command(a, "create", { requestId: randomUUID() });
await command(b, "join", { token: tie.inviteToken });
for (const user of [a, b]) {
  let playing = await command(user, "start", { matchId: tie.id });
  for (let i = 0; i < 10; i++)
    playing = await command(user, "answer", {
      matchId: tie.id,
      position: i + 1,
      optionId: option(playing.questions[i], i < 7),
      requestId: randomUUID(),
    });
  tie = playing;
}
assert.equal(tie.result.winner, "tie");
assert.deepEqual(
  tie.players.map((p) => p.score),
  [700, 700],
);
pass("Second independent match correctly resolves 700–700 tie");
const expiredToken = randomBytes(32).toString("hex");
const expiredId = sql(`with new_match as (
 insert into quiz_private.matches(creator_id,create_request_id,question_set,manifest_hash,invite_hash,created_at,expires_at)
 select '${a.id}',gen_random_uuid(),question_set,manifest_hash,extensions.digest('${expiredToken}','sha256'),now()-interval '25 hours',now()-interval '1 second' from quiz_private.matches where id='${id}' returning id
), new_session as (
 insert into quiz_private.quiz_sessions(match_id,player_id) select id,'${a.id}' from new_match returning id,match_id
), new_player as (
 insert into quiz_private.match_players(match_id,slot,player_id,session_id) select match_id,'a','${a.id}',id from new_session returning match_id
) select match_id from new_player;`);
assert.match(expiredId, /^[a-f0-9-]{36}$/);
for (const [statement, expectedError] of [
  [
    `update quiz_private.matches set state='completed' where id='${expiredId}'`,
    "Invalid match transition",
  ],
  [
    `update quiz_private.quiz_questions set prompt='tampered' where id='synthetic-v1-01' and version=1`,
    "Content versions are immutable; insert a new version",
  ],
  [
    `update quiz_private.matches set question_set='[]'::jsonb where id='${expiredId}'`,
    "Match manifest and deadlines are immutable",
  ],
  [
    `update quiz_private.score_ledger set score=0 where match_id='${id}'`,
    "Content versions are immutable; insert a new version",
  ],
]) {
  sql(
    `do $$ begin begin ${statement}; raise exception 'TEST_UNEXPECTED_SUCCESS'; exception when raise_exception then if SQLERRM <> '${expectedError}' then raise; end if; end; end $$;`,
  );
}
await command(b, "join", { token: expiredToken }, 410);
assert.equal(
  (await command(a, "get", { matchId: expiredId })).state,
  "expired",
);
assert.equal(
  sql(
    `select count(*) from quiz_private.score_ledger where match_id='${expiredId}';`,
  ),
  "0",
);
pass(
  "Database-clock expiry rejects stale invite without score; invalid transitions, frozen question versions/manifests and immutable ledger enforced",
);
const signup = await fetch(`${url}/auth/v1/signup`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({
    email: `blocked-${Date.now()}@example.com`,
    password: randomBytes(24).toString("base64url") + "aA!4",
  }),
});
assert(!signup.ok);
pass("Public and anonymous registration remain disabled");
const out = {
  environment: "real-local-supabase",
  url,
  checks,
  match: { id, result: "800–600", winner: "a" },
  tie: { id: tie.id, result: "700–700" },
  transportFault:
    "Real API transaction commits; downstream TCP socket is destroyed before response; resume and identical retry verified",
  remoteDeployed: false,
  physicalTwoDeviceTest: false,
};
const report = new URL("./integration-report.json", `file://${file}`).pathname;
await writeFile(report, JSON.stringify(out, null, 2));
console.log(
  `${checks.length} critical real integration groups passed. No remote deployment or physical-device acceptance claimed.`,
);
