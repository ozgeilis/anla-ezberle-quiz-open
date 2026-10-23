import { authFailureMessage, authMessage, verifiedAccount } from "./account";
type AuthError = { code?: string; status?: number };
export interface LinkAuth {
  exchangeCodeForSession: (
    code: string,
  ) => Promise<{ error: AuthError | null }>;
  setSession: (tokens: {
    access_token: string;
    refresh_token: string;
  }) => Promise<{ error: AuthError | null }>;
  getUser: () => Promise<{
    data: {
      user: { email_confirmed_at?: string; is_anonymous?: boolean } | null;
    };
    error: AuthError | null;
  }>;
  signOut: (options: { scope: "local" }) => Promise<unknown>;
}
/** No provider error descriptions, codes, JWTs or URLs become UI copy. */
export async function verifyEmailLink(value: string, auth: LinkAuth) {
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Bağlantı geçersiz. E-postandaki bağlantıyı yeniden aç.");
  }
  const fragment = new URLSearchParams(parsed.hash.slice(1));
  if (parsed.searchParams.has("error") || fragment.has("error"))
    throw new Error(
      authMessage(
        parsed.searchParams.get("error_code") ??
          fragment.get("error_code") ??
          "otp_expired",
      ),
    );
  const code = parsed.searchParams.get("code"),
    access_token = fragment.get("access_token"),
    refresh_token = fragment.get("refresh_token");
  if (!code && !(access_token && refresh_token))
    throw new Error(
      "Doğrulama bilgisi bulunamadı. E-postandaki bağlantıyı yeniden aç.",
    );
  let response: { error: AuthError | null };
  try {
    response = code
      ? await auth.exchangeCodeForSession(code)
      : await auth.setSession({
          access_token: access_token!,
          refresh_token: refresh_token!,
        });
  } catch {
    throw new Error(authFailureMessage({ status: 0 }));
  }
  if (response.error) throw new Error(authFailureMessage(response.error));
  let identity;
  try {
    identity = await auth.getUser();
  } catch {
    throw new Error(authFailureMessage({ status: 0 }));
  }
  if (identity.error || !verifiedAccount(identity.data.user)) {
    await auth.signOut({ scope: "local" }).catch(() => undefined);
    if (identity.error) throw new Error(authFailureMessage(identity.error));
    throw new Error(
      "E-posta doğrulaması tamamlanamadı. Yeni bir doğrulama bağlantısı iste.",
    );
  }
  return {
    recovery:
      (fragment.get("type") ?? parsed.searchParams.get("type")) === "recovery",
  };
}
