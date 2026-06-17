"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { listingSortFilters, type ListingSortKey } from "@/lib/listing-filters";

type Props = {
  count: number;
  title: string;
  sortable?: boolean;
};

export default function ListingToolbar({ count, title, sortable = true }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get("sira") || "") as ListingSortKey;

  function onSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sira", value);
    else params.delete("sira");
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
      <p className="text-[13px] text-muted">
        <span className="font-semibold text-foreground">{title}</span>
        {" · "}
        <span className="font-semibold text-navy">{count}</span> ilan
      </p>
      {sortable ? (
        <label className="flex items-center gap-2 text-[13px] text-muted">
          Sırala:
          <select
            value={current}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded border border-border bg-card px-2 py-1 text-foreground outline-none"
          >
            {listingSortFilters.map((sort) => (
              <option key={sort.key || "varsayilan"} value={sort.key}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
