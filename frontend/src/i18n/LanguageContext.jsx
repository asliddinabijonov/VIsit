import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultLanguage, languages, rtlLanguages, translations } from "./translations";

const STORAGE_KEY = "visit-language";

const LanguageContext = createContext(null);

function resolveLanguage(nextLanguage) {
  return languages.some((item) => item.code === nextLanguage) ? nextLanguage : defaultLanguage;
}

function getNestedValue(source, path) {
  return path.split(".").reduce((current, key) => (current && current[key] != null ? current[key] : undefined), source);
}

function interpolate(template, values = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") {
      return defaultLanguage;
    }

    return resolveLanguage(window.localStorage.getItem(STORAGE_KEY) || defaultLanguage);
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }

    document.documentElement.lang = language;
    document.documentElement.dir = rtlLanguages.has(language) ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo(() => {
    const setLanguage = (nextLanguage) => {
      setLanguageState(resolveLanguage(nextLanguage));
    };

    const t = (path, params) => {
      const currentValue = getNestedValue(translations[language], path);
      const fallbackValue = getNestedValue(translations[defaultLanguage], path);
      const resolved = currentValue ?? fallbackValue ?? path;
      return typeof resolved === "string" ? interpolate(resolved, params) : resolved;
    };

    return {
      language,
      languages,
      isRtl: rtlLanguages.has(language),
      setLanguage,
      t,
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
