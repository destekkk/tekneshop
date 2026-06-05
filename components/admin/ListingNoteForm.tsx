"use client";

import { useTransition } from "react";
import { saveListingNoteAction } from "@/lib/admin/actions";

export default function ListingNoteForm({ id, notes }: { id: number; notes?: string | null }) {
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => start(() => saveListingNoteAction(fd))}
      className="mt-2 flex gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <input
        name="adminNotes"
        defaultValue={notes || ""}
        placeholder="Admin notu (sadece panelde görünür)"
        className="min-w-0 flex-1 rounded border border-border px-2 py-1 text-[12px]"
      />
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded border border-border px-2 py-1 text-[11px] font-semibold hover:bg-[#fafafa] disabled:opacity-50"
      >
        Not
      </button>
    </form>
  );
}
