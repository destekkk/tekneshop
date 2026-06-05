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
