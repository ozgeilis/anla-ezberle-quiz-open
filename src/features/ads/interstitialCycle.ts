import type { InterstitialPort } from "./interstitial";
import type { FullscreenAd } from "./runtime.types";

export const INTERSTITIAL_LOAD_TIMEOUT_MS = 30_000;
export const INTERSTITIAL_OPEN_TIMEOUT_MS = 10_000;

// iOS: each attempt owns a fresh SDK object. A dismissed creative is never
// reused, and late events from retired objects cannot change the next attempt.
export function createInterstitialCycle(
  createPort: () => InterstitialPort,
  onReady: (ready: boolean) => void,
  canLoad: () => boolean,
): FullscreenAd {
  let port: InterstitialPort | null = null;
  let subscriptions: (() => void)[] = [];
  let ready = false,
    loading = false,
    showing = false,
    opened = false,
    disposed = false;
  let complete: ((shown: boolean) => void) | null = null;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  function clearDeadline() {
    clearTimeout(deadline);
    deadline = undefined;
  }
  function retire(shown: boolean, preload = false) {
    clearDeadline();
    const previous = port,
      done = complete;
    port = null;
    complete = null;
    ready = loading = showing = opened = false;
    subscriptions.forEach((unsubscribe) => unsubscribe());
    subscriptions = [];
    try {
      previous?.destroy();
    } catch {
      // Cleanup failure must never hold result navigation or reuse this object.
    }
    if (!disposed) onReady(false);
    done?.(shown);
    // Let the native dismiss callback unwind before requesting the next ad.
    // The provider rechecks consent generation, foreground, route and quiz.
    if (preload && !disposed) queueMicrotask(load);
  }
  function load() {
    if (disposed || showing || ready || loading || !canLoad()) return;
    loading = true;
    try {
      const next = createPort();
      port = next;
      const listen = (
        event: Parameters<InterstitialPort["listen"]>[0],
        fn: () => void,
      ) => {
        subscriptions.push(
          next.listen(event, () => {
            if (!disposed && port === next) fn();
          }),
        );
      };
      listen("loaded", () => {
        if (!loading || showing) return;
        clearDeadline();
        loading = false;
        ready = true;
        onReady(true);
      });
      listen("opened", () => {
        if (!showing) return;
        clearDeadline();
        opened = true;
      });
      listen("closed", () => retire(opened, true));
      // A failed preload waits for the next safe route/foreground load call;
      // no-fill/offline must not start an unbounded immediate retry loop.
      listen("error", () => retire(false, showing));
      deadline = setTimeout(() => retire(false), INTERSTITIAL_LOAD_TIMEOUT_MS);
      next.load();
    } catch {
      retire(false);
    }
  }
  return {
    load,
    show() {
      if (disposed || !ready || showing || !port || !canLoad())
        return Promise.resolve(false);
      const current = port;
      ready = false;
      showing = true;
      onReady(false);
      return new Promise<boolean>((resolve) => {
        complete = resolve;
        // Only bound a presentation that never opens. Once OPENED arrives,
        // navigation waits for CLOSE/ERROR, not an arbitrary video timeout.
        deadline = setTimeout(
          () => retire(false),
          INTERSTITIAL_OPEN_TIMEOUT_MS,
        );
        try {
          void current.show().catch(() => {
            if (port === current) retire(false, true);
          });
        } catch {
          retire(false, true);
        }
      });
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      retire(false);
    },
  };
}
