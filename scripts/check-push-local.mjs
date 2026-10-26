// Uses only an existing local Supabase Docker schema. Never connects to hosted DBs.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const docker = process.env.DOCKER_BIN ?? "docker";
const container =
  process.env.PUSH_TEST_CONTAINER ?? "supabase_db_anla-ezberle-quiz-dev-local";
if (!/^supabase_db_[a-zA-Z0-9_-]+$/.test(container))
  throw Error("An explicit local Supabase container is required");
const database = `anla_push_acceptance_${Date.now()}`;
const run = (args, input) =>
  execFileSync(docker, args, {
    input,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"],
  });
const psql = (db, sql) =>
  run(
    [
      "exec",
      "-i",
      container,
      "psql",
      "-U",
      "supabase_admin",
      "-d",
      db,
      "-v",
      "ON_ERROR_STOP=1",
    ],
    sql,
  );
try {
  const schema = run([
    "exec",
    container,
    "pg_dump",
    "-U",
    "supabase_admin",
    "-d",
    "postgres",
    "--schema-only",
    "--no-owner",
  ]);
  // pg_cron is pinned by Supabase to postgres. It is provider scheduling metadata,
  // not part of this feature; no scheduler extension/ACL is copied to the fixture.
  const blocks = schema.split("\n--\n-- Name:");
  const isolated = [
    blocks[0],
    ...blocks.slice(1).filter((b) => !b.toLowerCase().includes("cron")),
  ].join("\n--\n-- Name:");
  psql("postgres", `CREATE DATABASE ${database};`);
  psql(database, isolated);
  psql(
    database,
    readFileSync(
      "supabase/migrations/20261025000100_push_notifications.sql",
      "utf8",
    ),
  );
  const result = psql(
    database,
    readFileSync("supabase/tests/push_notifications.sql", "utf8"),
  );
  console.log(
    `Isolated local fixture ${database}; no source data copied or changed.`,
  );
  console.log(result.trim());
} catch (error) {
  console.error("Local push acceptance failed; no hosted connection was used.");
  console.error(String(error.stderr ?? error.message).slice(-2500));
  process.exitCode = 1;
}
