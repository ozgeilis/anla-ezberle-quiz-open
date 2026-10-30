// Schema-only copy into an isolated local database. No hosted connection,
// account export, Edge deployment, scheduler change or real data is performed.
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
import {
  buildOnlineContentRows,
  buildOnlineSeedSql,
  canonicalBankForExport,
} from "./online-content-export";
import { liveContentSql } from "./live-content";
import { legacyServerSeed } from "../tests/fixtures/content/legacy-server-content";
const output = resolve(process.argv[2] ?? "");
if (
  !isAbsolute(process.argv[2] ?? "") ||
  !relative(process.cwd(), output).startsWith(".." + sep)
)
  throw Error("Private output outside repository required");
mkdirSync(output, { recursive: true, mode: 0o700 });
const container = "supabase_db_anla-ezberle-quiz-dev-local";
const db = `anla_canonical_v73_${Date.now()}`;
const docker = (args: string[], input?: string) => {
  const result = spawnSync("docker", args, {
    input,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  if (result.error || result.status !== 0)
    throw Error(result.stderr || "Local Docker command failed");
  return result.stdout + (args.includes("psql") ? result.stderr : "");
};
const sql = (query: string, database = db) =>
  docker(
    [
      "exec",
      "-i",
      container,
      "psql",
      "-U",
      "supabase_admin",
      "-d",
      database,
      "-v",
      "ON_ERROR_STOP=1",
      "-At",
    ],
    query,
  );
try {
  const schema = docker([
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
  const blocks = schema.split("\n--\n-- Name:");
  const isolated = [
    blocks[0],
    ...blocks.slice(1).filter((b) => !b.toLowerCase().includes("cron")),
  ].join("\n--\n-- Name:");
  sql(`CREATE DATABASE ${db};`, "postgres");
  sql(isolated);
  sql(`DROP SCHEMA quiz_private CASCADE;
DROP TABLE IF EXISTS public.player_notifications CASCADE;
DO $$ DECLARE f record; BEGIN FOR f IN SELECT p.oid::regprocedure signature FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.prosrc LIKE '%quiz_private%' LOOP EXECUTE 'DROP FUNCTION IF EXISTS '||f.signature||' CASCADE'; END LOOP; END $$;`);
  for (const file of readdirSync("supabase/migrations").sort()) {
    if (file >= "20261027000100") continue;
    const content = readFileSync(`supabase/migrations/${file}`, "utf8")
      .replace(/^CREATE EXTENSION IF NOT EXISTS pg_cron;$/gm, "")
      .replace(/^SELECT cron\.schedule\(.*$/gm, "");
    sql(content);
  }
  sql(readFileSync("supabase/seed.sql", "utf8"));
  sql(legacyServerSeed());
  sql(readFileSync("supabase/tests/canonical_bank_before.sql", "utf8"));
  sql(
    readFileSync(
      "supabase/migrations/20261027000100_canonical_bank_v72.sql",
      "utf8",
    ),
  );
  const asyncSeed = buildOnlineSeedSql(
      buildOnlineContentRows(canonicalBankForExport(72), 72),
      72,
    ),
    liveSeed = liveContentSql(72);
  writeFileSync(resolve(output, "async-v72.private.sql"), asyncSeed, {
    mode: 0o600,
  });
  writeFileSync(resolve(output, "live-v72.private.sql"), liveSeed, {
    mode: 0o600,
  });
  sql(asyncSeed);
  sql(liveSeed);
  sql(asyncSeed); // immutable shared rows + replay safe
  const result = sql(readFileSync("supabase/tests/canonical_bank.sql", "utf8"));
  console.log(result);
  sql(
    readFileSync(
      "supabase/migrations/20261030000100_canonical_bank_v73.sql",
      "utf8",
    ),
  );
  const nextAsync = buildOnlineSeedSql(buildOnlineContentRows());
  const nextLive = liveContentSql();
  writeFileSync(resolve(output, "async-v73.private.sql"), nextAsync, {
    mode: 0o600,
  });
  writeFileSync(resolve(output, "live-v73.private.sql"), nextLive, {
    mode: 0o600,
  });
  sql(nextAsync);
  sql(nextLive);
  sql(nextAsync);
  // Exercise the same server acceptance contract for both canonical releases.
  const contract = readFileSync("supabase/tests/canonical_bank.sql", "utf8");
  console.log(sql(contract.replaceAll("'bank-v72'", "'bank-v73'")));
  console.log(
    sql(readFileSync("supabase/tests/canonical_bank_v73.sql", "utf8")),
  );
  console.log(sql(contract));
  for (const file of [
    "async_recent_questions.sql",
    "live_recent_questions.sql",
    "live_ten_seconds.sql",
  ])
    console.log(sql(readFileSync(`supabase/tests/${file}`, "utf8")));
  console.log(
    `PASS isolated v72/v73 database ${db}; schema only, historical fixtures, both canonical releases, immutable keys and SQL acceptance. No remote contact.`,
  );
} catch (error) {
  writeFileSync(
    resolve(output, "local-error.private.log"),
    String(error instanceof Error ? error.message : error),
    { mode: 0o600 },
  );
  console.error(
    `Local canonical acceptance failed; private SQL and error retained outside repository (${db}).`,
  );
  // Preserve the DB for diagnosis without logging question data or credentials.
  process.exitCode = 1;
}
