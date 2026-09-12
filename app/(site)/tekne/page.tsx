import { Suspense } from "react";
import BoatCard from "@/components/BoatCard";
import JsonLd from "@/components/JsonLd";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import TekneCategoryLinks from "@/components/TekneCategoryLinks";
import { getCurrentUser } from "@/lib/auth/user-session";
import { isDbConfigured } from "@/lib/db";
import { getSiteUrl } from "@/lib/email/config";
import { getUserFavoriteKeys } from "@/lib/favorites-store";
import { parseListingSort, sortPublicBoats } from "@/lib/listing-filters";
import { getApprovedBoatListings } from "@/lib/listings-store";
import { getTcmbRates } from "@/lib/tcmb-rates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tekne İlanları | TekneShop",
  description:
    "Sıfır, ikinci el ve kiralık tekne ilanları. Motoryat, yelkenli, jet ski ve daha fazlası — TekneShop.",
  openGraph: {
    title: "Tekne İlanları | TekneShop",
    description: "Sıfır ve ikinci el tekne ilanlarını inceleyin, satıcıya mesaj veya teklif gönderin.",
  },
};

function matchesQuery(
  boat: { title: string; slug: string; location: string; listingNumber?: number },
  q: string,
) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  if (/^\d+$/.test(needle) && String(boat.listingNumber ?? "").includes(needle)) return true;
  return (
    boat.title.toLowerCase().includes(needle) ||
    boat.slug.toLowerCase().includes(needle) ||
    boat.location.toLowerCase().includes(needle)
  );
}

export default async function TeknePage({
  searchParams,
}: {
  searchParams: Promise<{ sira?: string; q?: string }>;
}) {
  const params = await searchParams;
  const sort = parseListingSort(params.sira);
  const q = (params.q || "").trim();
  const [boatListings, user, rates] = await Promise.all([
    getApprovedBoatListings(),
    getCurrentUser(),
    getTcmbRates(),
  ]);
  const filtered = q ? boatListings.filter((b) => matchesQuery(b, q)) : boatListings;
  const items = sortPublicBoats(filtered, sort, rates);
  const favKeys =
    user && isDbConfigured() ? await getUserFavoriteKeys(user.id) : null;
  const showFavorite = isDbConfigured();
  const siteUrl = getSiteUrl();

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: q ? `Tekne arama: ${q}` : "Tekne İlanları",
    numberOfItems: items.length,
    itemListElement: items.slice(0, 30).map((boat, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${siteUrl}/tekne/ilan/${boat.slug}`,
      name: boat.title,
    })),
  };

  const title = q ? `Arama: ${q}` : "Tekne İlanları";

  return (
    <>
      <JsonLd data={itemListLd} />
      <ListingPageHeader
        title={title}
        count={items.length}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tekne İlanları", href: q ? "/tekne" : undefined },
          ...(q ? [{ label: `“${q}”` }] : []),
        ]}
      />
      <div className="border-b border-border bg-[#fafafa] px-4 py-2">
        <TekneCategoryLinks activeHref="/tekne" compact />
      </div>
      <Suspense fallback={<div className="h-12 border-b border-border" />}>
        <ListingToolbar count={items.length} title={title} />
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
          <p className="px-4 py-12 text-center text-[13px] text-muted">
            {q ? (
              <>
                “{q}” için sonuç bulunamadı.{" "}
                <a href="/tekne" className="font-medium text-navy hover:underline">
                  Tüm ilanlara dön
                </a>
              </>
            ) : (
              "Henüz yayınlanmış tekne ilanı yok."
            )}
          </p>
        )}
      </div>
    </>
  );
}
