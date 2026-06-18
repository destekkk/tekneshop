import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { listingOffers, listings, users, type ListingOffer } from "@/lib/db/schema";

export type OfferStatus = "pending" | "accepted" | "rejected" | "withdrawn" | "countered";

export type OfferWithDetails = ListingOffer & {
  listingTitle: string | null;
  listingSlug: string | null;
  listingNumber: number | null;
  listingPrice: number | null;
  userName: string | null;
  userEmail: string | null;
  userPhone: string | null;
};

export type BuyerOfferWithDetails = ListingOffer & {
  listingTitle: string | null;
  listingSlug: string | null;
  listingNumber: number | null;
  listingPrice: number | null;
  listingContactName: string | null;
  listingContactPhone: string | null;
};

export async function getOffersForBuyer(userId: number) {
  if (!isDbConfigured()) return [] as BuyerOfferWithDetails[];
  try {
    const db = getDb();
    const rows = await db
      .select({
        offer: listingOffers,
        listingTitle: listings.title,
        listingSlug: listings.slug,
        listingNumber: listings.listingNumber,
        listingPrice: listings.price,
        listingContactName: listings.contactName,
        listingContactPhone: listings.contactPhone,
      })
      .from(listingOffers)
      .innerJoin(listings, eq(listingOffers.listingId, listings.id))
      .where(eq(listingOffers.userId, userId))
      .orderBy(desc(listingOffers.createdAt));

    return rows.map((r) => ({
      ...r.offer,
      listingTitle: r.listingTitle,
      listingSlug: r.listingSlug,
      listingNumber: r.listingNumber,
      listingPrice: r.listingPrice,
      listingContactName: r.listingContactName,
      listingContactPhone: r.listingContactPhone,
    }));
  } catch {
    return [];
  }
}

export async function getUnreadBuyerOfferCount(userId: number) {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const [row] = await db
      .select({ c: count() })
      .from(listingOffers)
      .where(
        and(
          eq(listingOffers.userId, userId),
          eq(listingOffers.buyerRead, false),
          inArray(listingOffers.status, ["accepted", "countered"]),
        ),
      );
    return row.c;
  } catch {
    return 0;
  }
}

/** @deprecated Use getUnreadBuyerOfferCount */
export async function getUnreadAcceptedOfferCountForBuyer(userId: number) {
  return getUnreadBuyerOfferCount(userId);
}

export async function markBuyerOffersRead(userId: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db
    .update(listingOffers)
    .set({ buyerRead: true, updatedAt: new Date() })
    .where(
      and(
        eq(listingOffers.userId, userId),
        eq(listingOffers.buyerRead, false),
        inArray(listingOffers.status, ["accepted", "countered"]),
      ),
    );
}

export async function getOfferForBuyer(offerId: number, userId: number) {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    const [row] = await db
      .select({
        offer: listingOffers,
        listingSlug: listings.slug,
      })
      .from(listingOffers)
      .innerJoin(listings, eq(listingOffers.listingId, listings.id))
      .where(and(eq(listingOffers.id, offerId), eq(listingOffers.userId, userId)))
      .limit(1);
    if (!row) return null;
    return { ...row.offer, listingSlug: row.listingSlug };
  } catch {
    return null;
  }
}

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

export async function setCounterOffer(
  id: number,
  data: { counterAmount: number; counterMessage?: string },
) {
  const db = getDb();
  const [row] = await db
    .update(listingOffers)
    .set({
      status: "countered",
      counterAmount: data.counterAmount,
      counterMessage: data.counterMessage?.trim() || null,
      counterAt: new Date(),
      buyerRead: false,
      updatedAt: new Date(),
    })
    .where(eq(listingOffers.id, id))
    .returning();
  return row;
}

export async function acceptCounterOffer(id: number, userId: number) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(listingOffers)
    .where(and(eq(listingOffers.id, id), eq(listingOffers.userId, userId)))
    .limit(1);
  if (!existing || existing.status !== "countered" || !existing.counterAmount) return null;

  const [row] = await db
    .update(listingOffers)
    .set({
      status: "accepted",
      amount: existing.counterAmount,
      buyerRead: true,
      updatedAt: new Date(),
    })
    .where(eq(listingOffers.id, id))
    .returning();
  return row;
}

export async function updateOfferStatus(
  id: number,
  status: OfferStatus,
  options?: { buyerRead?: boolean },
) {
  const db = getDb();
  const [row] = await db
    .update(listingOffers)
    .set({
      status,
      updatedAt: new Date(),
      ...(options?.buyerRead !== undefined ? { buyerRead: options.buyerRead } : {}),
    })
    .where(eq(listingOffers.id, id))
    .returning();
  return row;
}

export async function deleteOffer(id: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.delete(listingOffers).where(eq(listingOffers.id, id));
}
