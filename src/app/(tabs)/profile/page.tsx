"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UniversityBadge } from "@/components/UniversityBadge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { getUniversityLabel } from "@/lib/universities";
import type { UserProfile } from "@/types";
import { PROFILE_STORAGE_KEY } from "@/lib/storage";

function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserProfile; } catch { return null; }
}

export default function ProfilePage() {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => { setProfile(loadProfile()); }, []);

  function labelScholarship(s: UserProfile["scholarship"]) {
    switch (s) {
      case "gks":        return t("profile.scholarship.gks");
      case "university": return t("profile.scholarship.university");
      default:           return t("profile.scholarship.none");
    }
  }

  function labelArrival(a: UserProfile["arrivalTime"]) {
    switch (a) {
      case "not-yet":       return t("profile.arrival.not-yet");
      case "less-1-week":   return t("profile.arrival.less-1-week");
      case "1-4-weeks":     return t("profile.arrival.1-4-weeks");
      case "more-1-month":  return t("profile.arrival.more-1-month");
      default: return a;
    }
  }

  const rows = profile
    ? [
        { label: t("profile.label.visa"),        value: profile.visaType },
        { label: t("profile.label.university"),  value: profile.university
            ? <UniversityBadge university={profile.university} />
            : <span className="text-muted">{t("profile.label.notApplicable")}</span> },
        { label: t("profile.label.arrival"),     value: labelArrival(profile.arrivalTime) },
        { label: t("profile.label.scholarship"), value: labelScholarship(profile.scholarship) },
      ]
    : [];

  return (
    <main className="page-enter flex-1 bg-white px-5 pb-8 pt-8">
      {/* header */}
      <header className="mb-6 border-b-2 border-black pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <span className="neo-label">{t("profile.kicker")}</span>
            <h1 className="heading-display mt-2 text-3xl text-black">{t("profile.title")}</h1>
            <p className="mt-1 text-xs font-medium text-muted">{t("profile.subtitle")}</p>
          </div>
          <div className="shrink-0 pt-0.5">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {!profile ? (
        <div className="neo-card p-8 text-center">
          <p className="text-sm font-semibold text-muted">{t("profile.noProfile")}</p>
          <Link href="/onboarding" className="btn-primary mt-6">{t("profile.startOnboarding")}</Link>
        </div>
      ) : (
        <div className="neo-card overflow-hidden">
          {rows.map((row, i) => (
            <div key={row.label}
              className={`flex items-start gap-4 px-5 py-4 ${i > 0 ? "border-t-2 border-black" : ""}`}>
              <dt className="w-28 shrink-0 pt-0.5 text-[10px] font-bold uppercase tracking-widest text-muted">
                {row.label}
              </dt>
              <dd className="flex-1 text-sm font-semibold text-black">{row.value}</dd>
            </div>
          ))}
          {profile.university ? (
            <div className="border-t-2 border-black px-5 py-3"
              style={{ background: "var(--canvas)" }}>
              <p className="text-[11px] font-medium text-muted">{getUniversityLabel(profile.university)}</p>
            </div>
          ) : null}
        </div>
      )}

      {profile ? (
        <Link href="/onboarding" className="btn-outline mt-5">{t("profile.update")}</Link>
      ) : null}

      <Link href="/" className="mt-4 block w-full py-2 text-center text-xs font-bold uppercase tracking-widest text-muted hover:text-black">
        {t("profile.backHome")}
      </Link>
    </main>
  );
}
