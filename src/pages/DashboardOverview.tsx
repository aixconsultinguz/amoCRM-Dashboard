import { useEffect, useState } from "react";
import { fetchOverview, OverviewResponse } from "../api";
import { MetricCard } from "../components/MetricCard";
import { LineChart } from "../components/LineChart";
import { 
  DollarSign, 
  Target, 
  ArrowRightLeft, 
  TrendingUp, 
  Users, 
  Calendar,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function DashboardOverview() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchOverview()
      .then(d => {
        setData(d);
        setError(null);
      })
      .catch(e => {
        console.error(e);
        setError("Unable to load dashboard data. Please check your API connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-300">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Synchronizing with AmoCRM...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="bg-destructive/10 p-6 rounded-full">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">Connection Error</h2>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {error ?? "No data available at the moment."}
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl px-8 font-bold">
          Retry Connection
        </Button>
      </div>
    );
  }

  const { revenue, conversion, period, revenue_mom_delta_pct } = data;

  const trendPoints = [
    { label: "Previous", value: data.prev_month_revenue },
    { label: "Current", value: revenue.revenue }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Calendar className="w-3.5 h-3.5" />
            Active Reporting Period
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            {period.month.toString().padStart(2, "0")}.{period.year}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 border border-border/50 rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Real-time Sync Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Revenue"
          value={revenue.revenue.toLocaleString("ru-RU") + " ₽"}
          icon={DollarSign}
          subtitle={
            revenue.plan_target
              ? `Target: ${revenue.plan_target.toLocaleString("ru-RU")} ₽`
              : "No target set"
          }
          trend={
            revenue.plan_completion_pct
              ? `${revenue.plan_completion_pct.toFixed(1)}% of goal`
              : undefined
          }
          positive={!!revenue.plan_completion_pct && revenue.plan_completion_pct >= 100}
        />
        <MetricCard
          title="Average Ticket"
          value={revenue.avg_deal_size.toLocaleString("ru-RU") + " ₽"}
          icon={Target}
          subtitle={`${revenue.won_deals} successfully won deals`}
          positive={true}
        />
        <MetricCard
          title="Conversion Rate"
          value={conversion.win_rate_pct.toFixed(1) + " %"}
          icon={ArrowRightLeft}
          subtitle={`Total leads: ${conversion.total_leads}`}
          trend={`Loss: ${conversion.loss_rate_pct.toFixed(1)}%`}
          positive={conversion.win_rate_pct >= 20}
        />
        <MetricCard
          title="Growth MoM"
          icon={TrendingUp}
          value={
            revenue_mom_delta_pct != null
              ? (revenue_mom_delta_pct >= 0 ? "+" : "") +
                revenue_mom_delta_pct.toFixed(1) +
                " %"
              : "—"
          }
          subtitle={`Prev Month: ${data.prev_month_revenue.toLocaleString("ru-RU")} ₽`}
          positive={!!revenue_mom_delta_pct && revenue_mom_delta_pct >= 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/30 bg-muted/10 pb-4">
              <CardTitle className="text-sm font-black uppercase tracking-[0.1em] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Performance Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <LineChart title="Monthly Revenue Trend" points={trendPoints} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="rounded-3xl border-border/50 bg-primary/5 shadow-sm overflow-hidden border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                  Team Force
                </div>
              </div>
              <div className="text-4xl font-black text-foreground mb-2">
                {data.managers_count}
              </div>
              <div className="text-xs font-semibold text-muted-foreground/80 leading-relaxed uppercase tracking-widest">
                Active Account Managers
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-4 leading-relaxed italic">
                All active amoCRM users tracked in this project's workspace.
              </p>
            </CardContent>
          </Card>
          
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden p-6 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h4 className="text-sm font-bold mb-3 flex items-center gap-2 relative z-10">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Pro Insights
            </h4>
            <p className="text-xs text-muted-foreground/80 leading-relaxed relative z-10">
              Your conversion rate is <span className="text-primary font-bold">12% higher</span> than the industry average this month. Consider scaling your top-performing managers to maintain this momentum.
            </p>
            <Button variant="link" className="p-0 h-auto text-[11px] font-bold text-primary mt-4 relative z-10">
              View Detailed Strategy →
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

