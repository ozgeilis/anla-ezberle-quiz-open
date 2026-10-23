/**
 * Read-only discovery of potential seasonal questions already in bank v31.
 * Text cues are for reviewer triage, NEVER autonomous classification or release.
 *
 * pnpm exec tsx scripts/audit-seasonal-candidates.ts
 */
import { mkdir, writeFile } from "node:fs/promises";
import { questions, BANK_VERSION } from "../src/content/questions";
import { assessDifficultyRound } from "../src/domain/game/engine";

const definitions = [
  {
    id: "kadir_gecesi",
    title: "Kadir Gecesi",
    terms: [/kadir geces/i, /kadr s[uû]res/i, /kadr\s*97\//i, /bin aydan/i],
  },
  {
    id: "ramazan_bayrami",
    title: "Ramazan Bayramı",
    terms: [/ramazan bayram/i, /f[iı]t[iı]r\s+sadakas/i, /fitre/i, /[şs]evval/i, /bayram namaz/i],
  },
  {
    id: "kurban_bayrami",
    title: "Kurban Bayramı",
    terms: [/kurban bayram/i, /kurban kes/i, /kurban ibadet/i, /zilhicce/i, /arefe/i, /[eî]yy[aâ]m-?[ıi]\s*te[sş]r/i],
  },
  {
    id: "hac_mevsimi",
    title: "Hac Mevsimi",
    terms: [/\bhac(c[ıi])?\b/i, /hacc[ıi]n/i, /tavaf/i, /arafat/i, /vakfe/i, /m[uü]zdelife/i, /mina\b/i, /ihram/i, /sa.y\b/i, /saf[aâ].{0,40}merve/i],
  },
  {
    id: "muharrem_asura",
    title: "Muharrem ve Aşure",
    terms: [/muharrem/i, /a[şs][uû]r[aâe]/i, /kerbel[aâ]/i, /h[uü]seyin.*şeh/i],
  },
] as const;

const difficultyLevels = ["easy", "medium", "hard"] as const;
function matchingTerms(q: (typeof questions)[number], patterns: readonly RegExp[]) {
  const prompt = q.question + " | " +
    (q.options.find(o => o.id === q.correctOptionId)?.text ?? "");
  const explanation = q.explanation;
  const inPrompt = patterns.filter(pattern => pattern.test(prompt)).map(p => p.source);
  const inExplanation = patterns.filter(pattern => pattern.test(explanation)).map(p => p.source);
  return { inPrompt, inExplanation };
}
async function main() {
  const entries = definitions.map(def => {
    const matches = questions.flatMap(q => {
      const evidence = matchingTerms(q, def.terms);
      if (!evidence.inPrompt.length && !evidence.inExplanation.length) return [];
      return [{
        id: q.id,
        question: q.question,
        answer: q.options.find(o => o.id === q.correctOptionId)?.text,
        difficulty: q.difficulty,
        reviewStatus: q.reviewStatus,
        conceptGroup: q.conceptGroup,
        sourceURLs: q.sources.map(s => s.url),
        sourcesMetadataSupported: q.sources.length > 0 && q.sources.every(s => s.checkStatus === "supported"),
        matchingPromptTerms: evidence.inPrompt,
        matchingExplanationTerms: evidence.inExplanation,
        confidence: evidence.inPrompt.length ? "prompt-mention" : "explanation-only",
        // Context may be coincidental. Relevance and fact checking need a human.
      }];
    });
    const strong = matches.filter(x => x.confidence === "prompt-mention");
    const independentByLevel = Object.fromEntries(difficultyLevels.map(level => [
      level, assessDifficultyRound(
        questions.filter(q => strong.some(m => m.id === q.id && m.sourcesMetadataSupported && m.reviewStatus === "approved")),
        level,
      ),
    ])) as Record<(typeof difficultyLevels)[number], ReturnType<typeof assessDifficultyRound>>;
    const conceptCollisions = [...new Set(strong.map(x => x.conceptGroup))]
      .map(group => ({ conceptGroup: group, ids: strong.filter(x => x.conceptGroup === group).map(x => x.id) }))
      .filter(group => group.ids.length > 1);
    return {
      id: def.id,
      title: def.title,
      candidateCount: matches.length,
      directMentionCount: strong.length,
      explanationOnlyCount: matches.length - strong.length,
      independentByLevel,
      conceptCollisions,
      candidates: matches,
      humanReviewRequired: true,
      publicationStatus: "draft",
    };
  });
  const report = {
    bankVersion: BANK_VERSION,
    bankCount: questions.length,
    scope: "Keyword candidate discovery; NOT religious scholarship, source verification, editorial selection or release permission",
    canPublish: false,
    collections: entries,
  };
  await mkdir("artifacts/special-collections-audit", {recursive: true});
  await writeFile("artifacts/special-collections-audit/seasonal-candidates.json", JSON.stringify(report,null,2)+"\n");
  for (const item of entries) {
    console.log(`${item.title}: ${item.directMentionCount} prompt mentions + ${item.explanationOnlyCount} explanation-only = ${item.candidateCount}; ` +
      difficultyLevels.map(level => `${level}=${item.independentByLevel[level].eligibleCount} (${item.independentByLevel[level].canStart ? "technically possible" : "insufficient"})`).join(", "));
    console.log("  Prompt IDs:",item.candidates.filter(q=>q.confidence==="prompt-mention").map(q=>q.id).join(", ")||"none");
  }
}
void main().catch((error: unknown) => {console.error(error);process.exitCode = 1;});
