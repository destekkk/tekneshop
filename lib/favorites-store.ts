import { and, count, desc, eq, or } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { listings, userFavorites, type Listing, type UserFavorite } from "@/lib/db/schema";
import { getCsyProduct } from "@/lib/csy-products";

export type FavoriteKeys = {
  listingSlugs: Set<string>;
  productSlugs: Set<string>;
};

export type UserFavoriteItem = UserFavorite & {
  listing: Listing | null;
};

export async function getUserFavoriteKeys(userId: number): Promise<FavoriteKeys> {
  if (!isDbConfigured()) return { listingSlugs: new Set(), productSlugs: new Set() };
  try {
    const db = getDb();
    const rows = await db
      .select({
        listingSlug: userFavorites.listingSlug,
        productSlug: userFavorites.productSlug,
      })
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));
    return {
      listingSlugs: new Set(rows.map((r) => r.listingSlug).filter(Boolean) as string[]),
      productSlugs: new Set(rows.map((r) => r.productSlug).filter(Boolean) as string[]),
    };
  } catch {
    return { listingSlugs: new Set(), productSlugs: new Set() };
  }
}

export async function isListingFavorited(userId: number, listingSlug: string) {
  const keys = await getUserFavoriteKeys(userId);
  return keys.listingSlugs.has(listingSlug);
}

export async function isProductFavorited(userId: number, productSlug: string) {
  const keys = await getUserFavoriteKeys(userId);
  return keys.productSlugs.has(productSlug);
}

export async function getUserFavorites(userId: number): Promise<UserFavoriteItem[]> {
  if (!isDbConfigured()) return [];
  try {
    const db = getDb();
    const rows = await db
      .select({
        favorite: userFavorites,
        listing: listings,
      })
      .from(userFavorites)
      .leftJoin(listings, eq(listings.id, userFavorites.listingId))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
    return rows.map((r) => ({ ...r.favorite, listing: r.listing }));
  } catch {
    return [];
  }
}

export async function addListingFavorite(
  userId: number,
  listing: { id: number; slug: string },
) {
  const db = getDb();
  const existing = await db
    .select({ id: userFavorites.id })
    .from(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.listingId, listing.id)))
    .limit(1);
  if (existing[0]) return { added: false as const };

  await db.insert(userFavorites).values({
    userId,
    listingId: listing.id,
    listingSlug: listing.slug,
  });
  return { added: true as const };
}

export async function addProductFavorite(
  userId: number,
  productSlug: string,
  productName?: string,
) {
  const db = getDb();
  const existing = await db
    .select({ id: userFavorites.id })
    .from(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.productSlug, productSlug)))
    .limit(1);
  if (existing[0]) return { added: false as const };

  await db.insert(userFavorites).values({
    userId,
    productSlug,
    productName: productName || getCsyProduct(productSlug)?.name || productSlug,
  });
  return { added: true as const };
}

export async function removeListingFavorite(userId: number, listingSlug: string) {
  const db = getDb();
  await db
    .delete(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.listingSlug, listingSlug)));
}

export async function removeProductFavorite(userId: number, productSlug: string) {
  const db = getDb();
  await db
    .delete(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.productSlug, productSlug)));
}

export async function removeFavoriteById(userId: number, favoriteId: number) {
  const db = getDb();
  await db
    .delete(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.id, favoriteId)));
}

export async function getUserFavoriteCount(userId: number) {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const [row] = await db
      .select({ c: count() })
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));
    return row.c;
  } catch {
    return 0;
  }
}

export async function getFavoriteUserIdsForListing(listingId: number) {
  if (!isDbConfigured()) return [] as number[];
  const db = getDb();
  const rows = await db
    .select({ userId: userFavorites.userId })
    .from(userFavorites)
    .where(eq(userFavorites.listingId, listingId));
  return rows.map((r) => r.userId);
}
