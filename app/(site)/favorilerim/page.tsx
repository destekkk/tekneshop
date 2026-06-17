import Link from "next/link";
import FavoritesManager from "@/components/FavoritesManager";
import ListingPageHeader from "@/components/ListingPageHeader";
import { requireUser } from "@/lib/auth/user-session";
import { formatPrice as formatBoatPrice } from "@/lib/boats";
import { formatPrice as formatProductPrice, getCsyProduct } from "@/lib/csy-products";
import { isDbConfigured } from "@/lib/db";
import { getUserFavorites } from "@/lib/favorites-store";
import { parseListingCurrency } from "@/lib/listing-currency";
import {
  getListingPriceHistory,
  getUserPriceAlerts,
  markUserPriceAlertsRead,
} from "@/lib/price-history-store";

export const metadata = { title: "Favorilerim | TekneShop" };

function formatDateTime(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function FavorilerimPage() {
  const user = await requireUser("/favorilerim");

  if (!isDbConfigured()) {
    return (
      <>
        <ListingPageHeader
          title="Favorilerim"
          count={0}
          crumbs={[
            { label: "Ana Sayfa", href: "/" },
            { label: "Favorilerim" },
          ]}
        />
        <div className="mx-auto max-w-2xl p-6">
          <p className="rounded-lg border border-border bg-[#fafafa] px-4 py-3 text-[13px] text-muted">
            Favoriler için veritabanı bağlantısı gerekli.
          </p>
        </div>
      </>
    );
  }

  const [favorites, alerts] = await Promise.all([
    getUserFavorites(user.id),
    getUserPriceAlerts(user.id, 20),
  ]);

  await markUserPriceAlertsRead(user.id);

  const favoriteItems = await Promise.all(
    favorites.map(async (fav) => {
      if (fav.listingId && fav.listing) {
        const history = await getListingPriceHistory(fav.listingId, 10);
        return {
          id: fav.id,
          kind: "listing" as const,
          title: fav.listing.title,
          href: `/tekne/ilan/${fav.listing.slug}`,
          priceText: formatBoatPrice(
            fav.listing.price,
            parseListingCurrency(fav.listing.currency),
          ),
          priceHistory: history.map((h) => ({
            priceText: formatBoatPrice(h.price, parseListingCurrency(h.currency)),
            recordedAt: formatDateTime(h.recordedAt),
            source: h.source,
          })),
        };
      }

      const product = fav.productSlug ? getCsyProduct(fav.productSlug) : null;
      return {
        id: fav.id,
        kind: "product" as const,
        title: product?.name || fav.productName || fav.productSlug || "Ürün",
        href: fav.productSlug ? `/urun/${fav.productSlug}` : "/magaza",
        priceText: product ? formatProductPrice(product.price) : undefined,
        priceHistory: [],
      };
    }),
  );

  const alertItems = alerts.map((alert) => ({
    id: alert.id,
    message: alert.message,
    listingHref: alert.listingSlug ? `/tekne/ilan/${alert.listingSlug}` : undefined,
    createdAt: formatDateTime(alert.createdAt),
  }));

  return (
    <>
      <ListingPageHeader
        title="Favorilerim"
        count={favoriteItems.length}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Favorilerim" },
        ]}
      />
      <div className="mx-auto max-w-2xl p-6">
        <p className="mb-6 text-[13px] text-muted">
          Favori tekne ilanlarının fiyatı değiştiğinde burada ve e-postanızda bildirim alırsınız.
          Her ilan için son 10 fiyat kaydını görebilirsiniz.
        </p>
        <FavoritesManager favorites={favoriteItems} alerts={alertItems} />
        <p className="mt-8">
          <Link href="/tekne" className="text-[13px] text-navy hover:underline">
            ← Tekne ilanları
          </Link>
        </p>
      </div>
    </>
  );
}
