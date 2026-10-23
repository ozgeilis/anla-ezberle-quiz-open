/** Reviewed overlaps used only when selecting new rounds; never rewrites saved games. */
export const sourceAuditConceptGroups: readonly (readonly string[])[] = [
  ["general-002", "e150-general-004"],
  ["general-006", "e150-general-005", "v12-general-009"],
  ["general-007", "v12-general-008"],
  ["general-012", "v13-general-003"],
  ["v7-general-002", "v13-general-002"],
  ["v7-general-003", "v13-general-005"],
  ["pilot-history-003", "e150-history-025"],
  ["quran-009", "e150-general-031"],
  ["general-004", "e150-general-007"],
  ["e150-prophets-004", "v11-prophets-001"],
  ["e150-prophets-007", "v11-prophets-002"],
  ["e150-prophets-008", "v11-prophets-003"],
  ["e150-prophets-018", "v11-prophets-006"],
  ["e150-prophets-030", "v11-prophets-008", "learn-dua-011"],
  ["e150-prophets-023", "v10-prophets-008"],
  ["e150-prophets-025", "v12-prophets-013"],
  ["e150-prophets-036", "v11-prophets-012"],
];
const aliases = new Map(sourceAuditConceptGroups.flatMap((ids) =>
  ids.map((id) => [id, `fact:source-audit:${ids[0]}`] as const),
));
export function sourceAuditConceptKey(id: string): string | undefined {
  return aliases.get(id);
}
