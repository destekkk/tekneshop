import { csyCategories, magazaHref } from "@/lib/csy-categories";
import type { NavItem, NavSection } from "@/lib/navigation-types";

export type { NavItem, NavSection } from "@/lib/navigation-types";

/** Tekne ilanları + CSY Marine mağaza kategorileri */
export const menuSections: NavSection[] = [
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
  ...csyCategories.map((cat) => ({
    id: cat.slug,
    label: cat.label,
    href: magazaHref(cat.slug),
    children: cat.children.map((sub) => ({
      label: sub.label,
      href: magazaHref(cat.slug, sub.slug),
    })),
  })),
];

export function findSectionByPath(pathname: string): NavSection | undefined {
  return menuSections.find(
    (s) => pathname === s.href || pathname.startsWith(`${s.href}/`),
  );
}
