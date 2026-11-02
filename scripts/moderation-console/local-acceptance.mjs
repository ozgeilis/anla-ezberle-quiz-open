// Real isolated GoTrue / Edge / PostgREST acceptance; never a hosted project.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const cfg = JSON.parse(readFileSync(process.env.SAFETY_STACK_FILE ?? ""));
const { users } = JSON.parse(
  readFileSync(process.env.SAFETY_FIXTURES_FILE ?? ""),
);
assert.equal(cfg.API_URL, "http://127.0.0.1:18571");
assert.equal(cfg.container, "supabase_db_anla-play-closed-20261030");
assert.match(cfg.database, /^anla_canonical_v73_[0-9]+$/);
const [moderator, reporter, target] = users;
for (const user of [moderator, reporter, target])
  assert.match(user.id, /^[a-f0-9-]{36}$/);
const sql = (query) =>
  execFileSync(
    "docker",
    [
      "exec",
      "-i",
      cfg.container,
      "psql",
      "-U",
      "postgres",
      "-d",
      cfg.database,
      "-X",
      "-A",
      "-t",
      "-v",
      "ON_ERROR_STOP=1",
    ],
    { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  ).trim();

async function call(path, body, token, expected) {
  const response = await fetch(cfg.API_URL + path, {
    method: "POST",
    headers: {
      apikey: cfg.PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, expected, `Unexpected HTTP status for ${path}`);
  return response.status === 204 ? {} : response.json();
}

const originalModerator = sql(
  `SELECT active FROM quiz_private.moderators WHERE actor='${moderator.id}';`,
);
const originalFlag = sql(
  "SELECT enabled FROM quiz_private.player_safety_config WHERE singleton;",
);
const marker = `Local console acceptance ${crypto.randomUUID()}`;
const sessions = [];
let step = "local fixture setup";
try {
  assert.equal(
    sql(
      `SELECT count(*) FROM quiz_private.social_restrictions WHERE actor='${target.id}';`,
    ),
    "0",
  );
  assert.equal(
    sql(
      `SELECT count(*) FROM quiz_private.player_reports WHERE reporter='${reporter.id}' AND target='${target.id}' AND reason='other' AND state='open';`,
    ),
    "0",
  );
  for (const user of [moderator, reporter]) {
    const session = await call(
      "/auth/v1/token?grant_type=password",
      { email: user.email, password: user.password },
      null,
      200,
    );
    assert.equal(session.user.id, user.id);
    sessions.push(session);
  }
  const [modSession, reportSession] = sessions;
  sql(
    `INSERT INTO quiz_private.moderators(actor,active) VALUES('${moderator.id}',true) ON CONFLICT(actor) DO UPDATE SET active=true; UPDATE quiz_private.player_safety_config SET enabled=true WHERE singleton;`,
  );
  step = "unauthorized moderator denial";
  await call(
    "/rest/v1/rpc/moderation_review",
    { operation: "queue" },
    reportSession.access_token,
    403,
  );
  step = "real report creation";
  await call(
    "/functions/v1/online-duel",
    {
      operation: "player_report",
      body: { playerId: target.id, reason: "other", details: marker },
    },
    reportSession.access_token,
    200,
  );
  step = "enrolled moderator queue";
  const queue = await call(
    "/rest/v1/rpc/moderation_review",
    { operation: "queue" },
    modSession.access_token,
    200,
  );
  const report = queue.reports.find((row) => row.details === marker);
  assert.ok(report);
  assert.equal(report.reporter, reporter.id);
  step = "audited decision";
  assert.equal(
    (
      await call(
        "/rest/v1/rpc/moderation_review",
        {
          operation: "restrict",
          report_id: report.id,
          note: "Local synthetic operator acceptance",
        },
        modSession.access_token,
        200,
      )
    ).saved,
    true,
  );
  const after = await call(
    "/rest/v1/rpc/moderation_review",
    { operation: "queue" },
    modSession.access_token,
    200,
  );
  assert.ok(!after.reports.some((row) => row.id === report.id));
  assert.equal(
    sql(
      `SELECT count(*) FROM quiz_private.social_restrictions WHERE actor='${target.id}';`,
    ),
    "1",
  );
  step = "restore via closed report ID";
  assert.equal(
    (
      await call(
        "/rest/v1/rpc/moderation_review",
        {
          operation: "restore",
          report_id: report.id,
          note: "Local synthetic appeal accepted",
        },
        modSession.access_token,
        200,
      )
    ).saved,
    true,
  );
  assert.equal(
    sql(
      `SELECT count(*) FROM quiz_private.social_restrictions WHERE actor='${target.id}';`,
    ),
    "0",
  );
  assert.equal(
    sql(
      `SELECT count(*) FROM quiz_private.moderation_audit WHERE report='${report.id}' AND moderator='${moderator.id}' AND decision IN('restrict','restore');`,
    ),
    "2",
  );
  step = "revoked-session denial";
  await call("/auth/v1/logout?scope=local", {}, modSession.access_token, 204);
  await call(
    "/rest/v1/rpc/moderation_review",
    { operation: "queue" },
    modSession.access_token,
    403,
  );
  sessions.shift();
  console.log(
    "PASS isolated real Auth + Edge + RPC: non-moderator denied, enrolled moderator reads private report, restrict/restore via closed report audited, resolved queue updated, signed-out JWT denied. No hosted traffic or account deletion.",
  );
} catch {
  console.error(
    `FAIL isolated moderator acceptance at: ${step}. Credentials and response payloads suppressed.`,
  );
  process.exitCode = 1;
} finally {
  for (const session of sessions) {
    await call(
      "/auth/v1/logout?scope=local",
      {},
      session.access_token,
      204,
    ).catch(() => {
      process.exitCode = 1;
    });
  }
  sql(
    originalModerator === ""
      ? `DELETE FROM quiz_private.moderators WHERE actor='${moderator.id}';`
      : `UPDATE quiz_private.moderators SET active=${originalModerator === "t"} WHERE actor='${moderator.id}';`,
  );
  sql(
    `UPDATE quiz_private.player_safety_config SET enabled=${originalFlag === "t"} WHERE singleton;`,
  );
}
