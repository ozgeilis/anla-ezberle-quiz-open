/** Pure PKCE callback boundary; no JWTs, provider errors or URLs in messages. */
export type GoogleAttempt = {
  nonce: string;
  redirect: string;
  startedAt: number;
};
export function googleCallbackCode(
  value: string,
  attempt: GoogleAttempt | null,
  now = Date.now(),
) {
  if (
    !attempt ||
    now - attempt.startedAt > 5 * 60_000 ||
    now < attempt.startedAt
  )
    throw Error("Google girişinin süresi doldu. Yeniden dene.");
  let u: URL, expected: URL;
  try {
    u = new URL(value);
    expected = new URL(attempt.redirect);
  } catch {
    throw Error("Google dönüş bağlantısı geçersiz.");
  }
  if (
    u.protocol !== expected.protocol ||
    u.host !== expected.host ||
    u.pathname !== expected.pathname ||
    u.searchParams.get("attempt") !== attempt.nonce ||
    u.searchParams.get("flow") !== "google" ||
    u.searchParams.getAll("flow").length !== 1 ||
    u.searchParams.getAll("attempt").length !== 1 ||
    u.hash
  )
    throw Error(
      "Google girişini doğrulayamadık. Giriş ekranından yeniden dene.",
    );
  if (u.searchParams.has("error"))
    throw Error("Google girişi tamamlanmadı. Yeniden deneyebilirsin.");
  const code = u.searchParams.get("code");
  if (!code || code.length > 4096 || u.searchParams.getAll("code").length !== 1)
    throw Error("Google doğrulama kodu bulunamadı.");
  return code;
}

/** Persist the PKCE verifier across a browser redirect, never a second session/JWT. */
export function verifierStorage(
  storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  },
  verifierKey: string,
) {
  const memory = new Map<string, string>();
  return {
    async getItem(key: string) {
      return key === verifierKey
        ? storage.getItem(key)
        : (memory.get(key) ?? null);
    },
    async setItem(key: string, value: string) {
      if (key === verifierKey) await storage.setItem(key, value);
      else memory.set(key, value);
    },
    async removeItem(key: string) {
      if (key === verifierKey) await storage.removeItem(key);
      else memory.delete(key);
    },
    clearMemory() {
      memory.clear();
    },
  };
}
