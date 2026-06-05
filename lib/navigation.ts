import { getMenuSections as getMenuSectionsFromDb } from "@/lib/categories-store";
import { staticMenuSections } from "@/lib/navigation-static";
import type { NavItem, NavSection } from "@/lib/navigation-types";

export type { NavItem, NavSection } from "@/lib/navigation-types";

/** @deprecated Use getMenuSections() — sync fallback only */
export const menuSections: NavSection[] = staticMenuSections;

export async function getMenuSections(): Promise<NavSection[]> {
  return getMenuSectionsFromDb();
}

export function findSectionByPath(pathname: string, sections: NavSection[]): NavSection | undefined {
  return sections.find(
    (s) => pathname === s.href || pathname.startsWith(`${s.href}/`),
  );
}
