"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  listingCategoryFilters,
  type ListingCategoryKey,
} from "@/lib/listing-filters";
import type { ListingTab } from "@/lib/listing-tabs";

const groupLabels = {
  genel: null,
  tekne: "Tekne türü",
  durum: "İlan durumu",
  diger: "Diğer",
};

export default function ListingCategoryTabs({
  activeCategory,
  activeTab,
  counts,
  searchQuery,
}: {
  activeCategory: ListingCategoryKey;
  activeTab: ListingTab;
  counts: Record<string, number>;
  searchQuery?: string;
}) {
  const searchParams = useSearchParams();

  function hrefFor(category: ListingCategoryKey) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("kategori", category);
    else params.delete("kategori");
    if (activeTab !== "tumu") params.set("tab", activeTab);
    else params.delete("tab");
    if (searchQuery) params.set("q", searchQuery);
    else params.delete("q");
    const qs = params.toString();
    return `/admin/ilanlar${qs ? `?${qs}` : ""}`;
  }

  const groups = ["genel", "tekne", "durum", "diger"] as const;

  return (
    <div className="space-y-2 rounded-lg border border-border bg-white p-3">
      <p className="text-[12px] font-bold text-navy">Kategori filtresi</p>
      {groups.map((group) => {
        const items = listingCategoryFilters.filter((f) => f.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group}>
            {groupLabels[group] ? (
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                {groupLabels[group]}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-1.5">
              {items.map((cat) => {
                const isActive = activeCategory === cat.key;
                const countKey = cat.key || "tumu";
                const count = counts[countKey] ?? 0;
                return (
                  <Link
                    key={cat.key || "tumu"}
                    href={hrefFor(cat.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                      isActive
                        ? "bg-navy text-white"
                        : "bg-[#f4f6f8] text-foreground hover:bg-[#e8ecf0]"
                    }`}
                  >
                    {cat.label}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive ? "bg-white/20 text-white" : "bg-white text-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
