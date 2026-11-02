// Real GoTrue hard-delete acceptance in the existing disposable local stack.
// Never accepts a hosted URL, never writes passwords/tokens to output or disk.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const cfg = JSON.parse(
  readFileSync(process.env.SAFETY_STACK_FILE ?? "", "utf8"),
);
const { users } = JSON.parse(
  readFileSync(process.env.SAFETY_FIXTURES_FILE ?? "", "utf8"),
);
assert.equal(cfg.API_URL, "http://127.0.0.1:18571");
assert.equal(cfg.container, "supabase_db_anla-play-closed-20261030");
assert.match(cfg.database, /^anla_canonical_v73_[0-9]+$/);
const other = users[0].id;
assert.match(other, /^[a-f0-9-]{36}$/);
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
async function admin(path, method, body) {
  const response = await fetch(cfg.API_URL + path, {
    method,
    headers: {
      apikey: cfg.SERVICE_ROLE_KEY,
      Authorization: `Bearer ${cfg.SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  assert(
    response.ok,
    `Local admin request failed with HTTP ${response.status}`,
  );
  return response.status === 204 ? {} : response.json();
}
let actor;
let report;
let audit;
try {
  const created = await admin("/auth/v1/admin/users", "POST", {
    email: `moderation-erasure-${crypto.randomUUID()}@example.invalid`,
    password: crypto.randomUUID() + "Aa1!",
    email_confirm: true,
  });
  actor = created.id;
  assert.match(actor, /^[a-f0-9-]{36}$/);
  report = crypto.randomUUID();
  audit = crypto.randomUUID();
  sql(`INSERT INTO quiz_private.player_reports(id,reporter,target,reason,details,name_snapshot,username_snapshot)
    VALUES('${report}','${other}','${actor}','other','Synthetic personal evidence','Synthetic name','synthetic_name');
    INSERT INTO quiz_private.moderation_audit(id,moderator,report,target,decision,note)
    VALUES('${audit}','${other}','${report}','${actor}','warn','Synthetic personal audit');
    UPDATE quiz_private.account_deletion_config SET test_actors=array_append(test_actors,'${actor}'::uuid) WHERE singleton;`);
  assert.equal(
    (await admin("/rest/v1/rpc/prepare_account_deletion", "POST", { actor }))
      .ready,
    true,
  );
  await admin(`/auth/v1/admin/users/${actor}`, "DELETE", {
    should_soft_delete: false,
  });
  assert.equal(
    sql(`SELECT count(*) FROM auth.users WHERE id='${actor}';`),
    "0",
  );
  assert.equal(
    sql(`SELECT count(*) FROM quiz_private.player_reports WHERE id='${report}' AND target IS NULL
    AND details='' AND username_snapshot IS NULL AND name_snapshot='Silinen hesapla ilişkili kayıt' AND state='dismissed';`),
    "1",
  );
  assert.equal(
    sql(`SELECT count(*) FROM quiz_private.moderation_audit WHERE id='${audit}' AND target IS NULL
    AND note='Hesap silme nedeniyle kaldırıldı.';`),
    "1",
  );
  assert.equal(
    sql(`SELECT count(*) FROM auth.users WHERE id='${other}';`),
    "1",
  );
  console.log(
    JSON.stringify({
      passed: true,
      hosted: false,
      transport: "GoTrue Admin HTTP hard delete",
      authorizedIntent: true,
      authAccountDeleted: true,
      reportTextRemoved: true,
      auditTextRemoved: true,
      otherAccountPreserved: true,
    }),
  );
} finally {
  // All actors/evidence created above are disposable local fixtures only.
  if (actor) {
    if (sql(`SELECT count(*) FROM auth.users WHERE id='${actor}';`) === "1")
      await admin(`/auth/v1/admin/users/${actor}`, "DELETE", {
        should_soft_delete: false,
      });
    sql(
      `UPDATE quiz_private.account_deletion_config SET test_actors=array_remove(test_actors,'${actor}'::uuid) WHERE singleton;`,
    );
  }
  if (audit)
    sql(`DELETE FROM quiz_private.moderation_audit WHERE id='${audit}';`);
  if (report)
    sql(`DELETE FROM quiz_private.player_reports WHERE id='${report}';`);
}
