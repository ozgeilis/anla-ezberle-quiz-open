// Real HTTP + real PostgreSQL retry state and JOSE signatures. Apple's HTTPS
// endpoints are explicit fixtures; this is NOT real Apple/Supabase Auth acceptance.
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { execFileSync } from "node:child_process";
import { randomUUID, randomBytes } from "node:crypto";
import {
  generateKeyPair,
  exportPKCS8,
  exportJWK,
  SignJWT,
  jwtVerify,
} from "jose";
import { appleDeletionService } from "../supabase/functions/account-delete/appleService";
import { deletionHandler } from "../supabase/functions/account-delete/handler";
import type { AppleDeletionJob } from "../supabase/functions/account-delete/appleDeletion";
async function main() {
  const db = process.env.SAFETY_TEST_DB ?? "";
  const container = process.env.SAFETY_LOCAL_CONTAINER ?? "";
  assert(
    /^anla_canonical_v73_\d+$/.test(db),
    "Explicit throwaway database required",
  );
  assert(/^supabase_db_[a-zA-Z0-9_-]+$/.test(container));
  const docker = process.env.QUIZ_DOCKER_BIN ?? "docker";
  const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
  function sql(query: string) {
    return execFileSync(
      docker,
      [
        "exec",
        "-i",
        container,
        "psql",
        "-U",
        "postgres",
        "-d",
        db,
        "-v",
        "ON_ERROR_STOP=1",
        "-qAt",
      ],
      {
        input: `SET request.jwt.claims='{"role":"service_role"}';\n${query}`,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      },
    ).trim();
  }
  const actor = randomUUID(),
    other = randomUUID(),
    sessionId = randomUUID();
  sql(`UPDATE quiz_private.apple_auth_config SET oauth_enabled=true,deletion_enabled=true,revocation_enabled=true;
UPDATE quiz_private.account_deletion_config SET enabled=true;
INSERT INTO auth.users(id,email,email_confirmed_at) VALUES('${actor}','local-apple-${actor}@example.invalid',now()),('${other}','local-other-${other}@example.invalid',now());
INSERT INTO auth.identities(provider_id,user_id,identity_data,provider) VALUES('local-apple-${actor}','${actor}','{"sub":"local-apple-${actor}"}','apple');
INSERT INTO auth.sessions(id,user_id) VALUES('${sessionId}','${actor}');
INSERT INTO quiz_private.player_profiles(id,display_name,access_enabled) VALUES('${actor}','Synthetic Apple',true),('${other}','Synthetic Other',true);`);
  const apple = await generateKeyPair("RS256"),
    client = await generateKeyPair("ES256", { extractable: true }),
    appAuth = await generateKeyPair("RS256");
  const jwk = await exportJWK(apple.publicKey);
  jwk.kid = "local-key";
  const env: Record<string, string> = {
    APPLE_TEAM_ID: "W7CRC43SHP",
    APPLE_KEY_ID: "TESTKEY001",
    APPLE_PRIVATE_KEY: await exportPKCS8(client.privateKey),
    APPLE_DELETION_ENCRYPTION_KEYS: JSON.stringify({
      fixture: randomBytes(32).toString("base64"),
    }),
    APPLE_DELETION_ACTIVE_KEY: "fixture",
  };
  let tokenPosts = 0,
    revokePosts = 0,
    eraseCalls = 0,
    nonceHash = "";
  const nativeToken = () =>
    new SignJWT({ nonce: nonceHash })
      .setProtectedHeader({ alg: "RS256", kid: "local-key" })
      .setIssuer("https://appleid.apple.com")
      .setAudience("com.kovynelstudio.anlaezberle")
      .setSubject(`local-apple-${actor}`)
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(apple.privateKey);
  const transport: typeof fetch = async (input, init) => {
    const url = String(input);
    if (url === "https://appleid.apple.com/auth/keys")
      return Response.json({ keys: [jwk] });
    assert(
      [
        "https://appleid.apple.com/auth/token",
        "https://appleid.apple.com/auth/revoke",
      ].includes(url),
    );
    assert.equal(init?.redirect, "error");
    const fields = new URLSearchParams(String(init?.body));
    await jwtVerify(fields.get("client_secret")!, client.publicKey, {
      algorithms: ["ES256"],
      issuer: "W7CRC43SHP",
      audience: "https://appleid.apple.com",
      subject: "com.kovynelstudio.anlaezberle",
    });
    if (url.endsWith("/token")) {
      tokenPosts++;
      assert.equal(fields.get("grant_type"), "authorization_code");
      return Response.json({
        id_token: await nativeToken(),
        refresh_token: "fixture-private-refresh-token",
      });
    }
    revokePosts++;
    assert.equal(fields.get("token"), "fixture-private-refresh-token");
    assert.equal(fields.get("token_type_hint"), "refresh_token");
    if (revokePosts === 1)
      throw new DOMException("Fixture network timeout", "TimeoutError");
    return new Response(null, { status: 200 });
  };
  const erase = async (id: string) => {
    assert.equal(id, actor);
    eraseCalls++;
    if (eraseCalls === 1) return false;
    assert.equal(
      JSON.parse(sql(`SELECT public.prepare_account_deletion('${actor}')`))
        .ready,
      true,
    );
    sql(`DELETE FROM auth.users WHERE id='${actor}';`);
    return (
      JSON.parse(
        sql(
          `SELECT public.verify_account_deletion('${actor}','local-apple-${actor}@example.invalid')`,
        ),
      ).deleted === true
    );
  };
  const protocol = appleDeletionService(
    (name) => env[name],
    {
      async begin(id, hash) {
        return sql(
          `SELECT public.begin_apple_deletion(${quote(id)},${quote(hash)})`,
        );
      },
      async claim(id, challenge) {
        const result = sql(
          `SELECT public.claim_apple_deletion(${quote(id)},${quote(challenge)})`,
        );
        return result ? (JSON.parse(result) as AppleDeletionJob) : null;
      },
      async save(id, challenge, lease, stage, cipher) {
        assert.equal(
          sql(
            `SELECT public.save_apple_deletion(${quote(id)},${quote(challenge)},${quote(lease)},${quote(stage)},${cipher === null ? "NULL" : quote(cipher)})`,
          ),
          "t",
        );
      },
      async release(id, challenge, lease) {
        sql(
          `SELECT public.release_apple_deletion(${quote(id)},${quote(challenge)},${quote(lease)})`,
        );
      },
    },
    erase,
    transport,
  );
  const handler = deletionHandler({
    async user(jwt) {
      try {
        const { payload } = await jwtVerify(jwt, appAuth.publicKey, {
          issuer: "local-auth-fixture",
          audience: "local-app",
        });
        if (payload.sub !== actor) return null;
        const active =
          sql(
            `SELECT public.apple_deletion_session('${actor}','${sessionId}')`,
          ) === "t";
        return {
          id: actor,
          email: `local-apple-${actor}@example.invalid`,
          verified: true,
          apple: true,
          appleSubject: `local-apple-${actor}`,
          appleSessionActive: active,
        };
      } catch {
        return null;
      }
    },
    reauthenticate: async () => null,
    erase,
    apple: protocol,
  });
  const server = createServer(async (req, res) => {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      const response = await handler(
        new Request("http://127.0.0.1/account-delete", {
          method: "POST",
          headers: { Authorization: req.headers.authorization ?? "" },
          body: Buffer.concat(chunks),
        }),
      );
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    } catch {
      res.writeHead(500);
      res.end("{}");
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert(address && typeof address !== "string");
  const jwt = await new SignJWT({ session_id: sessionId })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer("local-auth-fixture")
    .setAudience("local-app")
    .setSubject(actor)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(appAuth.privateKey);
  const post = async (body: object) => {
    const response = await fetch(`http://127.0.0.1:${address.port}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` },
      body: JSON.stringify(body),
    });
    return { status: response.status, data: await response.json() };
  };
  try {
    const begin = await post({ operation: "apple-begin" });
    assert.equal(begin.status, 200);
    const challenge = begin.data.challenge as string;
    nonceHash = Buffer.from(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(begin.data.nonce),
      ),
    ).toString("hex");
    const first = await post({
      operation: "apple-delete",
      confirmation: "DELETE",
      challenge,
      identityToken: await nativeToken(),
      authorizationCode: "fixture-code",
    });
    assert.equal(first.status, 503);
    assert.equal(first.data.error, "APPLE_RETRY_REQUIRED");
    assert.equal(eraseCalls, 0);
    const encrypted = sql(
      `SELECT ciphertext FROM quiz_private.apple_deletion_jobs WHERE id=${quote(challenge)}`,
    );
    assert(encrypted.startsWith("fixture."));
    assert(!encrypted.includes("fixture-private-refresh-token"));
    const second = await post({
      operation: "apple-delete",
      confirmation: "DELETE",
      challenge,
    });
    assert.equal(second.status, 503);
    assert.equal(eraseCalls, 1);
    assert.equal(
      sql(
        `SELECT ciphertext IS NULL FROM quiz_private.apple_deletion_jobs WHERE id=${quote(challenge)}`,
      ),
      "t",
    );
    const third = await post({
      operation: "apple-delete",
      confirmation: "DELETE",
      challenge,
    });
    assert.equal(third.status, 200);
    assert.deepEqual(third.data, { deleted: true });
    assert.equal(tokenPosts, 1);
    assert.equal(revokePosts, 2);
    assert.equal(eraseCalls, 2);
    assert.equal(
      sql(
        `SELECT count(*) FROM quiz_private.apple_deletion_jobs WHERE actor='${actor}'`,
      ),
      "0",
    );
    assert.equal(
      sql(`SELECT count(*) FROM auth.users WHERE id='${other}'`),
      "1",
    );
    console.log(
      "PASS real local HTTP/SQL Apple proof, ES256 secret and RS256/JWKS validation, encrypted network retry, idempotent revoke, erase retry, actor-only cleanup. Apple/Auth network endpoints are fixtures, not real service acceptance.",
    );
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}
void main().catch(() => {
  console.error(
    "Local Apple HTTP acceptance failed; inspect private local test state, never a hosted service.",
  );
  process.exitCode = 1;
});
