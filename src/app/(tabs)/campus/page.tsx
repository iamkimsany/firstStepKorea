"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CampusResourceCard } from "@/components/CampusResourceCard";
import { UniversityBadge } from "@/components/UniversityBadge";
import type { CampusCategory } from "@/lib/campus-resources";
import { getCampusResourcesForProfile } from "@/lib/campus-resources";
import { getUniversityLabel } from "@/lib/universities";
import type { UserProfile } from "@/types";
import { PROFILE_STORAGE_KEY } from "@/lib/storage";

const FILTERS: { id: "all" | CampusCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "documents", label: "📄 Documents" },
  { id: "finance", label: "💰 Finance" },
  { id: "academic", label: "✍️ Academic" },
  { id: "language", label: "🗣️ Language" },
  { id: "community", label: "🌍 Community" },
];

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

export default function CampusPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | CampusCategory>("all");

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const allResources = useMemo(
    () => getCampusResourcesForProfile(profile),
    [profile]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allResources.filter((r) => {
      if (category !== "all" && r.category !== category) return false;
      if (!q) return true;
      const hay = [
        r.name,
        r.nameKorean,
        r.description,
        ...r.rows.flatMap((row) => [row.label, row.value]),
        r.price ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [allResources, search, category]);

  return (
    <main className="page-enter flex-1 bg-surface pb-4 pt-6">
      <div className="px-5">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-ink">Campus Guide</h1>
          {profile?.university ? (
            <div className="mt-3">
              <UniversityBadge university={profile.university} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">
              <Link href="/onboarding" className="font-semibold text-primary">
                Complete onboarding
              </Link>{" "}
              to see your school&apos;s campus resources.
            </p>
          )}
        </header>

        <label className="sr-only" htmlFor="campus-search">
          Search campus resources
        </label>
        <input
          id="campus-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search campus resources..."
          className="mb-4 w-full rounded-btn border border-border bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none ring-primary/30 placeholder:text-muted focus:ring-2"
        />
      </div>

      <div className="chips-scroll mb-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {FILTERS.map((f) => {
          const active = category === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setCategory(f.id)}
              className={`whitespace-nowrap rounded-chip border px-3 py-2 text-xs font-semibold shadow-sm transition ${
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-ink hover:border-primary/40"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 px-5">
        {!profile ? (
          <div className="rounded-card border border-border bg-white p-6 text-center text-sm text-muted shadow-sm">
            Save your school in onboarding to unlock campus guides and AI
            personalization.
          </div>
        ) : allResources.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-white/80 px-4 py-8 text-center text-sm text-muted">
            {profile.university ? (
              <>
                Detailed guides for{" "}
                <span className="font-semibold text-ink">
                  {getUniversityLabel(profile.university)}
                </span>{" "}
                are coming soon. Sookmyung students get the full campus pack
                today.
              </>
            ) : (
              <>
                Campus guides are tied to your school. If you have a D-2 or
                D-4 visa, select your university in{" "}
                <Link href="/onboarding" className="font-semibold text-primary">
                  onboarding
                </Link>{" "}
                to see resources here when available.
              </>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-card border border-dashed border-border bg-white/80 px-4 py-8 text-center text-sm text-muted">
            No resources match your search. Try another keyword or filter.
          </div>
        ) : (
          filtered.map((r) => <CampusResourceCard key={r.id} resource={r} />)
        )}
      </div>
    </main>
  );
}
