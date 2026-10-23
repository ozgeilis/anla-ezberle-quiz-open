import type { Question } from "../model";
import { bankV20 } from "./bank-v20";
import { publishedNewQuestionsV21 } from "../published-v21";
/** Stable historic version chain; v20 original bank objects kept unchanged. */
export const bankV21: readonly Question[] = [...bankV20,...publishedNewQuestionsV21];
