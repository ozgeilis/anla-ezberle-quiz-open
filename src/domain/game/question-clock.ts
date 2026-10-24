export const QUESTION_LIMIT_MS = 10_000;
// Monotonic elapsed time projected onto the record's wall-clock origin. Clock
// changes, delayed callbacks and app suspension cannot grant extra answer time.
export class QuestionClock {
  private readonly origin: number;
  constructor(
    readonly openedAt: number,
    private readonly monotonic = () => performance.now(),
    private readonly initialElapsed = 0,
  ) {
    this.origin = monotonic();
  }
  now() {
    return (
      this.openedAt +
      this.initialElapsed +
      Math.max(0, this.monotonic() - this.origin)
    );
  }
  remaining() {
    return Math.max(0, QUESTION_LIMIT_MS - (this.now() - this.openedAt));
  }
  expired() {
    return this.remaining() <= 0;
  }
}
