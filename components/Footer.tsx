export default function Footer() {
  return (
    <footer
      id="iletisim"
      className="mt-auto border-t border-border bg-[#fafafa] text-foreground ml-[220px] lg:ml-[240px]"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">
        <div>
          <p className="font-bold text-navy">TekneShop</p>
          <p className="mt-2 max-w-sm text-[12px] text-muted">
            Sıfır ve ikinci el tekne, yedek parça ilan platformu.
          </p>
        </div>
        <div className="text-[12px] text-muted">
          <p className="font-semibold text-foreground">İletişim</p>
          <p className="mt-2">
            <a href="/iletisim" className="text-navy hover:underline">
              Bize yazın →
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
