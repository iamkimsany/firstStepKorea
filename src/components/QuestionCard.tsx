"use client";

import type { ReactNode } from "react";

export function QuestionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="page-enter" aria-labelledby="question-title">
      <h1
        id="question-title"
        className="text-xl font-bold leading-snug text-ink"
      >
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-sm text-muted">{subtitle}</p>
      ) : null}
      <div className="mt-6 space-y-3">{children}</div>
    </section>
  );
}
