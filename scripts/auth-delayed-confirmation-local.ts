// Isolated GoTrue + Mailpit regression. Never contacts hosted Supabase.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { verifyEmailLink } from "../src/features/online/verifyLink";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}
function inboxMessages(value: unknown) {
  assert(isRecord(value) && Array.isArray(value.messages));
  return value.messages.map((message: unknown) => {
    assert(isRecord(message) && typeof message.ID === "string");
    const recipients = message.To ?? [];
    assert(Array.isArray(recipients));
    return {
      id: message.ID,
      recipients: recipients.map((to: unknown) => {
        assert(isRecord(to) && typeof to.Address === "string");
        return to.Address;
      }),
    };
  });
}

async function main() {
  const envFile = process.env.LOCAL_AUTH_ENV;
  assert(envFile, "Explicit local test configuration required");
  const text = await readFile(envFile, "utf8");
  const env = new Map(
    text.split(/\r?\n/).map((line) => {
      const at = line.indexOf("=");
      return [line.slice(0, at), line.slice(at + 1).replace(/^"(.*)"$/, "$1")];
    }),
  );
  const api = env.get("API_URL");
  const mailbox = env.get("MAILPIT_URL");
  assert(api === "http://127.0.0.1:55631");
  assert(mailbox === "http://127.0.0.1:55634");
  const key = env.get("PUBLISHABLE_KEY");
  assert(typeof key === "string" && key.startsWith("sb_publishable_"));
  const checks = [];
  for (const mode of ["pkce", "token_hash"] as const) {
    const values = new Map<string, string>();
    const client: SupabaseClient = createClient(api, key, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: false,
        autoRefreshToken: false,
        persistSession: true,
        storage: {
          getItem: (k: string) => values.get(k) ?? null,
          setItem: (k: string, v: string) => {
            values.set(k, v);
          },
          removeItem: (k: string) => {
            values.delete(k);
          },
        },
      },
    });
    const email = `delay-${randomUUID()}@example.invalid`;
    const signup = await client.auth.signUp({
      email,
      password: `Local_42!${randomUUID()}`,
      options: { emailRedirectTo: "anla-ezberle-quiz://online/auth" },
    });
    assert(!signup.error && signup.data.user && !signup.data.session);
    const id = signup.data.user.id;
    assert(/^[a-f0-9-]{36}$/.test(id));
    // Age only this disposable LOCAL fixture; never alter hosted auth rows.
    const age = spawnSync(
      process.env.LOCAL_DOCKER_BIN ?? "docker",
      [
        "exec",
        "supabase_db_anla-timer-auth-20261101",
        "psql",
        "-U",
        "postgres",
        "-d",
        "postgres",
        "-v",
        "ON_ERROR_STOP=1",
        "-Atc",
        `update auth.flow_state set created_at=clock_timestamp()-interval '10 minutes' where user_id='${id}' returning 1;`,
      ],
      { encoding: "utf8" },
    );
    assert.equal(age.status, 0, "Local fixture aging failed");
    assert(age.stdout.includes("1"), "Local PKCE fixture absent");
    let messageId: string | undefined;
    for (let i = 0; i < 20 && !messageId; i++) {
      const inbox = inboxMessages(
        await (await fetch(mailbox + "/api/v1/messages")).json(),
      );
      messageId = inbox.find((m) => m.recipients.includes(email))?.id;
      if (!messageId) await new Promise((resolve) => setTimeout(resolve, 200));
    }
    assert(messageId, "Local SMTP message absent");
    const mail: unknown = await (
      await fetch(mailbox + "/api/v1/message/" + messageId)
    ).json();
    assert(isRecord(mail) && typeof mail.HTML === "string");
    const raw = mail.HTML.match(/href="([^"]*\/auth\/v1\/verify[^"]*)"/)?.[1];
    assert(raw, "ConfirmationURL absent");
    const confirmation = new URL(raw.replaceAll("&amp;", "&"));
    assert(["127.0.0.1", "localhost"].includes(confirmation.hostname));
    let callback: string;
    if (mode === "pkce") {
      const response = await fetch(confirmation, { redirect: "manual" });
      assert.equal(response.status, 303);
      callback = response.headers.get("location")!;
      await assert.rejects(
        verifyEmailLink(callback, client.auth),
        /süresi doldu/,
      );
      assert.equal((await client.auth.getSession()).data.session, null);
    } else {
      const token = confirmation.searchParams.get("token");
      assert(token, "Local email token hash absent");
      callback =
        "anla-ezberle-quiz://online/auth?type=email&token_hash=" +
        encodeURIComponent(token);
      const verified = await verifyEmailLink(callback, client.auth);
      assert.equal(verified.userId, id);
      assert.equal(verified.recovery, false);
      assert.equal((await client.auth.getSession()).data.session?.user.id, id);
      const replay = createClient(api, key, {
        auth: { persistSession: false },
      });
      await assert.rejects(
        verifyEmailLink(callback, replay.auth),
        /süresi|geçersiz/,
      );
      await client.auth.signOut({ scope: "local" });
    }
    checks.push({ mode, agedLocalFlowMinutes: 10, passed: true });
    client.auth.stopAutoRefresh();
  }
  const result = {
    environment: "local-GoTrue-Mailpit-only",
    checks,
    hostedChanges: false,
  };
  if (process.env.RESULT_FILE)
    await writeFile(
      process.env.RESULT_FILE,
      JSON.stringify(result, null, 2) + "\n",
    );
  console.log(JSON.stringify(result));
}
main().catch(() => {
  // Neither confirmation URLs nor credentials may enter CI/terminal output.
  console.error(
    "Delayed local confirmation regression failed; no private details logged.",
  );
  process.exitCode = 1;
});
