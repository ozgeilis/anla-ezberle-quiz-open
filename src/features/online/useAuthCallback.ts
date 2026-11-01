import { useLocalSearchParams } from "expo-router";
import { authRedirectUrl } from "./authLinks";
import {
  callbackUrlFromParams,
  hasCallbackPayload as hasPayload,
} from "./authCallbackUrl";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { onlineClient } from "./client";
import { completeGoogleAuth } from "./googleAuth";
import { verifiedAccount } from "./account";
import { MissingAuthCredentials, verifyEmailLink } from "./verifyLink";

export type CallbackState =
  | { status: "loading"; google: boolean; message: string }
  | {
      status: "success";
      google: boolean;
      message: string;
      userId: string;
      recovery: boolean;
    }
  | {
      status: "error" | "missing";
      google: boolean;
      message: string;
      recovery?: boolean;
    };
const loading: CallbackState = {
  status: "loading",
  google: false,
  message: "Doğrulama bağlantısı kontrol ediliyor…",
};
/** URL acquisition and verification are separate: a bare initial route must not
 * consume or mask the credential-bearing Linking event that follows it. */
export function useAuthCallback() {
  const incoming = Linking.useURL();
  const params = useLocalSearchParams<Record<string, string | string[]>>();
  const routeUrl = callbackUrlFromParams(authRedirectUrl(), params);
  const [url, setUrl] = useState<string | null>(() =>
    Platform.OS === "web" ? window.location.href : null,
  );
  const [state, setState] = useState<CallbackState>(loading);
  const [retry, setRetry] = useState(0);
  const latest = useRef<string | null>(null);
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active && (routeUrl || hasPayload(incoming)))
        setUrl(routeUrl ?? incoming);
    });
    return () => {
      active = false;
    };
  }, [incoming, routeUrl]);
  useEffect(() => {
    let alive = true;
    if (Platform.OS !== "web") {
      void Linking.getInitialURL()
        .then((value) => {
          if (alive && hasPayload(value))
            setUrl((current) => (hasPayload(current) ? current : value));
        })
        .catch(() => undefined);
      return () => {
        alive = false;
      };
    }
    const changed = () => {
      if (hasPayload(window.location.href)) setUrl(window.location.href);
    };
    window.addEventListener("hashchange", changed);
    window.addEventListener("popstate", changed);
    return () => {
      window.removeEventListener("hashchange", changed);
      window.removeEventListener("popstate", changed);
    };
  }, []);
  useEffect(() => {
    let active = true;
    // Give cold-start Linking delivery a bounded chance to arrive.
    if (!hasPayload(url)) {
      const wait = setTimeout(() => {
        if (active)
          setState({
            status: "missing",
            google: false,
            message: new MissingAuthCredentials().message,
          });
      }, 2000);
      return () => {
        active = false;
        clearTimeout(wait);
      };
    }
    const value = url!;
    latest.current = value;
    let google = false;
    let recovery = false;
    try {
      const u = new URL(value);
      google = u.searchParams.get("flow") === "google";
      recovery =
        (u.searchParams.get("purpose") ??
          u.searchParams.get("type") ??
          new URLSearchParams(u.hash.slice(1)).get("type")) === "recovery";
    } catch {
      /* validation below */
    }

    if (Platform.OS === "web")
      window.history.replaceState(window.history.state, "", "/online/auth");
    const watchdog = setTimeout(() => {
      if (active)
        setState({
          status: "error",
          google,
          recovery,
          message:
            "İşlem zaman aşımına uğradı. Bağlantını kontrol edip yeniden dene.",
        });
    }, 35_000);
    void (async () => {
      await Promise.resolve();
      if (!active) return;
      setState({ ...loading, google });
      const client = onlineClient();
      if (!client) throw Error("Servis yapılandırılmadı.");
      let result: { recovery: boolean; userId: string };
      if (google) {
        await completeGoogleAuth(value);
        const identity = await client.auth.getUser();
        if (identity.error || !verifiedAccount(identity.data.user))
          throw Error("Google oturumu doğrulanamadı. Yeniden giriş yap.");
        result = { recovery: false, userId: identity.data.user!.id };
      } else result = await verifyEmailLink(value, client.auth);
      if (active)
        setState({
          status: "success",
          google,
          ...result,
          message: result.recovery
            ? "Yeni şifreni belirleyebilirsin."
            : "E-postan doğrulandı. Profilin açılıyor…",
        });
    })()
      .catch((error: unknown) => {
        if (active)
          setState({
            status:
              error instanceof MissingAuthCredentials ? "missing" : "error",
            google,
            recovery,
            message:
              error instanceof Error
                ? error.message
                : "Doğrulama tamamlanamadı.",
          });
      })
      .finally(() => clearTimeout(watchdog));
    return () => {
      active = false;
      clearTimeout(watchdog);
    };
  }, [url, retry]);
  return {
    state,
    retry: () => {
      if (latest.current) setRetry((value) => value + 1);
    },
  };
}
