import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { onlineMessage, onlineRequest } from "../online/client";
import type { LeaderboardResult } from "../online/types";
import { mergeRankedEntries } from "./leaderboard";
export function useLeaderboard(actor: string, scope: "global" | "friends") {
  const [value, setValue] = useState<LeaderboardResult | null>(null),
    [status, setStatus] = useState<
      "loading" | "ready" | "refreshing" | "more" | "saving" | "error"
    >("loading"),
    [error, setError] = useState("");
  const alive = useRef(true),
    lock = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const fetchList = useCallback(
    async (cursor: LeaderboardResult["nextCursor"] = null) => {
      const next = await onlineRequest<LeaderboardResult>(
        "leaderboard",
        { scope, limit: 50, ...(cursor ? { cursor } : {}) },
        actor,
      );
      if (alive.current) {
        setValue((old) =>
          cursor && old
            ? {
                ...next,
                entries: mergeRankedEntries(old.entries, next.entries),
              }
            : next,
        );
        setStatus("ready");
        setError("");
      }
    },
    [actor, scope],
  );
  const load = useCallback(
    async (cursor: LeaderboardResult["nextCursor"] = null) => {
      if (lock.current) return;
      lock.current = true;
      setStatus(cursor ? "more" : "refreshing");
      setError("");
      try {
        await fetchList(cursor);
      } catch (e) {
        if (alive.current) {
          setError(onlineMessage(e));
          setStatus("error");
        }
      } finally {
        lock.current = false;
      }
    },
    [fetchList],
  );
  useEffect(() => {
    void Promise.resolve().then(() => load());
    const foreground = AppState.addEventListener("change", (s) => {
      if (s === "active") void load();
    });
    const visible = () => {
      if (document.visibilityState === "visible") void load();
    };
    if (Platform.OS === "web")
      document.addEventListener("visibilitychange", visible);
    return () => {
      foreground.remove();
      if (Platform.OS === "web")
        document.removeEventListener("visibilitychange", visible);
    };
  }, [load]);
  const preference = async (enabled: boolean) => {
    if (lock.current) return;
    lock.current = true;
    setStatus("saving");
    setError("");
    try {
      const saved = await onlineRequest<{ saved: boolean; optIn: boolean }>(
        "leaderboard_settings",
        { enabled },
        actor,
      );
      if (saved.saved !== true || saved.optIn !== enabled)
        throw Error("Unacknowledged preference");
      if (!alive.current) return;
      // Server-acknowledged privacy change; hide old ranks until refreshed, never renumber locally.
      setValue((old) =>
        old
          ? {
              ...old,
              entries: [],
              nextCursor: null,
              self: { ...old.self, optIn: saved.optIn, entry: null },
            }
          : old,
      );
      await fetchList();
    } catch (e) {
      if (alive.current) {
        setError(onlineMessage(e));
        setStatus("error");
      }
    } finally {
      lock.current = false;
    }
  };
  return {
    value,
    status,
    error,
    load,
    preference,
    busy: ["loading", "refreshing", "more", "saving"].includes(status),
  };
}
