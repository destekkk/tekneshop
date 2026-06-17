"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { adminLogoutAction } from "@/lib/admin/actions";

export default function AdminTopBar({
  email,
  unreadCount = 0,
}: {
  email: string;
  unreadCount?: number;
}) {
  return (
    <div className="sticky top-0 z-20">
      {unreadCount > 0 ? (
        <div className="border-b border-rose-500 bg-rose-600 px-4 py-2 text-center">
          <Link
            href="/admin/mesajlar"
            className="text-[12px] font-bold text-white hover:underline"
          >
            Mesaj var! {unreadCount} okunmamış mesaj — görüntülemek için tıklayın
          </Link>
        </div>
      ) : null}
      <header className="flex items-center justify-between gap-3 border-b border-border bg-white px-4 py-3 lg:px-6">
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-navy">Yönetim Paneli</p>
        <p className="truncate text-[11px] text-muted">{email || "admin"}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden rounded border border-border px-3 py-1.5 text-[12px] font-medium text-muted hover:bg-[#fafafa] sm:inline-block"
        >
          Siteyi görüntüle
        </Link>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded border border-rose-200 bg-rose-50 px-3 py-1.5 text-[12px] font-semibold text-rose-700 hover:bg-rose-100"
          >
            <LogOut size={14} />
            Çıkış
          </button>
        </form>
      </div>
      </header>
    </div>
  );
}
