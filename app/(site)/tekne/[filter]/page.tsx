import { notFound } from "next/navigation";
import BoatCard from "@/components/BoatCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import { filterApprovedBoats } from "@/lib/listings-store";
import { isTekneFilterKey, tekneFilters, type TekneFilterKey } from "@/lib/tekne-routes";

type Props = { params: Promise<{ filter: string }> };

export async function generateStaticParams() {
  return (Object.keys(tekneFilters) as TekneFilterKey[]).map((filter) => ({ filter }));
}

export async function generateMetadata({ params }: Props) {
  const { filter } = await params;
  if (!isTekneFilterKey(filter)) return { title: "Tekne" };
  return { title: `${tekneFilters[filter].title} | TekneShop` };
}

export default async function TekneFilterPage({ params }: Props) {
  const { filter } = await params;
  if (!isTekneFilterKey(filter)) notFound();

  const cfg = tekneFilters[filter];
  const all = await filterApprovedBoats({
    condition: cfg.condition,
    boatType: cfg.boatTypes?.length === 1 ? cfg.boatTypes[0] : undefined,
  });
  const items = cfg.boatTypes && cfg.boatTypes.length > 1
    ? all.filter((b) => cfg.boatTypes!.includes(b.boatType))
    : all;

  return (
    <>
      <ListingPageHeader
        title={cfg.title}
        count={items.length}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tekne İlanları", href: "/tekne" },
          { label: cfg.title },
        ]}
      />
      <ListingToolbar count={items.length} title={cfg.title} />
      <div>
        {items.length > 0 ? (
          <ListingWithAds
            items={items}
            getKey={(b) => b.slug}
            renderItem={(b) => <BoatCard boat={b} />}
          />
        ) : (
          <p className="px-4 py-12 text-center text-[13px] text-muted">Bu kategoride ilan yok.</p>
        )}
      </div>
    </>
  );
}
