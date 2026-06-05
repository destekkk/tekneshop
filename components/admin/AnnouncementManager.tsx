"use client";

import { useTransition } from "react";
import { deleteAnnouncementAction, saveAnnouncementAction } from "@/lib/admin/actions";
import type { Announcement } from "@/lib/db/schema";

export default function AnnouncementManager({
  announcements,
  dbConnected,
}: {
  announcements: Announcement[];
  dbConnected: boolean;
}) {
  const [pending, start] = useTransition();

  if (!dbConnected) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-[13px]">
        Duyuru yönetimi için veritabanı gerekli.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form
        action={(fd) => start(() => saveAnnouncementAction(fd))}
        className="grid gap-3 rounded-lg border border-border bg-white p-4 sm:grid-cols-2"
      >
        <h2 className="text-sm font-bold sm:col-span-2">Yeni duyuru</h2>
        <input
          name="message"
          required
          placeholder="Örn. Ücretsiz ilan dönemi devam ediyor!"
          className="rounded border border-border px-3 py-2 text-sm sm:col-span-2"
        />
        <input name="linkUrl" placeholder="Link (opsiyonel)" className="rounded border border-border px-3 py-2 text-sm" />
        <input name="linkLabel" placeholder="Link yazısı" className="rounded border border-border px-3 py-2 text-sm" />
        <select name="tone" className="rounded border border-border px-3 py-2 text-sm">
          <option value="info">Bilgi</option>
          <option value="warning">Uyarı</option>
          <option value="success">Başarı</option>
          <option value="promo">Kampanya</option>
        </select>
        <input name="sortOrder" type="number" defaultValue={0} className="rounded border border-border px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm">
          <input name="active" type="checkbox" defaultChecked /> Aktif
        </label>
        <button type="submit" disabled={pending} className="btn-cta rounded-sm px-4 py-2 text-sm font-bold">
          Ekle
        </button>
      </form>

      <div className="space-y-3">
        {announcements.map((a) => (
          <form
            key={a.id}
            action={(fd) => start(() => saveAnnouncementAction(fd))}
            className="grid gap-2 rounded-lg border border-border bg-white p-4 sm:grid-cols-2"
          >
            <input type="hidden" name="id" value={a.id} />
            <input name="message" defaultValue={a.message} className="rounded border border-border px-2 py-1.5 text-sm sm:col-span-2" />
            <input name="linkUrl" defaultValue={a.linkUrl || ""} className="rounded border border-border px-2 py-1.5 text-sm" />
            <input name="linkLabel" defaultValue={a.linkLabel || ""} className="rounded border border-border px-2 py-1.5 text-sm" />
            <select name="tone" defaultValue={a.tone} className="rounded border border-border px-2 py-1.5 text-sm">
              <option value="info">Bilgi</option>
              <option value="warning">Uyarı</option>
              <option value="success">Başarı</option>
              <option value="promo">Kampanya</option>
            </select>
            <input name="sortOrder" type="number" defaultValue={a.sortOrder} className="rounded border border-border px-2 py-1.5 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input name="active" type="checkbox" defaultChecked={a.active} /> Aktif
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={pending} className="rounded border border-border px-3 py-1 text-[12px] font-semibold">
                Kaydet
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => start(() => deleteAnnouncementAction(a.id))}
                className="text-[12px] text-rose-600"
              >
                Sil
              </button>
            </div>
          </form>
        ))}
        {announcements.length === 0 ? (
          <p className="text-[13px] text-muted">Henüz duyuru yok.</p>
        ) : null}
      </div>
    </div>
  );
}
