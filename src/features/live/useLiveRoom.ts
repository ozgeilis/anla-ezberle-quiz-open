import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "expo-router";
import { AppState, Platform, AccessibilityInfo } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { randomUUID } from "expo-crypto";
import {
  onlineClient,
  onlineMessage,
  onlineRequest,
  OnlineError,
} from "../online/client";
import type { RoomOperation } from "../online/types";
import type {
  LiveRoom,
  LivePending,
  LiveCombination,
  LiveListItem,
} from "./types";
const inviteKey = "anla-live-pending-invite-v1";
const lastKey = (actor: string) => `anla-live-v1:${actor}:room`;
const answerKey = (actor: string, room: string) =>
  `anla-live-v1:${actor}:${room}:answer`;
const validPending = (p: unknown, id: string): p is LivePending =>
  !!p &&
  typeof p === "object" &&
  "roomId" in p &&
  p.roomId === id &&
  "position" in p &&
  Number.isInteger(p.position) &&
  Number(p.position) > 0 &&
  Number(p.position) <= 15 &&
  "requestId" in p &&
  typeof p.requestId === "string" &&
  /^[a-f0-9-]{36}$/.test(p.requestId) &&
  "optionId" in p &&
  typeof p.optionId === "string" &&
  p.optionId.length < 100;
