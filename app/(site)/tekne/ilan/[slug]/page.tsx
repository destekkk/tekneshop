import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FavoriteButton from "@/components/FavoriteButton";
import ListingImageGallery from "@/components/ListingImageGallery";
import ListingContact from "@/components/ListingContact";
import OfferForm from "@/components/OfferForm";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getCurrentUser } from "@/lib/auth/user-session";
import { getSiteConfig } from "@/lib/admin/settings";
import { getSiteUrl } from "@/lib/email/config";
import {
  boatTypeLabel,
  conditionLabel,
  formatPrice,
  boatListings,
} from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import { parseListingCurrency } from "@/lib/listing-currency";
import { getUserOfferForListing } from "@/lib/offers-store";
import { getBoatBySlug, getListingBySlug } from "@/lib/listings-store";
import { isDbConfigured } from "@/lib/db";
import { isListingFavorited } from "@/lib/favorites-store";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return boatListings.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const boat = await getBoatBySlug(slug);
  return { title: boat ? `${boat.title} | TekneShop` : "İlan" };
}

export default async function BoatDetailPage({ params }: Props) {
  const { slug } = await params;
  const [boat, config, listing, user] = await Promise.all([
    getBoatBySlug(slug),
    getSiteConfig(),
    getListingBySlug(slug),
    getCurrentUser(),
  ]);
  if (!boat) notFound();
  const listingUrl = `${getSiteUrl()}/tekne/ilan/${slug}`;
  const conditionText = listing?.condition
    ? conditionLabel(listing.condition)
    : conditionLabel(boat.condition);
  const boatTypeText = listing?.boatType
    ? boatTypeLabel(listing.boatType)
    : boatTypeLabel(boat.boatType);
  const existingOffer =
    user && listing ? await getUserOfferForListing(user.id, listing.id) : null;
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
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">
        <div className="max-w-lg lg:w-2/5">
          <ListingImageGallery images={galleryImages} alt={boat.title} />
        </div>
        <div className="flex-1">
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
          <table className="mt-6 w-full max-w-md border-collapse text-[13px]">
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
          <div className="mt-8 flex w-full max-w-lg flex-col items-start gap-4">
            {listing && listing.status === "approved" ? (
              <>
                <ListingContact
                  listing={listing}
                  listingSlug={slug}
                  listingTitle={boat.title}
                  listingUrl={listingUrl}
                  listingNumber={boat.listingNumber}
                  siteName={config.siteName}
                  user={user}
                />
                <OfferForm
                  listingId={listing.id}
                  listingSlug={slug}
                  listingTitle={boat.title}
                  listingPrice={boat.price}
                  user={user}
                  existingOffer={existingOffer}
                />
              </>
            ) : (
              <div className="flex flex-wrap gap-3">
                {config.whatsappNumber ? (
                  <WhatsAppLink
                    number={config.whatsappNumber}
                    siteName={config.siteName}
                    prefillMessage={config.whatsappPrefillMessage || undefined}
                    context="listing"
                    listingTitle={boat.title}
                    listingUrl={listingUrl}
                    listingNumber={boat.listingNumber}
                    variant="button"
                    label={`${config.siteName} üzerinden sor`}
                  />
                ) : null}
              </div>
            )}
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
