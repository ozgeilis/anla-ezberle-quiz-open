import { Platform } from "react-native";
import Constants from "expo-constants";
import { requireOptionalNativeModule } from "expo";
import {
  randomUUID,
  digestStringAsync,
  CryptoDigestAlgorithm,
} from "expo-crypto";
import { onlineClient, createIdentityTokenClient } from "./client";
import { clearGoogleAttempt } from "./googleAuth";
import {
  appleIdentityToken,
  appleDisplayName,
  appleServerIdentity,
  AppleFlowError,
  AppleAttemptGuard,
} from "./appleFlow";
const attempts = new AppleAttemptGuard();
let running = false;
export function cancelAppleAttempt() {
  attempts.cancel();
}
export function observeAppleSignIn(actor: string) {
  attempts.observeSignIn(actor);
}
export async function appleNativeAvailable() {
  if (
    Platform.OS !== "ios" ||
    Constants.expoConfig?.extra?.appleAuthentication !== true ||
    !requireOptionalNativeModule("ExpoAppleAuthentication")
  )
    return false;
  try {
    return await (await import("expo-apple-authentication")).isAvailableAsync();
  } catch {
    return false;
  }
}
export async function startAppleAuth(enabled: boolean) {
  if (!enabled || !(await appleNativeAvailable()))
    throw new AppleFlowError(
      "Apple ile giriş henüz bu sürümde kullanılamıyor.",
    );
  if (running) throw new AppleFlowError("Apple girişi zaten sürüyor.");
  running = true;
  const attempt = attempts.start();
  const current = () => attempts.assertCurrent(attempt);
  const client = onlineClient();
  const transaction = createIdentityTokenClient();
  try {
    if (!client || !transaction)
      throw new AppleFlowError("Hesap servisi yapılandırılmadı.");
    const before = await client.auth.getSession();
    current();
    if (before.error || before.data.session)
      throw new AppleFlowError("Önce mevcut hesabından güvenli çıkış yap.");
    await clearGoogleAttempt();
    current();
    const Apple = await import("expo-apple-authentication");
    const nonce = randomUUID(),
      state = randomUUID();
    const hashedNonce = await digestStringAsync(
      CryptoDigestAlgorithm.SHA256,
      nonce,
    );
    current();
    const proof = await Apple.signInAsync({
      requestedScopes: [
        Apple.AppleAuthenticationScope.FULL_NAME,
        Apple.AppleAuthenticationScope.EMAIL,
      ],
      state,
      nonce: hashedNonce,
    });
    current();
    const token = appleIdentityToken(proof, state);
    // Supabase verifies issuer, audience, signature, expiry and SHA256(raw nonce).
    const exchange = await transaction.auth.signInWithIdToken({
      provider: "apple",
      token,
      nonce,
    });
    current();
    const session = exchange.data.session;
    if (exchange.error || !session)
      throw new AppleFlowError(
        "Apple girişi sunucuda tamamlanamadı. Kapalı test yetkini kontrol et.",
      );
    const identity = await transaction.auth.getUser(session.access_token);
    current();
    if (
      identity.error ||
      !appleServerIdentity(identity.data.user, session.user.id)
    )
      throw new AppleFlowError("Apple hesabı sunucuda doğrulanamadı.");
    const latest = await client.auth.getSession();
    current();
    if (latest.error || latest.data.session)
      throw new AppleFlowError("Aktif hesap değişti. Yeniden dene.");
    const name = appleDisplayName(proof);
    // Apple supplies the name only at first authorization. Never overwrite an existing name.
    if (name && !identity.data.user?.user_metadata.full_name) {
      await transaction.auth.updateUser({ data: { full_name: name } });
      current();
    }
    const beforeTransfer = await client.auth.getSession();
    current();
    if (beforeTransfer.error || beforeTransfer.data.session)
      throw new AppleFlowError("Aktif hesap değişti. Yeniden dene.");
    attempts.prepareTransfer(attempt, session.user.id);
    const saved = await client.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
    if (
      saved.error ||
      saved.data.user?.id !== session.user.id ||
      !attempts.isCurrent(attempt)
    ) {
      const latest = await client.auth.getSession();
      if (latest.data.session?.user.id === session.user.id)
        await client.auth.signOut({ scope: "local" });
      throw new AppleFlowError(
        "Apple oturumu güvenle kaydedilemedi. Yeniden dene.",
      );
    }
  } catch (error) {
    if (error instanceof AppleFlowError) throw error;
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ERR_REQUEST_CANCELED"
    )
      throw new AppleFlowError("Apple girişi iptal edildi.");
    throw new AppleFlowError(
      "Apple girişine ulaşılamadı. Bağlantını kontrol edip yeniden dene.",
    );
  } finally {
    // Request-scoped memory only: do not revoke the transferred app session.
    transaction?.auth.stopAutoRefresh();
    attempts.finish(attempt);
    running = false;
  }
}
