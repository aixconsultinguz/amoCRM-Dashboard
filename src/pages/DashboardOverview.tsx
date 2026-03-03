import { useEffect, useState } from "react";
import { fetchOverview, OverviewResponse } from "../api";
import { MetricCard } from "../components/MetricCard";
import { LineChart } from "../components/LineChart";

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
        setError("Не удалось загрузить данные дашборда");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm text-textMuted">Загружаем дашборд...</div>;
  }

  if (error || !data) {
    return <div className="text-sm text-rose-400">{error ?? "Нет данных"}</div>;
  }

  const { revenue, conversion, period, revenue_mom_delta_pct } = data;

  const trendPoints = [
    { label: "П", value: data.prev_month_revenue },
    { label: "Тек", value: revenue.revenue }
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            Период
          </div>
          <div className="text-lg font-semibold">
            {period.month.toString().padStart(2, "0")}.{period.year}
          </div>
        </div>
        <div className="text-xs text-textMuted">
          Бэкенд: /analytics/overview /analytics/conversion /analytics/managers
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Выручка"
          value={revenue.revenue.toLocaleString("ru-RU") + " ₽"}
          subtitle={
            revenue.plan_target
              ? `План: ${revenue.plan_target.toLocaleString("ru-RU")} ₽`
              : "План не задан"
          }
          trend={
            revenue.plan_completion_pct
              ? `Выполнение плана: ${revenue.plan_completion_pct.toFixed(1)}%`
              : undefined
          }
          positive={!!revenue.plan_completion_pct && revenue.plan_completion_pct >= 100}
        />
        <MetricCard
          title="Средний чек"
          value={revenue.avg_deal_size.toLocaleString("ru-RU") + " ₽"}
          subtitle={`${revenue.won_deals} выигранных сделок`}
        />
        <MetricCard
          title="Конверсия"
          value={conversion.win_rate_pct.toFixed(1) + " %"}
          subtitle={`Всего лидов: ${conversion.total_leads}`}
          trend={`Loss rate: ${conversion.loss_rate_pct.toFixed(1)} %`}
          positive={conversion.win_rate_pct >= 20}
        />
        <MetricCard
          title="Динамика выручки"
          value={
            revenue_mom_delta_pct != null
              ? (revenue_mom_delta_pct >= 0 ? "+" : "") +
                revenue_mom_delta_pct.toFixed(1) +
                " %"
              : "—"
          }
          subtitle={`Прошлый месяц: ${data.prev_month_revenue.toLocaleString(
            "ru-RU"
          )} ₽`}
          positive={!!revenue_mom_delta_pct && revenue_mom_delta_pct >= 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LineChart title="Revenue MoM" points={trendPoints} />
        </div>
        <div className="space-y-3">
          <div className="bg-bgElevated border border-borderSoft rounded-2xl p-4 text-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-textMuted mb-1">
              Менеджеров
            </div>
            <div className="text-2xl font-semibold">
              {data.managers_count}
            </div>
            <div className="text-xs text-textMuted mt-1">
              Все активные пользователи amoCRM в аккаунте.
            </div>
          </div>
          <div className="bg-bgElevated border border-borderSoft rounded-2xl p-4 text-xs text-textMuted">
            Ultra premium: тёмный фон, мягкое свечение, фокус на цифрах. Можно
            добавить живые графики (Recharts/Chart.js), если захочешь —
            структура API уже используется.
          </div>
        </div>
      </div>
    </div>
  );
}

