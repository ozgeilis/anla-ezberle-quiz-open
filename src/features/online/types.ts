export interface OnlineQuestion {
  id: string;
  version: number;
  prompt: string;
  options: { id: string; text: string }[];
}
export interface OnlineMatch {
  id: string;
  state:
    | "created"
    | "waiting_for_opponent"
    | "in_progress"
    | "waiting_for_result"
    | "completed"
    | "expired"
    | "cancelled";
  revision: number;
  createdAt: string;
  expiresAt: string;
  manifestHash: string;
  ruleVersion: number;
  scope: "synthetic_test" | "owner_approved_v13" | "bank-v72" | "bank-v73";
  slot: "a" | "b";
  started: boolean;
  finished: boolean;
  questions: OnlineQuestion[];
  answers: { position: number; optionId: string; requestId: string }[];
  players: {
    slot: "a" | "b";
    name: string;
    finished: boolean;
    correct: number | null;
    wrong: number | null;
    score: number | null;
  }[];
  result: { winner: "a" | "b" | "tie" } | null;
  review: {
    id: string;
    version: number;
    correctOptionId: string;
    explanation: string;
  }[];
  inviteToken?: string;
  direct?: boolean;
}
export interface OnlineSelf {
  profile: { name: string };
  matches: Pick<OnlineMatch, "id" | "state" | "createdAt">[];
}
export type RoomOperation =
  | "room_options"
  | "room_list"
  | "room_create"
  | "room_join"
  | "room_get"
  | "room_ready"
  | "room_settings"
  | "room_start"
  | "room_answer"
  | "room_leave";
export type OnlineOperation =
  | "leaderboard"
  | "leaderboard_self"
  | "leaderboard_settings"
  | RoomOperation
  | "achievement_self"
  | "achievement_settings"
  | MatchmakingOperation
  | SocialOperation
  | "self"
  | "profile"
  | "create"
  | "join"
  | "get"
  | "start"
  | "answer"
  | "invite"
  | "cancel";
export interface PendingAnswer {
  matchId: string;
  position: number;
  optionId: string;
  requestId: string;
}

export type SocialOperation =
  | "social_self"
  | "username_check"
  | "social_profile"
  | "player_search"
  | "friends"
  | "friend_send"
  | "friend_accept"
  | "friend_remove";
export interface SocialPlayer {
  id: string;
  name: string;
  username: string;
  avatar: number;
  xp: number;
  level: number;
  achievementsShared?: boolean;
  badgeIds?: string[];
  showcase?: string[];
}
export interface SocialSelf {
  profile: {
    name: string;
    username: string | null;
    avatar: number;
    discoverable: boolean;
  };
  player: SocialPlayer | null;
}
export interface Friendship {
  id: string;
  state: "pending" | "accepted";
  incoming: boolean;
  player: SocialPlayer | null;
}

export type MatchmakingOperation =
  | "account_bootstrap"
  | "inbox"
  | "notification_read"
  | "challenge_send"
  | "challenge_reply";
export interface DirectChallenge {
  id: string;
  incoming: boolean;
  state: "pending" | "accepted" | "declined" | "cancelled" | "expired";
  createdAt: string;
  expiresAt: string;
  matchId: string | null;
  matchState: OnlineMatch["state"] | null;
  player: SocialPlayer | null;
}
export interface PlayerNotification {
  id: string;
  kind:
    | "friend_request"
    | "friend_accepted"
    | "challenge_received"
    | "challenge_accepted"
    | "challenge_declined"
    | "challenge_cancelled"
    | "turn_ready"
    | "match_completed";
  referenceId: string;
  createdAt: string;
  read: boolean;
}
export interface PlayerInbox {
  notifications: PlayerNotification[];
  unreadCount: number;
  challenges: DirectChallenge[];
}

export interface LeaderboardEntry {
  rank: number;
  games: number;
  player: SocialPlayer;
}
export interface LeaderboardCursor {
  xp: number;
  games: number;
  id: string;
}
export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  nextCursor: LeaderboardCursor | null;
  asOf: string;
  scope: "global" | "friends";
  self: {
    optIn: boolean;
    discoverable: boolean;
    username: string | null;
    xp: number;
    games: number;
    entry: LeaderboardEntry | null;
  };
}
