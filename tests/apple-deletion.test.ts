import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateKeyPair,
  SignJWT,
  exportPKCS8,
  createLocalJWKSet,
  exportJWK,
} from "jose";
import {
  appleDeletionProof,
  AppleDeletionError,
  type AppleDeletionJob,
} from "../supabase/functions/account-delete/appleDeletion";
import {
  tokenCipher,
  verifyAppleIdentity,
  appleClientSecret,
} from "../supabase/functions/account-delete/appleCrypto";
import {
  deletionHandler,
  type DeletionDependencies,
} from "../supabase/functions/account-delete/handler";
const challenge = "a0000000-0000-4000-8000-000000000001";
const proof = {
  identityToken: "synthetic-id-token",
  authorizationCode: "synthetic-one-use-code",
};
function fixture() {
  const job: AppleDeletionJob = {
    stage: "proof",
    appleSubject: "apple-subject-a",
    nonceHash: "expected-hash",
    ciphertext: null,
    lease: "lease-a",
  };
  const calls: string[] = [];
  let leased = false,
    revokeFails = false,
    eraseFails = false;
  const protocol = appleDeletionProof({
    store: {
      async begin() {
        return challenge;
      },
      async claim(actor, id) {
        if (actor !== "actor-a" || id !== challenge || leased) return null;
        leased = true;
        return { ...job };
      },
      async save(_actor, _id, _lease, stage, ciphertext) {
        job.stage = stage;
        job.ciphertext = ciphertext;
        calls.push(`save:${stage}`);
      },
      async release() {
        leased = false;
        calls.push("release");
      },
    },
    async verify(token, subject, nonce) {
      calls.push("verify");
      if (!token || subject !== "apple-subject-a" || nonce !== "expected-hash")
        throw Error("invalid");
    },
    async exchange() {
      calls.push("exchange");
      return {
        identityToken: "exchanged-id",
        refreshToken: "synthetic-private-refresh",
      };
    },
    async encrypt() {
      return "encrypted-not-plain-token";
    },
    async decrypt() {
      return "synthetic-private-refresh";
    },
    async revoke() {
      calls.push("revoke");
      if (revokeFails) throw Error("network failure with sensitive payload");
    },
    async erase() {
      calls.push("erase");
      return !eraseFails;
    },
  });
  return {
    job,
    calls,
    protocol,
    failRevoke: (v: boolean) => {
      revokeFails = v;
    },
    failErase: (v: boolean) => {
      eraseFails = v;
    },
  };
}
test("Apple deletion verifies both native/exchanged identity, revokes before existing erasure, clears token", async () => {
  const f = fixture();
  await f.protocol.erase("actor-a", "apple-subject-a", challenge, proof);
  assert.deepEqual(f.calls, [
    "verify",
    "exchange",
    "verify",
    "save:token",
    "revoke",
    "save:revoked",
    "erase",
    "release",
  ]);
  assert.equal(f.job.ciphertext, null);
});
test("Apple network revoke failure never erases; retry decrypts same token without reusing code", async () => {
  const f = fixture();
  f.failRevoke(true);
  await assert.rejects(
    f.protocol.erase("actor-a", "apple-subject-a", challenge, proof),
    (e: unknown) =>
      e instanceof AppleDeletionError &&
      e.code === "APPLE_RETRY_REQUIRED" &&
      !e.message.includes("sensitive"),
  );
  assert(!f.calls.includes("erase"));
  assert.equal(f.job.stage, "token");
  f.failRevoke(false);
  await f.protocol.erase("actor-a", "apple-subject-a", challenge);
  assert.equal(f.calls.filter((v) => v === "exchange").length, 1);
});
test("erase failure after Apple revoke retries erasure only, no duplicate revoke/code exchange", async () => {
  const f = fixture();
  f.failErase(true);
  await assert.rejects(
    f.protocol.erase("actor-a", "apple-subject-a", challenge, proof),
  );
  assert.equal(f.job.stage, "revoked");
  assert.equal(f.job.ciphertext, null);
  f.failErase(false);
  await f.protocol.erase("actor-a", "apple-subject-a", challenge);
  assert.equal(f.calls.filter((v) => v === "revoke").length, 1);
});
test("Apple proof cannot cross actors, subjects, expired/busy/missing challenges or no proof", async () => {
  for (const [actor, subject, id, p] of [
    ["actor-b", "apple-subject-a", challenge, proof],
    ["actor-a", "wrong-subject", challenge, proof],
    ["actor-a", "apple-subject-a", "invalid", proof],
    ["actor-a", "apple-subject-a", challenge, undefined],
  ] as const) {
    const f = fixture();
    await assert.rejects(f.protocol.erase(actor, subject, id, p));
    assert(!f.calls.includes("erase"));
    assert(!f.calls.includes("exchange"));
  }
});
test("concurrent callbacks cannot exchange or delete twice with the same leased challenge", async () => {
  const f = fixture();
  const results = await Promise.allSettled([
    f.protocol.erase("actor-a", "apple-subject-a", challenge, proof),
    f.protocol.erase("actor-a", "apple-subject-a", challenge, proof),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(f.calls.filter((v) => v === "exchange").length, 1);
});
test("Apple challenge nonce is random; only its SHA256 is sent to the private store", async () => {
  let stored = "";
  const f = fixture();
  const begin = appleDeletionProof({
    store: {
      begin: async (_a, h) => {
        stored = h;
        return challenge;
      },
      claim: async () => null,
      save: async () => {},
      release: async () => {},
    },
    verify: async () => {},
    exchange: async () => ({ identityToken: "", refreshToken: "" }),
    revoke: async () => {},
    encrypt: async () => "",
    decrypt: async () => "",
    erase: async () => false,
  });
  const a = await begin.begin("actor-a"),
    b = await begin.begin("actor-a");
  assert.notEqual(a.nonce, b.nonce);
  assert.match(stored, /^[a-f0-9]{64}$/);
  assert.notEqual(stored, b.nonce);
  assert.equal(f.calls.length, 0);
});
test("AES-GCM token envelope supports key rotation and rejects tampering/cross-actor context", async () => {
  const old = Buffer.alloc(32, 1).toString("base64"),
    next = Buffer.alloc(32, 2).toString("base64");
  const first = tokenCipher({ old }, "old");
  const envelope = await first.encrypt("synthetic-secret", "actor:challenge");
  assert(!envelope.includes("synthetic-secret"));
  const rotated = tokenCipher({ old, next }, "next");
  assert.equal(
    await rotated.decrypt(envelope, "actor:challenge"),
    "synthetic-secret",
  );
  await assert.rejects(rotated.decrypt(envelope, "other:challenge"));
  await assert.rejects(
    tokenCipher({ next }, "next").decrypt(envelope, "actor:challenge"),
  );
  const parts = envelope.split(".");
  parts[2] = Buffer.alloc(30).toString("base64");
  await assert.rejects(rotated.decrypt(parts.join("."), "actor:challenge"));
});
test("real RSA signature verification rejects wrong issuer/audience/subject/nonce/expiry/signature", async () => {
  const { privateKey, publicKey } = await generateKeyPair("RS256");
  const jwk = await exportJWK(publicKey);
  jwk.kid = "fixture";
  const keys = createLocalJWKSet({ keys: [jwk] });
  const token = async (patch: Record<string, unknown> = {}) =>
    new SignJWT({ nonce: "nonce", ...patch })
      .setProtectedHeader({ alg: "RS256", kid: "fixture" })
      .setIssuer(String(patch.iss ?? "https://appleid.apple.com"))
      .setAudience(String(patch.aud ?? "com.kovynelstudio.anlaezberle"))
      .setSubject(String(patch.sub ?? "subject-a"))
      .setIssuedAt(Number(patch.iat ?? Math.floor(Date.now() / 1000)))
      .setExpirationTime(
        Number(patch.exp ?? Math.floor(Date.now() / 1000) + 300),
      )
      .sign(privateKey);
  await verifyAppleIdentity(
    await token(),
    "com.kovynelstudio.anlaezberle",
    "subject-a",
    "nonce",
    keys,
  );
  for (const patch of [
    { iss: "evil.invalid" },
    { aud: "prototype" },
    { sub: "subject-b" },
    { nonce: "other" },
    { exp: 1 },
    { iat: 1 },
  ])
    await assert.rejects(
      verifyAppleIdentity(
        await token(patch),
        "com.kovynelstudio.anlaezberle",
        "subject-a",
        "nonce",
        keys,
      ),
    );
  const foreign = await generateKeyPair("RS256");
  const forged = await new SignJWT({ nonce: "nonce" })
    .setProtectedHeader({ alg: "RS256", kid: "fixture" })
    .setIssuer("https://appleid.apple.com")
    .setAudience("com.kovynelstudio.anlaezberle")
    .setSubject("subject-a")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(foreign.privateKey);
  await assert.rejects(
    verifyAppleIdentity(
      forged,
      "com.kovynelstudio.anlaezberle",
      "subject-a",
      "nonce",
      keys,
    ),
  );
});
test("Apple client secret is short-lived ES256 and pinned to the permanent client", async () => {
  const pair = await generateKeyPair("ES256", { extractable: true });
  const pem = await exportPKCS8(pair.privateKey);
  const token = await appleClientSecret(
    "W7CRC43SHP",
    "TESTKEY001",
    "com.kovynelstudio.anlaezberle",
    pem,
  );
  const claims = JSON.parse(
    Buffer.from(token.split(".")[1]!, "base64url").toString(),
  );
  assert.equal(claims.iss, "W7CRC43SHP");
  assert.equal(claims.exp - claims.iat, 300);
  await assert.rejects(
    appleClientSecret("W7CRC43SHP", "TESTKEY001", "prototype", pem),
  );
});
const request = (body: object) =>
  new Request("https://local.invalid/account-delete", {
    method: "POST",
    headers: { Authorization: "Bearer fixture" },
    body: JSON.stringify(body),
  });
test("HTTP Apple-only and linked Apple users never fall through to password/Google proof; active session required", async () => {
  let erase = 0,
    password = 0;
  const deps: DeletionDependencies = {
    user: async () => ({
      id: "actor-a",
      email: "relay@example.invalid",
      verified: true,
      appleSubject: "subject-a",
      appleSessionActive: true,
      google: true,
    }),
    reauthenticate: async () => {
      password++;
      return "actor-a";
    },
    erase: async () => {
      erase++;
      return true;
    },
    apple: {
      begin: async () => ({ challenge, nonce: "nonce" }),
      erase: async () => {
        erase++;
        return true;
      },
    },
  };
  const h = deletionHandler(deps);
  assert.equal(
    (await h(request({ confirmation: "DELETE", password: "not-used" }))).status,
    400,
  );
  assert.equal((await h(request({ operation: "google-code" }))).status, 400);
  assert.equal(
    (await h(request({ operation: "apple-begin", actor: "foreign" }))).status,
    400,
  );
  assert.equal((await h(request({ operation: "apple-begin" }))).status, 200);
  assert.equal(
    (
      await h(
        request({
          operation: "apple-delete",
          confirmation: "DELETE",
          challenge,
          ...proof,
        }),
      )
    ).status,
    200,
  );
  assert.equal(password, 0);
  assert.equal(erase, 1);
  const blocked = deletionHandler({
    ...deps,
    user: async () => ({
      id: "actor-a",
      email: "relay@example.invalid",
      verified: true,
      appleSubject: "subject-a",
      appleSessionActive: false,
    }),
  });
  assert.equal(
    (
      await blocked(
        request({
          operation: "apple-delete",
          confirmation: "DELETE",
          challenge,
          ...proof,
        }),
      )
    ).status,
    403,
  );
});
