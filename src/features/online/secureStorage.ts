import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { randomUUID } from "expo-crypto";

type Manifest = { version: string; count: number };
const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};
function manifest(raw: string | null): Manifest | null {
  if (!raw) return null;
  const value: unknown = JSON.parse(raw);
  if (
    !value ||
    typeof value !== "object" ||
    !("version" in value) ||
    !("count" in value) ||
    typeof value.version !== "string" ||
    !/^[a-f0-9-]{36}$/.test(value.version) ||
    typeof value.count !== "number" ||
    !Number.isInteger(value.count) ||
    value.count < 1 ||
    value.count > 128
  )
    throw new Error("Oturum kaydı okunamadı.");
  return value as Manifest;
}
const pointer = (key: string) => `${key}.manifest`;
const chunk = (key: string, m: Manifest, index: number) =>
  `${key}.${m.version}.${index}`;
async function clean(key: string, m: Manifest | null) {
  if (m)
    await Promise.all(
      Array.from({ length: m.count }, (_, i) =>
        SecureStore.deleteItemAsync(chunk(key, m, i), options),
      ),
    );
}
// Small encrypted keychain/keystore items also handle JWT sessions larger than
// platform item limits. Publish the manifest only after every chunk is written.
export const authStorage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web")
      return typeof window === "undefined"
        ? null
        : window.sessionStorage.getItem(key);
    const m = manifest(await SecureStore.getItemAsync(pointer(key), options));
    if (!m) return null;
    const parts = await Promise.all(
      Array.from({ length: m.count }, (_, i) =>
        SecureStore.getItemAsync(chunk(key, m, i), options),
      ),
    );
    if (parts.some((p) => p === null))
      throw new Error("Oturum kaydı eksik; yeniden giriş gerekli.");
    return parts.join("");
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      window.sessionStorage.setItem(key, value);
      return;
    }
    const previous = manifest(
      await SecureStore.getItemAsync(pointer(key), options),
    );
    const m = { version: randomUUID(), count: Math.ceil(value.length / 400) };
    if (m.count < 1 || m.count > 128)
      throw new Error("Oturum güvenli depolama sınırını aştı.");
    try {
      for (let i = 0; i < m.count; i++)
        await SecureStore.setItemAsync(
          chunk(key, m, i),
          value.slice(i * 400, (i + 1) * 400),
          options,
        );
      await SecureStore.setItemAsync(pointer(key), JSON.stringify(m), options);
    } catch (error) {
      await clean(key, m).catch(() => {});
      throw error;
    }
    // A cleanup failure does not invalidate the newly committed secure session.
    await clean(key, previous).catch(() => {});
  },
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      window.sessionStorage.removeItem(key);
      return;
    }
    const m = manifest(await SecureStore.getItemAsync(pointer(key), options));
    await SecureStore.deleteItemAsync(pointer(key), options);
    await clean(key, m);
  },
};
