/** Visible feedback lasts this long; background/dialog time never skips a question. */
export const ANSWER_FEEDBACK_MS = 1200;

/** A cancelled timer, duplicate render, or previous round cannot advance twice. */
export class FeedbackTransition {
  private revision = 0;
  private consumed: string | null = null;
  arm(key: string, blocked: boolean): (() => boolean) | null {
    const revision = ++this.revision;
    if (blocked || this.consumed === key) return null;
    return () => {
      if (revision !== this.revision || this.consumed === key) return false;
      this.consumed = key;
      return true;
    };
  }
  cancel() {
    this.revision++;
  }
}
