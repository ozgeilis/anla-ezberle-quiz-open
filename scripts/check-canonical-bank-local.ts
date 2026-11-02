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
// Follow the configured ephemeral project instead of a developer's old AVD
// workspace. CI starts exactly this project and has no hosted credentials.
const projectId = readFileSync("supabase/config.toml", "utf8").match(
  /^project_id\s*=\s*"([a-zA-Z0-9_-]+)"/m,
)?.[1];
if (!projectId) throw Error("Local Supabase project_id is missing");
const container =
  process.env.SAFETY_LOCAL_CONTAINER ?? `supabase_db_${projectId}`;
if (!/^supabase_db_[a-zA-Z0-9_-]+$/.test(container))
  throw Error("Local Supabase container required");
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
  if (
    sql(
      "SELECT to_regclass('storage.s3_multipart_uploads') IS NOT NULL;",
      "postgres",
    ).trim() !== "t"
  )
    throw Error(
      "Local Storage must be initialized for account erasure assertions",
    );
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
DO $$ DECLARE f record; BEGIN FOR f IN SELECT p.oid::regprocedure signature FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND (p.prosrc LIKE '%quiz_private%' OR p.proname='apple_deletion_session') LOOP EXECUTE 'DROP FUNCTION IF EXISTS '||f.signature||' CASCADE'; END LOOP; END $$;`);
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
    "live_erasure_guard.sql",
  ])
    console.log(sql(readFileSync(`supabase/tests/${file}`, "utf8")));
  sql(readFileSync("supabase/tests/timing_before.sql", "utf8"));
  sql(
    readFileSync(
      "supabase/migrations/20261101053234_twenty_second_questions.sql",
      "utf8",
    ),
  );
  console.log(
    sql(readFileSync("supabase/tests/twenty_second_questions.sql", "utf8")),
  );
  sql(
    readFileSync(
      "supabase/migrations/20261101131615_direct_challenge_timing_protocol.sql",
      "utf8",
    ),
  );
  console.log(
    sql(readFileSync("supabase/tests/direct_challenge_timing.sql", "utf8")),
  );
  sql(
    readFileSync(
      "supabase/migrations/20261027000200_google_auth_closed_candidate.sql",
      "utf8",
    ),
  );
  sql(
    readFileSync(
      "supabase/migrations/20261101054043_google_signup_test_allowlist.sql",
      "utf8",
    ),
  );
  console.log(
    sql(
      readFileSync("supabase/tests/google_signup_test_allowlist.sql", "utf8"),
    ),
  );
  // Only derived display levels may change; hash complete synthetic row data.
  const snapshotSql = `SELECT jsonb_build_object(
    'profiles',(SELECT jsonb_agg(to_jsonb(p) ORDER BY id) FROM quiz_private.player_profiles p),
    'scores',(SELECT jsonb_agg(to_jsonb(s) ORDER BY match_id,player_id) FROM quiz_private.score_ledger s),
    'liveRewards',(SELECT jsonb_agg(to_jsonb(r) ORDER BY room_id,player_id) FROM quiz_private.live_rewards r),
    'matches',(SELECT jsonb_agg(to_jsonb(m) ORDER BY id) FROM quiz_private.matches m),
    'awards',(SELECT jsonb_agg(to_jsonb(a) ORDER BY player_id,badge_id) FROM quiz_private.achievement_awards a))::text;`;
  const levelRowsBefore = sql(snapshotSql);
  sql(
    readFileSync(
      "supabase/migrations/20261101065301_progressive_player_levels.sql",
      "utf8",
    ),
  );
  console.log(
    sql(readFileSync("supabase/tests/progressive_player_levels.sql", "utf8")),
  );
  if (sql(snapshotSql) !== levelRowsBefore)
    throw Error(
      "Display level migration changed existing synthetic player/game rows",
    );
  // Additive Apple deletion/safety changes must not rewrite historic game/XP rows.
  const safetyRowsBefore = sql(snapshotSql);
  for (const suffix of [
    "apple_deletion_revocation.sql",
    "player_safety_moderation.sql",
    "moderation_erasure_privacy.sql",
  ]) {
    const file = readdirSync("supabase/migrations").find((name) =>
      name.endsWith(suffix),
    );
    if (!file) throw Error(`Missing safety migration ${suffix}`);
    if (suffix === "moderation_erasure_privacy.sql")
      sql(readFileSync("supabase/tests/moderation_erasure_before.sql", "utf8"));
    sql(readFileSync(`supabase/migrations/${file}`, "utf8"));
    if (suffix === "moderation_erasure_privacy.sql")
      console.log(
        sql(
          readFileSync("supabase/tests/moderation_erasure_repair.sql", "utf8"),
        ),
      );
  }
  if (sql(snapshotSql) !== safetyRowsBefore)
    throw Error("Safety migration modified existing game/player rows");
  for (const file of [
    "apple_deletion.sql",
    "player_safety.sql",
    "google_signup_test_allowlist.sql",
  ]) {
    console.log(sql(readFileSync(`supabase/tests/${file}`, "utf8")));
  }
  // pg_dump --no-owner restores as supabase_admin. The production erasure
  // trigger is postgres-owned and its existing guards require that exact role.
  // Align only this throwaway harness; no hosted role/grant is changed.
  sql(`GRANT USAGE ON SCHEMA quiz_private,auth,storage TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA quiz_private,auth,storage TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA quiz_private,auth,storage TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA quiz_private TO postgres;
ALTER FUNCTION quiz_private.erase_authorized_player() OWNER TO postgres;`);
  console.log(sql(readFileSync("supabase/tests/account_deletion.sql", "utf8")));
  console.log(
    sql(readFileSync("supabase/tests/moderation_erasure_privacy.sql", "utf8")),
  );
  writeFileSync(
    resolve(output, "acceptance.json"),
    JSON.stringify(
      {
        passed: true,
        database: db,
        container,
        hosted: false,
        accountDataExported: false,
        sources: [
          "v72/v73",
          "20-second timing",
          "progressive XP",
          "Apple deletion and closed hook",
          "safety RLS/contact guards/moderation",
          "account erasure regression",
        ],
        playerRowsUnchangedBySafetyMigration: true,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `PASS isolated v72/v73 database ${db}; schema only, historical fixtures, both canonical releases, immutable keys and SQL acceptance. No remote contact.`,
  );
} catch (error) {
  writeFileSync(
    resolve(output, "local-error.private.log"),
    String(error instanceof Error ? error.message : error),
    { mode: 0o600 },
  );
  const diagnostic = String(error instanceof Error ? error.message : error)
    .split("\n")
    .filter((line) => /^(ERROR:|CONTEXT:)/.test(line))
    .map((line) =>
      line.replace(/[0-9a-f]{8}-[0-9a-f-]{27}/gi, "<fixture-id>").slice(0, 200),
    )
    .join("; ");
  console.error(
    `Local canonical acceptance failed; private SQL retained outside repository (${db}). ${diagnostic}`,
  );
  // Preserve the DB for diagnosis without logging question data or credentials.
  process.exitCode = 1;
}
