import assert from "node:assert/strict";
import { test } from "node:test";
import {
  defaultPushPreferences,
  effectivePush,
  patchPreferences,
  pushEnvelope,
  safePushTarget,
  resolvePushDestination,
} from "../src/features/notifications/model";
import {
  pushDispatchHandler,
  type PushJob,
  type PushWorkerDeps,
} from "../supabase/functions/push-dispatch/handler";
const id = "11111111-1111-4111-8111-111111111111",
  actor = "22222222-2222-4222-8222-222222222222";
test("master off preserves all subtype choices; permission and rollout cannot be bypassed", () => {
  const chosen = patchPreferences(defaultPushPreferences, {
    enabled: true,
    friends: false,
    rooms: false,
  });
  const off = patchPreferences(chosen, { enabled: false });
  assert.deepEqual(patchPreferences(off, { enabled: true }), chosen);
  for (const permission of ["denied", "undetermined", "unsupported"] as const)
    assert.equal(effectivePush(chosen, permission, true), false);
  assert.equal(effectivePush(chosen, "granted", false), false);
  assert.equal(effectivePush(chosen, "granted", true), true);
  assert.equal(defaultPushPreferences.enabled, false);
  assert.throws(() => patchPreferences(chosen, { enabled: "true" } as never));
  assert.throws(() => patchPreferences(chosen, { toString: true } as never));
});
test("push envelopes never accept arbitrary URLs, foreign payload fields or malformed identifiers", () => {
  const v = {
    version: 1,
    source: "inbox",
    notificationId: id,
    recipientId: actor,
  };
  assert.deepEqual(pushEnvelope(v), v);
  assert.deepEqual(pushEnvelope({ ...v, source: "room" }), {
    ...v,
    source: "room",
  });
  for (const value of [
    null,
    [],
    { ...v, url: "https://evil.invalid" },
    { ...v, version: 2 },
    { ...v, source: "https://evil.invalid" },
    { ...v, recipientId: "other" },
    { ...v, notificationId: "../../account-delete" },
  ])
    assert.equal(pushEnvelope(value), null);
  for (const kind of ["notification", "match", "room"])
    assert(safePushTarget({ kind, id }));
  for (const value of [
    { kind: "https://evil.invalid", id },
    { kind: "room", id: "../" },
    null,
  ])
    assert.equal(safePushTarget(value), null);
});
test("push lookup success and failure keep destinations allowlisted and source-specific", () => {
  const pending = pushEnvelope({
    version: 1,
    source: "inbox",
    notificationId: id,
    recipientId: actor,
  })!;
  assert.deepEqual(
    resolvePushDestination({ kind: "match", id: actor }, pending),
    {
      pathname: "/online",
      params: { match: actor },
    },
  );
  for (const invalid of [
    null,
    { url: "https://evil.invalid" },
    { kind: "room", id: "../account-delete" },
  ]) {
    assert.deepEqual(resolvePushDestination(invalid, pending), {
      pathname: "/online/notification/[id]",
      params: { id },
    });
    assert.deepEqual(
      resolvePushDestination(invalid, { ...pending, source: "room" }),
      {
        pathname: "/live",
        params: { room: id },
      },
    );
  }
});
function fixture(
  result: unknown = { data: { status: "ok", id: "ticket-id" } },
) {
  const calls: { op: string; body?: object }[] = [],
    sent: { url: string; body: Record<string, unknown> }[] = [];
  let claimed = false;
  const job: PushJob = {
    id,
    token: "ExpoPushToken[synthetic_test_only]",
    kind: "friend_request",
    source: "inbox",
    notificationId: id,
    recipientId: actor,
  };
  const deps: PushWorkerDeps = {
    secret: "synthetic-dispatch-secret",
    expoAccessToken: "synthetic-expo-secret",
    rpc: async (op, body) => {
      calls.push({ op, body });
      if (op === "claim") {
        if (claimed) return [];
        claimed = true;
        return [job];
      }
      if (op === "receipts") return [];
      if (op === "authorize") return true;
      return { saved: true };
    },
    fetch: async (url, options) => {
      sent.push({ url: String(url), body: JSON.parse(String(options?.body)) });
      return new Response(JSON.stringify(result), { status: 200 });
    },
  };
  const req = (secret = deps.secret) =>
    new Request("http://local.invalid", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
    });
  return { deps, calls, sent, req };
}
test("worker rejects unauthenticated clients and missing configuration before any claim or send", async () => {
  const f = fixture();
  const h = pushDispatchHandler(f.deps);
  assert.equal((await h(f.req("foreign-jwt"))).status, 401);
  assert.equal(
    (await pushDispatchHandler({ ...f.deps, expoAccessToken: "" })(f.req()))
      .status,
    503,
  );
  assert.equal(f.calls.length, 0);
  assert.equal(f.sent.length, 0);
});
test("only claimed real event envelopes are sent; replay does not create a second push", async () => {
  const f = fixture(),
    h = pushDispatchHandler(f.deps);
  assert.equal((await h(f.req())).status, 200);
  await h(f.req());
  assert.equal(f.sent.length, 1);
  const payload = f.sent[0]!.body;
  assert.deepEqual(payload.data, {
    version: 1,
    source: "inbox",
    notificationId: id,
    recipientId: actor,
  });
  assert.equal(f.sent[0]!.url, "https://exp.host/--/api/v2/push/send");
  assert(!JSON.stringify(payload).includes("synthetic-expo-secret"));
  assert.deepEqual(f.calls.find((c) => c.op === "finish")?.body, {
    id,
    ticket: "ticket-id",
  });
});
test("uncertain network outcomes are recorded without duplicate retry or false delivery", async () => {
  const f = fixture();
  f.deps.fetch = async () => {
    throw Error("synthetic network loss");
  };
  const response = await pushDispatchHandler(f.deps)(f.req());
  assert.equal(response.status, 200);
  assert.deepEqual(f.calls.find((c) => c.op === "finish")?.body, {
    id,
    error: "SendOutcomeUnknown",
  });
  assert.deepEqual(await response.json(), { submitted: 0, receipts: 0 });
});
test("invalid tokens and receipt failures go through server revocation, never raw provider error logs", async () => {
  const f = fixture({
    data: {
      status: "error",
      message: "DO_NOT_LOG_TOKEN",
      details: { error: "DeviceNotRegistered" },
    },
  });
  const response = await pushDispatchHandler(f.deps)(f.req());
  assert.deepEqual(f.calls.find((c) => c.op === "finish")?.body, {
    id,
    error: "DeviceNotRegistered",
  });
  assert(!(await response.text()).includes("DO_NOT_LOG_TOKEN"));
});
test("tickets are not delivery proof; delayed receipts are checked and bound to their original job", async () => {
  const f = fixture();
  const rpc = f.deps.rpc;
  f.deps.rpc = async (op, body) =>
    op === "receipts"
      ? [{ id: "receipt-job", ticket: "old-ticket" }]
      : rpc(op, body);
  f.deps.fetch = async (url) =>
    new Response(
      JSON.stringify(
        String(url).endsWith("getReceipts")
          ? {
              data: {
                "old-ticket": {
                  status: "error",
                  details: { error: "DeviceNotRegistered" },
                },
              },
            }
          : { data: { status: "ok", id: "ticket-id" } },
      ),
    );
  const response = await pushDispatchHandler(f.deps)(f.req());
  assert.deepEqual(await response.json(), { submitted: 1, receipts: 0 });
  assert.deepEqual(f.calls.find((c) => c.op === "receipt")?.body, {
    id: "receipt-job",
    status: "error",
    error: "DeviceNotRegistered",
  });
});

