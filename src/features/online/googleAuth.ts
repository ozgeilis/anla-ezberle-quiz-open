import { authCallbackKey } from "./authCallbackUrl";
import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo";
import { randomUUID } from "expo-crypto";
import { authStorage } from "./secureStorage";
import { onlineClient, createGooglePkceClient } from "./client";
import { authRedirectUrl } from "./authLinks";
import { verifiedAccount } from "./account";
import { createGoogleCallbackCompletion } from "./googleCompletion";
import {
  googleCallbackCode,
  GoogleFlowError,
  type GoogleAttempt,
  verifierStorage,
} from "./googleFlow";
const key = "anla-google-pkce-attempt-v1";
const transactionKey = "anla-google-pkce-transaction-v1";
const transactionStorage = verifierStorage(
  authStorage,
  transactionKey + "-code-verifier",
);
let transaction: ReturnType<typeof createGooglePkceClient> = null;
const transport = () =>
  (transaction ??= createGooglePkceClient(transactionStorage, transactionKey));
async function clearTransaction() {
  await transaction?.auth.stopAutoRefresh();
  transactionStorage.clearMemory();
  await transactionStorage.removeItem(transactionKey + "-code-verifier");
}
let attemptGeneration = 0;
const completion = createGoogleCallbackCompletion();
export const googleNativeAvailable = () =>
  Platform.OS === "web" || !!requireOptionalNativeModule("ExpoWebBrowser");
export const clearGoogleAttempt = () => {
  attemptGeneration++;
  completion.clear();
  return clearAttemptStorage();
};
function clearAttemptStorage() {
  return Promise.all([authStorage.removeItem(key), clearTransaction()]).then(
    () => undefined,
  );
}
async function pending(): Promise<GoogleAttempt | null> {
  const raw = await authStorage.getItem(key);
  if (!raw) return null;
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== "object") return null;
    const value = v as Record<string, unknown>;
    return typeof value.nonce === "string" &&
      typeof value.redirect === "string" &&
      typeof value.startedAt === "number"
      ? {
          nonce: value.nonce,
          redirect: value.redirect,
          startedAt: value.startedAt,
        }
      : null;
  } catch {
    return null;
  }
}
export async function completeGoogleAuth(value: string) {
  return completion.run(authCallbackKey(value), () =>
    transferGoogleSession(value),
  );
}
async function transferGoogleSession(value: string) {
  const generation = attemptGeneration;
  let transferred = false;
  try {
    const attempt = await pending();
    if (generation !== attemptGeneration)
      throw Error("Google girişi iptal edildi.");
    const code = googleCallbackCode(value, attempt);
    const client = onlineClient();
    if (!client) throw Error("Servis yapılandırılmadı.");
    const before = await client.auth.getSession();
    if (before.error || before.data.session)
      throw Error("Aktif hesap değişti. Google girişini yeniden başlat.");
    const oauth = transport();
    if (!oauth) throw Error("Servis yapılandırılmadı.");
    const { data, error } = await oauth.auth.exchangeCodeForSession(code);
    if (error || !data.session)
      throw Error("Google girişi doğrulanamadı. Yeniden dene.");
    const identity = await oauth.auth.getUser(data.session.access_token);
    if (
      identity.error ||
      !verifiedAccount(identity.data.user) ||
      !identity.data.user?.identities?.some((i) => i.provider === "google") ||
      identity.data.user?.id !== data.session.user.id
    ) {
      throw Error("Google hesabı sunucuda doğrulanamadı.");
    }
    const latest = await client.auth.getSession();
    if (latest.error || latest.data.session || generation !== attemptGeneration)
      throw Error("Aktif hesap değişti. Google girişini yeniden başlat.");
    // Transfer only a server-verified Google identity into the existing session owner.
    const saved = await client.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
    if (
      saved.error ||
      saved.data.user?.id !== identity.data.user!.id ||
      generation !== attemptGeneration
    ) {
      const current = await client.auth.getSession();
      if (current.data.session?.user.id === data.session.user.id)
        await client.auth.signOut({ scope: "local" });
      throw Error("Google oturumu kaydedilemedi.");
    }
    transferred = true;
  } catch (error) {
    if (!transferred && generation === attemptGeneration)
      await transaction?.auth
        .signOut({ scope: "local" })
        .catch(() => undefined);
    throw error;
  } finally {
    if (generation === attemptGeneration) await clearAttemptStorage();
  }
}
export async function startGoogleAuth(enabled: boolean) {
  if (!googleNativeAvailable())
    throw Error("Google girişi için güncel uygulama derlemesi gerekli.");
  if (!enabled) throw Error("Google ile giriş henüz kapalı teste açılmadı.");
  const client = onlineClient();
  if (!client) throw Error("Servis yapılandırılmadı.");
  const current = await client.auth.getSession();
  if (current.error || current.data.session)
    throw Error("Önce mevcut hesabından güvenli çıkış yap.");
  await clearGoogleAttempt();
  const generation = attemptGeneration;
  const redirect = new URL(authRedirectUrl());
  const nonce = randomUUID();
  redirect.searchParams.set("flow", "google");
  redirect.searchParams.set("attempt", nonce);
  await authStorage.setItem(
    key,
    JSON.stringify({
      nonce,
      redirect: redirect.toString(),
      startedAt: Date.now(),
    }),
  );
  try {
    const oauth = transport();
    if (!oauth) throw Error("Servis yapılandırılmadı.");
    const { data, error } = await oauth.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirect.toString(),
        skipBrowserRedirect: true,
        scopes: "openid email profile",
        queryParams: { prompt: "select_account" },
      },
    });
    if (error || !data.url)
      throw Error("Google bağlantısı başlatılamadı. Yeniden dene.");
    if (Platform.OS === "web") {
      window.location.assign(data.url);
      return;
    }
    const WebBrowser = await import("expo-web-browser");
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      authRedirectUrl(),
    );
    if (result.type !== "success") {
      await clearGoogleAttempt();
      throw Error("Google girişi iptal edildi.");
    }
    await completeGoogleAuth(result.url);
  } catch (error) {
    // Keep a failed callback outcome for the second native delivery. A fresh
    // sign-in, explicit cancel or sign-out clears the bounded completion cache.
    if (generation === attemptGeneration) await clearAttemptStorage();
    if (
      error instanceof Error &&
      (error instanceof GoogleFlowError ||
        error.message === "Google girişi iptal edildi." ||
        error.message.startsWith("Google girişi sunucuda") ||
        error.message.startsWith("Google girişi tamamlanmadı."))
    )
      throw error;
    throw Error(
      "Google girişi tamamlanamadı. Bağlantını kontrol edip yeniden dene.",
    );
  }
}
