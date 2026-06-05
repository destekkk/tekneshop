const styles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  archived: "bg-zinc-100 text-zinc-600",
};

const labels: Record<string, string> = {
  pending: "Onay bekliyor",
  approved: "Yayında",
  rejected: "Reddedildi",
  archived: "Arşiv",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold ${styles[status] || styles.archived}`}>
      {labels[status] || status}
    </span>
  );
}
