// Real local Auth + Edge + PostgreSQL acceptance. Never run against a remote.
// The private status/fixtures and SQL answer keys stay outside the Expo root.
import assert from "node:assert/strict";
import { readFile, writeFile, stat } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { randomUUID, randomBytes } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { Buffer } from "node:buffer";

const statusFile = resolve(process.argv[2] ?? "");
const privateDir = dirname(statusFile);
assert(
  relative(process.cwd(), privateDir).startsWith(".." + sep),
  "Private files must be outside project",
);
assert.equal(
  (await stat(privateDir)).mode & 0o077,
  0,
  "Private directory must be 0700",
);
const cfg = JSON.parse(await readFile(statusFile, "utf8"));
assert.equal(cfg.API_URL, "http://127.0.0.1:55431", "LOCAL ONLY");
const url = cfg.API_URL;
const key = cfg.PUBLISHABLE_KEY;
const service = cfg.SERVICE_ROLE_KEY;
assert(key?.startsWith("sb_publishable_") && service);
const docker = process.env.QUIZ_DOCKER_BIN ?? "docker";
function sql(query) {
  try {
    return execFileSync(
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
        "-v",
        "ON_ERROR_STOP=1",
        "-At",
      ],
      { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
  } catch {
    // psql errors can include SQL literals. Never forward its stdout/stderr.
    throw new Error("Local database command failed (private SQL withheld)");
  }
}
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log(`PASS ${name}`);
};
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
  assert.equal(
    response.status,
    expected,
    `${operation}: unexpected HTTP status`,
  );
  return response.json();
}
function hidden(view) {
  assert.equal(view.review.length, 0);
  assert(
    view.players.every(
      (p) => p.score === null && p.correct === null && p.wrong === null,
    ),
  );
  // No correctness, explanation or answer-key fields anywhere in the response.
  assert(
    !/"(?:correctOptionId|explanation|is_correct|correct_option_id)"/.test(
      JSON.stringify(view),
    ),
  );
}
const users = [];
for (const role of ["a", "b", "c"]) {
  const email = `v13-${Date.now()}-${role}@example.com`;
  const password = randomBytes(24).toString("base64url") + "aA!4";
  const admin = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: service,
      Authorization: `Bearer ${service}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  assert.equal(admin.status, 200);
  const account = await admin.json();
  assert.match(account.id, /^[a-f0-9-]{36}$/);
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
        user_id: account.id,
        display_name: `Yerel V13 ${role.toUpperCase()}`,
      }),
    },
  );
  assert.equal(enrolled.status, 200);
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
    role,
    jwt: session.access_token,
    refresh: session.refresh_token,
  });
}
const [a, b, c] = users;
await writeFile(
  resolve(privateDir, "v13-browser-fixtures.json"),
  JSON.stringify({ url, publishableKey: key, users }),
  { mode: 0o600 },
);
assert.equal(new Set(users.map((u) => u.id)).size, 3);
assert.equal(
  sql("select active_scope from quiz_private.online_content_config;"),
  "synthetic_test",
);
assert.equal(
  sql(
    "select count(*) from quiz_private.quiz_questions where content_scope='synthetic_test';",
  ),
  "20",
);
assert.equal(
  sql(
    "select count(*) from quiz_private.quiz_questions q join quiz_private.quiz_answer_keys k on k.question_id=q.id and k.question_version=q.version where q.content_scope='owner_approved_v13';",
  ),
  "500",
);
// Expected keys are read only by this privileged test process, never the UI.
const keys = new Map(
  JSON.parse(
    sql(
      "select jsonb_agg(jsonb_build_array(q.id||':'||q.version,k.correct_option_id,k.explanation)) from quiz_private.quiz_questions q join quiz_private.quiz_answer_keys k on k.question_id=q.id and k.question_version=q.version;",
    ),
  ).map(([id, answer, explanation]) => [id, { answer, explanation }]),
);
function option(q, correct) {
  const expected = keys.get(`${q.id}:${q.version}`).answer;
  return correct ? expected : q.options.find((o) => o.id !== expected).id;
}
pass(
  "500 complete private question/key pairs imported; original 20 synthetic questions retained; three separate local Auth identities",
);
// Start an old-pool match before the switch and finish it after the switch.
const old = await command(a, "create", { requestId: randomUUID() });
assert.equal(old.scope, "synthetic_test");
await command(b, "join", { token: old.inviteToken });
const oldStarted = await command(a, "start", { matchId: old.id });
let main, tie, ui;
try {
  sql(
    "update quiz_private.online_content_config set active_scope='owner_approved_v13' where singleton=true;",
  );
  assert.equal(
    sql("select active_scope from quiz_private.online_content_config;"),
    "owner_approved_v13",
  );
  main = await command(a, "create", { requestId: randomUUID() });
  assert.equal(main.scope, "owner_approved_v13");
  assert.equal(main.questions.length, 0);
  await command(a, "join", { token: main.inviteToken }, 409);
  await command(c, "get", { matchId: main.id }, 404);
  await command(b, "join", { token: main.inviteToken });
  await command(c, "join", { token: main.inviteToken }, 410);
  let ma = await command(a, "start", { matchId: main.id });
  const manifest = ma.questions;
  assert.equal(manifest.length, 10);
  assert.equal(new Set(manifest.map((q) => q.id)).size, 10);
  assert(
    manifest.every(
      (q) => !q.id.startsWith("synthetic-") && keys.has(`${q.id}:${q.version}`),
    ),
  );
  hidden(ma);
  for (const table of [
    "online_content_config",
    "quiz_questions",
    "quiz_answer_keys",
    "quiz_attempts",
    "score_ledger",
  ]) {
    const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
      headers: { apikey: key, Authorization: `Bearer ${a.jwt}` },
    });
    assert([401, 403, 404].includes(response.status));
  }
  await command(
    a,
    "create",
    { requestId: randomUUID(), scope: "owner_approved_v13" },
    400,
  );
  pass(
    "Privileged local activation selects v13; invite/authorization rules hold; questions and keys stay inaccessible before authorized start/result",
  );
  const first = {
    matchId: main.id,
    position: 1,
    optionId: option(manifest[0], true),
    requestId: randomUUID(),
  };
  const duplicate = await Promise.all([
    command(a, "answer", first),
    command(a, "answer", first),
  ]);
  assert(duplicate.every((v) => v.answers.length === 1));
  const second = {
    matchId: main.id,
    position: 2,
    optionId: option(manifest[1], true),
    requestId: randomUUID(),
  };
  // Real transaction commits, then a TCP socket drops its successful response.
  const proxy = createServer(async (req, res) => {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
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
  try {
    await assert.rejects(() =>
      command(
        a,
        "answer",
        second,
        200,
        `http://127.0.0.1:${proxy.address().port}`,
      ),
    );
  } finally {
    proxy.close();
  }
  // Also prove failure before the server receives the third answer changes nothing.
  const disconnected = createServer();
  disconnected.listen(0, "127.0.0.1");
  await once(disconnected, "listening");
  const closedPort = disconnected.address().port;
  await new Promise((resolveClose) => disconnected.close(resolveClose));
  const third = {
    matchId: main.id,
    position: 3,
    optionId: option(manifest[2], true),
    requestId: randomUUID(),
  };
  await assert.rejects(() =>
    command(a, "answer", third, 200, `http://127.0.0.1:${closedPort}`),
  );
  // Refresh real Auth and resume from server state in a new command context.
  const refreshed = await fetch(
    `${url}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: a.refresh }),
    },
  );
  assert.equal(refreshed.status, 200);
  const session = await refreshed.json();
  a.jwt = session.access_token;
  a.refresh = session.refresh_token;
  ma = await command(a, "get", { matchId: main.id });
  assert.equal(ma.answers.length, 2);
  hidden(ma);
  ma = await command(a, "answer", second);
  assert.equal(ma.answers.length, 2);
  await command(
    a,
    "answer",
    { ...second, optionId: option(manifest[1], false) },
    409,
  );
  await command(a, "answer", { ...second, requestId: randomUUID() }, 409);
  ma = await command(a, "answer", third);
  assert.equal(ma.answers.length, 3);
  pass(
    "Real TCP response loss and pre-send connection refusal; Auth refresh/resume; identical retry scores once; changed/re-keyed locked answers rejected",
  );
  for (let i = 3; i < 10; i++)
    ma = await command(a, "answer", {
      matchId: main.id,
      position: i + 1,
      optionId: option(manifest[i], i < 8),
      requestId: randomUUID(),
    });
  assert.equal(ma.state, "waiting_for_result");
  hidden(ma);
  let mb = await command(b, "start", { matchId: main.id });
  assert.deepEqual(mb.questions, manifest);
  assert.equal(mb.manifestHash, ma.manifestHash);
  assert.equal(mb.answers.length, 0);
  for (let i = 0; i < 10; i++) {
    mb = await command(b, "answer", {
      matchId: main.id,
      position: i + 1,
      optionId: option(manifest[i], i < 6),
      requestId: randomUUID(),
    });
    if (i < 9) hidden(mb);
  }
  assert.equal(mb.state, "completed");
  assert.equal(mb.result.winner, "a");
  assert.deepEqual(
    mb.players.map((p) => [p.score, p.correct, p.wrong]),
    [
      [800, 8, 2],
      [600, 6, 4],
    ],
  );
  assert.equal(mb.answers.length, 10);
  assert.equal(
    (await command(a, "get", { matchId: main.id })).answers.length,
    10,
  );
  assert.equal(mb.review.length, 10);
  for (const [i, q] of manifest.entries()) {
    const expected = keys.get(`${q.id}:${q.version}`);
    assert.equal(
      mb.review[i].correctOptionId === expected.answer,
      true,
      "Final key must match frozen version",
    );
    assert.equal(
      mb.review[i].explanation === expected.explanation,
      true,
      "Final explanation must match frozen version",
    );
    assert.equal(typeof mb.review[i].explanation, "string");
    assert(mb.review[i].explanation.length >= 20);
  }
  const before = sql(
    `select md5(string_agg(to_jsonb(t)::text,'' order by player_id)) from quiz_private.score_ledger t where match_id='${main.id}';`,
  );
  const repeated = await command(a, "answer", first);
  assert.equal(repeated.state, "completed");
  await command(a, "answer", { ...first, requestId: randomUUID() }, 410);
  assert.equal(
    sql(
      `select count(*) from quiz_private.score_ledger where match_id='${main.id}';`,
    ),
    "2",
  );
  assert.equal(
    sql(
      `select md5(string_agg(to_jsonb(t)::text,'' order by player_id)) from quiz_private.score_ledger t where match_id='${main.id}';`,
    ),
    before,
  );
  pass(
    "Identical frozen v13 manifest for A/B, separate answers, server 800–600 score, wrong-answer explanations only at completion; terminal retries cannot alter ledger",
  );
  // Finish the pre-activation synthetic match without touching its manifest.
  for (const user of [a, b]) {
    let v = await command(user, "start", { matchId: old.id });
    assert.equal(v.scope, "synthetic_test");
    assert.deepEqual(v.questions, oldStarted.questions);
    for (let i = 0; i < 10; i++)
      v = await command(user, "answer", {
        matchId: old.id,
        position: i + 1,
        optionId: option(v.questions[i], i < 7),
        requestId: randomUUID(),
      });
    if (user === b) {
      assert.equal(v.result.winner, "tie");
      assert.deepEqual(
        v.players.map((p) => p.score),
        [700, 700],
      );
    }
  }
  pass(
    "An existing synthetic match completes 700–700 unchanged while v13 is active",
  );
  tie = await command(b, "create", { requestId: randomUUID() });
  await command(a, "join", { token: tie.inviteToken });
  for (const user of [b, a]) {
    let v = await command(user, "start", { matchId: tie.id });
    for (let i = 0; i < 10; i++)
      v = await command(user, "answer", {
        matchId: tie.id,
        position: i + 1,
        optionId: option(v.questions[i], i < 7),
        requestId: randomUUID(),
      });
    tie = v;
  }
  assert.equal(tie.result.winner, "tie");
  assert.deepEqual(
    tie.players.map((p) => p.score),
    [700, 700],
  );
  pass("Independent v13 match resolves a 700–700 tie");
  // Keep one fresh v13 invitation for real browser acceptance after rollback.
  ui = await command(c, "create", { requestId: randomUUID() });
  await writeFile(
    resolve(privateDir, "v13-browser-fixtures.json"),
    JSON.stringify({ url, publishableKey: key, users, matchId: main.id, ui }),
    { mode: 0o600 },
  );
} finally {
  sql(
    "update quiz_private.online_content_config set active_scope='synthetic_test' where singleton=true;",
  );
  assert.equal(
    sql("select active_scope from quiz_private.online_content_config;"),
    "synthetic_test",
  );
}
const restored = await command(b, "create", { requestId: randomUUID() });
assert.equal(restored.scope, "synthetic_test");
assert.equal(
  (await command(c, "get", { matchId: ui.id })).scope,
  "owner_approved_v13",
);
pass(
  "Scope restored to synthetic_test; new matches are synthetic while frozen v13 matches retain their scope",
);
const report = {
  environment: "real-local-supabase",
  checks,
  groups: checks.length,
  scopeAtEnd: "synthetic_test",
  result: { scores: [800, 600], correct: [8, 6], wrong: [2, 4] },
  tie: [700, 700],
  remoteContacted: false,
  physicalDeviceTest: false,
  networkMethod:
    "Real TCP response drop after commit, connection refusal before send, real Auth refresh and server resume",
  browserAcceptance: "separate",
};
await writeFile(
  resolve(privateDir, "v13-integration-report.json"),
  JSON.stringify(report, null, 2),
  { mode: 0o600 },
);
console.log(
  `${checks.length} v13 integration groups passed; active scope restored. No answer keys logged.`,
);
