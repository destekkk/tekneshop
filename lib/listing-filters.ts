import {
  boatTypeLabels,
  conditionLabels,
  type BoatCondition,
  type BoatType,
} from "@/lib/boats";
import type { Listing } from "@/lib/db/schema";
import {
  listingPriceInTry,
  parseListingCurrency,
  type ExchangeRates,
  type ListingCurrency,
} from "@/lib/listing-currency";

export type ListingCategoryKey =
  | ""
  | BoatType
  | BoatCondition
  | "urun"
  | "hizmet";

export type ListingCategoryFilter = {
  key: ListingCategoryKey;
  label: string;
  group: "genel" | "tekne" | "durum" | "diger";
  boatType?: BoatType;
  condition?: BoatCondition;
  type?: "boat" | "product" | "service";
};

export const listingCategoryFilters: ListingCategoryFilter[] = [
  { key: "", label: "Tümü", group: "genel" },
  ...(["motoryat", "yelkenli", "katamaran", "sisme-bot", "jet-ski"] as BoatType[]).map(
    (k) => ({
      key: k as ListingCategoryKey,
      label: boatTypeLabels[k],
      group: "tekne" as const,
      boatType: k,
    }),
  ),
  ...(["sifir", "ikinci-el", "kiralik"] as BoatCondition[]).map((k) => ({
    key: k as ListingCategoryKey,
    label: conditionLabels[k],
    group: "durum" as const,
    condition: k,
  })),
  { key: "urun", label: "Ürün İlanları", group: "diger", type: "product" },
  { key: "hizmet", label: "Hizmet İlanları", group: "diger", type: "service" },
];

export function parseListingCategory(k?: string): ListingCategoryKey {
  const found = listingCategoryFilters.find((f) => f.key === k);
  return found?.key ?? "";
}

export function getListingCategoryFilter(key: ListingCategoryKey) {
  return listingCategoryFilters.find((f) => f.key === key) ?? listingCategoryFilters[0];
}

export function listingMatchesCategory(listing: Listing, key: ListingCategoryKey) {
  const filter = getListingCategoryFilter(key);
  if (!filter.key) return true;
  if (filter.boatType && listing.boatType !== filter.boatType) return false;
  if (filter.condition && listing.condition !== filter.condition) return false;
  if (filter.type && listing.type !== filter.type) return false;
  return true;
}

export function countByCategory(listings: Listing[]) {
  const counts: Record<string, number> = {};
  for (const f of listingCategoryFilters) {
    counts[f.key || "tumu"] = listings.filter((l) => listingMatchesCategory(l, f.key)).length;
  }
  return counts;
}

export type PriceRangeKey = "" | "0-500000" | "500000-2000000" | "2000000-";

export const priceRangeFilters: { key: PriceRangeKey; label: string }[] = [
  { key: "", label: "Tüm fiyatlar" },
  { key: "0-500000", label: "0 – 500.000 ₺" },
  { key: "500000-2000000", label: "500.000 – 2.000.000 ₺" },
  { key: "2000000-", label: "2.000.000 ₺ ve üzeri" },
];

export function parsePriceRange(key?: string): PriceRangeKey {
  const found = priceRangeFilters.find((f) => f.key === key);
  return found?.key ?? "";
}

export function getPriceRangeBounds(key: PriceRangeKey): { min?: number; max?: number } {
  switch (key) {
    case "0-500000":
      return { min: 0, max: 500_000 };
    case "500000-2000000":
      return { min: 500_000, max: 2_000_000 };
    case "2000000-":
      return { min: 2_000_000 };
    default:
      return {};
  }
}

export type ListingSortKey = "" | "tarih-yeni" | "tarih-eski" | "fiyat-artan" | "fiyat-azalan";

export const listingSortFilters: { key: ListingSortKey; label: string }[] = [
  { key: "", label: "Tarihe göre (Önce en yeni)" },
  { key: "tarih-eski", label: "Tarihe göre (Önce en eski)" },
  { key: "fiyat-artan", label: "Fiyata göre (Önce en düşük)" },
  { key: "fiyat-azalan", label: "Fiyata göre (Önce en yüksek)" },
];

export function sortPublicBoats<
  T extends { price: number; currency?: ListingCurrency; year: number; createdAt?: Date },
>(boats: T[], sort?: ListingSortKey, rates?: ExchangeRates): T[] {
  const copy = [...boats];
  const dateValue = (b: T) => b.createdAt?.getTime() ?? b.year;
  const tryPrice = (b: T) =>
    listingPriceInTry(b.price, parseListingCurrency(b.currency), rates);

  switch (sort) {
    case "tarih-eski":
      return copy.sort((a, b) => dateValue(a) - dateValue(b));
    case "fiyat-artan":
      return copy.sort((a, b) => tryPrice(a) - tryPrice(b));
    case "fiyat-azalan":
      return copy.sort((a, b) => tryPrice(b) - tryPrice(a));
    default:
      return copy.sort((a, b) => dateValue(b) - dateValue(a));
  }
}

export function filterListingsByTryPrice<
  T extends { price: number; currency?: string | null },
>(rows: T[], bounds: { min?: number; max?: number }, rates?: ExchangeRates) {
  if (bounds.min == null && bounds.max == null) return rows;
  return rows.filter((row) => {
    const tryPrice = listingPriceInTry(
      row.price,
      parseListingCurrency(row.currency),
      rates,
    );
    if (bounds.min != null && tryPrice < bounds.min) return false;
    if (bounds.max != null && tryPrice > bounds.max) return false;
    return true;
  });
}

export function parseListingSort(key?: string): ListingSortKey {
  const found = listingSortFilters.find((f) => f.key === key);
  return found?.key ?? "";
}
