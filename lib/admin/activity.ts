import { getDb, isDbConfigured } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

export async function logActivity(opts: {
  action: string;
  entityType: string;
  entityId?: number;
  adminEmail?: string;
  details?: Record<string, unknown>;
}) {
  if (!isDbConfigured()) return;
  try {
    const db = getDb();
    await db.insert(activityLogs).values({
      action: opts.action,
      entityType: opts.entityType,
      entityId: opts.entityId,
      adminEmail: opts.adminEmail,
      details: opts.details,
    });
  } catch {
    // non-blocking
  }
}
