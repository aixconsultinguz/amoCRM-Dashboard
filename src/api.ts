import axios from "axios";

// Базовый URL бэкенда:
// - локально:              http://localhost:8000
// - через ngrok:           https://condensed-aspen-nonsyntonical.ngrok-free.dev
export const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true"
  }
});

// ─── Overview / Revenue ──────────────────────────────────────────────────────

export interface RevenueSummary {
  year: number;
  month: number;
  revenue: number;
  won_deals: number;
  avg_deal_size: number;
  plan_target: number | null;
  plan_completion_pct: number | null;
}

export interface ConversionSummary {
  total_leads: number;
  won: number;
  lost: number;
  in_progress: number;
  win_rate_pct: number;
  loss_rate_pct: number;
}

export interface OverviewResponse {
  period: { year: number; month: number };
  revenue: RevenueSummary;
  revenue_mom_delta_pct: number | null;
  prev_month_revenue: number;
  conversion: ConversionSummary;
  managers_count: number;
}

export async function fetchOverview(): Promise<OverviewResponse> {
  const { data } = await api.get<OverviewResponse>("/analytics/overview");
  return data;
}

// ─── Managers ────────────────────────────────────────────────────────────────

export interface ManagerKpi {
  user_id: number;
  user_name: string;
  total_leads: number;
  won: number;
  lost: number;
  in_progress: number;
  revenue: number;
  win_rate_pct: number;
  avg_deal_size: number;
  revenue_plan: number | null;
  revenue_plan_pct: number | null;
  deals_plan: number | null;
  deals_plan_pct: number | null;
}

export async function fetchManagerStats(params?: {
  year?: number;
  month?: number;
  pipeline_id?: number;
}) {
  const { data } = await api.get<ManagerKpi[]>("/analytics/managers", { params });
  return data;
}

// ─── Calls ───────────────────────────────────────────────────────────────────

export interface CallsSummary {
  period: { year: number; month: number };
  total_calls: number;
  answered: number;
  not_answered: number;
  inbound: number;
  outbound: number;
  answer_rate_pct: number;
  avg_duration_seconds: number;
  avg_duration_formatted: string;
  total_duration_seconds: number;
  total_duration_formatted: string;
}

export interface CallsByManagerRow {
  user_id: number;
  user_name: string;
  total_calls: number;
  answered: number;
  not_answered: number;
  inbound: number;
  outbound: number;
  answer_rate_pct: number;
  avg_duration_seconds: number;
  avg_duration_formatted: string;
  total_duration_seconds: number;
}

export interface CallsDailyPoint {
  date: string;
  total: number;
  answered: number;
  outbound: number;
}

export async function fetchCallsSummary(params?: {
  year?: number;
  month?: number;
  user_id?: number;
}) {
  const { data } = await api.get<CallsSummary>("/calls/summary", { params });
  return data;
}

export async function fetchCallsByManager(params?: {
  year?: number;
  month?: number;
}) {
  const { data } = await api.get<CallsByManagerRow[]>("/calls/by-manager", {
    params
  });
  return data;
}

export async function fetchCallsDailyTrend(params?: {
  year?: number;
  month?: number;
  user_id?: number;
}) {
  const { data } = await api.get<CallsDailyPoint[]>("/calls/daily-trend", {
    params
  });
  return data;
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export interface TasksSummary {
  period: { year: number; month: number };
  total_tasks: number;
  completed: number;
  overdue: number;
  in_progress: number;
  completion_rate_pct: number;
  on_time_rate_pct: number;
  overdue_rate_pct: number;
}

export interface TasksByManagerRow {
  user_id: number;
  user_name: string;
  total_tasks: number;
  completed: number;
  overdue: number;
  in_progress: number;
  completion_rate_pct: number;
  on_time_rate_pct: number;
  overdue_rate_pct: number;
}

export interface OverdueTask {
  task_id: number;
  text: string;
  entity_id: number;
  entity_type: string;
  user_name: string;
  task_type: string;
  complete_till: string;
  overdue_hours: number | null;
}

export async function fetchTasksSummary(params?: {
  year?: number;
  month?: number;
  user_id?: number;
}) {
  const { data } = await api.get<TasksSummary>("/tasks/summary", { params });
  return data;
}

export async function fetchTasksByManager(params?: {
  year?: number;
  month?: number;
}) {
  const { data } = await api.get<TasksByManagerRow[]>("/tasks/by-manager", {
    params
  });
  return data;
}

export async function fetchOverdueTasks(params?: {
  user_id?: number;
  limit?: number;
}) {
  const { data } = await api.get<OverdueTask[]>("/tasks/overdue", { params });
  return data;
}

// ─── Plans ───────────────────────────────────────────────────────────────────

export interface Plan {
  id: number;
  period_year: number;
  period_month: number;
  user_id: number | null;
  pipeline_id: number | null;
  metric_type: string;
  target_value: number;
  notes: string | null;
  created_at: string;
}

export interface PlanCreatePayload {
  period_year: number;
  period_month: number;
  user_id: number | null;
  pipeline_id: number | null;
  metric_type: string;
  target_value: number;
  notes?: string | null;
}

export interface PlanUpdatePayload {
  target_value: number;
  notes?: string | null;
}

export async function fetchPlans(params?: {
  year?: number;
  month?: number;
  user_id?: number;
  pipeline_id?: number;
}) {
  const { data } = await api.get<Plan[]>("/plans", { params });
  return data;
}

export async function createPlan(payload: PlanCreatePayload) {
  const { data } = await api.post("/plans", payload);
  return data as { id: number; status: string };
}

export async function updatePlan(id: number, payload: PlanUpdatePayload) {
  const { data } = await api.put(`/plans/${id}`, payload);
  return data as { status: string };
}

export async function deletePlan(id: number) {
  const { data } = await api.delete(`/plans/${id}`);
  return data as { status: string };
}

// ─── Forecast ────────────────────────────────────────────────────────────────

export interface RevenueForecastPoint {
  year: number;
  month: number;
  predicted_revenue: number;
  lower_bound: number;
  upper_bound: number;
  confidence: string;
}

export interface RevenueHistoryPoint {
  year: number;
  month: number;
  revenue: number;
  won_deals: number;
}

export interface RevenueForecastResponse {
  method: string | null;
  trend_direction: "up" | "down" | "flat";
  trend_slope_per_month: number;
  moving_avg_3m: number;
  history: RevenueHistoryPoint[];
  forecast: RevenueForecastPoint[];
  data_quality: {
    history_months: number;
    non_zero_months: number;
    coverage_pct: number;
  };
  error?: string;
}

export interface DealsForecastPoint {
  year: number;
  month: number;
  predicted_deals: number;
}

export interface DealsForecastResponse {
  method: string;
  history: RevenueHistoryPoint[];
  forecast: DealsForecastPoint[];
  error?: string;
}

export async function fetchRevenueForecast(params?: {
  months_ahead?: number;
  pipeline_id?: number;
  user_id?: number;
  history_months?: number;
}) {
  const { data } = await api.get<RevenueForecastResponse>("/forecast/revenue", {
    params
  });
  return data;
}

export async function fetchDealsForecast(params?: {
  months_ahead?: number;
  pipeline_id?: number;
}) {
  const { data } = await api.get<DealsForecastResponse>("/forecast/deals", {
    params
  });
  return data;
}


