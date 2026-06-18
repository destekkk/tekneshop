"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { replyListingInquiryAction, reportListingInquiryAction } from "@/lib/user-actions";
import type { OwnerListingInquiry } from "@/lib/listing-inquiries-store";

const initial = { ok: false, message: "", error: "" };

const btnBase =
  "rounded px-2 py-1 text-[11px] font-semibold whitespace-nowrap disabled:opacity-50";

function formatShortDate(date: Date) {
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InlineReportForm({
  inquiryId,
  onClose,
}: {
  inquiryId: number;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(reportListingInquiryAction, initial);

  if (state.ok) {
    return (
      <p className="border-t border-border bg-emerald-50/60 px-3 py-1.5 text-[11px] text-emerald-800">
        {state.message}
      </p>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-wrap items-center gap-2 border-t border-border bg-rose-50/40 px-3 py-2"
    >
      <input type="hidden" name="inquiryId" value={inquiryId} />
      <input
        name="reason"
        required
        placeholder="Şikayet gerekçesi (kısa)"
        className="min-w-0 flex-1 rounded border border-border px-2 py-1 text-[12px]"
      />
      <button
        type="submit"
        disabled={pending}
        className={`${btnBase} bg-rose-600 text-white`}
      >
        {pending ? "…" : "Gönder"}
      </button>
      <button type="button" onClick={onClose} className="text-[11px] text-muted hover:text-foreground">
        İptal
      </button>
      {state.error ? (
        <span className="w-full text-[11px] text-rose-700">{state.error}</span>
      ) : null}
    </form>
  );
}

function InlineReplyForm({
  inquiryId,
  onClose,
}: {
  inquiryId: number;
  onClose: () => void;
}) {
  const [state, action, pending] = useActionState(replyListingInquiryAction, initial);

  if (state.ok) {
    return (
      <p className="border-t border-border bg-emerald-50/60 px-3 py-1.5 text-[11px] text-emerald-800">
        {state.message}
      </p>
    );
  }

  return (
    <form
      action={action}
      className="flex flex-wrap items-center gap-2 border-t border-border bg-sky-50/40 px-3 py-2"
    >
      <input type="hidden" name="inquiryId" value={inquiryId} />
      <input
        name="reply"
        required
        placeholder="Yanıtınızı yazın"
        className="min-w-0 flex-1 rounded border border-border px-2 py-1 text-[12px]"
      />
      <button
        type="submit"
        disabled={pending}
        className={`${btnBase} bg-navy text-white`}
      >
        {pending ? "…" : "Gönder"}
      </button>
      <button type="button" onClick={onClose} className="text-[11px] text-muted hover:text-foreground">
        İptal
      </button>
      {state.error ? (
        <span className="w-full text-[11px] text-rose-700">{state.error}</span>
      ) : null}
    </form>
  );
}

export default function SellerInquiriesManager({
  inquiries,
}: {
  inquiries: OwnerListingInquiry[];
}) {
  const [reportId, setReportId] = useState<number | null>(null);
  const [replyId, setReplyId] = useState<number | null>(null);

  if (inquiries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-[13px] text-muted">
        İlanlarınıza henüz mesaj gelmemiş.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-card">
      {inquiries.map((m) => (
        <div key={m.id}>
          <div
            className={`flex items-start gap-2 px-3 py-2 sm:items-center sm:gap-3 ${
              !m.read ? "bg-sky-50/50" : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] text-muted">
                {m.listingSlug ? (
                  <Link
                    href={`/tekne/ilan/${m.listingSlug}`}
                    className="font-medium text-navy hover:underline"
                  >
                    {m.listingTitle || "İlan"}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{m.listingTitle || "İlan"}</span>
                )}
                <span className="mx-1">·</span>
                <span>{m.senderName}</span>
                <span className="mx-1">·</span>
                <span>{formatShortDate(new Date(m.createdAt))}</span>
                {m.reported ? (
                  <>
                    <span className="mx-1">·</span>
                    <span className="text-rose-700">Şikayetli</span>
                  </>
                ) : null}
                {m.canSellerReply === false ? (
                  <>
                    <span className="mx-1">·</span>
                    <span className="text-muted">Yanıtlandı</span>
                  </>
                ) : null}
              </p>
              <div className="mt-0.5 space-y-1">
                <p className="line-clamp-2 text-[12px] leading-snug text-foreground">
                  <span className="font-medium text-muted">Gelen: </span>
                  {m.latestBuyerMessage ?? m.message}
                </p>
                {m.latestSellerMessage ? (
                  <p className="line-clamp-2 text-[12px] leading-snug text-sky-900">
                    <span className="font-medium text-sky-800">Yanıtınız: </span>
                    {m.latestSellerMessage}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
              {m.canSellerReply ? (
                <button
                  type="button"
                  onClick={() => {
                    setReplyId((id) => (id === m.id ? null : m.id));
                    setReportId(null);
                  }}
                  className={`${btnBase} bg-navy text-white`}
                >
                  Cevapla
                </button>
              ) : null}
              {m.reported ? null : (
                <button
                  type="button"
                  onClick={() => {
                    setReportId((id) => (id === m.id ? null : m.id));
                    setReplyId(null);
                  }}
                  className={`${btnBase} border border-rose-200 bg-white text-rose-700`}
                >
                  Şikayet et
                </button>
              )}
            </div>
          </div>

          {replyId === m.id && m.canSellerReply ? (
            <InlineReplyForm inquiryId={m.id} onClose={() => setReplyId(null)} />
          ) : null}
          {reportId === m.id && !m.reported ? (
            <InlineReportForm inquiryId={m.id} onClose={() => setReportId(null)} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
