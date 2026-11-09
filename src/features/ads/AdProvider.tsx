import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import { usePathname } from "expo-router";
import { useGame } from "../../storage/GameProvider";
import { useSound } from "../audio/SoundProvider";
import { adConfig } from "./adConfig";
import { canOfferInterstitial, type AdPreferences } from "./adPolicy";
import { loadAdsRuntime } from "./runtime";
import type { AdsRuntime, FullscreenAd } from "./runtime.types";
import { useAdPreferences } from "./useAdPreferences";
import { consentBlockMessage } from "./consentFlow";

interface AdContextValue {
  enabled: boolean;
  ready: boolean;
  busy: boolean;
  error: string;
  preferences: AdPreferences;
  privacyOptionsRequired: boolean;
  bannerRuntime: AdsRuntime | null;
  prepareConsent(): Promise<void>;
  openPrivacyOptions(): Promise<void>;
  transition(resultId: string, navigate: () => void): void;
}
const Context = createContext<AdContextValue | null>(null);
export function AdProvider({ children }: React.PropsWithChildren) {
  const path = usePathname();
  const { session, data, result } = useGame();
  const { setInterrupted } = useSound();
  const { preferences, loaded, storageError, persist, getPreferences } =
    useAdPreferences(adConfig.enabled, adConfig.preferencesKey);
  const [ready, setReady] = useState(false);
  const [foreground, setForeground] = useState(
    AppState.currentState === "active",
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [privacyOptionsRequired, setPrivacyRequired] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const [readyRuntime, setReadyRuntime] = useState<AdsRuntime | null>(null);
  const runtime = useRef<AdsRuntime | null>(null),
    full = useRef<FullscreenAd | null>(null);
  const lock = useRef(false),
    navigationLock = useRef(false),
    generation = useRef({ value: 0 });
  const alive = useRef(true);
  const current = useRef({ path, session, result, foreground });
  useLayoutEffect(() => {
    current.current = { path, session, result, foreground };
  }, [path, session, result, foreground]);
  const cooldownStart = useRef<number | null>(null);
  useEffect(() => {
    // A restart with an existing attempt gets a fresh conservative cooldown;
    // advancing the wall clock cannot shorten the in-process five minutes.
    if (preferences.lastPresentedAt > 0 && cooldownStart.current === null)
      cooldownStart.current = performance.now();
  }, [preferences.lastPresentedAt]);

  useEffect(() => {
    alive.current = true;
    const lifecycleGeneration = generation.current;
    const subscription = AppState.addEventListener("change", (state) => {
      setForeground(state === "active");
      if (adConfig.requiresTrackingAuthorization && state === "background") {
        invalidate();
        refreshed.current = false;
      }
    });
    return () => {
      alive.current = false;
      lifecycleGeneration.value++;
      subscription.remove();
      full.current?.dispose();
      setInterrupted(false);
    };
  }, [setInterrupted]);
  useEffect(() => {
    navigationLock.current = false;
  }, [path]);

  function invalidate() {
    generation.current.value++;
    setReady(false);
    setAdReady(false);
    full.current?.dispose();
    full.current = null;
  }
  async function consent(interactive: boolean, privacy = false) {
    const blocked = consentBlockMessage(
      {
        enabled: adConfig.enabled,
        loaded,
        busy: lock.current,
        playing: !!current.current.session,
        foreground: current.current.foreground,
        path: current.current.path,
      },
      interactive,
    );
    if (blocked) {
      if (interactive) setError(blocked);
      return;
    }
    lock.current = true;
    setBusy(true);
    invalidate();
    const revision = generation.current.value;
    const source = current.current.path;
    setInterrupted(true);
    try {
      runtime.current ??= await loadAdsRuntime();
      const decision = privacy
        ? await runtime.current.privacyOptions()
        : await runtime.current.consent(interactive);
      if (!alive.current) return;
      if (revision !== generation.current.value) {
        if (interactive)
          setError(
            "Uygulama arka plana geçtiği için izin kontrolü tamamlanmadı. Yeniden dene.",
          );
        return;
      }
      setPrivacyRequired(decision.privacyOptionsRequired);
      if (!decision.allowed) {
        setError(
          "Tercihlerine göre reklamlar kapalı; oyuna reklamsız devam edebilirsin.",
        );
        return;
      }
      // Do not start requests if a user left consent to start a game meanwhile.
      if (
        current.current.session ||
        current.current.path !== source ||
        !current.current.foreground
      )
        return;
      await runtime.current.initialize();
      if (!alive.current || revision !== generation.current.value) return;
      full.current = runtime.current.interstitial(setAdReady);
      setReadyRuntime(runtime.current);
      setReady(true);
      setError(
        privacy && "formPresented" in decision && !decision.formPresented
          ? "Google bu cihaz için yeniden açılabilir bir izin formu sunmuyor. Bu işlem izin tercihlerini değiştirmedi."
          : "",
      );
    } catch {
      if (alive.current)
        setError(
          "Reklam izin hizmeti hazırlanamadı. Oyun reklamsız çalışmaya devam ediyor.",
        );
    } finally {
      setInterrupted(false);
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  // Every user reaches the required UMP → ATT flow on Home on first launch,
  // without an age or advertising opt-in gate. Age is unknown, so requests
  // stay non-personalized with a G rating. Never prompt over a running game.
  const refreshed = useRef(false);
  useEffect(() => {
    if (
      !refreshed.current &&
      adConfig.enabled &&
      loaded &&
      path === "/" &&
      foreground &&
      !busy &&
      !session
    ) {
      refreshed.current = true;
      void Promise.resolve().then(() => consent(true));
    }
  });
  useEffect(() => {
    if (ready && foreground && !session && ["/", "/results"].includes(path))
      full.current?.load();
  }, [ready, foreground, session, path]);

  function finishTransition(action: { id: string; navigate: () => void }) {
    if (
      alive.current &&
      current.current.path === "/results" &&
      current.current.result?.id === action.id
    )
      action.navigate();
  }
  // Leaving a saved result is the natural break: when every privacy, cadence
  // and gameplay guard passes, the interstitial is shown without an extra
  // question. Otherwise navigation continues immediately without an ad.
  function transition(id: string, navigate: () => void) {
    if (navigationLock.current) return;
    navigationLock.current = true;
    const action = { id, navigate };
    if (
      lock.current ||
      !canOfferInterstitial({
        resultId: id,
        completedRounds: data.games.length,
        saved: data.games.some((g) => g.id === id),
        ready: ready && adReady,
        foreground,
        path,
        playing: !!session,
        busy,
        preferences,
        now: Date.now(),
        monotonicElapsedMs:
          cooldownStart.current === null
            ? Infinity
            : performance.now() - cooldownStart.current,
      })
    )
      return finishTransition(action);
    void present(action);
  }
  async function present(action: { id: string; navigate: () => void }) {
    lock.current = true;
    setBusy(true);
    const next = {
      ...getPreferences(),
      consumedResults: [...getPreferences().consumedResults, action.id].slice(
        -100,
      ),
      lastPresentedAt: Date.now(),
    };
    try {
      await persist(next);
      if (
        alive.current &&
        current.current.foreground &&
        current.current.path === "/results" &&
        !current.current.session
      ) {
        cooldownStart.current = performance.now();
        setInterrupted(true);
        await full.current?.show();
      }
    } catch {
      /* Storage/presentation failure never blocks leaving the result. */
    } finally {
      setInterrupted(false);
      lock.current = false;
      if (alive.current) {
        setBusy(false);
        finishTransition(action);
      }
    }
  }
  return (
    <Context.Provider
      value={{
        enabled: adConfig.enabled,
        ready,
        busy,
        error: error || storageError,
        preferences,
        privacyOptionsRequired,
        bannerRuntime:
          ready && foreground && !session && !busy && path === "/"
            ? readyRuntime
            : null,
        prepareConsent: () => consent(true),
        openPrivacyOptions: () => consent(true, true),
        transition,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useAds() {
  const value = useContext(Context);
  if (!value) throw Error("Reklam sağlayıcısı bulunamadı");
  return value;
}
