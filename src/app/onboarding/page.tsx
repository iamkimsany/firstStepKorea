"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import type { Scholarship, UserProfile, VisaType } from "@/types";
import { PROFILE_STORAGE_KEY } from "@/lib/storage";

type StepKey = "visa" | "university" | "arrival" | "scholarship";

const MAX_STEP_INDEX = 3;

function needsUniversity(visa: VisaType | undefined) {
  return visa === "D-2" || visa === "D-4";
}

function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(p));
}

export default function OnboardingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0); // 0..3 maps to flow positions
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [totalSteps, setTotalSteps] = useState(4);

  const steps: StepKey[] = useMemo(
    () => ["visa", "university", "arrival", "scholarship"],
    []
  );

  const currentKey = steps[stepIndex];

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, MAX_STEP_INDEX));
  }

  function finish(scholarship: Scholarship) {
    const full: UserProfile = {
      visaType: profile.visaType!,
      university: profile.university ?? null,
      arrivalTime: profile.arrivalTime!,
      scholarship,
    };
    saveProfile(full);
    router.push("/checklist");
  }

  const displayStep = useMemo(() => {
    if (totalSteps === 4) return stepIndex + 1;
    // 3-step flow: indices 0,2,3 → display 1,2,3
    if (stepIndex <= 0) return 1;
    if (stepIndex === 2) return 2;
    return 3;
  }, [stepIndex, totalSteps]);

  return (
    <main className="page-enter min-h-dvh bg-white px-5 pb-10 pt-6 safe-bottom">
      <div className="mb-8">
        <ProgressBar current={displayStep} total={totalSteps} />
      </div>

      {currentKey === "visa" ? (
        <QuestionCard title="What is your visa type?">
          {(
            [
              ["D-2", "🎓 D-2 — University Student"],
              ["D-4", "📚 D-4 — Language Student"],
              ["E", "💼 E — Work Visa"],
              ["F", "👨‍👩‍👧 F — Family Visa"],
              ["Other", "🌐 Other"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setProfile((p) => {
                  const next: Partial<UserProfile> = { ...p, visaType: value };
                  if (!needsUniversity(value)) {
                    next.university = null;
                  }
                  return next;
                });
                setTotalSteps(needsUniversity(value) ? 4 : 3);
                if (needsUniversity(value)) {
                  setStepIndex(1);
                } else {
                  setStepIndex(2);
                }
              }}
              className="flex w-full items-center rounded-card border border-border bg-surface px-4 py-4 text-left text-base font-semibold text-ink shadow-sm transition hover:border-primary hover:bg-primary-light/60 active:scale-[0.99]"
            >
              {label}
            </button>
          ))}
        </QuestionCard>
      ) : null}

      {currentKey === "university" && needsUniversity(profile.visaType) ? (
        <QuestionCard title="Which university?">
          {(
            [
              ["Sookmyung", "Sookmyung Women's University"],
              ["Yonsei", "Yonsei University"],
              ["Korea", "Korea University"],
              ["Hanyang", "Hanyang University"],
              ["Ewha", "Ewha Womans University"],
              ["SNU", "SNU (Seoul National University)"],
              ["Other", "Other university"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setProfile((p) => ({ ...p, university: value }));
                goNext();
              }}
              className="flex w-full items-center rounded-card border border-border bg-surface px-4 py-4 text-left text-base font-semibold text-ink shadow-sm transition hover:border-primary hover:bg-primary-light/60 active:scale-[0.99]"
            >
              {label}
            </button>
          ))}
        </QuestionCard>
      ) : null}

      {currentKey === "arrival" ? (
        <QuestionCard title="When did you arrive in Korea?">
          {(
            [
              ["not-yet", "✈️ Haven't arrived yet"],
              ["less-1-week", "🆕 Less than 1 week ago"],
              ["1-4-weeks", "📅 1-4 weeks ago"],
              ["more-1-month", "✅ More than 1 month ago"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setProfile((p) => ({ ...p, arrivalTime: value }));
                goNext();
              }}
              className="flex w-full items-center rounded-card border border-border bg-surface px-4 py-4 text-left text-base font-semibold text-ink shadow-sm transition hover:border-primary hover:bg-primary-light/60 active:scale-[0.99]"
            >
              {label}
            </button>
          ))}
        </QuestionCard>
      ) : null}

      {currentKey === "scholarship" ? (
        <QuestionCard title="Do you have a scholarship?">
          {(
            [
              ["gks", "🏛️ Yes — GKS Government Scholarship"],
              ["university", "🎓 Yes — University Scholarship"],
              ["none", "❌ No Scholarship"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => finish(value)}
              className="flex w-full items-center rounded-card border border-border bg-surface px-4 py-4 text-left text-base font-semibold text-ink shadow-sm transition hover:border-primary hover:bg-primary-light/60 active:scale-[0.99]"
            >
              {label}
            </button>
          ))}
        </QuestionCard>
      ) : null}
    </main>
  );
}
