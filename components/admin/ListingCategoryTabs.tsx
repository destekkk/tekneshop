"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  listingCategoryFilters,
  listingSortFilters,
  priceRangeFilters,
  type ListingCategoryKey,
  type ListingSortKey,
  type PriceRangeKey,
} from "@/lib/listing-filters";
import type { ListingTab } from "@/lib/listing-tabs";

const groupLabels = {
  genel: "Genel",
  tekne: "Tekne türü",
  durum: "İlan durumu",
  diger: "Diğer",
};

const selectClass =
  "w-full min-w-[160px] rounded border border-border bg-white px-2.5 py-2 text-[13px] text-foreground outline-none focus:border-navy";

export default function ListingCategoryTabs({
  activeCategory,
  activeTab,
  activePrice,
  activeSort,
  counts,
  searchQuery,
}: {
  activeCategory: ListingCategoryKey;
  activeTab: ListingTab;
  activePrice: PriceRangeKey;
  activeSort: ListingSortKey;
  counts: Record<string, number>;
  searchQuery?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(updates: {
    kategori?: ListingCategoryKey;
    fiyat?: PriceRangeKey;
    sira?: ListingSortKey;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    const kategori = updates.kategori !== undefined ? updates.kategori : activeCategory;
    if (kategori) params.set("kategori", kategori);
    else params.delete("kategori");

    const fiyat = updates.fiyat !== undefined ? updates.fiyat : activePrice;
    if (fiyat) params.set("fiyat", fiyat);
    else params.delete("fiyat");

    const sira = updates.sira !== undefined ? updates.sira : activeSort;
    if (sira) params.set("sira", sira);
    else params.delete("sira");

    if (activeTab !== "tumu") params.set("tab", activeTab);
    else params.delete("tab");

    if (searchQuery) params.set("q", searchQuery);
    else if (!searchParams.get("q")) params.delete("q");

    const qs = params.toString();
    router.push(`/admin/ilanlar${qs ? `?${qs}` : ""}`);
  }

  const groups = ["genel", "tekne", "durum", "diger"] as const;

  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <p className="mb-3 text-[12px] font-bold text-navy">Kategori filtresi</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Kategori</span>
          <select
            className={selectClass}
            value={activeCategory}
            onChange={(e) => navigate({ kategori: e.target.value as ListingCategoryKey })}
          >
            {groups.map((group) => {
              const items = listingCategoryFilters.filter((f) => f.group === group);
              if (items.length === 0) return null;
              return (
                <optgroup key={group} label={groupLabels[group]}>
                  {items.map((cat) => {
                    const countKey = cat.key || "tumu";
                    const count = counts[countKey] ?? 0;
                    return (
                      <option key={cat.key || "tumu"} value={cat.key}>
                        {cat.label} ({count})
                      </option>
                    );
                  })}
                </optgroup>
              );
            })}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Fiyat</span>
          <select
            className={selectClass}
            value={activePrice}
            onChange={(e) => navigate({ fiyat: e.target.value as PriceRangeKey })}
          >
            {priceRangeFilters.map((range) => (
              <option key={range.key || "tumu"} value={range.key}>
                {range.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Tarih / sıralama</span>
          <select
            className={selectClass}
            value={activeSort}
            onChange={(e) => navigate({ sira: e.target.value as ListingSortKey })}
          >
            {listingSortFilters.map((sort) => (
              <option key={sort.key || "varsayilan"} value={sort.key}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
