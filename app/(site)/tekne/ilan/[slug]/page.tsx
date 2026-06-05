import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ListingThumbnail from "@/components/ListingThumbnail";
import WhatsAppLink from "@/components/WhatsAppLink";
import { getSiteConfig } from "@/lib/admin/settings";
import { getSiteUrl } from "@/lib/email/config";
import {
  boatTypeLabels,
  conditionLabels,
  formatPrice,
  boatListings,
} from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import { getBoatBySlug } from "@/lib/listings-store";

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
  const [boat, config] = await Promise.all([getBoatBySlug(slug), getSiteConfig()]);
  if (!boat) notFound();
  const listingUrl = `${getSiteUrl()}/tekne/ilan/${slug}`;

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
          <ListingThumbnail src={boat.image} alt={boat.title} size="detail" />
        </div>
        <div className="flex-1">
          {boat.listingNumber ? (
            <p className="text-[13px] font-bold text-navy">
              İlan No: {formatListingNumber(boat.listingNumber)}
            </p>
          ) : null}
          <h1 className="mt-1 text-[20px] font-bold text-foreground">{boat.title}</h1>
          <p className="mt-3 text-[22px] font-bold text-navy">{formatPrice(boat.price)}</p>
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
                <td className="py-2 font-medium">{conditionLabels[boat.condition]}</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Kategori</td>
                <td className="py-2 font-medium">{boatTypeLabels[boat.boatType]}</td>
              </tr>
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
          <div className="mt-8 flex flex-wrap gap-3">
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
            ) : (
              <button type="button" className="btn-cta rounded-sm px-8 py-3 text-sm">
                Satıcıya mesaj gönder (yakında)
              </button>
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
