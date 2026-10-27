import type { SoundEffect } from "./catalog";
export interface SoundCue {
  name: SoundEffect;
  id: string;
}
export interface QuizAudioState {
  id: string;
  cursor: number;
  answer: boolean | null;
  hidden: boolean;
  timedOut?: boolean;
}
export function quizAudioCues(
  old: QuizAudioState | null,
  next: QuizAudioState | null,
): SoundCue[] {
  if (!old || !next || old.id !== next.id) return [];
  if (old.cursor !== next.cursor)
    return [{ name: "next", id: `quiz:${next.id}:next:${next.cursor}` }];
  if (old.answer === null && next.answer !== null)
    return [
      {
        name: next.timedOut
          ? "timeout"
          : next.hidden
            ? "select"
            : next.answer
              ? "correct"
              : "wrong",
        id: `quiz:${next.id}:answer:${next.cursor}`,
      },
    ];
  return [];
}
export interface LiveAudioState {
  id: string;
  position: number;
  phase: string;
  state: string;
  reviewed: boolean;
  correct: boolean | null;
  perfect: boolean;
}
export function liveAudioCues(
  old: LiveAudioState | null,
  next: LiveAudioState | null,
): SoundCue[] {
  if (!old || !next || old.id !== next.id) return [];
  const cues: SoundCue[] = [];
  if (next.state === "completed" && old.state !== "completed")
    return [
      {
        name: next.perfect ? "perfect" : "completed",
        id: `live:${next.id}:result`,
      },
    ];
  if (next.phase === "answer" && old.position !== next.position)
    cues.push({ name: "next", id: `live:${next.id}:next:${next.position}` });
  // Neither a local clock reaching zero nor an unacknowledged answer can reveal correctness.
  if (
    next.phase === "reveal" &&
    next.reviewed &&
    (old.phase !== "reveal" || old.position !== next.position || !old.reviewed)
  )
    cues.push({
      name:
        next.correct === null ? "timeout" : next.correct ? "correct" : "wrong",
      id: `live:${next.id}:review:${next.position}`,
    });
  return cues;
}
export interface DuelAudioState {
  id: string;
  answers: number;
  completed: boolean;
  perfect: boolean;
}
export function duelAudioCues(
  old: DuelAudioState | null,
  next: DuelAudioState | null,
): SoundCue[] {
  if (!old || !next || old.id !== next.id) return [];
  if (next.completed && !old.completed)
    return [
      {
        name: next.perfect ? "perfect" : "completed",
        id: `online:${next.id}:result`,
      },
    ];
  // Async duel answer keys are deliberately hidden until the completed result.
  if (next.answers > old.answers)
    return [
      { name: "select", id: `online:${next.id}:accepted:${next.answers}` },
    ];
  return [];
}
