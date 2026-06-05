import { and, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { ads, type Ad } from "@/lib/db/schema";

export type AdPlacement = "top_banner" | "inline_list";

const defaultTopAd = {
  title: "Tekne & marin ürünlerinizi burada öne çıkarın",
  subtitle: "Sponsorlu alan",
  linkUrl: "/ilan-ver",
  imageUrl: null as string | null,
};

const defaultInlineAd = {
  title: "İlanınızı öne çıkarın",
  subtitle: "Sponsorlu",
  linkUrl: "/ilan-ver",
};

function activeAdFilters() {
  const now = new Date();
  return and(
    eq(ads.active, true),
    or(isNull(ads.startsAt), lte(ads.startsAt, now)),
    or(isNull(ads.endsAt), gte(ads.endsAt, now)),
  );
}

export async function getActiveTopAd(): Promise<{
  href: string;
  imageSrc?: string;
  title: string;
  subtitle: string;
}> {
  if (!isDbConfigured()) return { ...defaultTopAd, href: defaultTopAd.linkUrl };
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(ads)
      .where(and(eq(ads.placement, "top_banner"), activeAdFilters()))
      .orderBy(desc(ads.priority))
      .limit(1);
    const ad = rows[0];
    if (!ad) return { ...defaultTopAd, href: defaultTopAd.linkUrl };
    return {
      href: ad.linkUrl,
      imageSrc: ad.imageUrl ?? undefined,
      title: ad.title,
      subtitle: ad.subtitle ?? "Sponsorlu alan",
    };
  } catch {
    return { ...defaultTopAd, href: defaultTopAd.linkUrl };
  }
}

export async function getActiveInlineAd(slot: number): Promise<{
  href: string;
  title: string;
  subtitle: string;
}> {
  if (!isDbConfigured()) return { ...defaultInlineAd, href: defaultInlineAd.linkUrl };
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(ads)
      .where(and(eq(ads.placement, "inline_list"), eq(ads.slot, slot), activeAdFilters()))
      .orderBy(desc(ads.priority))
      .limit(1);
    if (!rows[0]) {
      const fallback = await db
        .select()
        .from(ads)
        .where(and(eq(ads.placement, "inline_list"), activeAdFilters()))
        .orderBy(desc(ads.priority))
        .limit(1);
      const ad = fallback[0];
      if (!ad) return { ...defaultInlineAd, href: defaultInlineAd.linkUrl };
      return { href: ad.linkUrl, title: ad.title, subtitle: ad.subtitle ?? "Sponsorlu" };
    }
    return {
      href: rows[0].linkUrl,
      title: rows[0].title,
      subtitle: rows[0].subtitle ?? "Sponsorlu",
    };
  } catch {
    return { ...defaultInlineAd, href: defaultInlineAd.linkUrl };
  }
}

export async function getAllAds(): Promise<Ad[]> {
  if (!isDbConfigured()) return [];
  const db = getDb();
  return db.select().from(ads).orderBy(desc(ads.priority), desc(ads.createdAt));
}

export async function upsertAd(data: {
  id?: number;
  placement: AdPlacement;
  slot?: number | null;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl: string;
  active: boolean;
  priority: number;
  startsAt?: Date | null;
  endsAt?: Date | null;
}) {
  const db = getDb();
  if (data.id) {
    const [row] = await db
      .update(ads)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(ads.id, data.id))
      .returning();
    return row;
  }
  const [row] = await db.insert(ads).values(data).returning();
  return row;
}

export async function deleteAd(id: number) {
  const db = getDb();
  await db.delete(ads).where(eq(ads.id, id));
}

export async function seedDefaultAds() {
  const db = getDb();
  await db.insert(ads).values([
    {
      placement: "top_banner",
      title: defaultTopAd.title,
      subtitle: defaultTopAd.subtitle,
      linkUrl: "/ilan-ver",
      active: true,
      priority: 10,
    },
    {
      placement: "inline_list",
      slot: 1,
      title: defaultInlineAd.title,
      subtitle: defaultInlineAd.subtitle,
      linkUrl: "/ilan-ver",
      active: true,
      priority: 5,
    },
  ]);
}
