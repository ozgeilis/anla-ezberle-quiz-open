import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const allowed = new Set(
  (
    Deno.env.get("ALLOWED_ORIGINS") ??
    "http://127.0.0.1:8117,http://localhost:8117"
  ).split(","),
);
// Local preview origins for the closed development build.
allowed.add("http://127.0.0.1:8121");
allowed.add("http://localhost:8121");
// The public test site; exact origin only, no wildcard preview deployments.
allowed.add("https://anla-ezberle-quiz.vercel.app");
const fields: Record<string, string[]> = {
  leaderboard: ["scope", "limit", "cursor"],
  leaderboard_self: [],
  leaderboard_settings: ["enabled"],
  room_options: [],
  room_list: [],
  room_create: ["requestId"],
  room_join: ["code"],
  room_get: ["roomId"],
  room_ready: ["roomId", "ready"],
  room_settings: ["roomId", "topic", "level", "count"],
  room_start: ["roomId"],
  room_answer: ["roomId", "position", "optionId", "requestId"],
  room_leave: ["roomId"],
  achievement_self: [],
  achievement_settings: ["shared", "showcase"],
  account_bootstrap: [],
  inbox: [],
  notification_read: ["notificationId"],
  challenge_send: ["playerId", "requestId"],
  challenge_reply: ["challengeId", "action"],
  social_self: [],
  username_check: ["username"],
  social_profile: ["name", "username", "avatar", "discoverable"],
  player_search: ["query"],
  friends: [],
  friend_send: ["playerId"],
  friend_accept: ["friendshipId"],
  friend_remove: ["friendshipId"],
  self: [],
  profile: ["name"],
  create: ["requestId"],
  join: ["token"],
  get: ["matchId"],
  start: ["matchId"],
  invite: ["matchId"],
  cancel: ["matchId"],
  answer: ["matchId", "position", "optionId", "requestId"],
};

// Current platform keys are named JSON maps. Legacy automatic server envs
// remain supported for CLI/runtime compatibility; none enter the app bundle.
function serverKey(mapName: string, singleName: string, legacyName: string) {
  const raw = Deno.env.get(mapName);
  if (raw) {
    try {
      const named = JSON.parse(raw);
      if (typeof named?.default === "string") return named.default;
      // Rotated keys may use an explicit name instead of `default`.
      const prefix = mapName.includes("SECRET")
        ? "sb_secret_"
        : "sb_publishable_";
      const current = Object.values(named ?? {}).find(
        (value) => typeof value === "string" && value.startsWith(prefix),
      );
      if (typeof current === "string") return current;
    } catch {
      throw new Error("Invalid server configuration");
    }
  }
  const value = Deno.env.get(singleName) ?? Deno.env.get(legacyName);
  if (!value) throw new Error("Missing server configuration");
  return value;
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("Origin");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
  if (origin && allowed.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  headers["Access-Control-Allow-Headers"] =
    "authorization, apikey, content-type, x-client-info";
  headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  const reply = (status: number, error: string) =>
    new Response(JSON.stringify({ error }), { status, headers });
  if (origin && !allowed.has(origin)) return reply(403, "ORIGIN_NOT_ALLOWED");
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }
  if (request.method !== "POST") return reply(405, "METHOD_NOT_ALLOWED");
  const jwt = request.headers
    .get("Authorization")
    ?.match(/^Bearer (.+)$/i)?.[1];
  if (!jwt) return reply(401, "SIGN_IN_REQUIRED");
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const auth = createClient(
      url,
      serverKey(
        "SUPABASE_PUBLISHABLE_KEYS",
        "SUPABASE_PUBLISHABLE_KEY",
        "SUPABASE_ANON_KEY",
      ),
      {
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
    // A real Auth server round trip verifies identity and revocation. Never trust
    // a decoded JWT, getSession(), or a user id supplied in the request body.
    const {
      data: { user },
      error: authError,
    } = await auth.auth.getUser(jwt);
    if (authError || !user) return reply(401, "SESSION_EXPIRED");
    if (user.is_anonymous) return reply(403, "SIGN_IN_REQUIRED");
    if (!user.email_confirmed_at) return reply(403, "EMAIL_NOT_VERIFIED");
    const text = await request.text();
    if (text.length > 4096) return reply(413, "REQUEST_TOO_LARGE");
    const input = JSON.parse(text);
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      Object.keys(input).some((k) => !["operation", "body"].includes(k))
    ) {
      return reply(400, "INVALID_REQUEST");
    }
    const keys =
      typeof input.operation === "string" &&
      Object.hasOwn(fields, input.operation)
        ? fields[input.operation]
        : undefined;
    const body = input.body ?? {};
    if (
      !keys ||
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      Object.keys(body).some((k) => !keys.includes(k))
    ) {
      return reply(400, "INVALID_REQUEST");
    }
    const admin = createClient(
      url,
      serverKey(
        "SUPABASE_SECRET_KEYS",
        "SUPABASE_SECRET_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
      ),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data, error } = await admin.rpc(
      input.operation.startsWith("leaderboard")
        ? "player_leaderboard_command"
        : input.operation.startsWith("room_")
          ? "live_room_command"
          : ["achievement_self", "achievement_settings"].includes(
                input.operation,
              )
            ? "player_achievement_command"
            : [
                  "account_bootstrap",
                  "inbox",
                  "notification_read",
                  "challenge_send",
                  "challenge_reply",
                ].includes(input.operation)
              ? "player_matchmaking_command"
              : [
                    "social_self",
                    "username_check",
                    "social_profile",
                    "player_search",
                    "friends",
                    "friend_send",
                    "friend_accept",
                    "friend_remove",
                  ].includes(input.operation)
                ? "player_social_command"
                : "online_duel_command",
      {
        actor: user.id,
        operation: input.operation,
        body,
      },
    );
    if (error) {
      return reply(
        error.code === "22P02" ? 400 : 503,
        error.code === "22P02" ? "INVALID_REQUEST" : "SERVICE_UNAVAILABLE",
      );
    }
    if (data?.error) return reply(data.status ?? 400, data.error);
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (error) {
    return reply(
      error instanceof SyntaxError ? 400 : 503,
      error instanceof SyntaxError ? "INVALID_REQUEST" : "SERVICE_UNAVAILABLE",
    );
  }
});
