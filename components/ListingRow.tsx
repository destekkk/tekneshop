import Link from "next/link";
import ListingThumbnail from "@/components/ListingThumbnail";

type Props = {
  href: string;
  title: string;
  image: string;
  location: string;
  details: string;
  price: string;
  listingNumber?: string;
  badges?: string[];
  favoriteSlot?: React.ReactNode;
};

export default function ListingRow({
  href,
  title,
  image,
  location,
  details,
  price,
  listingNumber,
  badges,
  favoriteSlot,
}: Props) {
  return (
    <div className="flex items-stretch border-b border-border">
      <Link
        href={href}
        className="flex min-w-0 flex-1 gap-3 px-4 py-2.5 transition-colors hover:bg-[#fafafa]"
      >
        <ListingThumbnail src={image} alt={title} />
        <div className="min-w-0 flex-1">
          {listingNumber ? (
            <p className="text-[11px] font-bold text-navy">İlan No: {listingNumber}</p>
          ) : null}
          <h3 className="mt-0.5 text-[14px] font-bold leading-tight text-foreground">{title}</h3>
          {badges && badges.length > 0 ? (
            <div className="mt-1 flex flex-wrap gap-1">
              {badges.map((b) => (
                <span
                  key={b}
                  className="rounded-sm bg-turquoise-light px-1.5 py-px text-[10px] font-semibold text-navy"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : null}
          <p className="mt-0.5 text-[11px] text-muted">{location}</p>
          <p className="mt-px text-[11px] text-muted">{details}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[15px] font-bold text-navy">{price}</p>
        </div>
      </Link>
      {favoriteSlot ? (
        <div className="flex shrink-0 items-center border-l border-border px-2.5">{favoriteSlot}</div>
      ) : null}
    </div>
  );
}
