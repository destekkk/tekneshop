"use client";

import { useTransition } from "react";
import { toggleAdsEnabledAction } from "@/lib/admin/actions";

export default function AdsEnabledToggle({
  enabled,
  compact = false,
}: {
  enabled: boolean;
  compact?: boolean;
}) {
  const [pending, start] = useTransition();

  return (
    <div
      className={
        compact
          ? "flex items-center justify-between gap-3"
          : "rounded-lg border border-border bg-white p-4"
      }
    >
      <div className={compact ? "" : "mb-3"}>
        <p className="text-sm font-bold text-navy">Reklam alanları</p>
        <p className="text-[12px] text-muted">
          Üst banner ve liste içi sponsorlu alanlar. Kapalıyken sitede görünmez.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`text-[12px] font-semibold ${enabled ? "text-emerald-700" : "text-muted"}`}
        >
          {enabled ? "Açık" : "Kapalı"}
        </span>
        <button
          type="button"
          disabled={pending}
          role="switch"
          aria-checked={enabled}
          onClick={() => start(() => void toggleAdsEnabledAction(!enabled))}
          className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-50 ${
            enabled ? "bg-emerald-600" : "bg-[#ccc]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              enabled ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
