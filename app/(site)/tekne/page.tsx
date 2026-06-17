import { Suspense } from "react";
import BoatCard from "@/components/BoatCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import TekneCategoryLinks from "@/components/TekneCategoryLinks";
import { getCurrentUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getUserFavoriteKeys } from "@/lib/favorites-store";
import { parseListingSort, sortPublicBoats } from "@/lib/listing-filters";
import { getApprovedBoatListings } from "@/lib/listings-store";
import { getTcmbRates } from "@/lib/tcmb-rates";

export const metadata = { title: "Tekne İlanları | TekneShop" };

export default async function TeknePage({
  searchParams,
}: {
  searchParams: Promise<{ sira?: string }>;
}) {
  const params = await searchParams;
  const sort = parseListingSort(params.sira);
  const [boatListings, user, rates] = await Promise.all([
    getApprovedBoatListings(),
    getCurrentUser(),
    getTcmbRates(),
  ]);
  const items = sortPublicBoats(boatListings, sort, rates);
  const favKeys =
    user && isDbConfigured() ? await getUserFavoriteKeys(user.id) : null;
  const showFavorite = isDbConfigured();

  return (
    <>
      <ListingPageHeader
        title="Tekne İlanları"
        count={items.length}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tekne İlanları" },
        ]}
      />
      <div className="border-b border-border bg-[#fafafa] px-4 py-2">
        <TekneCategoryLinks activeHref="/tekne" compact />
      </div>
      <Suspense fallback={<div className="h-12 border-b border-border" />}>
        <ListingToolbar count={items.length} title="Tekne İlanları" />
      </Suspense>
      <div>
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
      </div>
    </>
  );
}
