// Ephemeral GitHub CI Supabase only. Never run against a developer/hosted database.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
assert.equal(process.env.CI, "true");
const cfg = JSON.parse(await readFile(process.argv[2], "utf8"));
assert.equal(cfg.API_URL, "http://127.0.0.1:55431");
assert(cfg.PUBLISHABLE_KEY?.startsWith("sb_publishable_"));
const client = createClient(cfg.API_URL, cfg.SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const users = [];
for (const role of ["a", "b", "c"]) {
  const email = `ranking-ci-${role}-${randomUUID()}@example.invalid`,
    password = randomUUID() + "Aa!42";
  const { data, error } = await client.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  assert(!error && data.user, "CI identity creation");
  users.push({ id: data.user.id, email, password, role });
}
const sql = users
  .map(
    (u) =>
      `insert into quiz_private.player_profiles(id,display_name,access_enabled) values('${u.id}','CI oyuncu ${u.role.toUpperCase()}',true) on conflict(id) do update set access_enabled=true;`,
  )
  .join("\n");
execFileSync(
  "docker",
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
  ],
  { input: sql, stdio: ["pipe", "pipe", "pipe"] },
);
await mkdir("/tmp/anla-online500-20261019", { recursive: true, mode: 0o700 });
await writeFile(
  "/tmp/anla-online500-20261019/local-status.json",
  JSON.stringify(cfg),
  { mode: 0o600 },
);
await writeFile(
  "/tmp/anla-online500-20261019/v13-browser-fixtures.json",
  JSON.stringify({ users }),
  { mode: 0o600 },
);
console.log(
  "Three ephemeral CI identities prepared; no hosted accounts or score seeds.",
);
