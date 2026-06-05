import { count, desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export async function createContactMessage(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const db = getDb();
  const [row] = await db.insert(contactMessages).values(data).returning();
  return row;
}

export async function getContactMessages() {
  if (!isDbConfigured()) return [];
  try {
    const db = getDb();
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  } catch {
    return [];
  }
}

export async function getUnreadMessageCount() {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const [row] = await db
      .select({ c: count() })
      .from(contactMessages)
      .where(eq(contactMessages.read, false));
    return row.c;
  } catch {
    return 0;
  }
}

export async function markMessageRead(id: number) {
  const db = getDb();
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
}

export async function deleteMessage(id: number) {
  const db = getDb();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}
