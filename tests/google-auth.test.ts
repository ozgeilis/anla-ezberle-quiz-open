import assert from "node:assert/strict";
import { test } from "node:test";
import {
  googleCallbackCode,
  GoogleFlowError,
  verifierStorage,
  type GoogleAttempt,
} from "../src/features/online/googleFlow";
import { createGoogleCallbackCompletion } from "../src/features/online/googleCompletion";
import { authCallbackKey } from "../src/features/online/authCallbackUrl";
import { googleOtpProof } from "../supabase/functions/account-delete/googleOtp";
import { deletionHandler } from "../supabase/functions/account-delete/handler";
const now = 1000000;
const attempt: GoogleAttempt = {
  nonce: "synthetic-attempt",
  redirect:
    "anla-ezberle-quiz://online/auth?flow=google&attempt=synthetic-attempt",
  startedAt: now,
};
test("Google PKCE callback checks exact destination, nonce, expiry, code; implicit tokens and hostile errors stay private", () => {
  const base = attempt.redirect + "&code=synthetic-code";
  assert.equal(googleCallbackCode(base, attempt, now), "synthetic-code");
  for (const value of [
    base.replace("online/auth", "other/auth"),
    base.replace("synthetic-attempt", "foreign-attempt"),
    base.replace("anla-ezberle-quiz:", "evil:"),
    base + "&code=second",
    base + "&flow=email",
    base + "&attempt=second",
    base + "#access_token=never-accept",
    base + "&error=access_denied&error_description=SECRET",
  ]) {
    assert.throws(
      () => googleCallbackCode(value, attempt, now),
      (e) =>
        e instanceof Error &&
        !e.message.includes("SECRET") &&
        !e.message.includes("access_token"),
    );
  }
  assert.throws(() => googleCallbackCode(base, null, now));
  assert.throws(() => googleCallbackCode(base, attempt, now + 300001));
  const web = {
    ...attempt,
    redirect:
      "https://preview.example.invalid/online/auth?flow=google&attempt=synthetic-attempt",
  };
  assert.equal(
    googleCallbackCode(web.redirect + "&code=web-code", web, now),
    "web-code",
  );
  assert.throws(() =>
    googleCallbackCode(
      web.redirect.replace("preview.example.invalid", "evil.invalid") +
        "&code=x",
      web,
      now,
    ),
  );
});
test("Google denial fragments stay errors with private messages; no implicit or mixed proof becomes a session code", () => {
  for (const suffix of [
    "#error=server_error&error_code=unexpected_failure&error_description=SECRET",
    "&error=server_error&error_description=SECRET",
  ])
    assert.throws(
      () => googleCallbackCode(attempt.redirect + suffix, attempt, now),
      (e) =>
        e instanceof GoogleFlowError &&
        /kapalı test/.test(e.message) &&
        !e.message.includes("SECRET"),
    );
  for (const suffix of [
    "#error=server_error&access_token=SECRET",
    "#error=server_error&code=SECRET",
    "#error=server_error&error=access_denied",
    "&code=SECRET#error=server_error",
    "&error=server_error#error=access_denied",
  ])
    assert.throws(() =>
      googleCallbackCode(attempt.redirect + suffix, attempt, now),
    );
  assert.throws(() =>
    googleCallbackCode(
      attempt.redirect.replace("synthetic-attempt", "foreign-attempt") +
        "#error=server_error",
      attempt,
      now,
    ),
  );
});
test("simultaneous browser and Linking denial share one failed validation even after pending storage is removed", async () => {
  const gate = createGoogleCallbackCompletion();
  let pending: GoogleAttempt | null = attempt;
  let reads = 0;
  const value =
    attempt.redirect + "#error=server_error&error_description=SECRET";
  const finish = async () => {
    reads++;
    await Promise.resolve();
    try {
      googleCallbackCode(value, pending, now);
    } finally {
      pending = null;
    }
  };
  const a = gate.run(authCallbackKey(value), finish, now);
  const b = gate.run(
    authCallbackKey(
      value.replace(
        "#error=server_error&error_description=SECRET",
        "#error_description=SECRET&error=server_error",
      ),
    ),
    finish,
    now,
  );
  const outcomes = await Promise.allSettled([a, b]);
  assert.equal(reads, 1);
  for (const result of outcomes) {
    assert.equal(result.status, "rejected");
    if (result.status === "rejected") {
      assert.ok(result.reason instanceof GoogleFlowError);
      assert.match(result.reason.message, /kapalı test/);
      assert.doesNotMatch(result.reason.message, /süresi doldu|SECRET/);
    }
  }
  await assert.rejects(
    gate.run(authCallbackKey(value), finish, now + 1),
    /kapalı test/,
  );
  assert.equal(reads, 1);
  gate.clear();
  await assert.rejects(
    gate.run(authCallbackKey(value), finish, now + 2),
    /süresi doldu/,
  );
  assert.equal(reads, 2);
});
test("Google completion caches success once, expires outcomes and isolates a new attempt key", async () => {
  const gate = createGoogleCallbackCompletion();
  let completions = 0;
  const finish = async () => {
    completions++;
  };
  await Promise.all([
    gate.run("one", finish, now),
    gate.run("one", finish, now),
  ]);
  assert.equal(completions, 1);
  await gate.run("two", finish, now + 1);
  assert.equal(completions, 2);
  await gate.run("two", finish, now + 300001);
  assert.equal(completions, 3);
});
test("Google deletion requires a one-use actor-bound challenge and fresh same-user OTP proof", async () => {
  const challenge = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  let claimed = false;
  let returnedActor = "other";
  const proof = googleOtpProof({
    create: async () => challenge,
    send: async () => true,
    claim: async (actor, id) => {
      if (actor !== "actor-a" || id !== challenge || claimed) return false;
      claimed = true;
      return true;
    },
    verify: async () => returnedActor,
  });
  assert.equal(
    await proof.send("actor-a", "synthetic@example.invalid"),
    challenge,
  );
  assert.equal(
    await proof.verify(
      "actor-b",
      "synthetic@example.invalid",
      challenge,
      "12345678",
    ),
    false,
  );
  assert.equal(
    await proof.verify(
      "actor-a",
      "synthetic@example.invalid",
      challenge,
      "invalid",
    ),
    false,
  );
  assert.equal(
    await proof.verify(
      "actor-a",
      "synthetic@example.invalid",
      challenge,
      "12345678",
    ),
    false,
  );
  returnedActor = "actor-a";
  assert.equal(
    await proof.verify(
      "actor-a",
      "synthetic@example.invalid",
      challenge,
      "12345678",
    ),
    false,
    "failed attempt cannot replay",
  );
  claimed = false;
  assert.equal(
    await proof.verify(
      "actor-a",
      "synthetic@example.invalid",
      challenge,
      "12345678",
    ),
    true,
  );
  assert.equal(
    await proof.verify(
      "actor-a",
      "synthetic@example.invalid",
      challenge,
      "12345678",
    ),
    false,
  );
});
test("existing password erasure stays valid; Google proof is closed by default and never trusts body actor/email", async () => {
  const erased: string[] = [];
  const user = {
    id: "actor-a",
    email: "synthetic@example.invalid",
    verified: true,
    google: true,
  };
  const base = {
    user: async () => user,
    reauthenticate: async () => user.id,
    erase: async (id: string) => {
      erased.push(id);
      return true;
    },
  };
  const request = (body: object) =>
    new Request("https://local.invalid", {
      method: "POST",
      headers: { Authorization: "Bearer synthetic" },
      body: JSON.stringify(body),
    });
  const input = {
    confirmation: "DELETE",
    googleCode: "12345678",
    challenge: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  };
  assert.equal((await deletionHandler(base)(request(input))).status, 403);
  assert.equal(erased.length, 0);
  const handler = deletionHandler({
    ...base,
    googleOtp: {
      send: async () => input.challenge,
      verify: async (actor, email) => actor === user.id && email === user.email,
    },
  });
  assert.equal(
    (await handler(request({ ...input, actor: "victim" }))).status,
    400,
  );
  assert.equal(
    (
      await handler(
        request({ operation: "google-code", email: "victim@example.invalid" }),
      )
    ).status,
    400,
  );
  assert.equal(
    (await handler(request({ operation: "google-code" }))).status,
    200,
  );
  assert.equal((await handler(request(input))).status, 200);
  assert.deepEqual(erased, ["actor-a"]);
  assert.equal(
    (
      await deletionHandler(base)(
        request({ confirmation: "DELETE", password: "Existing_12!" }),
      )
    ).status,
    200,
  );
});

test("PKCE transport persists only verifier, keeps JWTs out of a second storage and leaves email session untouched", async () => {
  const disk = new Map<string, string>([
    ["existing-email-session", "unchanged"],
  ]);
  const storage = verifierStorage(
    {
      getItem: async (k) => disk.get(k) ?? null,
      setItem: async (k, v) => {
        disk.set(k, v);
      },
      removeItem: async (k) => {
        disk.delete(k);
      },
    },
    "oauth-code-verifier",
  );
  await storage.setItem("oauth-code-verifier", "synthetic-verifier");
  await storage.setItem("oauth", "synthetic-session-token");
  assert.equal(disk.get("oauth"), undefined);
  assert.equal(await storage.getItem("oauth"), "synthetic-session-token");
  storage.clearMemory();
  assert.equal(await storage.getItem("oauth"), null);
  assert.equal(
    await storage.getItem("oauth-code-verifier"),
    "synthetic-verifier",
  );
  await storage.removeItem("oauth-code-verifier");
  assert.deepEqual([...disk], [["existing-email-session", "unchanged"]]);
});