test("native permission refusal never requests a token or saves enabled", async () => {
  const { enableOnDevice } =
    await import("../src/features/notifications/model");
  let tokens = 0,
    writes = 0;
  await assert.rejects(
    enableOnDevice({
      permission: async () => "denied",
      reportPermission: () => {},
      registration: async () => {
        tokens++;
        return { deviceId: id, token: "synthetic", platform: "android" };
      },
      commit: async () => {
        writes++;
        return {
          available: true,
          preferences: { ...defaultPushPreferences, enabled: true },
        };
      },
    }),
  );
  assert.equal(tokens, 0);
  assert.equal(writes, 0);
});
test("token registration and acknowledged save are ordered, and failure never commits a preference", async () => {
  const { enableOnDevice } =
    await import("../src/features/notifications/model");
  let writes = 0;
  const flow: string[] = [];
  const deps = {
    permission: async () => {
      flow.push("permission");
      return "granted" as const;
    },
    reportPermission: () => {},
    registration: async () => {
      flow.push("token");
      return { deviceId: id, token: "synthetic", platform: "android" };
    },
    commit: async () => {
      writes++;
      flow.push("save");
      return {
        available: true,
        preferences: { ...defaultPushPreferences, enabled: true },
      };
    },
  };
  const saved = await enableOnDevice(deps);
  assert.equal(saved.preferences.enabled, true);
  assert.deepEqual(flow, ["permission", "token", "save"]);
  await assert.rejects(
    enableOnDevice({
      ...deps,
      registration: async () => {
        throw Error("FCM missing");
      },
    }),
  );
  assert.equal(writes, 1);
  await assert.rejects(
    enableOnDevice({
      ...deps,
      commit: async () => {
        throw Error("database unavailable");
      },
    }),
  );
  assert.equal(defaultPushPreferences.enabled, false);
});

test("a master switch or session revoked after claim suppresses the send before Expo is called", async () => {
  const f = fixture(),
    rpc = f.deps.rpc;
  f.deps.rpc = async (op, body) => (op === "authorize" ? false : rpc(op, body));
  const response = await pushDispatchHandler(f.deps)(f.req());
  assert.equal(response.status, 200);
  assert.equal(f.sent.length, 0);
  assert.deepEqual(await response.json(), { submitted: 0, receipts: 0 });
});
