import Link from "next/link";
import { getActiveInlineAd } from "@/lib/ads-store";
import { INLINE_AD_HEIGHT } from "@/lib/layout-constants";

type Props = {
  slot?: number;
};

export default async function InlineAdSlot({ slot = 1 }: Props) {
  const ad = await getActiveInlineAd(slot);

  return (
    <div
      className="flex items-center justify-center border-b border-border bg-[#f4f4f4] px-4"
      style={{ minHeight: INLINE_AD_HEIGHT }}
      role="complementary"
      aria-label={`Liste reklamı ${slot}`}
    >
      <Link
        href={ad.href}
        className="flex h-[60px] w-full max-w-[728px] items-center justify-center rounded border border-dashed border-border bg-gradient-to-r from-navy/90 to-turquoise/80 px-4 text-center text-[13px] font-semibold text-white hover:opacity-95"
      >
        {ad.title} — {ad.subtitle}
      </Link>
    </div>
  );
}
