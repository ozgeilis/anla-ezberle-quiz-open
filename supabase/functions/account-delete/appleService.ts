import { createRemoteJWKSet, customFetch } from "jose";
import {
  appleClientSecret,
  tokenCipher,
  verifyAppleIdentity,
} from "./appleCrypto.ts";
import {
  appleDeletionProof,
  type AppleDeletionStore,
} from "./appleDeletion.ts";
export function appleDeletionService(
  env: (name: string) => string | undefined,
  store: AppleDeletionStore,
  erase: (actor: string) => Promise<boolean>,
  transport: typeof fetch = fetch,
) {
  const clientId = "com.kovynelstudio.anlaezberle";
  const get = (name: string) => {
    const value = env(name);
    if (!value) throw Error("APPLE_CONFIGURATION_INVALID");
    return value;
  };
  const keys = createRemoteJWKSet(
    new URL("https://appleid.apple.com/auth/keys"),
    { timeoutDuration: 8000, [customFetch]: transport },
  );
  const cipher = tokenCipher(
    JSON.parse(get("APPLE_DELETION_ENCRYPTION_KEYS")),
    get("APPLE_DELETION_ACTIVE_KEY"),
  );
  const post = async (
    operation: "token" | "revoke",
    body: Record<string, string>,
  ) => {
    const secret = await appleClientSecret(
      get("APPLE_TEAM_ID"),
      get("APPLE_KEY_ID"),
      clientId,
      get("APPLE_PRIVATE_KEY"),
    );
    const response = await transport(
      `https://appleid.apple.com/auth/${operation}`,
      {
        method: "POST",
        redirect: "error",
        signal: AbortSignal.timeout(8000),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: secret,
          ...body,
        }),
      },
    );
    if (response.status !== 200) throw Error("APPLE_REQUEST_FAILED");
    return response;
  };
  return appleDeletionProof({
    store,
    erase,
    ...cipher,
    verify: (token, subject, nonceHash) =>
      verifyAppleIdentity(token, clientId, subject, nonceHash, keys),
    async exchange(code) {
      const response = await post("token", {
        grant_type: "authorization_code",
        code,
      });
      const data = await response.json();
      if (
        typeof data.id_token !== "string" ||
        typeof data.refresh_token !== "string" ||
        !data.refresh_token ||
        data.refresh_token.length > 4096
      )
        throw Error("APPLE_PROOF_INVALID");
      return { identityToken: data.id_token, refreshToken: data.refresh_token };
    },
    async revoke(token) {
      await post("revoke", { token, token_type_hint: "refresh_token" });
    },
  });
}
