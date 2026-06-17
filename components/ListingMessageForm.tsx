"use client";

import Link from "next/link";
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

  if (!user) {
    return (
      <div className="max-w-md rounded-lg border border-border bg-[#fafafa] p-3">
        <p className="text-[12px] font-semibold text-navy">Satıcıya mesaj gönder</p>
        <p className="mt-1 text-[11px] text-muted">Mesaj göndermek için giriş yapmanız gerekir.</p>
        <Link
          href={`/giris?redirect=${encodeURIComponent(`/tekne/ilan/${listingSlug}`)}`}
          className="btn-cta mt-2.5 inline-block rounded-sm px-4 py-1.5 text-[12px] font-bold"
        >
          Giriş yap / Kayıt ol
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md rounded-lg border border-border bg-[#fafafa] p-3">
      <p className="text-[12px] font-semibold text-navy">Satıcıya mesaj gönder</p>
      <p className="mt-0.5 text-[11px] text-muted">
        Telefon gizli — mesajınız satıcıya iletilir.
      </p>

      {state.message ? (
        <p className="mt-2 rounded bg-emerald-50 px-2 py-1.5 text-[12px] text-emerald-800">{state.message}</p>
      ) : null}
      {state.error ? (
        <p className="mt-2 rounded bg-rose-50 px-2 py-1.5 text-[12px] text-rose-800">{state.error}</p>
      ) : null}

      <form action={action} className="mt-2.5 space-y-2">
        <input type="hidden" name="listingId" value={listingId} />
        <input type="hidden" name="listingSlug" value={listingSlug} />
        <input type="hidden" name="listingTitle" value={listingTitle} />

        <p className="text-[11px] text-muted">
          Gönderen: {user.name} ({user.email})
        </p>

        <div>
          <label className="text-[11px] font-medium">Mesajınız *</label>
          <textarea
            name="message"
            required
            rows={2}
            placeholder="Merhaba, bu ilan hakkında bilgi almak istiyorum…"
            className="mt-0.5 w-full resize-y rounded border border-border px-2 py-1.5 text-[13px]"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="btn-cta rounded-sm px-4 py-1.5 text-[12px] font-bold disabled:opacity-50"
        >
          {pending ? "Gönderiliyor…" : "Mesaj Gönder"}
        </button>
      </form>
    </div>
  );
}
