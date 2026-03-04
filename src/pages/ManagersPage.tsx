import { useEffect, useState } from "react";
import { fetchManagerStats } from "../api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/ui/button";

export function ManagersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchManagerStats()
      .then(d => {
        setRows(d);
        setError(null);
      })
      .catch(e => {
        console.error(e);
        setError("Unable to load manager performance data.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Calculating Performance Metrics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Users className="w-3.5 h-3.5" />
            Human Resources
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Manager Performance</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border-border/50 bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {rows.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current)?.user_name || "—"}
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Leading in total revenue this month</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border/50 bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-primary" />
              Avg Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {(rows.reduce((acc, row) => acc + row.win_rate_pct, 0) / (rows.length || 1)).toFixed(1)}%
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Average team win rate</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 bg-card overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Team Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {rows.reduce((acc, row) => acc + row.revenue, 0).toLocaleString("ru-RU")} ₽
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Total combined revenue</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/40">
                <TableHead className="w-[250px] text-[10px] font-bold uppercase tracking-wider h-12">Manager</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Leads</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Won</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Revenue</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Target</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Fulfillment</TableHead>
                <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider h-12">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.user_id} className="hover:bg-muted/20 border-border/40 transition-colors group">
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-primary/20 p-0.5 rounded-xl">
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter">
                          {row.user_name?.[0] ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                          {row.user_name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                          ID: {row.user_id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold">{row.total_leads}</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold">{row.won}</TableCell>
                  <TableCell className="text-right font-mono text-xs font-bold text-primary">
                    {row.revenue.toLocaleString("ru-RU")} ₽
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs font-medium text-muted-foreground">
                    {row.revenue_plan ? row.revenue_plan.toLocaleString("ru-RU") + " ₽" : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.revenue_plan_pct != null ? (
                      <Badge 
                        variant={row.revenue_plan_pct >= 100 ? "default" : "secondary"} 
                        className={cn(
                          "rounded-lg px-2 font-mono text-[10px]",
                          row.revenue_plan_pct >= 100 ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-muted/50"
                        )}
                      >
                        {row.revenue_plan_pct.toFixed(1)}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            row.win_rate_pct >= 20 ? "bg-emerald-500" : "bg-amber-500"
                          )} 
                          style={{ width: `${Math.min(row.win_rate_pct, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs font-black">{row.win_rate_pct.toFixed(1)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}

