import { useEffect, useState } from "react";
import { useI18n } from "../i18n";
import { API_BASE_URL, api } from "../api";

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("apiBaseUrlOverride");
    if (stored) {
      setApiBase(stored);
    }
  }, []);

  async function handleCheckHealth() {
    try {
      setHealthError(null);
      const { data } = await api.get<HealthResponse>("/health");
      setHealth(data);
    } catch (e) {
      console.error(e);
      setHealth(null);
      setHealthError("Не удалось получить статус бэкенда");
    }
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (apiBase.trim()) {
        window.localStorage.setItem("apiBaseUrlOverride", apiBase.trim());
      } else {
        window.localStorage.removeItem("apiBaseUrlOverride");
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 text-sm">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
          {t("settings.title")}
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-borderSoft bg-bgElevated p-4 space-y-3">
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            {t("settings.language")}
          </div>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setLang("ru")}
              className={
                "px-3 py-1.5 rounded-full border text-xs transition " +
                (lang === "ru"
                  ? "border-accent bg-accent text-white"
                  : "border-borderSoft text-textMuted hover:border-accent")
              }
            >
              Русский
            </button>
            <button
              type="button"
              onClick={() => setLang("uz")}
              className={
                "px-3 py-1.5 rounded-full border text-xs transition " +
                (lang === "uz"
                  ? "border-accent bg-accent text-white"
                  : "border-borderSoft text-textMuted hover:border-accent")
              }
            >
              O‘zbek tili
            </button>
          </div>
          <p className="text-[11px] text-textMuted mt-2">
            Uzbekcha matnlar professionallar uchun mos, adabiy shaklda beriladi.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-borderSoft bg-bgElevated p-4 space-y-3"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
            {t("settings.apiBase")}
          </div>
          <input
            type="text"
            value={apiBase}
            onChange={e => setApiBase(e.target.value)}
            className="w-full rounded-md bg-bg border border-borderSoft px-3 py-2 text-xs focus:outline-none focus:border-accent"
            placeholder="https://your-backend-url"
          />
          <p className="text-[11px] text-textMuted">
            {t("settings.apiBaseHint")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-3 py-2 rounded-md bg-accent text-xs font-semibold hover:bg-indigo-500 disabled:opacity-60"
            >
              {t("settings.save")}
            </button>
            {saved && (
              <span className="text-[11px] text-emerald-400">
                {t("settings.saved")}
              </span>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-borderSoft bg-bgElevated p-4 space-y-3 text-xs">
        <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
          {t("settings.currentStatus")}
        </div>
        <button
          type="button"
          onClick={handleCheckHealth}
          className="px-3 py-1.5 rounded-md border border-borderSoft text-xs text-textMuted hover:border-accent hover:text-white transition"
        >
          {t("settings.checkHealth")}
        </button>
        {health && (
          <div className="mt-2 text-textMuted">
            <div>
              Status:{" "}
              <span
                className={
                  health.status === "ok" ? "text-emerald-400" : "text-rose-400"
                }
              >
                {health.status}
              </span>
            </div>
            <div>Timestamp: {health.timestamp}</div>
          </div>
        )}
        {healthError && (
          <div className="mt-2 text-rose-400">{healthError}</div>
        )}
      </section>
    </div>
  );
}

