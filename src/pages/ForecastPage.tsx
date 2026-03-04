import { useEffect, useState } from "react";
import {
  fetchRevenueForecast,
  fetchDealsForecast,
  RevenueForecastResponse,
  DealsForecastResponse
} from "../api";
import { MetricCard } from "../components/MetricCard";
import { LineChart } from "../components/LineChart";
import { 
  LineChart as LineChartIcon, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  BrainCircuit,
  History,
  Target,
  BarChart3,
  Loader2,
  AlertCircle,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

export function ForecastPage() {
  const [revenueForecast, setRevenueForecast] =
    useState<RevenueForecastResponse | null>(null);
  const [dealsForecast, setDealsForecast] =
    useState<DealsForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [rf, df] = await Promise.all([
          fetchRevenueForecast({ months_ahead: 3 }),
          fetchDealsForecast({ months_ahead: 3 })
        ]);
        setRevenueForecast(rf);
        setDealsForecast(df);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Predictive engine synchronization failed.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 animate-fade-in">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Powering Predictive Models...
        </p>
      </div>
    );
  }

  if (error || !revenueForecast) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error ?? "No predictive data available"}</p>
      </div>
    );
  }

  const lastHistory = revenueForecast.history[revenueForecast.history.length - 1];
  const firstForecast = revenueForecast.forecast[0];

  const historyPoints = revenueForecast.history.map(h => ({
    label: `${String(h.month).padStart(2, "0")}.${String(h.year).slice(-2)}`,
    value: h.revenue
  }));

  const forecastPoints = revenueForecast.forecast.map(f => ({
    label: `${String(f.month).padStart(2, "0")}.${String(f.year).slice(-2)}`,
    value: f.predicted_revenue
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <BrainCircuit className="w-3.5 h-3.5" />
            AI-Driven Analytics
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Revenue Forecast</h2>
        </div>
        <Badge variant="outline" className="h-8 rounded-xl px-4 gap-2 bg-primary/5 border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
          Method: {revenueForecast.method || "Linear Regression"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Market Trend"
          value={revenueForecast.trend_direction?.toUpperCase() || "STABLE"}
          icon={LineChartIcon}
          subtitle="Estimated growth trajectory"
          positive={revenueForecast.trend_direction === "up"}
        />
        <MetricCard
          title="3M Moving Average"
          value={revenueForecast.moving_avg_3m.toLocaleString("ru-RU") + " ₽"}
          icon={TrendingUp}
          subtitle="Historical smoothing metric"
          positive={true}
        />
        {lastHistory && (
          <MetricCard
            title="Last Actual"
            value={lastHistory.revenue.toLocaleString("ru-RU") + " ₽"}
            icon={History}
            subtitle={`Period: ${String(lastHistory.month).padStart(2, "0")}.${lastHistory.year}`}
          />
        )}
        {firstForecast && (
          <MetricCard
            title="Next Milestone"
            value={firstForecast.predicted_revenue.toLocaleString("ru-RU") + " ₽"}
            icon={Target}
            subtitle={`Confidence range up to ${firstForecast.upper_bound.toLocaleString("ru-RU")} ₽`}
            positive={firstForecast.predicted_revenue > (lastHistory?.revenue || 0)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-primary" />
              Revenue History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <LineChart title="Historical Performance" points={historyPoints} />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border/50 bg-primary/5 shadow-sm overflow-hidden">
          <CardHeader className="bg-primary/10 border-b border-primary/10 py-4 px-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-primary">
              <BrainCircuit className="w-3.5 h-3.5" />
              Predictive Projection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <LineChart title="AI Revenue Prediction" points={forecastPoints} />
          </CardContent>
        </Card>
      </div>

      {dealsForecast && dealsForecast.forecast.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            <BarChart3 className="w-3.5 h-3.5" />
            Transaction Volume Forecast
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dealsForecast.forecast.map((f) => (
              <Card key={`${f.year}-${f.month}`} className="rounded-2xl border-border/50 bg-card hover:border-primary/30 transition-all group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {String(f.month).padStart(2, "0")}.{f.year}
                    </div>
                    <Badge variant="outline" className="rounded-lg h-5 px-1.5 text-[9px] font-black border-primary/20 text-primary">PROJECTION</Badge>
                  </div>
                  <div className="text-3xl font-black text-foreground">
                    {f.predicted_deals.toFixed(1)}
                  </div>
                  <div className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">
                    Estimated successfully closed deals
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

