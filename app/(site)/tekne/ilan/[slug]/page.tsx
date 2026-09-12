import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
import JsonLd from "@/components/JsonLd";
import ListingImageGallery from "@/components/ListingImageGallery";
import ListingContact from "@/components/ListingContact";
import OfferForm from "@/components/OfferForm";
import StaticListingContactFallback from "@/components/StaticListingContactFallback";
import { getCurrentUser } from "@/lib/auth/user-session";
import { getSiteConfig } from "@/lib/admin/settings";
import { getSiteUrl } from "@/lib/email/config";
import {
  boatTypeLabel,
  conditionLabel,
  formatPrice,
} from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import { parseListingCurrency, listingPriceInTry } from "@/lib/listing-currency";
import { getTcmbRates } from "@/lib/tcmb-rates";
import { getUserOfferForListing } from "@/lib/offers-store";
import { getApprovedBoatDetail, getListingBySlug } from "@/lib/listings-store";
import { isDbConfigured } from "@/lib/db";
import { isListingFavorited } from "@/lib/favorites-store";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function absoluteImage(src: string, siteUrl: string) {
  if (src.startsWith("http")) return src;
  return `${siteUrl}${src.startsWith("/") ? src : `/${src}`}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getApprovedBoatDetail(slug);
  if (!detail) return { title: "İlan | TekneShop" };

  const { boat } = detail;
  const siteUrl = getSiteUrl();
  const image = absoluteImage(boat.image, siteUrl);
  const priceText = formatPrice(boat.price, parseListingCurrency(boat.currency));
  const description = [
    conditionLabel(boat.condition),
    boatTypeLabel(boat.boatType),
    boat.year ? `${boat.year}` : null,
    boat.location || null,
    priceText,
  ]
    .filter(Boolean)
    .join(" · ");

  return {
    title: `${boat.title} | TekneShop`,
    description: `${boat.title} — ${description}. Doğrudan satıcıya mesaj veya teklif gönderin.`,
    openGraph: {
      title: boat.title,
      description,
      url: `${siteUrl}/tekne/ilan/${slug}`,
      type: "website",
      images: [{ url: image, alt: boat.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: boat.title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `${siteUrl}/tekne/ilan/${slug}`,
    },
  };
}

export default async function BoatDetailPage({ params }: Props) {
  const { slug } = await params;
  const [detail, config, user, rates] = await Promise.all([
    getApprovedBoatDetail(slug),
    getSiteConfig(),
    getCurrentUser(),
    getTcmbRates(),
  ]);
  if (!detail) notFound();
  const { boat } = detail;
  let listing = detail.listing;
  if (!listing && isDbConfigured()) {
    const row = await getListingBySlug(slug);
    if (row?.status === "approved") listing = row;
  }
  const siteUrl = getSiteUrl();
  const listingUrl = `${siteUrl}/tekne/ilan/${slug}`;
  const conditionText = listing?.condition
    ? conditionLabel(listing.condition)
    : conditionLabel(boat.condition);
  const boatTypeText = listing?.boatType
    ? boatTypeLabel(listing.boatType)
    : boatTypeLabel(boat.boatType);
  const existingOffer =
    user && listing ? await getUserOfferForListing(user.id, listing.id) : null;
  const listingCurrency = parseListingCurrency(listing?.currency ?? boat.currency);
  const listingTry = listing
    ? listingPriceInTry(listing.price, listingCurrency, rates)
    : listingPriceInTry(boat.price, listingCurrency, rates);
  const minOfferAmount = Math.ceil(listingTry * 0.7);
  const sellerContact =
    existingOffer?.status === "accepted" && listing
      ? { name: listing.contactName, phone: listing.contactPhone }
      : null;
  const isFavorited =
    user && listing && isDbConfigured()
      ? await isListingFavorited(user.id, slug)
      : false;
  const galleryImages = listing
    ? [listing.image, ...(listing.images ?? [])].filter(
        (src): src is string => Boolean(src) && src.length > 0,
      )
    : [boat.image];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: boat.title,
    image: galleryImages.map((src) => absoluteImage(src, siteUrl)),
    description: `${conditionText} ${boatTypeText}${boat.location ? ` — ${boat.location}` : ""}`,
    category: boatTypeText,
    brand: listing?.brand
      ? { "@type": "Brand", name: listing.brand }
      : undefined,
    offers: {
      "@type": "Offer",
      url: listingUrl,
      priceCurrency: listingCurrency === "USD" ? "USD" : listingCurrency === "EUR" ? "EUR" : "TRY",
      price: boat.price,
      availability: "https://schema.org/InStock",
      itemCondition:
        boat.condition === "sifir"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    },
  };

  return (
    <div>
      <JsonLd data={productLd} />
      <Breadcrumb
        items={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tekne İlanları", href: "/tekne" },
          { label: boat.title },
        ]}
      />
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:items-start lg:p-6">
        <div className="w-full shrink-0 lg:w-[49.4%] lg:max-w-[36.4rem]">
          <ListingImageGallery images={galleryImages} alt={boat.title} />
        </div>
        <div className="min-w-0 flex-1 lg:relative">
          {listing ? (
            <div className="mt-4 w-full max-w-[218px] shrink-0 lg:absolute lg:right-4 lg:top-0 lg:mt-0 lg:w-[218px]">
              <OfferForm
                listingId={listing.id}
                listingSlug={slug}
                listingTitle={boat.title}
                listingPrice={boat.price}
                minOfferAmount={minOfferAmount}
                user={user}
                existingOffer={existingOffer}
                sellerContact={sellerContact}
              />
              <p className="mt-2 text-[11px] leading-snug text-muted">
                Teklif gönderin; satıcı onaylarsa iletişim bilgisi açılır.
              </p>
            </div>
          ) : null}
          <div className={listing ? "lg:pr-[244px]" : undefined}>
            {listing && isDbConfigured() ? (
              <div className="mb-3">
                <FavoriteButton kind="listing" slug={slug} initialFavorited={isFavorited} />
              </div>
            ) : null}
            {boat.listingNumber ? (
              <p className="text-[12px] font-bold uppercase tracking-wide text-navy">
                İlan No: {formatListingNumber(boat.listingNumber)}
              </p>
            ) : null}
            <h1 className="mt-1 text-[22px] font-bold leading-snug text-foreground sm:text-[24px]">
              {boat.title}
            </h1>
            <p className="mt-3 text-[24px] font-bold text-navy sm:text-[26px]">
              {formatPrice(
                boat.price,
                parseListingCurrency(listing?.currency ?? boat.currency),
              )}
            </p>
            <p className="mt-2 text-[12px] text-muted">
              {conditionText} · {boatTypeText}
              {boat.location ? ` · ${boat.location}` : ""}
            </p>

            <table className="mt-5 w-fit border-collapse text-[13px]">
              <tbody>
              {boat.listingNumber ? (
                <tr>
                  <td className="py-2 pr-6 text-muted">İlan numarası</td>
                  <td className="py-2 pl-10 font-medium font-mono">{formatListingNumber(boat.listingNumber)}</td>
                </tr>
              ) : null}
              <tr>
                <td className="py-2 pr-6 text-muted">İlan tipi</td>
                <td className="py-2 pl-10 font-medium">{conditionText}</td>
              </tr>
              <tr>
                <td className="py-2 pr-6 text-muted">Kategori</td>
                <td className="py-2 pl-10 font-medium">{boatTypeText}</td>
              </tr>
              {listing?.brand ? (
                <tr>
                  <td className="py-2 pr-6 text-muted">Marka</td>
                  <td className="py-2 pl-10 font-medium">{listing.brand}</td>
                </tr>
              ) : null}
              {listing?.model ? (
                <tr>
                  <td className="py-2 pr-6 text-muted">Model</td>
                  <td className="py-2 pl-10 font-medium">{listing.model}</td>
                </tr>
              ) : null}
              <tr>
                <td className="py-2 pr-6 text-muted">Yıl</td>
                <td className="py-2 pl-10 font-medium">{boat.year}</td>
              </tr>
              <tr>
                <td className="py-2 pr-6 text-muted">Boy</td>
                <td className="py-2 pl-10 font-medium">{boat.lengthM} m</td>
              </tr>
              <tr>
                <td className="py-2 pr-6 text-muted">Konum</td>
                <td className="py-2 pl-10 font-medium">{boat.location}</td>
              </tr>
              {boat.engine && (
                <tr>
                  <td className="py-2 pr-6 text-muted">Motor</td>
                  <td className="py-2 pl-10 font-medium">{boat.engine}</td>
                </tr>
              )}
              </tbody>
            </table>

            <section className="mt-6 max-w-lg border-t border-border pt-5">
              <p className="mb-3 text-[12px] text-muted">
                Telefon gizli — mesajınız doğrudan satıcıya iletilir.
              </p>
              {listing ? (
                <ListingContact
                  listing={listing}
                  listingSlug={slug}
                  listingTitle={boat.title}
                  listingUrl={listingUrl}
                  listingNumber={boat.listingNumber}
                  siteName={config.siteName}
                  user={user}
                />
              ) : (
                <StaticListingContactFallback
                  config={config}
                  listingTitle={boat.title}
                  listingUrl={listingUrl}
                  listingNumber={boat.listingNumber}
                />
              )}
            </section>
          </div>
          <p className="mt-4">
            <Link href="/tekne" className="text-[13px] link-classified hover:underline">
              ← Listeye dön
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
