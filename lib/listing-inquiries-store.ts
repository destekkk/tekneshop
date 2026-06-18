import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import {
  listingInquiries,
  listingInquiryMessages,
  listings,
  type ListingInquiry,
} from "@/lib/db/schema";

export type OwnerListingInquiry = ListingInquiry & {
  listingSlug: string | null;
  canSellerReply?: boolean;
  latestMessage?: string;
};

export type InquiryTimelineEntry = {
  role: "buyer" | "seller";
  body: string;
  createdAt: Date;
};

export type BuyerInquiryConversation = {
  inquiryId: number | null;
  canBuyerReply: boolean;
  waitingForSeller: boolean;
  lastSellerMessage: string | null;
};

type InquiryAuthorRole = "buyer" | "seller";

async function getInquiryMessages(inquiryId: number) {
  const db = getDb();
  return db
    .select()
    .from(listingInquiryMessages)
    .where(eq(listingInquiryMessages.inquiryId, inquiryId))
    .orderBy(asc(listingInquiryMessages.createdAt));
}

export function buildInquiryTimeline(
  inquiry: ListingInquiry,
  messages: { authorRole: string; body: string; createdAt: Date }[],
): InquiryTimelineEntry[] {
  const timeline: InquiryTimelineEntry[] = [
    {
      role: "buyer",
      body: inquiry.message,
      createdAt: inquiry.createdAt,
    },
  ];
  for (const row of messages) {
    timeline.push({
      role: row.authorRole === "seller" ? "seller" : "buyer",
      body: row.body,
      createdAt: row.createdAt,
    });
  }
  return timeline;
}

function conversationFromTimeline(
  inquiryId: number | null,
  timeline: InquiryTimelineEntry[],
): BuyerInquiryConversation {
  if (timeline.length === 0) {
    return {
      inquiryId: null,
      canBuyerReply: true,
      waitingForSeller: false,
      lastSellerMessage: null,
    };
  }
  const last = timeline[timeline.length - 1];
  const lastSeller = [...timeline].reverse().find((m) => m.role === "seller");
  const canBuyerReply = last.role === "seller";
  return {
    inquiryId,
    canBuyerReply,
    waitingForSeller: !canBuyerReply,
    lastSellerMessage: lastSeller?.body ?? null,
  };
}

export async function getInquiryByListingAndSender(
  listingId: number,
  senderUserId: number,
  senderEmail?: string,
) {
  if (!isDbConfigured()) return null;
  try {
    const db = getDb();
    const [byUser] = await db
      .select()
      .from(listingInquiries)
      .where(
        and(
          eq(listingInquiries.listingId, listingId),
          eq(listingInquiries.senderUserId, senderUserId),
        ),
      )
      .orderBy(desc(listingInquiries.createdAt))
      .limit(1);
    if (byUser) return byUser;

    const email = senderEmail?.trim().toLowerCase();
    if (!email) return null;

    const [byEmail] = await db
      .select()
      .from(listingInquiries)
      .where(
        and(
          eq(listingInquiries.listingId, listingId),
          sql`LOWER(${listingInquiries.senderEmail}) = ${email}`,
        ),
      )
      .orderBy(desc(listingInquiries.createdAt))
      .limit(1);
    if (!byEmail) return null;

    if (!byEmail.senderUserId) {
      await db
        .update(listingInquiries)
        .set({ senderUserId })
        .where(eq(listingInquiries.id, byEmail.id));
      return { ...byEmail, senderUserId };
    }
    return byEmail;
  } catch {
    return null;
  }
}

export async function getBuyerInquiryConversation(
  listingId: number,
  senderUserId: number,
  senderEmail?: string,
) {
  if (!isDbConfigured()) {
    return {
      inquiryId: null,
      canBuyerReply: true,
      waitingForSeller: false,
      lastSellerMessage: null,
    } satisfies BuyerInquiryConversation;
  }

  const inquiry = await getInquiryByListingAndSender(listingId, senderUserId, senderEmail);
  if (!inquiry) {
    return conversationFromTimeline(null, []);
  }

  const messages = await getInquiryMessages(inquiry.id);
  return conversationFromTimeline(inquiry.id, buildInquiryTimeline(inquiry, messages));
}

export async function canSellerReplyToInquiry(inquiryId: number) {
  const inquiry = await getListingInquiryById(inquiryId);
  if (!inquiry) return false;
  const messages = await getInquiryMessages(inquiryId);
  const timeline = buildInquiryTimeline(inquiry, messages);
  return timeline[timeline.length - 1]?.role === "buyer";
}

export async function appendInquiryMessage(
  inquiryId: number,
  authorRole: InquiryAuthorRole,
  body: string,
) {
  const db = getDb();
  const [row] = await db
    .insert(listingInquiryMessages)
    .values({
      inquiryId,
      authorRole,
      body: body.trim(),
    })
    .returning();

  if (authorRole === "buyer") {
    await db
      .update(listingInquiries)
      .set({ read: false, buyerRead: true })
      .where(eq(listingInquiries.id, inquiryId));
  } else {
    await db
      .update(listingInquiries)
      .set({ buyerRead: false })
      .where(eq(listingInquiries.id, inquiryId));
  }

  return row;
}

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

    const result: OwnerListingInquiry[] = [];
    for (const r of rows) {
      const messages = await getInquiryMessages(r.inquiry.id);
      const timeline = buildInquiryTimeline(r.inquiry, messages);
      const canSellerReply = timeline[timeline.length - 1]?.role === "buyer";
      result.push({
        ...r.inquiry,
        listingSlug: r.listingSlug,
        canSellerReply,
        latestMessage: timeline[timeline.length - 1]?.body ?? r.inquiry.message,
      });
    }
    return result;
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
    const ids = unread.map((row) => row.id);
    if (ids.length === 0) return;
    await db.update(listingInquiries).set({ read: true }).where(inArray(listingInquiries.id, ids));
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
