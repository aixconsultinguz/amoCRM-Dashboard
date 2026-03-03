import { useEffect, useState } from "react";
import { fetchManagerStats } from "../api";

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
        setError("Не удалось загрузить KPI менеджеров");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-sm text-textMuted">Загружаем KPI...</div>;
  if (error) return <div className="text-sm text-rose-400">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            KPI Менеджеров
          </div>
          <div className="text-lg font-semibold">План / факт, конверсия</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-borderSoft bg-bgElevated">
        <table className="min-w-full text-sm">
          <thead className="bg-black/40 text-xs uppercase text-textMuted">
            <tr>
              <th className="px-4 py-3 text-left">Менеджер</th>
              <th className="px-4 py-3 text-right">Лиды</th>
              <th className="px-4 py-3 text-right">Выиграно</th>
              <th className="px-4 py-3 text-right">Выручка</th>
              <th className="px-4 py-3 text-right">План выручки</th>
              <th className="px-4 py-3 text-right">Выполнение</th>
              <th className="px-4 py-3 text-right">Конверсия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.user_id}
                className="border-t border-borderSoft/60 hover:bg-white/5 transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-xs font-semibold">
                      {row.user_name?.[0] ?? "?"}
                    </div>
                    <div>
                      <div className="font-medium">{row.user_name}</div>
                      <div className="text-[11px] text-textMuted">
                        Лидов: {row.total_leads}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">{row.total_leads}</td>
                <td className="px-4 py-3 text-right">{row.won}</td>
                <td className="px-4 py-3 text-right">
                  {row.revenue.toLocaleString("ru-RU")} ₽
                </td>
                <td className="px-4 py-3 text-right">
                  {row.revenue_plan
                    ? row.revenue_plan.toLocaleString("ru-RU") + " ₽"
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.revenue_plan_pct != null
                    ? row.revenue_plan_pct.toFixed(1) + " %"
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.win_rate_pct.toFixed(1)} %
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

