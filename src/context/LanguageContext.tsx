"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translations, type Language, type TranslationKey } from "@/lib/translations";

const STORAGE_KEY = "fsk_language";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, ...args: unknown[]) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const t = useCallback(
    (key: TranslationKey, ...args: unknown[]): string => {
      const dict = translations[language] as Record<string, unknown>;
      const val = dict[key] ?? (translations.en as Record<string, unknown>)[key] ?? key;
      if (typeof val === "function") {
        return String((val as (...a: unknown[]) => unknown)(...args));
      }
      return String(val);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
