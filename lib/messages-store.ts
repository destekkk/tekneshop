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
  const db = getDb();
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getUnreadMessageCount() {
  if (!isDbConfigured()) return 0;
  const db = getDb();
  const [row] = await db
    .select({ c: count() })
    .from(contactMessages)
    .where(eq(contactMessages.read, false));
  return row.c;
}

export async function markMessageRead(id: number) {
  const db = getDb();
  await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id));
}

export async function deleteMessage(id: number) {
  const db = getDb();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}
