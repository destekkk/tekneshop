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

  return (
    <div className="space-y-3">
      {inquiries.map((m) => (
        <article
          key={m.id}
          className={`rounded-lg border p-4 ${m.read ? "border-border bg-white" : "border-navy/30 bg-[#f0f9f8]"}`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-bold">{m.listingTitle || "İlan mesajı"}</p>
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
          <p className="mt-2 text-[13px] whitespace-pre-wrap">{m.message}</p>
          <p className="mt-2 text-[11px] text-muted">İlan ID: {m.listingId}</p>
        </article>
      ))}
      {inquiries.length === 0 ? (
        <p className="text-[13px] text-muted">Henüz ilan mesajı yok.</p>
      ) : null}
    </div>
  );
}
