interface Props {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  positive?: boolean;
}

export function MetricCard({ title, value, subtitle, trend, positive }: Props) {
  return (
    <div className="bg-bgElevated border border-borderSoft rounded-2xl p-4 flex flex-col gap-1 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="text-xs uppercase tracking-[0.2em] text-textMuted">
        {title}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      {subtitle && <div className="text-xs text-textMuted">{subtitle}</div>}
      {trend && (
        <div
          className={
            "text-xs mt-1 " +
            (positive ? "text-emerald-400" : "text-rose-400")
          }
        >
          {trend}
        </div>
      )}
    </div>
  );
}

