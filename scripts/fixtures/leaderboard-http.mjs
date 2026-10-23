// UI tests only. Synthetic identities have no authority outside the isolated fixture.
import { Buffer } from "node:buffer";
import assert from "node:assert/strict";
export const userA = "11111111-1111-4111-8111-111111111111",
  userB = "22222222-2222-4222-8222-222222222222";
const jwt = (id) =>
  `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" })).toString("base64url")}.fixture-only`;
export function setup() {
  const state = {
    actor: userA,
    count: 60,
    optIn: true,
    friends: false,
    fail: false,
    offline: false,
    failPreference: false,
    preferenceWrites: 0,
    reads: 0,
    confirmed: true,
  };
  const user = () => ({
    id: state.actor,
    aud: "authenticated",
    role: "authenticated",
    email: "ranking-ui@example.invalid",
    email_confirmed_at: state.confirmed ? "2026-10-22T10:00:00Z" : undefined,
    created_at: "2026-10-22T10:00:00Z",
    app_metadata: { provider: "email" },
    user_metadata: {},
    is_anonymous: false,
  });
  const player = (i) => ({
    id:
      i === 60
        ? userA
        : `33333333-3333-4333-8333-${String(i).padStart(12, "0")}`,
    name: i === 60 ? "Ayşe" : "Test Oyuncu " + i,
    username: i === 60 ? "ayse_34" : "test_" + i,
    avatar: i % 18,
    xp: 3000 - i * 10,
    level: Math.min(100, Math.floor((3000 - i * 10) / 250) + 1),
    achievementsShared: false,
    badgeIds: [],
    showcase: [],
  });
  const install = async (context) => {
    await context.route("https://**/*", (r) => r.abort());
    await context.routeWebSocket("**", (ws) => ws.close());
    await context.route("http://127.0.0.1:55431/**", async (route) => {
      if (state.offline) return route.abort("internetdisconnected");
      const req = route.request(),
        path = new URL(req.url()).pathname;
      const reply = (body, status = 200) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(body),
          headers: { "access-control-allow-origin": "*" },
        });
      if (req.method() === "OPTIONS") return reply({});
      if (path.includes("online_service_capabilities"))
        return reply({ registrationEnabled: false });
      if (path === "/auth/v1/token") {
        state.actor = req.postDataJSON().email.startsWith("player-b")
          ? userB
          : userA;
        return reply({
          access_token: jwt(state.actor),
          refresh_token: "fixture-only",
          token_type: "bearer",
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          user: user(),
        });
      }
      if (path === "/auth/v1/user") return reply(user());
      if (path === "/auth/v1/logout") return reply({});
      if (path === "/functions/v1/online-duel") {
        const { operation, body } = req.postDataJSON();
        if (operation === "account_bootstrap") return reply({ ready: true });
        if (operation === "inbox")
          return reply({ notifications: [], challenges: [], unreadCount: 0 });
        if (operation === "social_self")
          return reply({
            profile: {
              name: state.actor === userA ? "Ayşe" : "Barış",
              username: state.actor === userA ? "ayse_34" : "baris_34",
              avatar: 0,
              discoverable: true,
            },
            player: null,
          });
        if (operation === "friends") return reply({ friendships: [] });
        if (operation === "player_search") return reply({ players: [] });
        if (operation === "username_check") return reply({ available: true });
        if (operation === "self")
          return reply({ profile: { name: "Ayşe" }, matches: [] });
        if (operation === "achievement_self")
          return reply({
            earned: [],
            metrics: { friends: 0, opponents: 0, wins: 0, perfect: 0 },
            shared: false,
            showcase: [],
          });
        if (operation === "leaderboard_settings") {
          state.preferenceWrites++;
          assert.deepEqual(Object.keys(body), ["enabled"]);
          if (state.failPreference)
            return reply({ error: "SERVICE_UNAVAILABLE" }, 503);
          state.optIn = body.enabled;
          return reply({ saved: true, optIn: state.optIn });
        }
        if (operation === "leaderboard") {
          state.reads++;
          if (state.fail === "network") return route.abort();
          if (state.fail) return reply({ error: "SERVICE_UNAVAILABLE" }, 503);
          assert(["global", "friends"].includes(body.scope));
          assert.equal(body.limit, 50);
          const entries = Array.from({ length: state.count }, (_, n) => ({
            rank: n + 1,
            games: 10,
            player: player(n + 1),
          })).filter((e) => e.player.id !== userA || state.optIn);
          const list =
            body.scope === "friends"
              ? state.friends
                ? entries.slice(0, 2)
                : []
              : entries;
          const from = body.cursor
            ? list.findIndex((e) => e.player.id === body.cursor.id) + 1
            : 0;
          const shown = list.slice(from, from + body.limit),
            last = shown.at(-1);
          return reply({
            entries: shown,
            nextCursor:
              from + shown.length < list.length
                ? { xp: last.player.xp, games: last.games, id: last.player.id }
                : null,
            scope: body.scope,
            asOf: new Date().toISOString(),
            self: {
              optIn: state.actor === userA && state.optIn,
              discoverable: true,
              username: state.actor === userA ? "ayse_34" : "baris_34",
              xp: state.actor === userA ? 2400 : 0,
              games: state.actor === userA ? 10 : 0,
              entry:
                body.scope === "global" && state.optIn && state.actor === userA
                  ? (list.find((e) => e.player.id === userA) ?? null)
                  : null,
            },
          });
        }
        return reply({ error: "UNEXPECTED_FIXTURE_OPERATION" }, 400);
      }
      return reply({}, 404);
    });
  };
  return { state, install };
}
