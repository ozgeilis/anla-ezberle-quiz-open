import type { PushPermission } from "./model";
export const nativePushSupported = false;
export async function permission(): Promise<PushPermission> {
  return "unsupported";
}
export const askPermission = permission;
export async function installationId(): Promise<string> {
  throw Error("Web cihaz tokenı desteklenmiyor.");
}
export async function deviceRegistration(): Promise<{
  deviceId: string;
  token: string;
  platform: string;
}> {
  throw Error("Telefon push bildirimi yalnız native uygulamada desteklenir.");
}
export async function startPushListeners(
  _tap: (data: unknown, id: string) => void,
  _rotate: () => void,
) {
  return () => {};
}
