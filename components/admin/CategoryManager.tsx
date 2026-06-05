"use client";

import { useTransition } from "react";
import { deleteCategoryAction, saveCategoryAction } from "@/lib/admin/actions";
import type { CategoryTree } from "@/lib/categories-store";

type Props = {
  tree: CategoryTree[];
  dbConnected: boolean;
};

export default function CategoryManager({ tree, dbConnected }: Props) {
  const [pending, start] = useTransition();

  if (!dbConnected) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
        Kategori düzenlemek için Neon veritabanı gerekli. Lokalde{" "}
        <code>npm run db:push</code> ve <code>npm run db:seed</code> çalıştırın.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Yeni ana kategori</h2>
        <form action={(fd) => start(() => saveCategoryAction(fd))} className="mt-3 grid gap-3 sm:grid-cols-2">
          <input name="label" required placeholder="Kategori adı" className="rounded border border-border px-3 py-2 text-sm" />
          <input name="slug" placeholder="slug (boş = otomatik)" className="rounded border border-border px-3 py-2 text-sm" />
          <select name="navType" className="rounded border border-border px-3 py-2 text-sm">
            <option value="magaza">Mağaza (/magaza/...)</option>
            <option value="tekne">Tekne (/tekne/...)</option>
            <option value="custom">Özel link</option>
          </select>
          <input name="href" placeholder="Özel link (custom için)" className="rounded border border-border px-3 py-2 text-sm" />
          <input name="sortOrder" type="number" defaultValue={0} placeholder="Sıra" className="rounded border border-border px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input name="featured" type="checkbox" /> Öne çıkan
          </label>
          <button type="submit" disabled={pending} className="btn-cta rounded-sm px-4 py-2 text-sm font-bold sm:col-span-2">
            Ana kategori ekle
          </button>
        </form>
      </section>

      {tree.map((main) => (
        <section key={main.id} className="rounded-lg border border-border bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-bold text-navy">{main.label}</h2>
              <p className="text-[12px] text-muted">
                {main.navType} · /{main.slug} · sıra {main.sortOrder}
                {main.featured ? " · vitrin" : ""}
              </p>
            </div>
            {main.id > 0 ? (
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  if (confirm(`"${main.label}" ve alt kategorileri silinsin mi?`)) {
                    start(() => deleteCategoryAction(main.id));
                  }
                }}
                className="rounded border border-rose-200 bg-rose-50 px-3 py-1 text-[12px] font-semibold text-rose-700"
              >
                Sil
              </button>
            ) : null}
          </div>

          <form action={(fd) => start(() => saveCategoryAction(fd))} className="mt-3 grid gap-2 border-t border-border pt-3 sm:grid-cols-4">
            <input type="hidden" name="id" value={main.id > 0 ? main.id : ""} />
            <input name="label" defaultValue={main.label} className="rounded border border-border px-2 py-1.5 text-sm" />
            <input name="slug" defaultValue={main.slug} className="rounded border border-border px-2 py-1.5 text-sm" />
            <input name="sortOrder" type="number" defaultValue={main.sortOrder} className="rounded border border-border px-2 py-1.5 text-sm" />
            <button type="submit" disabled={pending || main.id < 0} className="rounded border border-border px-2 py-1.5 text-[12px] font-semibold hover:bg-[#fafafa]">
              Güncelle
            </button>
          </form>

          <ul className="mt-3 space-y-2">
            {main.children.map((sub) => (
              <li key={sub.id} className="flex flex-wrap items-center gap-2 rounded bg-[#fafafa] px-3 py-2">
                <form action={(fd) => start(() => saveCategoryAction(fd))} className="flex flex-1 flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={sub.id > 0 ? sub.id : ""} />
                  <input name="label" defaultValue={sub.label} className="min-w-[140px] flex-1 rounded border border-border px-2 py-1 text-[12px]" />
                  <input name="slug" defaultValue={sub.slug} className="w-32 rounded border border-border px-2 py-1 text-[12px]" />
                  <input name="sortOrder" type="number" defaultValue={sub.sortOrder} className="w-16 rounded border border-border px-2 py-1 text-[12px]" />
                  <button type="submit" disabled={pending || sub.id < 0} className="text-[11px] font-semibold text-navy hover:underline">
                    Kaydet
                  </button>
                </form>
                {sub.id > 0 ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => start(() => deleteCategoryAction(sub.id))}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Sil
                  </button>
                ) : null}
              </li>
            ))}
          </ul>

          <form action={(fd) => start(() => saveCategoryAction(fd))} className="mt-3 flex flex-wrap gap-2 border-t border-dashed border-border pt-3">
            <input type="hidden" name="parentId" value={main.id > 0 ? main.id : ""} />
            <input type="hidden" name="navType" value={main.navType} />
            <input name="label" required placeholder="Alt kategori adı" className="min-w-[180px] flex-1 rounded border border-border px-2 py-1.5 text-sm" />
            <input name="slug" placeholder="slug" className="w-36 rounded border border-border px-2 py-1.5 text-sm" />
            <button type="submit" disabled={pending || main.id < 0} className="btn-cta rounded-sm px-3 py-1.5 text-[12px] font-bold">
              + Alt kategori
            </button>
          </form>
        </section>
      ))}
    </div>
  );
}
