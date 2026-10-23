/** Persisted IDs are append-only. 0–3 retain their original artwork. */
export const avatarCatalog = [
  { id: 0, name: "Zümrüt Yolcu" },
  { id: 1, name: "Safir Yolcu" },
  { id: 2, name: "Mercan Yolcu" },
  { id: 3, name: "Yeşil Yolcu" },
  { id: 4, name: "Turkuaz Esinti" },
  { id: 5, name: "Gül Işığı" },
  { id: 6, name: "Safir Gülümseme" },
  { id: 7, name: "Altın Gün" },
  { id: 8, name: "Kestane Işıltı" },
  { id: 9, name: "Kıvırcık Neşe" },
  { id: 10, name: "Bakır Esinti" },
  { id: 11, name: "Gece Yıldızı" },
] as const;

export function isAvatarId(value: unknown): value is number {
  return avatarCatalog.some((avatar) => avatar.id === value);
}

export function avatarName(id: number) {
  return (
    avatarCatalog.find((avatar) => avatar.id === id)?.name ??
    avatarCatalog[0].name
  );
}
