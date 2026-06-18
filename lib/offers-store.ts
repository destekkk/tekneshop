import { and, count, desc, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { listingOffers, listings, users, type ListingOffer } from "@/lib/db/schema";

export type OfferStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type OfferWithDetails = ListingOffer & {
  listingTitle: string | null;
  listingSlug: string | null;
  listingNumber: number | null;
  listingPrice: number | null;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
};

export async function getOffersForListingOwner(ownerEmail: string) {
  if (!isDbConfigured()) return [] as OfferWithDetails[];
  try {
    const db = getDb();
    const email = ownerEmail.trim().toLowerCase();
    const rows = await db
      .select({
        offer: listingOffers,
        listingTitle: listings.title,
        listingSlug: listings.slug,
        listingNumber: listings.listingNumber,
        listingPrice: listings.price,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
      })
      .from(listingOffers)
      .innerJoin(listings, eq(listingOffers.listingId, listings.id))
      .leftJoin(users, eq(listingOffers.userId, users.id))
      .where(sql`LOWER(${listings.contactEmail}) = ${email}`)
      .orderBy(desc(listingOffers.createdAt));

    return rows.map((r) => ({
      ...r.offer,
      listingTitle: r.listingTitle,
      listingSlug: r.listingSlug,
      listingNumber: r.listingNumber,
      listingPrice: r.listingPrice,
      userName: r.userName,
      userEmail: r.userEmail,
      userPhone: r.userPhone,
    }));
  } catch {
    return [];
  }
}

export async function getPendingOfferCountForOwner(ownerEmail: string) {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const email = ownerEmail.trim().toLowerCase();
    const [row] = await db
      .select({ c: count() })
      .from(listingOffers)
      .innerJoin(listings, eq(listingOffers.listingId, listings.id))
      .where(
        and(
          eq(listingOffers.status, "pending"),
          sql`LOWER(${listings.contactEmail}) = ${email}`,
        ),
      );
    return row.c;
  } catch {
    return 0;
  }
}

export async function getOfferForListingOwner(offerId: number, ownerEmail: string) {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    const email = ownerEmail.trim().toLowerCase();
    const [row] = await db
      .select({
        offer: listingOffers,
        listingSlug: listings.slug,
      })
      .from(listingOffers)
      .innerJoin(listings, eq(listingOffers.listingId, listings.id))
      .where(
        and(eq(listingOffers.id, offerId), sql`LOWER(${listings.contactEmail}) = ${email}`),
      )
      .limit(1);
    if (!row) return null;
    return { ...row.offer, listingSlug: row.listingSlug };
  } catch {
    return null;
  }
}

export async function getOffersWithDetails() {
  if (!isDbConfigured()) return [] as OfferWithDetails[];
  try {
    const db = getDb();
    const rows = await db
      .select({
        offer: listingOffers,
        listingTitle: listings.title,
        listingSlug: listings.slug,
        listingNumber: listings.listingNumber,
        listingPrice: listings.price,
        userName: users.name,
        userEmail: users.email,
        userPhone: users.phone,
      })
      .from(listingOffers)
      .leftJoin(listings, eq(listingOffers.listingId, listings.id))
      .leftJoin(users, eq(listingOffers.userId, users.id))
      .orderBy(desc(listingOffers.createdAt));

    return rows.map((r) => ({
      ...r.offer,
      listingTitle: r.listingTitle,
      listingSlug: r.listingSlug,
      listingNumber: r.listingNumber,
      listingPrice: r.listingPrice,
      userName: r.userName,
      userEmail: r.userEmail,
      userPhone: r.userPhone,
    }));
  } catch {
    return [];
  }
}

export async function getPendingOfferCount() {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const [row] = await db
      .select({ c: count() })
      .from(listingOffers)
      .where(eq(listingOffers.status, "pending"));
    return row.c;
  } catch {
    return 0;
  }
}

export async function getUserOfferForListing(userId: number, listingId: number) {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(listingOffers)
      .where(and(eq(listingOffers.userId, userId), eq(listingOffers.listingId, listingId)))
      .orderBy(desc(listingOffers.createdAt))
      .limit(1);
    return row || null;
  } catch {
    return null;
  }
}

export async function createOffer(data: {
  listingId: number;
  userId: number;
  amount: number;
  message?: string;
}) {
  const db = getDb();
  const [row] = await db
    .insert(listingOffers)
    .values({
      listingId: data.listingId,
      userId: data.userId,
      amount: data.amount,
      message: data.message?.trim() || null,
      status: "pending",
    })
    .returning();
  return row;
}

export async function updateOfferStatus(id: number, status: OfferStatus) {
  const db = getDb();
  const [row] = await db
    .update(listingOffers)
    .set({ status, updatedAt: new Date() })
    .where(eq(listingOffers.id, id))
    .returning();
  return row;
}

export async function deleteOffer(id: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.delete(listingOffers).where(eq(listingOffers.id, id));
}
