import type { BadgeState } from "../../domain/achievements/evaluate";

/** Visual labels never grant an award or change its eligibility. */
export function badgePresentation(badge: BadgeState) {
  if (badge.earned)
    return { label: "Kazanıldı", icon: "star", tone: "earned" } as const;
  if (badge.group === "seasonal" && !badge.available)
    return { label: "Yakında", icon: "lock", tone: "upcoming" } as const;
  return { label: "Kilitli", icon: "lock", tone: "locked" } as const;
}

export function badgeProgressCaption(badge: BadgeState): string {
  // Unsupported seasonal records must not display unrelated general counters.
  if (badge.group === "seasonal" && !badge.available)
    return "Bu set açıldığında başlayacak.";
  return badge.goals.map((g) => `${g.value}/${g.target}`).join(" · ");
}

export type CollectionFilter = "all" | "new" | "rare" | "earned";
/** These are collection views, never award/reward eligibility rules. */
export function matchesCollection(badge: BadgeState, filter: CollectionFilter) {
  switch (filter) {
    case "all":
      return true;
    case "earned":
      return badge.earned;
    case "new":
      return badge.available && !badge.earned && badge.fraction > 0;
    case "rare":
      return badge.tier === "gold" || badge.tier === "diamond";
  }
}
