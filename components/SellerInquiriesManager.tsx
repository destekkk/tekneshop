"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { reportListingInquiryAction } from "@/lib/user-actions";
import type { OwnerListingInquiry } from "@/lib/listing-inquiries-store";

const initial = { ok: false, message: "", error: "" };

function ReportForm({ inquiryId }: { inquiryId: number }) {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(reportListingInquiryAction, initial);

  if (state.ok) {
    return (
      <p className="mt-2 rounded bg-emerald-50 px-2 py-1.5 text-[12px] text-emerald-800">
        {state.message}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-2 text-[12px] font-medium text-rose-700 hover:underline"
      >
        Mesajı şikayet et
      </button>
    );
  }

  return (
    <form action={action} className="mt-2 space-y-2 rounded border border-rose-200 bg-rose-50/50 p-2.5">
      <input type="hidden" name="inquiryId" value={inquiryId} />
      <p className="text-[11px] font-semibold text-rose-800">Yönetime şikayet et</p>
      {state.error ? (
        <p className="rounded bg-rose-100 px-2 py-1 text-[11px] text-rose-800">{state.error}</p>
      ) : null}
      <textarea
        name="reason"
        required
        rows={2}
        placeholder="Neden şikayet ediyorsunuz? (spam, hakaret, dolandırıcılık vb.)"
        className="w-full resize-y rounded border border-border px-2 py-1.5 text-[12px]"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-rose-700 px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-50"
        >
          {pending ? "Gönderiliyor…" : "Şikayeti Gönder"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[11px] text-muted hover:text-foreground"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}

export default function SellerInquiriesManager({
  inquiries,
}: {
  inquiries: OwnerListingInquiry[];
}) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
        <p className="text-[13px] text-muted">İlanlarınıza henüz mesaj gelmemiş.</p>
        <p className="mt-2 text-[12px] text-muted">
          Telefonu gizlediğiniz ilanlara gelen mesajlar burada görünür.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inquiries.map((m) => (
        <article key={m.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              {m.listingSlug ? (
                <Link
                  href={`/tekne/ilan/${m.listingSlug}`}
                  className="font-bold text-navy hover:underline"
                >
                  {m.listingTitle || "İlan"}
                </Link>
              ) : (
                <p className="font-bold">{m.listingTitle || "İlan"}</p>
              )}
              <p className="mt-1 text-[12px] text-muted">
                {m.senderName} · {m.senderEmail}
                {m.senderPhone ? ` · ${m.senderPhone}` : ""} ·{" "}
                {new Date(m.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>
            {m.reported ? (
              <span className="rounded bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-800">
                Şikayet iletildi
              </span>
            ) : null}
          </div>
          <p className="mt-2 whitespace-pre-wrap text-[13px]">{m.message}</p>
          {m.reported ? (
            m.reportReason ? (
              <p className="mt-2 rounded bg-[#fafafa] px-2 py-1.5 text-[11px] text-muted">
                <span className="font-semibold text-foreground">Şikayet gerekçeniz:</span>{" "}
                {m.reportReason}
              </p>
            ) : null
          ) : (
            <ReportForm inquiryId={m.id} />
          )}
        </article>
      ))}
    </div>
  );
}
