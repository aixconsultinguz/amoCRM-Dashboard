import { useEffect, useState } from "react";
import {
  CallsSummary,
  CallsByManagerRow,
  CallsDailyPoint,
  fetchCallsSummary,
  fetchCallsByManager,
  fetchCallsDailyTrend
} from "../api";
import { MetricCard } from "../components/MetricCard";
import { LineChart } from "../components/LineChart";
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOutgoing, 
  Clock, 
  BarChart3,
  Loader2,
  PhoneOff,
  User,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { cn } from "../lib/utils";

export function CallsPage() {
  const [summary, setSummary] = useState<CallsSummary | null>(null);
  const [byManager, setByManager] = useState<CallsByManagerRow[]>([]);
  const [daily, setDaily] = useState<CallsDailyPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [s, m, d] = await Promise.all([
          fetchCallsSummary(),
          fetchCallsByManager(),
          fetchCallsDailyTrend()
        ]);
        setSummary(s);
        setByManager(m);
        setDaily(d);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Unable to process call analytics.");
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
          Analyzing Voice Traffic...
        </p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <PhoneOff className="w-10 h-10 text-destructive" />
        <p className="text-sm text-muted-foreground max-w-xs">{error ?? "No call logs detected for the current period"}</p>
      </div>
    );
  }

  const chartPoints = daily.map(d => ({
    label: d.date.slice(-2),
    value: d.total
  }));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Phone className="w-3.5 h-3.5" />
            Communication Channels
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Call Intelligence</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Volume"
          value={summary.total_calls.toString()}
          icon={Phone}
          subtitle={`Answered: ${summary.answered} • Missed: ${summary.not_answered}`}
          trend={`${summary.answer_rate_pct.toFixed(1)}% pick-up`}
          positive={summary.answer_rate_pct >= 70}
        />
        <MetricCard
          title="Direction Balance"
          value={`${summary.inbound} / ${summary.outbound}`}
          icon={Zap}
          subtitle="Inbound vs Outbound calls"
          positive={summary.outbound > summary.inbound}
        />
        <MetricCard
          title="Avg Session"
          value={summary.avg_duration_formatted}
          icon={Clock}
          subtitle={`Total talk time: ${summary.total_duration_formatted}`}
        />
        <MetricCard
          title="Sales Days"
          value={daily.length.toString()}
          icon={CalendarDays}
          subtitle="Active communication days"
          positive={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                Daily Call Distribution
              </CardTitle>
              <Badge variant="outline" className="text-[9px] font-bold bg-background/50">LATEST 30 DAYS</Badge>
            </CardHeader>
            <CardContent className="p-6">
              <LineChart title="Daily Call Volume" points={chartPoints} />
            </CardContent>
          </Card>
        </div>
        
        <Card className="rounded-3xl border-border/50 bg-primary/5 shadow-sm overflow-hidden p-6">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Key Insights
          </h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1 p-1.5 bg-primary/10 rounded-lg h-fit">
                <PhoneIncoming className="w-3 h-3 text-primary" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Inbound traffic peaked on <span className="text-foreground font-bold">Wednesdays</span>. Ensure your support line is fully staffed.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 p-1.5 bg-primary/10 rounded-lg h-fit">
                <PhoneOutgoing className="w-3 h-3 text-primary" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Managers with <span className="text-foreground font-bold">outbound focus</span> show 15% better lead conversion this period.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="mt-1 p-1.5 bg-primary/10 rounded-lg h-fit">
                <Clock className="w-3 h-3 text-primary" />
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Average call duration is <span className="text-foreground font-bold">optimal</span> for high-ticket sales (3-5 minutes).
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider pl-6 h-12">Manager</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Total</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12 text-emerald-500">Answered</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-rose-500 h-12">Missed</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">In / Out</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Rate</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider pr-6 h-12">Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {byManager.map((row) => (
                <TableRow key={row.user_id} className="hover:bg-muted/20 border-border/40 transition-colors group">
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-primary/20 p-0.5 rounded-lg">
                        <AvatarFallback className="rounded-md bg-primary/10 text-primary text-[10px] font-black">
                          {row.user_name?.[0] ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{row.user_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold">{row.total_calls}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-emerald-500 font-bold">{row.answered}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-rose-500 font-bold">{row.not_answered}</TableCell>
                  <TableCell className="text-right font-mono text-[10px] font-bold text-muted-foreground">{row.inbound} / {row.outbound}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary" className="rounded-lg px-2 font-mono text-[10px] bg-muted/50">
                      {row.answer_rate_pct.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6 font-mono text-[10px] font-bold">{row.avg_duration_formatted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

