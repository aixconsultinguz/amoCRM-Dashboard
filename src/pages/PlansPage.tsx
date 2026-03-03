import { useEffect, useState } from "react";
import {
  Plan,
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlan
} from "../api";

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
      setError("Не удалось загрузить планы");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(
    field: keyof FormState,
    value: string | number
  ) {
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
      const msg =
        err?.response?.data?.detail ||
        "Ошибка при сохранении плана";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить этот план?")) return;
    try {
      await deletePlan(id);
      await load();
    } catch (e) {
      console.error(e);
      setError("Не удалось удалить план");
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
    <div className="space-y-5 text-sm">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            Планы
          </div>
          <div className="text-lg font-semibold">
            Плановые показатели по периоду/менеджерам
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-borderSoft bg-bgElevated">
          {loading ? (
            <div className="p-4 text-textMuted">Загружаем планы...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-black/40 text-xs uppercase text-textMuted">
                <tr>
                  <th className="px-4 py-3 text-left">Период</th>
                  <th className="px-4 py-3 text-left">User / Pipeline</th>
                  <th className="px-4 py-3 text-left">Метрика</th>
                  <th className="px-4 py-3 text-right">Цель</th>
                  <th className="px-4 py-3 text-left">Комментарий</th>
                  <th className="px-4 py-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {plans.map(p => (
                  <tr
                    key={p.id}
                    className="border-t border-borderSoft/60 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-3">
                      {String(p.period_month).padStart(2, "0")}.{p.period_year}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-textMuted">
                        User: {p.user_id ?? "все"}
                      </div>
                      <div className="text-xs text-textMuted">
                        Pipeline: {p.pipeline_id ?? "все"}
                      </div>
                    </td>
                    <td className="px-4 py-3">{p.metric_type}</td>
                    <td className="px-4 py-3 text-right">
                      {p.target_value.toLocaleString("ru-RU")}
                    </td>
                    <td className="px-4 py-3">
                      {p.notes ?? <span className="text-textMuted">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="px-2 py-1 rounded border border-borderSoft text-xs hover:border-accent"
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2 py-1 rounded border border-rose-500/60 text-xs text-rose-300 hover:bg-rose-600/20"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
                {plans.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-center text-textMuted"
                    >
                      Планов для этого периода пока нет.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-borderSoft bg-bgElevated p-4 space-y-3"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            {editingId ? "Редактировать план" : "Новый план"}
          </div>
          {error && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/40 rounded-lg px-2 py-1">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-textMuted mb-1">
                Год
              </label>
              <input
                type="number"
                value={form.period_year}
                onChange={e =>
                  handleChange("period_year", Number(e.target.value))
                }
                className="w-full rounded-md bg-bg border border-borderSoft px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-textMuted mb-1">
                Месяц
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={form.period_month}
                onChange={e =>
                  handleChange("period_month", Number(e.target.value))
                }
                className="w-full rounded-md bg-bg border border-borderSoft px-2 py-1 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-textMuted mb-1">
                User ID (опц.)
              </label>
              <input
                type="text"
                value={form.user_id}
                onChange={e => handleChange("user_id", e.target.value)}
                placeholder="пусто = все"
                className="w-full rounded-md bg-bg border border-borderSoft px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] text-textMuted mb-1">
                Pipeline ID (опц.)
              </label>
              <input
                type="text"
                value={form.pipeline_id}
                onChange={e => handleChange("pipeline_id", e.target.value)}
                placeholder="пусто = все"
                className="w-full rounded-md bg-bg border border-borderSoft px-2 py-1 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-textMuted mb-1">
              Метрика
            </label>
            <select
              value={form.metric_type}
              onChange={e =>
                handleChange("metric_type", e.target.value as MetricType)
              }
              className="w-full rounded-md bg-bg border border-borderSoft px-2 py-1 text-xs"
            >
              {METRICS.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-textMuted mb-1">
              Целевое значение
            </label>
            <input
              type="number"
              step="0.01"
              value={form.target_value}
              onChange={e => handleChange("target_value", e.target.value)}
              required
              className="w-full rounded-md bg-bg border border-borderSoft px-2 py-1 text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] text-textMuted mb-1">
              Комментарий
            </label>
            <textarea
              value={form.notes}
              onChange={e => handleChange("notes", e.target.value)}
              rows={3}
              className="w-full rounded-md bg-bg border border-borderSoft px-2 py-1 text-xs resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-3 py-2 rounded-md bg-accent text-xs font-semibold hover:bg-indigo-500 disabled:opacity-60"
            >
              {saving
                ? "Сохраняем..."
                : editingId
                ? "Обновить план"
                : "Создать план"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(prev => ({
                    ...prev,
                    target_value: "",
                    notes: ""
                  }));
                }}
                className="px-3 py-2 rounded-md border border-borderSoft text-xs text-textMuted hover:border-accent"
              >
                Отмена
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

