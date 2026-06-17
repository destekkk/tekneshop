import Link from "next/link";
import { Suspense } from "react";
import CsyProductCard from "@/components/CsyProductCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import { getCurrentUser } from "@/lib/auth/user-session";
import type { CsyMainCategory } from "@/lib/csy-categories";
import { csySubHref } from "@/lib/csy-categories";
import type { CsyProduct } from "@/lib/csy-products";
import { isDbConfigured } from "@/lib/db";
import { getUserFavoriteKeys } from "@/lib/favorites-store";

type Props = {
  main: CsyMainCategory;
  sub?: { slug: string; label: string };
  products: CsyProduct[];
  crumbs: { label: string; href?: string }[];
};

export default async function MagazaListing({ main, sub, products, crumbs }: Props) {
  const title = sub ? sub.label : main.label;
  const user = await getCurrentUser();
  const favKeys =
    user && isDbConfigured() ? await getUserFavoriteKeys(user.id) : null;
  const showFavorite = isDbConfigured();

  return (
    <>
      <ListingPageHeader title={title} count={products.length} crumbs={crumbs} />
      {!sub && (
        <div className="flex flex-wrap gap-2 border-b border-border bg-[#fafafa] px-4 py-3">
          {main.children.map((c) => (
            <Link
              key={c.slug}
              href={csySubHref(main.slug, c)}
              className="rounded border border-border bg-card px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-link hover:bg-[#f0f0f0] hover:underline"
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
      <Suspense fallback={<div className="h-12 border-b border-border" />}>
        <ListingToolbar sortable={false} count={products.length} title={title} />
      </Suspense>
      <div>
        {products.length > 0 ? (
          <ListingWithAds
            items={products}
            getKey={(p) => p.slug}
            renderItem={(p) => (
              <CsyProductCard
                product={p}
                showFavorite={showFavorite}
                isFavorited={favKeys?.productSlugs.has(p.slug) ?? false}
              />
            )}
          />
        ) : (
          <p className="px-4 py-12 text-center text-[13px] text-muted">
            Bu kategoride henüz ürün eklenmedi.
          </p>
        )}
      </div>
    </>
  );
}
