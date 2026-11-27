import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AppState, Platform } from "react-native";
import { usePathname } from "expo-router";
import { useGame } from "../../storage/GameProvider";
import { useSound } from "../audio/SoundProvider";
import { adConfig } from "./adConfig";
import {
  createRoundEndAdBreak,
  isSavedCompletedRound,
} from "./roundCompletion";
import { canOfferInterstitial, type AdPreferences } from "./adPolicy";
import { loadAdsRuntime } from "./runtime";
import type { AdsRuntime, FullscreenAd } from "./runtime.types";
import { useAdPreferences } from "./useAdPreferences";
import { consentBlockMessage } from "./consentFlow";

interface AdContextValue {
  enabled: boolean;
  roundEndPlacement: boolean;
  ready: boolean;
  busy: boolean;
  error: string;
  preferences: AdPreferences;
  privacyOptionsRequired: boolean;
  bannerRuntime: AdsRuntime | null;
  prepareConsent(): Promise<void>;
  openPrivacyOptions(): Promise<void>;
  transition(resultId: string, navigate: () => void): void;
  completeRound(resultId: string): Promise<void>;
}
const Context = createContext<AdContextValue | null>(null);
export function AdProvider({ children }: React.PropsWithChildren) {
  const path = usePathname();
  const { session, data, result, getSnapshot } = useGame();
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
  const adReadyRef = useRef(false);
  const completedRound = useRef<string | null>(null);
  const roundEnd = useRef(createRoundEndAdBreak());
  const [readyRuntime, setReadyRuntime] = useState<AdsRuntime | null>(null);
  const runtime = useRef<AdsRuntime | null>(null),
    full = useRef<FullscreenAd | null>(null);
  const lock = useRef(false),
    navigationLock = useRef(false),
    generation = useRef({ value: 0 });
  const alive = useRef(true);
  const current = useRef({ path, session, result, foreground, ready, busy });
  useLayoutEffect(() => {
    current.current = { path, session, result, foreground, ready, busy };
  }, [path, session, result, foreground, ready, busy]);
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
    adReadyRef.current = false;
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
      full.current = runtime.current.interstitial(
        (value) => {
          adReadyRef.current = value;
          setAdReady(value);
        },
        () =>
          alive.current &&
          revision === generation.current.value &&
          current.current.foreground &&
          (Platform.OS !== "ios" || AppState.currentState === "active") &&
          !getSnapshot().session &&
          (["/", "/results"].includes(current.current.path) ||
            (adConfig.roundEndPlacement &&
              current.current.path === "/quiz" &&
              completedRound.current !== null &&
              isSavedCompletedRound(completedRound.current, getSnapshot()))),
      );
      // Do not rely on a React state/route change to start an iOS preload:
      // revalidation can finish with the same rendered ready/path values.
      if (adConfig.roundEndPlacement) full.current.load();
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

  function finishTransition(action: { id: string; navigate?: () => void }) {
    if (
      alive.current &&
      current.current.path === "/results" &&
      current.current.result?.id === action.id
    )
      action.navigate?.();
  }
  // Legacy Android profiles retain their result-exit placement and cadence.
  // iOS eligibility rejects this placement even if an old caller invokes it.
  function transition(id: string, navigate: () => void) {
    if (navigationLock.current) return;
    navigationLock.current = true;
    const action = { id, navigate };
    if (
      lock.current ||
      !canOfferInterstitial({
        platform: Platform.OS,
        roundEndPlacement: adConfig.roundEndPlacement,
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
  function completeRound(id: string) {
    return roundEnd.current(id, {
      read: () => ({
        platform: Platform.OS,
        roundEndPlacement: adConfig.roundEndPlacement,
        game: getSnapshot(),
        path: current.current.path,
        ready: current.current.ready && adReadyRef.current,
        foreground:
          current.current.foreground && AppState.currentState === "active",
        busy: lock.current || current.current.busy,
        preferences: getPreferences(),
      }),
      prepare: (completedId) => {
        completedRound.current = completedId;
      },
      present: (completedId) => present({ id: completedId }, "round-complete"),
    });
  }
  async function present(
    action: { id: string; navigate?: () => void },
    trigger: "results-exit" | "round-complete" = "results-exit",
  ) {
    const revision = generation.current.value;
    const ad = full.current;
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
        (trigger === "round-complete"
          ? current.current.path === "/quiz" &&
            AppState.currentState === "active" &&
            revision === generation.current.value &&
            ad === full.current &&
            isSavedCompletedRound(action.id, getSnapshot())
          : current.current.path === "/results" && !current.current.session)
      ) {
        cooldownStart.current = performance.now();
        setInterrupted(true);
        await ad?.show();
      }
    } catch {
      /* Storage/presentation failure never blocks leaving the result. */
    } finally {
      setInterrupted(false);
      lock.current = false;
      if (alive.current) {
        setBusy(false);
        if (trigger === "results-exit") finishTransition(action);
      }
    }
  }
  return (
    <Context.Provider
      value={{
        enabled: adConfig.enabled,
        roundEndPlacement: adConfig.roundEndPlacement,
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
        completeRound,
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
