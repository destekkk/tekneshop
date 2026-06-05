import BulkApproveButton from "@/components/admin/BulkApproveButton";
import ListingActions from "@/components/admin/ListingActions";
import ListingNoteForm from "@/components/admin/ListingNoteForm";
import StatusBadge from "@/components/admin/StatusBadge";
import { formatPrice } from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import type { Listing } from "@/lib/db/schema";

export default function AdminPendingListings({ rows }: { rows: Listing[] }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <BulkApproveButton count={rows.length} />
      </div>
      {rows.map((row) => (
        <article key={row.id} className="rounded-lg border border-border bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] font-bold text-navy">
                  #{formatListingNumber(row.listingNumber)}
                </span>
                <h2 className="font-bold">{row.title}</h2>
                <StatusBadge status={row.status} />
              </div>
              <p className="mt-1 text-[13px] text-muted">
                {formatPrice(row.price)} · {row.location || "Konum yok"} · {row.condition} /{" "}
                {row.boatType}
              </p>
              {row.description ? <p className="mt-2 text-[13px]">{row.description}</p> : null}
              <p className="mt-2 text-[12px] text-muted">
                İletişim: {row.contactName || "—"} · {row.contactPhone || "—"} ·{" "}
                {row.contactEmail || "—"}
              </p>
            </div>
            <ListingActions id={row.id} status={row.status} isFeatured={row.isFeatured} />
          </div>
          <ListingNoteForm id={row.id} notes={row.adminNotes} />
        </article>
      ))}
      {rows.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-white p-8 text-center text-[13px] text-muted">
          Onay bekleyen ilan yok.
        </div>
      ) : null}
    </div>
  );
}
