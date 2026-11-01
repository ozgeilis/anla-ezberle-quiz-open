/** Pure PKCE callback boundary; no JWTs, provider errors or URLs in messages. */
export type GoogleAttempt = {
  nonce: string;
  redirect: string;
  startedAt: number;
};
// Only locally authored messages cross into UI; never forward provider text.
export class GoogleFlowError extends Error {}
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
    throw new GoogleFlowError("Google girişinin süresi doldu. Yeniden dene.");
  let u: URL, expected: URL;
  try {
    u = new URL(value);
    expected = new URL(attempt.redirect);
  } catch {
    throw new GoogleFlowError("Google dönüş bağlantısı geçersiz.");
  }
  if (
    u.protocol !== expected.protocol ||
    u.host !== expected.host ||
    u.pathname !== expected.pathname ||
    u.searchParams.get("attempt") !== attempt.nonce ||
    u.searchParams.get("flow") !== "google" ||
    u.searchParams.getAll("flow").length !== 1 ||
    u.searchParams.getAll("attempt").length !== 1
  )
    throw new GoogleFlowError(
      "Google girişini doğrulayamadık. Giriş ekranından yeniden dene.",
    );
  const fragment = new URLSearchParams(u.hash.slice(1));
  const queryError = u.searchParams.has("error");
  const fragmentError = fragment.has("error");
  // Supabase may return a denial in the fragment. It is diagnostic only: never
  // accept implicit tokens, mixed proof or a foreign destination/nonce.
  if (
    (u.hash &&
      (!fragmentError ||
        [...fragment.keys()].some(
          (key) => !["error", "error_code", "error_description"].includes(key),
        ))) ||
    fragment.getAll("error").length > 1 ||
    u.searchParams.getAll("error").length > 1 ||
    (queryError && fragmentError) ||
    ((queryError || fragmentError) && u.searchParams.has("code"))
  )
    throw new GoogleFlowError(
      "Google girişini doğrulayamadık. Giriş ekranından yeniden dene.",
    );
  if (queryError || fragmentError)
    throw new GoogleFlowError(
      (queryError ? u.searchParams : fragment).get("error") === "access_denied"
        ? "Google girişi tamamlanmadı. İzin ekranını kapattıysan yeniden deneyebilirsin. Yeni Google hesabının kapalı teste ayrıca yetkilendirilmesi gerekir."
        : "Google girişi sunucuda tamamlanamadı. Yeni hesap kaydı kapalı test iznine bağlıdır. Mevcut hesabınla giriş yapabilir veya destek isteyebilirsin.",
    );
  const code = u.searchParams.get("code");
  if (!code || code.length > 4096 || u.searchParams.getAll("code").length !== 1)
    throw new GoogleFlowError("Google doğrulama kodu bulunamadı.");
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
