"use client";

import { FreshnessBadge } from "@/components/FreshnessBadge";
import type { CampusCategory, CampusResource } from "@/lib/campus-resources";
import { markVerified, reportOutdated } from "@/lib/freshness";

const CATEGORY_LABEL: Record<CampusCategory, string> = {
  documents: "Documents",
  finance: "Finance",
  academic: "Academic",
  language: "Language",
  community: "Community",
};

export function CampusResourceCard({ resource }: { resource: CampusResource }) {
  return (
    <article className="rounded-card border border-border bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <span className="text-2xl" aria-hidden>
          {resource.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="font-bold text-ink">{resource.name}</h2>
              <p className="text-sm text-muted">{resource.nameKorean}</p>
            </div>
            <span className="shrink-0 rounded-chip bg-primary-light px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
              {CATEGORY_LABEL[resource.category]}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            {resource.description}
          </p>
        </div>
      </div>

      <dl className="mt-3 space-y-2 border-t border-border pt-3">
        {resource.rows.map((row) => (
          <div key={`${resource.id}-${row.label}`}>
            <dt className="text-xs font-semibold text-muted">{row.label}</dt>
            <dd className="text-sm text-ink">{row.value}</dd>
          </div>
        ))}
        {resource.price ? (
          <div>
            <dt className="text-xs font-semibold text-muted">Price</dt>
            <dd className="text-sm font-medium text-ink">{resource.price}</dd>
          </div>
        ) : null}
      </dl>

      {resource.warning ? (
        <div className="mt-3 rounded-btn border border-error/35 bg-error/10 px-3 py-2 text-sm text-error">
          <span className="font-semibold">⚠️ </span>
          {resource.warning}
        </div>
      ) : null}

      {resource.tip ? (
        <div className="mt-3 rounded-btn border border-success/35 bg-success/10 px-3 py-2 text-sm text-success">
          <span className="font-semibold">💡 Tip: </span>
          {resource.tip}
        </div>
      ) : null}

      {resource.url ? (
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center rounded-btn bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Open link
        </a>
      ) : null}

      <FreshnessBadge
        itemId={resource.id}
        onVerify={() => markVerified(resource.id)}
        onReport={(note) => reportOutdated(resource.id, note)}
      />
    </article>
  );
}
