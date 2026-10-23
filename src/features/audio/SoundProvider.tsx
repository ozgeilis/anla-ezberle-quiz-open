import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, Platform } from "react-native";
import { usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SoundController } from "./controller";
import { createSoundDriver } from "./driver";
import {
  defaultSoundPreferences,
  parseSoundPreferences,
  SOUND_STORAGE_KEY,
  type SoundPreferences,
} from "./preferences";
import type { SoundEffect } from "./catalog";
interface Value {
  preferences: SoundPreferences;
  ready: boolean;
  saving: boolean;
  error: string;
  play: (name: SoundEffect, id?: string) => boolean;
  activate: () => void;
  save: (
    change: Partial<Omit<SoundPreferences, "version">>,
  ) => Promise<boolean>;
  retry: () => Promise<void>;
}
const Context = createContext<Value | null>(null);
// Shared UI can also render in isolated stories without an audio root.
const silent: Value = {
  preferences: defaultSoundPreferences,
  ready: false,
  saving: false,
  error: "",
  play: () => false,
  activate: () => {},
  save: async () => false,
  retry: async () => {},
};
export function SoundProvider({ children }: React.PropsWithChildren) {
  const path = usePathname();
  const engine = useRef<SoundController | null>(null),
    prefs = useRef<SoundPreferences | null>(null),
    mounted = useRef(false),
    lock = useRef(false);
  const [preferences, setPreferences] = useState({
      ...defaultSoundPreferences,
    }),
    [ready, setReady] = useState(false),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [audioError, setAudioError] = useState("");
  const retry = useCallback(async () => {
    if (lock.current) return;
    lock.current = true;
    try {
      const next = parseSoundPreferences(
        await AsyncStorage.getItem(SOUND_STORAGE_KEY),
      );
      if (!mounted.current) return;
      prefs.current = next;
      engine.current?.configure(next);
      setPreferences(next);
      setReady(true);
      setError("");
    } catch {
      if (mounted.current) {
        prefs.current = null;
        engine.current?.suspendPreferences();
        setReady(false);
        setError(
          "Ses tercihleri okunamadı. Önceki kayıt korunuyor; sesler kapalı. Yeniden deneyebilirsin.",
        );
      }
    } finally {
      lock.current = false;
    }
  }, []);
  useEffect(() => {
    mounted.current = true;
    const sound = new SoundController(
      createSoundDriver(),
      Platform.OS === "web",
    );
    engine.current = sound;
    if (prefs.current) sound.configure(prefs.current);
    const active = () =>
      AppState.currentState === "active" &&
      (Platform.OS !== "web" || document.visibilityState !== "hidden");
    sound.setActive(active());
    void sound.prepare().catch(() => {
      if (mounted.current && engine.current === sound)
        setAudioError(
          "Bu ortamda sesler yüklenemedi. Oyununu sessiz olarak sürdürebilirsin.",
        );
    });
    const listener = AppState.addEventListener("change", () =>
      sound.setActive(active()),
    );
    const visibility = () => sound.setActive(active());
    const gesture = (event: Event) => {
      if (event.isTrusted) sound.activate();
    };
    if (Platform.OS === "web") {
      document.addEventListener("visibilitychange", visibility);
      document.addEventListener("pointerdown", gesture, true);
      document.addEventListener("keydown", gesture, true);
    }
    void Promise.resolve().then(retry);
    return () => {
      mounted.current = false;
      listener.remove();
      if (Platform.OS === "web") {
        document.removeEventListener("visibilitychange", visibility);
        document.removeEventListener("pointerdown", gesture, true);
        document.removeEventListener("keydown", gesture, true);
      }
      sound.dispose();
      if (engine.current === sound) engine.current = null;
    };
  }, [retry]);
  useEffect(() => {
    engine.current?.setRoute(path);
  }, [path]);
  const activate = useCallback(() => engine.current?.activate(), []);
  const play = useCallback(
    (name: SoundEffect, id?: string) => engine.current?.play(name, id) ?? false,
    [],
  );
  const save = useCallback(
    async (change: Partial<Omit<SoundPreferences, "version">>) => {
      if (!prefs.current || lock.current) return false;
      lock.current = true;
      setSaving(true);
      try {
        const next = parseSoundPreferences(
          JSON.stringify({ ...prefs.current, ...change, version: 1 }),
        );
        await AsyncStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(next));
        if (!mounted.current) return false;
        prefs.current = next;
        engine.current?.configure(next);
        setPreferences(next);
        setError("");
        return true;
      } catch {
        if (mounted.current)
          setError(
            "Ses ayarları kaydedilemedi. Önceki ayarların korundu; yeniden deneyebilirsin.",
          );
        return false;
      } finally {
        lock.current = false;
        if (mounted.current) setSaving(false);
      }
    },
    [],
  );
  const value = useMemo(
    () => ({
      preferences,
      ready,
      saving,
      error: error || audioError,
      play,
      activate,
      save,
      retry,
    }),
    [
      preferences,
      ready,
      saving,
      error,
      audioError,
      play,
      activate,
      save,
      retry,
    ],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useSound = () => useContext(Context) ?? silent;
