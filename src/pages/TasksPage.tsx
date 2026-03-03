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
        setError("Не удалось загрузить аналитику задач");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-sm text-textMuted">Загружаем задачи...</div>;
  }
  if (error || !summary) {
    return <div className="text-sm text-rose-400">{error ?? "Нет данных"}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            Задачи
          </div>
          <div className="text-lg font-semibold">
            Дисциплина выполнения задач
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Всего задач"
          value={summary.total_tasks.toString()}
          subtitle={`Выполнено: ${summary.completed}, просрочено: ${summary.overdue}`}
        />
        <MetricCard
          title="Выполнение"
          value={summary.completion_rate_pct.toFixed(1) + " %"}
          subtitle="От всех задач"
          positive={summary.completion_rate_pct >= 80}
        />
        <MetricCard
          title="В срок"
          value={summary.on_time_rate_pct.toFixed(1) + " %"}
          subtitle="Из выполненных"
          positive={summary.on_time_rate_pct >= 80}
        />
        <MetricCard
          title="Просрочки"
          value={summary.overdue_rate_pct.toFixed(1) + " %"}
          subtitle="Доля просроченных задач"
          positive={summary.overdue_rate_pct <= 20}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="overflow-x-auto rounded-2xl border border-borderSoft bg-bgElevated">
          <table className="min-w-full text-sm">
            <thead className="bg-black/40 text-xs uppercase text-textMuted">
              <tr>
                <th className="px-4 py-3 text-left">Менеджер</th>
                <th className="px-4 py-3 text-right">Всего</th>
                <th className="px-4 py-3 text-right">Выполнено</th>
                <th className="px-4 py-3 text-right">Просрочено</th>
                <th className="px-4 py-3 text-right">В срок</th>
                <th className="px-4 py-3 text-right">Просрочки %</th>
              </tr>
            </thead>
            <tbody>
              {byManager.map(row => (
                <tr
                  key={row.user_id}
                  className="border-t border-borderSoft/60 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.user_name}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.total_tasks}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.completed}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.overdue}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.on_time_rate_pct.toFixed(1)} %
                  </td>
                  <td className="px-4 py-3 text-right">
                    {row.overdue_rate_pct.toFixed(1)} %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-borderSoft bg-bgElevated p-4 text-xs">
          <div className="font-semibold text-sm text-white mb-2">
            Топ просроченных задач
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scroll">
            {overdue.map(task => (
              <div
                key={task.task_id}
                className="border border-borderSoft/60 rounded-xl p-3 bg-black/20"
              >
                <div className="flex justify-between text-[11px] text-textMuted mb-1">
                  <span>{task.user_name}</span>
                  {task.overdue_hours != null && (
                    <span className="text-rose-400">
                      +{task.overdue_hours.toFixed(1)} ч
                    </span>
                  )}
                </div>
                <div className="text-xs text-white mb-1">{task.text}</div>
                <div className="text-[11px] text-textMuted">
                  Тип: {task.task_type}, до{" "}
                  {new Date(task.complete_till).toLocaleString("ru-RU")}
                </div>
              </div>
            ))}
            {overdue.length === 0 && (
              <div className="text-textMuted text-xs">
                Просроченных задач нет — отличная дисциплина.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

