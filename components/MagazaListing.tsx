import Link from "next/link";
import CsyProductCard from "@/components/CsyProductCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import type { CsyMainCategory } from "@/lib/csy-categories";
import { csySubHref } from "@/lib/csy-categories";
import type { CsyProduct } from "@/lib/csy-products";

type Props = {
  main: CsyMainCategory;
  sub?: { slug: string; label: string };
  products: CsyProduct[];
  crumbs: { label: string; href?: string }[];
};

export default function MagazaListing({ main, sub, products, crumbs }: Props) {
  const title = sub ? sub.label : main.label;

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
      <ListingToolbar count={products.length} title={title} />
      <div>
        {products.length > 0 ? (
          <ListingWithAds
            items={products}
            getKey={(p) => p.slug}
            renderItem={(p) => <CsyProductCard product={p} />}
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
