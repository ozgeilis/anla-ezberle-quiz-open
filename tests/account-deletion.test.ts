import assert from "node:assert/strict";
import { test } from "node:test";
import {
  deletionHandler,
  type DeletionDependencies,
} from "../supabase/functions/account-delete/handler";
const request = (body: object, token = "verified-a") =>
  new Request("https://local.invalid/account-delete", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
const input = {
  password: "synthetic-not-an-account-password",
  confirmation: "DELETE",
};
test("deletion binds verified JWT and fresh password to the same actor, never body-supplied IDs", async () => {
  const erased: string[] = [];
  const deps: DeletionDependencies = {
    user: async () => ({
      id: "a",
      email: "synthetic-a@example.invalid",
      verified: true,
    }),
    reauthenticate: async () => "a",
    erase: async (id) => {
      erased.push(id);
      return true;
    },
  };
  const h = deletionHandler(deps);
  assert.equal(
    (await h(new Request("https://local.invalid", { method: "POST" }))).status,
    401,
  );
  assert.equal((await h(request({ ...input, actor: "b" }))).status, 400);
  assert.equal(
    (await h(request({ ...input, email: "synthetic-b@example.invalid" })))
      .status,
    400,
  );
  const wrong = deletionHandler({ ...deps, reauthenticate: async () => "b" });
  assert.equal((await wrong(request(input))).status, 403);
  assert.equal(erased.length, 0);
  const valid = await h(request(input));
  assert.equal(valid.status, 200);
  assert.deepEqual(await valid.json(), { deleted: true });
  assert.deepEqual(erased, ["a"]);
});
test("unverified, anonymous, expired, malformed and failed deletion never report success", async () => {
  let writes = 0;
  const base: DeletionDependencies = {
    user: async () => ({
      id: "a",
      email: "synthetic@example.invalid",
      verified: true,
    }),
    reauthenticate: async () => "a",
    erase: async () => {
      writes++;
      return false;
    },
  };
  for (const user of [
    null,
    { id: "a", verified: false },
    {
      id: "a",
      email: "synthetic@example.invalid",
      verified: true,
      anonymous: true,
    },
  ]) {
    const h = deletionHandler({ ...base, user: async () => user });
    assert.equal((await h(request(input))).status, 401);
  }
  assert.equal(writes, 0);
  const failure = await deletionHandler(base)(request(input));
  assert.equal(failure.status, 503);
  assert.equal((await failure.json()).deleted, undefined);
  const originReq = request(input);
  originReq.headers.set("Origin", "https://evil.invalid");
  assert.equal((await deletionHandler(base)(originReq)).status, 403);
  assert.equal(
    (await deletionHandler(base)(request({ confirmation: "DELETE" }))).status,
    400,
  );
});