export function useLiveRoom(
  actor: string | undefined,
  ready: boolean,
  code?: string,
  initialRoom?: string,
) {
  const [room, setRoom] = useState<LiveRoom | null>(null),
    [combinations, setCombinations] = useState<LiveCombination[]>([]),
    [rooms, setRooms] = useState<LiveListItem[]>([]),
    [pending, setPending] = useState<LivePending | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [connection, setConnection] = useState("Bağlanıyor"),
    [now, setNow] = useState(0),
    [stale, setStale] = useState(false),
    [bootVersion, setBootVersion] = useState(0),
    [needsProfile, setNeedsProfile] = useState(false);
  const current = useRef<LiveRoom | null>(null),
    pendingRef = useRef<LivePending | null>(null),
    alive = useRef(true),
    lock = useRef(false),
    refreshLock = useRef(false),
    clock = useRef({ server: 0, received: 0 }),
    latestGet = useRef(0),
    createLock = useRef(false);
  const accept = useCallback(
    async (next: LiveRoom, expected?: string) => {
      if (
        !alive.current ||
        !actor ||
        (expected && current.current?.id !== expected)
      )
        return;
      if (
        current.current?.id === next.id &&
        (current.current.revision > next.revision ||
          (current.current.revision === next.revision &&
            Date.parse(current.current.serverNow) > Date.parse(next.serverNow)))
      )
        return;
      current.current = next;
      clock.current = {
        server: Date.parse(next.serverNow),
        received: performance.now(),
      };
      latestGet.current = performance.now();
      setRoom(next);
      setNow(clock.current.server);
      setStale(false);
      await AsyncStorage.setItem(lastKey(actor), next.id);
      let stored: unknown = null;
      try {
        const raw = await AsyncStorage.getItem(answerKey(actor, next.id));
        stored = raw ? JSON.parse(raw) : null;
      } catch {
        /* A corrupt local retry never grants an answer or a reward. */
      }
      if (!alive.current || current.current?.id !== next.id) return;
      const value = validPending(stored, next.id) ? stored : null;
      if (
        value &&
        (next.answer?.position === value.position ||
          next.position > value.position ||
          (next.position === value.position && next.phase !== "answer") ||
          ["completed", "cancelled", "expired"].includes(next.state))
      ) {
        await AsyncStorage.removeItem(answerKey(actor, next.id));
        pendingRef.current = null;
        setPending(null);
      } else {
        pendingRef.current = value;
        setPending(value);
      }
    },
    [actor],
  );
  const refresh = useCallback(async () => {
    const id = current.current?.id;
    if (!actor) return;
    if (!id) {
      setBootVersion((v) => v + 1);
      return;
    }
    if (refreshLock.current) return;
    refreshLock.current = true;
    try {
      const next = await onlineRequest<LiveRoom>(
        "room_get",
        { roomId: id },
        actor,
      );
      await accept(next, id);
      if (alive.current) setError("");
    } catch (e) {
      if (alive.current) setError(onlineMessage(e));
    } finally {
      refreshLock.current = false;
    }
  }, [actor, accept]);
  const run = useCallback(
    async (operation: RoomOperation, body: object = {}) => {
      if (!actor || lock.current) return null;
      lock.current = true;
      setBusy(true);
      setError("");
      const expected =
        operation === "room_create" || operation === "room_join"
          ? undefined
          : current.current?.id;
      try {
        const next = await onlineRequest<LiveRoom>(operation, body, actor);
        await accept(next, expected);
        return next;
      } catch (e) {
        if (alive.current) setError(onlineMessage(e));
        return null;
      } finally {
        lock.current = false;
        if (alive.current) setBusy(false);
      }
    },
    [actor, accept],
  );
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    if (code && /^[A-Z2-9]{6}$/.test(code))
      void AsyncStorage.setItem(inviteKey, code).catch(() =>
        setError("Davet bu cihazda saklanamadı. Kodu not alıp yeniden aç."),
      );
  }, [code]);
  useEffect(() => {
    if (!actor || !ready) return;
    let cancelled = false;
    void (async () => {
      try {
        const [catalog, list] = await Promise.all([
          onlineRequest<{ combinations: LiveCombination[] }>(
            "room_options",
            {},
            actor,
          ),
          onlineRequest<{ rooms: LiveListItem[] }>("room_list", {}, actor),
        ]);
        if (cancelled) return;
        setCombinations(catalog.combinations);
        setNeedsProfile(false);
        setError("");
        setRooms(list.rooms);
        const invite = code ?? (await AsyncStorage.getItem(inviteKey));
        const saved =
          initialRoom ??
          (!invite ? await AsyncStorage.getItem(lastKey(actor)) : null);
        if (cancelled) return;
        if (invite && /^[A-Z2-9]{6}$/.test(invite)) {
          const next = await run("room_join", { code: invite });
          if (next) await AsyncStorage.removeItem(inviteKey);
        } else if (saved && /^[a-f0-9-]{36}$/.test(saved)) {
          const next = await onlineRequest<LiveRoom>(
            "room_get",
            { roomId: saved },
            actor,
          );
          if (!cancelled) await accept(next);
        }
      } catch (e) {
        if (!cancelled) {
          setError(onlineMessage(e));
          setNeedsProfile(
            e instanceof OnlineError && e.code === "USERNAME_REQUIRED",
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [actor, ready, code, initialRoom, run, accept, bootVersion]);
  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(() => {
        if (clock.current.received) {
          setNow(
            clock.current.server + performance.now() - clock.current.received,
          );
          setStale(performance.now() - latestGet.current > 10000);
        }
      }, 250);
      return () => clearInterval(interval);
    }, []),
  );
  const roomId = room?.id;
  useFocusEffect(
    useCallback(() => {
      if (
        !actor ||
        !roomId ||
        ["completed", "cancelled", "expired"].includes(room?.state ?? "")
      )
        return;
      const client = onlineClient();
      if (!client) return;
      let cancelled = false;
      const channel = client.channel(`live:${roomId}`, {
        config: { private: true, presence: { key: actor } },
      });
      channel
        .on("broadcast", { event: "changed" }, () => void refresh())
        .on("presence", { event: "sync" }, () => {
          if (!cancelled) setConnection("Canlı bağlantı");
        })
        .subscribe((status) => {
          if (cancelled) return;
          if (status === "SUBSCRIBED") {
            setConnection("Canlı bağlantı");
            void channel.track({ connected: true });
            void refresh();
          } else if (["CHANNEL_ERROR", "TIMED_OUT", "CLOSED"].includes(status))
            setConnection("Sunucudan yenileniyor");
        });
      const timer = setInterval(() => {
        if (
          Platform.OS === "web"
            ? document.visibilityState !== "hidden"
            : AppState.currentState === "active"
        )
          void refresh();
      }, 2000);
      const app = AppState.addEventListener("change", (s) => {
        if (s === "active") void refresh();
      });
      const resume = () => void refresh();
      if (Platform.OS === "web") {
        window.addEventListener("online", resume);
        window.addEventListener("focus", resume);
      }
      return () => {
        cancelled = true;
        clearInterval(timer);
        app.remove();
        if (Platform.OS === "web") {
          window.removeEventListener("online", resume);
          window.removeEventListener("focus", resume);
        }
        void client.removeChannel(channel);
      };
    }, [actor, roomId, room?.state, refresh]),
  );
  const send = async (optionId?: string) => {
    const r = current.current;
    if (!actor || !r || r.phase !== "answer" || r.answer || lock.current)
      return;
    let value = pendingRef.current;
    if (value && value.position !== r.position) {
      await refresh();
      return;
    }
    if (!value) {
      if (!optionId || !r.question?.options.some((o) => o.id === optionId))
        return;
      value = {
        roomId: r.id,
        position: r.position,
        optionId,
        requestId: randomUUID(),
      };
      // Lock before storage/network awaits; rapid taps cannot create a second request.
      lock.current = true;
      try {
        await AsyncStorage.setItem(
          answerKey(actor, r.id),
          JSON.stringify(value),
        );
        pendingRef.current = value;
        setPending(value);
      } catch {
        setError("Yanıt güvenle saklanamadı. Yeniden dene.");
        return;
      } finally {
        lock.current = false;
      }
    }
    const next = await run("room_answer", value);
    if (!next) await refresh();
    else
      AccessibilityInfo.announceForAccessibility(
        "Yanıtın kilitlendi. Doğru cevap süre bitince gösterilecek.",
      );
  };
  const create = async () => {
    if (!actor || createLock.current) return;
    createLock.current = true;
    // Persist creation request before sending: retrying after a lost response does not create another room.
    const key = `anla-live-v1:${actor}:create`;
    try {
      let req = await AsyncStorage.getItem(key);
      if (!req || !/^[a-f0-9-]{36}$/.test(req)) {
        req = randomUUID();
        await AsyncStorage.setItem(key, req);
      }
      const next = await run("room_create", { requestId: req });
      if (next) await AsyncStorage.removeItem(key);
      return next;
    } catch {
      setError("Oda isteği güvenle saklanamadı. Yeniden dene.");
    } finally {
      createLock.current = false;
    }
  };
  const leave = async () => {
    const r = current.current;
    if (!r || !actor) return false;
    let next = await run("room_leave", { roomId: r.id });
    // A dropped leave response is resolved from server membership, never guessed.
    if (!next) {
      try {
        const fresh = await onlineRequest<LiveRoom>(
          "room_get",
          { roomId: r.id },
          actor,
        );
        const own = fresh.players.find((p) => p.id === actor);
        if (
          ["completed", "cancelled", "expired"].includes(fresh.state) ||
          !own ||
          own.left
        )
          next = fresh;
        else {
          await accept(fresh, r.id);
          return false;
        }
      } catch {
        return false;
      }
    }
    if (next) {
      try {
        await AsyncStorage.removeItem(lastKey(actor));
      } catch {
        /* Server leave is already confirmed; retry cache cannot grant rewards. */
      }
      current.current = null;
      setRoom(null);
      return true;
    }
    return false;
  };
  return {
    room,
    combinations,
    rooms,
    pending,
    error,
    busy,
    connection,
    now,
    stale,
    needsProfile,
    run,
    refresh,
    send,
    create,
    leave,
  };
}
