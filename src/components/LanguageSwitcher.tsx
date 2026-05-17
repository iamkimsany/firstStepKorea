"use client";

import { useLanguage } from "@/context/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => setLanguage(language === "en" ? "ru" : "en")}
      aria-label={language === "en" ? "Switch to Russian" : "Switch to English"}
      className="flex items-center gap-1.5 border-2 border-black px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest transition hover:bg-black hover:text-white"
      style={{
        background: "var(--yellow)",
        boxShadow: "2px 2px 0 #0A0A0A",
      }}
    >
      🌐 {language === "en" ? "RU" : "EN"}
    </button>
  );
}
