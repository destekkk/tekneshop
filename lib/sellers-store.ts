import { desc, eq, sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { listingSellers, listings, type ListingSeller } from "@/lib/db/schema";

export async function getListingSellers() {
  if (!isDbConfigured()) return [] as ListingSeller[];
  try {
    const db = getDb();
    return await db.select().from(listingSellers).orderBy(desc(listingSellers.updatedAt));
  } catch {
    return [];
  }
}

export async function getListingSellerCount() {
  const rows = await getListingSellers();
  return rows.length;
}

export async function createListingSeller(data: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  city?: string;
  notes?: string;
  active?: boolean;
}) {
  const db = getDb();
  const [row] = await db
    .insert(listingSellers)
    .values({
      name: data.name.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      company: data.company?.trim() || null,
      city: data.city?.trim() || null,
      notes: data.notes?.trim() || null,
      active: data.active ?? true,
    })
    .returning();
  return row;
}

export async function updateListingSeller(
  id: number,
  data: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    city?: string;
    notes?: string;
    active: boolean;
  },
) {
  const db = getDb();
  const [row] = await db
    .update(listingSellers)
    .set({
      name: data.name.trim(),
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      company: data.company?.trim() || null,
      city: data.city?.trim() || null,
      notes: data.notes?.trim() || null,
      active: data.active,
      updatedAt: new Date(),
    })
    .where(eq(listingSellers.id, id))
    .returning();
  return row;
}

export async function deleteListingSeller(id: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.delete(listingSellers).where(eq(listingSellers.id, id));
}

export async function syncSellersFromListings() {
  if (!isDbConfigured()) return { added: 0, total: 0 };
  const db = getDb();
  const rows = await db
    .select({
      name: listings.contactName,
      email: listings.contactEmail,
      phone: listings.contactPhone,
      city: listings.location,
    })
    .from(listings)
    .where(sql`${listings.contactName} IS NOT NULL AND ${listings.contactName} != ''`);

  let added = 0;
  const existing = await db.select().from(listingSellers);

  for (const row of rows) {
    if (!row.name) continue;
    const key = `${row.name}|${row.email || ""}|${row.phone || ""}`;
    const dup = existing.find(
      (s) => `${s.name}|${s.email || ""}|${s.phone || ""}` === key,
    );
    if (dup) continue;
    await createListingSeller({
      name: row.name,
      email: row.email || undefined,
      phone: row.phone || undefined,
      city: row.city || undefined,
    });
    added++;
  }

  const all = await db.select().from(listingSellers);
  return { added, total: all.length };
}
