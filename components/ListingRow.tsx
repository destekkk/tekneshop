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
}: Props) {
  return (
    <Link
      href={href}
      className="flex gap-4 border-b border-border px-4 py-3 transition-colors hover:bg-[#fafafa]"
    >
      <ListingThumbnail src={image} alt={title} />
      <div className="min-w-0 flex-1">
        {listingNumber ? (
          <p className="mb-1 text-[11px] font-bold text-navy">İlan No: {listingNumber}</p>
        ) : null}
        {badges && badges.length > 0 && (
          <div className="mb-1 flex flex-wrap gap-1">
            {badges.map((b) => (
              <span
                key={b}
                className="rounded-sm bg-turquoise-light px-1.5 py-0.5 text-[11px] font-semibold text-navy"
              >
                {b}
              </span>
            ))}
          </div>
        )}
        <h3 className="text-[14px] font-normal leading-snug text-link hover:underline">{title}</h3>
        <p className="mt-1 text-[12px] text-muted">{location}</p>
        <p className="mt-0.5 text-[12px] text-muted">{details}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[16px] font-bold text-navy">{price}</p>
      </div>
    </Link>
  );
}
