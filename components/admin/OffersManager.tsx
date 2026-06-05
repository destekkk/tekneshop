"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  acceptOfferAction,
  deleteOfferAction,
  rejectOfferAction,
} from "@/lib/admin/actions";
import { formatPrice } from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import type { OfferWithDetails } from "@/lib/offers-store";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  withdrawn: "bg-zinc-100 text-zinc-600",
};

const statusLabels: Record<string, string> = {
  pending: "Bekliyor",
  accepted: "Kabul",
  rejected: "Red",
  withdrawn: "Geri çekildi",
};

export default function OffersManager({
  offers,
  dbConnected,
}: {
  offers: OfferWithDetails[];
  dbConnected: boolean;
}) {
  const [pending, start] = useTransition();

  if (!dbConnected) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
        Teklifler için veritabanı gerekli. <code>npm run db:push</code> çalıştırın.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {offers.map((offer) => (
        <article key={offer.id} className="rounded-lg border border-border bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-semibold ${statusStyles[offer.status] || statusStyles.pending}`}
                >
                  {statusLabels[offer.status] || offer.status}
                </span>
                <p className="text-[18px] font-bold text-navy">{formatPrice(offer.amount)}</p>
              </div>
              <p className="mt-2 font-semibold">
                {offer.listingTitle || "İlan"}
                {offer.listingNumber ? (
                  <span className="ml-2 font-mono text-[12px] text-muted">
                    #{formatListingNumber(offer.listingNumber)}
                  </span>
                ) : null}
              </p>
              {offer.listingPrice ? (
                <p className="text-[12px] text-muted">İlan fiyatı: {formatPrice(offer.listingPrice)}</p>
              ) : null}
              <p className="mt-2 text-[12px] text-muted">
                Teklif veren: {offer.userName || "—"} · {offer.userEmail || "—"}
                {offer.userPhone ? ` · ${offer.userPhone}` : ""}
              </p>
              <p className="text-[11px] text-muted">
                {new Date(offer.createdAt).toLocaleString("tr-TR")}
              </p>
              {offer.message ? (
                <p className="mt-2 text-[13px] whitespace-pre-wrap">{offer.message}</p>
              ) : null}
              {offer.listingSlug ? (
                <Link
                  href={`/tekne/ilan/${offer.listingSlug}`}
                  className="mt-2 inline-block text-[12px] text-navy hover:underline"
                  target="_blank"
                >
                  İlanı görüntüle →
                </Link>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {offer.status === "pending" ? (
                <>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => start(() => acceptOfferAction(offer.id))}
                    className="rounded bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white"
                  >
                    Kabul et
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => start(() => rejectOfferAction(offer.id))}
                    className="rounded bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white"
                  >
                    Reddet
                  </button>
                </>
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm("Teklif silinsin mi?")) start(() => deleteOfferAction(offer.id));
                }}
                className="rounded border border-rose-200 px-3 py-1.5 text-[11px] font-semibold text-rose-700"
              >
                Sil
              </button>
            </div>
          </div>
        </article>
      ))}
      {offers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-white p-8 text-center text-[13px] text-muted">
          Henüz teklif yok.
        </p>
      ) : null}
    </div>
  );
}
