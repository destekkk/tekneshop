import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const detail = await getApprovedBoatDetail(slug);
  return { title: detail ? `${detail.boat.title} | TekneShop` : "İlan" };
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
  const listingUrl = `${getSiteUrl()}/tekne/ilan/${slug}`;
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

  return (
    <div>
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
          <div className="mt-4 w-full">
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
          </div>
        </div>
        <div className="min-w-0 flex-1 lg:relative">
          {listing ? (
            <div className="mt-4 w-full max-w-[312px] lg:absolute lg:right-4 lg:top-0 lg:mt-0">
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
            </div>
          ) : null}
          <div className={listing ? "lg:pr-[268px]" : undefined}>
            {boat.listingNumber ? (
              <p className="text-[13px] font-bold text-navy">
                İlan No: {formatListingNumber(boat.listingNumber)}
              </p>
            ) : null}
            <h1 className="mt-1 text-[20px] font-bold text-foreground">{boat.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <p className="text-[22px] font-bold text-navy">
                {formatPrice(
                  boat.price,
                  parseListingCurrency(listing?.currency ?? boat.currency),
                )}
              </p>
              {listing && isDbConfigured() ? (
                <FavoriteButton kind="listing" slug={slug} initialFavorited={isFavorited} />
              ) : null}
            </div>

            <table className="mt-4 w-fit border-collapse text-[13px]">
              <tbody>
              {boat.listingNumber ? (
                <tr className="border-b border-border">
                  <td className="py-2 pr-4 text-muted">İlan numarası</td>
                  <td className="py-2 font-medium font-mono">{formatListingNumber(boat.listingNumber)}</td>
                </tr>
              ) : null}
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">İlan tipi</td>
                <td className="py-2 font-medium">{conditionText}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Kategori</td>
                <td className="py-2 font-medium">{boatTypeText}</td>
              </tr>
              {listing?.brand ? (
                <tr className="border-b border-border">
                  <td className="py-2 pr-4 text-muted">Marka</td>
                  <td className="py-2 font-medium">{listing.brand}</td>
                </tr>
              ) : null}
              {listing?.model ? (
                <tr className="border-b border-border">
                  <td className="py-2 pr-4 text-muted">Model</td>
                  <td className="py-2 font-medium">{listing.model}</td>
                </tr>
              ) : null}
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Yıl</td>
                <td className="py-2 font-medium">{boat.year}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Boy</td>
                <td className="py-2 font-medium">{boat.lengthM} m</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Konum</td>
                <td className="py-2 font-medium">{boat.location}</td>
              </tr>
              {boat.engine && (
                <tr className="border-b border-border">
                  <td className="py-2 pr-4 text-muted">Motor</td>
                  <td className="py-2 font-medium">{boat.engine}</td>
                </tr>
              )}
              </tbody>
            </table>
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
