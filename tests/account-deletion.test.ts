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

test("Storage batches, Auth hard-delete and verification never turn a partial failure into success", async () => {
  const { eraseAccount } =
    await import("../supabase/functions/account-delete/erase");
  const calls: string[] = [];
  let files = [{ bucket: "avatars", name: "a/avatar.png" }];
  const admin = {
    files: async () => files,
    remove: async (_bucket: string, names: string[]) => {
      calls.push("storage");
      assert.deepEqual(names, ["a/avatar.png"]);
      files = [];
    },
    prepare: async () => {
      calls.push("prepare");
      return true;
    },
    deleteAuth: async (id: string) => {
      assert.equal(id, "a");
      calls.push("auth-admin-hard-delete");
      return true;
    },
    verify: async () => {
      calls.push("verify");
      return true;
    },
  };
  assert.equal(
    await eraseAccount(admin, "a", "synthetic-a@example.invalid"),
    true,
  );
  assert.deepEqual(calls, [
    "storage",
    "prepare",
    "auth-admin-hard-delete",
    "verify",
  ]);
  calls.length = 0;
  files = [{ bucket: "avatars", name: "a/avatar.png" }];
  await assert.rejects(
    eraseAccount(
      {
        ...admin,
        remove: async () => {
          throw Error("offline");
        },
      },
      "a",
      "synthetic-a@example.invalid",
    ),
  );
  assert.deepEqual(calls, []);
  files = [];
  assert.equal(
    await eraseAccount(
      { ...admin, deleteAuth: async () => false },
      "a",
      "synthetic-a@example.invalid",
    ),
    false,
  );
  assert.equal(calls.join(",").includes("verify"), false);
  assert.equal(
    await eraseAccount(
      { ...admin, verify: async () => false },
      "a",
      "synthetic-a@example.invalid",
    ),
    false,
  );
});
test("deleted-actor cache cleanup preserves other accounts and every solo-history key", async () => {
  const { deletionCacheKeys } =
    await import("../src/features/online/deletionLocal");
  const a = "00000000-0000-4000-8000-000000000001",
    b = "00000000-0000-4000-8000-000000000002";
  const own = [
    `@anla-quiz-online/pending/v1/${a}/match`,
    `@anla-quiz-online/challenge/v1/${a}/${b}`,
    `@anla-quiz-online/create/v1/${a}`,
    `anla-live-v1:${a}:room`,
    `anla-live-v1:${a}:create`,
    `anla-live-v1:${a}:match:answer`,
  ];
  const keep = [
    "@anla-ezberle-quiz/progress/v1",
    `anla-live-v1:${b}:room`,
    `@anla-quiz-online/create/v1/${b}`,
    "anla-live-pending-invite-v1",
  ];
  assert.deepEqual(deletionCacheKeys([...own, ...keep], a), own);
  assert.throws(() => deletionCacheKeys(keep, ""));
});
