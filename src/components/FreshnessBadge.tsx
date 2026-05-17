"use client";

import {
  Banknote,
  BookOpen,
  CheckCircle,
  Clock,
  AlertTriangle,
  AlertCircle,
  ThumbsUp,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  getDaysOld,
  getFreshness,
  getFreshnessLabel,
} from "@/lib/freshness";

const FRESHNESS_ICONS = { CheckCircle, Clock, AlertTriangle, AlertCircle } as const;

export function FreshnessBadge({
  itemId,
  onVerify,
  onReport,
}: {
  itemId: string;
  onVerify: () => void;
  onReport: (note: string) => void;
}) {
  const [tick, setTick] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportDraft, setReportDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const record = useMemo(() => getFreshness(itemId), [itemId, tick]);
  const meta   = useMemo(() => getFreshnessLabel(itemId), [itemId, tick]);
  const daysOld = record ? getDaysOld(record.lastVerified) : null;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  function bump() { setTick((n) => n + 1); }
  function handleVerify() { onVerify(); bump(); setToast("Thanks!"); setShowReport(false); }
  function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault();
    const note = reportDraft.trim();
    if (!note) return;
    onReport(note); bump(); setReportDraft(""); setShowReport(false); setToast("Thanks for reporting!");
  }

  const daysPhrase =
    daysOld === null ? "No date on file"
    : daysOld === 0  ? "Today"
    : daysOld === 1  ? "1 day ago"
    :                  `${daysOld} days ago`;

  const StatusIcon = FRESHNESS_ICONS[meta.iconName];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider">
          <StatusIcon size={9} aria-hidden />
          <span>{meta.label}</span>
          <span className="text-[8px] font-normal normal-case text-muted">{daysPhrase}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={handleVerify}
            aria-label="Still accurate"
            className="flex items-center gap-1 border-2 border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition hover:bg-black hover:text-white"
          >
            <ThumbsUp size={10} aria-hidden /> Accurate
          </button>
          <button
            type="button"
            onClick={() => setShowReport((v) => !v)}
            className="flex items-center gap-1 border-2 border-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition"
            style={{ background: "var(--yellow)" }}
          >
            <TriangleAlert size={10} aria-hidden /> Report
          </button>
        </div>
      </div>

      {showReport ? (
        <form onSubmit={handleReportSubmit} className="mt-2 border-2 border-black p-3">
          <label className="sr-only" htmlFor={`report-${itemId}`}>Describe the issue</label>
          <input
            id={`report-${itemId}`}
            type="text"
            value={reportDraft}
            onChange={(e) => setReportDraft(e.target.value)}
            placeholder="What looks outdated?"
            className="neo-input text-[11px]"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setShowReport(false)}
              className="border-2 border-black px-3 py-1 text-[10px] font-bold uppercase hover:bg-black hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={!reportDraft.trim()}
              className="border-2 border-black px-3 py-1 text-[10px] font-bold uppercase disabled:opacity-40"
              style={{ background: "var(--yellow)" }}>
              Submit
            </button>
          </div>
        </form>
      ) : null}

      {toast ? (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[100] max-w-[90vw] -translate-x-1/2 border-2 border-black bg-black px-4 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-white"
          style={{ boxShadow: "3px 3px 0 #FAC800" }} role="status">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
