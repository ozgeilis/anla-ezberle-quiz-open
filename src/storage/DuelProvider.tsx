import { QuestionClock } from "../domain/game/question-clock";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CONTENT_CHANNEL } from "../content/questions";
import {
  appendDuelEvent,
  createDemoDocument,
  DemoMatch,
  DuelDocument,
  DuelEvent,
  DuelCommand,
  parseDemo,
  restoreDemo,
  terminal,
} from "../domain/duel/machine";

export const DEMO_STORAGE_KEY = "@anla-ezberle-quiz/demo-duel/v1";
interface DuelContext {
  match: DemoMatch | null;
  questionClock: QuestionClock | null;
  ready: boolean;
  error: string | null;
  create: () => boolean;
  act: (command: DuelCommand) => boolean;
  retry: () => Promise<void>;
}
const Context = createContext<DuelContext | null>(null);
export function DuelProvider({ children }: React.PropsWithChildren) {
  const questionClock = useRef<QuestionClock | null>(null);
  const [displayClock, setDisplayClock] = useState<QuestionClock | null>(null);
  const activeKey = useRef("");
  const [match, setMatch] = useState<DemoMatch | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const documentRef = useRef<DuelDocument | null>(null);
  const writable = useRef(false);
  const queue = useRef(Promise.resolve());
  const revision = useRef(0);
  const writeFailure = useRef(false);
  const persist = (next: DuelDocument) => {
    const number = ++revision.current;
    queue.current = queue.current.then(async () => {
      try {
        await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(next));
        if (number === revision.current) {
          writeFailure.current = false;
          setError(null);
        }
      } catch {
        writeFailure.current = true;
        setError(
          "Demo kaydı yazılamadı. Bu açılışta devam edebilirsin; yeniden açılışta son adımlar eksik olabilir.",
        );
      }
    });
  };
  const show = (doc: DuelDocument | null, restoring = false) => {
    const value = doc ? restoreDemo(doc) : null;
    const player = value?.activeRole
      ? value.players[value.activeRole]
      : undefined;
    const s = player?.session;
    const key = s ? `${s.id}:${s.cursor}` : "";
    if (activeKey.current !== key) {
      questionClock.current =
        s?.timingVersion === 1 && s.questionOpenedAt !== undefined
          ? new QuestionClock(
              s.questionOpenedAt,
              undefined,
              restoring ? Math.max(0, Date.now() - s.questionOpenedAt) : 0,
            )
          : null;
      setDisplayClock(questionClock.current);
      activeKey.current = key;
    }
    setMatch(value);
  };
  const accept = (next: DuelDocument) => {
    documentRef.current = next;
    show(next);
    persist(next);
  };
  const retry = async () => {
    if (CONTENT_CHANNEL !== "prototype") {
      setReady(true);
      return;
    }
    await queue.current;
    if (writeFailure.current && documentRef.current) {
      persist(documentRef.current);
      return;
    }
    try {
      const next = parseDemo(await AsyncStorage.getItem(DEMO_STORAGE_KEY));
      documentRef.current = next;
      show(next, true);
      writable.current = true;
      setError(null);
    } catch {
      writable.current = false;
      setError(
        "Demo kaydı okunamadı. Mevcut demo verisi korunuyor; yeni demo başlatma kapalı. Tek oyunculu kayıtların ayrı tutuluyor.",
      );
    } finally {
      setReady(true);
    }
  };
  useEffect(() => {
    void Promise.resolve().then(retry);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const dispatch = (event: DuelEvent) => {
    if (
      !ready ||
      !writable.current ||
      CONTENT_CHANNEL !== "prototype" ||
      !documentRef.current
    )
      return false;
    try {
      const next = appendDuelEvent(documentRef.current, event);
      if (next !== documentRef.current) accept(next);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Demo işlemi yapılamadı.");
      return false;
    }
  };
  useEffect(() => {
    const expire = () => {
      const doc = documentRef.current;
      if (!doc || !writable.current || CONTENT_CHANNEL !== "prototype") return;
      const current = restoreDemo(doc);
      if (!terminal(current.state) && Date.now() >= current.expiresAt)
        dispatch({ type: "expire", at: Date.now() });
    };
    expire();
    const timer = setInterval(expire, 1000);
    return () => clearInterval(timer);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  const act = (command: DuelCommand) =>
    dispatch({
      ...command,
      at:
        questionClock.current &&
        ["answer", "timeout", "next", "finish"].includes(command.type)
          ? Math.floor(questionClock.current.now())
          : Date.now(),
    });
  const create = () => {
    if (!ready || !writable.current || CONTENT_CHANNEL !== "prototype")
      return false;
    try {
      if (
        documentRef.current &&
        !terminal(restoreDemo(documentRef.current).state)
      )
        throw new Error("Önce mevcut demo maçı tamamla veya iptal et.");
      accept(
        createDemoDocument(Date.now(), documentRef.current?.seed.questionIds),
      );
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Demo başlatılamadı.");
      return false;
    }
  };
  return (
    <Context.Provider
      value={{
        match,
        questionClock: displayClock,
        ready,
        error,
        create,
        act,
        retry,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDuel() {
  const value = useContext(Context);
  if (!value) throw new Error("Demo maç sağlayıcısı bulunamadı.");
  return value;
}
