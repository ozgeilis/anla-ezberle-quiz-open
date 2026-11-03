// iOS cannot safely present a GMA controller while the React Native modal is
// still dismissing. Native onDismiss is the signal, not a guessed animation delay.
export function createModalDismissalGate(timeoutMs = 5_000) {
  let complete: ((dismissed: boolean) => void) | undefined;
  function cancel() {
    complete?.(false);
  }
  return {
    wait() {
      cancel();
      return new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => complete?.(false), timeoutMs);
        complete = (dismissed) => {
          clearTimeout(timer);
          complete = undefined;
          resolve(dismissed);
        };
      });
    },
    dismissed() {
      complete?.(true);
    },
    cancel,
  };
}
