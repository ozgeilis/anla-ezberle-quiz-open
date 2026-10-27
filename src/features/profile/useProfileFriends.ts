import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useOnlineAuth } from "../online/OnlineProvider";
import { useInbox } from "../online/InboxProvider";
import { onlineMessage, onlineRequest } from "../online/client";
import type { Friendship } from "../online/types";
export function useProfileFriends() {
  const { session } = useOnlineAuth(),
    inbox = useInbox();
  const actor = session?.user.id;
  const [snapshot, setSnapshot] = useState<{
    actor: string;
    friends: Friendship[];
    error: string;
  } | null>(null);
  useFocusEffect(
    useCallback(() => {
      if (!actor || !inbox.ready) return;
      let alive = true;
      void onlineRequest<{ friendships: Friendship[] }>("friends", {}, actor)
        .then((result) => {
          if (alive)
            setSnapshot({
              actor,
              friends: result.friendships.filter(
                (f) => f.state === "accepted" && f.player,
              ),
              error: "",
            });
        })
        .catch((e) => {
          if (alive)
            setSnapshot({ actor, friends: [], error: onlineMessage(e) });
        });
      return () => {
        alive = false;
      };
    }, [actor, inbox.ready]),
  );
  const current = snapshot?.actor === actor ? snapshot : null;
  return {
    signedIn: !!actor,
    friends: current?.friends ?? [],
    loading: !!actor && !current,
    error: current?.error ?? "",
  };
}
