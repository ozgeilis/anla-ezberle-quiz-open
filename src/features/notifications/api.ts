import AsyncStorage from "@react-native-async-storage/async-storage";
import { pushEnvelope } from "./model";
import { onlineClient } from "../online/client";
import { installationId, nativePushSupported } from "./device";
export class PushRequestError extends Error {
  constructor(public code: string) {
    super(
      "Bildirim ayarları sunucusuna ulaşılamıyor. Tercihlerin değiştirilmedi.",
    );
  }
}
export async function pushRequest<T>(
  actor: string,
  operation: string,
  body: object = {},
): Promise<T> {
  const client = onlineClient();
  if (!client) throw Error("Çevrimiçi servis yapılandırılmadı.");
  const {
    data: { session },
  } = await client.auth.getSession();
  if (!session || session.user.id !== actor)
    throw Error("Aktif hesabın değişti. Yeniden giriş yap.");
  // Bind this request to the captured actor's JWT, even if another account signs
  // in while the async request is running. Never print request headers/tokens.
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/rpc/push_settings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ operation, body }),
      signal: AbortSignal.timeout(15000),
    },
  );
  const value = await response.json();
  if (!response.ok)
    throw new PushRequestError(
      typeof value?.code === "string" ? value.code : "UNAVAILABLE",
    );
  return value as T;
}
/** Explicit logout waits for acknowledged revocation; session checks also guard dispatch. */
export async function revokePushBeforeSignOut(actor: string) {
  if (!nativePushSupported) return;
  try {
    await pushRequest(actor, "revoke", { deviceId: await installationId() });
  } catch (e) {
    // Old server versions have no registered devices. Preserve their existing logout.
    if (e instanceof PushRequestError && ["PGRST202", "42883"].includes(e.code))
      return;
    throw Error(
      "Bu cihazın bildirim kaydı kapatılamadı. Yeniden çıkış yapmayı dene.",
    );
  }
}

export async function clearPushNavigation(actor: string) {
  const raw = await AsyncStorage.getItem("@anla-quiz/push-pending");
  if (!raw) return;
  let envelope;
  try {
    envelope = pushEnvelope(JSON.parse(raw));
  } catch {
    envelope = null;
  }
  if (!envelope || envelope.recipientId === actor)
    await AsyncStorage.multiRemove([
      "@anla-quiz/push-pending",
      "@anla-quiz/push-last",
    ]);
}
