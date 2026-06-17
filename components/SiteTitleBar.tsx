import Link from "next/link";
import { Suspense } from "react";
import HeaderUserLinks from "@/components/HeaderUserLinks";

export default function SiteTitleBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#fafafa] px-4 py-2.5">
      <div className="min-w-0">
        <Link href="/" className="text-[15px] font-bold text-foreground hover:text-navy">
          Vitrin — Tekne & Deniz İlanları
        </Link>
        <p className="mt-0.5 hidden text-[12px] text-muted sm:block">
          Tüm kategoriler solda listelenir; istediğiniz alt kategoriye tıklayın.
        </p>
      </div>
      <Suspense fallback={<span className="h-8 w-40 animate-pulse rounded bg-[#eee]" />}>
        <HeaderUserLinks />
      </Suspense>
    </div>
  );
}
