import ListingImageGallery from "@/components/ListingImageGallery";
import StatusBadge from "@/components/admin/StatusBadge";
import { boatTypeLabel, conditionLabel, formatPrice } from "@/lib/boats";
import { parseListingCurrency } from "@/lib/listing-currency";
import { formatListingNumber } from "@/lib/listing-number";
import type { Listing } from "@/lib/db/schema";

export default function AdminListingPreview({ listing }: { listing: Listing }) {
  const galleryImages = [listing.image, ...(listing.images ?? [])].filter(
    (src): src is string => Boolean(src) && src.length > 0,
  );

  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-navy">Önizleme</h2>
        <StatusBadge status={listing.status} />
      </div>
      <p className="mb-3 text-[11px] text-muted">
        İlan sitede böyle görünecek{listing.status !== "approved" ? " (onay sonrası)" : ""}.
      </p>
      <div className="space-y-4">
        <ListingImageGallery images={galleryImages} alt={listing.title} />
        <div>
          {listing.listingNumber ? (
            <p className="text-[12px] font-bold text-navy">
              İlan No: {formatListingNumber(listing.listingNumber)}
            </p>
          ) : null}
          <h3 className="mt-1 text-[18px] font-bold">{listing.title}</h3>
          <p className="mt-2 text-[20px] font-bold text-navy">
            {formatPrice(listing.price, parseListingCurrency(listing.currency))}
          </p>
        </div>
        <table className="w-full border-collapse text-[13px]">
          <tbody>
            {listing.condition ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">İlan tipi</td>
                <td className="py-2 font-medium">{conditionLabel(listing.condition)}</td>
              </tr>
            ) : null}
            {listing.boatType ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Kategori</td>
                <td className="py-2 font-medium">{boatTypeLabel(listing.boatType)}</td>
              </tr>
            ) : null}
            {listing.brand ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Marka</td>
                <td className="py-2 font-medium">{listing.brand}</td>
              </tr>
            ) : null}
            {listing.model ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Model</td>
                <td className="py-2 font-medium">{listing.model}</td>
              </tr>
            ) : null}
            {listing.year ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Yıl</td>
                <td className="py-2 font-medium">{listing.year}</td>
              </tr>
            ) : null}
            {listing.lengthM ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Boy</td>
                <td className="py-2 font-medium">{listing.lengthM} m</td>
              </tr>
            ) : null}
            {listing.location ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Konum</td>
                <td className="py-2 font-medium">{listing.location}</td>
              </tr>
            ) : null}
            {listing.engine ? (
              <tr className="border-b border-border">
                <td className="py-2 pr-4 text-muted">Motor</td>
                <td className="py-2 font-medium">{listing.engine}</td>
              </tr>
            ) : null}
          </tbody>
        </table>
        {listing.description ? (
          <div>
            <p className="text-[12px] font-semibold text-muted">Açıklama</p>
            <p className="mt-1 whitespace-pre-wrap text-[13px]">{listing.description}</p>
          </div>
        ) : null}
        <div className="rounded-lg border border-border bg-[#fafafa] p-3 text-[12px]">
          <p className="font-semibold">İletişim (admin görünümü)</p>
          <p className="mt-1 text-muted">
            {listing.contactName || "—"} · {listing.contactPhone || "—"} · {listing.contactEmail || "—"}
          </p>
          <p className="mt-1 text-muted">
            {listing.showContactPhone ? "Telefon ilanda görünür" : "Mesajla iletişim (telefon gizli)"}
          </p>
        </div>
      </div>
    </div>
  );
}
