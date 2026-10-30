import "react-native-url-polyfill/auto";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import { randomUUID } from "expo-crypto";
import { authStorage } from "./secureStorage";
import { OnlineOperation } from "./types";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const onlineConfigured =
  /^(https:\/\/[a-z0-9-]+\.supabase\.co|http:\/\/(127\.0\.0\.1|localhost):\d+)\/?$/.test(
    url,
  ) && /^sb_publishable_[A-Za-z0-9_-]+$/.test(key);
// OAuth uses a request-scoped PKCE transport; only onlineClient owns the app session.
export function createGooglePkceClient(
  storage: typeof authStorage,
  storageKey: string,
) {
  if (!onlineConfigured) return null;
  return createClient(url, key, {
    auth: {
      storage,
      storageKey,
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: "pkce",
    },
  });
}
let singleton: SupabaseClient | null = null;
function sessionKey() {
  const base = `anla-quiz-online-auth-v1.${new URL(url).host.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  if (Platform.OS !== "web") return base;
  // auth-js names its BroadcastChannel after storageKey. Separate web tabs
  // need distinct keys as well as sessionStorage to keep A/B identities apart.
  const tabKey = `${base}.tab-id`;
  try {
    let tabId = window.sessionStorage.getItem(tabKey);
    if (!tabId) {
      tabId = randomUUID();
      window.sessionStorage.setItem(tabKey, tabId);
    }
    return `${base}.${tabId}`;
  } catch {
    // Auth storage reports the unavailable browser storage through its async
    // API. Keep client construction from crashing the offline application.
    return `${base}.${randomUUID()}`;
  }
}
export function onlineClient() {
  if (!onlineConfigured) return null;
  return (singleton ??= createClient(url, key, {
    auth: {
      storage: authStorage,
      storageKey: sessionKey(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }));
}
export class OnlineError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: number,
  ) {
    super(code);
  }
}
export async function onlineRequest<T>(
  operation: OnlineOperation,
  body: object = {},
  expectedActor?: string,
): Promise<T> {
  const client = onlineClient();
  if (!client) throw new OnlineError("NOT_CONFIGURED", 503);
  const {
    data: { session },
    error,
  } = await client.auth.getSession();
  if (error || !session || (expectedActor && session.user.id !== expectedActor))
    throw new OnlineError("SESSION_EXPIRED", 401);
  let response: Response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    response = await fetch(
      `${url.replace(/\/$/, "")}/functions/v1/online-duel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: key,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ operation, body }),
        signal: controller.signal,
      },
    );
  } catch {
    throw new OnlineError("NETWORK", 0);
  } finally {
    clearTimeout(timeout);
  }
  const payload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const code =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      typeof payload.error === "string"
        ? payload.error
        : "SERVICE_UNAVAILABLE";
    throw new OnlineError(code, response.status);
  }
  if (!payload || typeof payload !== "object")
    throw new OnlineError("SERVICE_UNAVAILABLE", 503);
  return payload as T;
}
export function onlineMessage(error: unknown) {
  if (!(error instanceof OnlineError))
    return "İşlem tamamlanamadı. Bağlantını kontrol edip yeniden dene.";
  const messages: Record<string, string> = {
    LEADERBOARD_NOT_READY:
      "Çevrimiçi sıralama şu anda kullanılamıyor. Kişisel rekorların cihazında duruyor.",
    LIVE_NOT_READY:
      "Canlı odalar şu anda kullanılamıyor. Bireysel yarışmalarına devam edebilirsin.",
    INVALID_ROOM:
      "Oda kodu geçersiz veya odanın süresi dolmuş. Arkadaşından yeni kod iste.",
    ROOM_NOT_FOUND: "Bu odaya erişimin yok. Davet koduyla yeniden katıl.",
    ROOM_FULL: "Bu oda dolu. En fazla 8 oyuncu katılabilir.",
    HOST_ONLY: "Bu işlemi yalnızca oda sahibi yapabilir.",
    ROOM_NOT_READY: "En az iki oyuncu katılmalı ve herkes hazır olmalı.",
    ROOM_CLOSED: "Bu oda kapanmış veya yarışma başlamış. Güncel durumu yenile.",
    ANSWER_LATE:
      "Bu sorunun süresi doldu. Cevap kabul edilmedi; güncel soruyu yenile.",
    LIVE_POOL_INSUFFICIENT:
      "Bu kategori ve seviyede yeterli bağımsız soru yok. Başka bir birleşim seç.",
    INVALID_BADGE:
      "Yalnızca kazandığın en fazla üç rozeti vitrine ekleyebilirsin.",
    REGISTRATION_CLOSED: "Yeni hesapların çevrimiçi erişimi henüz açılmadı.",
    SELF_CHALLENGE: "Kendine meydan okuyamazsın.",
    CHALLENGE_EXISTS:
      "Bu oyuncuyla bekleyen bir düello davetin var. Davetler bölümünü kontrol et.",
    CHALLENGE_NOT_FOUND: "Düello daveti bulunamadı veya sana ait değil.",
    CHALLENGE_FORBIDDEN: "Bu daveti yalnız ilgili oyuncu yanıtlayabilir.",
    CHALLENGE_CLOSED: "Bu davet yanıtlanmış, iptal edilmiş veya süresi dolmuş.",
    NOTIFICATION_NOT_FOUND: "Bildirim artık bulunamıyor.",
    INVALID_USERNAME:
      "3–20 küçük harf, rakam veya alt çizgi kullan. Bu kullanıcı adına izin verilmiyor.",
    USERNAME_TAKEN: "Bu kullanıcı adı alınmış. Başka bir ad dene.",
    INVALID_SEARCH: "Aramak için en az 3 küçük harf, rakam veya alt çizgi yaz.",
    USERNAME_REQUIRED: "Önce profilinden bir kullanıcı adı oluştur.",
    SELF_FRIEND: "Kendine arkadaşlık isteği gönderemezsin.",
    FRIEND_EXISTS:
      "Bu oyuncuyla zaten arkadaşsınız veya bekleyen bir isteğiniz var.",
    PLAYER_NOT_FOUND: "Oyuncu bulunamadı veya bulunabilirliğini kapattı.",
    FRIEND_NOT_FOUND: "Arkadaşlık isteği artık bulunamıyor. Listeyi yenile.",
    FRIEND_FORBIDDEN: "Bu arkadaşlık işlemi için yetkin yok.",
    SIGN_IN_REQUIRED: "Kalıcı, doğrulanmış bir çevrimiçi hesapla giriş yap.",
    NETWORK:
      "Bağlantı kurulamadı. Sunucudan yenile; bekleyen yanıt varsa aynı istek kimliğiyle yeniden gönderilebilir.",
    SESSION_EXPIRED:
      "Çevrimiçi oturumun sona erdi. Yeniden giriş yap; yerel oyun kayıtların korunuyor.",
    NOT_CONFIGURED:
      "Çevrimiçi servis henüz yapılandırılmadı. Antrenman ve yerel demo kullanılabilir.",
    CLOSED_TEST_ONLY:
      "Bu hesabın çevrimiçi erişimi kapalı. Hesap desteğiyle iletişime geç.",
    EMAIL_NOT_VERIFIED:
      "E-posta doğrulaması tamamlanmadan çevrimiçi maç açılamaz.",
    WAIT_FOR_A:
      "Önce Oyuncu A turunu tamamlamalı. Daha sonra sunucudan yenile.",
    MATCH_NOT_FOUND: "Bu maça erişimin yok veya maç bulunamadı.",
    INVALID_INVITE: "Davet geçersiz. Davet sahibinden yeni bağlantı iste.",
    INVITE_CLOSED: "Davet kullanılmış, kapatılmış veya süresi dolmuş.",
    SELF_JOIN: "Kendi maçına rakip olarak katılamazsın.",
    MATCH_CLOSED:
      "Bu maç tamamlanmış, iptal edilmiş veya süresi dolmuş. Durumu yenile.",
    ANSWER_LOCKED: "Bu yanıt kilitli. Güncel durumu sunucudan yenile.",
    IDEMPOTENCY_CONFLICT:
      "Bu istek daha önce başka bir yanıtla kaydedilmiş. Sunucudan yenile.",
    RATE_LIMIT: "İşlem sınırına ulaştın. Bir süre bekleyip yeniden dene.",
    INVALID_NAME:
      "Profil adı 3–24 karakter olmalı; bağlantı veya kontrol karakteri içermemeli.",
    CANNOT_CANCEL:
      "Rakip başladığı için maç iptal edilemiyor. Sonra geri dönüp devam edebilirsin.",
    SERVICE_UNAVAILABLE:
      "Çevrimiçi servis hazır değil veya geçici olarak kullanılamıyor. Yerel oyun çalışmaya devam eder.",
    CONTENT_NOT_READY: "Sunucunun seçili test soru havuzu henüz hazır değil.",
  };
  return (
    messages[error.code] ??
    "Sunucu işlemi kabul etmedi. Durumu yenileyip yeniden dene."
  );
}
