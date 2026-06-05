import Link from "next/link";
import { AD_BANNER_HEIGHT } from "@/lib/layout-constants";

type Props = {
  href?: string;
  imageSrc?: string;
  alt?: string;
};

/** İçerik sütununda, header altında — sticky değil */
export default function TopAdBanner({
  href = "/ilan-ver",
  imageSrc,
  alt = "Reklam — TekneShop vitrin",
}: Props) {
  const content = imageSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageSrc} alt={alt} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-0.5 bg-gradient-to-r from-navy via-[#0d6b7a] to-turquoise px-4 text-center text-white">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
        Sponsorlu alan
      </span>
      <span className="text-sm font-bold sm:text-[15px]">
        Tekne & marin ürünlerinizi burada öne çıkarın
      </span>
    </div>
  );

  return (
    <div
      className="w-full border-b border-border bg-[#ececec]"
      style={{ height: AD_BANNER_HEIGHT }}
      role="complementary"
      aria-label="Üst reklam alanı"
    >
      <Link href={href} className="block h-full w-full">
        {content}
      </Link>
    </div>
  );
}
