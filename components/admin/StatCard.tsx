type Props = {
  label: string;
  value: number | string;
  hint?: string;
  tone?: "default" | "warning" | "success" | "danger";
};

const tones = {
  default: "border-border bg-white",
  warning: "border-amber-200 bg-amber-50",
  success: "border-emerald-200 bg-emerald-50",
  danger: "border-rose-200 bg-rose-50",
};

export default function StatCard({ label, value, hint, tone = "default" }: Props) {
  return (
    <div className={`rounded-lg border p-4 ${tones[tone]}`}>
      <p className="text-[12px] font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted">{hint}</p> : null}
    </div>
  );
}
