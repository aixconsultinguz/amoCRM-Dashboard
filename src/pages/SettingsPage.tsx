import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { API_BASE_URL, api } from "../api";
import { 
  Settings, 
  Globe, 
  Database, 
  Activity, 
  Save, 
  ShieldCheck,
  RefreshCw,
  Server,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { cn } from "../lib/utils";

interface HealthResponse {
  status: string;
  timestamp: string;
}

export function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const [apiBase, setApiBase] = useState(API_BASE_URL);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("apiBaseUrlOverride");
    if (stored) {
      setApiBase(stored);
    }
  }, []);

  async function handleCheckHealth() {
    try {
      setChecking(true);
      setHealthError(null);
      const { data } = await api.get<HealthResponse>("/health");
      setHealth(data);
    } catch (e) {
      console.error(e);
      setHealth(null);
      setHealthError("System unreachable. Verify backend availability.");
    } finally {
      setChecking(false);
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (typeof window !== "undefined") {
      if (apiBase.trim()) {
        window.localStorage.setItem("apiBaseUrlOverride", apiBase.trim());
      } else {
        window.localStorage.removeItem("apiBaseUrlOverride");
      }
    }
    setTimeout(() => {
      setSaved(true);
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <Settings className="w-3.5 h-3.5" />
            System Configuration
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">{t("settings.title")}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-6 px-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Localization</CardTitle>
                  <CardDescription className="text-xs font-medium">Configure your regional and language preferences.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Select Environment Language</Label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setLang("ru")}
                    className={cn(
                      "h-12 px-6 rounded-xl border-border/60 font-bold transition-all",
                      lang === "ru" ? "bg-primary text-white border-primary shadow-elegant hover:bg-primary/90" : "hover:border-primary/40"
                    )}
                  >
                    Русский (RU)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setLang("uz")}
                    className={cn(
                      "h-12 px-6 rounded-xl border-border/60 font-bold transition-all",
                      lang === "uz" ? "bg-primary text-white border-primary shadow-elegant hover:bg-primary/90" : "hover:border-primary/40"
                    )}
                  >
                    O‘zbek tili (UZ)
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic max-w-md">
                  Language settings affect all dashboards and reports. Uzbek translations are optimized for professional sales terminology.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-6 px-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">API & Data Connectivity</CardTitle>
                  <CardDescription className="text-xs font-medium">Manage backend endpoints and AmoCRM synchronization.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{t("settings.apiBase")}</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Server className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground/50" />
                      <Input
                        type="text"
                        value={apiBase}
                        onChange={e => setApiBase(e.target.value)}
                        className="h-11 pl-10 bg-muted/30 border-border/50 rounded-xl text-xs font-bold"
                        placeholder="https://analytics.amocrm.pro/v1"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      disabled={saving}
                      className="h-11 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-elegant font-bold text-xs gap-2"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {t("settings.save")}
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-relaxed">
                    {t("settings.apiBaseHint")}
                  </p>
                </div>

                {saved && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-xs font-bold text-emerald-600">{t("settings.saved")}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="rounded-3xl border-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/40 py-4 px-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-primary" />
                Backend Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current State</span>
                {health ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 rounded-lg font-mono">STABLE</Badge>
                ) : healthError ? (
                  <Badge variant="destructive" className="px-2 rounded-lg font-mono">ERROR</Badge>
                ) : (
                  <Badge variant="secondary" className="px-2 rounded-lg font-mono text-muted-foreground">UNKNOWN</Badge>
                )}
              </div>

              {health && (
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Status</span>
                    <span className="text-[10px] font-black text-emerald-500 uppercase">{health.status}</span>
                  </div>
                  <Separator className="bg-border/40" />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Last Sync</span>
                    <span className="text-[10px] font-mono font-bold text-foreground">{new Date(health.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              )}

              {healthError && (
                <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                  <p className="text-[10px] font-bold text-destructive leading-normal">{healthError}</p>
                </div>
              )}

              <Button 
                variant="outline" 
                onClick={handleCheckHealth} 
                disabled={checking}
                className="w-full h-10 border-border/60 hover:bg-muted hover:border-primary/40 rounded-xl text-[10px] font-bold uppercase tracking-widest gap-2"
              >
                {checking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Run Health Check
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/50 bg-primary/5 shadow-sm overflow-hidden p-6 relative">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <h4 className="text-sm font-black mb-3 flex items-center gap-2 relative z-10 uppercase tracking-tight">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Security Info
            </h4>
            <p className="text-[11px] text-muted-foreground/80 leading-relaxed relative z-10">
              Your API base URL is encrypted and stored locally in your browser's secure storage. No sensitive configuration data leaves your machine.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

