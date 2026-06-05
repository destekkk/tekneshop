import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { LISTING_NUMBER_START } from "@/lib/listing-number";
import {
  boatListings,
  type BoatCondition,
  type BoatListing,
  type BoatType,
  boatImagePath,
} from "@/lib/boats";
import { getDb, isDbConfigured } from "@/lib/db";
import { listings, type Listing, type NewListing } from "@/lib/db/schema";

export type ListingStatus = "pending" | "approved" | "rejected" | "archived";

function staticBoatWithNumber(boat: BoatListing, index: number): BoatListing {
  return { ...boat, listingNumber: LISTING_NUMBER_START + index };
}

function dbToBoat(row: Listing): BoatListing {
  return {
    listingNumber: row.listingNumber ?? undefined,
    slug: row.slug,
    title: row.title,
    image: row.image,
    condition: (row.condition as BoatCondition) || "ikinci-el",
    boatType: (row.boatType as BoatType) || "motoryat",
    price: row.price,
    year: row.year ?? new Date().getFullYear(),
    lengthM: row.lengthM ? parseFloat(row.lengthM) : 0,
    location: row.location ?? "",
    engine: row.engine ?? undefined,
    badge: row.badge ?? undefined,
  };
}

export async function getApprovedBoatListings(): Promise<BoatListing[]> {
  if (!isDbConfigured()) return boatListings.map(staticBoatWithNumber);
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(listings)
      .where(and(eq(listings.type, "boat"), eq(listings.status, "approved")))
      .orderBy(desc(listings.isFeatured), desc(listings.approvedAt), desc(listings.createdAt));
    if (rows.length === 0) return boatListings.map(staticBoatWithNumber);
    return rows.map(dbToBoat);
  } catch {
    return boatListings.map(staticBoatWithNumber);
  }
}

export async function getListingBySlug(slug: string) {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    const [row] = await db.select().from(listings).where(eq(listings.slug, slug)).limit(1);
    return row || null;
  } catch {
    return null;
  }
}

export async function getBoatBySlug(slug: string): Promise<BoatListing | undefined> {
  if (!isDbConfigured()) {
    const idx = boatListings.findIndex((b) => b.slug === slug);
    return idx >= 0 ? staticBoatWithNumber(boatListings[idx], idx) : undefined;
  }
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(listings)
      .where(and(eq(listings.slug, slug), eq(listings.type, "boat"), eq(listings.status, "approved")))
      .limit(1);
    if (rows[0]) return dbToBoat(rows[0]);
    const idx = boatListings.findIndex((b) => b.slug === slug);
    return idx >= 0 ? staticBoatWithNumber(boatListings[idx], idx) : undefined;
  } catch {
    const idx = boatListings.findIndex((b) => b.slug === slug);
    return idx >= 0 ? staticBoatWithNumber(boatListings[idx], idx) : undefined;
  }
}

export async function filterApprovedBoats(opts: {
  condition?: BoatCondition;
  boatType?: BoatType;
}): Promise<BoatListing[]> {
  const all = await getApprovedBoatListings();
  return all.filter((b) => {
    if (opts.condition && b.condition !== opts.condition) return false;
    if (opts.boatType && b.boatType !== opts.boatType) return false;
    return true;
  });
}

export async function getAdminListings(opts?: {
  status?: ListingStatus;
  search?: string;
  boatType?: string;
  condition?: string;
  type?: "boat" | "product" | "service";
}) {
  if (!isDbConfigured()) {
    let demo = boatListings.map((b, i) => ({
      id: i + 1,
      listingNumber: LISTING_NUMBER_START + i,
      slug: b.slug,
      type: "boat" as const,
      title: b.title,
      description: null,
      status: "approved" as const,
      condition: b.condition,
      boatType: b.boatType,
      price: b.price,
      year: b.year,
      lengthM: String(b.lengthM),
      location: b.location,
      engine: b.engine ?? null,
      badge: b.badge ?? null,
      image: b.image,
      images: [],
      contactName: null,
      contactEmail: null,
      contactPhone: null,
      showContactPhone: false,
      isFeatured: Boolean(b.badge === "Vitrin"),
      rejectionReason: null,
      adminNotes: null,
      feePaid: false,
      feeAmount: 0,
      source: "seed",
      createdAt: new Date(),
      updatedAt: new Date(),
      approvedAt: new Date(),
    }));
    if (opts?.status) demo = demo.filter((r) => r.status === opts.status);
    if (opts?.boatType) demo = demo.filter((r) => r.boatType === opts.boatType);
    if (opts?.condition) demo = demo.filter((r) => r.condition === opts.condition);
    if (opts?.type) demo = demo.filter((r) => r.type === opts.type);
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      demo = demo.filter((r) => {
        if (/^\d+$/.test(q) && String(r.listingNumber).includes(q)) return true;
        return (
          r.title.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          (r.location || "").toLowerCase().includes(q)
        );
      });
    }
    return demo;
  }
  try {
    const db = getDb();
    const filters = [];
    if (opts?.status) filters.push(eq(listings.status, opts.status));
    if (opts?.boatType) filters.push(eq(listings.boatType, opts.boatType));
    if (opts?.condition) filters.push(eq(listings.condition, opts.condition));
    if (opts?.type) filters.push(eq(listings.type, opts.type));
    if (opts?.search) {
      const raw = opts.search.trim();
      const q = `%${raw}%`;
      if (/^\d+$/.test(raw)) {
        filters.push(
          or(
            ilike(listings.title, q),
            ilike(listings.location, q),
            ilike(listings.slug, q),
            eq(listings.listingNumber, Number(raw)),
          )!,
        );
      } else {
        filters.push(or(ilike(listings.title, q), ilike(listings.location, q), ilike(listings.slug, q))!);
      }
    }
    return await db
      .select()
      .from(listings)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(desc(listings.createdAt));
  } catch {
    return [];
  }
}

