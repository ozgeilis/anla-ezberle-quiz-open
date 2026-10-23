// Administrator-only, closed development workflow. Never import into app code.
// Run only after remote deployment/provisioning approval. Credentials stay local.
import { randomBytes } from "node:crypto";
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { homedir } from "node:os";

const refIndex = process.argv.indexOf("--project-ref");
const ref = process.argv[refIndex + 1];
if (
  refIndex < 0 ||
  !/^[a-z]{20}$/.test(ref ?? "") ||
  !process.argv.includes("--closed-dev")
)
  throw new Error(
    "Explicit --closed-dev --project-ref <approved-development-ref> required",
  );
const url = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (url !== `https://${ref}.supabase.co` || !secret)
  throw new Error(
    "Server-only environment must match the approved development project exactly",
  );
const privateDirectory = resolve(
  homedir(),
  ".local",
  "share",
  "anla-quiz-dev",
  ref,
);
const privateRelative = relative(process.cwd(), privateDirectory);
if (!isAbsolute(privateRelative) && !privateRelative.startsWith(".."))
  throw new Error("Administrator fixtures must be outside the Expo project");
const destination = resolve(privateDirectory, "testers.json");
await mkdir(privateDirectory, { recursive: true, mode: 0o700 });
let saved = { projectRef: ref, users: [] };
try {
  saved = JSON.parse(await readFile(destination, "utf8"));
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
if (saved.projectRef !== ref || !Array.isArray(saved.users))
  throw new Error("Invalid private fixture file; no changes applied");
async function admin(path, body) {
  const response = await fetch(`${url}${path}`, {
    method: "POST",
    headers: {
      apikey: secret,
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok)
    throw new Error(
      `Admin operation refused (${response.status}); no credentials printed`,
    );
  return response.json();
}
await chmod(privateDirectory, 0o700);
const roles = process.argv.includes("--include-negative-user")
  ? ["a", "b", "c"]
  : ["a", "b"];
for (const role of roles) {
  let account = saved.users.find((u) => u.role === role);
  if (!account) {
    const email = `quiz-${ref}-${role}@example.com`;
    const password = randomBytes(24).toString("base64url") + "aA!4";
    // admin email_confirm is explicit for synthetic test identities; this is not
    // evidence of mailbox ownership and no confirmation/reset email is sent.
    const user = await admin("/auth/v1/admin/users", {
      email,
      password,
      email_confirm: true,
    });
    account = { role, id: user.id, email, password };
    saved.users.push(account);
    await writeFile(destination, JSON.stringify(saved, null, 2), {
      mode: 0o600,
    });
  }
  const enrollment = await admin("/rest/v1/rpc/online_duel_enroll_test_user", {
    user_id: account.id,
    display_name: `Test oyuncu ${role.toUpperCase()}`,
  });
  if (!enrollment.enabled)
    throw new Error(
      "Existing test access is revoked; explicit administrator review required",
    );
}
await chmod(destination, 0o600);
console.log(
  `Closed development testers ready: ${roles.length}. Private credentials saved only outside the Expo project; no passwords, keys or tokens printed.`,
);
