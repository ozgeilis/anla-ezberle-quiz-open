export interface SoundPreferences {
  version: 2;
  effectsEnabled: boolean;
  effectsVolume: number;
}
// Keep the storage key so v1 users retain their effect/mute choices.
export const SOUND_STORAGE_KEY = "@anla-ezberle-quiz/preferences/audio/v1";
export const defaultSoundPreferences: SoundPreferences = {
  version: 2,
  effectsEnabled: true,
  effectsVolume: 0.5,
};
export function parseSoundPreferences(raw: string | null): SoundPreferences {
  if (raw === null) return { ...defaultSoundPreferences };
  const v: unknown = JSON.parse(raw);
  if (!v || typeof v !== "object" || Array.isArray(v))
    throw Error("Invalid audio preferences");
  const p = v as Record<string, unknown>;
  if (
    (p.version !== 1 && p.version !== 2) ||
    typeof p.effectsEnabled !== "boolean" ||
    typeof p.effectsVolume !== "number" ||
    !Number.isFinite(p.effectsVolume) ||
    p.effectsVolume < 0 ||
    p.effectsVolume > 1
  )
    throw Error("Invalid audio preferences");
  return {
    version: 2,
    effectsEnabled: p.effectsEnabled,
    effectsVolume: p.effectsVolume,
  };
}
