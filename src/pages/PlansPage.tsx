import { useEffect, useState } from "react";
import {
  Plan,
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan
} from "../api";
import { 
  Target, 
  Plus, 
  Pencil, 
  Trash2, 
  Calendar, 
  User, 
  Layers, 
  BarChart3,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";

const METRICS = [
  "revenue",
  "deals_count",
  "new_leads",
  "conversion_rate",
  "avg_deal_size"
] as const;

type MetricType = (typeof METRICS)[number];

interface FormState {
  period_year: number;
  period_month: number;
  user_id: string;
  pipeline_id: string;
  metric_type: MetricType;
  target_value: string;
  notes: string;
}

export function PlansPage() {
  const now = new Date();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<FormState>({
    period_year: now.getFullYear(),
    period_month: now.getMonth() + 1,
    user_id: "",
    pipeline_id: "",
    metric_type: "revenue",
    target_value: "",
    notes: ""
  });

  async function load() {
    try {
      setLoading(true);
      const data = await fetchPlans({
        year: form.period_year,
        month: form.period_month
      });
      setPlans(data);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Unable to sync strategic plans.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleChange(field: keyof FormState, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value as any }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.target_value) return;
    try {
      setSaving(true);
      const payload = {
        period_year: form.period_year,
        period_month: form.period_month,
        user_id: form.user_id ? Number(form.user_id) : null,
        pipeline_id: form.pipeline_id ? Number(form.pipeline_id) : null,
        metric_type: form.metric_type,
        target_value: Number(form.target_value),
        notes: form.notes || null
      };

      if (editingId) {
        await updatePlan(editingId, {
          target_value: payload.target_value,
          notes: payload.notes
        });
      } else {
        await createPlan(payload);
      }

      setForm(prev => ({ ...prev, target_value: "", notes: "" }));
      setEditingId(null);
      await load();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.detail || "System error during plan preservation.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to decommission this strategic plan?")) return;
    try {
      await deletePlan(id);
      await load();
    } catch (e) {
      console.error(e);
      setError("Unable to decommission plan.");
    }
  }

  function startEdit(plan: Plan) {
    setEditingId(plan.id);
    setForm({
      period_year: plan.period_year,
      period_month: plan.period_month,
      user_id: plan.user_id ? String(plan.user_id) : "",
      pipeline_id: plan.pipeline_id ? String(plan.pipeline_id) : "",
      metric_type: plan.metric_type as MetricType,
      target_value: String(plan.target_value),
      notes: plan.notes ?? ""
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Target className="w-3.5 h-3.5" />
            Performance Objectives
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Strategic Planning</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4 px-6 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                Active Objectives List
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={load} className="h-8 gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                <Loader2 className={cn("w-3 h-3", loading && "animate-spin")} />
                Refresh
              </Button>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider pl-6">Timeline</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider">Context</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center">Metric</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider">Target</TableHead>
                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-wider pr-6">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/20 border-border/40 group">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-2 font-mono text-xs font-bold text-foreground">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {String(p.period_month).padStart(2, "0")}/{p.period_year}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                            <User className="w-3 h-3" />
                            {p.user_id ? `User: ${p.user_id}` : "Account Wide"}
                          </div>
                          <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                            <Layers className="w-3 h-3" />
                            {p.pipeline_id ? `Pipe: ${p.pipeline_id}` : "Global Pipeline"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="rounded-lg px-2 text-[10px] font-bold uppercase tracking-tighter border-primary/20 text-primary bg-primary/5">
                          {p.metric_type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs font-black text-foreground">
                        {p.target_value.toLocaleString("ru-RU")}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {plans.length === 0 && !loading && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="bg-muted/50 p-4 rounded-full">
                            <Target className="w-8 h-8 text-muted-foreground/40" />
                          </div>
                          <p className="text-sm font-bold text-muted-foreground">No active objectives detected</p>
                          <p className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-widest">Initialization Required</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/50 bg-card shadow-lg overflow-hidden border-t-4 border-t-primary">
            <CardHeader className="py-4 px-6 border-b border-border/40 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                {editingId ? <Pencil className="w-3.5 h-3.5 text-primary" /> : <Plus className="w-3.5 h-3.5 text-primary" />}
                {editingId ? "Update Objective" : "New Objective"}
              </CardTitle>
              {editingId && (
                <Button variant="ghost" size="icon" onClick={() => { setEditingId(null); setForm(prev => ({ ...prev, target_value: "", notes: "" })); }} className="h-6 w-6 rounded-md">
                  <X className="w-3 h-3" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                    <p className="text-[10px] font-bold text-destructive leading-normal">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fiscal Year</Label>
                    <Input 
                      type="number" 
                      value={form.period_year}
                      onChange={e => handleChange("period_year", Number(e.target.value))}
                      className="h-10 bg-muted/30 border-border/50 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fiscal Month</Label>
                    <Input 
                      type="number" 
                      min={1} max={12}
                      value={form.period_month}
                      onChange={e => handleChange("period_month", Number(e.target.value))}
                      className="h-10 bg-muted/30 border-border/50 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">User Assignment</Label>
                    <Input 
                      placeholder="Account Wide" 
                      value={form.user_id}
                      onChange={e => handleChange("user_id", e.target.value)}
                      className="h-10 bg-muted/30 border-border/50 rounded-xl text-[10px] font-bold uppercase placeholder:lowercase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pipeline Link</Label>
                    <Input 
                      placeholder="Global Pipe" 
                      value={form.pipeline_id}
                      onChange={e => handleChange("pipeline_id", e.target.value)}
                      className="h-10 bg-muted/30 border-border/50 rounded-xl text-[10px] font-bold uppercase placeholder:lowercase"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Target Metric</Label>
                  <Select value={form.metric_type} onValueChange={(val) => handleChange("metric_type", val)}>
                    <SelectTrigger className="h-10 bg-muted/30 border-border/50 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border shadow-xl">
                      {METRICS.map(m => (
                        <SelectItem key={m} value={m} className="text-[10px] font-bold uppercase tracking-wider">{m.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Objective Target</Label>
                  <Input 
                    type="number" step="0.01" 
                    value={form.target_value}
                    onChange={e => handleChange("target_value", e.target.value)}
                    placeholder="0.00"
                    required
                    className="h-10 bg-muted/30 border-border/50 rounded-xl text-xs font-black placeholder:text-muted-foreground/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Strategic Notes</Label>
                  <Textarea 
                    value={form.notes}
                    onChange={e => handleChange("notes", e.target.value)}
                    rows={3}
                    className="bg-muted/30 border-border/50 rounded-xl text-xs font-medium resize-none"
                    placeholder="Operational context..."
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={saving}
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-elegant font-black uppercase tracking-[0.1em] text-[10px] transition-all active:scale-[0.98]"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? "Finalize Update" : "Deploy Objective")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
            <div className="flex gap-4">
              <div className="bg-emerald-500/10 p-3 rounded-2xl h-fit">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h5 className="text-xs font-black text-foreground uppercase tracking-widest">Active Controls</h5>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  Changes to objectives will synchronize across all management dashboards in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

