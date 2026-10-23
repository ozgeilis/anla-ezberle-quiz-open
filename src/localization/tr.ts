import { brand } from "../branding/identity";
export const tr = {
  title: brand.title,
  subtitle: brand.subtitle,
  slogan: brand.slogan,
  draft: "Prototip · Taslak sorular",
  motivation: "Her soru yeni bir şey öğrenmek için fırsat.",
  tabs: [
    { label: "Ana Sayfa", href: "/", icon: "home" },
    { label: "Kategoriler", href: "/categories", icon: "grid" },
    { label: "Sıralama", href: "/ranking", icon: "bar-chart-2" },
    { label: "Rozetler", href: "/achievements", icon: "award" },
    { label: "Profil", href: "/profile", icon: "user" },
  ],
} as const;
