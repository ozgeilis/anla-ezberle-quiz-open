export type TimingVersion = 1 | 2;
export const CURRENT_TIMING_VERSION = 2;
export const QUESTION_LIMIT_SECONDS = 20;
export const QUESTION_LIMIT_MS = QUESTION_LIMIT_SECONDS * 1000;
/** Version 1 remains immutable for recorded games and resumed demos. */
export const questionLimitMs = (version: TimingVersion | undefined) =>
  version === 1 ? 10_000 : QUESTION_LIMIT_MS;
// Monotonic elapsed time projected onto the record's wall-clock origin. Clock
// changes, delayed callbacks and app suspension cannot grant extra answer time.
export class QuestionClock {
  private readonly origin: number;
  private readonly wallOrigin: number;
  private elapsed = 0;
  constructor(
    readonly openedAt: number,
    private readonly monotonic = () => performance.now(),
    private readonly initialElapsed = 0,
    readonly limitMs = QUESTION_LIMIT_MS,
    monotonicOrigin?: number,
    private readonly wallClock = () => Date.now(),
  ) {
    this.origin = monotonicOrigin ?? monotonic();
    this.wallOrigin = wallClock() - Math.max(0, monotonic() - this.origin);
  }
  now() {
    this.elapsed = Math.max(
      this.elapsed,
      this.initialElapsed +
        Math.max(
          0,
          this.monotonic() - this.origin,
          this.wallClock() - this.wallOrigin,
        ),
    );
    return this.openedAt + this.elapsed;
  }
  remaining() {
    return Math.max(0, this.limitMs - (this.now() - this.openedAt));
  }
  expired() {
    return this.remaining() <= 0;
  }
}
