import FavoriteButton from "@/components/FavoriteButton";
import ListingRow from "@/components/ListingRow";
import type { BoatListing } from "@/lib/boats";
import { boatTypeLabels, conditionLabels, formatPrice } from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";

type Props = {
  boat: BoatListing;
  isFavorited?: boolean;
  showFavorite?: boolean;
};

export default function BoatCard({ boat, isFavorited = false, showFavorite = false }: Props) {
  const badges = [
    conditionLabels[boat.condition],
    boatTypeLabels[boat.boatType],
    ...(boat.badge ? [boat.badge] : []),
  ];

  return (
    <ListingRow
      href={`/tekne/ilan/${boat.slug}`}
      title={boat.title}
      image={boat.image}
      location={boat.location}
      details={[boat.year, `${boat.lengthM} m`, boat.engine].filter(Boolean).join(" · ")}
      price={formatPrice(boat.price, boat.currency)}
      listingNumber={boat.listingNumber ? formatListingNumber(boat.listingNumber) : undefined}
      badges={badges}
      favoriteSlot={
        showFavorite ? (
          <FavoriteButton kind="listing" slug={boat.slug} initialFavorited={isFavorited} compact />
        ) : undefined
      }
    />
  );
}
