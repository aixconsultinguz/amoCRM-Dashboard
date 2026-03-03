import { useEffect, useState } from "react";
import {
  fetchRevenueForecast,
  fetchDealsForecast,
  RevenueForecastResponse,
  DealsForecastResponse
} from "../api";
import { MetricCard } from "../components/MetricCard";
import { LineChart } from "../components/LineChart";

export function ForecastPage() {
  const [revenueForecast, setRevenueForecast] =
    useState<RevenueForecastResponse | null>(null);
  const [dealsForecast, setDealsForecast] =
    useState<DealsForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [rf, df] = await Promise.all([
          fetchRevenueForecast({ months_ahead: 3 }),
          fetchDealsForecast({ months_ahead: 3 })
        ]);
        setRevenueForecast(rf);
        setDealsForecast(df);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Не удалось загрузить прогноз");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-sm text-textMuted">Загружаем прогноз...</div>;
  }
  if (error || !revenueForecast) {
    return <div className="text-sm text-rose-400">{error ?? "Нет данных"}</div>;
  }

  const lastHistory =
    revenueForecast.history[revenueForecast.history.length - 1];
  const firstForecast = revenueForecast.forecast[0];

  const historyPoints = revenueForecast.history.map(h => ({
    label: `${String(h.month).padStart(2, "0")}.${String(h.year).slice(-2)}`,
    value: h.revenue
  }));

  const forecastPoints = revenueForecast.forecast.map(f => ({
    label: `${String(f.month).padStart(2, "0")}.${String(f.year).slice(-2)}`,
    value: f.predicted_revenue
  }));

  return (
    <div className="space-y-5 text-sm">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            Прогноз
          </div>
          <div className="text-lg font-semibold">
            Выручка и количество сделок вперёд
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Метод"
          value={revenueForecast.method ?? "нет данных"}
          subtitle={`Тренд: ${revenueForecast.trend_direction}`}
        />
        <MetricCard
          title="Средняя выручка (3 мес.)"
          value={revenueForecast.moving_avg_3m.toLocaleString("ru-RU") + " ₽"}
          subtitle="Скользящее среднее"
        />
        {lastHistory && (
          <MetricCard
            title="Последний факт"
            value={lastHistory.revenue.toLocaleString("ru-RU") + " ₽"}
            subtitle={`Месяц: ${String(lastHistory.month).padStart(
              2,
              "0"
            )}.${lastHistory.year}`}
          />
        )}
        {firstForecast && (
          <MetricCard
            title="Ближайший прогноз"
            value={firstForecast.predicted_revenue.toLocaleString("ru-RU") + " ₽"}
            subtitle={`Интервал: ${firstForecast.lower_bound.toLocaleString(
              "ru-RU"
            )}–${firstForecast.upper_bound.toLocaleString("ru-RU")} ₽`}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LineChart
          title="Историческая выручка"
          points={historyPoints}
        />
        <LineChart
          title="Прогноз выручки (месяцы вперёд)"
          points={forecastPoints}
        />
      </div>

      {dealsForecast && dealsForecast.forecast.length > 0 && (
        <div className="rounded-2xl border border-borderSoft bg-bgElevated p-4 text-xs">
          <div className="font-semibold text-sm text-white mb-2">
            Прогноз по количеству сделок
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {dealsForecast.forecast.map(f => (
              <div
                key={`${f.year}-${f.month}`}
                className="border border-borderSoft/60 rounded-xl p-3 bg-black/20"
              >
                <div className="text-[11px] text-textMuted mb-1">
                  Месяц {String(f.month).padStart(2, "0")}.{f.year}
                </div>
                <div className="text-lg font-semibold">
                  {f.predicted_deals.toFixed(1)}
                </div>
                <div className="text-[11px] text-textMuted">
                  Ожидаемое число закрытых сделок.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

