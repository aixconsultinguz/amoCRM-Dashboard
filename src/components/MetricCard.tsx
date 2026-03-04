import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "../lib/utils";

interface Props {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  positive?: boolean;
  icon?: LucideIcon;
}

export function MetricCard({ title, value, subtitle, trend, positive, icon: Icon }: Props) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:shadow-elegant transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {Icon && <Icon className="w-12 h-12 text-primary" />}
      </div>
      
      <div className="flex items-center justify-between relative z-10">
        <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground leading-none">
          {title}
        </div>
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-xl">
            <Icon className="w-4 h-4 text-primary" />
          </div>
        )}
      </div>

      <div className="mt-1 flex flex-col gap-1 relative z-10">
        <div className="text-2xl font-black text-foreground tracking-tight">{value}</div>
        {subtitle && (
          <div className="text-[11px] font-medium text-muted-foreground/80 leading-snug">
            {subtitle}
          </div>
        )}
      </div>

      {(trend || positive !== undefined) && (
        <div className="mt-2 flex items-center gap-2 relative z-10">
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
              positive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-rose-500/10 text-rose-500"
            )}
          >
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend || (positive ? "Increasing" : "Decreasing")}
          </div>
        </div>
      )}
    </div>
  );
}

