"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChecklistItem } from "@/components/ChecklistItem";
import { UniversityBadge } from "@/components/UniversityBadge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { generateChecklist } from "@/lib/checklists";
import type { ChecklistItem as ChecklistItemType, UserProfile } from "@/types";
import { CHECKLIST_STORAGE_KEY, PROFILE_STORAGE_KEY } from "@/lib/storage";

function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserProfile; } catch { return null; }
}
function loadCompleted(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw) as Record<string, boolean>; } catch { return {}; }
}
function saveCompleted(map: Record<string, boolean>) {
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(map));
}

export default function ChecklistPage() {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    if (!p) { setReady(true); return; }
    setProfile(p);
    const generated = generateChecklist(p, language);
    const saved = loadCompleted();
    setItems(generated.map((it) => ({ ...it, completed: Boolean(saved[it.id]) })));
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-generate when language changes (keep completed state)
  useEffect(() => {
    if (!profile) return;
    const generated = generateChecklist(profile, language);
    setItems((prev) => {
      const completedIds = new Set(prev.filter((i) => i.completed).map((i) => i.id));
      return generated.map((it) => ({ ...it, completed: completedIds.has(it.id) }));
    });
  }, [language, profile]);

  function handleToggle(id: string, completed: boolean) {
    setItems((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, completed } : it));
      const map: Record<string, boolean> = {};
      for (const it of next) { if (it.completed) map[it.id] = true; }
      saveCompleted(map);
      return next;
    });
  }

  const completedCount = useMemo(() => items.filter((i) => i.completed).length, [items]);

  if (!ready) {
    return (
      <main className="flex flex-1 items-center justify-center bg-white">
        <p className="text-sm font-bold uppercase tracking-widest text-muted">{t("checklist.loading")}</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page-enter flex flex-1 flex-col items-center justify-center bg-white px-6 text-center">
        <div className="absolute right-5 top-5">
          <LanguageSwitcher />
        </div>
        <p className="text-sm font-semibold text-muted">{t("checklist.noProfile")}</p>
        <Link href="/onboarding" className="btn-primary mt-6 max-w-xs">{t("checklist.startOnboarding")}</Link>
        <footer className="mt-10 pb-2">
          <Link href="/admin/freshness" className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-black">
            {t("checklist.adminLink")}
          </Link>
        </footer>
      </main>
    );
  }

  return (
    <main className="page-enter flex-1 bg-white px-5 pb-8 pt-8">
      {/* header */}
      <header className="mb-6 border-b-2 border-black pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="neo-label">{t("checklist.kicker")}</span>
            {profile.university ? (
              <div className="mt-3"><UniversityBadge university={profile.university} /></div>
            ) : null}
            <h1 className="heading-display mt-2 text-3xl text-black">{t("checklist.title")}</h1>
            <p className="mt-1 text-xs font-medium text-muted">
              {t("checklist.subtitle")}
            </p>
          </div>
          <div className="shrink-0 pt-0.5">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* progress bar */}
      <div className="mb-5 flex items-center gap-3 border-2 border-black p-3"
        style={{ boxShadow: "3px 3px 0 #FAC800" }}>
        <div className="flex-1 overflow-hidden border-2 border-black" style={{ height: "8px" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: items.length ? `${(completedCount / items.length) * 100}%` : "0%",
              background: "var(--yellow)",
            }}
          />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest">
          {t("checklist.progress", completedCount, items.length)}
        </span>
      </div>

      <div className="space-y-3">
        {items.map((it) => (
          <ChecklistItem key={it.id} item={it} onToggle={handleToggle} urgentLabel={t("checklist.urgent")} />
        ))}
      </div>

      <footer className="mt-10 pb-2 text-center">
        <Link href="/admin/freshness" className="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-black">
          {t("checklist.adminLink")}
        </Link>
      </footer>
    </main>
  );
}
