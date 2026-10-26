import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useRootNavigationState } from "expo-router";
import { useGame } from "../../storage/GameProvider";
import { useOnlineAuth } from "../online/OnlineProvider";
import { pushRequest } from "./api";
import * as device from "./device";
import {
  defaultPushPreferences,
  enableOnDevice,
  effectivePush,
  pushEnvelope,
  safePushTarget,
  PushEnvelope,
  PushPermission,
  PushPreferences,
  PushSettingsSnapshot,
} from "./model";
interface PushValue {
  preferences: PushPreferences;
  permission: PushPermission;
  available: boolean;
  ready: boolean;
  busy: boolean;
  error: string;
  notice: string;
  registered: boolean;
  refresh: () => Promise<void>;
  save: (
    patch: Partial<PushPreferences>,
    requestPermission?: boolean,
  ) => Promise<boolean>;
}
const inactive: PushValue = {
  preferences: defaultPushPreferences,
  permission: "unsupported",
  available: false,
  ready: false,
  busy: false,
  error: "",
  notice: "",
  registered: false,
  refresh: async () => {},
  save: async () => false,
};
const Context = createContext<PushValue>(inactive);
export function PushProvider({ children }: React.PropsWithChildren) {
  const { session } = useOnlineAuth();
  const actor = session?.user.id;
  const [snapshot, setSnapshot] = useState<{
    actor: string | undefined;
    value: PushValue;
  }>({ actor: undefined, value: inactive });
  return (
    <Context.Provider
      value={snapshot.actor === actor ? snapshot.value : inactive}
    >
      <PushController key={actor ?? "guest"} publish={setSnapshot} />
      {children}
    </Context.Provider>
  );
}
const PushController = React.memo(function PushController({
  publish,
}: {
  publish: React.Dispatch<
    React.SetStateAction<{ actor: string | undefined; value: PushValue }>
  >;
}) {
  const navigation = useRootNavigationState();
  const { ready: gameReady } = useGame();
  const { session, ready: authReady } = useOnlineAuth(),
    actor = session?.user.id;
  const [preferences, setPreferences] = useState(defaultPushPreferences),
    [permission, setPermission] = useState<PushPermission>("unsupported"),
    [available, setAvailable] = useState(false),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [pending, setPending] = useState<PushEnvelope | null>(null);
  const [registered, setRegistered] = useState(false);
  const alive = useRef(true),
    lock = useRef(false),
    version = useRef(0);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const refresh = useCallback(async () => {
    const v = ++version.current;
    try {
      const p = await device.permission();
      const next = actor
        ? await pushRequest<PushSettingsSnapshot>(actor, "get")
        : { available: false, preferences: defaultPushPreferences };
      if (!alive.current || v !== version.current) return;
      setPermission(p);
      setPreferences(next.preferences);
      setAvailable(next.available);
      setError("");
      setReady(true);
      if (actor && next.available && device.nativePushSupported) {
        if (effectivePush(next.preferences, p, next.available)) {
          await pushRequest(
            actor,
            "register",
            await device.deviceRegistration(),
          );
          if (alive.current && v === version.current) setRegistered(true);
        } else {
          if (alive.current && v === version.current) setRegistered(false);
          await pushRequest(actor, "revoke", {
            deviceId: await device.installationId(),
          });
        }
      }
    } catch {
      if (alive.current && v === version.current) {
        setReady(true);
        setRegistered(false);
        setError(
          "Bildirim ayarları şu anda alınamıyor. Kayıtlı tercihlerin korunuyor; yeniden dene.",
        );
      }
    }
  }, [actor]);
  useEffect(() => {
    void Promise.resolve().then(refresh);
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active") void refresh();
    });
    return () => sub.remove();
  }, [refresh]);
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    void device
      .startPushListeners(
        (value, id) => {
          const v = pushEnvelope(value);
          if (!v) return;
          void (async () => {
            const last = await AsyncStorage.getItem("@anla-quiz/push-last");
            if (last === id) return;
            await AsyncStorage.multiSet([
              ["@anla-quiz/push-pending", JSON.stringify(v)],
              ["@anla-quiz/push-last", id],
            ]);
            if (!cancelled) setPending(v);
          })().catch(() => {
            if (!cancelled) {
              setPending(v);
              setNotice(
                "Bildirim hedefi bu cihazda kaydedilemedi. Yeniden girişte bildirimi tekrar açman gerekebilir.",
              );
            }
          });
        },
        () => void refresh(),
      )
      .then((fn) => {
        if (cancelled) fn();
        else cleanup = fn;
      })
      .catch(() => {
        if (!cancelled)
          setNotice("Bildirim bağlantısı kurulamadı. Ayarlardan yeniden dene.");
      });
    void AsyncStorage.getItem("@anla-quiz/push-pending")
      .then((raw) => {
        try {
          const v = raw ? pushEnvelope(JSON.parse(raw)) : null;
          if (!cancelled) setPending(v);
        } catch {
          if (!cancelled) setPending(null);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [refresh]);
  useEffect(() => {
    if (!pending || !authReady || !gameReady || !navigation?.key) return;
    if (!actor) {
      router.push("/online");
      return;
    }
    if (pending.recipientId !== actor) {
      let cancelled = false;
      void AsyncStorage.removeItem("@anla-quiz/push-pending")
        .catch(() => {})
        .then(() => {
          if (!cancelled) {
            setNotice(
              "Bu bildirim farklı bir hesaba ait. İlgili hesabınla giriş yapıp bildirimi yeniden açabilirsin.",
            );
            setPending(null);
          }
        });
      return () => {
        cancelled = true;
      };
    }
    let cancelled = false;
    void pushRequest<unknown>(actor, "target", {
      notificationId: pending.notificationId,
      source: pending.source,
    })
      .then((value) => {
        const target = safePushTarget(value);
        if (cancelled) return;
        const destination =
          target ??
          safePushTarget({
            kind: pending.source === "room" ? "room" : "notification",
            id: pending.notificationId,
          });
        if (destination) router.push(destination);
        setPending(null);
        void AsyncStorage.removeItem("@anla-quiz/push-pending");
      })
      .catch(() => {
        if (!cancelled) {
          const destination = safePushTarget({
            kind: pending.source === "room" ? "room" : "notification",
            id: pending.notificationId,
          });
          if (destination) router.push(destination);
          setPending(null);
          void AsyncStorage.removeItem("@anla-quiz/push-pending");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [pending, actor, authReady, gameReady, navigation?.key]);
  const save = async (
    patch: Partial<PushPreferences>,
    requestPermission = false,
  ) => {
    if (!actor || lock.current) return false;
    lock.current = true;
    ++version.current;
    setBusy(true);
    setError("");
    try {
      let next: PushSettingsSnapshot;
      if (patch.enabled === true) {
        if (!available) throw Error("Push gönderimi henüz sunucuda açılmadı.");
        next = await enableOnDevice({
          permission: requestPermission
            ? device.askPermission
            : device.permission,
          registration: device.deviceRegistration,
          commit: (registration) => pushRequest(actor, "enable", registration),
          reportPermission: (p) => {
            if (alive.current) setPermission(p);
          },
        });
      } else next = await pushRequest(actor, "preferences", patch);
      if (!alive.current) return false;
      setPreferences(next.preferences);
      setAvailable(next.available);
      if (patch.enabled !== undefined) setRegistered(patch.enabled);
      return true;
    } catch (e) {
      if (alive.current)
        setError(
          e instanceof Error
            ? e.message
            : "Tercihin kaydedilemedi; önceki ayarın korundu.",
        );
      return false;
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  };
  useEffect(() => {
    publish({
      actor,
      value: {
        preferences,
        permission,
        available,
        ready,
        registered,
        busy,
        error,
        notice:
          pending && actor && pending.recipientId !== actor
            ? "Bu bildirim başka bir hesabına ait. İlgili hesabınla giriş yap."
            : notice,
        refresh,
        save,
      },
    });
  });
  return null;
});
export const usePush = () => useContext(Context);