export async function getAdminStats() {
  if (!isDbConfigured()) {
    return {
      total: boatListings.length,
      pending: 0,
      approved: boatListings.length,
      rejected: 0,
      featured: boatListings.filter((b) => b.badge === "Vitrin").length,
      dbConnected: false,
      dbError: false,
    };
  }
  try {
    const db = getDb();
    const [total] = await db.select({ c: count() }).from(listings);
    const [pending] = await db
      .select({ c: count() })
      .from(listings)
      .where(eq(listings.status, "pending"));
    const [approved] = await db
      .select({ c: count() })
      .from(listings)
      .where(eq(listings.status, "approved"));
    const [rejected] = await db
      .select({ c: count() })
      .from(listings)
      .where(eq(listings.status, "rejected"));
    const [featured] = await db
      .select({ c: count() })
      .from(listings)
      .where(eq(listings.isFeatured, true));

    return {
      total: total.c,
      pending: pending.c,
      approved: approved.c,
      rejected: rejected.c,
      featured: featured.c,
      dbConnected: true,
      dbError: false,
    };
  } catch {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      featured: 0,
      dbConnected: true,
      dbError: true,
    };
  }
}

export function slugify(text: string) {
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

export async function nextListingNumber() {
  try {
    const db = getDb();
    const [row] = await db
      .select({
        next: sql<number>`COALESCE(MAX(${listings.listingNumber}), ${LISTING_NUMBER_START - 1}) + 1`,
      })
      .from(listings);
    return row?.next ?? LISTING_NUMBER_START;
  } catch {
    return LISTING_NUMBER_START;
  }
}

export async function createListing(data: NewListing) {
  const db = getDb();
  let listingNumber = data.listingNumber;
  if (!listingNumber) {
    try {
      listingNumber = await nextListingNumber();
    } catch {
      listingNumber = undefined;
    }
  }
  const [row] = await db
    .insert(listings)
    .values(listingNumber ? { ...data, listingNumber } : data)
    .returning();
  return row;
}

export async function updateListingStatus(
  id: number,
  status: ListingStatus,
  extra?: { rejectionReason?: string; isFeatured?: boolean },
) {
  const db = getDb();
  const [row] = await db
    .update(listings)
    .set({
      status,
      rejectionReason: extra?.rejectionReason,
      isFeatured: extra?.isFeatured,
      approvedAt: status === "approved" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(listings.id, id))
    .returning();
  return row;
}

export async function deleteListing(id: number) {
  const db = getDb();
  await db.delete(listings).where(eq(listings.id, id));
}

export async function bulkApprovePending() {
  const db = getDb();
  return db
    .update(listings)
    .set({ status: "approved", approvedAt: new Date(), updatedAt: new Date() })
    .where(eq(listings.status, "pending"))
    .returning();
}

export async function updateListingAdminNotes(id: number, notes: string) {
  const db = getDb();
  const [row] = await db
    .update(listings)
    .set({ adminNotes: notes, updatedAt: new Date() })
    .where(eq(listings.id, id))
    .returning();
  return row;
}

export async function getAllListingsForExport() {
  if (!isDbConfigured()) return [];
  const db = getDb();
  return db.select().from(listings).orderBy(desc(listings.createdAt));
}

export async function seedListingsFromStatic() {
  const db = getDb();
  let num = LISTING_NUMBER_START;
  for (const boat of boatListings) {
    await db
      .insert(listings)
      .values({
        listingNumber: num++,
        slug: boat.slug,
        type: "boat",
        title: boat.title,
        status: "approved",
        condition: boat.condition,
        boatType: boat.boatType,
        price: boat.price,
        year: boat.year,
        lengthM: String(boat.lengthM),
        location: boat.location,
        engine: boat.engine,
        badge: boat.badge,
        image: boat.image,
        isFeatured: boat.badge === "Vitrin",
        approvedAt: new Date(),
        source: "seed",
      })
      .onConflictDoNothing();
  }
}

export { boatImagePath };
