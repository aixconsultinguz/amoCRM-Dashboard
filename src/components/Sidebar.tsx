import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  CheckSquare, 
  Target, 
  LineChart, 
  Settings,
  ShieldCheck
} from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { to: "/", key: "nav.overview" as const, icon: LayoutDashboard },
  { to: "/managers", key: "nav.managers" as const, icon: Users },
  { to: "/calls", key: "nav.calls" as const, icon: Phone },
  { to: "/tasks", key: "nav.tasks" as const, icon: CheckSquare },
  { to: "/plans", key: "nav.plans" as const, icon: Target },
  { to: "/forecast", key: "nav.forecast" as const, icon: LineChart },
  { to: "/settings", key: "nav.settings" as const, icon: Settings }
] as const;

export function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0 transition-all duration-300">
      <div className="px-6 h-16 flex items-center gap-3 border-b border-sidebar-border mb-4">
        <div className="bg-primary/10 p-2 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-primary" />
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground leading-none">
            AIX CONSULTING
          </div>
          <div className="text-sm font-bold text-foreground">AmoCRM Pro</div>
        </div>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-elegant"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <Icon className={cn("w-4.5 h-4.5", "transition-transform group-hover:scale-110")} />
              <span>{t(item.key)}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-primary/5 rounded-2xl border border-primary/10">
        <div className="text-[10px] font-semibold text-primary/80 uppercase tracking-wider mb-1">
          Support
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed">
          Need help with your AmoCRM dashboard?
        </div>
        <button className="mt-3 w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-colors">
          Contact Support
        </button>
      </div>

      <div className="px-6 py-4 border-t border-sidebar-border flex items-center justify-between text-[10px] font-medium text-muted-foreground/60">
        <span>v2.4.0</span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live System
        </span>
      </div>
    </aside>
  );
}

