import { Suspense } from "react";
import HeaderAuth from "@/components/HeaderAuth";
import { HEADER_HEIGHT } from "@/lib/layout-constants";

export default function Header() {
  return (
    <header className="border-b border-border bg-card" style={{ height: HEADER_HEIGHT }}>
      <div className="flex h-full items-center gap-4 px-5 lg:gap-6 lg:px-8">
        <form
          action="/magaza"
          method="get"
          className="flex h-10 min-w-0 flex-1 items-stretch lg:flex-none lg:max-w-[42%] lg:w-[42%]"
        >
          <input
            type="search"
            name="q"
            placeholder="Kelime, ilan no veya ürün ara"
            className="min-w-0 flex-1 border border-border border-r-0 px-3 text-[12px] outline-none focus:border-navy"
          />
          <button
            type="submit"
            className="btn-navy shrink-0 px-7 text-[12px] font-bold"
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
    </header>
  );
}
