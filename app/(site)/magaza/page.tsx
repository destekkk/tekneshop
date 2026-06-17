import CsyProductCard from "@/components/CsyProductCard";
import ListingPageHeader from "@/components/ListingPageHeader";
import ListingToolbar from "@/components/ListingToolbar";
import ListingWithAds from "@/components/ListingWithAds";
import { csyProducts } from "@/lib/csy-products";

export const metadata = {
  title: "Marin Mağaza | TekneShop",
  description: "Tekne malzemeleri, boya, elektrik ve elektronik ürün kataloğu.",
};

export default function MagazaPage() {
  return (
    <>
      <ListingPageHeader
        title="Marin Mağaza"
        count={csyProducts.length}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Marin Mağaza" },
        ]}
      />
      <ListingToolbar count={csyProducts.length} title="Tüm ürünler" />
      <div>
        <ListingWithAds
          items={csyProducts}
          getKey={(p) => p.slug}
          renderItem={(p) => <CsyProductCard product={p} />}
        />
      </div>
    </>
  );
}
