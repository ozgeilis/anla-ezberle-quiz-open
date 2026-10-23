import { createClient } from "@supabase/supabase-js";
// Explicit isolated local / closed-development target only. Never prints credentials.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
const remote = process.argv.includes("--closed-dev");
assert(
  remote || process.argv.includes("--local"),
  "Explicit test target required",
);
const ref = "mqyuihiobkomjfipxehj";
const cli = process.env.QUIZ_SUPABASE_BIN ?? "supabase";
let url, key, users;
if (remote) {
  const projects = JSON.parse(
    execFileSync(cli, ["projects", "list", "--output-format", "json"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }),
  );
  assert(
    projects.projects.some(
      (p) =>
        p.ref === ref &&
        p.name === "anla-ezberle-quiz-dev" &&
        p.region === "eu-central-1",
    ),
  );
  url = `https://${ref}.supabase.co`;
  const env = await readFile(process.env.SOCIAL_CLIENT_ENV, "utf8");
  key = env.match(/^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m)?.[1]?.trim();
  users = JSON.parse(
    await readFile(
      join(homedir(), ".local/share/anla-quiz-dev", ref, "testers.json"),
      "utf8",
    ),
  ).users;
} else {
  const cfg = JSON.parse(
    await readFile("/tmp/anla-online500-20261019/local-status.json", "utf8"),
  );
  assert.equal(cfg.API_URL, "http://127.0.0.1:55431");
  url = cfg.API_URL;
  key = cfg.PUBLISHABLE_KEY;
  users = JSON.parse(
    await readFile(
      "/tmp/anla-online500-20261019/v13-browser-fixtures.json",
      "utf8",
    ),
  ).users;
}
function sql(query) {
  try {
    if (remote) {
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
      return result.rows?.[0] ? Object.values(result.rows[0])[0] : null;
    }
    const raw = execFileSync(
      process.env.QUIZ_DOCKER_BIN ?? "docker",
      [
        "exec",
        "-i",
        "supabase_db_anla-ezberle-quiz-dev-local",
        "psql",
        "-U",
        "postgres",
        "-d",
        "postgres",
        "-At",
        "-v",
        "ON_ERROR_STOP=1",
      ],
      { input: query, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
    ).trim();
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch {
    throw new Error("Database test failed (private output suppressed)");
  }
}
for (const u of users) {
  const r = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: u.email, password: u.password }),
  });
  assert.equal(r.status, 200, "Test account login");
  u.jwt = (await r.json()).access_token;
}
const checks = [];
const pass = (name) => {
  checks.push(name);
  console.log(`PASS ${name}`);
};
async function command(user, operation, body = {}, expected = 200) {
  let data, status;
  if (remote) {
    const r = await fetch(`${url}/functions/v1/online-duel`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${user.jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operation, body }),
    });
    status = r.status;
    data = await r.json();
  } else {
    data = sql(
      `select ${["self", "get", "start", "answer", "invite"].includes(operation) ? "public.online_duel_command" : ["social_profile", "social_self", "player_search"].includes(operation) ? "public.player_social_command" : "public.player_matchmaking_command"}('${user.id}','${operation}','${JSON.stringify(body).replaceAll("'", "''")}'::jsonb);`,
    );
    status = data?.status ?? 200;
  }
  assert.equal(
    status,
    expected,
    `${operation} expected ${expected}, received ${status}`,
  );
  return data;
}
const [a, b, c] = users;
const ids = users.map((u) => `'${u.id}'`).join(",");

