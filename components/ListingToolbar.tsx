type Props = {
  count: number;
  title: string;
};

export default function ListingToolbar({ count, title }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
      <p className="text-[13px] text-muted">
        <span className="font-semibold text-foreground">{title}</span>
        {" · "}
        <span className="font-semibold text-navy">{count}</span> ilan
      </p>
      <label className="flex items-center gap-2 text-[13px] text-muted">
        Sırala:
        <select className="rounded border border-border bg-card px-2 py-1 text-foreground outline-none">
          <option>Tarihe göre (Önce en yeni)</option>
          <option>Fiyata göre (Önce en düşük)</option>
          <option>Fiyata göre (Önce en yüksek)</option>
        </select>
      </label>
    </div>
  );
}
