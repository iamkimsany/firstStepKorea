"use client";

import Image from "next/image";
import {
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  Globe,
  GraduationCap,
  Landmark,
  Minus,
  Plane,
  Sparkles,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import { UNIVERSITY_LOGOS } from "@/lib/universities";
import type { Scholarship, University, UserProfile, VisaType } from "@/types";
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

function OptionRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="btn-outline">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black"
        style={{ background: "var(--yellow)" }}
        aria-hidden
      >
        {icon}
      </span>
      <span className="flex-1 text-left font-semibold">{label}</span>
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
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
    if (stepIndex <= 0) return 1;
    if (stepIndex === 2) return 2;
    return 3;
  }, [stepIndex, totalSteps]);

  return (
    <main className="min-h-dvh bg-white px-6 pb-12 pt-8 safe-bottom">
      <div className="mb-8 flex items-start justify-between gap-3">
        <div className="flex-1">
          <ProgressBar current={displayStep} total={totalSteps} />
        </div>
        <div className="mt-0.5 shrink-0">
          <LanguageSwitcher />
        </div>
      </div>

      {currentKey === "visa" ? (
        <QuestionCard title={t("onboarding.q1.title")}>
          <OptionRow icon={<GraduationCap size={16} />} label={t("onboarding.q1.d2")}
            onClick={() => { setProfile((p) => ({ ...p, visaType: "D-2" })); setTotalSteps(4); setStepIndex(1); }} />
          <OptionRow icon={<BookOpen size={16} />} label={t("onboarding.q1.d4")}
            onClick={() => { setProfile((p) => ({ ...p, visaType: "D-4" })); setTotalSteps(4); setStepIndex(1); }} />
          <OptionRow icon={<Briefcase size={16} />} label={t("onboarding.q1.e")}
            onClick={() => { setProfile((p) => ({ ...p, visaType: "E", university: null })); setTotalSteps(3); setStepIndex(2); }} />
          <OptionRow icon={<Users size={16} />} label={t("onboarding.q1.f")}
            onClick={() => { setProfile((p) => ({ ...p, visaType: "F", university: null })); setTotalSteps(3); setStepIndex(2); }} />
          <OptionRow icon={<Globe size={16} />} label={t("onboarding.q1.other")}
            onClick={() => { setProfile((p) => ({ ...p, visaType: "Other", university: null })); setTotalSteps(3); setStepIndex(2); }} />
        </QuestionCard>
      ) : null}

      {currentKey === "university" && needsUniversity(profile.visaType) ? (
        <QuestionCard title={t("onboarding.q2.title")}>
          {(
            [
              ["Sookmyung", t("onboarding.q2.sookmyung")],
              ["Yonsei",    t("onboarding.q2.yonsei")],
              ["Korea",     t("onboarding.q2.korea")],
              ["Hanyang",   t("onboarding.q2.hanyang")],
              ["Ewha",      t("onboarding.q2.ewha")],
              ["SNU",       t("onboarding.q2.snu")],
              ["Other",     t("onboarding.q2.other")],
            ] as const
          ).map(([value, label]) => {
            const logoPath = UNIVERSITY_LOGOS[value as University];
            const icon = logoPath ? (
              <Image
                src={logoPath}
                alt={label}
                width={24}
                height={24}
                style={{ objectFit: "contain", width: "18px", height: "18px" }}
              />
            ) : (
              <Globe size={16} />
            );
            return (
              <OptionRow
                key={value}
                icon={icon}
                label={label}
                onClick={() => { setProfile((p) => ({ ...p, university: value })); goNext(); }}
              />
            );
          })}
        </QuestionCard>
      ) : null}

      {currentKey === "arrival" ? (
        <QuestionCard title={t("onboarding.q3.title")}>
          <OptionRow icon={<Plane size={16} />} label={t("onboarding.q3.not-yet")}
            onClick={() => { setProfile((p) => ({ ...p, arrivalTime: "not-yet" })); goNext(); }} />
          <OptionRow icon={<Sparkles size={16} />} label={t("onboarding.q3.less-1-week")}
            onClick={() => { setProfile((p) => ({ ...p, arrivalTime: "less-1-week" })); goNext(); }} />
          <OptionRow icon={<CalendarDays size={16} />} label={t("onboarding.q3.1-4-weeks")}
            onClick={() => { setProfile((p) => ({ ...p, arrivalTime: "1-4-weeks" })); goNext(); }} />
          <OptionRow icon={<Building2 size={16} />} label={t("onboarding.q3.more-1-month")}
            onClick={() => { setProfile((p) => ({ ...p, arrivalTime: "more-1-month" })); goNext(); }} />
        </QuestionCard>
      ) : null}

      {currentKey === "scholarship" ? (
        <QuestionCard title={t("onboarding.q4.title")}>
          <OptionRow icon={<Landmark size={16} />} label={t("onboarding.q4.gks")}
            onClick={() => finish("gks")} />
          <OptionRow icon={<GraduationCap size={16} />} label={t("onboarding.q4.university")}
            onClick={() => finish("university")} />
          <OptionRow icon={<Minus size={16} />} label={t("onboarding.q4.none")}
            onClick={() => finish("none")} />
        </QuestionCard>
      ) : null}
    </main>
  );
}
