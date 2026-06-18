import Link from "next/link";
import { notFound } from "next/navigation";
import AdminListingEditForm from "@/components/admin/AdminListingEditForm";
import AdminListingPreview from "@/components/admin/AdminListingPreview";
import ListingActions from "@/components/admin/ListingActions";
import ListingNoteForm from "@/components/admin/ListingNoteForm";
import StatusBadge from "@/components/admin/StatusBadge";
import { isDbConfigured } from "@/lib/db";
import { formatListingNumber } from "@/lib/listing-number";
import { getListingBrandModelSuggestions, getListingById } from "@/lib/listings-store";

type Props = { params: Promise<{ id: string }> };

export default async function AdminListingDetailPage({ params }: Props) {
  const { id } = await params;
  const listingId = Number(id);
  if (!listingId || Number.isNaN(listingId)) notFound();

  if (!isDbConfigured()) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
        İlan detayı için veritabanı bağlantısı gerekli.
      </div>
    );
  }

  const listing = await getListingById(listingId);
  if (!listing) notFound();

  const suggestions = await getListingBrandModelSuggestions();

  const backHref =
    listing.status === "pending"
      ? "/admin/ilanlar?tab=bekleyen"
      : listing.status === "rejected"
        ? "/admin/ilanlar?tab=reddedilen"
        : listing.status === "approved"
          ? "/admin/ilanlar?tab=onayli"
          : "/admin/ilanlar";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={backHref} className="text-[12px] font-medium text-navy hover:underline">
            ← İlanlara dön
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-navy">{listing.title}</h1>
            <StatusBadge status={listing.status} />
          </div>
          <p className="mt-1 text-[13px] text-muted">
            #{formatListingNumber(listing.listingNumber)} · {listing.slug} ·{" "}
            {new Date(listing.createdAt).toLocaleString("tr-TR")}
          </p>
          {listing.rejectionReason ? (
            <p className="mt-2 text-[13px] text-rose-700">Red sebebi: {listing.rejectionReason}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {listing.status === "approved" ? (
            <Link
              href={`/tekne/ilan/${listing.slug}`}
              target="_blank"
              className="rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
            >
              Canlıda aç ↗
            </Link>
          ) : null}
          <ListingActions
            id={listing.id}
            status={listing.status}
            isFeatured={listing.isFeatured}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <AdminListingPreview listing={listing} />
        <AdminListingEditForm
          listing={listing}
          brandSuggestionsFromDb={suggestions.brands}
          modelSuggestionsFromDb={suggestions.models}
        />
      </div>

      <ListingNoteForm id={listing.id} notes={listing.adminNotes} />
    </div>
  );
}
