import ListingRow from "@/components/ListingRow";
import type { CsyProduct } from "@/lib/csy-products";
import { formatPrice } from "@/lib/csy-products";

export default function CsyProductCard({ product }: { product: CsyProduct }) {
  const badges = [
    product.brand,
    ...(product.discount ? [product.discount] : []),
    ...(product.badge ? [product.badge] : []),
  ];

  return (
    <ListingRow
      href={`/urun/${product.slug}`}
      title={product.name}
      image={product.image}
      location={`${product.mainLabel} › ${product.subLabel}`}
      details={product.description}
      price={formatPrice(product.price)}
      badges={badges}
    />
  );
}
