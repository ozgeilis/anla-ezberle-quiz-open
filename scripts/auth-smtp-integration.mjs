// Explicit SMTP send test to the operator's dedicated +alias. Never prints
// passwords, Auth links, tokens or SMTP credentials. No existing account changes.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
const ref = "mqyuihiobkomjfipxehj",
  url = `https://${ref}.supabase.co`;
const dir = join(homedir(), ".local/share/anla-quiz-dev", ref);
const stateFile = join(dir, "gmail-smtp-test.json");
const args = new Set(process.argv.slice(2));
assert(
  args.has("--send") ||
    args.has("--check") ||
    args.has("--resend") ||
    args.has("--recovery-send"),
  "Use an explicit send/check mode",
);
const publicEnv = await readFile(process.env.SOCIAL_CLIENT_ENV, "utf8");
const key = publicEnv
  .match(/^EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)$/m)?.[1]
  ?.trim();
assert(publicEnv.includes(url) && key?.startsWith("sb_publishable_"));
const secret = (await readFile(join(dir, "server.env"), "utf8"))
  .match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m)?.[1]
  ?.trim();
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const client = createClient(url, key, options),
  admin = createClient(url, secret, options);
let state;
if (args.has("--send")) {
  // Safe repeat runs require the caller to choose a NEW dedicated alias.
  const email = process.env.SMTP_TEST_EMAIL;
  assert(
    /^kovynelstudio\+quiz-auth-[a-z0-9-]+@gmail\.com$/.test(email ?? ""),
    "Dedicated operator test alias required",
  );
  try {
    await readFile(stateFile);
    throw new Error(
      "A test already exists; use --check. Do not send duplicates.",
    );
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  state = {
    email,
    password: `Quiz_42!${randomUUID()}`,
    requestedAt: new Date().toISOString(),
    projectRef: ref,
  };
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await writeFile(stateFile, JSON.stringify(state), { mode: 0o600 });
  const { data, error } = await client.auth.signUp({
    email,
    password: state.password,
    options: { emailRedirectTo: "http://127.0.0.1:8121/online/auth" },
  });
  state.signupRequestAccepted = !error;
  state.errorCode = error?.code ?? null;
  state.errorStatus = error?.status ?? null;
  state.userId = data.user?.id ?? null;
  state.initiallyConfirmed = !!data.user?.email_confirmed_at;
  state.initialSession = !!data.session;
  await writeFile(stateFile, JSON.stringify(state), { mode: 0o600 });
  console.log(
    JSON.stringify({
      signupRequestAccepted: state.signupRequestAccepted,
      errorCode: state.errorCode,
      errorStatus: state.errorStatus,
      initiallyConfirmed: state.initiallyConfirmed,
      initialSession: state.initialSession,
      inboxDeliveryVerified: false,
    }),
  );
  if (error) process.exitCode = 1;
  else {
    assert(
      data.user && !data.session && !data.user.email_confirmed_at,
      "Signup must require verification",
    );
    const login = await client.auth.signInWithPassword({
      email,
      password: state.password,
    });
    assert.equal(login.error?.code, "email_not_confirmed");
    console.log(
      "Unverified account password login rejected by real Supabase Auth.",
    );
  }
} else state = JSON.parse(await readFile(stateFile, "utf8"));
if (args.has("--resend") || args.has("--recovery-send")) {
  const recovery = args.has("--recovery-send"),
    field = recovery ? "recoverySend" : "resend";
  assert(
    !state[field],
    "This email test was already attempted; avoid duplicate sends",
  );
  const result = recovery
    ? await client.auth.resetPasswordForEmail(state.email, {
        redirectTo: "http://127.0.0.1:8121/online/auth",
      })
    : await client.auth.resend({
        type: "signup",
        email: state.email,
        options: { emailRedirectTo: "http://127.0.0.1:8121/online/auth" },
      });
  state[field] = {
    requestedAt: new Date().toISOString(),
    requestAccepted: !result.error,
    errorCode: result.error?.code ?? null,
    errorStatus: result.error?.status ?? null,
  };
  await writeFile(stateFile, JSON.stringify(state), { mode: 0o600 });
  console.log(
    JSON.stringify({
      operation: field,
      ...state[field],
      inboxDeliveryVerified: false,
    }),
  );
  if (result.error) process.exitCode = 1;
}
if (state.userId) {
  const { data, error } = await admin.auth.admin.getUserById(state.userId);
  assert(!error);
  console.log(
    JSON.stringify({
      dedicatedTestAccountConfirmed: !!data.user.email_confirmed_at,
      inboxDeliveryVerified: false,
      note: "Confirmation state alone does not establish inbox delivery or email-link UI acceptance.",
    }),
  );
}
