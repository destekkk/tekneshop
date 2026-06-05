import { and, count, desc, eq, ilike, or } from "drizzle-orm";
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

function dbToBoat(row: Listing): BoatListing {
  return {
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
  if (!isDbConfigured()) return boatListings;
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(listings)
      .where(and(eq(listings.type, "boat"), eq(listings.status, "approved")))
      .orderBy(desc(listings.isFeatured), desc(listings.approvedAt), desc(listings.createdAt));
    if (rows.length === 0) return boatListings;
    return rows.map(dbToBoat);
  } catch {
    return boatListings;
  }
}

export async function getBoatBySlug(slug: string): Promise<BoatListing | undefined> {
  if (!isDbConfigured()) {
    return boatListings.find((b) => b.slug === slug);
  }
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(listings)
      .where(and(eq(listings.slug, slug), eq(listings.type, "boat"), eq(listings.status, "approved")))
      .limit(1);
    if (rows[0]) return dbToBoat(rows[0]);
    return boatListings.find((b) => b.slug === slug);
  } catch {
    return boatListings.find((b) => b.slug === slug);
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
}) {
  if (!isDbConfigured()) {
    return boatListings.map((b, i) => ({
      id: i + 1,
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
      isFeatured: Boolean(b.badge === "Vitrin"),
      rejectionReason: null,
      feePaid: false,
      feeAmount: 0,
      source: "seed",
      createdAt: new Date(),
      updatedAt: new Date(),
      approvedAt: new Date(),
    }));
  }
  const db = getDb();
  const filters = [];
  if (opts?.status) filters.push(eq(listings.status, opts.status));
  if (opts?.search) {
    const q = `%${opts.search}%`;
    filters.push(or(ilike(listings.title, q), ilike(listings.location, q), ilike(listings.slug, q))!);
  }
  return db
    .select()
    .from(listings)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(listings.createdAt));
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
    };
  }
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
  };
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

export async function createListing(data: NewListing) {
  const db = getDb();
  const [row] = await db.insert(listings).values(data).returning();
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

export async function seedListingsFromStatic() {
  const db = getDb();
  for (const boat of boatListings) {
    await db
      .insert(listings)
      .values({
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
