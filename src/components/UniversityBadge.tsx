"use client";

import type { University } from "@/types";
import { getUniversityLabel } from "@/lib/universities";

export function UniversityBadge({ university }: { university: University }) {
  const label = getUniversityLabel(university);
  if (!label) return null;
  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-chip border border-border bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
      <span aria-hidden>🎓</span>
      <span className="truncate">{label}</span>
    </div>
  );
}
