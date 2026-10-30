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
import { AdTransitionDialog } from "./AdTransitionDialog";
import { useAdPreferences } from "./useAdPreferences";

interface AdContextValue {
  enabled: boolean;
  ready: boolean;
  busy: boolean;
  error: string;
  preferences: AdPreferences;
  privacyOptionsRequired: boolean;
  bannerRuntime: AdsRuntime | null;
  updatePreferences(
    change: Partial<Pick<AdPreferences, "adultConfirmed" | "testAdsAllowed">>,
  ): Promise<void>;
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
    useAdPreferences(adConfig.enabled);
  const [ready, setReady] = useState(false);
  const [foreground, setForeground] = useState(
    AppState.currentState === "active",
  );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [privacyOptionsRequired, setPrivacyRequired] = useState(false);
  const [adReady, setAdReady] = useState(false);
  const [pending, setPending] = useState<{
    id: string;
    navigate: () => void;
  } | null>(null);
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
  const eligibleUser =
    loaded && preferences.adultConfirmed && preferences.testAdsAllowed;
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
    const subscription = AppState.addEventListener("change", (state) =>
      setForeground(state === "active"),
    );
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
    void Promise.resolve().then(() => {
      if (alive.current) setPending(null);
    });
  }, [path]);

  function invalidate() {
    generation.current.value++;
    setReady(false);
    setAdReady(false);
    full.current?.dispose();
    full.current = null;
  }
  async function updatePreferences(
    change: Partial<Pick<AdPreferences, "adultConfirmed" | "testAdsAllowed">>,
  ) {
    if (lock.current || !loaded) return;
    lock.current = true;
    setBusy(true);
    invalidate();
    try {
      const next = { ...getPreferences(), ...change };
      if (!next.adultConfirmed) next.testAdsAllowed = false;
      await persist(next);
      setError("");
    } catch {
      setError("Tercih kaydedilemedi; reklamlar kapalı kaldı.");
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function consent(interactive: boolean, privacy = false) {
    if (
      !adConfig.enabled ||
      (!eligibleUser && !privacy) ||
      lock.current ||
      current.current.session ||
      !current.current.foreground ||
      (!interactive && current.current.path !== "/") ||
      (interactive && current.current.path !== "/settings/privacy")
    )
      return;
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
      if (!alive.current || revision !== generation.current.value) return;
      setPrivacyRequired(decision.privacyOptionsRequired);
      if (!getPreferences().adultConfirmed || !getPreferences().testAdsAllowed)
        return;
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
      setError("");
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
  // Refresh UMP every launch after the Studio intro, without opening a form.
  const refreshed = useRef(false);
  useEffect(() => {
    if (
      !refreshed.current &&
      adConfig.enabled &&
      eligibleUser &&
      path === "/" &&
      foreground &&
      !busy &&
      !session
    ) {
      refreshed.current = true;
      void Promise.resolve().then(() => consent(false));
    }
  });
  useEffect(() => {
    if (ready && foreground && !session && ["/", "/results"].includes(path))
      full.current?.load();
  }, [ready, foreground, session, path]);

  function finishTransition(action: { id: string; navigate: () => void }) {
    setPending(null);
    if (
      alive.current &&
      current.current.path === "/results" &&
      current.current.result?.id === action.id
    )
      action.navigate();
  }
  function transition(id: string, navigate: () => void) {
    if (navigationLock.current) return;
    navigationLock.current = true;
    if (
      canOfferInterstitial({
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
      setPending({ id, navigate });
    else finishTransition({ id, navigate });
  }
  async function leave(withAd: boolean) {
    const action = pending;
    if (!action || lock.current) return;
    lock.current = true;
    setBusy(true);
    setPending(null);
    const presenting =
      withAd &&
      ready &&
      adReady &&
      current.current.foreground &&
      !current.current.session &&
      current.current.path === "/results";
    const next = {
      ...getPreferences(),
      consumedResults: [...getPreferences().consumedResults, action.id].slice(
        -100,
      ),
      ...(presenting ? { lastPresentedAt: Date.now() } : {}),
    };
    try {
      await persist(next);
      if (
        presenting &&
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
        updatePreferences,
        prepareConsent: () => consent(true),
        openPrivacyOptions: () => consent(true, true),
        transition,
      }}
    >
      {children}
      <AdTransitionDialog
        visible={!!pending && foreground}
        busy={busy}
        onSkip={() => void leave(false)}
        onWatch={() => void leave(true)}
        onCancel={() => {
          setPending(null);
          navigationLock.current = false;
        }}
      />
    </Context.Provider>
  );
}
export function useAds() {
  const value = useContext(Context);
  if (!value) throw Error("Reklam sağlayıcısı bulunamadı");
  return value;
}
