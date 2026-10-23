// LOCAL ONLY: explicit ignored fixtures, real Auth + Edge + RLS, no hosted URL.
// Needs the existing local Supabase stack and functions serve online-duel.
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { execFileSync } from "node:child_process";
const option = (name) => {
  const i = process.argv.indexOf(name);
  assert(i >= 2 && process.argv[i + 1], `Required: ${name}`);
  const file = resolve(process.argv[i + 1]);
  const rel = relative(process.cwd(), file);
  assert(
    isAbsolute(rel) || rel.startsWith(".."),
    "Fixtures must stay outside the application",
  );
  return file;
};
async function privateJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    throw new Error("Private local fixture cannot be read; contents withheld");
  }
}
const cfg = await privateJson(option("--status-file"));
assert(
  cfg.API_URL === "http://127.0.0.1:55431",
  "Only the known LOCAL stack is allowed",
);
const saved = await privateJson(option("--accounts-file"));
assert(
  saved.users?.length >= 2,
  "Two existing synthetic local accounts required",
);
const users = saved.users.slice(0, 2);
assert(
  users.every(
    (u) =>
      /^[0-9a-f-]{36}$/i.test(u.id) &&
      /@(example\.invalid|example\.com|test\.invalid)$/.test(u.email),
  ),
  "Only synthetic fixtures are allowed",
);
assert(
  new Set(users.map((u) => u.id)).size === 2,
  "Distinct identities required",
);
const docker = process.env.QUIZ_DOCKER_BIN ?? "docker";
const sql = await readFile(
  new URL("../tests/sql/user-data-security.sql", import.meta.url),
  "utf8",
);
let output;
try {
  output = execFileSync(
    docker,
    [
      "exec",
      "-e",
      "PGOPTIONS=-c anla.audit_local_only=on",
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
    { input: sql, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] },
  );
} catch {
  throw new Error("Local SQL security assertions failed; details withheld");
}
let checks = 0;
for (const line of output.split("\n").filter((s) => s.startsWith("PASS "))) {
  console.log(line);
  checks++;
}
assert(checks === 5, "All SQL groups must execute");
const pass = (label) => {
  console.log("PASS " + label);
  checks++;
};
const request = async (
  path,
  { jwt, body, headers = {}, method = body ? "POST" : "GET" } = {},
) => {
  const response = await fetch(cfg.API_URL + path, {
    method,
    headers: {
      apikey: cfg.PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: "Bearer " + jwt } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
  });
  const value = await response.json().catch(() => null);
  return { status: response.status, value };
};
const edge = (jwt, body) => request("/functions/v1/online-duel", { jwt, body });
const sessions = [];
try {
  for (const user of users) {
    const r = await request("/auth/v1/token?grant_type=password", {
      body: { email: user.email, password: user.password },
    });
    assert(
      r.status === 200 &&
        r.value?.user?.id === user.id &&
        r.value.user.email_confirmed_at,
      "Local Auth must validate the expected confirmed identity",
    );
    sessions.push(r.value);
  }
  const [a, b] = sessions;
  pass("two real local Auth sessions with separate verified identities");
  for (const session of sessions) {
    const r = await request("/auth/v1/user", { jwt: session.access_token });
    assert(
      r.status === 200 && r.value?.id === session.user.id,
      "Auth must return the caller's own account",
    );
    const self = await edge(session.access_token, {
      operation: "self",
      body: {},
    });
    assert(
      self.status === 200 &&
        self.value?.profile &&
        Array.isArray(self.value.matches),
      "Authenticated Edge must load own view",
    );
    assert(
      !/(email|password|access_token|refresh_token|service_role|secret_key)/i.test(
        JSON.stringify(Object.keys(self.value.profile)),
      ),
      "Game view must omit private account fields",
    );
  }
  pass("Auth own-account identity and safe Edge self profile");
  const missing = await edge(null, { operation: "self", body: {} });
  const fake =
    Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
      "base64url",
    ) +
    "." +
    Buffer.from(
      JSON.stringify({
        sub: b.user.id,
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url") +
    ".invalid-signature";
  const forged = await edge(fake, { operation: "self", body: {} });
  assert(
    missing.status === 401 && forged.status === 401,
    "Missing and forged JWTs must be rejected",
  );
  pass("missing JWT and forged B identity rejected by actual Edge");
  for (const body of [
    { operation: "self", body: {}, actor: b.user.id },
    { operation: "self", body: { actor: b.user.id } },
    { operation: "self", body: { playerId: b.user.id } },
  ])
    assert(
      (await edge(a.access_token, body)).status === 400,
      "Client identity substitution must fail",
    );
  pass("A cannot supply B as actor in top-level or operation body");
  const otherInbox = await request(
    `/rest/v1/player_notifications?select=id&recipient_id=eq.${b.user.id}`,
    { jwt: a.access_token },
  );
  assert(
    otherInbox.status === 200 &&
      Array.isArray(otherInbox.value) &&
      otherInbox.value.length === 0,
    "Actual A JWT must not see B notifications",
  );
  pass("real A JWT cannot read B notifications through PostgREST");
  for (const [path, headers] of [
    [
      "/rest/v1/quiz_answer_keys?select=question_id&limit=0",
      { "Accept-Profile": "quiz_private" },
    ],
    [
      "/rest/v1/player_profiles?select=id&limit=0",
      { "Accept-Profile": "quiz_private" },
    ],
    ["/rest/v1/users?select=id&limit=0", { "Accept-Profile": "auth" }],
  ])
    assert(
      (await request(path, { jwt: a.access_token, headers })).status === 406,
      "Private schemas must not be exposed by PostgREST",
    );
  const rpc = await request("/rest/v1/rpc/online_duel_command", {
    jwt: a.access_token,
    body: { actor: b.user.id, operation: "self", body: {} },
  });
  const admin = await request("/auth/v1/admin/users?per_page=1", {
    jwt: a.access_token,
  });
  assert(
    [401, 403].includes(rpc.status) && [401, 403].includes(admin.status),
    "A must not access service RPC or Auth administrator API",
  );
  pass("private schemas, direct actor RPC and Auth admin list denied");
  for (const session of sessions) {
    const r = await request("/auth/v1/logout?scope=local", {
      jwt: session.access_token,
      method: "POST",
    });
    assert(
      [200, 204].includes(r.status),
      "Only the newly created synthetic local session is signed out",
    );
    session.auditSignedOut = true;
    const refresh = await request("/auth/v1/token?grant_type=refresh_token", {
      body: { refresh_token: session.refresh_token },
    });
    assert(
      refresh.status >= 400 && refresh.status < 500,
      "Signed-out session refresh must fail",
    );
  }
  pass("sign-out invalidates each local session refresh token");
  const afterLogout = await edge(a.access_token, {
    operation: "self",
    body: {},
  });
  assert(
    [200, 401].includes(afterLogout.status),
    "Observe access JWT lifetime without assuming immediate revocation",
  );
  console.log(
    JSON.stringify({
      groupsPassed: checks,
      signedOutAccessJwtStillAccepted: afterLogout.status === 200,
      hostedProjectTouched: false,
    }),
  );
} finally {
  for (const session of sessions) {
    if (!session.auditSignedOut)
      await request("/auth/v1/logout?scope=local", {
        jwt: session.access_token,
        method: "POST",
      }).catch(() => undefined);
  }
}
