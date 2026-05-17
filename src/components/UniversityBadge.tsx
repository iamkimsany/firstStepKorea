"use client";

import Image from "next/image";
import type { University } from "@/types";
import { getUniversityLabel, getUniversityLogo } from "@/lib/universities";

export function UniversityBadge({ university }: { university: University }) {
  const label = getUniversityLabel(university);
  const logoPath = getUniversityLogo(university);
  if (!label) return null;

  return (
    <div
      className="inline-flex max-w-full items-center gap-2 border-2 border-black px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-black"
      style={{ boxShadow: "2px 2px 0 #0A0A0A", background: "white" }}
    >
      {logoPath ? (
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          <Image
            src={logoPath}
            alt={label}
            width={32}
            height={32}
            style={{ objectFit: "contain", width: "20px", height: "20px" }}
          />
        </span>
      ) : (
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center border border-black text-[9px] font-black"
          style={{ background: "var(--yellow)" }}
          aria-hidden
        >
          {label.slice(0, 2).toUpperCase()}
        </span>
      )}
      <span className="min-w-0 break-words">{label}</span>
    </div>
  );
}
