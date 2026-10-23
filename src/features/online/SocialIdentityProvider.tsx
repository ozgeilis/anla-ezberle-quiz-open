import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState, Platform } from "react-native";
import { useGame } from "../../storage/GameProvider";
import { useInbox } from "./InboxProvider";
import { useOnlineAuth } from "./OnlineProvider";
import { onlineMessage, onlineRequest } from "./client";
import {
  playerDisplayName,
  displayNameError,
  socialProfileBody,
} from "./identity";
import type { SocialSelf } from "./types";
interface IdentityValue {
  self: SocialSelf | null;
  displayName: string;
  error: string;
  refresh: () => Promise<void>;
  save: (username: string, discoverable: boolean) => Promise<void>;
  saveName: (name: string) => Promise<void>;
  syncAvatar: () => Promise<void>;
}
const Context = createContext<IdentityValue | null>(null);
export function SocialIdentityProvider({ children }: React.PropsWithChildren) {
  const { session } = useOnlineAuth(),
    { data } = useGame(),
    inbox = useInbox();
  const actor = session?.user.id;
  const current = useRef(actor);
  const mounted = useRef(true),
    revision = useRef(0),
    saving = useRef<string | null>(null);
  useEffect(() => {
    current.current = actor;
    ++revision.current;
  }, [actor]);
  const [snapshot, setSnapshot] = useState<{
    actor: string;
    self: SocialSelf;
  } | null>(null);
  const [failure, setFailure] = useState<{
    actor: string;
    message: string;
  } | null>(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const refresh = useCallback(async () => {
    if (!actor) return;
    const version = ++revision.current;
    const value = await onlineRequest<SocialSelf>("social_self", {}, actor);
    if (
      mounted.current &&
      current.current === actor &&
      revision.current === version
    ) {
      setSnapshot({ actor, self: value });
      setFailure(null);
    }
  }, [actor]);
  useEffect(() => {
    if (!actor || !inbox.ready) return;
    const sync = () => {
      if (saving.current) return;
      void refresh().catch((e) => {
        if (mounted.current && current.current === actor)
          setFailure({ actor, message: onlineMessage(e) });
      });
    };
    sync();
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") sync();
    });
    const visible = () => {
      if (document.visibilityState === "visible") sync();
    };
    if (Platform.OS === "web")
      document.addEventListener("visibilitychange", visible);
    return () => {
      listener.remove();
      if (Platform.OS === "web")
        document.removeEventListener("visibilitychange", visible);
    };
  }, [actor, inbox.ready, refresh]);
  const self = snapshot && snapshot.actor === actor ? snapshot.self : null;
  const publish = (next: SocialSelf, expected: string, version: number) => {
    if (
      mounted.current &&
      current.current === expected &&
      revision.current === version
    ) {
      setSnapshot({ actor: expected, self: next });
      setFailure(null);
    }
  };
  const write = async (
    action: (
      value: SocialSelf,
      expected: string,
      version: number,
    ) => Promise<void>,
  ) => {
    if (!actor || !self)
      throw new Error("Profil henüz yüklenmedi. Yeniden dene.");
    if (saving.current) throw new Error("Profil kaydediliyor. Biraz bekle.");
    saving.current = actor;
    const version = ++revision.current;
    try {
      await action(self, actor, version);
    } finally {
      saving.current = null;
    }
  };
  const saveSocial = (
    patch: Partial<
      Pick<SocialSelf["profile"], "username" | "avatar" | "discoverable">
    >,
  ) =>
    write(async (value, expected, version) => {
      const body = socialProfileBody(value, patch);
      const result = await onlineRequest<{ saved: boolean }>(
        "social_profile",
        body,
        expected,
      );
      if (result.saved !== true)
        throw new Error("Sunucu kaydı doğrulamadı. Yeniden dene.");
      publish(
        {
          ...value,
          profile: body,
          player: value.player
            ? { ...value.player, username: body.username!, avatar: body.avatar }
            : null,
        },
        expected,
        version,
      );
    });
  const save = (username: string, discoverable: boolean) =>
    saveSocial({ username, discoverable });
  const syncAvatar = () => saveSocial({ avatar: data.profile.avatar });
  const saveName = (input: string) =>
    write(async (value, expected, version) => {
      const invalid = displayNameError(input);
      if (invalid) throw new Error(invalid);
      const result = await onlineRequest<{ profile: { name: string } }>(
        "profile",
        { name: input.trim().normalize("NFC") },
        expected,
      );
      if (
        !result.profile ||
        typeof result.profile.name !== "string" ||
        displayNameError(result.profile.name)
      )
        throw new Error("Sunucu kaydı doğrulamadı. Yeniden dene.");
      publish(
        {
          ...value,
          profile: { ...value.profile, name: result.profile.name },
          player: value.player
            ? { ...value.player, name: result.profile.name }
            : null,
        },
        expected,
        version,
      );
    });
  return (
    <Context.Provider
      value={{
        self,
        displayName: playerDisplayName(data.profile.name, self),
        error: failure && failure.actor === actor ? failure.message : "",
        refresh,
        save,
        saveName,
        syncAvatar,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function usePlayerIdentity() {
  const value = useContext(Context);
  if (!value) throw new Error("SocialIdentityProvider gerekli.");
  return value;
}
