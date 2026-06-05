import { and, asc, eq, isNull } from "drizzle-orm";
import { csyCategories, magazaHref } from "@/lib/csy-categories";
import { getDb, isDbConfigured } from "@/lib/db";
import { categories, type Category } from "@/lib/db/schema";
import type { NavItem, NavSection } from "@/lib/navigation-types";
import { staticMenuSections } from "@/lib/navigation-static";

export type CategoryTree = Category & { children: Category[] };

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildChildHref(parent: Category, child: Category): string {
  if (child.href) return child.href;
  if (parent.navType === "tekne") return `/tekne/${child.slug}`;
  if (parent.navType === "magaza") return magazaHref(parent.slug, child.slug);
  return child.href || "/";
}

function buildParentHref(parent: Category): string {
  if (parent.href) return parent.href;
  if (parent.navType === "tekne") return "/tekne";
  if (parent.navType === "magaza") return magazaHref(parent.slug);
  return parent.href || "/";
}

function rowsToNavSections(rows: Category[]): NavSection[] {
  const mains = rows.filter((r) => !r.parentId && r.active).sort((a, b) => a.sortOrder - b.sortOrder);
  return mains.map((main) => {
    const children = rows
      .filter((r) => r.parentId === main.id && r.active)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(
        (child): NavItem => ({
          label: child.label,
          href: buildChildHref(main, child),
        }),
      );
    return {
      id: main.slug,
      label: main.label,
      href: buildParentHref(main),
      featured: main.featured,
      children,
    };
  });
}

export async function getMenuSections(): Promise<NavSection[]> {
  if (!isDbConfigured()) return staticMenuSections;
  try {
    const db = getDb();
    const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    if (rows.length === 0) return staticMenuSections;
    return rowsToNavSections(rows);
  } catch {
    return staticMenuSections;
  }
}

export async function getCategoryTree(): Promise<CategoryTree[]> {
  if (!isDbConfigured()) {
    return staticMenuSections.map((s, i) => ({
      id: -(i + 1),
      slug: s.id,
      label: s.label,
      parentId: null,
      href: s.href,
      navType: s.id === "tekne" ? ("tekne" as const) : ("magaza" as const),
      sortOrder: i,
      active: true,
      featured: Boolean(s.featured),
      createdAt: new Date(),
      updatedAt: new Date(),
      children: s.children.map((c, j) => ({
        id: -(i + 1) * 100 - j,
        slug: c.href.split("/").pop() || `sub-${j}`,
        label: c.label,
        parentId: -(i + 1),
        href: c.href,
        navType: s.id === "tekne" ? ("tekne" as const) : ("magaza" as const),
        sortOrder: j,
        active: true,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    }));
  }
  const db = getDb();
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  const mains = rows.filter((r) => !r.parentId);
  return mains.map((main) => ({
    ...main,
    children: rows.filter((r) => r.parentId === main.id).sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

export async function getMainCategory(slug: string) {
  if (!isDbConfigured()) {
    return csyCategories.find((c) => c.slug === slug);
  }
  try {
    const db = getDb();
    const [main] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.slug, slug), isNull(categories.parentId), eq(categories.active, true)))
      .limit(1);
    if (!main || main.navType !== "magaza") {
      return csyCategories.find((c) => c.slug === slug);
    }
    const subs = await db
      .select()
      .from(categories)
      .where(and(eq(categories.parentId, main.id), eq(categories.active, true)))
      .orderBy(asc(categories.sortOrder));
    return {
      slug: main.slug,
      label: main.label,
      children: subs.map((s) => ({ slug: s.slug, label: s.label })),
    };
  } catch {
    return csyCategories.find((c) => c.slug === slug);
  }
}

export async function getSubCategory(mainSlug: string, subSlug: string) {
  const main = await getMainCategory(mainSlug);
  return main?.children.find((c) => c.slug === subSlug);
}

export async function createCategory(data: {
  label: string;
  slug?: string;
  parentId?: number | null;
  navType?: "tekne" | "magaza" | "custom";
  href?: string;
  sortOrder?: number;
  featured?: boolean;
}) {
  const db = getDb();
  const slug = data.slug || slugify(data.label);
  const [row] = await db
    .insert(categories)
    .values({
      label: data.label,
      slug,
      parentId: data.parentId ?? null,
      navType: data.navType ?? (data.parentId ? "magaza" : "magaza"),
      href: data.href,
      sortOrder: data.sortOrder ?? 0,
      featured: data.featured ?? false,
    })
    .returning();
  return row;
}

export async function updateCategory(
  id: number,
  data: Partial<{
    label: string;
    slug: string;
    href: string | null;
    sortOrder: number;
    active: boolean;
    featured: boolean;
  }>,
) {
  const db = getDb();
  const [row] = await db
    .update(categories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning();
  return row;
}

export async function deleteCategory(id: number) {
  const db = getDb();
  await db.delete(categories).where(eq(categories.parentId, id));
  await db.delete(categories).where(eq(categories.id, id));
}

export async function seedCategoriesFromStatic() {
  const db = getDb();
  const existing = await db.select().from(categories).limit(1);
  if (existing.length > 0) return;

  const [tekne] = await db
    .insert(categories)
    .values({
      slug: "tekne",
      label: "Tekne İlanları",
      navType: "tekne",
      featured: true,
      sortOrder: 0,
      href: "/tekne",
    })
    .returning();

  const tekneSubs = [
    ["sifir", "Sıfır Tekne"],
    ["ikinci-el", "İkinci El Tekne"],
    ["kiralik", "Günlük Kiralık"],
    ["motoryat", "Motoryat & Yat"],
    ["yelkenli", "Yelkenli & Katamaran"],
    ["sisme-bot", "Şişme Bot & Tender"],
    ["jet-ski", "Jet Ski & PWC"],
  ] as const;

  for (const [i, [slug, label]] of tekneSubs.entries()) {
    await db.insert(categories).values({
      slug,
      label,
      parentId: tekne.id,
      navType: "tekne",
      sortOrder: i,
    });
  }

  for (const [i, cat] of csyCategories.entries()) {
    const [main] = await db
      .insert(categories)
      .values({
        slug: cat.slug,
        label: cat.label,
        navType: "magaza",
        sortOrder: i + 1,
      })
      .returning();

    for (const [j, sub] of cat.children.entries()) {
      await db.insert(categories).values({
        slug: sub.slug,
        label: sub.label,
        parentId: main.id,
        navType: "magaza",
        sortOrder: j,
      });
    }
  }
}

export async function getMagazaCategorySlugs(): Promise<string[]> {
  if (!isDbConfigured()) return csyCategories.map((c) => c.slug);
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(categories)
      .where(and(isNull(categories.parentId), eq(categories.navType, "magaza"), eq(categories.active, true)));
    if (rows.length === 0) return csyCategories.map((c) => c.slug);
    return rows.map((r) => r.slug);
  } catch {
    return csyCategories.map((c) => c.slug);
  }
}

export async function getMagazaSubParams(): Promise<{ category: string; sub: string }[]> {
  const tree = await getCategoryTree();
  const params: { category: string; sub: string }[] = [];
  for (const main of tree) {
    if (main.navType !== "magaza") continue;
    for (const sub of main.children) {
      params.push({ category: main.slug, sub: sub.slug });
    }
  }
  if (params.length === 0) {
    return csyCategories.flatMap((c) => c.children.map((s) => ({ category: c.slug, sub: s.slug })));
  }
  return params;
}

export { slugify };
