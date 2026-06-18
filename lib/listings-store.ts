import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import type { ListingSortKey } from "@/lib/listing-filters";
import { filterListingsByTryPrice } from "@/lib/listing-filters";
import {
  listingPriceInTry,
  parseListingCurrency,
  type ListingCurrency,
} from "@/lib/listing-currency";
import { getTcmbRates } from "@/lib/tcmb-rates";
import {
  demoListingNumber,
  isValidListingNumber,
  randomListingNumberCandidate,
} from "@/lib/listing-number";
import {
  boatListings,
  type BoatCondition,
  type BoatListing,
  type BoatType,
  boatImagePath,
} from "@/lib/boats";
import { getDb, isDbConfigured } from "@/lib/db";
import { listings, type Listing, type NewListing } from "@/lib/db/schema";
import {
  notifyFavoritePriceChange,
  recordListingPrice,
} from "@/lib/price-history-store";

export type ListingStatus = "pending" | "approved" | "rejected" | "archived";

function staticBoatWithNumber(boat: BoatListing, index: number): BoatListing {
  return { ...boat, listingNumber: demoListingNumber(index + 1) };
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
    currency: (row.currency as ListingCurrency) || "TRY",
    year: row.year ?? new Date().getFullYear(),
    lengthM: row.lengthM ? parseFloat(row.lengthM) : 0,
    location: row.location ?? "",
    engine: row.engine ?? undefined,
    badge: row.badge ?? undefined,
    createdAt: row.createdAt,
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

export async function getListingById(id: number) {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    const [row] = await db.select().from(listings).where(eq(listings.id, id)).limit(1);
    return row || null;
  } catch {
    return null;
  }
}

export async function getBoatBySlug(slug: string): Promise<BoatListing | undefined> {
  const detail = await getApprovedBoatDetail(slug);
  return detail?.boat;
}

