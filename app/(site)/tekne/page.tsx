import BoatCard from "@/components/BoatCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import TekneCategoryLinks from "@/components/TekneCategoryLinks";
import { getApprovedBoatListings } from "@/lib/listings-store";

export const metadata = { title: "Tekne İlanları | TekneShop" };

export default async function TeknePage() {
  const boatListings = await getApprovedBoatListings();

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
      <div className="border-b border-border bg-[#fafafa] px-4 py-2">
        <TekneCategoryLinks activeHref="/tekne" compact />
      </div>
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
