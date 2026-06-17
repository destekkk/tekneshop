import {
  boatTypeLabels,
  conditionLabels,
  type BoatCondition,
  type BoatType,
} from "@/lib/boats";
import type { Listing } from "@/lib/db/schema";

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
  { key: "", label: "Tarihe göre (önce en yeni)" },
  { key: "tarih-eski", label: "Tarihe göre (önce en eski)" },
  { key: "fiyat-artan", label: "Fiyata göre (önce en düşük)" },
  { key: "fiyat-azalan", label: "Fiyata göre (önce en yüksek)" },
];

export function parseListingSort(key?: string): ListingSortKey {
  const found = listingSortFilters.find((f) => f.key === key);
  return found?.key ?? "";
}
