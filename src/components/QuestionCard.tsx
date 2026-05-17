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
        className="heading-display text-[1.9rem] text-black"
      >
        {title}.
      </h1>
      {subtitle ? (
        <p className="mt-3 text-sm font-medium text-muted">{subtitle}</p>
      ) : null}
      <div className="mt-7 space-y-3">{children}</div>
    </section>
  );
}
