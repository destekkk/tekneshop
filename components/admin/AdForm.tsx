"use client";

import { useTransition } from "react";
import { deleteAdAction, saveAdAction } from "@/lib/admin/actions";
import type { Ad } from "@/lib/db/schema";

export default function AdForm({ ad }: { ad?: Ad }) {
  const [pending, start] = useTransition();

  return (
    <form
      action={(fd) => start(() => saveAdAction(fd))}
      className="space-y-3 rounded-lg border border-border bg-white p-4"
    >
      {ad ? <input type="hidden" name="id" value={ad.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-medium">Yerleşim</label>
          <select
            name="placement"
            defaultValue={ad?.placement || "top_banner"}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          >
            <option value="top_banner">Üst banner</option>
            <option value="inline_list">Liste içi</option>
          </select>
        </div>
        <div>
          <label className="text-[12px] font-medium">Slot (liste içi)</label>
          <input
            name="slot"
            type="number"
            defaultValue={ad?.slot ?? 1}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-[12px] font-medium">Başlık</label>
        <input
          name="title"
          required
          defaultValue={ad?.title || ""}
          className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-[12px] font-medium">Alt metin</label>
        <input
          name="subtitle"
          defaultValue={ad?.subtitle || ""}
          className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-medium">Görsel URL</label>
          <input
            name="imageUrl"
            defaultValue={ad?.imageUrl || ""}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-[12px] font-medium">Link URL</label>
          <input
            name="linkUrl"
            defaultValue={ad?.linkUrl || "/ilan-ver"}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-[12px] font-medium">Öncelik</label>
          <input
            name="priority"
            type="number"
            defaultValue={ad?.priority ?? 0}
            className="mt-1 w-full rounded border border-border px-3 py-2 text-sm"
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input name="active" type="checkbox" defaultChecked={ad?.active ?? true} />
          Aktif
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="btn-cta rounded-sm px-4 py-2 text-sm font-bold disabled:opacity-50"
        >
          {ad ? "Güncelle" : "Reklam ekle"}
        </button>
        {ad ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm("Reklam silinsin mi?")) start(() => deleteAdAction(ad.id));
            }}
            className="rounded border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
          >
            Sil
          </button>
        ) : null}
      </div>
    </form>
  );
}
