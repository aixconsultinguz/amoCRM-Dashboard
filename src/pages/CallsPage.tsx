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
        setError("Не удалось загрузить аналитику по звонкам");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-sm text-textMuted">Загружаем звонки...</div>;
  }
  if (error || !summary) {
    return <div className="text-sm text-rose-400">{error ?? "Нет данных"}</div>;
  }

  const chartPoints = daily.map(d => ({
    label: d.date.slice(-2),
    value: d.total
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            Звонки
          </div>
          <div className="text-lg font-semibold">
            Активность менеджеров по телефону
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Всего звонков"
          value={summary.total_calls.toString()}
          subtitle={`Отвечено: ${summary.answered}, пропущено: ${summary.not_answered}`}
          trend={`Answer rate: ${summary.answer_rate_pct.toFixed(1)} %`}
          positive={summary.answer_rate_pct >= 70}
        />
        <MetricCard
          title="Входящие / Исходящие"
          value={`${summary.inbound}/${summary.outbound}`}
          subtitle="Inbound / Outbound"
        />
        <MetricCard
          title="Средняя длительность"
          value={summary.avg_duration_formatted}
          subtitle={`Всего: ${summary.total_duration_formatted}`}
        />
        <MetricCard
          title="Активные дни"
          value={daily.length.toString()}
          subtitle="Дни с хотя бы одним звонком"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LineChart title="Звонки по дням месяца" points={chartPoints} />
        </div>
        <div className="overflow-hidden rounded-2xl border border-borderSoft bg-bgElevated text-xs text-textMuted p-4">
          <div className="font-semibold text-sm text-white mb-2">
            Что видно по звонкам
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>Общая нагрузка по отделу продаж</li>
            <li>Дни просадок/пиков активности</li>
            <li>Баланс входящих и исходящих звонков</li>
          </ul>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-borderSoft bg-bgElevated">
        <table className="min-w-full text-sm">
          <thead className="bg-black/40 text-xs uppercase text-textMuted">
            <tr>
              <th className="px-4 py-3 text-left">Менеджер</th>
              <th className="px-4 py-3 text-right">Всего</th>
              <th className="px-4 py-3 text-right">Отвечено</th>
              <th className="px-4 py-3 text-right">Пропущено</th>
              <th className="px-4 py-3 text-right">Inbound</th>
              <th className="px-4 py-3 text-right">Outbound</th>
              <th className="px-4 py-3 text-right">Answer rate</th>
              <th className="px-4 py-3 text-right">Сред. длительность</th>
            </tr>
          </thead>
          <tbody>
            {byManager.map(row => (
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
                        Всего звонков: {row.total_calls}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  {row.total_calls}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.answered}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.not_answered}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.inbound}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.outbound}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.answer_rate_pct.toFixed(1)} %
                </td>
                <td className="px-4 py-3 text-right">
                  {row.avg_duration_formatted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

