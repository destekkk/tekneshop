"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Anchor,
  BarChart3,
  ClipboardList,
  CreditCard,
  FolderTree,
  LayoutDashboard,
  Megaphone,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { adminLogoutAction } from "@/lib/admin/actions";

const nav = [
  { href: "/admin", label: "Özet", icon: LayoutDashboard, exact: true },
  { href: "/admin/ilanlar/bekleyen", label: "Onay Bekleyen", icon: ShieldCheck },
  { href: "/admin/ilanlar", label: "Tüm İlanlar", icon: ClipboardList },
  { href: "/admin/kategoriler", label: "Kategoriler", icon: FolderTree },
  { href: "/admin/reklamlar", label: "Reklam Yönetimi", icon: Megaphone },
  { href: "/admin/kullanicilar", label: "Kullanıcılar", icon: Users },
  { href: "/admin/odemeler", label: "Ödemeler & Paketler", icon: CreditCard },
  { href: "/admin/raporlar", label: "Raporlar", icon: BarChart3 },
  { href: "/admin/ayarlar", label: "Site Ayarları", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-navy text-white lg:w-64">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded bg-turquoise text-navy">
          <Anchor size={18} />
        </span>
        <div>
          <p className="text-sm font-bold">TekneShop</p>
          <p className="text-[11px] text-white/60">Yönetim Paneli</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded px-3 py-2 text-[13px] transition-colors ${
                active ? "bg-white/15 font-semibold" : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-3">
        <Link
          href="/"
          target="_blank"
          className="block rounded px-3 py-2 text-[12px] text-white/70 hover:bg-white/10"
        >
          Siteyi görüntüle →
        </Link>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="w-full rounded px-3 py-2 text-left text-[12px] text-white/70 hover:bg-white/10"
          >
            Çıkış yap
          </button>
        </form>
      </div>
    </aside>
  );
}
