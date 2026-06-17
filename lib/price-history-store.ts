import { and, desc, eq } from "drizzle-orm";
import { getSiteConfig } from "@/lib/admin/settings";
import { getSiteUrl } from "@/lib/email/config";
import { getDb, isDbConfigured } from "@/lib/db";
import {
  favoritePriceAlerts,
  listingPriceHistory,
} from "@/lib/db/schema";
import { sendTransactionalEmail } from "@/lib/email/send";
import { formatListingPrice, type ListingCurrency } from "@/lib/listing-currency";
import { getFavoriteUserIdsForListing } from "@/lib/favorites-store";
import { getUserById } from "@/lib/users-store";

export async function recordListingPrice(
  listingId: number,
  price: number,
  currency: string,
  source: "create" | "admin_edit" = "create",
) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db.insert(listingPriceHistory).values({
    listingId,
    price,
    currency,
    source,
  });
}

export async function getListingPriceHistory(listingId: number, limit = 10) {
  if (!isDbConfigured()) return [];
  try {
    const db = getDb();
    return await db
      .select()
      .from(listingPriceHistory)
      .where(eq(listingPriceHistory.listingId, listingId))
      .orderBy(desc(listingPriceHistory.recordedAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function notifyFavoritePriceChange(opts: {
  listingId: number;
  listingTitle: string;
  listingSlug: string;
  oldPrice: number;
  newPrice: number;
  currency: string;
}) {
  if (!isDbConfigured()) return;
  if (opts.oldPrice === opts.newPrice) return;

  const userIds = await getFavoriteUserIdsForListing(opts.listingId);
  if (userIds.length === 0) return;

  const currency = (opts.currency || "TRY") as ListingCurrency;
  const oldText = formatListingPrice(opts.oldPrice, currency);
  const newText = formatListingPrice(opts.newPrice, currency);
  const direction = opts.newPrice < opts.oldPrice ? "düştü" : "yükseldi";
  const message = `Favorinizdeki "${opts.listingTitle}" ilanının fiyatı ${direction}: ${oldText} → ${newText}`;

  const db = getDb();
  const config = await getSiteConfig();
  const siteUrl = getSiteUrl();

  for (const userId of userIds) {
    await db.insert(favoritePriceAlerts).values({
      userId,
      listingId: opts.listingId,
      listingTitle: opts.listingTitle,
      listingSlug: opts.listingSlug,
      oldPrice: opts.oldPrice,
      newPrice: opts.newPrice,
      currency: opts.currency || "TRY",
      message,
    });

    const user = await getUserById(userId);
    if (user?.email) {
      await sendTransactionalEmail({
        to: user.email,
        subject: `Fiyat değişikliği: ${opts.listingTitle}`,
        body: `<p>${message}</p><p><a href="${siteUrl}/tekne/ilan/${opts.listingSlug}">İlanı görüntüle</a> · <a href="${siteUrl}/favorilerim">Favorilerim</a></p>`,
        siteName: config.siteName,
        supportEmail: config.supportEmail,
      });
    }
  }
}

export async function getUserPriceAlerts(userId: number, limit = 20) {
  if (!isDbConfigured()) return [];
  try {
    const db = getDb();
    return await db
      .select()
      .from(favoritePriceAlerts)
      .where(eq(favoritePriceAlerts.userId, userId))
      .orderBy(desc(favoritePriceAlerts.createdAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getUnreadPriceAlertCount(userId: number) {
  if (!isDbConfigured()) return 0;
  try {
    const db = getDb();
    const rows = await db
      .select({ id: favoritePriceAlerts.id })
      .from(favoritePriceAlerts)
      .where(and(eq(favoritePriceAlerts.userId, userId), eq(favoritePriceAlerts.read, false)));
    return rows.length;
  } catch {
    return 0;
  }
}

export async function markUserPriceAlertsRead(userId: number) {
  if (!isDbConfigured()) return;
  const db = getDb();
  await db
    .update(favoritePriceAlerts)
    .set({ read: true })
    .where(and(eq(favoritePriceAlerts.userId, userId), eq(favoritePriceAlerts.read, false)));
}
