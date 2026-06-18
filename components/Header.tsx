import Link from "next/link";
import { Suspense } from "react";
import { Anchor } from "lucide-react";
import HeaderAuth from "@/components/HeaderAuth";
import { HEADER_HEIGHT } from "@/lib/layout-constants";

export default function Header() {
  return (
    <header className="border-b border-border bg-card" style={{ height: HEADER_HEIGHT }}>
      <div className="flex h-full items-center gap-4 px-5 lg:gap-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 pr-2"
          style={{ minWidth: "11rem" }}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-md bg-navy text-white">
            <Anchor size={26} strokeWidth={2.25} />
          </span>
          <span className="text-[26px] font-bold leading-none tracking-tight text-navy">
            Tekne<span className="text-turquoise">Shop</span>
          </span>
        </Link>

        <form
          action="/magaza"
          method="get"
          className="flex h-12 min-w-0 flex-1 items-stretch lg:flex-none lg:max-w-[31%] lg:w-[31%]"
        >
          <input
            type="search"
            name="q"
            placeholder="Kelime, ilan no veya ürün ara"
            className="min-w-0 flex-1 border border-border border-r-0 px-4 text-[15px] outline-none focus:border-navy"
          />
          <button
            type="submit"
            className="btn-navy shrink-0 px-10 text-[15px] font-bold"
            style={{ minWidth: "6.5rem" }}
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
    </header>
  );
}
