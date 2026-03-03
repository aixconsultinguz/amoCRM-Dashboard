import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

const navItems = [
  { to: "/", key: "nav.overview" as const, icon: "📊" },
  { to: "/managers", key: "nav.managers" as const, icon: "👤" },
  { to: "/calls", key: "nav.calls" as const, icon: "📞" },
  { to: "/tasks", key: "nav.tasks" as const, icon: "✅" },
  { to: "/plans", key: "nav.plans" as const, icon: "🎯" },
  { to: "/forecast", key: "nav.forecast" as const, icon: "📈" },
  { to: "/settings", key: "nav.settings" as const, icon: "⚙️" }
] as const;

export function Sidebar() {
  const { t } = useI18n();

  return (
    <aside className="w-64 bg-gradient-to-b from-bgElevated via-bgElevated/95 to-black border-r border-borderSoft flex flex-col">
      <div className="px-6 py-5 border-b border-borderSoft">
        <div className="text-xs uppercase tracking-[0.35em] text-textMuted">
          AMOCRM
        </div>
        <div className="mt-1 text-lg font-semibold">Sales Dashboard</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition " +
              (isActive
                ? "bg-accentSoft text-white shadow-glow"
                : "text-textMuted hover:bg-bg hover:text-white")
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{t(item.key)}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-borderSoft text-[11px] text-textMuted">
        Ultra black / matte, enterprise‑ready UI
      </div>
    </aside>
  );
}

