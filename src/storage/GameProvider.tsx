import { QuestionClock } from "../domain/game/question-clock";
import { GameStage } from "../domain/game/stages";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistChange } from "./persist";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CategoryId, Difficulty, CONTENT_CHANNEL } from "../content/questions";
import type { LearningTopicId } from "../content/questions/learning-topics-v1";
import {
  categoryForTopic,
  type PlayCategoryId,
} from "../domain/game/play-categories";
import {
  advanceQuestion,
  answerQuestion,
  expireQuestion,
  createSession,
  finishSession,
  GameRecord,
  Mode,
  Session,
} from "../domain/game/engine";
import {
  appendGame,
  emptyData,
  parseData,
  Profile,
  STORAGE_KEY,
  StoredData,
} from "./schema";

interface GameContext {
  data: StoredData;
  ready: boolean;
  storageError: string | null;
  session: Session | null;
  result: GameRecord | null;
  saving: boolean;
  start: (
    mode?: Mode,
    focus?: CategoryId,
    difficulty?: Difficulty,
    learningTopic?: LearningTopicId,
    stage?: GameStage,
    options?: { playCategory?: PlayCategoryId; allowReplay?: boolean },
  ) => boolean;
  startError: string | null;
  questionClock: QuestionClock | null;
  openQuestion: (id: string, cursor: number) => void;
  expire: () => void;
  answer: (option: number) => void;
  next: () => void;
  abandon: () => void;
  finish: () => Promise<void>;
  saveResult: () => Promise<void>;
  updateShowcase: (ids: string[]) => Promise<boolean>;
  updateProfile: (profile: Partial<Profile>) => Promise<boolean>;
  retryRead: () => Promise<void>;
}
const Context = createContext<GameContext | null>(null);
const LibraryContext = createContext<{
  data: StoredData;
  start: GameContext["start"];
} | null>(null);
const DisplayContext = createContext<{
  profile: Profile;
  ready: boolean;
} | null>(null);
export function GameProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<StoredData>(emptyData);
  const dataRef = useRef(data);
  const [startError, setStartError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const writable = useRef(false);
  const [session, setSession] = useState<Session | null>(null);
  const clockRef = useRef<QuestionClock | null>(null);
  const [questionClock, setQuestionClock] = useState<QuestionClock | null>(
    null,
  );
  const sessionRef = useRef<Session | null>(null);
  const [result, setResult] = useState<GameRecord | null>(null);
  const resultRef = useRef<GameRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const queue = useRef(Promise.resolve());
  const retryRead = useCallback(async () => {
    try {
      const loaded = parseData(await AsyncStorage.getItem(STORAGE_KEY));
      dataRef.current = loaded;
      setData(loaded);
      writable.current = true;
      setStorageError(null);
    } catch {
      writable.current = false;
      setStorageError(
        "Yerel kayıt okunamadı. Mevcut veri korunuyor; puan ve profil kaydı kapalı.",
      );
    } finally {
      setReady(true);
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(retryRead);
  }, [retryRead]);
  const commit = useCallback(
    (transform: (current: StoredData) => StoredData): Promise<boolean> => {
      let success = false;
      const task = queue.current.then(async () => {
        if (!writable.current) return;
        try {
          const next = await persistChange(
            dataRef.current,
            transform,
            (value) => AsyncStorage.setItem(STORAGE_KEY, value),
          );
          dataRef.current = next;
          setData(next);
          setStorageError(null);
          success = true;
        } catch {
          setStorageError(
            "Kayıt tamamlanamadı. Önceki verin korundu; yeniden kaydetmeyi deneyebilirsin.",
          );
        }
      });
      queue.current = task.catch(() => {});
      return task.then(() => success);
    },
    [],
  );
  const setCurrent = useCallback((value: Session | null) => {
    if (value?.timingVersion === 1 && value.questionOpenedAt !== undefined) {
      if (
        !clockRef.current ||
        value.id !== sessionRef.current?.id ||
        value.cursor !== sessionRef.current?.cursor
      ) {
        clockRef.current = new QuestionClock(value.questionOpenedAt);
        setQuestionClock(clockRef.current);
      }
    } else {
      clockRef.current = null;
      setQuestionClock(null);
    }
    sessionRef.current = value;
    setSession(value);
  }, []);
  const start = useCallback(
    (
      mode: Mode = "mixed",
      focus?: CategoryId,
      difficulty?: Difficulty,
      learningTopic?: LearningTopicId,
      stage?: GameStage,
      options?: { playCategory?: PlayCategoryId; allowReplay?: boolean },
    ) => {
      if (!ready || sessionRef.current) return false;
      if (
        !writable.current ||
        (resultRef.current &&
          !dataRef.current.games.some((g) => g.id === resultRef.current!.id))
      ) {
        setStartError(
          "Önce kayıtlarını yükle veya son yarışmanı yeniden kaydet. Soru geçmişin güvenle okunmadan yeni tur başlatılamaz.",
        );
        return false;
      }
      try {
        const created = createSession(mode, focus, Date.now(), {
          timed: true,
          channel: CONTENT_CHANNEL,
          difficulty,
          playCategory:
            options?.playCategory ??
            (learningTopic ? categoryForTopic(learningTopic) : undefined),
          stage,
          history: dataRef.current.games,
          allowReplay: options?.allowReplay,
        });
        resultRef.current = null;
        setResult(null);
        setStartError(null);
        delete created.questionOpenedAt;
        setCurrent(created);
        return true;
      } catch (error) {
        setStartError(
          error instanceof Error ? error.message : "Yarışma başlatılamadı.",
        );
        return false;
      }
    },
    [ready, setCurrent],
  );
  const openQuestion = useCallback(
    (id: string, cursor: number) => {
      const current = sessionRef.current;
      if (
        !current ||
        current.id !== id ||
        current.cursor !== cursor ||
        current.timingVersion !== 1 ||
        current.questionOpenedAt !== undefined ||
        current.answers.some(
          (a) => a.questionId === current.questionIds[cursor],
        )
      )
        return;
      setCurrent({
        ...current,
        questionOpenedAt: Math.max(
          Date.now(),
          current.answers.at(-1)?.at ?? current.startedAt,
        ),
      });
    },
    [setCurrent],
  );
  const answer = (option: number) => {
    if (sessionRef.current)
      setCurrent(
        answerQuestion(
          sessionRef.current,
          option,
          clockRef.current ? Math.floor(clockRef.current.now()) : Date.now(),
        ),
      );
  };
  const expire = () => {
    if (sessionRef.current && clockRef.current)
      setCurrent(
        expireQuestion(sessionRef.current, Math.floor(clockRef.current.now())),
      );
  };
  const next = () => {
    const current = sessionRef.current;
    if (!current) return;
    const next = advanceQuestion(
      current,
      clockRef.current ? Math.floor(clockRef.current.now()) : Date.now(),
    );
    if (next === current) return;
    if (next.timingVersion === 1) delete next.questionOpenedAt;
    setCurrent(next);
  };
  const abandon = () => setCurrent(null);
  const saveResult = async () => {
    const completed = resultRef.current;
    if (!completed) return;
    setSaving(true);
    await commit((current) => appendGame(current, completed));
    setSaving(false);
  };
  const finish = async () => {
    if (!sessionRef.current) return;
    const completed = finishSession(sessionRef.current);
    resultRef.current = completed;
    setResult(completed);
    setCurrent(null);
    setSaving(true);
    await commit((current) => appendGame(current, completed));
    setSaving(false);
  };
  const updateProfile = (profile: Partial<Profile>) =>
    commit((current) => ({
      ...current,
      profile: { ...current.profile, ...profile },
    }));
  const display = useMemo(
    () => ({ profile: data.profile, ready }),
    [data.profile, ready],
  );
  const library = useMemo(() => ({ data, start }), [data, start]);
  return (
    <LibraryContext.Provider value={library}>
      <DisplayContext.Provider value={display}>
        <Context.Provider
          value={{
            data,
            ready,
            storageError,
            session,
            result,
            saving,
            start,
            startError,
            questionClock,
            openQuestion,
            expire,
            answer,
            next,
            abandon,
            finish,
            saveResult,
            updateProfile,
            updateShowcase: (showcase) =>
              commit((current) => ({ ...current, showcase })),
            retryRead,
          }}
        >
          {children}
        </Context.Provider>
      </DisplayContext.Provider>
    </LibraryContext.Provider>
  );
}
export function useGame() {
  const value = useContext(Context);
  if (!value) throw new Error("Oyun sağlayıcısı bulunamadı.");
  return value;
}

export function useGameDisplay() {
  const value = useContext(DisplayContext);
  if (!value) throw Error("Oyun sağlayıcısı bulunamadı.");
  return value;
}

export function useGameLibrary() {
  const value = useContext(LibraryContext);
  if (!value) throw Error("Oyun sağlayıcısı bulunamadı.");
  return value;
}
