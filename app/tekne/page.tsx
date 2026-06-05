import BoatCard from "@/components/BoatCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import { boatListings } from "@/lib/boats";

export const metadata = { title: "Tekne İlanları | TekneShop" };

export default function TeknePage() {
  return (
    <>
      <ListingPageHeader
        title="Tekne İlanları"
        count={boatListings.length}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tekne İlanları" },
        ]}
      />
      <ListingToolbar count={boatListings.length} title="Tekne İlanları" />
      <div>
        <ListingWithAds
          items={boatListings}
          getKey={(b) => b.slug}
          renderItem={(b) => <BoatCard boat={b} />}
        />
      </div>
    </>
  );
}
