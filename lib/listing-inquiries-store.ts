import { count, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { listingInquiries, type ListingInquiry } from "@/lib/db/schema";

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

export async function getListingInquiries() {
  if (!isDbConfigured()) return [] as ListingInquiry[];
  try {
    const db = getDb();
    return await db
      .select()
      .from(listingInquiries)
      .orderBy(desc(listingInquiries.createdAt));
  } catch {
    return [];
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

export async function markListingInquiryRead(id: number) {
  const db = getDb();
  await db.update(listingInquiries).set({ read: true }).where(eq(listingInquiries.id, id));
}

export async function deleteListingInquiry(id: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.delete(listingInquiries).where(eq(listingInquiries.id, id));
}
