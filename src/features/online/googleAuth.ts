import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo";
import { randomUUID } from "expo-crypto";
import { authStorage } from "./secureStorage";
import { onlineClient, createGooglePkceClient } from "./client";
import { authRedirectUrl } from "./authLinks";
import { verifiedAccount } from "./account";
import {
  googleCallbackCode,
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
let completion: {
  nonce: string;
  value: string;
  expiresAt: number;
  promise: Promise<void>;
} | null = null;
export const googleNativeAvailable = () =>
  Platform.OS === "web" || !!requireOptionalNativeModule("ExpoWebBrowser");
export const clearGoogleAttempt = () => {
  attemptGeneration++;
  completion = null;
  return Promise.all([authStorage.removeItem(key), clearTransaction()]).then(
    () => undefined,
  );
};
export const hasGoogleAttempt = async () => !!(await pending());
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
  let nonce: string | null = null;
  try {
    nonce = new URL(value).searchParams.get("attempt");
  } catch {
    /* validated below */
  }
  if (
    completion?.nonce === nonce &&
    completion.value === value &&
    completion.expiresAt > Date.now()
  )
    return completion.promise;
  const generation = attemptGeneration;
  const attempt = await pending();
  // Native Linking and openAuthSessionAsync may deliver the same callback together.
  // Recheck after asynchronous storage before starting a second code exchange.
  if (completion?.value === value && completion.expiresAt > Date.now())
    return completion.promise;
  if (generation !== attemptGeneration)
    throw Error("Google girişi iptal edildi.");
  let code: string;
  try {
    code = googleCallbackCode(value, attempt);
  } catch (error) {
    await clearGoogleAttempt();
    throw error;
  }
  const client = onlineClient();
  if (!client) throw Error("Servis yapılandırılmadı.");
  let transferred = false;
  const promise = (async () => {
    const before = await client.auth.getSession();
    if (before.error || before.data.session)
      throw Error("Aktif hesap değişti. Google girişini yeniden başlat.");
    const oauth = transport();
    if (!oauth) throw Error("Servis yapılandırılmadı.");
    const { data, error } = await oauth.auth.exchangeCodeForSession(code);
    if (error || !data.session)
      throw Error("Google girişi doğrulanamadı. Yeniden dene.");
    const identity = await oauth.auth.getUser();
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
  })()
    .catch(async (error) => {
      if (!transferred)
        await transaction?.auth
          .signOut({ scope: "local" })
          .catch(() => undefined);
      throw error;
    })
    .finally(async () => {
      await authStorage.removeItem(key);
      await clearTransaction();
    });
  completion = {
    nonce: attempt!.nonce,
    value,
    expiresAt: attempt!.startedAt + 300_000,
    promise,
  };
  return promise;
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
    await clearGoogleAttempt();
    if (
      error instanceof Error &&
      error.message === "Google girişi iptal edildi."
    )
      throw error;
    throw Error(
      "Google girişi tamamlanamadı. Bağlantını kontrol edip yeniden dene.",
    );
  }
}
