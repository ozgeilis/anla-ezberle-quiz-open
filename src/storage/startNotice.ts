export const START_NOTICE_MS = 3_000;

// A failed round start is informational: show it once, replace any previous
// notice, and clear it automatically so it never stays pinned above the app.
export function createStartNotice(
  set: (message: string | null) => void,
  ms = START_NOTICE_MS,
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };
  return {
    show(message: string) {
      cancel();
      set(message);
      timer = setTimeout(() => {
        timer = null;
        set(null);
      }, ms);
    },
    clear() {
      cancel();
      set(null);
    },
    dispose: cancel,
  };
}
