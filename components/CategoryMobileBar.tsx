"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { menuSections } from "@/lib/navigation";

export default function CategoryMobileBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-card md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-sm font-semibold text-navy"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
        Tüm Kategoriler
      </button>
      {open && (
        <div className="max-h-[60vh] overflow-y-auto border-t border-border pb-2">
          {menuSections.map((section) => (
            <div key={section.id} className="border-b border-border/60">
              <Link
                href={section.href}
                onClick={() => setOpen(false)}
                className="block bg-[#fafafa] px-4 py-2.5 text-sm font-bold text-navy"
              >
                {section.label}
              </Link>
              <ul>
                {section.children.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block py-2 pl-6 pr-4 text-[13px] ${
                        pathname === item.href ? "font-semibold text-navy" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
