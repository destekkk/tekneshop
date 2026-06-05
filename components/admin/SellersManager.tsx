"use client";

import { useState, useTransition } from "react";
import {
  deleteListingSellerAction,
  saveListingSellerAction,
  syncListingSellersAction,
} from "@/lib/admin/actions";
import type { ListingSeller } from "@/lib/db/schema";

export default function SellersManager({
  sellers,
  dbConnected,
}: {
  sellers: ListingSeller[];
  dbConnected: boolean;
}) {
  const [pending, start] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  if (!dbConnected) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
        İlan veren yönetimi için Neon veritabanı gerekli.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message ? (
        <p className="rounded bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{message}</p>
      ) : null}

      <section className="rounded-lg border border-border bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold">İlanlardan aktar</h2>
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                const result = await syncListingSellersAction();
                setMessage(result.message || "Senkron tamamlandı.");
              })
            }
            className="rounded border border-border px-3 py-2 text-[12px] font-semibold hover:bg-[#fafafa]"
          >
            Mevcut ilanlardan ilan verenleri çek
          </button>
        </div>
        <p className="mt-1 text-[12px] text-muted">
          İlanlardaki iletişim bilgilerinden otomatik kayıt oluşturur.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-white p-4">
        <h2 className="text-sm font-bold">Yeni ilan veren ekle</h2>
        <form
          action={(fd) => start(() => saveListingSellerAction(fd))}
          className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <label className="text-[12px] font-medium">Ad Soyad / Firma *</label>
            <input name="name" required className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">E-posta</label>
            <input name="email" type="email" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">Telefon</label>
            <input name="phone" type="tel" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">Firma</label>
            <input name="company" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-[12px] font-medium">Şehir</label>
            <input name="city" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <label className="text-[12px] font-medium">Not</label>
            <input name="notes" className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input name="active" type="checkbox" defaultChecked />
            Aktif
          </label>
          <button type="submit" disabled={pending} className="btn-cta rounded-sm px-4 py-2 text-sm font-bold">
            Ekle
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-white">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-bold">Kayıtlı ilan verenler ({sellers.length})</h2>
        </div>
        {sellers.length === 0 ? (
          <p className="p-8 text-center text-[13px] text-muted">Henüz kayıt yok.</p>
        ) : (
          <div className="divide-y divide-border">
            {sellers.map((s) => (
              <article key={s.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy">{s.name}</h3>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          s.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {s.active ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                    <p className="mt-1 text-[12px] text-muted">
                      {[s.email, s.phone, s.company, s.city].filter(Boolean).join(" · ") || "—"}
                    </p>
                    {s.notes ? <p className="mt-1 text-[12px]">{s.notes}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                      className="rounded border border-border px-3 py-1 text-[12px] font-semibold hover:bg-[#fafafa]"
                    >
                      {editingId === s.id ? "Kapat" : "Düzenle"}
                    </button>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`"${s.name}" silinsin mi?`)) {
                          start(() => deleteListingSellerAction(s.id));
                        }
                      }}
                      className="rounded border border-rose-200 bg-rose-50 px-3 py-1 text-[12px] font-semibold text-rose-700"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                {editingId === s.id ? (
                  <form
                    action={(fd) => start(() => saveListingSellerAction(fd))}
                    className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <input type="hidden" name="id" value={s.id} />
                    <div>
                      <label className="text-[12px] font-medium">Ad Soyad / Firma</label>
                      <input name="name" defaultValue={s.name} required className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">E-posta</label>
                      <input name="email" type="email" defaultValue={s.email || ""} className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">Telefon</label>
                      <input name="phone" defaultValue={s.phone || ""} className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">Firma</label>
                      <input name="company" defaultValue={s.company || ""} className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-[12px] font-medium">Şehir</label>
                      <input name="city" defaultValue={s.city || ""} className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-3">
                      <label className="text-[12px] font-medium">Not</label>
                      <input name="notes" defaultValue={s.notes || ""} className="mt-1 w-full rounded border border-border px-3 py-2 text-sm" />
                    </div>
                    <label className="flex items-center gap-2 text-sm">
                      <input name="active" type="checkbox" defaultChecked={s.active} />
                      Aktif
                    </label>
                    <button type="submit" disabled={pending} className="rounded border border-border bg-[#fafafa] px-4 py-2 text-[12px] font-semibold sm:col-span-2 lg:col-span-3">
                      Güncelle
                    </button>
                  </form>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
