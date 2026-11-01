import { useCallback, useEffect, useRef, useState } from "react";
import { onlineMessage, onlineRequest } from "../client";
import { replyFriendRequest } from "../friendRequests";
import type { Friendship } from "../types";

/** One fetch for the list, never one request for every visible card. */
export function useInboxFriends(actor: string | undefined, references: string) {
  const [friends, setFriends] = useState<Friendship[]>([]),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(false),
    [revision, setRevision] = useState(0);
  const alive = useRef(true),
    lock = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (!actor || !references) return;
    let active = true;
    void Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      try {
        const next = await onlineRequest<{ friendships: Friendship[] }>(
          "friends",
          {},
          actor,
        );
        if (active) {
          setFriends(next.friendships);
          setError("");
        }
      } catch (e) {
        if (active) setError(onlineMessage(e));
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [actor, references, revision]);
  const reload = useCallback(() => setRevision((n) => n + 1), []);
  const reply = async (friend: Friendship, accept: boolean) => {
    if (!actor || lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const next = await replyFriendRequest(actor, friend, accept);
      if (!alive.current) return false;
      setFriends((old) =>
        next
          ? old.map((f) => (f.id === friend.id ? next : f))
          : old.filter((f) => f.id !== friend.id),
      );
      setNotice(
        accept
          ? "Arkadaşlık isteği kabul edildi."
          : "Arkadaşlık isteği reddedildi.",
      );
      return true;
    } catch (e) {
      if (alive.current) setError(onlineMessage(e));
      return false;
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  };
  return { friends, loading, busy, error, notice, reply, reload };
}
