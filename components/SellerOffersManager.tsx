"use client";

import Link from "next/link";
import { useTransition } from "react";
import { acceptOfferAsSellerAction, rejectOfferAsSellerAction } from "@/lib/user-actions";
import { formatPrice } from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import type { OfferWithDetails } from "@/lib/offers-store";

const statusLabels: Record<string, string> = {
  pending: "Bekliyor",
  accepted: "Onaylandı",
  rejected: "Reddedildi",
  withdrawn: "Geri çekildi",
  countered: "Karşı teklif",
};

export default function SellerOffersManager({ offers }: { offers: OfferWithDetails[] }) {
  const [pending, start] = useTransition();

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className={`flex flex-wrap items-center gap-2 px-3 py-2.5 sm:gap-3 ${
            offer.status === "pending" ? "bg-amber-50/40" : ""
          }`}
        >
          <div className="min-w-0 flex-1 text-[13px]">
            <span className="font-semibold text-navy">{formatPrice(offer.amount)}</span>
            <span className="mx-1.5 text-muted">·</span>
            {offer.listingSlug ? (
              <Link
                href={`/tekne/ilan/${offer.listingSlug}`}
                className="font-medium text-foreground hover:text-navy hover:underline"
              >
                {offer.listingTitle || "İlan"}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{offer.listingTitle || "İlan"}</span>
            )}
            {offer.listingNumber ? (
              <span className="ml-1 font-mono text-[11px] text-muted">
                #{formatListingNumber(offer.listingNumber)}
              </span>
            ) : null}
            <span className="mx-1.5 text-muted">·</span>
            <span className="text-muted">{offer.userName || offer.userEmail || "—"}</span>
            {offer.status !== "pending" ? (
              <>
                <span className="mx-1.5 text-muted">·</span>
                <span className="text-[12px] text-muted">
                  {statusLabels[offer.status] || offer.status}
                </span>
              </>
            ) : null}
          </div>

          {offer.status === "pending" ? (
            <div className="flex shrink-0 gap-1.5">
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => acceptOfferAsSellerAction(offer.id))}
                className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
              >
                Onayla
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => rejectOfferAsSellerAction(offer.id))}
                className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
              >
                Reddet
              </button>
            </div>
          ) : null}
        </div>
      ))}
      {offers.length === 0 ? (
        <p className="px-4 py-8 text-center text-[13px] text-muted">
          İlanlarınıza henüz teklif gelmemiş.
        </p>
      ) : null}
    </div>
  );
}
