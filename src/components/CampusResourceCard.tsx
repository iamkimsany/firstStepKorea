"use client";

import {
  Banknote,
  BookOpen,
  ExternalLink,
  FileText,
  Languages,
  TriangleAlert,
  Users,
} from "lucide-react";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import type { CampusCategory, CampusResource } from "@/lib/campus-resources";
import { markVerified, reportOutdated } from "@/lib/freshness";

const CATEGORY_LABEL: Record<CampusCategory, string> = {
  documents: "Documents",
  finance:   "Finance",
  academic:  "Academic",
  language:  "Language",
  community: "Community",
};

const CATEGORY_ICON: Record<CampusCategory, React.ReactNode> = {
  documents: <FileText  size={18} />,
  finance:   <Banknote  size={18} />,
  academic:  <BookOpen  size={18} />,
  language:  <Languages size={18} />,
  community: <Users     size={18} />,
};

export function CampusResourceCard({ resource }: { resource: CampusResource }) {
  return (
    <article className="neo-card">
      {/* header */}
      <div className="flex gap-4 p-5 pb-4">
        {/* icon box — yellow fill */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black"
          style={{ background: "var(--yellow)" }}
          aria-hidden
        >
          {CATEGORY_ICON[resource.category]}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-tight text-black">{resource.name}</h2>
              <p className="text-[11px] font-medium text-muted">{resource.nameKorean}</p>
            </div>
            <span className="neo-label">{CATEGORY_LABEL[resource.category]}</span>
          </div>
          <p className="mt-2 text-xs font-medium leading-relaxed text-muted">
            {resource.description}
          </p>
        </div>
      </div>

      {/* detail rows */}
      <dl className="space-y-2 border-t-2 border-black px-5 py-4">
        {resource.rows.map((row) => (
          <div key={`${resource.id}-${row.label}`} className="flex gap-4">
            <dt className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted">{row.label}</dt>
            <dd className="text-xs font-medium text-black">{row.value}</dd>
          </div>
        ))}
        {resource.price ? (
          <div className="flex gap-4">
            <dt className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted">Price</dt>
            <dd className="text-xs font-bold text-black">{resource.price}</dd>
          </div>
        ) : null}
      </dl>

      {/* warning */}
      {resource.warning ? (
        <div className="mx-5 mb-3 flex items-start gap-2 border-l-4 border-black bg-canvas px-4 py-3 text-xs font-medium text-black">
          <TriangleAlert size={13} className="mt-0.5 shrink-0" aria-hidden />
          <span><span className="font-bold uppercase">Warning — </span>{resource.warning}</span>
        </div>
      ) : null}

      {/* tip */}
      {resource.tip ? (
        <div className="mx-5 mb-3 border-2 border-black bg-canvas px-4 py-3 text-xs font-medium text-black">
          <span className="font-bold uppercase">Tip — </span>{resource.tip}
        </div>
      ) : null}

      {/* CTA */}
      {resource.url ? (
        <div className="px-5 pb-5 pt-1">
          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Open link <ExternalLink size={14} aria-hidden />
          </a>
        </div>
      ) : null}

      <div className="border-t-2 border-black px-5 py-3">
        <FreshnessBadge
          itemId={resource.id}
          onVerify={() => markVerified(resource.id)}
          onReport={(note) => reportOutdated(resource.id, note)}
        />
      </div>
    </article>
  );
}
