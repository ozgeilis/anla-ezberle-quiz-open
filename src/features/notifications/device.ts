import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import {
  IosAuthorizationStatus,
  AndroidImportance,
  AndroidNotificationVisibility,
} from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { randomUUID } from "expo-crypto";
import type { PushPermission } from "./model";
export const nativePushSupported =
  Device.isDevice && Constants.executionEnvironment !== "storeClient";
export async function permission(): Promise<PushPermission> {
  if (!nativePushSupported) return "unsupported";
  const p = await Notifications.getPermissionsAsync();
  return p.granted || p.ios?.status === IosAuthorizationStatus.PROVISIONAL
    ? "granted"
    : p.status === "denied"
      ? "denied"
      : "undetermined";
}
export async function askPermission(): Promise<PushPermission> {
  if (!nativePushSupported) return "unsupported";
  if (Platform.OS === "android")
    await Notifications.setNotificationChannelAsync("game-updates", {
      name: "Arkadaşlar ve oyunlar",
      importance: AndroidImportance.DEFAULT,
      lockscreenVisibility: AndroidNotificationVisibility.PRIVATE,
    });
  await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });
  return permission();
}
const key = "anla-quiz-push-device-v1";
export async function installationId(): Promise<string> {
  const previous = await SecureStore.getItemAsync(key);
  if (previous) return previous;
  const id = randomUUID();
  await SecureStore.setItemAsync(key, id, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  });
  return id;
}
export async function deviceRegistration() {
  if (!nativePushSupported || (await permission()) !== "granted")
    throw Error("Bu cihazda bildirim izni yok.");
  const projectId =
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas?.projectId;
  if (typeof projectId !== "string")
    throw Error("EAS bildirim yapılandırması eksik.");
  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  return { deviceId: await installationId(), token, platform: Platform.OS };
}
export async function startPushListeners(
  tap: (data: unknown, id: string) => void,
  rotate: () => void,
) {
  if (!nativePushSupported) return () => {};
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: false,
    }),
  });
  const consume = (r: Notifications.NotificationResponse) => {
    if (r.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER)
      tap(
        r.notification.request.content.data,
        r.notification.request.identifier,
      );
  };
  const sub = Notifications.addNotificationResponseReceivedListener(consume);
  const token = Notifications.addPushTokenListener(rotate);
  try {
    const previous = await Notifications.getLastNotificationResponseAsync();
    if (previous) {
      consume(previous);
      await Notifications.clearLastNotificationResponseAsync();
    }
  } catch {
    sub.remove();
    token.remove();
    throw Error("Bildirim yanıtı okunamadı.");
  }
  return () => {
    sub.remove();
    token.remove();
  };
}
