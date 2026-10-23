import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { mkdtemp, readFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { bankV13 } from "../src/content/questions/archive/bank-v13";
import { buildOnlineContentRows, buildOnlineSeedSql } from "../scripts/online-content-export";

test("export CLI runs in this CommonJS project, creates private SQL once and refuses unsafe destinations", async () => {
  const dir = await mkdtemp(join(tmpdir(), "quiz-export-test-"));
  const destination = join(dir, "private.sql");
  const run = (out: string) =>
    spawnSync(
      process.execPath,
      ["--import", "tsx", "scripts/export-online-content.ts", "--out", out],
      { encoding: "utf8" },
    );
  try {
    assert.equal(
      run(destination).status,
      0,
      "CLI must execute, not just pass TypeScript",
    );
    assert.equal((await stat(destination)).mode & 0o777, 0o600);
    const original = await readFile(destination);
    const retry = run(destination);
    assert.notEqual(retry.status, 0);
    assert.equal(
      (await readFile(destination)).equals(original),
      true,
      "Existing private SQL must remain unchanged",
    );
    assert.equal(
      (retry.stdout + retry.stderr).includes(destination),
      false,
      "Never log the private destination",
    );
    assert.notEqual(
      run(join(process.cwd(), "unsafe-online-seed.sql")).status,
      0,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("online content staging uses exactly 500 source-linked, conditionally owner-approved questions", () => {
  const rows = buildOnlineContentRows();
  assert.equal(rows.length, 500);
  assert.equal(new Set(rows.map(q => q.id)).size, 500);
  assert.deepEqual([...new Set(rows.map(q => q.contentScope))], ["owner_approved_v13"]);
  assert.equal(rows.filter(q => q.categoryId === "quran").length > 100, true);
  assert.equal(rows.filter(q => q.categoryId === "prophets").length > 100, true);
  assert.ok(rows.every(q => q.version >= 1 && q.options.length === 4));
  for (const row of rows) {
    assert.equal(new Set(row.options.map(o => o.id)).size, 4);
    const original = bankV13.find(q => q.id === row.id)!;
    assert.equal(row.options.find(o => o.id === row.correctOptionId)?.text,
      original.options.find(o => o.id === original.correctOptionId)?.text);
    assert.equal(row.explanation, original.explanation);
    assert.equal(row.prompt, original.question);
    assert.equal(row.options.some(o => o.text === ""), false);
  }
});

test("private seed is replayable, guards immutable conflicts and never activates online content", () => {
  const sql = buildOnlineSeedSql(buildOnlineContentRows());
  assert.ok(sql.startsWith("-- v13"));
  assert.ok(sql.includes("BEGIN;"));
  assert.ok(sql.includes("COMMIT;"));
  assert.ok(sql.includes("ON CONFLICT DO NOTHING"));
  assert.ok(sql.includes("Immutable question/version conflict"));
  assert.ok(sql.includes("owner_approved_v13"));
  assert.equal(sql.includes("UPDATE quiz_private.online_content_config"), false);
  assert.equal(sql.includes("DELETE FROM quiz_private"), false);
  assert.equal(sql.includes("SET active_scope"), false);
});

test("online importer rejects incomplete or unsigned question collections", () => {
  assert.throws(() => buildOnlineContentRows(bankV13.slice(0, 499)), /exactly 500/);
  assert.throws(() => buildOnlineContentRows([...bankV13.slice(0,499), bankV13[0]!]), /Duplicate/);
  assert.throws(() => buildOnlineContentRows([...bankV13.slice(0,499), {...bankV13[499]!,reviewStatus:"draft"}]), /Source/);
  assert.throws(() => buildOnlineSeedSql([]), /Incomplete/);
});

test("staging migration is off by default, restricts client SQL and preserves existing match scope", () => {
  const migration = readFileSync(new URL("../supabase/migrations/20261019000200_online_content_v13.sql", import.meta.url), "utf8");
  assert.match(migration, /active_scope text not null default 'synthetic_test'/);
  assert.match(migration, /force row level security/);
  assert.match(migration, /revoke all on quiz_private\.online_content_config from public, anon, authenticated/);
  assert.match(migration, /'scope',m\.content_scope/);
  assert.match(migration, /where content_scope=selected_scope/);
  assert.match(migration, /before update of content_scope/);
  assert.match(migration, /<> 500/);
  assert.match(migration, /revoke all on function public\.online_duel_command\(uuid,text,jsonb\)/);
  assert.doesNotMatch(migration, /set active_scope = 'owner_approved_v13'/i);
});
