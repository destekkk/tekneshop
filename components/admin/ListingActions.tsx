"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  approveListingAction,
  archiveListingAction,
  deleteListingAction,
  rejectListingAction,
  toggleFeaturedAction,
} from "@/lib/admin/actions";

type Props = {
  id: number;
  status: string;
  isFeatured: boolean;
};

export default function ListingActions({ id, status, isFeatured }: Props) {
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap gap-1.5">
      <Link
        href={`/admin/ilanlar/${id}`}
        className="rounded border border-navy/20 bg-navy/5 px-2.5 py-1 text-[11px] font-semibold text-navy hover:bg-navy/10"
      >
        İncele
      </Link>
      {status === "pending" ? (
        <>
          <button
            type="button"
            disabled={pending}
            onClick={() => start(() => approveListingAction(id))}
            className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Onayla
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              const reason = prompt("Red sebebi:");
              if (reason) start(() => rejectListingAction(id, reason));
            }}
            className="rounded bg-rose-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            Reddet
          </button>
        </>
      ) : null}

      {status === "approved" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => toggleFeaturedAction(id, !isFeatured))}
          className="rounded border border-border bg-white px-2.5 py-1 text-[11px] font-semibold hover:bg-[#fafafa] disabled:opacity-50"
        >
          {isFeatured ? "Vitrinden çıkar" : "Vitrine al"}
        </button>
      ) : null}

      {status !== "archived" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => archiveListingAction(id))}
          className="rounded border border-border bg-white px-2.5 py-1 text-[11px] font-semibold hover:bg-[#fafafa] disabled:opacity-50"
        >
          Arşivle
        </button>
      ) : null}

      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("İlan kalıcı olarak silinsin mi?")) {
            start(() => deleteListingAction(id));
          }
        }}
        className="rounded border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
      >
        Sil
      </button>
    </div>
  );
}
