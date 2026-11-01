import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import { onlineClient, onlineMessage, onlineRequest } from "./client";
import { useOnlineAuth } from "./OnlineProvider";
import { DirectChallenge, PlayerInbox, PlayerNotification } from "./types";
import { subscribeRealtime } from "./realtimeSubscription";
const empty: PlayerInbox = {
  notifications: [],
  challenges: [],
  unreadCount: 0,
};
interface InboxValue extends PlayerInbox {
  ready: boolean;
  busy: boolean;
  error: string;
  connection: "connecting" | "live" | "polling";
  refresh: () => Promise<void>;
  sendChallenge: (playerId: string) => Promise<DirectChallenge | null>;
  replyChallenge: (
    challengeId: string,
    action: "accept" | "decline" | "cancel",
  ) => Promise<DirectChallenge | null>;
  read: (notificationId: string) => Promise<boolean>;
}
const Context = createContext<InboxValue | null>(null);
const inactive: InboxValue = {
  ...empty,
  ready: false,
  busy: false,
  error: "",
  connection: "connecting",
  refresh: async () => {},
  sendChallenge: async () => null,
  replyChallenge: async () => null,
  read: async () => false,
};
interface InboxSnapshot {
  actor: string | undefined;
  value: InboxValue;
}
export function InboxProvider({ children }: React.PropsWithChildren) {
  const { session } = useOnlineAuth();
  const actor = session?.user.is_anonymous ? undefined : session?.user.id;
  const [snapshot, setSnapshot] = useState<InboxSnapshot>({
    actor: undefined,
    value: inactive,
  });
  return (
    <Context.Provider
      value={snapshot.actor === actor ? snapshot.value : inactive}
    >
      <InboxController key={actor ?? "guest"} publish={setSnapshot} />
      {children}
    </Context.Provider>
  );
}
const InboxController = React.memo(function AccountInbox({
  publish,
}: {
  publish: React.Dispatch<React.SetStateAction<InboxSnapshot>>;
}) {
  const { session } = useOnlineAuth();
  const actor = session?.user.is_anonymous ? undefined : session?.user.id;
  const [inbox, setInbox] = useState(empty);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [connection, setConnection] =
    useState<InboxValue["connection"]>("connecting");
  const reads = useRef(new Map<string, Promise<boolean>>());
  const revision = useRef(0);
  const lock = useRef(false),
    fetching = useRef(false);
  const refresh = useCallback(async () => {
    if (!actor || fetching.current) return;
    fetching.current = true;
    const version = ++revision.current;
    try {
      const next = await onlineRequest<PlayerInbox>("inbox", {}, actor);
      if (version !== revision.current) return;
      setInbox(next);
      setReady(true);
      setError("");
    } catch (e) {
      setError(onlineMessage(e));
    } finally {
      fetching.current = false;
    }
  }, [actor]);
  useEffect(() => {
    if (!actor) return;
    let alive = true;
    let debounce: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      if (
        !alive ||
        (Platform.OS === "web"
          ? document.visibilityState === "hidden"
          : AppState.currentState !== "active")
      )
        return;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (alive) void refresh();
      }, 200);
    };
    onlineRequest("account_bootstrap", {}, actor)
      .then(() => {
        if (alive) void refresh();
      })
      .catch((e) => {
        if (alive) setError(onlineMessage(e));
      });
    const client = onlineClient();
    const stopRealtime = client
      ? subscribeRealtime(
          client,
          `player-inbox:${actor}`,
          undefined,
          (channel) => {
            channel
              .on(
                "postgres_changes",
                {
                  event: "*",
                  schema: "public",
                  table: "player_notifications",
                  filter: `recipient_id=eq.${actor}`,
                },
                sync,
              )
              .subscribe((status) => {
                if (!alive) return;
                setConnection(status === "SUBSCRIBED" ? "live" : "polling");
                if (status === "SUBSCRIBED") sync();
              });
          },
          () => {
            if (alive) setConnection("polling");
          },
        )
      : undefined;
    const timer = setInterval(sync, 30000);
    const foreground = AppState.addEventListener("change", (state) => {
      if (state === "active") sync();
    });
    if (Platform.OS === "web")
      document.addEventListener("visibilitychange", sync);
    return () => {
      alive = false;
      clearTimeout(debounce);
      clearInterval(timer);
      foreground.remove();
      if (Platform.OS === "web")
        document.removeEventListener("visibilitychange", sync);
      stopRealtime?.();
    };
  }, [actor, refresh]);
  const perform = async (
    operation: "challenge_send" | "challenge_reply",
    body: object,
  ) => {
    if (!actor || lock.current) return null;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const result = await onlineRequest<{ challenge: DirectChallenge }>(
        operation,
        body,
        actor,
      );
      // Keep the server-acknowledged status even if the following inbox refresh fails.
      ++revision.current;
      setInbox((previous) => ({
        ...previous,
        challenges: [
          result.challenge,
          ...previous.challenges.filter((c) => c.id !== result.challenge.id),
        ],
      }));
      void refresh();
      return result.challenge;
    } catch (e) {
      setError(onlineMessage(e));
      return null;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const sendChallenge = async (playerId: string) => {
    if (!actor || lock.current) return null;
    const key = `@anla-quiz-online/challenge/v1/${actor}/${playerId}`;
    try {
      const previous = await AsyncStorage.getItem(key);
      const requestId =
        previous && /^[a-f0-9-]{36}$/.test(previous) ? previous : randomUUID();
      await AsyncStorage.setItem(key, requestId);
      const result = await perform("challenge_send", { playerId, requestId });
      if (result) await AsyncStorage.removeItem(key);
      return result;
    } catch {
      setError("Davet isteği bu cihazda saklanamadı. Yeniden dene.");
      return null;
    }
  };
  const read = useCallback(
    (notificationId: string): Promise<boolean> => {
      if (!actor) return Promise.resolve(false);
      if (
        (notificationId === "all" && inbox.unreadCount === 0) ||
        inbox.notifications.some((n) => n.id === notificationId && n.read)
      )
        return Promise.resolve(true);
      const pending = reads.current.get(notificationId);
      if (pending) return pending;
      const task = (async () => {
        ++revision.current;
        try {
          const saved = await onlineRequest<{ saved: boolean }>(
            "notification_read",
            { notificationId },
            actor,
          );
          if (saved.saved !== true) throw new Error("Unacknowledged read");
          // Re-read authoritative counts, including notifications outside the visible 50.
          const version = ++revision.current;
          const next = await onlineRequest<PlayerInbox>("inbox", {}, actor);
          if (version === revision.current) {
            setInbox(next);
            setReady(true);
            setError("");
          }
          return true;
        } catch (e) {
          setError(onlineMessage(e));
          return false;
        } finally {
          reads.current.delete(notificationId);
        }
      })();
      reads.current.set(notificationId, task);
      return task;
    },
    [actor, inbox.unreadCount, inbox.notifications],
  );
  useEffect(() => {
    publish({
      actor,
      value: {
        ...inbox,
        ready,
        busy,
        error,
        connection,
        refresh,
        sendChallenge,
        replyChallenge: (challengeId, action) =>
          perform("challenge_reply", { challengeId, action }),
        read,
      },
    });
  });
  return null;
});

export function useInbox() {
  const value = useContext(Context);
  if (!value) throw new Error("InboxProvider gerekli.");
  return value;
}
export const notificationTitle: Record<PlayerNotification["kind"], string> = {
  friend_request: "Yeni arkadaşlık isteğin var",
  friend_accepted: "Arkadaşlık isteğin kabul edildi",
  challenge_received: "Sana meydan okuyan bir oyuncu var",
  challenge_accepted: "Düello daveti kabul edildi",
  challenge_declined: "Düello daveti reddedildi",
  challenge_cancelled: "Düello daveti iptal edildi",
  turn_ready: "Rakibin turunu tamamladı",
  match_completed: "Düellonun sonucu hazır",
};
