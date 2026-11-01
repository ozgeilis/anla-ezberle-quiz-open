/** Linking and the browser can deliver the same callback together. Cache the
 * entire validation outcome, including failures, before reading async storage.
 * The callback key/outcome live only in memory, never persisted; a new
 * sign-in/sign-out explicitly clears them. */
export function createGoogleCallbackCompletion() {
  let cached: {
    key: string;
    expiresAt: number;
    promise: Promise<void>;
  } | null = null;
  return {
    clear() {
      cached = null;
    },
    run(key: string, complete: () => Promise<void>, now = Date.now()) {
      if (cached?.key === key && cached.expiresAt > now) return cached.promise;
      const promise = Promise.resolve().then(complete);
      cached = { key, expiresAt: now + 300_000, promise };
      return promise;
    },
  };
}
