"use client";

import Link from "next/link";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, TriangleAlert } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { SOOKMYUNG_RESOURCES } from "@/lib/campus-resources";
import type { FreshnessRecord } from "@/types";
import {
  ensureFreshnessInitialized,
  getAdminFreshnessRows,
  getFreshnessLabel,
  resetAllFreshnessToToday,
} from "@/lib/freshness";

const FRESHNESS_ICONS = { CheckCircle, Clock, AlertTriangle, AlertCircle } as const;

function FreshnessIcon({ iconName, color }: { iconName: keyof typeof FRESHNESS_ICONS; color: string }) {
  const Icon = FRESHNESS_ICONS[iconName];
  return <Icon size={12} style={{ color }} aria-hidden />;
}

function displayItemLabel(itemId: string): string {
  const campus = SOOKMYUNG_RESOURCES.find((r) => r.id === itemId);
  if (campus) return `${campus.name}`;
  return itemId;
}

function rowTone(daysOld: number): string {
  if (daysOld >= 60) return "bg-error/10";
  if (daysOld >= 30) return "bg-warning/10";
  return "bg-success/10";
}

type Row = {
  itemId: string;
  record: FreshnessRecord;
  daysOld: number;
};

export default function FreshnessAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    ensureFreshnessInitialized();
    setRows(getAdminFreshnessRows());
  }, [tick]);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  function handleReset() {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Reset last verified date for all items to today?")
    ) {
      return;
    }
    resetAllFreshnessToToday();
    refresh();
  }

  return (
    <main className="min-h-dvh bg-surface px-4 pb-10 pt-6 safe-bottom">
      <div className="mx-auto max-w-mobile">
        <Link
          href="/checklist"
          className="text-xs font-medium text-primary hover:underline"
        >
          ← Back to app
        </Link>
        <h1 className="mt-4 text-xl font-bold text-ink">Data freshness</h1>
        <p className="mt-1 text-xs text-muted">
          Local read-only view · stalest items first
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="mt-4 rounded-btn bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-dark"
        >
          Reset all to today
        </button>

        <div className="mt-6 overflow-x-auto rounded-card border border-border bg-white shadow-sm">
          <table className="w-full min-w-[520px] border-collapse text-left text-[11px]">
            <thead>
              <tr className="border-b border-border bg-surface/80">
                <th className="px-2 py-2 font-semibold text-ink">Item</th>
                <th className="px-2 py-2 font-semibold text-ink">
                  Last verified
                </th>
                <th className="px-2 py-2 font-semibold text-ink">Days old</th>
                <th className="px-2 py-2 font-semibold text-ink">
                  Verified by
                </th>
                <th className="px-2 py-2 font-semibold text-ink">Status</th>
                <th className="px-2 py-2 font-semibold text-ink">Report</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ itemId, record, daysOld }) => {
                const labelMeta = getFreshnessLabel(itemId);
                return (
                  <tr
                    key={itemId}
                    className={`border-b border-border ${rowTone(daysOld)}`}
                  >
                    <td className="max-w-[140px] px-2 py-2 align-top text-ink">
                      <span className="font-medium">
                        {displayItemLabel(itemId)}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] text-muted">
                        {itemId}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 align-top text-muted">
                      {record.lastVerified.slice(0, 10)}
                    </td>
                    <td className="px-2 py-2 align-top font-semibold text-ink">
                      {daysOld}
                    </td>
                    <td className="px-2 py-2 align-top">
                      {record.verifiedCount}
                    </td>
                    <td className="max-w-[120px] px-2 py-2 align-top">
                      <span className="flex items-center gap-1" style={{ color: labelMeta.color }}>
                        <FreshnessIcon iconName={labelMeta.iconName} color={labelMeta.color} />
                        {labelMeta.label}
                      </span>
                      {record.reportedOutdated ? (
                        <span className="mt-1 inline-flex items-center gap-1 rounded bg-warning/25 px-1.5 py-0.5 text-[10px] font-bold text-warning">
                          <TriangleAlert size={9} aria-hidden /> Flagged
                        </span>
                      ) : null}
                    </td>
                    <td className="max-w-[160px] px-2 py-2 align-top text-muted">
                      {record.reportNote ? (
                        <span className="flex items-start gap-1 text-error">
                          <TriangleAlert size={10} className="mt-px shrink-0" aria-hidden />
                          {record.reportNote}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length === 0 ? (
          <p className="mt-4 text-xs text-muted">Loading or no records…</p>
        ) : null}
      </div>
    </main>
  );
}
