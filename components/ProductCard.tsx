import ListingRow from "@/components/ListingRow";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

const conditionLabel = { sifir: "Sıfır", "ikinci-el": "İkinci El" } as const;

export default function ProductCard({ product }: { product: Product }) {
  const badges = [
    ...(product.condition ? [conditionLabel[product.condition]] : []),
    ...(product.badge ? [product.badge] : []),
  ];

  return (
    <ListingRow
      href={`/urun/${product.slug}`}
      title={product.name}
      image={product.image}
      location={product.category}
      details={product.description}
      price={formatPrice(product.price)}
      badges={badges.length > 0 ? badges : undefined}
    />
  );
}
