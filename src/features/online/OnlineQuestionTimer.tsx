import React, { useMemo } from "react";
import { QuestionClock } from "../../domain/game/question-clock";
import { QuestionCountdown } from "../quiz/QuestionCountdown";
import type { OnlineMatch } from "./types";
/** Includes the entire request transit time conservatively; latency never
 * grants additional time. The server still decides whether a tap is late. */
export function OnlineQuestionTimer({
  match,
  onExpire,
}: {
  match: OnlineMatch;
  onExpire: () => void;
}) {
  const clock = useMemo(() => {
    const openedAt = Date.parse(match.questionOpenedAt!);
    const serverNow = Date.parse(match.serverNow!);
    return new QuestionClock(
      openedAt,
      undefined,
      Math.max(0, serverNow - openedAt),
      match.answerSeconds! * 1000,
      match.requestStartedAt,
    );
  }, [match]);
  return (
    <QuestionCountdown
      key={`${match.id}:${match.answers.length}`}
      clock={clock}
      stopped={false}
      onExpire={onExpire}
    />
  );
}
