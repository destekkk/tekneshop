"use client";

import Link from "next/link";
import { useTransition } from "react";
import { fieldValue, preserveFormKey } from "@/lib/form-preserve";
import { usePreserveFormAction } from "@/lib/use-preserve-form-action";
import {
  acceptCounterOfferAction,
  rejectCounterOfferAction,
  submitOfferAction,
} from "@/lib/user-actions";
import { formatPrice } from "@/lib/boats";
import type { ListingOffer } from "@/lib/db/schema";

const initial = { ok: false, message: "", error: "" };

const statusLabels: Record<string, string> = {
  pending: "İnceleniyor",
  accepted: "Kabul edildi",
  rejected: "Reddedildi",
  withdrawn: "Geri çekildi",
  countered: "Karşı teklif",
};

function CounterOfferButtons({ offerId }: { offerId: number }) {
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

export default function OfferForm({
  listingId,
  listingSlug,
  listingTitle,
  listingPrice,
  minOfferAmount,
  user,
  existingOffer,
  sellerContact,
}: {
  listingId: number;
  listingSlug: string;
  listingTitle: string;
  listingPrice: number;
  minOfferAmount?: number;
  user: { id: number; name: string; email: string } | null;
  existingOffer: ListingOffer | null;
  sellerContact?: { name: string | null; phone: string | null } | null;
}) {
  const { state, action, pending, values } = usePreserveFormAction(submitOfferAction, initial);
  const formKey = preserveFormKey(state, values);

  if (!user) {
    return (
      <div className="w-full rounded-lg border border-border bg-[#fafafa] p-4">
        <p className="text-[13px] font-semibold text-navy">Teklif ver</p>
        <p className="mt-1 text-[13px] text-muted">
          Bu ilana teklif vermek için giriş yapmanız gerekir.
        </p>
        <Link
          href={`/giris?redirect=${encodeURIComponent(`/tekne/ilan/${listingSlug}`)}`}
          className="btn-cta mt-3 inline-block rounded-sm px-5 py-2 text-sm font-bold"
        >
          Giriş yap / Kayıt ol
        </Link>
      </div>
    );
  }

  if (existingOffer && existingOffer.status !== "rejected") {
    return (
      <div className="w-full rounded-lg border border-navy/20 bg-[#f0f9f8] p-4">
        <p className="text-[13px] font-semibold text-navy">Teklifiniz</p>
        <p className="mt-2 text-[18px] font-bold text-navy">{formatPrice(existingOffer.amount)}</p>
        {existingOffer.message ? (
          <p className="mt-2 text-[13px] text-muted">{existingOffer.message}</p>
        ) : null}
        <p className="mt-2 text-[12px] font-semibold text-navy">
          Durum: {statusLabels[existingOffer.status] || existingOffer.status}
        </p>
        {existingOffer.status === "accepted" ? (
          <div className="mt-3 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-[12px] text-emerald-900">
            <p className="font-semibold">
              Teklifiniz onaylandı, ilan sahibi ile iletişim kurunuz.
            </p>
            {sellerContact?.phone ? (
              <p className="mt-2">
                {sellerContact.name ? (
                  <span className="font-medium">{sellerContact.name} · </span>
                ) : null}
                <a
                  href={`tel:${sellerContact.phone.replace(/\s/g, "")}`}
                  className="font-bold text-navy hover:underline"
                >
                  {sellerContact.phone}
                </a>
              </p>
            ) : null}
          </div>
        ) : existingOffer.status === "countered" && existingOffer.counterAmount ? (
          <div className="mt-3 rounded border border-sky-200 bg-sky-50 px-3 py-2 text-[12px] text-sky-900">
            <p className="font-semibold">
              Karşı teklif: {formatPrice(existingOffer.counterAmount)}
            </p>
            {existingOffer.counterMessage ? (
              <p className="mt-1 text-[11px] text-muted">{existingOffer.counterMessage}</p>
            ) : null}
            <CounterOfferButtons offerId={existingOffer.id} />
          </div>
        ) : existingOffer.status === "pending" ? (
          <p className="mt-2 text-[12px] text-muted">
            Teklifiniz ilan sahibine iletildi; yanıt bekleniyor.
          </p>
        ) : null}
        <p className="mt-1 text-[11px] text-muted">
          {new Date(existingOffer.createdAt).toLocaleString("tr-TR")}
        </p>
        <Link
          href="/teklifler?tab=verdigim"
          className="mt-3 inline-block text-[12px] text-navy hover:underline"
        >
          Teklifler →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border border-border bg-white p-4">
      <p className="text-[13px] font-semibold text-navy">Teklif ver</p>
      <p className="mt-1 text-[12px] leading-snug text-muted">
        {listingTitle}
        {listingPrice ? (
          <>
            <br />
            <span className="text-[11px]">İlan: {formatPrice(listingPrice)}</span>
          </>
        ) : null}
      </p>
      {minOfferAmount ? (
        <p className="mt-2 text-[11px] text-muted">
          Minimum teklif: {formatPrice(minOfferAmount)} (ilan fiyatının %70&apos;i)
        </p>
      ) : null}

      {state.message ? (
        <p className="mt-3 rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">
          {state.message}
        </p>
      ) : null}
      {state.error ? (
        <p className="mt-3 rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <form key={formKey} action={action} className="mt-4 space-y-3">
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="listingSlug" value={listingSlug} />

        <div>
          <label className="text-[12px] font-medium">Teklif tutarı (₺) *</label>
          <input
            name="amount"
            type="text"
            inputMode="numeric"
            required
            placeholder="Örn. 2500000"
            defaultValue={fieldValue(values, "amount")}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-[12px] font-medium">Not (isteğe bağlı)</label>
          <textarea
            name="message"
            rows={2}
            placeholder="Ödeme koşulu, teslim süresi vb."
            defaultValue={fieldValue(values, "message")}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>

        <p className="text-[11px] text-muted">
          Giriş: {user.name} ({user.email})
        </p>

        <button
          type="submit"
          disabled={pending}
          className="btn-cta w-full rounded-sm px-4 py-2 text-[13px] font-bold disabled:opacity-50"
        >
          {pending ? "Gönderiliyor…" : "Teklif Gönder"}
        </button>
      </form>
    </div>
  );
}
