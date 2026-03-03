import { useI18n } from "../i18n";

export function TopBar() {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="h-16 border-b border-borderSoft flex items-center justify-between px-6 bg-gradient-to-r from-bgElevated via-bg to-bg/90 backdrop-blur">
      <div>
        <div className="text-xs uppercase tracking-[0.3em] text-textMuted">
          Today
        </div>
        <div className="text-sm text-gray-200">{t("topbar.subtitle")}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-[11px] text-textMuted border border-borderSoft rounded-full px-2 py-1 bg-black/40">
          <button
            type="button"
            onClick={() => setLang("ru")}
            className={
              "px-1.5 py-0.5 rounded-full transition " +
              (lang === "ru"
                ? "bg-accent text-white"
                : "text-textMuted hover:text-white")
            }
          >
            RU
          </button>
          <button
            type="button"
            onClick={() => setLang("uz")}
            className={
              "px-1.5 py-0.5 rounded-full transition " +
              (lang === "uz"
                ? "bg-accent text-white"
                : "text-textMuted hover:text-white")
            }
          >
            UZ
          </button>
        </div>
        <button className="px-3 py-1.5 rounded-full border border-borderSoft text-xs text-textMuted hover:border-accent hover:text-white transition">
          Обновить данные
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center text-sm font-semibold shadow-glow">
          CEO
        </div>
      </div>
    </header>
  );
}

