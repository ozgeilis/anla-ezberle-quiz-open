import type { OnlineQuestion } from "../online/types";
import type { QuestionSource } from "../../content/questions/model";
export interface LiveReview {
  correctOptionId: string;
  explanation: string;
  sources: QuestionSource[];
}
export interface LivePlayer {
  id: string;
  name: string;
  username: string;
  avatar: number;
  ready: boolean;
  left: boolean;
  seenAt: string;
  answered: boolean;
  score: number | null;
  correct: number | null;
  wrong: number | null;
  unanswered: number | null;
  rank: number | null;
  won: boolean | null;
}
export interface LiveSettings {
  topic: string;
  level: string;
  count: number;
  seconds: 15;
}
export interface LiveRoom {
  id: string;
  code: string;
  hostId: string;
  state:
    "lobby" | "countdown" | "playing" | "completed" | "cancelled" | "expired";
  phase:
    | "lobby"
    | "countdown"
    | "answer"
    | "reveal"
    | "completed"
    | "cancelled"
    | "expired";
  position: number;
  revision: number;
  serverNow: string;
  startAt: string | null;
  deadline: string | null;
  nextAt: string | null;
  expiresAt: string;
  settings: LiveSettings;
  question: OnlineQuestion | null;
  answer: { position: number; optionId: string; requestId: string } | null;
  review: LiveReview | null;
  players: LivePlayer[];
  reward: {
    xp: number;
    bonus: number;
    credited: boolean;
    newBadges: string[];
  } | null;
  history: ({
    position: number;
    question: OnlineQuestion;
    optionId: string | null;
  } & LiveReview)[];
}
export interface LiveCombination {
  topic: string;
  level: string;
  count: number;
  available: boolean;
}
export interface LiveListItem {
  id: string;
  state: LiveRoom["state"];
  code: string;
  createdAt: string;
}
export interface LivePending {
  roomId: string;
  position: number;
  optionId: string;
  requestId: string;
}
