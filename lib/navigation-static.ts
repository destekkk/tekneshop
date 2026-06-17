import { csyCategories, csySidebarHiddenSlugs, csySubHref, magazaHref } from "@/lib/csy-categories";
import type { NavSection } from "@/lib/navigation-types";

export const staticMenuSections: NavSection[] = [
  {
    id: "tekne",
    label: "Tekne İlanları",
    href: "/tekne",
    featured: true,
    children: [
      { label: "Sıfır Tekne", href: "/tekne/sifir" },
      { label: "İkinci El Tekne", href: "/tekne/ikinci-el" },
      { label: "Günlük Kiralık", href: "/tekne/kiralik" },
      { label: "Motoryat & Yat", href: "/tekne/motoryat" },
      { label: "Yelkenli & Katamaran", href: "/tekne/yelkenli" },
      { label: "Şişme Bot & Tender", href: "/tekne/sisme-bot" },
      { label: "Jet Ski & PWC", href: "/tekne/jet-ski" },
    ],
  },
  ...csyCategories
    .filter((cat) => !csySidebarHiddenSlugs.has(cat.slug))
    .map((cat) => ({
    id: cat.slug,
    label: cat.label,
    href: magazaHref(cat.slug),
    children: cat.children.map((sub) => ({
      label: sub.label,
      href: csySubHref(cat.slug, sub),
    })),
  })),
];
