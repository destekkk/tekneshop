import { Suspense } from "react";
import { notFound } from "next/navigation";
import BoatCard from "@/components/BoatCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import TekneCategoryLinks from "@/components/TekneCategoryLinks";
import { getCurrentUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getUserFavoriteKeys } from "@/lib/favorites-store";
import { parseListingSort, sortPublicBoats } from "@/lib/listing-filters";
import { filterApprovedBoats } from "@/lib/listings-store";
import { getTcmbRates } from "@/lib/tcmb-rates";
import { isTekneFilterKey, tekneFilters, type TekneFilterKey } from "@/lib/tekne-routes";

type Props = {
  params: Promise<{ filter: string }>;
  searchParams: Promise<{ sira?: string }>;
};

export async function generateStaticParams() {
  return (Object.keys(tekneFilters) as TekneFilterKey[]).map((filter) => ({ filter }));
}

export async function generateMetadata({ params }: Props) {
  const { filter } = await params;
  if (!isTekneFilterKey(filter)) return { title: "Tekne" };
  return { title: `${tekneFilters[filter].title} | TekneShop` };
}

export default async function TekneFilterPage({ params, searchParams }: Props) {
  const { filter } = await params;
  const { sira } = await searchParams;
  if (!isTekneFilterKey(filter)) notFound();

  const cfg = tekneFilters[filter];
  const sort = parseListingSort(sira);
  const [all, user, rates] = await Promise.all([
    filterApprovedBoats({
      condition: cfg.condition,
      boatType: cfg.boatTypes?.length === 1 ? cfg.boatTypes[0] : undefined,
    }),
    getCurrentUser(),
    getTcmbRates(),
  ]);
  const filtered = cfg.boatTypes && cfg.boatTypes.length > 1
    ? all.filter((b) => cfg.boatTypes!.includes(b.boatType))
    : all;
  const items = sortPublicBoats(filtered, sort, rates);
  const favKeys =
    user && isDbConfigured() ? await getUserFavoriteKeys(user.id) : null;
  const showFavorite = isDbConfigured();

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
      <div className="border-b border-border bg-[#fafafa] px-4 py-2">
        <TekneCategoryLinks activeHref={`/tekne/${filter}`} compact />
      </div>
      <Suspense fallback={<div className="h-12 border-b border-border" />}>
        <ListingToolbar count={items.length} title={cfg.title} />
      </Suspense>
      <div>
        {items.length > 0 ? (
          <ListingWithAds
            items={items}
            getKey={(b) => b.slug}
            renderItem={(b) => (
              <BoatCard
                boat={b}
                showFavorite={showFavorite}
                isFavorited={favKeys?.listingSlugs.has(b.slug) ?? false}
              />
            )}
          />
        ) : (
          <p className="px-4 py-12 text-center text-[13px] text-muted">Bu kategoride ilan yok.</p>
        )}
      </div>
    </>
  );
}
