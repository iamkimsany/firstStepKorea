"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UniversityBadge } from "@/components/UniversityBadge";
import { getUniversityLabel } from "@/lib/universities";
import type { UserProfile } from "@/types";
import { PROFILE_STORAGE_KEY } from "@/lib/storage";

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

function labelScholarship(s: UserProfile["scholarship"]) {
  switch (s) {
    case "gks":
      return "GKS Government Scholarship";
    case "university":
      return "University Scholarship";
    default:
      return "No scholarship";
  }
}

function labelArrival(a: UserProfile["arrivalTime"]) {
  switch (a) {
    case "not-yet":
      return "Not arrived yet";
    case "less-1-week":
      return "Less than 1 week";
    case "1-4-weeks":
      return "1–4 weeks ago";
    case "more-1-month":
      return "More than 1 month ago";
    default:
      return a;
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  return (
    <main className="page-enter flex-1 bg-surface px-5 pb-6 pt-8">
      <h1 className="text-2xl font-bold text-ink">Profile</h1>
      <p className="mt-2 text-sm text-muted">
        Saved from onboarding. Update anytime.
      </p>

      {!profile ? (
        <div className="mt-10 rounded-card border border-border bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-muted">No profile saved yet.</p>
          <Link
            href="/onboarding"
            className="mt-4 inline-flex rounded-btn bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            Start onboarding
          </Link>
        </div>
      ) : (
        <dl className="mt-8 space-y-4 rounded-card border border-border bg-white p-5 shadow-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">
              Visa
            </dt>
            <dd className="mt-1 text-base font-semibold text-ink">
              {profile.visaType}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">
              University
            </dt>
            <dd className="mt-1">
              {profile.university ? (
                <UniversityBadge university={profile.university} />
              ) : (
                <span className="text-base text-muted">Not applicable</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">
              Arrival
            </dt>
            <dd className="mt-1 text-base text-ink">
              {labelArrival(profile.arrivalTime)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-muted">
              Scholarship
            </dt>
            <dd className="mt-1 text-base text-ink">
              {labelScholarship(profile.scholarship)}
            </dd>
          </div>
          {profile.university ? (
            <p className="border-t border-border pt-4 text-xs text-muted">
              School name: {getUniversityLabel(profile.university)}
            </p>
          ) : null}
        </dl>
      )}

      {profile ? (
        <Link
          href="/onboarding"
          className="mt-6 block w-full rounded-btn border border-primary bg-white py-3 text-center text-sm font-semibold text-primary transition hover:bg-primary-light"
        >
          Update answers (onboarding)
        </Link>
      ) : null}

      <Link
        href="/"
        className="mt-3 block w-full py-2 text-center text-sm font-medium text-muted hover:text-ink"
      >
        ← Back to home
      </Link>
    </main>
  );
}
