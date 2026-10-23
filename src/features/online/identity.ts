import type { SocialSelf } from "./types";
/** An account's display name is separate from its unique search handle. */
export function playerDisplayName(localName: string, self: SocialSelf | null) {
  return self?.profile.name?.trim() || localName.trim() || "Oyuncu";
}
export function displayNameError(value: string) {
  const name = value.trim().normalize("NFC");
  return Array.from(name).length < 3 ||
    Array.from(name).length > 24 ||
    /[\u0000-\u001f\u007f-\u009f<>]/.test(name) ||
    /https?:\/\/|www\./i.test(name)
    ? "Görünen ad 3–24 karakter olmalı; bağlantı veya kontrol karakteri içermemeli."
    : null;
}
export function socialProfileBody(
  self: SocialSelf,
  patch: Partial<
    Pick<SocialSelf["profile"], "username" | "avatar" | "discoverable">
  >,
) {
  return { ...self.profile, ...patch };
}
