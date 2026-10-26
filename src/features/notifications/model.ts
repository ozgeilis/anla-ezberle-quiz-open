export const pushKinds = ["friends", "invites", "results", "rooms"] as const;
export type PushKind = (typeof pushKinds)[number];
export interface PushPreferences {
  enabled: boolean;
  friends: boolean;
  invites: boolean;
  results: boolean;
  rooms: boolean;
}
export const defaultPushPreferences: PushPreferences = {
  enabled: false,
  friends: true,
  invites: true,
  results: true,
  rooms: true,
};
export type PushPermission =
  "granted" | "denied" | "undetermined" | "unsupported";
export interface PushSettingsSnapshot {
  available: boolean;
  preferences: PushPreferences;
}
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export interface PushEnvelope {
  version: 1;
  source: "inbox" | "room";
  notificationId: string;
  recipientId: string;
}
export function pushEnvelope(value: unknown): PushEnvelope | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (
    Object.keys(v).some(
      (k) =>
        !["version", "source", "notificationId", "recipientId"].includes(k),
    ) ||
    v.version !== 1 ||
    !["inbox", "room"].includes(v.source as string) ||
    typeof v.notificationId !== "string" ||
    typeof v.recipientId !== "string" ||
    !uuid.test(v.notificationId) ||
    !uuid.test(v.recipientId)
  )
    return null;
  return {
    version: 1,
    source: v.source as "inbox" | "room",
    notificationId: v.notificationId,
    recipientId: v.recipientId,
  };
}
export function effectivePush(
  p: PushPreferences,
  permission: PushPermission,
  available: boolean,
) {
  return available && p.enabled && permission === "granted";
}
export function patchPreferences(
  p: PushPreferences,
  patch: Partial<PushPreferences>,
): PushPreferences {
  if (
    Object.keys(patch).some(
      (k) =>
        !Object.hasOwn(defaultPushPreferences, k) ||
        typeof patch[k as keyof PushPreferences] !== "boolean",
    )
  )
    throw Error("Geçersiz bildirim tercihi");
  return { ...p, ...patch };
}
export function safePushTarget(
  v: unknown,
):
  | { pathname: "/online/notification/[id]"; params: { id: string } }
  | { pathname: "/online"; params: { match: string } }
  | { pathname: "/live"; params: { room: string } }
  | null {
  if (!v || typeof v !== "object") return null;
  const target = v as { kind?: unknown; id?: unknown };
  if (typeof target.id !== "string" || !uuid.test(target.id)) return null;
  switch (target.kind) {
    case "notification":
      return {
        pathname: "/online/notification/[id]",
        params: { id: target.id },
      };
    case "match":
      return { pathname: "/online", params: { match: target.id } };
    case "room":
      return { pathname: "/live", params: { room: target.id } };
    default:
      return null;
  }
}

export interface PushEnableDeps {
  permission: () => Promise<PushPermission>;
  registration: () => Promise<{
    deviceId: string;
    token: string;
    platform: string;
  }>;
  commit: (registration: {
    deviceId: string;
    token: string;
    platform: string;
  }) => Promise<PushSettingsSnapshot>;
  reportPermission: (value: PushPermission) => void;
}
export async function enableOnDevice(
  deps: PushEnableDeps,
): Promise<PushSettingsSnapshot> {
  const permission = await deps.permission();
  deps.reportPermission(permission);
  if (permission !== "granted")
    throw Error(
      "Bildirim izni verilmedi. Telefonun uygulama bildirim ayarlarından izin verebilirsin.",
    );
  return deps.commit(await deps.registration());
}
