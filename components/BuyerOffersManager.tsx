"use client";

import Link from "next/link";
import { useTransition } from "react";
import { acceptCounterOfferAction, rejectCounterOfferAction } from "@/lib/user-actions";
import { formatPrice } from "@/lib/boats";
import { formatListingNumber } from "@/lib/listing-number";
import type { BuyerOfferWithDetails } from "@/lib/offers-store";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  withdrawn: "bg-zinc-100 text-zinc-600",
  countered: "bg-sky-100 text-sky-800",
};

const statusLabels: Record<string, string> = {
  pending: "İlan sahibinde",
  accepted: "Kabul edildi",
  rejected: "Reddedildi",
  withdrawn: "Geri çekildi",
  countered: "Karşı teklif",
};

function CounterOfferActions({ offerId }: { offerId: number }) {
  const [pending, start] = useTransition();

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => acceptCounterOfferAction(offerId))}
        className="rounded bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
      >
        Karşı teklifi kabul et
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => rejectCounterOfferAction(offerId))}
        className="rounded bg-rose-600 px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
      >
        Reddet
      </button>
    </div>
  );
}

export default function BuyerOffersManager({ offers }: { offers: BuyerOfferWithDetails[] }) {
  return (
    <div className="space-y-3">
      {offers.map((offer) => {
        const isUnread =
          !offer.buyerRead && (offer.status === "accepted" || offer.status === "countered");

        return (
          <article
            key={offer.id}
            className={`rounded-lg border bg-card p-4 ${
              isUnread ? "border-emerald-400 bg-emerald-50/40" : "border-border"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[11px] font-semibold ${statusStyles[offer.status] || statusStyles.pending}`}
                  >
                    {statusLabels[offer.status] || offer.status}
                  </span>
                  <p className="text-[18px] font-bold text-navy">{formatPrice(offer.amount)}</p>
                </div>
                <p className="mt-2 font-semibold text-foreground">
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
                <p className="text-[11px] text-muted">
                  {new Date(offer.createdAt).toLocaleString("tr-TR")}
                </p>
                {offer.message ? (
                  <p className="mt-2 whitespace-pre-wrap text-[13px]">{offer.message}</p>
                ) : null}

                {offer.status === "countered" && offer.counterAmount ? (
                  <div className="mt-3 rounded border border-sky-200 bg-sky-50 px-3 py-2 text-[13px] text-sky-900">
                    <p className="font-semibold">
                      İlan sahibi karşı teklif gönderdi: {formatPrice(offer.counterAmount)}
                    </p>
                    {offer.counterMessage ? (
                      <p className="mt-1 text-[12px] text-muted">{offer.counterMessage}</p>
                    ) : null}
                    <p className="mt-2 text-[12px]">
                      Karşı teklifi kabul ederseniz anlaşma bu tutar üzerinden tamamlanır.
                    </p>
                    <CounterOfferActions offerId={offer.id} />
                  </div>
                ) : null}

                {offer.status === "accepted" ? (
                  <div className="mt-3 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-[13px] text-emerald-900">
                    <p className="font-semibold">
                      Teklifiniz onaylandı, ilan sahibi ile iletişim kurunuz.
                    </p>
                    {offer.listingContactPhone ? (
                      <p className="mt-2">
                        {offer.listingContactName ? (
                          <span className="font-medium">{offer.listingContactName} · </span>
                        ) : null}
                        <a
                          href={`tel:${offer.listingContactPhone.replace(/\s/g, "")}`}
                          className="font-bold text-navy hover:underline"
                        >
                          {offer.listingContactPhone}
                        </a>
                      </p>
                    ) : (
                      <p className="mt-2 text-[12px] text-muted">
                        Telefon bilgisi ilan kaydında yok; ilan sayfasından mesaj gönderebilirsiniz.
                      </p>
                    )}
                  </div>
                ) : null}

                {offer.status === "pending" ? (
                  <p className="mt-2 text-[12px] text-muted">
                    Teklifiniz doğrudan ilan sahibine iletildi; yanıt bekleniyor.
                  </p>
                ) : null}

                {offer.listingSlug ? (
                  <Link
                    href={`/tekne/ilan/${offer.listingSlug}`}
                    className="mt-2 inline-block text-[12px] text-navy hover:underline"
                  >
                    İlanı görüntüle →
                  </Link>
                ) : null}
              </div>
            </div>
          </article>
        );
      })}
      {offers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-[#fafafa] px-4 py-8 text-center text-[13px] text-muted">
          Henüz teklif vermediniz.
        </p>
      ) : null}
    </div>
  );
}
