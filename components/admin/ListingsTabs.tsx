"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ListingTab } from "@/lib/listing-tabs";

const tabs: { key: ListingTab; label: string }[] = [
  { key: "tumu", label: "Tüm İlanlar" },
  { key: "bekleyen", label: "Onay Bekleyen" },
  { key: "onayli", label: "Onaylı İlanlar" },
  { key: "reddedilen", label: "Reddedilmiş İlanlar" },
];

export default function ListingsTabs({
  active,
  counts,
  searchQuery,
}: {
  active: ListingTab;
  counts: { tumu: number; bekleyen: number; onayli: number; reddedilen: number };
  searchQuery?: string;
}) {
  const searchParams = useSearchParams();

  function hrefFor(tab: ListingTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "tumu") params.delete("tab");
    else params.set("tab", tab);
    if (searchQuery) params.set("q", searchQuery);
    else if (!searchParams.get("q")) params.delete("q");
    const qs = params.toString();
    return `/admin/ilanlar${qs ? `?${qs}` : ""}`;
  }

  const countKey: Record<ListingTab, keyof typeof counts> = {
    tumu: "tumu",
    bekleyen: "bekleyen",
    onayli: "onayli",
    reddedilen: "reddedilen",
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-border">
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        const count = counts[countKey[tab.key]];
        return (
          <Link
            key={tab.key}
            href={hrefFor(tab.key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-semibold transition-colors ${
              isActive
                ? "border-navy text-navy"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                isActive ? "bg-navy text-white" : "bg-[#eee] text-muted"
              }`}
            >
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
