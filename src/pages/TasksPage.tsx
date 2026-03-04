import { useEffect, useState } from "react";
import {
  TasksSummary,
  TasksByManagerRow,
  OverdueTask,
  fetchTasksSummary,
  fetchTasksByManager,
  fetchOverdueTasks
} from "../api";
import { MetricCard } from "../components/MetricCard";
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListChecks,
  User,
  Loader2,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../lib/utils";

export function TasksPage() {
  const [summary, setSummary] = useState<TasksSummary | null>(null);
  const [byManager, setByManager] = useState<TasksByManagerRow[]>([]);
  const [overdue, setOverdue] = useState<OverdueTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [s, m, o] = await Promise.all([
          fetchTasksSummary(),
          fetchTasksByManager(),
          fetchOverdueTasks({ limit: 50 })
        ]);
        setSummary(s);
        setByManager(m);
        setOverdue(o);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Unable to sync task analytics.");
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
          Parsing Task Discipline...
        </p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <AlertTriangle className="w-10 h-10 text-destructive" />
        <p className="text-sm text-muted-foreground">{error ?? "No task data found"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <ListChecks className="w-3.5 h-3.5" />
            Operational Workflow
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Task Discipline</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tasks"
          value={summary.total_tasks.toString()}
          icon={ListChecks}
          subtitle={`Completed: ${summary.completed} • Overdue: ${summary.overdue}`}
        />
        <MetricCard
          title="Completion Rate"
          value={summary.completion_rate_pct.toFixed(1) + "%"}
          icon={CheckCircle2}
          subtitle="General team efficiency"
          positive={summary.completion_rate_pct >= 80}
        />
        <MetricCard
          title="On-Time Delivery"
          value={summary.on_time_rate_pct.toFixed(1) + "%"}
          icon={Clock}
          subtitle="Tasks finished before deadline"
          positive={summary.on_time_rate_pct >= 80}
        />
        <MetricCard
          title="Critical Overdue"
          value={summary.overdue_rate_pct.toFixed(1) + "%"}
          icon={AlertTriangle}
          subtitle="Percentage of failed deadlines"
          positive={summary.overdue_rate_pct <= 20}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-primary" />
                Performance by Manager
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider pl-6">Manager</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">Total</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">Done</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider text-rose-500">Late</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider pr-6">Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byManager.map((row) => (
                    <TableRow key={row.user_id} className="hover:bg-muted/20 border-border/40 group">
                      <TableCell className="py-4 pl-6 font-bold text-sm group-hover:text-primary transition-colors">
                        {row.user_name}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs">{row.total_tasks}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{row.completed}</TableCell>
                      <TableCell className="text-right font-mono text-xs text-rose-500 font-bold">{row.overdue}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Badge variant="outline" className={cn(
                          "rounded-lg px-2 font-mono text-[10px] font-bold",
                          row.on_time_rate_pct >= 80 ? "border-emerald-500/50 text-emerald-500" : "border-amber-500/50 text-amber-500"
                        )}>
                          {row.on_time_rate_pct.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="bg-destructive/5 border-b border-border/40 py-4 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-rose-500">
                <Clock className="w-3.5 h-3.5" />
                High Priority Overdue
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 max-h-[500px]">
              <div className="p-4 space-y-3">
                {overdue.map((task) => (
                  <div
                    key={task.task_id}
                    className="p-4 rounded-2xl bg-muted/30 border border-border/40 hover:border-primary/30 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                        {task.user_name}
                      </span>
                      {task.overdue_hours != null && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[9px] font-black rounded-md">
                          +{task.overdue_hours.toFixed(0)}H LATE
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs font-bold leading-relaxed mb-3 text-foreground/90">
                      {task.text}
                    </p>
                    <div className="flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        Due: {new Date(task.complete_till).toLocaleDateString("ru-RU")}
                      </span>
                      <span className="px-1.5 py-0.5 bg-muted rounded border border-border/50">
                        {task.task_type}
                      </span>
                    </div>
                  </div>
                ))}
                {overdue.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center px-6">
                    <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">Zero Overdue Tasks</h4>
                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-widest font-bold">
                      Exceptional team discipline
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}

