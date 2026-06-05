import bcrypt from "bcryptjs";
import { desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";

export async function getUsers() {
  if (!isDbConfigured()) return [] as User[];
  const db = getDb();
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  if (!isDbConfigured()) return null;
  const db = getDb();
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row || null;
}

export async function getUserByEmail(email: string, excludeId?: number) {
  if (!isDbConfigured()) return null;
  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim().toLowerCase()))
    .limit(1);
  if (!row) return null;
  if (excludeId && row.id === excludeId) return null;
  return row;
}

export async function getUserByTcNo(tcNo: string, excludeId?: number) {
  if (!isDbConfigured()) return null;
  const db = getDb();
  const [row] = await db.select().from(users).where(eq(users.tcNo, tcNo)).limit(1);
  if (!row) return null;
  if (excludeId && row.id === excludeId) return null;
  return row;
}

export async function createUser(opts: {
  name: string;
  email: string;
  phone?: string;
  tcNo: string;
  password: string;
}) {
  const db = getDb();
  const passwordHash = await bcrypt.hash(opts.password, 10);
  const [row] = await db
    .insert(users)
    .values({
      name: opts.name.trim(),
      email: opts.email.trim().toLowerCase(),
      phone: opts.phone?.trim() || null,
      tcNo: opts.tcNo,
      passwordHash,
    })
    .returning();
  return row;
}

export async function updateUser(
  id: number,
  opts: {
    name: string;
    email: string;
    phone?: string;
    tcNo: string;
    password?: string;
    active: boolean;
  },
) {
  const db = getDb();
  const values: {
    name: string;
    email: string;
    phone: string | null;
    tcNo: string;
    active: boolean;
    updatedAt: Date;
    passwordHash?: string;
  } = {
    name: opts.name.trim(),
    email: opts.email.trim().toLowerCase(),
    phone: opts.phone?.trim() || null,
    tcNo: opts.tcNo,
    active: opts.active,
    updatedAt: new Date(),
  };
  if (opts.password) {
    values.passwordHash = await bcrypt.hash(opts.password, 10);
  }
  const [row] = await db.update(users).set(values).where(eq(users.id, id)).returning();
  return row;
}

export async function deleteUser(id: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.delete(users).where(eq(users.id, id));
}

export async function verifyUserPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function getUserCount() {
  if (!isDbConfigured()) return 0;
  const db = getDb();
  const rows = await db.select().from(users);
  return rows.length;
}
