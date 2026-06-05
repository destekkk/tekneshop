import type { Ad } from "@/lib/db/schema";

export type DurationUnit = "day" | "week" | "month";

export function toDatetimeLocalValue(date: Date | null | undefined) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function parseDatetimeLocal(value: string) {
  if (!value.trim()) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function computeEndsAt(start: Date, value: number, unit: DurationUnit) {
  const end = new Date(start);
  if (unit === "day") end.setDate(end.getDate() + value);
  else if (unit === "week") end.setDate(end.getDate() + value * 7);
  else end.setMonth(end.getMonth() + value);
  return end;
}

export function deriveDurationFromRange(start: Date, end: Date): { value: number; unit: DurationUnit } {
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays % 30 === 0 && diffDays >= 30) {
    return { value: diffDays / 30, unit: "month" };
  }
  if (diffDays % 7 === 0 && diffDays >= 7) {
    return { value: diffDays / 7, unit: "week" };
  }
  return { value: Math.max(1, diffDays), unit: "day" };
}

export function parseAdScheduleFromForm(formData: FormData) {
  const scheduleEnabled = formData.get("scheduleEnabled") === "on";
  if (!scheduleEnabled) {
    return { startsAt: null as Date | null, endsAt: null as Date | null };
  }

  const startsAt = parseDatetimeLocal(String(formData.get("startsAt") || ""));
  if (!startsAt) {
    return { startsAt: null as Date | null, endsAt: null as Date | null };
  }

  const durationValue = Number(formData.get("durationValue") || 0);
  const durationUnit = (String(formData.get("durationUnit") || "day") as DurationUnit) || "day";
  const endsAt =
    durationValue > 0 ? computeEndsAt(startsAt, durationValue, durationUnit) : null;

  return { startsAt, endsAt };
}

export function getAdScheduleStatus(ad: Pick<Ad, "active" | "startsAt" | "endsAt">) {
  if (!ad.active) return { label: "Pasif", tone: "muted" as const };

  const now = new Date();
  if (ad.startsAt && now < ad.startsAt) {
    return { label: "Beklemede", tone: "warning" as const };
  }
  if (ad.endsAt && now > ad.endsAt) {
    return { label: "Süresi doldu", tone: "danger" as const };
  }
  if (ad.startsAt || ad.endsAt) {
    return { label: "Yayında", tone: "success" as const };
  }
  return { label: "Süresiz", tone: "success" as const };
}

export function formatAdSchedule(ad: Pick<Ad, "startsAt" | "endsAt">) {
  if (!ad.startsAt && !ad.endsAt) return "Süre sınırı yok";
  const fmt = (d: Date) =>
    d.toLocaleString("tr-TR", { dateStyle: "short", timeStyle: "short" });
  if (ad.startsAt && ad.endsAt) return `${fmt(ad.startsAt)} → ${fmt(ad.endsAt)}`;
  if (ad.startsAt) return `${fmt(ad.startsAt)}'den itibaren`;
  return `${fmt(ad.endsAt!)}'e kadar`;
}

export const durationUnitLabels: Record<DurationUnit, string> = {
  day: "Gün",
  week: "Hafta",
  month: "Ay",
};
