"use client";

import Link from "next/link";
import {
  Banknote, BookOpen, FileText, LayoutGrid, Languages, Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CampusResourceCard } from "@/components/CampusResourceCard";
import { UniversityBadge } from "@/components/UniversityBadge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import type { CampusCategory } from "@/lib/campus-resources";
import { getCampusResourcesForProfile } from "@/lib/campus-resources";
import { getUniversityLabel } from "@/lib/universities";
import type { UserProfile } from "@/types";
import { PROFILE_STORAGE_KEY } from "@/lib/storage";

type FilterId = "all" | CampusCategory;

function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserProfile; } catch { return null; }
}

export default function CampusPage() {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FilterId>("all");

  useEffect(() => { setProfile(loadProfile()); }, []);

  const FILTERS: { id: FilterId; label: string; icon: React.ReactNode }[] = [
    { id: "all",       label: t("campus.filter.all"),       icon: <LayoutGrid size={12} /> },
    { id: "documents", label: t("campus.filter.documents"), icon: <FileText   size={12} /> },
    { id: "finance",   label: t("campus.filter.finance"),   icon: <Banknote   size={12} /> },
    { id: "academic",  label: t("campus.filter.academic"),  icon: <BookOpen   size={12} /> },
    { id: "language",  label: t("campus.filter.language"),  icon: <Languages  size={12} /> },
    { id: "community", label: t("campus.filter.community"), icon: <Users      size={12} /> },
  ];

  const allResources = useMemo(
    () => getCampusResourcesForProfile(profile, language),
    [profile, language]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allResources.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      return [r.name, r.nameKorean, r.description, ...r.rows.flatMap((row) => [row.label, row.value]), r.price ?? ""]
        .join(" ").toLowerCase().includes(q);
    });
  }, [allResources, search, category]);

  return (
    <main className="page-enter flex-1 bg-white pb-8 pt-8">
      <div className="px-5">
        <header className="mb-5 border-b-2 border-black pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="neo-label">{t("campus.kicker")}</span>
              <h1 className="heading-display mt-2 text-3xl text-black">{t("campus.title")}</h1>
              {profile?.university ? (
                <div className="mt-3"><UniversityBadge university={profile.university} /></div>
              ) : (
                <p className="mt-2 text-xs font-medium text-muted">
                  <Link href="/onboarding" className="font-bold text-black underline underline-offset-2">
                    {t("campus.noProfile")}
                  </Link>{" "}
                  {t("campus.noProfile.suffix")}
                </p>
              )}
            </div>
            <div className="shrink-0 pt-0.5">
              <LanguageSwitcher />
            </div>
          </div>
        </header>

        {/* search */}
        <label className="sr-only" htmlFor="campus-search">Search campus resources</label>
        <input id="campus-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder={t("campus.search")}
          className="neo-input mb-4"
          style={{ boxShadow: "3px 3px 0 #FAC800" }}
        />
      </div>

      {/* filter chips */}
      <div className="chips-scroll mb-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => {
          const active = category === f.id;
          return (
            <button key={f.id} type="button" onClick={() => setCategory(f.id)}
              className="flex shrink-0 items-center gap-1.5 whitespace-nowrap border-2 border-black px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition"
              style={
                active
                  ? { background: "var(--yellow)", boxShadow: "2px 2px 0 #0A0A0A" }
                  : { background: "white",         boxShadow: "2px 2px 0 #0A0A0A" }
              }>
              {f.icon} {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 px-5">
        {!profile ? (
          <div className="neo-card p-6 text-center">
            <p className="text-sm font-semibold text-muted">{t("campus.noSaved")}</p>
            <Link href="/onboarding" className="btn-primary mt-4">
              {t("campus.startOnboarding")}
            </Link>
          </div>
        ) : allResources.length === 0 ? (
          <>
            {/* Coming soon card */}
            <div className="neo-card p-6">
              <span className="neo-label">{t("campus.noResources.badge")}</span>
              <p className="mt-3 text-base font-bold text-black">
                {profile.university
                  ? t("campus.noResources.text", getUniversityLabel(profile.university))
                  : t("campus.noResources.noProfile.text")}
              </p>
              <p className="mt-1 text-xs font-medium text-muted">
                {t("campus.noResources.hint")}
              </p>
            </div>

            {/* General Korea resources */}
            <div className="border-t-2 border-black pt-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted">
                {t("campus.general.label")}
              </p>
              {[
                { title: "Hi Korea (ARC & Visa)", url: "https://www.hikorea.go.kr", desc: "Official immigration portal — ARC applications, visa extensions" },
                { title: "Seoul Global Center", url: "https://global.seoul.go.kr", desc: "Free legal, housing, and life counseling in 17 languages" },
                { title: "Hana Bank Global", url: "https://www.hanabank.com", desc: "Open a bank account as a foreigner — branches near most campuses" },
                { title: "Korea Immigration", url: "https://www.immigration.go.kr", desc: "Check visa status, appointment bookings" },
              ].map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-card mb-3 flex items-start justify-between gap-4 p-4 transition hover:bg-canvas"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-black">{r.title}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted">{r.desc}</p>
                  </div>
                  <span className="mt-0.5 shrink-0 text-xs font-bold text-muted">→</span>
                </a>
              ))}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className="border-2 border-dashed border-black p-8 text-center text-sm font-medium text-muted">
            {t("campus.noMatch")}
          </div>
        ) : (
          filtered.map((r) => <CampusResourceCard key={r.id} resource={r} />)
        )}
      </div>
    </main>
  );
}
