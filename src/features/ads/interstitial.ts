import type { FullscreenAd } from "./runtime.types";

export interface InterstitialPort {
  load(): void;
  show(): Promise<unknown>;
  destroy(): void;
  listen(
    event: "loaded" | "opened" | "closed" | "error",
    fn: () => void,
  ): () => void;
}
// Never resolves on the SDK's show() promise (it means presented, not dismissed).
export function createInterstitial(
  port: InterstitialPort,
  onReady: (ready: boolean) => void,
): FullscreenAd {
  let ready = false,
    loading = false,
    disposed = false,
    showing = false,
    opened = false;
  let complete: ((shown: boolean) => void) | null = null;
  const settle = (shown: boolean) => {
    ready = false;
    loading = false;
    showing = false;
    onReady(false);
    const done = complete;
    complete = null;
    done?.(shown);
  };
  const subscriptions = [
    port.listen("loaded", () => {
      if (!disposed && !showing) {
        ready = true;
        loading = false;
        onReady(true);
      }
    }),
    port.listen("opened", () => {
      opened = true;
    }),
    port.listen("closed", () => settle(opened)),
    port.listen("error", () => settle(false)),
  ];
  return {
    load() {
      if (!disposed && !showing && !ready && !loading) {
        loading = true;
        try {
          port.load();
        } catch {
          settle(false);
        }
      }
    },
    show() {
      if (!ready || disposed || showing) return Promise.resolve(false);
      ready = false;
      showing = true;
      opened = false;
      onReady(false);
      return new Promise<boolean>((resolve) => {
        complete = resolve;
        try {
          void port.show().catch(() => settle(false));
        } catch {
          settle(false);
        }
      });
    },
    dispose() {
      disposed = true;
      subscriptions.forEach((unsubscribe) => unsubscribe());
      settle(false);
      port.destroy();
    },
  };
}
