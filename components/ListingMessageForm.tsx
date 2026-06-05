"use client";

import { useActionState } from "react";
import { submitListingInquiryAction } from "@/lib/user-actions";

const initial = { ok: false, message: "", error: "" };

export default function ListingMessageForm({
  listingId,
  listingSlug,
  listingTitle,
  user,
}: {
  listingId: number;
  listingSlug: string;
  listingTitle: string;
  user: { name: string; email: string } | null;
}) {
  const [state, action, pending] = useActionState(submitListingInquiryAction, initial);

  return (
    <div className="rounded-lg border border-border bg-[#fafafa] p-4">
      <p className="text-[13px] font-semibold text-navy">Satıcıya mesaj gönder</p>
      <p className="mt-1 text-[12px] text-muted">
        İlan veren telefonunu gizlemiş. Mesajınız iletilecek; satıcı sizinle e-posta üzerinden iletişime
        geçebilir.
      </p>

      {state.message ? (
        <p className="mt-3 rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="mt-3 rounded bg-rose-50 px-3 py-2 text-[13px] text-rose-800">{state.error}</p>
      ) : null}

      <form action={action} className="mt-4 space-y-3">
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="listingSlug" value={listingSlug} />
        <input type="hidden" name="listingTitle" value={listingTitle} />

        {!user ? (
          <>
            <div>
              <label className="text-[12px] font-medium">Ad Soyad *</label>
              <input
                name="senderName"
                required
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium">E-posta *</label>
              <input
                name="senderEmail"
                type="email"
                required
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium">Telefon (isteğe bağlı)</label>
              <input
                name="senderPhone"
                type="tel"
                className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
              />
            </div>
          </>
        ) : (
          <p className="text-[12px] text-muted">
            Gönderen: {user.name} ({user.email})
          </p>
        )}

        <div>
          <label className="text-[12px] font-medium">Mesajınız *</label>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="Merhaba, bu ilan hakkında bilgi almak istiyorum…"
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn-cta rounded-sm px-6 py-2.5 text-sm font-bold disabled:opacity-50"
        >
          {pending ? "Gönderiliyor…" : "Mesaj Gönder"}
        </button>
      </form>
    </div>
  );
}
