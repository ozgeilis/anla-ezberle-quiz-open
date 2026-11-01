import {
  callbackUrlFromParams,
  hasCallbackPayload,
} from "../src/features/online/authCallbackUrl";
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  playerDisplayName,
  displayNameError,
  socialProfileBody,
} from "../src/features/online/identity";
import { verifyEmailLink, LinkAuth } from "../src/features/online/verifyLink";
import type { SocialSelf } from "../src/features/online/types";
const profile: SocialSelf = {
  profile: {
    name: "Old display name",
    username: "bilgiyolcusu",
    avatar: 0,
    discoverable: false,
  },
  player: null,
};
test("display name and unique handle remain independent; guests use their local name", () => {
  assert.equal(playerDisplayName("Yerel Ad", profile), "Old display name");
  assert.equal(
    playerDisplayName("Yerel Ad", {
      ...profile,
      profile: { ...profile.profile, username: null },
    }),
    "Old display name",
  );
  assert.equal(playerDisplayName("Yerel Ad", null), "Yerel Ad");
  assert.equal(playerDisplayName(" ", null), "Oyuncu");
});
function fixture(overrides: Partial<LinkAuth> = {}) {
  const calls: string[] = [];
  const auth: LinkAuth = {
    exchangeCodeForSession: async () => {
      calls.push("exchange");
      return { error: null };
    },
    setSession: async () => {
      calls.push("session");
      return { error: null };
    },
    verifyOtp: async () => {
      calls.push("otp");
      return { error: null };
    },
    getUser: async () => {
      calls.push("server-user");
      return {
        data: { user: { id: "synthetic", email_confirmed_at: "2026-10-22" } },
        error: null,
      };
    },
    signOut: async () => {
      calls.push("signout");
    },
    ...overrides,
  };
  return { auth, calls };
}
test("email link success requires authoritative verified server user after exchange", async () => {
  const { auth, calls } = fixture();
  assert.deepEqual(
    await verifyEmailLink("https://quiz.test/online/auth?code=test-only", auth),
    { recovery: false, userId: "synthetic" },
  );
  assert.deepEqual(calls, ["exchange", "server-user"]);
  const recovery = fixture();
  assert.deepEqual(
    await verifyEmailLink(
      "anlaezberlequiz://online/auth#access_token=test-only&refresh_token=test-only&type=recovery",
      recovery.auth,
    ),
    { recovery: true, userId: "synthetic" },
  );
  assert.deepEqual(recovery.calls, ["session", "server-user"]);
});
test("unconfirmed and anonymous identities never yield a confirmation success", async () => {
  for (const user of [
    { id: "synthetic" },
    { id: "synthetic", email_confirmed_at: "today", is_anonymous: true },
    null,
  ]) {
    const { auth, calls } = fixture({
      getUser: async () => ({ data: { user }, error: null }),
    });
    await assert.rejects(
      verifyEmailLink("https://quiz.test?code=test-only", auth),
      /tamamlanamadı/,
    );
    assert(calls.includes("signout"));
  }
});
test("invalid or expired links are rejected before auth and never echo provider descriptions", async () => {
  for (const link of [
    "invalid",
    "https://quiz.test",
    "https://quiz.test#error=access_denied&error_code=otp_expired&error_description=PRIVATE_TOKEN",
  ]) {
    const { auth, calls } = fixture();
    await assert.rejects(
      verifyEmailLink(link, auth),
      (e) => e instanceof Error && !e.message.includes("PRIVATE_TOKEN"),
    );
    assert.deepEqual(calls, []);
  }
});
test("network failures and expired exchanges remain actionable errors, not successes", async () => {
  const net = fixture({
    exchangeCodeForSession: async () => {
      throw Error("private network detail");
    },
  });
  await assert.rejects(
    verifyEmailLink("https://quiz.test?code=test-only", net.auth),
    /Bağlantını/,
  );
  const expired = fixture({
    exchangeCodeForSession: async () => ({
      error: { code: "flow_state_expired" },
    }),
  });
  await assert.rejects(
    verifyEmailLink("https://quiz.test?code=test-only", expired.auth),
    /süresi doldu/,
  );
  const fetch = fixture({
    getUser: async () => {
      throw Error("private detail");
    },
  });
  await assert.rejects(
    verifyEmailLink("https://quiz.test?code=test-only", fetch.auth),
    /Bağlantını/,
  );
});

test("identity writes preserve unrelated canonical fields and display-name validation", () => {
  const body = socialProfileBody(profile, {
    username: "new_handle",
    discoverable: true,
  });
  assert.equal(body.name, profile.profile.name);
  assert.equal(body.avatar, profile.profile.avatar);
  assert.equal(body.username, "new_handle");
  assert.equal(
    socialProfileBody(profile, { avatar: 12 }).username,
    "bilgiyolcusu",
  );
  assert.equal(socialProfileBody(profile, { avatar: 12 }).discoverable, false);
  assert.equal(displayNameError("Ayşe Nur"), null);
  for (const bad of ["ab", "a".repeat(25), "A<y>şe", "www.test.test", "a\nb"])
    assert(displayNameError(bad));
});

test("duplicate cold-start callbacks exchange a single-use code only once", async () => {
  const { auth, calls } = fixture();
  const link = "https://quiz.test/online/auth?code=duplicate";
  const results = await Promise.all([
    verifyEmailLink(link, auth),
    verifyEmailLink(link, auth),
  ]);
  assert.equal(calls.filter((x) => x === "exchange").length, 1);
  assert.equal(results[0]!.userId, results[1]!.userId);
});
test("token hash confirmation and PKCE recovery stay distinct", async () => {
  const f = fixture();
  assert.equal(
    (
      await verifyEmailLink(
        "https://quiz.test/online/auth?token_hash=synthetic&type=signup",
        f.auth,
      )
    ).recovery,
    false,
  );
  assert(f.calls.includes("otp"));
  const recover = fixture({
    exchangeCodeForSession: async () => ({
      data: { redirectType: "recovery" },
      error: null,
    }),
  });
  assert.equal(
    (
      await verifyEmailLink(
        "https://quiz.test/online/auth?code=recovery",
        recover.auth,
      )
    ).recovery,
    true,
  );
  for (const url of [
    "?code=a&code=b",
    "?code=a&token_hash=b&type=email",
    "?token_hash=x&type=invite",
    "#access_token=x",
  ]) {
    const f = fixture();
    await assert.rejects(
      verifyEmailLink("https://quiz.test/online/auth" + url, f.auth),
    );
    assert.deepEqual(f.calls, []);
  }
});

test("Router query survives a late Linking listener without turning a dev-client URL into a credential", () => {
  assert.equal(
    hasCallbackPayload(
      "anla-ezberle-quiz://expo-development-client/?url=http://localhost:8171",
    ),
    false,
  );
  assert.equal(
    callbackUrlFromParams("anla-ezberle-quiz://online/auth", {}),
    null,
  );
  const url = callbackUrlFromParams("anla-ezberle-quiz://online/auth", {
    code: "synthetic",
    purpose: "recovery",
    unknown: "ignored",
  })!;
  assert.equal(new URL(url).searchParams.get("code"), "synthetic");
  assert.equal(new URL(url).searchParams.has("unknown"), false);
  const duplicate = callbackUrlFromParams("https://quiz.test/online/auth", {
    code: ["a", "b"],
  })!;
  assert.equal(new URL(duplicate).searchParams.getAll("code").length, 2);
});
