import { onlineRequest } from "./client";
import type { Friendship } from "./types";

/** UI callers never grant permission; the existing server validates the actor. */
export async function replyFriendRequest(
  actor: string,
  friend: Friendship,
  accept: boolean,
): Promise<Friendship | null> {
  if (friend.state !== "pending" || !friend.incoming)
    throw new Error("Friend request is no longer actionable");
  const saved = await onlineRequest<{ saved: boolean }>(
    accept ? "friend_accept" : "friend_remove",
    { friendshipId: friend.id },
    actor,
  );
  if (saved.saved !== true) throw new Error("Unacknowledged action");
  return accept ? { ...friend, state: "accepted" } : null;
}
