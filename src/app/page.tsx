"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <main className="page-enter flex min-h-dvh flex-col bg-canvas px-6 pb-10 pt-12 safe-bottom">

      {/* top bar: kicker + language switcher */}
      <div className="flex items-center justify-between">
        <span className="neo-label">{t("landing.kicker")}</span>
        <LanguageSwitcher />
      </div>

      {/* hero card */}
      <div className="neo-card relative mt-6 flex-1 p-7">
        {/* decorative dot grid */}
        <div className="absolute left-5 top-5 grid grid-cols-4 gap-1.5 opacity-30" aria-hidden>
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-none bg-black" />
          ))}
        </div>

        {/* yellow block — top-right collage element */}
        <div
          className="absolute right-5 top-5 h-10 w-10 border-2 border-black"
          style={{ background: "var(--yellow)", transform: "rotate(8deg)" }}
          aria-hidden
        />

        {/* main heading */}
        <h1 className="heading-display mt-10 text-[2.6rem] text-black">
          First<br />Step<br />Korea.
        </h1>

        <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
          {t("landing.subtitle")}
        </p>

        <p className="mt-3 text-sm font-bold text-black">
          {t("landing.tagline")}
        </p>

        <p className="mt-2 max-w-[28ch] text-sm font-medium text-muted whitespace-pre-line">
          {t("landing.description")}
        </p>

        {/* yellow circle — bottom-right accent */}
        <div
          className="absolute bottom-10 right-8 h-10 w-10 rounded-none border-2 border-black"
          style={{ background: "var(--yellow)", borderRadius: "50%" }}
          aria-hidden
        />
      </div>

      {/* CTA */}
      <div className="mt-6 space-y-3">
        <Link href="/onboarding" className="btn-primary">
          {t("landing.cta")}
        </Link>
        <p className="text-center text-[11px] font-semibold uppercase tracking-widest text-muted">
          {t("landing.note")}
        </p>
      </div>
    </main>
  );
}