const snapshot = sql(
  `select jsonb_agg(row_to_json(p)) from quiz_private.player_profiles p where id in (${ids});`,
);
const started = sql("select now()::text;");
const marker = randomUUID().replaceAll("-", "").slice(0, 7);
let acceptedId, matchId;
const realtime = [];
let intruderEvents = 0;
const sockets = [];
async function rpc(user, operation, body = {}, status = 200) {
  return command(user, operation, body, status);
}
try {
  for (let i = 0; i < users.length; i++)
    await rpc(users[i], "social_profile", {
      username: `duel_${i}_${marker}`,
      name: `Test oyuncu ${users[i].role.toUpperCase()}`,
      avatar: i,
      discoverable: i !== 2,
    });
  if (remote) {
    for (const [u, isIntruder] of [
      [b, false],
      [c, true],
    ]) {
      const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${u.jwt}` } },
      });
      await client.realtime.setAuth(u.jwt);
      sockets.push(client);
      await new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error("Realtime subscription timed out")),
          20000,
        );
        client
          .channel(`acceptance-${marker}-${u.role}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "player_notifications",
              filter: `recipient_id=eq.${b.id}`,
            },
            (payload) => {
              if (isIntruder) intruderEvents++;
              else realtime.push(payload.new);
            },
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              clearTimeout(timer);
              resolve();
            } else if (status === "CHANNEL_ERROR") {
              clearTimeout(timer);
              reject(new Error("Realtime subscription failed"));
            }
          });
      });
    }
  }
  await rpc(
    a,
    "challenge_send",
    { playerId: a.id, requestId: randomUUID() },
    409,
  );
  await rpc(
    a,
    "challenge_send",
    { playerId: c.id, requestId: randomUUID() },
    404,
  );
  await rpc(
    a,
    "challenge_send",
    { playerId: "invalid", requestId: randomUUID() },
    400,
  );
  pass("self, hidden opponent and malformed challenge rejected");
  const requestId = randomUUID();
  const sent = await rpc(a, "challenge_send", { playerId: b.id, requestId });
  acceptedId = sent.challenge.id;
  const retry = await rpc(a, "challenge_send", { playerId: b.id, requestId });
  assert.equal(retry.challenge.id, acceptedId);
  await rpc(
    a,
    "challenge_send",
    { playerId: b.id, requestId: randomUUID() },
    409,
  );
  await rpc(
    b,
    "challenge_send",
    { playerId: a.id, requestId: randomUUID() },
    409,
  );
  await rpc(a, "challenge_send", { playerId: c.id, requestId }, 409);
  await rpc(
    a,
    "challenge_reply",
    { challengeId: acceptedId, action: "accept" },
    403,
  );
  await rpc(
    c,
    "challenge_reply",
    { challengeId: acceptedId, action: "accept" },
    404,
  );
  const pending = (await rpc(b, "inbox")).challenges.find(
    (d) => d.id === acceptedId,
  );
  assert(pending.incoming);
  assert.equal(pending.state, "pending");
  pass("challenge is idempotent, pair-unique and recipient-only");
  const accepted = await Promise.all([
    rpc(b, "challenge_reply", { challengeId: acceptedId, action: "accept" }),
    rpc(b, "challenge_reply", { challengeId: acceptedId, action: "accept" }),
  ]);
  matchId = accepted[0].challenge.matchId;
  assert(matchId);
  assert.equal(accepted[1].challenge.matchId, matchId);
  assert.equal(
    Number(
      sql(
        `select count(*) from quiz_private.quiz_sessions where match_id='${matchId}';`,
      ),
    ),
    2,
  );
  let first = await rpc(a, "get", { matchId }),
    second = await rpc(b, "get", { matchId });
  assert.equal(first.direct, true);
  assert.equal(second.direct, true);
  assert.equal(first.questions.length, 0);
  assert.equal(second.questions.length, 0);
  await rpc(c, "get", { matchId }, 404);
  await rpc(a, "invite", { matchId }, 409);
  second = await rpc(b, "start", { matchId });
  first = await rpc(a, "start", { matchId });
  assert.deepEqual(first.questions, second.questions);
  assert.equal(first.questions.length, 10);
  assert(!JSON.stringify(first.questions).includes("correctOptionId"));
  assert.equal(first.review.length, 0);
  pass(
    "concurrent acceptance creates exactly one shared match; both players start independently",
  );
  for (const u of [a, b]) {
    for (let i = 0; i < 10; i++) {
      const q = first.questions[i];
      const correct = sql(
        `select correct_option_id from quiz_private.quiz_answer_keys where question_id='${q.id.replaceAll("'", "''")}' and question_version=${q.version};`,
      );
      const body = {
        matchId,
        position: i + 1,
        optionId: correct,
        requestId: randomUUID(),
      };
      const answer = await rpc(u, "answer", body);
      if (i === 0) {
        const repeated = await rpc(u, "answer", body);
        assert.deepEqual(repeated.answers, answer.answers);
      }
      if (u === a) {
        assert.equal(answer.review.length, 0);
        assert(answer.players.every((p) => p.score === null));
      }
    }
  }
  const result = await rpc(a, "get", { matchId });
  assert.equal(result.state, "completed");
  assert.equal(result.review.length, 10);
  assert.equal(result.result.winner, "tie");
  assert(result.players.every((p) => p.score === 1000));
  assert.equal(
    Number(
      sql(
        `select count(*) from quiz_private.score_ledger where match_id='${matchId}';`,
      ),
    ),
    2,
  );
  pass(
    "ten locked answers per player produce one authoritative result and ledger; no early answer disclosure",
  );
  let invite = (
    await rpc(a, "challenge_send", { playerId: b.id, requestId: randomUUID() })
  ).challenge;
  await rpc(
    b,
    "challenge_reply",
    { challengeId: invite.id, action: "cancel" },
    403,
  );
  await rpc(b, "challenge_reply", {
    challengeId: invite.id,
    action: "decline",
  });
  await rpc(
    b,
    "challenge_reply",
    { challengeId: invite.id, action: "accept" },
    410,
  );
  invite = (
    await rpc(a, "challenge_send", { playerId: b.id, requestId: randomUUID() })
  ).challenge;
  await rpc(a, "challenge_reply", { challengeId: invite.id, action: "cancel" });
  invite = (
    await rpc(a, "challenge_send", { playerId: b.id, requestId: randomUUID() })
  ).challenge;
  sql(
    `update quiz_private.direct_challenges set expires_at=now()-interval '1 second' where id='${invite.id}';`,
  );
  await rpc(
    b,
    "challenge_reply",
    { challengeId: invite.id, action: "accept" },
    410,
  );
  pass("decline, sender cancellation and expiry prevent match creation");
  const inbox = await rpc(b, "inbox");
  const notification = inbox.notifications.find(
    (n) => n.referenceId === acceptedId && n.kind === "challenge_received",
  );
  assert(notification);
  await rpc(c, "notification_read", { notificationId: notification.id }, 404);
  await rpc(b, "notification_read", { notificationId: notification.id });
  assert(
    (await rpc(b, "inbox")).notifications.find((n) => n.id === notification.id)
      .read,
  );
  assert(
    inbox.notifications.some(
      (n) => n.kind === "match_completed" && n.referenceId === matchId,
    ),
  );
  pass(
    "durable inbox, result notifications and owner-only read acknowledgement",
  );
  const flags = sql("select public.online_service_capabilities();");
  assert.equal(typeof flags.registrationEnabled, "boolean");
  assert.equal(
    sql(
      "select jsonb_build_object('allowed',has_function_privilege('authenticated','public.player_matchmaking_command(uuid,text,jsonb)','execute'));",
    ).allowed,
    false,
  );
  sql(
    `update quiz_private.player_profiles set challenge_count=20,challenge_window=now() where id='${a.id}';`,
  );
  await rpc(
    a,
    "challenge_send",
    { playerId: b.id, requestId: randomUUID() },
    429,
  );
  pass("server challenge quota and service-only command enforced");
  if (!remote) {
    const userId = randomUUID(),
      anonymousId = randomUUID();
    const oldFlag = sql(
      "select public.online_service_capabilities();",
    ).registrationEnabled;
    try {
      sql(
        `insert into auth.users(id,email_confirmed_at,is_anonymous) values('${userId}',now(),false),('${anonymousId}',null,true);`,
      );
      sql(
        "update quiz_private.player_service_config set public_enrollment_enabled=false where singleton;",
      );
      await rpc({ id: userId }, "account_bootstrap", {}, 403);
      await rpc({ id: anonymousId }, "account_bootstrap", {}, 401);
      sql(
        "update quiz_private.player_service_config set public_enrollment_enabled=true where singleton;",
      );
      await rpc({ id: userId }, "account_bootstrap");
      await rpc({ id: userId }, "account_bootstrap");
      assert.equal(
        Number(
          sql(
            `select count(*) from quiz_private.player_profiles where id='${userId}' and username is null and not discoverable;`,
          ),
        ),
        1,
      );
      sql(
        `update quiz_private.player_profiles set access_enabled=false where id='${userId}';`,
      );
      await rpc({ id: userId }, "account_bootstrap", {}, 403);
      pass(
        "verified public enrollment is gated and idempotent; anonymous and revoked accounts cannot enroll",
      );
    } finally {
      sql(`delete from auth.users where id in('${userId}','${anonymousId}');`);
      sql(
        `update quiz_private.player_service_config set public_enrollment_enabled=${oldFlag} where singleton;`,
      );
    }
  }
  if (remote) {
    const deadline = Date.now() + 10000;
    while (
      !realtime.some((n) => n.reference_id === acceptedId) &&
      Date.now() < deadline
    )
      await new Promise((r) => setTimeout(r, 100));
    assert(
      realtime.some((n) => n.reference_id === acceptedId),
      "Recipient receives real Realtime insert",
    );
    assert.equal(intruderEvents, 0);
    const { data, error } = await sockets[1]
      .from("player_notifications")
      .select("id")
      .eq("recipient_id", b.id);
    assert.equal(error, null);
    assert.deepEqual(data, []);
    const { error: writeError } = await sockets[1]
      .from("player_notifications")
      .insert({
        recipient_id: b.id,
        kind: "challenge_received",
        reference_id: acceptedId,
      });
    assert(writeError);
    pass(
      "real WebSocket delivery and REST/Realtime RLS reject cross-account reads and fabricated notifications",
    );
  }
} finally {
  for (const client of sockets) await client.removeAllChannels();
  sql(
    `update quiz_private.direct_challenges set state='cancelled' where sender in (${ids}) and recipient in (${ids}) and state='pending' and created_at>='${started}';`,
  );
  sql(
    `delete from public.player_notifications where recipient_id in (${ids}) and created_at>='${started}';`,
  );
  const literal = (v) =>
    v === null ? "null" : `'${String(v).replaceAll("'", "''")}'`;
  for (const p of snapshot) {
    sql(
      `update quiz_private.player_profiles set display_name=${literal(p.display_name)},username=${literal(p.username)},avatar=${p.avatar},discoverable=${p.discoverable},social_window=${literal(p.social_window)},social_count=${p.social_count},friend_window=${literal(p.friend_window)},friend_count=${p.friend_count},challenge_window=${literal(p.challenge_window)},challenge_count=${p.challenge_count},inbox_window=${literal(p.inbox_window)},inbox_count=${p.inbox_count} where id='${p.id}';`,
    );
  }
}
if (process.env.DIRECT_REPORT)
  await writeFile(
    process.env.DIRECT_REPORT,
    JSON.stringify(
      { target: remote ? "remote" : "local", checks, passed: true, matchId },
      null,
      2,
    ) + "\n",
  );
console.log(`${checks.length} direct challenge integration groups passed.`);
