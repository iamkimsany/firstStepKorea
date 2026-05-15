"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDaysOld,
  getFreshness,
  getFreshnessLabel,
} from "@/lib/freshness";

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
  const meta = useMemo(() => getFreshnessLabel(itemId), [itemId, tick]);
  const daysOld = record ? getDaysOld(record.lastVerified) : null;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  function bump() {
    setTick((n) => n + 1);
  }

  function handleVerify() {
    onVerify();
    bump();
    setToast("Thanks!");
    setShowReport(false);
  }

  function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault();
    const note = reportDraft.trim();
    if (!note) return;
    onReport(note);
    bump();
    setReportDraft("");
    setShowReport(false);
    setToast("Thanks for reporting!");
  }

  const daysPhrase =
    daysOld === null
      ? "No date on file"
      : daysOld === 0
        ? "Today"
        : daysOld === 1
          ? "1 day ago"
          : `${daysOld} days ago`;

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1 text-[11px] leading-snug">
          <span style={{ color: meta.color }} aria-hidden>
            {meta.emoji}{" "}
          </span>
          <span className="font-semibold" style={{ color: meta.color }}>
            {meta.label}
          </span>
          <span className="text-muted"> · {daysPhrase}</span>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1">
          <span className="hidden text-[11px] text-muted sm:inline">
            Still accurate?
          </span>
          <button
            type="button"
            onClick={handleVerify}
            aria-label="Still accurate"
            className="rounded-lg border border-primary/25 bg-white px-2 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary-light"
          >
            👍
          </button>
          <button
            type="button"
            onClick={() => setShowReport((v) => !v)}
            className="rounded-lg border border-warning/40 bg-white px-2 py-1 text-[11px] font-semibold text-warning transition hover:bg-warning/10"
          >
            ⚠️ Report
          </button>
        </div>
      </div>

      {showReport ? (
        <form
          onSubmit={handleReportSubmit}
          className="mt-2 rounded-lg border border-border bg-surface/80 p-2"
        >
          <label className="sr-only" htmlFor={`report-${itemId}`}>
            Describe the issue
          </label>
          <input
            id={`report-${itemId}`}
            type="text"
            value={reportDraft}
            onChange={(e) => setReportDraft(e.target.value)}
            placeholder="What looks outdated?"
            className="w-full rounded-md border border-border bg-white px-2 py-1.5 text-[11px] text-ink outline-none ring-primary/20 placeholder:text-muted focus:ring-1"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowReport(false)}
              className="rounded-md px-2 py-1 text-[11px] font-medium text-muted hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reportDraft.trim()}
              className="rounded-md bg-primary px-3 py-1 text-[11px] font-semibold text-white disabled:opacity-40"
            >
              Submit
            </button>
          </div>
        </form>
      ) : null}

      {toast ? (
        <div
          className="pointer-events-none fixed bottom-24 left-1/2 z-[100] max-w-[90vw] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-center text-[11px] font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
