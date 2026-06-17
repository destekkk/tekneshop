import FavoriteButton from "@/components/FavoriteButton";
import ListingRow from "@/components/ListingRow";
import type { CsyProduct } from "@/lib/csy-products";
import { formatPrice } from "@/lib/csy-products";

type Props = {
  product: CsyProduct;
  isFavorited?: boolean;
  showFavorite?: boolean;
};

export default function CsyProductCard({
  product,
  isFavorited = false,
  showFavorite = false,
}: Props) {
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
      favoriteSlot={
        showFavorite ? (
          <FavoriteButton
            kind="product"
            slug={product.slug}
            productName={product.name}
            initialFavorited={isFavorited}
            compact
          />
        ) : undefined
      }
    />
  );
}
