import {
  createRemoteJWKSet,
  importPKCS8,
  jwtVerify,
  SignJWT,
  type JWTVerifyGetKey,
} from "jose";

const issuer = "https://appleid.apple.com";
export const appleKeys = createRemoteJWKSet(new URL(`${issuer}/auth/keys`), {
  timeoutDuration: 8000,
  cooldownDuration: 30000,
});
export async function verifyAppleIdentity(
  token: string,
  audience: string,
  subject: string,
  nonce: string,
  keys: JWTVerifyGetKey = appleKeys,
) {
  const { payload } = await jwtVerify(token, keys, {
    algorithms: ["RS256"],
    issuer,
    audience,
    maxTokenAge: "5m",
    clockTolerance: 5,
    requiredClaims: ["sub", "iat", "exp", "nonce"],
  });
  if (
    payload.sub !== subject ||
    payload.nonce !== nonce ||
    payload.aud !== audience
  )
    throw Error("APPLE_PROOF_INVALID");
}
export async function appleClientSecret(
  team: string,
  keyId: string,
  clientId: string,
  pem: string,
) {
  if (
    !/^[A-Z0-9]{10}$/.test(team) ||
    !/^[A-Z0-9]{10}$/.test(keyId) ||
    clientId !== "com.kovynelstudio.anlaezberle"
  )
    throw Error("APPLE_CONFIGURATION_INVALID");
  const key = await importPKCS8(pem.replaceAll("\\n", "\n"), "ES256");
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(team)
    .setSubject(clientId)
    .setAudience(issuer)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);
}
const bytes = (value: string) =>
  Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
const base64 = (value: Uint8Array) => btoa(String.fromCharCode(...value));
export function tokenCipher(keys: Record<string, string>, activeKey: string) {
  const load = async (id: string) => {
    const raw = keys[id];
    if (!raw || !/^[a-zA-Z0-9_-]{1,32}$/.test(id) || bytes(raw).length !== 32)
      throw Error("APPLE_CONFIGURATION_INVALID");
    return crypto.subtle.importKey("raw", bytes(raw), "AES-GCM", false, [
      "encrypt",
      "decrypt",
    ]);
  };
  return {
    async encrypt(token: string, context: string) {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv,
          additionalData: new TextEncoder().encode(context),
        },
        await load(activeKey),
        new TextEncoder().encode(token),
      );
      return `${activeKey}.${base64(iv)}.${base64(new Uint8Array(encrypted))}`;
    },
    async decrypt(envelope: string, context: string) {
      const [id, iv, data, extra] = envelope.split(".");
      if (!id || !iv || !data || extra) throw Error("APPLE_PROOF_INVALID");
      const clear = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: bytes(iv),
          additionalData: new TextEncoder().encode(context),
        },
        await load(id),
        bytes(data),
      );
      return new TextDecoder().decode(clear);
    },
  };
}
