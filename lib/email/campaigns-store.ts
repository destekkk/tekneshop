import { desc, eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { emailCampaigns, type EmailCampaign } from "@/lib/db/schema";

export async function getCampaigns(limit = 20) {
  if (!isDbConfigured()) return [] as EmailCampaign[];
  const db = getDb();
  return db.select().from(emailCampaigns).orderBy(desc(emailCampaigns.createdAt)).limit(limit);
}

export async function createCampaign(opts: {
  subject: string;
  bodyHtml: string;
  bodyText?: string;
  recipientCount: number;
  adminEmail?: string;
}) {
  if (!isDbConfigured()) return null;
  const db = getDb();
  const [row] = await db
    .insert(emailCampaigns)
    .values({
      subject: opts.subject,
      bodyHtml: opts.bodyHtml,
      bodyText: opts.bodyText,
      recipientCount: opts.recipientCount,
      adminEmail: opts.adminEmail,
      status: "sending",
    })
    .returning();
  return row;
}

export async function finishCampaign(
  id: number,
  result: { sent: number; failed: number; status?: string },
) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db
    .update(emailCampaigns)
    .set({
      sentCount: result.sent,
      failedCount: result.failed,
      status: result.status || (result.failed > 0 ? "partial" : "sent"),
      sentAt: new Date(),
    })
    .where(eq(emailCampaigns.id, id));
}
