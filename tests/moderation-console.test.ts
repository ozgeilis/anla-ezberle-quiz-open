import assert from "node:assert/strict";
import { test } from "node:test";
import { createRequire } from "node:module";
import { request, type Server } from "node:http";
import { type AddressInfo } from "node:net";
const require = createRequire(import.meta.url);
type Config = { url: string; publishableKey: string; localTest?: boolean };
const { createModerationServer, validateConfig } =
  require("../scripts/moderation-console/server.mjs") as {
    createModerationServer(config: Config): Server;
    validateConfig(config: Config): { url: string; publishableKey: string };
  };
const config = {
  url: "https://localexample.supabase.co",
  publishableKey: "sb_publishable_example",
};

test("moderator operator configuration rejects secret keys and arbitrary destinations", () => {
  assert.deepEqual(validateConfig(config), config);
  for (const url of [
    "https://example.com",
    "https://a.supabase.co.evil.example",
    "http://a.supabase.co",
    "https://a.supabase.co/extra",
    "https://user:password@a.supabase.co",
    "https://a.supabase.co?secret=x",
    "http://127.0.0.1:18571",
  ])
    assert.throws(() => validateConfig({ ...config, url }));
  for (const publishableKey of [
    "sb_secret_example",
    "service_role",
    "eyJhbGciOiJIUzI1NiJ9",
  ]) {
    assert.throws(() => validateConfig({ ...config, publishableKey }));
  }
  assert.equal(
    validateConfig({
      ...config,
      url: "http://127.0.0.1:18571",
      localTest: true,
    }).url,
    "http://127.0.0.1:18571",
  );
});

test("local console prevents DNS rebinding, cross-origin access, mutations and credential ingestion", async (t) => {
  const server = createModerationServer(config);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  );
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const rawStatus = (headers: Record<string, string>) =>
    new Promise<number | undefined>((resolve, reject) => {
      const req = request(url, { headers }, (response) => {
        response.resume();
        response.on("end", () => resolve(response.statusCode));
      });
      req.on("error", reject);
      req.end();
    });
  const response = await fetch(url + "/config.json");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), config);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  const csp = response.headers.get("content-security-policy") ?? "";
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /form-action 'none'/);
  assert.match(csp, /connect-src 'self' https:\/\/localexample\.supabase\.co;/);
  assert.equal(await rawStatus({ Host: "evil.example" }), 403);
  assert.equal(await rawStatus({ Origin: "https://evil.example" }), 403);
  assert.equal(await rawStatus({ "Sec-Fetch-Site": "cross-site" }), 403);
  assert.equal(
    (await fetch(url, { method: "POST", body: "password=never-accepted" }))
      .status,
    405,
  );
  assert.equal((await fetch(url + "/private.json")).status, 404);
  assert.equal((await fetch(url + "/config.json?token=x")).status, 404);
  const ui = await fetch(url + "/client.mjs").then((r) => r.text());
  assert.match(ui, /\/rest\/v1\/rpc\/moderation_review/);
  assert.doesNotMatch(
    ui,
    /localStorage|sessionStorage|innerHTML|console\.log|sb_secret_|service_role/,
  );
  assert.equal((await fetch(url + "/styles.css")).status, 200);
});
