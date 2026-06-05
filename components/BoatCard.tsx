import ListingRow from "@/components/ListingRow";
import type { BoatListing } from "@/lib/boats";
import { boatTypeLabels, conditionLabels, formatPrice } from "@/lib/boats";

export default function BoatCard({ boat }: { boat: BoatListing }) {
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
      price={formatPrice(boat.price)}
      badges={badges}
    />
  );
}
