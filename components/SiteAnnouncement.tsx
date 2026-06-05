import Link from "next/link";
import { getActiveAnnouncements } from "@/lib/announcements-store";

const tones: Record<string, string> = {
  info: "bg-[#e8f6f5] text-navy border-[#b8e0dc]",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  promo: "bg-gradient-to-r from-navy to-[#0d6b7a] text-white border-transparent",
};

export default async function SiteAnnouncement() {
  const items = await getActiveAnnouncements();
  if (items.length === 0) return null;

  return (
    <div className="space-y-0">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex flex-wrap items-center justify-center gap-2 border-b px-4 py-2 text-center text-[13px] ${tones[item.tone] || tones.info}`}
        >
          <span className="font-medium">{item.message}</span>
          {item.linkUrl ? (
            <Link href={item.linkUrl} className="font-semibold underline underline-offset-2">
              {item.linkLabel || "Detay"}
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
