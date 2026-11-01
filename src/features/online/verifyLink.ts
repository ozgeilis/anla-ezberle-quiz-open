import { authCallbackKey } from "./authCallbackUrl";
import { authFailureMessage, authMessage, verifiedAccount } from "./account";
type AuthError = { code?: string; status?: number };
type Response = {
  error: AuthError | null;
  data?: { redirectType?: string | null; user?: unknown; session?: unknown };
};
export interface LinkAuth {
  exchangeCodeForSession: (code: string) => Promise<Response>;
  setSession: (tokens: {
    access_token: string;
    refresh_token: string;
  }) => Promise<Response>;
  verifyOtp: (params: {
    token_hash: string;
    type: "email" | "recovery";
  }) => Promise<Response>;
  getUser: () => Promise<{
    data: {
      user: {
        id: string;
        email_confirmed_at?: string;
        is_anonymous?: boolean;
      } | null;
    };
    error: AuthError | null;
  }>;
  signOut: (options: { scope: "local" }) => Promise<unknown>;
}
export class MissingAuthCredentials extends Error {
  constructor() {
    super(
      "Bu bağlantıda oturum bilgisi yok. E-postandaki bağlantıyı bu cihazda yeniden aç. Bağlantıyı başka cihazda tamamladıysan güvenli giriş için giriş ekranına dön.",
    );
  }
}
/** Single-use codes may arrive through both cold-start and Linking events. */
const pending = new WeakMap<
  LinkAuth,
  Map<string, Promise<{ recovery: boolean; userId: string }>>
>();
export function verifyEmailLink(value: string, auth: LinkAuth) {
  const callbackKey = authCallbackKey(value);
  let entries = pending.get(auth);
  if (!entries) {
    entries = new Map();
    pending.set(auth, entries);
  }
  const existing = entries.get(callbackKey);
  if (existing)
    return existing.then(async (result) => {
      const identity = await auth.getUser();
      if (
        identity.error ||
        !verifiedAccount(identity.data.user) ||
        identity.data.user?.id !== result.userId
      )
        throw new Error(
          "Bu bağlantının oturumu sona erdi. Güvenli giriş için giriş ekranına dön.",
        );
      return result;
    });
  const task = verify(value, auth).catch((error: unknown) => {
    entries.delete(callbackKey); // network failures can be retried; codes are never persisted
    throw error;
  });
  entries.set(callbackKey, task);
  // Bounded in-memory duplicate delivery protection, never a credential log/cache on disk.
  if (entries.size > 16) entries.delete(entries.keys().next().value!);
  return task;
}
/** No provider descriptions, codes, JWTs or URLs become UI copy. */
async function verify(value: string, auth: LinkAuth) {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Bağlantı geçersiz. E-postandaki bağlantıyı yeniden aç.");
  }
  const query = parsed.searchParams;
  const fragment = new URLSearchParams(parsed.hash.slice(1));
  if (query.has("error") || fragment.has("error"))
    throw new Error(
      authMessage(
        query.get("error_code") ?? fragment.get("error_code") ?? "otp_expired",
      ),
    );
  for (const [params, keys] of [
    [query, ["code", "token_hash", "type", "purpose"]],
    [fragment, ["access_token", "refresh_token", "type"]],
  ] as const)
    if (keys.some((key) => params.getAll(key).length > 1))
      throw new Error("Doğrulama bağlantısı geçersiz. Yeni bir bağlantı iste.");
  const code = query.get("code"),
    tokenHash = query.get("token_hash");
  const access_token = fragment.get("access_token"),
    refresh_token = fragment.get("refresh_token");
  const kind = fragment.get("type") ?? query.get("type");
  let recovery = kind === "recovery" || query.get("purpose") === "recovery";
  const methods =
    Number(!!code) +
    Number(!!tokenHash) +
    Number(!!(access_token || refresh_token));
  if (methods > 1 || !!access_token !== !!refresh_token)
    throw new Error("Doğrulama bağlantısı geçersiz. Yeni bir bağlantı iste.");
  if (!methods) throw new MissingAuthCredentials();
  if (tokenHash && !["email", "signup", "recovery"].includes(kind ?? ""))
    throw new Error(
      "Bu doğrulama bağlantısı desteklenmiyor. Yeni bir bağlantı iste.",
    );
  let response: Response;
  try {
    response = code
      ? await auth.exchangeCodeForSession(code)
      : tokenHash
        ? await auth.verifyOtp({
            token_hash: tokenHash,
            type: recovery ? "recovery" : "email",
          })
        : await auth.setSession({
            access_token: access_token!,
            refresh_token: refresh_token!,
          });
  } catch {
    throw new Error(authFailureMessage({ status: 0 }));
  }
  if (response.error) throw new Error(authFailureMessage(response.error));
  recovery ||= response.data?.redirectType === "recovery";
  let identity;
  try {
    identity = await auth.getUser();
  } catch {
    throw new Error(authFailureMessage({ status: 0 }));
  }
  if (identity.error) throw new Error(authFailureMessage(identity.error));
  if (!verifiedAccount(identity.data.user) || !identity.data.user?.id) {
    await auth.signOut({ scope: "local" }).catch(() => undefined);
    throw new Error(
      "E-posta doğrulaması tamamlanamadı. Yeni bir doğrulama bağlantısı iste.",
    );
  }
  return { recovery, userId: identity.data.user!.id };
}
