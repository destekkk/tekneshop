"use client";

import { useTransition } from "react";
import { bulkApproveAction } from "@/lib/admin/actions";

export default function BulkApproveButton({ count }: { count: number }) {
  const [pending, start] = useTransition();
  if (count === 0) return null;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`${count} ilanın tamamı onaylansın mı?`)) {
          start(() => bulkApproveAction());
        }
      }}
      className="rounded bg-emerald-600 px-4 py-2 text-[13px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
    >
      {pending ? "Onaylanıyor…" : `Tümünü onayla (${count})`}
    </button>
  );
}
