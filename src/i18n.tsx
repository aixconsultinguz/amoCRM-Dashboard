import React, { createContext, useContext, useEffect, useState } from "react";

type Lang = "ru" | "uz";

type DictKey =
  | "nav.overview"
  | "nav.managers"
  | "nav.calls"
  | "nav.tasks"
  | "nav.plans"
  | "nav.forecast"
  | "nav.settings"
  | "topbar.subtitle"
  | "settings.title"
  | "settings.language"
  | "settings.apiBase"
  | "settings.apiBaseHint"
  | "settings.currentStatus"
  | "settings.checkHealth"
  | "settings.save"
  | "settings.saved";

type Dict = Record<Lang, Record<DictKey, string>>;

const DICT: Dict = {
  ru: {
    "nav.overview": "Обзор",
    "nav.managers": "Менеджеры",
    "nav.calls": "Звонки",
    "nav.tasks": "Задачи",
    "nav.plans": "Планы",
    "nav.forecast": "Прогноз",
    "nav.settings": "Настройки",
    "topbar.subtitle": "Реальное время по amoCRM",
    "settings.title": "Настройки системы",
    "settings.language": "Язык интерфейса",
    "settings.apiBase": "Базовый URL API",
    "settings.apiBaseHint":
      "Можно указать URL бэкенда (локальный, ngrok, прод). Изменения сохраняются в браузере.",
    "settings.currentStatus": "Текущий статус бэкенда",
    "settings.checkHealth": "Проверить статус",
    "settings.save": "Сохранить",
    "settings.saved": "Настройки сохранены. Возможно, потребуется обновить страницу."
  },
  uz: {
    "nav.overview": "Umumiy ko‘rinish",
    "nav.managers": "Menejerlar",
    "nav.calls": "Qo‘ng‘iroqlar",
    "nav.tasks": "Vazifalar",
    "nav.plans": "Rejalar",
    "nav.forecast": "Prognoz",
    "nav.settings": "Sozlamalar",
    "topbar.subtitle": "amoCRM bo‘yicha real vaqt ma’lumotlari",
    "settings.title": "Tizim sozlamalari",
    "settings.language": "Interfeys tili",
    "settings.apiBase": "API’ning asosiy URL manzili",
    "settings.apiBaseHint":
      "Backend manzilini ko‘rsatish mumkin (lokal, ngrok yoki prod). O‘zgarishlar brauzerda saqlanadi.",
    "settings.currentStatus": "Backend holati",
    "settings.checkHealth": "Holatni tekshirish",
    "settings.save": "Saqlash",
    "settings.saved":
      "Sozlamalar saqlandi. Sahifani qayta yuklash talab qilinishi mumkin."
  }
};

interface I18nContextValue {
  lang: Lang;
  t: (key: DictKey) => string;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("lang") as Lang | null;
    if (stored === "ru" || stored === "uz") {
      setLangState(stored);
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("lang", l);
    }
  }

  function t(key: DictKey): string {
    return DICT[lang][key] ?? key;
  }

  return (
    <I18nContext.Provider value={{ lang, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

