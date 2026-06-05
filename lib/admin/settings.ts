import { eq } from "drizzle-orm";
import { getDb, isDbConfigured } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export type ListingPricingSettings = {
  enabled: boolean;
  freePeriod: boolean;
  pricePerListing: number;
  currency: string;
  featuredListingPrice: number;
  packages: { name: string; count: number; price: number }[];
};

export type SiteConfig = {
  listingPricing: ListingPricingSettings;
  moderationRequired: boolean;
  maxPhotosPerListing: number;
  siteName: string;
  supportEmail: string;
};

export const defaultSiteConfig: SiteConfig = {
  siteName: "TekneShop",
  supportEmail: "destek@tekneshop.com",
  moderationRequired: true,
  maxPhotosPerListing: 12,
  listingPricing: {
    enabled: false,
    freePeriod: true,
    pricePerListing: 299,
    currency: "TRY",
    featuredListingPrice: 149,
    packages: [
      { name: "5 İlan Paketi", count: 5, price: 1199 },
      { name: "15 İlan Paketi", count: 15, price: 2999 },
      { name: "30 İlan Paketi", count: 30, price: 4999 },
    ],
  },
};

const CONFIG_KEY = "site_config";

export async function getSiteConfig(): Promise<SiteConfig> {
  if (!isDbConfigured()) return defaultSiteConfig;
  try {
    const db = getDb();
    const row = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, CONFIG_KEY))
      .limit(1);
    if (!row[0]) return defaultSiteConfig;
    return { ...defaultSiteConfig, ...(row[0].value as SiteConfig) };
  } catch {
    return defaultSiteConfig;
  }
}

export async function saveSiteConfig(config: SiteConfig) {
  const db = getDb();
  await db
    .insert(siteSettings)
    .values({ key: CONFIG_KEY, value: config })
    .onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: config, updatedAt: new Date() },
    });
}
