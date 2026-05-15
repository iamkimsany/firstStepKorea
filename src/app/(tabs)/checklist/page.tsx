"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChecklistItem } from "@/components/ChecklistItem";
import { UniversityBadge } from "@/components/UniversityBadge";
import { generateChecklist } from "@/lib/checklists";
import type { ChecklistItem as ChecklistItemType, UserProfile } from "@/types";
import {
  CHECKLIST_STORAGE_KEY,
  PROFILE_STORAGE_KEY,
} from "@/lib/storage";

function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

function loadCompleted(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveCompleted(map: Record<string, boolean>) {
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(map));
}

export default function ChecklistPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const p = loadProfile();
    if (!p) {
      setReady(true);
      return;
    }
    setProfile(p);
    const generated = generateChecklist(p);
    const saved = loadCompleted();
    setItems(
      generated.map((it) => ({
        ...it,
        completed: Boolean(saved[it.id]),
      }))
    );
    setReady(true);
  }, []);

  function handleToggle(id: string, completed: boolean) {
    setItems((prev) => {
      const nextItems = prev.map((it) =>
        it.id === id ? { ...it, completed } : it
      );
      const map: Record<string, boolean> = {};
      for (const it of nextItems) {
        if (it.completed) map[it.id] = true;
      }
      saveCompleted(map);
      return nextItems;
    });
  }

  const completedCount = useMemo(
    () => items.filter((i) => i.completed).length,
    [items]
  );

  if (!ready) {
    return (
      <main className="flex flex-1 items-center justify-center bg-surface">
        <p className="text-sm text-muted">Loading…</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="page-enter flex flex-1 flex-col items-center justify-center bg-surface px-6 text-center">
        <p className="text-sm text-muted">No profile found.</p>
        <Link
          href="/onboarding"
          className="mt-4 rounded-btn bg-primary px-5 py-3 text-sm font-semibold text-white"
        >
          Start onboarding
        </Link>
        <footer className="mt-10 pb-2 text-center">
          <Link
            href="/admin/freshness"
            className="text-[10px] text-muted hover:text-primary hover:underline"
          >
            Data accuracy admin →
          </Link>
        </footer>
      </main>
    );
  }

  return (
    <main className="page-enter flex-1 bg-surface px-5 pb-6 pt-8">
      <header className="mb-6">
        {profile.university ? (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-muted">[</span>
            <UniversityBadge university={profile.university} />
            <span className="text-sm font-semibold text-muted">]</span>
          </div>
        ) : null}
        <h1 className="text-2xl font-bold text-ink">Your checklist</h1>
        <p className="mt-2 text-sm text-muted">
          Tailored to your visa, timing, and school.
        </p>
      </header>

      <p className="mb-4 text-sm font-semibold text-primary">
        {completedCount} of {items.length || "—"} steps completed ✓
      </p>

      <div className="space-y-3">
        {items.map((it) => (
          <ChecklistItem key={it.id} item={it} onToggle={handleToggle} />
        ))}
      </div>

      <footer className="mt-10 pb-2 text-center">
        <Link
          href="/admin/freshness"
          className="text-[10px] text-muted hover:text-primary hover:underline"
        >
          Data accuracy admin →
        </Link>
      </footer>
    </main>
  );
}
