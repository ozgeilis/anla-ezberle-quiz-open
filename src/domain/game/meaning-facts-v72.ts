// Selection-only equivalences reviewed against v71 and the v72 editorial candidates.
// Does not change historical question objects, option order, scoring or source evidence.
export const meaningFactAliasesV72: readonly (readonly string[])[] = [
  ["v12-general-005", "quran-meaning-v72-002"], // 2/153: patience and prayer
  ["v12-general-002", "quran-meaning-v72-009"], // 4/58: entrusting to those entitled/qualified
  ["v13-general-011", "quran-meaning-v72-011"], // 4/135: impartial witness
  ["v12-general-010", "quran-meaning-v72-012"], // 5/8: hostility cannot override justice
  ["v12-general-003", "quran-meaning-v72-022"], // 17/26–27: wastefulness
  ["v13-general-009", "quran-meaning-v72-026"], // 24/27: permission before entering
  ["v12-general-004", "quran-meaning-v72-029"], // 42/38: consultation
  ["v13-general-008", "quran-meaning-v72-030"], // 49/10: brotherhood and reconciliation
  ["v13-quran-008", "q65-isra-35", "q43-mutaffifin-1", "quran-meaning-v72-033"], // honest weights and measures
  ["v12-general-012", "quran-meaning-v72-031"], // reserve; never imported into gameplay
];
const aliases = new Map(
  meaningFactAliasesV72.flatMap((ids) =>
    ids.map((id) => [id, `fact:v72-meaning:${ids[0]}`] as const),
  ),
);
export function v72MeaningFactKey(id: string): string | undefined {
  return aliases.get(id);
}
