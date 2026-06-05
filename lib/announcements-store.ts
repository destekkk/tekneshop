import { and, asc, desc, eq, isNull, lte, gte, or } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { announcements } from "@/lib/db/schema";

export async function getActiveAnnouncements() {
  if (!isDbConfigured()) return [];
  try {
    const db = getDb();
    const now = new Date();
    return db
      .select()
      .from(announcements)
      .where(
        and(
          eq(announcements.active, true),
          or(isNull(announcements.startsAt), lte(announcements.startsAt, now)),
          or(isNull(announcements.endsAt), gte(announcements.endsAt, now)),
        ),
      )
      .orderBy(asc(announcements.sortOrder));
  } catch {
    return [];
  }
}

export async function getAllAnnouncements() {
  if (!isDbConfigured()) return [];
  const db = getDb();
  return db.select().from(announcements).orderBy(desc(announcements.active), asc(announcements.sortOrder));
}

export async function upsertAnnouncement(data: {
  id?: number;
  message: string;
  linkUrl?: string;
  linkLabel?: string;
  tone?: string;
  active?: boolean;
  sortOrder?: number;
}) {
  const db = getDb();
  if (data.id) {
    const [row] = await db
      .update(announcements)
      .set(data)
      .where(eq(announcements.id, data.id))
      .returning();
    return row;
  }
  const [row] = await db.insert(announcements).values(data).returning();
  return row;
}

export async function deleteAnnouncement(id: number) {
  const db = getDb();
  await db.delete(announcements).where(eq(announcements.id, id));
}
