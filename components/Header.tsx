import Link from "next/link";
import { Anchor } from "lucide-react";
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
          className="flex h-12 min-w-0 flex-1 items-stretch lg:max-w-[62%]"
        >
          <input
            type="search"
            name="q"
            placeholder="Kelime, ilan no veya ürün ara"
            className="min-w-0 flex-1 border border-border border-r-0 px-4 text-[15px] outline-none focus:border-navy"
          />
          <button
            type="submit"
            className="btn-cta shrink-0 px-10 text-[15px] font-bold"
            style={{ minWidth: "6.5rem" }}
          >
            Ara
          </button>
        </form>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <Link
            href="/giris"
            className="whitespace-nowrap px-4 py-2.5 text-[14px] text-foreground hover:text-navy"
          >
            Giriş Yap
          </Link>
          <Link
            href="/ilan-ver"
            className="btn-cta whitespace-nowrap rounded-sm px-5 py-2.5 text-[14px]"
          >
            Ücretsiz İlan Ver
          </Link>
        </div>
      </div>
    </header>
  );
}
