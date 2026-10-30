// Isolated synthetic Auth/social fixture. No hosted writes or real credentials.
import { Buffer } from "node:buffer";
import assert from "node:assert/strict";
const api = "http://127.0.0.1:55431";
export const userA = "11111111-1111-4111-8111-111111111111",
  userB = "22222222-2222-4222-8222-222222222222";
export const token = (id) =>
  `${Buffer.from('{"alg":"HS256","typ":"JWT"}').toString("base64url")}.${Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now() / 1000) + 3600, role: "authenticated" })).toString("base64url")}.ci-not-a-signature`;
export function setup() {
  const state = {
    actor: userA,
    username: null,
    name: "Ayşe",
    failName: false,
    failRead: false,
    failInbox: false,
    failAfterChallenge: false,
    readWrites: 0,
    nameWrites: 0,
    friendState: "pending",
    notifications: null,
    challenges: [],
    unread: 0,
    failSave: false,
    failEmail: false,
    failSignup: false,
    failUser: false,
    unconfirmed: false,
    writes: 0,
    usernameChecks: 0,
    userChecks: 0,
  };
  const user = () => ({
    id: state.actor,
    aud: "authenticated",
    role: "authenticated",
    email:
      state.actor === userA
        ? "player-a@example.invalid"
        : "player-b@example.invalid",
    email_confirmed_at: state.unconfirmed ? undefined : "2026-10-22T10:00:00Z",
    created_at: "2026-10-22T10:00:00Z",
    app_metadata: { provider: "email" },
    user_metadata: {},
    is_anonymous: false,
  });
  const session = () => ({
    access_token: token(state.actor),
    refresh_token: "ci-fixture-only",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: user(),
  });
  const install = async (context) => {
    await context.route("https://**/*", (r) => r.abort());
    await context.routeWebSocket("**", (ws) => ws.close());
    await context.route(`${api}/**`, async (route) => {
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
      if (path === "/rest/v1/rpc/push_settings")
        return reply({
          available: false,
          preferences: {
            enabled: false,
            friends: true,
            invites: true,
            results: true,
            rooms: true,
          },
        });
      if (path.includes("google_auth_capabilities"))
        return reply({
          googleOAuthEnabled: false,
          googleDeletionEnabled: false,
          googleSignupEnabled: false,
        });
      if (path.includes("online_service_capabilities"))
        return reply({ registrationEnabled: true });
      if (path === "/auth/v1/signup")
        return state.failSignup
          ? reply(
              { code: "unexpected_failure", msg: "private backend detail" },
              500,
            )
          : reply({
              user: { ...user(), email_confirmed_at: undefined },
              session: null,
            });
      if (path === "/auth/v1/resend" || path === "/auth/v1/recover")
        return state.failEmail === "network"
          ? route.abort()
          : state.failEmail
            ? reply(
                { code: "over_email_send_rate_limit", msg: "private detail" },
                429,
              )
            : reply({});
      if (path === "/auth/v1/token") {
        const body = req.postDataJSON();
        state.actor = body.email?.startsWith("player-b") ? userB : state.actor;
        return reply(session());
      }
      if (path === "/auth/v1/user") {
        state.userChecks++;
        return state.failUser ? route.abort() : reply(user());
      }
      if (path === "/auth/v1/logout") return reply({});
      if (path === "/functions/v1/online-duel") {
        const { operation, body } = req.postDataJSON();
        if (operation === "account_bootstrap") return reply({ ready: true });
        if (operation === "inbox" && state.failInbox)
          return reply({ error: "SERVER_ERROR" }, 500);
        if (operation === "inbox")
          return reply({
            notifications:
              state.notifications ??
              (state.unread
                ? [
                    {
                      id: "ci-notification",
                      kind: "friend_request",
                      referenceId: "ci-friend",
                      createdAt: "2026-10-22T10:00:00Z",
                      read: false,
                    },
                  ]
                : []),
            challenges: state.challenges,
            unreadCount: state.unread,
          });
        if (operation === "notification_read") {
          state.readWrites++;
          if (state.failRead) return reply({ error: "SERVER_ERROR" }, 500);
          if (state.notifications)
            state.notifications = state.notifications.map((n) =>
              body.notificationId === "all" || n.id === body.notificationId
                ? { ...n, read: true }
                : n,
            );
          state.unread = state.notifications
            ? state.notifications.filter((n) => !n.read).length
            : 0;
          return reply({ saved: true });
        }
        if (operation === "self")
          return reply({
            profile: { name: state.actor === userB ? "Zeynep" : state.name },
            matches: [],
          });
        if (operation === "social_self")
          return reply({
            profile: {
              name: state.actor === userB ? "Zeynep" : state.name,
              username:
                state.actor === userB ? "ikinci_oyuncu" : state.username,
              avatar: 0,
              discoverable: false,
            },
            player: null,
          });
        if (operation === "username_check") {
          state.usernameChecks++;
          return reply({ available: true });
        }
        if (operation === "social_profile") {
          state.writes++;
          if (state.failSave) return reply({ error: "USERNAME_TAKEN" }, 409);
          state.username = body.username;
          assert.equal(body.name, state.name);
          assert.equal(body.avatar, 0);
          assert.equal(body.discoverable, false);
          return reply({ saved: true });
        }
        if (operation === "profile") {
          state.nameWrites++;
          if (state.failName) return reply({ error: "SERVER_ERROR" }, 500);
          assert.deepEqual(Object.keys(body), ["name"]);
          state.name = body.name;
          return reply({ profile: { name: state.name } });
        }
        if (operation === "friends")
          return reply({
            friendships: state.friendState
              ? [
                  {
                    id: "ci-friend",
                    state: state.friendState,
                    incoming: true,
                    player: {
                      id: userB,
                      name: "Deniz",
                      username: "deniz_bilgi",
                      avatar: 12,
                      xp: 300,
                      level: 2,
                    },
                  },
                ]
              : [],
          });
        if (operation === "friend_accept" || operation === "friend_remove") {
          assert.equal(body.friendshipId, "ci-friend");
          state.friendState = operation === "friend_accept" ? "accepted" : null;
          return reply({ saved: true });
        }
        if (operation === "challenge_reply") {
          const c = state.challenges.find((c) => c.id === body.challengeId);
          assert(
            c && c.state === "pending" && Date.parse(c.expiresAt) > Date.now(),
          );
          c.state =
            body.action === "accept"
              ? "accepted"
              : body.action === "decline"
                ? "declined"
                : "cancelled";
          if (c.state === "accepted") {
            c.matchId = "ci-match";
            c.matchState = "waiting_for_opponent";
          }
          if (state.failAfterChallenge) state.failInbox = true;
          return reply({ challenge: c });
        }
        if (operation === "get")
          return reply({
            id: "ci-match",
            state: "completed",
            createdAt: new Date().toISOString(),
            players: [
              { slot: "a", name: "Ayşe", score: 900 },
              { slot: "b", name: "Deniz", score: 800 },
            ],
            questions: [],
            answers: [],
            review: [],
            result: { winner: "a" },
          });
        if (operation === "achievement_self")
          return reply({
            earned: [],
            metrics: { friends: 0, opponents: 0, wins: 0, perfect: 0 },
            shared: false,
            showcase: [],
          });
        return reply({ error: "UNEXPECTED_FIXTURE_OPERATION" }, 400);
      }
      return reply({ error: "UNEXPECTED_FIXTURE_ROUTE" }, 400);
    });
  };
  return { state, install };
}
