import { desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb, isDbConfigured } from "@/lib/db";
import {
  accountingEntries,
  contactMessages,
  emailSubscribers,
  listings,
  type EmailSubscriber,
} from "@/lib/db/schema";

export type SubscriberSource = "listing" | "contact" | "accounting" | "manual" | "sync";

export const sourceLabels: Record<SubscriberSource, string> = {
  listing: "İlan veren",
  contact: "İletişim formu",
  accounting: "Muhasebe",
  manual: "Manuel",
  sync: "Senkron",
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function upsertSubscriber(opts: {
  email: string;
  name?: string;
  source: SubscriberSource;
}) {
  if (!isDbConfigured()) return null;
  const email = normalizeEmail(opts.email);
  if (!isValidEmail(email)) return null;

  const db = getDb();
  const existing = await db
    .select()
    .from(emailSubscribers)
    .where(eq(emailSubscribers.email, email))
    .limit(1);

  if (existing[0]) {
    if (!existing[0].subscribed) return existing[0];
    const updates: Partial<EmailSubscriber> = {};
    if (opts.name && !existing[0].name) updates.name = opts.name;
    if (Object.keys(updates).length) {
      await db.update(emailSubscribers).set(updates).where(eq(emailSubscribers.id, existing[0].id));
    }
    return existing[0];
  }

  const [row] = await db
    .insert(emailSubscribers)
    .values({
      email,
      name: opts.name || null,
      source: opts.source,
      unsubscribeToken: randomUUID(),
    })
    .returning();
  return row;
}

export async function syncSubscribersFromSources() {
  if (!isDbConfigured()) return { added: 0, total: 0 };

  const db = getDb();
  let added = 0;

  const listingEmails = await db
    .select({ email: listings.contactEmail, name: listings.contactName })
    .from(listings)
    .where(sql`${listings.contactEmail} IS NOT NULL AND ${listings.contactEmail} != ''`);

  for (const row of listingEmails) {
    if (!row.email) continue;
    const before = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, normalizeEmail(row.email))).limit(1);
    const result = await upsertSubscriber({ email: row.email, name: row.name || undefined, source: "listing" });
    if (result && before.length === 0) added++;
  }

  const contactEmails = await db.select({ email: contactMessages.email, name: contactMessages.name }).from(contactMessages);
  for (const row of contactEmails) {
    const before = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, normalizeEmail(row.email))).limit(1);
    const result = await upsertSubscriber({ email: row.email, name: row.name, source: "contact" });
    if (result && before.length === 0) added++;
  }

  const accountingEmails = await db
    .select({ email: accountingEntries.customerEmail, name: accountingEntries.customerName })
    .from(accountingEntries)
    .where(sql`${accountingEntries.customerEmail} IS NOT NULL AND ${accountingEntries.customerEmail} != ''`);

  for (const row of accountingEmails) {
    if (!row.email) continue;
    const before = await db.select().from(emailSubscribers).where(eq(emailSubscribers.email, normalizeEmail(row.email))).limit(1);
    const result = await upsertSubscriber({ email: row.email, name: row.name || undefined, source: "accounting" });
    if (result && before.length === 0) added++;
  }

  const [countRow] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(emailSubscribers)
    .where(eq(emailSubscribers.subscribed, true));

  return { added, total: countRow?.count ?? 0 };
}

export async function getSubscribers(opts?: { subscribedOnly?: boolean }) {
  if (!isDbConfigured()) return [] as EmailSubscriber[];
  const db = getDb();
  if (opts?.subscribedOnly) {
    return db
      .select()
      .from(emailSubscribers)
      .where(eq(emailSubscribers.subscribed, true))
      .orderBy(desc(emailSubscribers.createdAt));
  }
  return db.select().from(emailSubscribers).orderBy(desc(emailSubscribers.createdAt));
}

export async function getSubscriberStats() {
  if (!isDbConfigured()) return { total: 0, active: 0, unsubscribed: 0 };
  const db = getDb();
  const rows = await db.select().from(emailSubscribers);
  return {
    total: rows.length,
    active: rows.filter((r) => r.subscribed).length,
    unsubscribed: rows.filter((r) => !r.subscribed).length,
  };
}

export async function unsubscribeByToken(token: string) {
  if (!isDbConfigured()) return false;
  const db = getDb();
  const [row] = await db
    .select()
    .from(emailSubscribers)
    .where(eq(emailSubscribers.unsubscribeToken, token))
    .limit(1);
  if (!row) return false;
  if (!row.subscribed) return true;
  await db
    .update(emailSubscribers)
    .set({ subscribed: false, unsubscribedAt: new Date() })
    .where(eq(emailSubscribers.id, row.id));
  return true;
}

export async function deleteSubscriber(id: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.delete(emailSubscribers).where(eq(emailSubscribers.id, id));
}

export async function getActiveRecipients() {
  const subs = await getSubscribers({ subscribedOnly: true });
  return subs.map((s) => ({ email: s.email, unsubscribeToken: s.unsubscribeToken }));
}
