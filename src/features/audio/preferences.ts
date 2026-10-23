export interface SoundPreferences {
  version: 1;
  effectsEnabled: boolean;
  musicEnabled: boolean;
  effectsVolume: number;
  musicVolume: number;
}
export const SOUND_STORAGE_KEY = "@anla-ezberle-quiz/preferences/audio/v1";
export const defaultSoundPreferences: SoundPreferences = {
  version: 1,
  effectsEnabled: true,
  musicEnabled: false,
  effectsVolume: 0.5,
  musicVolume: 0.5,
};
export function parseSoundPreferences(raw: string | null): SoundPreferences {
  if (raw === null) return { ...defaultSoundPreferences };
  const v: unknown = JSON.parse(raw);
  if (!v || typeof v !== "object" || Array.isArray(v))
    throw Error("Invalid audio preferences");
  const p = v as Record<string, unknown>;
  if (
    p.version !== 1 ||
    typeof p.effectsEnabled !== "boolean" ||
    typeof p.musicEnabled !== "boolean" ||
    ![p.effectsVolume, p.musicVolume].every(
      (n) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1,
    )
  )
    throw Error("Invalid audio preferences");
  return {
    version: 1,
    effectsEnabled: p.effectsEnabled,
    musicEnabled: p.musicEnabled,
    effectsVolume: p.effectsVolume as number,
    musicVolume: p.musicVolume as number,
  };
}
export function menuMusicAllowed(path: string) {
  return [
    "/",
    "/categories",
    "/achievements",
    "/profile",
    "/ranking",
    "/settings",
    "/online/players",
    "/online/inbox",
  ].includes(path);
}
