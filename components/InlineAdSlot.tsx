import Link from "next/link";
import { INLINE_AD_HEIGHT } from "@/lib/layout-constants";

type Props = {
  slot?: number;
  href?: string;
};

export default function InlineAdSlot({ slot = 1, href = "/magaza" }: Props) {
  return (
    <div
      className="flex items-center justify-center border-b border-border bg-[#f4f4f4] px-4"
      style={{ minHeight: INLINE_AD_HEIGHT }}
      role="complementary"
      aria-label={`Liste reklamı ${slot}`}
    >
      <Link
        href={href}
        className="flex h-[60px] w-full max-w-[728px] items-center justify-center rounded border border-dashed border-border bg-gradient-to-r from-navy/90 to-turquoise/80 px-4 text-center text-[13px] font-semibold text-white hover:opacity-95"
      >
        Reklam alanı {slot} — CSY Marine & tekne ilanları burada
      </Link>
    </div>
  );
}
