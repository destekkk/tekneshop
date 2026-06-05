"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuSections } from "@/lib/navigation";
import { STICKY_TOP } from "@/lib/layout-constants";

export default function CategorySidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 z-30 flex w-[220px] flex-col border-r border-border bg-card lg:w-[240px]"
      style={{ top: STICKY_TOP, height: `calc(100vh - ${STICKY_TOP}px)` }}
      aria-label="Kategori menüsü"
    >
      <p className="shrink-0 border-b border-border bg-[#fafafa] px-3 py-2.5 text-[12px] font-bold uppercase tracking-wide text-navy">
        Tüm Kategoriler
      </p>
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1">
        {menuSections.map((section) => {
          const sectionActive =
            pathname === section.href || pathname.startsWith(`${section.href}/`);

          return (
            <div key={section.id} className="border-b border-border/60 last:border-0">
              <Link
                href={section.href}
                className={`block px-3 py-2 text-[13px] font-bold transition-colors ${
                  sectionActive
                    ? "bg-[#e8f6f5] text-navy"
                    : "text-navy hover:bg-[#f5f5f5]"
                }`}
              >
                {section.label}
              </Link>
              <ul className="pb-2">
                {section.children.map((item) => {
                  const itemActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`block py-1.5 pl-5 pr-3 text-[12px] leading-snug transition-colors ${
                          itemActive
                            ? "bg-[#e8f6f5] font-semibold text-navy"
                            : "text-foreground hover:bg-[#f5f5f5] hover:text-navy"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
