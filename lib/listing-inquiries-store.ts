import { count, desc, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { listingInquiries, listings, type ListingInquiry } from "@/lib/db/schema";

export type OwnerListingInquiry = ListingInquiry & {
  listingSlug: string | null;
};

export async function createListingInquiry(data: {
  listingId: number;
  listingTitle?: string;
  senderUserId?: number;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}) {
  const db = getDb();
  const [row] = await db
    .insert(listingInquiries)
    .values({
      listingId: data.listingId,
      listingTitle: data.listingTitle?.trim() || null,
      senderUserId: data.senderUserId ?? null,
      senderName: data.senderName.trim(),
      senderEmail: data.senderEmail.trim().toLowerCase(),
      senderPhone: data.senderPhone?.trim() || null,
      message: data.message.trim(),
    })
    .returning();
  return row;
}

export async function getListingInquiryById(id: number) {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(listingInquiries)
      .where(eq(listingInquiries.id, id))
      .limit(1);
    return row || null;
  } catch {
    return null;
  }
}

export async function getListingInquiriesForOwner(ownerEmail: string) {
  if (!isDbConfigured()) return [] as OwnerListingInquiry[];
  try {
    const db = getDb();
    const email = ownerEmail.trim().toLowerCase();
    const rows = await db
      .select({
        inquiry: listingInquiries,
        listingSlug: listings.slug,
      })
      .from(listingInquiries)
      .innerJoin(listings, eq(listings.id, listingInquiries.listingId))
      .where(sql`LOWER(${listings.contactEmail}) = ${email}`)
      .orderBy(desc(listingInquiries.createdAt));
    return rows.map((r) => ({ ...r.inquiry, listingSlug: r.listingSlug }));
  } catch {
    return [];
  }
}

export async function reportListingInquiry(
  inquiryId: number,
  reporterUserId: number,
  reporterEmail: string,
  reason: string,
) {
  if (!isDbConfigured()) {
    return { ok: false as const, error: "Şikayet için veritabanı gerekli." };
  }

  const inquiry = await getListingInquiryById(inquiryId);
  if (!inquiry) {
    return { ok: false as const, error: "Mesaj bulunamadı." };
  }
  if (inquiry.reported) {
    return { ok: false as const, error: "Bu mesaj zaten şikayet edilmiş." };
  }

  const db = getDb();
  const [listing] = await db
    .select({ contactEmail: listings.contactEmail })
    .from(listings)
    .where(eq(listings.id, inquiry.listingId))
    .limit(1);

  const ownerEmail = listing?.contactEmail?.trim().toLowerCase();
  if (!ownerEmail || ownerEmail !== reporterEmail.trim().toLowerCase()) {
    return { ok: false as const, error: "Bu mesajı şikayet etme yetkiniz yok." };
  }

  await db
    .update(listingInquiries)
    .set({
      reported: true,
      reportReason: reason.trim(),
      reportedAt: new Date(),
      reportedByUserId: reporterUserId,
      read: false,
    })
    .where(eq(listingInquiries.id, inquiryId));

  return { ok: true as const };
}

export async function getListingInquiries() {
  if (!isDbConfigured()) return [] as ListingInquiry[];
  try {
    const db = getDb();
    return await db
      .select()
      .from(listingInquiries)
      .orderBy(desc(listingInquiries.reported), desc(listingInquiries.createdAt));
  } catch {
    return [];
  }
}

export async function getUnreadListingInquiryCountForOwner(ownerEmail: string) {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const email = ownerEmail.trim().toLowerCase();
    const [row] = await db
      .select({ c: count() })
      .from(listingInquiries)
      .innerJoin(listings, eq(listings.id, listingInquiries.listingId))
      .where(
        sql`LOWER(${listings.contactEmail}) = ${email} AND ${listingInquiries.read} = false`,
      );
    return row.c;
  } catch {
    return 0;
  }
}

export async function getListingInquiryCountForOwner(ownerEmail: string) {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const email = ownerEmail.trim().toLowerCase();
    const [row] = await db
      .select({ c: count() })
      .from(listingInquiries)
      .innerJoin(listings, eq(listings.id, listingInquiries.listingId))
      .where(sql`LOWER(${listings.contactEmail}) = ${email}`);
    return row.c;
  } catch {
    return 0;
  }
}

export async function markListingInquiriesReadForOwner(ownerEmail: string) {
  if (!isDbConfigured()) return;
  try {
    const db = getDb();
    const email = ownerEmail.trim().toLowerCase();
    const unread = await db
      .select({ id: listingInquiries.id })
      .from(listingInquiries)
      .innerJoin(listings, eq(listings.id, listingInquiries.listingId))
      .where(
        sql`LOWER(${listings.contactEmail}) = ${email} AND ${listingInquiries.read} = false`,
      );
    for (const row of unread) {
      await markListingInquiryRead(row.id);
    }
  } catch {
    // ignore
  }
}

export async function getUnreadListingInquiryCount() {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const [row] = await db
      .select({ c: count() })
      .from(listingInquiries)
      .where(eq(listingInquiries.read, false));
    return row.c;
  } catch {
    return 0;
  }
}

export async function getReportedListingInquiryCount() {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const [row] = await db
      .select({ c: count() })
      .from(listingInquiries)
      .where(eq(listingInquiries.reported, true));
    return row.c;
  } catch {
    return 0;
  }
}

export async function markListingInquiryRead(id: number) {
  const db = getDb();
  await db.update(listingInquiries).set({ read: true }).where(eq(listingInquiries.id, id));
}

export async function deleteListingInquiry(id: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.delete(listingInquiries).where(eq(listingInquiries.id, id));
}
