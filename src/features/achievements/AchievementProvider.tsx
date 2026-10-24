import { useSound } from "../audio/SoundProvider";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, Platform } from "react-native";
import { useGame } from "../../storage/GameProvider";
import { useOnlineAuth } from "../online/OnlineProvider";
import { useInbox } from "../online/InboxProvider";
import { onlineMessage, onlineRequest } from "../online/client";
import {
  achievements,
  BadgeState,
  SocialAchievements,
} from "../../domain/achievements/evaluate";
interface Value {
  badges: BadgeState[];
  social: SocialAchievements | undefined;
  error: string;
  reward: BadgeState[];
  dismiss: () => void;
  refresh: () => Promise<void>;
  saveSharing: (shared: boolean, showcase: string[]) => Promise<void>;
}
const Context = createContext<Value | null>(null);
export function AchievementProvider({ children }: React.PropsWithChildren) {
  const { play } = useSound();
  const { data, ready, result } = useGame(),
    { session } = useOnlineAuth(),
    inbox = useInbox();
  const actor = session?.user.id;
  const [snapshot, setSnapshot] = useState<{
      actor: string;
      data: SocialAchievements;
    } | null>(null),
    [error, setError] = useState("");
  const currentActor = useRef(actor);
  useEffect(() => {
    currentActor.current = actor;
  }, [actor]);
  const social = snapshot?.actor === actor ? snapshot?.data : undefined;
  const [rewardState, setReward] = useState<{
    actor: string | undefined;
    badges: BadgeState[];
  }>({ actor: undefined, badges: [] });
  const reward = useMemo(
    () => (rewardState.actor === actor ? rewardState.badges : []),
    [rewardState, actor],
  );
  const dismiss = useCallback(
    () => setReward({ actor: currentActor.current, badges: [] }),
    [],
  );
  const revision = useRef(0),
    settingsBusy = useRef(false);
  const localSeen = useRef<Set<string> | null>(null),
    remoteSeen = useRef<{ actor: string; ids: Set<string> } | null>(null);
  const refresh = useCallback(async () => {
    if (!actor || !inbox.ready || settingsBusy.current) return;
    const requestRevision = ++revision.current;
    try {
      const next = await onlineRequest<SocialAchievements>(
        "achievement_self",
        {},
        actor,
      );
      if (
        currentActor.current === actor &&
        revision.current === requestRevision
      ) {
        setSnapshot({ actor, data: next });
        setError("");
      }
    } catch (e) {
      if (currentActor.current === actor) setError(onlineMessage(e));
    }
  }, [actor, inbox.ready]);
  useEffect(() => {
    const timer = setTimeout(() => void refresh(), 200);
    return () => clearTimeout(timer);
  }, [refresh, inbox.notifications]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (
        Platform.OS === "web"
          ? document.visibilityState !== "hidden"
          : AppState.currentState === "active"
      )
        void refresh();
    }, 60000);
    const listener = AppState.addEventListener("change", (s) => {
      if (s === "active") void refresh();
    });
    return () => {
      clearInterval(timer);
      listener.remove();
    };
  }, [refresh]);
  const badges = useMemo(
    () => achievements(data.games, social),
    [data.games, social],
  );
  useEffect(() => {
    if (!ready) return;
    const local = badges.filter((b) => b.group !== "social" && b.earned),
      online = badges.filter((b) => b.group === "social" && b.earned);
    const fresh: BadgeState[] = [];
    if (localSeen.current)
      fresh.push(...local.filter((b) => !localSeen.current!.has(b.id)));
    localSeen.current = new Set(local.map((b) => b.id));
    if (actor && social) {
      if (remoteSeen.current?.actor === actor)
        fresh.push(...online.filter((b) => !remoteSeen.current!.ids.has(b.id)));
      remoteSeen.current = { actor, ids: new Set(online.map((b) => b.id)) };
    } else remoteSeen.current = null;
    if (fresh.length) {
      const audible = fresh.filter(
        (b) =>
          b.group === "social" ||
          (result && data.games.some((g) => g.id === result.id)),
      );
      if (audible.length)
        play(
          "badge",
          `badges:${actor ?? "device"}:${audible
            .map((b) => b.id)
            .sort()
            .join(":")}`,
        );
      const timer = setTimeout(
        () =>
          setReward((old) => ({
            actor,
            badges: [...(old.actor === actor ? old.badges : []), ...fresh],
          })),
        0,
      );
      return () => clearTimeout(timer);
    }
  }, [badges, ready, actor, social, result, data.games, play]);
  const saveSharing = useCallback(
    async (shared: boolean, showcase: string[]) => {
      if (!actor) throw new Error("Önce doğrulanmış hesabınla giriş yap.");
      if (settingsBusy.current)
        throw new Error("Ayar kaydediliyor. Biraz bekle.");
      settingsBusy.current = true;
      ++revision.current;
      try {
        const next = await onlineRequest<SocialAchievements>(
          "achievement_settings",
          { shared, showcase },
          actor,
        );
        if (currentActor.current === actor) setSnapshot({ actor, data: next });
      } finally {
        settingsBusy.current = false;
      }
    },
    [actor],
  );

  const value = useMemo(
    () => ({ badges, social, error, reward, dismiss, refresh, saveSharing }),
    [badges, social, error, reward, dismiss, refresh, saveSharing],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAchievements() {
  const context = useContext(Context);
  if (!context) throw new Error("AchievementProvider gerekli.");
  return context;
}
