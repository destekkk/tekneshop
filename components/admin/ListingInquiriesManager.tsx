"use client";

import { useTransition } from "react";
import {
  deleteListingInquiryAction,
  markListingInquiryReadAction,
} from "@/lib/admin/actions";
import type { ListingInquiry } from "@/lib/db/schema";

export default function ListingInquiriesManager({
  inquiries,
  dbConnected,
}: {
  inquiries: ListingInquiry[];
  dbConnected: boolean;
}) {
  const [pending, start] = useTransition();

  if (!dbConnected) return null;

  const reportedCount = inquiries.filter((m) => m.reported).length;

  return (
    <div className="space-y-3">
      {reportedCount > 0 ? (
        <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12px] text-rose-800">
          <strong>{reportedCount}</strong> şikayet edilmiş mesaj var — öncelikli inceleyin.
        </p>
      ) : null}
      {inquiries.map((m) => (
        <article
          key={m.id}
          className={`rounded-lg border p-4 ${
            m.reported
              ? "border-rose-300 bg-rose-50/60"
              : m.read
                ? "border-border bg-white"
                : "border-navy/30 bg-[#f0f9f8]"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold">{m.listingTitle || "İlan mesajı"}</p>
                {m.reported ? (
                  <span className="rounded bg-rose-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Şikayet
                  </span>
                ) : null}
              </div>
              <p className="text-[12px] text-muted">
                {m.senderName} · {m.senderEmail}
                {m.senderPhone ? ` · ${m.senderPhone}` : ""} ·{" "}
                {new Date(m.createdAt).toLocaleString("tr-TR")}
              </p>
            </div>
            <div className="flex gap-2">
              {!m.read ? (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => start(() => markListingInquiryReadAction(m.id))}
                  className="rounded bg-navy px-2 py-1 text-[11px] text-white"
                >
                  Okundu
                </button>
              ) : null}
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => deleteListingInquiryAction(m.id))}
                className="text-[11px] text-rose-600"
              >
                Sil
              </button>
            </div>
          </div>
          <p className="inquiry-msg-body mt-2 whitespace-pre-wrap">{m.message}</p>
          {m.reported && m.reportReason ? (
            <div className="mt-3 rounded border border-rose-200 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold text-rose-800">İlan sahibi şikayeti</p>
              <p className="mt-1 whitespace-pre-wrap text-[12px] text-foreground">{m.reportReason}</p>
              {m.reportedAt ? (
                <p className="mt-1 text-[10px] text-muted">
                  {new Date(m.reportedAt).toLocaleString("tr-TR")}
                </p>
              ) : null}
            </div>
          ) : null}
          <p className="mt-2 text-[11px] text-muted">İlan ID: {m.listingId}</p>
        </article>
      ))}
      {inquiries.length === 0 ? (
        <p className="text-[13px] text-muted">Henüz ilan mesajı yok.</p>
      ) : null}
    </div>
  );
}
