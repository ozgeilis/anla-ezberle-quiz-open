import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AD_PREFERENCES_KEY,
  defaultAdPreferences,
  parseAdPreferences,
  type AdPreferences,
} from "./adPolicy";

export function useAdPreferences(
  enabled: boolean,
  storageKey = AD_PREFERENCES_KEY,
) {
  const [preferences, setPreferences] = useState(defaultAdPreferences);
  const [loaded, setLoaded] = useState(false),
    [storageError, setError] = useState("");
  const current = useRef(defaultAdPreferences),
    mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    if (enabled)
      void AsyncStorage.getItem(storageKey)
        .then((raw) => {
          const next = parseAdPreferences(raw);
          if (!mounted.current) return;
          current.current = next;
          setPreferences(next);
          setLoaded(true);
        })
        .catch(() => {
          if (mounted.current)
            setError("Reklam tercihleri okunamadı; reklamlar kapalı.");
        });
    return () => {
      mounted.current = false;
    };
  }, [enabled, storageKey]);
  const persist = useCallback(
    async (next: AdPreferences) => {
      await AsyncStorage.setItem(storageKey, JSON.stringify(next));
      if (mounted.current) {
        current.current = next;
        setPreferences(next);
      }
    },
    [storageKey],
  );
  const getPreferences = useCallback(() => current.current, []);
  return { preferences, loaded, storageError, persist, getPreferences };
}
