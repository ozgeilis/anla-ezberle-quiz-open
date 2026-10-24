import { useEffect, useEffectEvent, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import {
  ANSWER_FEEDBACK_MS,
  FeedbackTransition,
} from "../../domain/game/feedback-transition";

const foreground = () =>
  AppState.currentState === "active" &&
  (Platform.OS !== "web" || document.visibilityState !== "hidden");

export function useFeedbackAdvance(
  key: string | null,
  blocked: boolean,
  advance: () => void,
) {
  const [active, setActive] = useState(foreground);
  const onAdvance = useEffectEvent(advance);
  const gate = useRef(new FeedbackTransition());
  useEffect(() => {
    const update = () => setActive(foreground());
    const listener = AppState.addEventListener("change", update);
    if (Platform.OS === "web")
      document.addEventListener("visibilitychange", update);
    return () => {
      listener.remove();
      if (Platform.OS === "web")
        document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (!key) return;
    const take = gate.current.arm(key, blocked || !active);
    if (!take) return;
    const timer = setTimeout(() => {
      // Recheck actual visibility: a delayed native/JS event must not skip feedback.
      if (foreground() && take()) onAdvance();
    }, ANSWER_FEEDBACK_MS);
    const current = gate.current;
    return () => {
      clearTimeout(timer);
      current.cancel();
    };
  }, [key, blocked, active]);
}