export async function getApprovedBoatDetail(
  slug: string,
): Promise<{ boat: BoatListing; listing: Listing | null } | undefined> {
  if (!isDbConfigured()) {
    const idx = boatListings.findIndex((b) => b.slug === slug);
    if (idx < 0) return undefined;
    return { boat: staticBoatWithNumber(boatListings[idx], idx), listing: null };
  }
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(listings)
      .where(
        and(eq(listings.slug, slug), eq(listings.type, "boat"), eq(listings.status, "approved")),
      )
      .limit(1);
    if (row) return { boat: dbToBoat(row), listing: row };
    const idx = boatListings.findIndex((b) => b.slug === slug);
    if (idx >= 0) return { boat: staticBoatWithNumber(boatListings[idx], idx), listing: null };
    return undefined;
  } catch {
    const idx = boatListings.findIndex((b) => b.slug === slug);
    if (idx >= 0) return { boat: staticBoatWithNumber(boatListings[idx], idx), listing: null };
    return undefined;
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

function sortAdminListings<T extends { price: number; currency?: string | null; createdAt: Date }>(
  rows: T[],
  sort?: ListingSortKey,
  rates?: { USD: number; EUR: number },
): T[] {
  const copy = [...rows];
  const tryPrice = (row: T) =>
    listingPriceInTry(row.price, parseListingCurrency(row.currency), rates);

  switch (sort) {
    case "tarih-eski":
      return copy.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    case "fiyat-artan":
      return copy.sort((a, b) => tryPrice(a) - tryPrice(b));
    case "fiyat-azalan":
      return copy.sort((a, b) => tryPrice(b) - tryPrice(a));
    default:
      return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export async function getAdminListings(opts?: {
  status?: ListingStatus;
  search?: string;
  boatType?: string;
  condition?: string;
  type?: "boat" | "product" | "service";
  priceMin?: number;
  priceMax?: number;
  sort?: ListingSortKey;
}) {
  const rates = await getTcmbRates();
  const priceBounds = { min: opts?.priceMin, max: opts?.priceMax };
  const priceSort =
    opts?.sort === "fiyat-artan" || opts?.sort === "fiyat-azalan" ? opts.sort : undefined;

  if (!isDbConfigured()) {
    let demo = boatListings.map((b, i) => ({
      id: i + 1,
      listingNumber: demoListingNumber(i + 1),
      slug: b.slug,
      type: "boat" as const,
      title: b.title,
      description: null,
      status: "approved" as const,
      condition: b.condition,
      boatType: b.boatType,
      price: b.price,
      currency: "TRY",
      year: b.year,
      lengthM: String(b.lengthM),
      location: b.location,
      engine: b.engine ?? null,
      brand: null,
      model: null,
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
    demo = filterListingsByTryPrice(demo, priceBounds, rates);
    return sortAdminListings(demo, opts?.sort, rates);
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

    const order = priceSort
      ? desc(listings.createdAt)
      : opts?.sort === "tarih-eski"
        ? asc(listings.createdAt)
        : desc(listings.createdAt);

    let rows = await db
      .select()
      .from(listings)
      .where(filters.length ? and(...filters) : undefined)
      .orderBy(order);

    rows = filterListingsByTryPrice(rows, priceBounds, rates);
    return sortAdminListings(rows, opts?.sort, rates);
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

export async function generateUniqueListingNumber() {
  const db = getDb();
  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = randomListingNumberCandidate();
    const [existing] = await db
      .select({ id: listings.id })
      .from(listings)
      .where(eq(listings.listingNumber, candidate))
      .limit(1);
    if (!existing) return candidate;
  }
  throw new Error("Benzersiz ilan numarası üretilemedi");
}

/** @deprecated Use generateUniqueListingNumber */
export async function nextListingNumber() {
  try {
    return await generateUniqueListingNumber();
  } catch {
    return randomListingNumberCandidate();
  }
}

export async function createListing(data: NewListing) {
  const db = getDb();
  let listingNumber = data.listingNumber;
  if (!listingNumber || !isValidListingNumber(listingNumber)) {
    try {
      listingNumber = await generateUniqueListingNumber();
    } catch {
      listingNumber = randomListingNumberCandidate();
    }
  }
  const [row] = await db
    .insert(listings)
    .values({ ...data, listingNumber })
    .returning();
  if (row) {
    await recordListingPrice(row.id, row.price, row.currency || "TRY", "create");
  }
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

export type ListingUpdateData = {
  title?: string;
  description?: string | null;
  condition?: string | null;
  boatType?: string | null;
  brand?: string | null;
  model?: string | null;
  price?: number;
  currency?: string;
  year?: number | null;
  lengthM?: string | null;
  location?: string | null;
  engine?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  showContactPhone?: boolean;
  image?: string;
  images?: string[];
};

export async function updateListing(id: number, data: ListingUpdateData) {
  const db = getDb();
  const existing = await getListingById(id);
  const [row] = await db
    .update(listings)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(listings.id, id))
    .returning();

  if (row && existing && data.price !== undefined && data.price !== existing.price) {
    await recordListingPrice(row.id, row.price, row.currency || "TRY", "admin_edit");
    await notifyFavoritePriceChange({
      listingId: row.id,
      listingTitle: row.title,
      listingSlug: row.slug,
      oldPrice: existing.price,
      newPrice: row.price,
      currency: row.currency || "TRY",
    });
  }

  return row;
}

export async function getAllListingsForExport() {
  if (!isDbConfigured()) return [];
  const db = getDb();
  return db.select().from(listings).orderBy(desc(listings.createdAt));
}

export async function seedListingsFromStatic() {
  const db = getDb();
  for (const boat of boatListings) {
    let listingNumber: number;
    try {
      listingNumber = await generateUniqueListingNumber();
    } catch {
      listingNumber = randomListingNumberCandidate();
    }
    await db
      .insert(listings)
      .values({
        listingNumber,
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
