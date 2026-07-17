import Link from "next/link";
import { Suspense } from "react";
import HeaderAuth from "@/components/HeaderAuth";
import { HEADER_HEIGHT } from "@/lib/layout-constants";

/** Sol menü ile aynı genişlik — SiteShell ml-[220px]/lg:ml-[240px] */
const LOGO_COL =
  "flex h-full w-[220px] shrink-0 items-center border-r border-border px-4 lg:w-[240px]";

export default function Header() {
  return (
    <header className="border-b border-border bg-card" style={{ height: HEADER_HEIGHT }}>
      <div className="flex h-full items-center">
        <Link href="/" className={LOGO_COL}>
          <span className="text-[24px] font-bold leading-none tracking-tight text-navy">
            Tekne<span className="text-turquoise">Shop</span>
          </span>
        </Link>

        {/* SiteTitleBar / liste ile aynı px-4 — ürün listesi sol kenarı */}
        <div className="flex h-full min-w-0 flex-1 items-center gap-3 px-4 lg:gap-4">
          <form
            action="/magaza"
            method="get"
            className="flex h-10 min-w-0 flex-1 items-stretch overflow-hidden border border-border lg:max-w-[min(36rem,55%)] lg:flex-none lg:w-[min(36rem,55%)]"
          >
            <input
              type="search"
              name="q"
              placeholder="Kelime, ilan no veya ürün ara"
              className="h-full min-w-0 flex-1 border-0 bg-white px-3 text-[12px] leading-none outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="btn-navy flex h-full shrink-0 items-center justify-center px-7 text-[12px] font-bold leading-none"
              style={{ minWidth: "5.2rem" }}
            >
              Ara
            </button>
          </form>

          <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
            <Suspense fallback={<span className="h-10 w-32 animate-pulse rounded bg-[#eee]" />}>
              <HeaderAuth />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
