"use client";

import {
  deriveDurationFromRange,
  durationUnitLabels,
  toDatetimeLocalValue,
  type DurationUnit,
} from "@/lib/ad-schedule";
import type { Ad } from "@/lib/db/schema";
import { useMemo, useState } from "react";

export default function AdScheduleFields({ ad }: { ad?: Ad }) {
  const defaults = useMemo(() => {
    if (ad?.startsAt && ad?.endsAt) {
      const d = deriveDurationFromRange(new Date(ad.startsAt), new Date(ad.endsAt));
      return {
        enabled: true,
        startsAt: toDatetimeLocalValue(ad.startsAt),
        durationValue: d.value,
        durationUnit: d.unit,
      };
    }
    if (ad?.startsAt) {
      return {
        enabled: true,
        startsAt: toDatetimeLocalValue(ad.startsAt),
        durationValue: 7,
        durationUnit: "day" as DurationUnit,
      };
    }
    return {
      enabled: false,
      startsAt: "",
      durationValue: 7,
      durationUnit: "day" as DurationUnit,
    };
  }, [ad]);

  const [enabled, setEnabled] = useState(defaults.enabled);

  return (
    <div className="rounded-lg border border-dashed border-border bg-[#fafafa] p-3">
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          name="scheduleEnabled"
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Yayın süresi belirle
      </label>

      {enabled ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className="text-[12px] font-medium">Başlangıç tarihi ve saati</label>
            <input
              name="startsAt"
              type="datetime-local"
              required={enabled}
              defaultValue={defaults.startsAt || toDatetimeLocalValue(new Date())}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-[12px] font-medium">Yayın süresi</label>
            <input
              name="durationValue"
              type="number"
              min={1}
              required={enabled}
              defaultValue={defaults.durationValue}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[12px] font-medium">Süre birimi</label>
            <select
              name="durationUnit"
              defaultValue={defaults.durationUnit}
              className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
            >
              {(Object.entries(durationUnitLabels) as [DurationUnit, string][]).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-muted sm:col-span-3">
            Örn. başlangıç bugün + 30 gün = reklam 30 gün boyunca yayınlanır, sonra otomatik kalkar.
          </p>
        </div>
      ) : null}
    </div>
  );
}
