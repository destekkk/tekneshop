import Link from "next/link";

const conditionLinks = [
  { href: "/tekne/sifir", label: "Sıfır Tekne" },
  { href: "/tekne/ikinci-el", label: "İkinci El" },
  { href: "/tekne/kiralik", label: "Günlük Kiralık" },
] as const;

const typeLinks = [
  { href: "/tekne/motoryat", label: "Motoryat" },
  { href: "/tekne/yelkenli", label: "Yelkenli" },
  { href: "/tekne/sisme-bot", label: "Şişme Bot" },
  { href: "/tekne/jet-ski", label: "Jet Ski" },
] as const;

type Props = {
  activeHref?: string;
  compact?: boolean;
};

export default function TekneCategoryLinks({ activeHref, compact = false }: Props) {
  const chip =
    "inline-flex shrink-0 items-center rounded border border-border bg-white px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:border-navy/30 hover:bg-[#f5f5f5]";
  const chipActive = "border-navy bg-[#e8f6f5] font-semibold text-navy";

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <div className="flex flex-nowrap items-center gap-1.5 overflow-x-auto pb-0.5">
        {conditionLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${chip} ${activeHref === item.href ? chipActive : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {typeLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${chip} ${activeHref === item.href ? chipActive : ""}`}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/tekne" className={`${chip} text-muted hover:text-foreground`}>
          Tümü
        </Link>
      </div>
    </div>
  );
}
