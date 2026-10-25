import {
  authFailureMessage,
  passwordError,
  validEmail,
  verifiedAccount,
  AUTH_EMAIL_COOLDOWN_SECONDS,
} from "./account";
import { authRedirectUrl } from "./authLinks";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { AppState, Platform } from "react-native";
import { Session } from "@supabase/supabase-js";
import { onlineClient, onlineConfigured } from "./client";

interface AuthValue {
  session: Session | null;
  needsVerification: boolean;
  ready: boolean;
  notice: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  registrationEnabled: boolean;
  completeAccountDeletion: (actor: string) => Promise<void>;
}
const Context = createContext<AuthValue | null>(null);
export function OnlineProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [ready, setReady] = useState(!onlineConfigured);
  const [notice, setNotice] = useState("");
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  useEffect(() => {
    const client = onlineClient();
    if (!client) return;
    let alive = true;
    client.rpc("online_service_capabilities").then(({ data }) => {
      if (alive) setRegistrationEnabled(data?.registrationEnabled === true);
    });
    client.auth.startAutoRefresh();
    const { data: listener } = client.auth.onAuthStateChange((event, next) => {
      if (!alive) return;
      setSession(verifiedAccount(next?.user) ? next : null);
      setNeedsVerification(
        !!next?.user &&
          !next.user.is_anonymous &&
          !next.user.email_confirmed_at,
      );
      if (event === "SIGNED_OUT")
        setNotice("Çevrimiçi oturum kapandı. Yerel kayıtların korunuyor.");
    });
    client.auth
      .getSession()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error)
          setNotice("Güvenli oturum okunamadı. Yeniden giriş gerekli.");
        else {
          setSession(verifiedAccount(data.session?.user) ? data.session : null);
          setNeedsVerification(
            !!data.session?.user &&
              !data.session.user.is_anonymous &&
              !data.session.user.email_confirmed_at,
          );
        }
        setReady(true);
      })
      .catch(() => {
        if (alive) {
          setNotice(
            "Oturum depolamasına erişilemiyor. Yerel oyun kullanılabilir.",
          );
          setReady(true);
        }
      });
    const foreground = AppState.addEventListener("change", (state) => {
      if (Platform.OS !== "web") {
        if (state === "active") client.auth.startAutoRefresh();
        else client.auth.stopAutoRefresh();
      }
    });
    return () => {
      alive = false;
      listener.subscription.unsubscribe();
      foreground.remove();
      client.auth.stopAutoRefresh();
    };
  }, []);
  const signIn = async (email: string, password: string) => {
    const client = onlineClient();
    if (!client) throw new Error("Servis yapılandırılmadı.");
    const { error } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      throw new Error(authFailureMessage(error));
    }
    setNotice("");
  };
  const emailRequests = useRef(new Map<string, number>());
  const sendEmail = async (email: string, action: () => Promise<void>) => {
    if (!validEmail(email)) throw new Error("Geçerli bir e-posta adresi yaz.");
    const key = email.trim().toLowerCase();
    const remaining = Math.ceil(
      ((emailRequests.current.get(key) ?? 0) - Date.now()) / 1000,
    );
    if (remaining > 0)
      throw new Error(`Yeni e-posta istemeden önce ${remaining} saniye bekle.`);
    emailRequests.current.set(
      key,
      Date.now() + AUTH_EMAIL_COOLDOWN_SECONDS * 1000,
    );
    await action();
  };
  const signUp = async (email: string, password: string) => {
    const client = onlineClient();
    if (!client || !registrationEnabled)
      throw new Error(
        "Yeni hesap kaydı için e-posta servisi henüz hazır değil.",
      );
    const invalid = passwordError(password);
    if (invalid) throw new Error(invalid);
    await sendEmail(email, async () => {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: authRedirectUrl() },
      });
      if (error) throw new Error(authFailureMessage(error, true));
      // Fail closed if the remote confirmation policy is accidentally disabled.
      if (data.session) {
        await client.auth.signOut({ scope: "local" });
        throw new Error(
          "E-posta doğrulama güvenlik ayarı etkin değil. Lütfen daha sonra yeniden dene.",
        );
      }
    });
  };
  const resendVerification = async (email: string) => {
    const client = onlineClient();
    if (!client) throw new Error("Servis yapılandırılmadı.");
    await sendEmail(email, async () => {
      const { error } = await client.auth.resend({
        type: "signup",
        email: email.trim(),
        options: { emailRedirectTo: authRedirectUrl() },
      });
      if (error) throw new Error(authFailureMessage(error, true));
    });
  };
  const resetPassword = async (email: string) => {
    const client = onlineClient();
    if (!client) throw new Error("Servis yapılandırılmadı.");
    await sendEmail(email, async () => {
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: authRedirectUrl(),
      });
      if (error) throw new Error(authFailureMessage(error, true));
    });
  };
  const updatePassword = async (password: string) => {
    const client = onlineClient();
    if (!client) throw new Error("Servis yapılandırılmadı.");
    const invalid = passwordError(password);
    if (invalid) throw new Error(invalid);
    const { error } = await client.auth.updateUser({ password });
    if (error) throw new Error(authFailureMessage(error));
  };
  const signOut = async () => {
    const { error } = await onlineClient()!.auth.signOut({ scope: "local" });
    if (error) throw new Error("Çıkış tamamlanamadı. Bağlantını kontrol et.");
    setSession(null);
  };
  const completeAccountDeletion = async (actor: string) => {
    const client = onlineClient();
    if (!client) throw new Error("Servis yapılandırılmadı.");
    const { data, error: readError } = await client.auth.getSession();
    if (readError)
      throw new Error(
        "Cihaz oturumu okunamadı. Oturum temizliğini yeniden dene.",
      );
    if (data.session && data.session.user.id !== actor)
      throw new Error("Aktif hesap değişti. Yeni hesabında işlem yapılmadı.");
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error)
      throw new Error(
        "Sunucu hesabın silindi; cihaz oturumu temizlenemedi. Yeniden dene.",
      );
    setSession(null);
    setNeedsVerification(false);
    setNotice(
      "Hesabın ve çevrimiçi kişisel verilerin sunucudan silindi. Yerel tek oyunculu geçmişin korunuyor.",
    );
  };
  return (
    <Context.Provider
      value={{
        session,
        needsVerification,
        ready,
        notice,
        signIn,
        signOut,
        signUp,
        resetPassword,
        resendVerification,
        updatePassword,
        registrationEnabled,
        completeAccountDeletion,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useOnlineAuth() {
  const value = useContext(Context);
  if (!value) throw new Error("OnlineProvider gerekli.");
  return value;
}
