import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { accountingEntries, type AccountingEntry } from "@/lib/db/schema";

export type AccountingType = "income" | "expense";
export type AccountingCategory =
  | "listing_fee"
  | "featured_fee"
  | "package_sale"
  | "ad_revenue"
  | "refund"
  | "bank_fee"
  | "tax"
  | "salary"
  | "other";

export const categoryLabels: Record<AccountingCategory, string> = {
  listing_fee: "İlan ücreti",
  featured_fee: "Vitrin ücreti",
  package_sale: "Paket satışı",
  ad_revenue: "Reklam geliri",
  refund: "İade",
  bank_fee: "Banka masrafı",
  tax: "Vergi",
  salary: "Maaş / gider",
  other: "Diğer",
};

export function formatMoney(tl: number) {
  return `${tl.toLocaleString("tr-TR")} ₺`;
}

export async function getAccountingEntries(opts?: {
  type?: AccountingType;
  status?: "pending" | "completed" | "cancelled";
  from?: string;
  to?: string;
}) {
  if (!isDbConfigured()) return [] as AccountingEntry[];
  const db = getDb();
  const filters = [];
  if (opts?.type) filters.push(eq(accountingEntries.type, opts.type));
  if (opts?.status) filters.push(eq(accountingEntries.status, opts.status));
  if (opts?.from) filters.push(gte(accountingEntries.entryDate, new Date(opts.from)));
  if (opts?.to) filters.push(lte(accountingEntries.entryDate, new Date(opts.to + "T23:59:59")));
  return db
    .select()
    .from(accountingEntries)
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(accountingEntries.entryDate), desc(accountingEntries.id));
}

export async function getAccountingSummary() {
  if (!isDbConfigured()) {
    return { income: 0, expense: 0, balance: 0, pending: 0, count: 0 };
  }
  const db = getDb();
  const rows = await db.select().from(accountingEntries).where(eq(accountingEntries.status, "completed"));
  const income = rows.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const expense = rows.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);
  const pendingRows = await db
    .select({ total: sql<number>`coalesce(sum(${accountingEntries.amount}), 0)` })
    .from(accountingEntries)
    .where(eq(accountingEntries.status, "pending"));
  return {
    income,
    expense,
    balance: income - expense,
    pending: Number(pendingRows[0]?.total ?? 0),
    count: rows.length,
  };
}

export async function createAccountingEntry(data: {
  type: AccountingType;
  category: AccountingCategory;
  amount: number;
  description: string;
  reference?: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  status?: "pending" | "completed" | "cancelled";
  entryDate?: Date;
}) {
  const db = getDb();
  const [row] = await db.insert(accountingEntries).values(data).returning();
  return row;
}

export async function updateAccountingStatus(id: number, status: "pending" | "completed" | "cancelled") {
  const db = getDb();
  const [row] = await db
    .update(accountingEntries)
    .set({ status, updatedAt: new Date() })
    .where(eq(accountingEntries.id, id))
    .returning();
  return row;
}

export async function deleteAccountingEntry(id: number) {
  const db = getDb();
  await db.delete(accountingEntries).where(eq(accountingEntries.id, id));
}
