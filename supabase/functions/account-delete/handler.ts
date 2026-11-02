import { AppleDeletionError } from "./appleDeletion.ts";
// Independently testable HTTP boundary. Never trusts an actor/email in input.
export interface DeletionDependencies {
  user(jwt: string): Promise<{
    id: string;
    email?: string;
    verified: boolean;
    anonymous?: boolean;
    google?: boolean;
    apple?: boolean;
    appleSubject?: string;
    appleSessionActive?: boolean;
  } | null>;
  reauthenticate(email: string, password: string): Promise<string | null>;
  erase(actor: string): Promise<boolean>;
  apple?: {
    begin(actor: string): Promise<{ challenge: string; nonce: string }>;
    erase(
      actor: string,
      subject: string,
      challenge: string,
      proof?: { identityToken: string; authorizationCode: string },
    ): Promise<boolean>;
  };
  googleOtp?: {
    send(actor: string, email: string): Promise<string>;
    verify(
      actor: string,
      email: string,
      challenge: string,
      code: string,
    ): Promise<boolean>;
  };
}
export function deletionHandler(deps: DeletionDependencies) {
  const origins = new Set([
    "https://anla-ezberle-quiz.vercel.app",
    "http://localhost:8121",
    "http://127.0.0.1:8121",
    "http://localhost:8165",
    "http://127.0.0.1:8165",
  ]);
  return async (req: Request) => {
    const origin = req.headers.get("Origin");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Vary: "Origin",
      "Access-Control-Allow-Headers":
        "authorization, apikey, content-type, x-client-info",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };
    if (origin && origins.has(origin))
      headers["Access-Control-Allow-Origin"] = origin;
    const reply = (status: number, value: object) =>
      new Response(JSON.stringify(value), { status, headers });
    if (origin && !origins.has(origin))
      return reply(403, { error: "ORIGIN_NOT_ALLOWED" });
    if (req.method === "OPTIONS") return reply(200, {});
    if (req.method !== "POST")
      return reply(405, { error: "METHOD_NOT_ALLOWED" });
    const jwt = req.headers.get("Authorization")?.match(/^Bearer (.+)$/i)?.[1];
    if (!jwt) return reply(401, { error: "SIGN_IN_REQUIRED" });
    try {
      const user = await deps.user(jwt);
      if (!user || user.anonymous || !user.verified || !user.email)
        return reply(401, { error: "SESSION_EXPIRED" });
      const raw = await req.text();
      if (raw.length > 16384) return reply(413, { error: "REQUEST_TOO_LARGE" });
      const body = JSON.parse(raw);
      if (!body || Array.isArray(body) || typeof body !== "object")
        return reply(400, { error: "INVALID_REQUEST" });
      // Linked Apple identities must also revoke Apple grants; another provider
      // cannot use the password/Google branch to bypass that obligation.
      if (
        user.apple ||
        user.appleSubject ||
        body.operation === "apple-begin" ||
        body.operation === "apple-delete"
      ) {
        if (!user.appleSubject || !user.appleSessionActive)
          return reply(403, { error: "APPLE_PROOF_INVALID" });
        if (!deps.apple)
          return reply(503, { error: "APPLE_DELETION_UNAVAILABLE" });
        if (body.operation === "apple-begin" && Object.keys(body).length === 1)
          return reply(200, await deps.apple.begin(user.id));
        if (
          body.operation !== "apple-delete" ||
          body.confirmation !== "DELETE" ||
          typeof body.challenge !== "string" ||
          Object.keys(body).some(
            (k) =>
              ![
                "operation",
                "confirmation",
                "challenge",
                "identityToken",
                "authorizationCode",
              ].includes(k),
          )
        )
          return reply(400, { error: "INVALID_REQUEST" });
        const hasProof = "identityToken" in body || "authorizationCode" in body;
        if (
          hasProof &&
          (typeof body.identityToken !== "string" ||
            typeof body.authorizationCode !== "string")
        )
          return reply(400, { error: "INVALID_REQUEST" });
        const deleted = await deps.apple.erase(
          user.id,
          user.appleSubject,
          body.challenge,
          hasProof
            ? {
                identityToken: body.identityToken,
                authorizationCode: body.authorizationCode,
              }
            : undefined,
        );
        return deleted
          ? reply(200, { deleted: true })
          : reply(503, { error: "APPLE_RETRY_REQUIRED" });
      }
      if (raw.length > 2048) return reply(413, { error: "REQUEST_TOO_LARGE" });
      if (body.operation === "google-code") {
        if (Object.keys(body).some((k) => k !== "operation"))
          return reply(400, { error: "INVALID_REQUEST" });
        if (!user.google || !deps.googleOtp)
          return reply(403, { error: "GOOGLE_REAUTH_NOT_ENABLED" });
        return reply(200, {
          challenge: await deps.googleOtp.send(user.id, user.email),
        });
      }
      if (body.confirmation !== "DELETE")
        return reply(400, { error: "INVALID_REQUEST" });
      if ("googleCode" in body) {
        if (
          Object.keys(body).some(
            (k) => !["googleCode", "challenge", "confirmation"].includes(k),
          ) ||
          typeof body.googleCode !== "string" ||
          typeof body.challenge !== "string"
        )
          return reply(400, { error: "INVALID_REQUEST" });
        if (
          !user.google ||
          !deps.googleOtp ||
          !(await deps.googleOtp.verify(
            user.id,
            user.email,
            body.challenge,
            body.googleCode,
          ))
        )
          return reply(403, { error: "REAUTHENTICATION_REQUIRED" });
      } else {
        if (
          Object.keys(body).some(
            (k) => !["password", "confirmation"].includes(k),
          ) ||
          typeof body.password !== "string" ||
          !body.password.length ||
          body.password.length > 256
        )
          return reply(400, { error: "INVALID_REQUEST" });
        if ((await deps.reauthenticate(user.email, body.password)) !== user.id)
          return reply(403, { error: "REAUTHENTICATION_REQUIRED" });
      }
      if (!(await deps.erase(user.id)))
        return reply(503, { error: "DELETION_NOT_COMPLETED" });
      return reply(200, { deleted: true });
    } catch (error) {
      if (error instanceof AppleDeletionError)
        return reply(error.code === "APPLE_PROOF_INVALID" ? 403 : 503, {
          error: error.code,
        });
      return reply(503, { error: "DELETION_NOT_COMPLETED" });
    }
  };
}
