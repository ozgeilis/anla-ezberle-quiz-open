// Real remote Auth + Edge + PostgreSQL acceptance for the explicitly approved
// Frankfurt closed-test project. Same critical assertions as the local harness,
// using pre-provisioned synthetic users and an administrative CLI SQL adapter.
// Never run against production. Credentials stay ignored and are never printed.
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { randomUUID, randomBytes } from "node:crypto";
import { homedir } from "node:os";
import { resolve, relative, isAbsolute } from "node:path";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";

// Explicitly approved closed-development acceptance only. Never infer a target.
const refIndex = process.argv.indexOf("--project-ref");
const ref = process.argv[refIndex + 1];
assert(
  refIndex >= 0 &&
    /^[a-z]{20}$/.test(ref ?? "") &&
    process.argv.includes("--closed-dev"),
  "Explicit closed-development project required",
);
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert.equal(
  url,
  `https://${ref}.supabase.co`,
  "Environment and explicit target must match",
);
assert(key?.startsWith("sb_publishable_"));
const cli = process.env.QUIZ_SUPABASE_BIN ?? "supabase";
const projects = JSON.parse(
  execFileSync(cli, ["projects", "list", "--output-format", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }),
);
const target = projects.projects.find((p) => p.ref === ref);
assert(
  target &&
    target.name === "anla-ezberle-quiz-dev" &&
    target.region === "eu-central-1" &&
    target.status === "ACTIVE_HEALTHY",
  "Only approved healthy Frankfurt dev target permitted",
);
function sql(query) {
  try {
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
    const first = result.rows?.[0];
    const value = first ? Object.values(first)[0] : "";
    return typeof value === "boolean" ? (value ? "t" : "f") : String(value);
  } catch {
    throw new Error(
      "Remote database assertion failed; query details and credentials are not printed",
    );
  }
}
const checks = [];
function pass(name) {
  checks.push(name);
  console.log(`PASS ${name}`);
}
const privateDirectory = resolve(
  homedir(),
  ".local",
  "share",
  "anla-quiz-dev",
  ref,
);
const privateRelative = relative(process.cwd(), privateDirectory);
assert(
  isAbsolute(privateRelative) || privateRelative.startsWith(".."),
  "Credentials must be outside Expo project",
);
const users = [];
const saved = JSON.parse(
  await readFile(resolve(privateDirectory, "testers.json"), "utf8"),
);
assert.equal(saved.projectRef, ref);
for (const role of ["a", "b", "c"]) {
  const account = saved.users.find((u) => u.role === role);
  assert(account, "Provision the approved synthetic testers first");
  const login = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: account.email, password: account.password }),
  });
  assert.equal(login.status, 200, "Real remote test-account sign in");
  const session = await login.json();
  assert.equal(session.user.id, account.id);
  assert(session.user.email_confirmed_at);
  users.push({
    ...account,
    jwt: session.access_token,
    refresh: session.refresh_token,
  });
}
assert.equal(new Set(users.map((u) => u.id)).size, 3);
const [a, b, c] = users;
const fixturePath = resolve(privateDirectory, "browser-fixtures.json");
await writeFile(
  fixturePath,
  JSON.stringify({ url, publishableKey: key, users }),
  { mode: 0o600 },
);
await chmod(fixturePath, 0o600);
pass(
  "A/B distinct verified Auth accounts; unauthorized third account provisioned in closed remote dev",
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
  "8",
);
assert.equal(
  sql(
    "select has_schema_privilege('authenticated','quiz_private','USAGE') or has_function_privilege('authenticated','public.online_duel_command(uuid,text,jsonb)','EXECUTE') or has_function_privilege('anon','public.online_duel_command(uuid,text,jsonb)','EXECUTE');",
  ),
  "f",
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
  "8 default-deny RLS tables; private schema/answer keys/raw records and service RPC inaccessible to clients; forged identity/score rejected",
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
  environment: "real-remote-supabase-frankfurt",
  url,
  checks,
  match: { id, result: "800–600", winner: "a" },
  tie: { id: tie.id, result: "700–700" },
  transportFault:
    "Real API transaction commits; downstream TCP socket is destroyed before response; resume and identical retry verified",
  remoteDeployed: true,
  physicalTwoDeviceTest: false,
};
const report = "artifacts/phase-3b/remote-integration-acceptance.json";
await writeFile(report, JSON.stringify(out, null, 2));
console.log(
  `${checks.length} critical real integration groups passed. Remote Frankfurt API acceptance passed; physical-device acceptance remains unverified.`,
);
