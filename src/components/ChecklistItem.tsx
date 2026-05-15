"use client";

import type { ChecklistItem as ChecklistItemType } from "@/types";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import { markVerified, reportOutdated } from "@/lib/freshness";

export function ChecklistItem({
  item,
  onToggle,
}: {
  item: ChecklistItemType;
  onToggle: (id: string, completed: boolean) => void;
}) {
  const checkboxId = `chk-${item.id}`;

  return (
    <div
      className={`rounded-card border border-border bg-white shadow-sm transition hover:border-primary/30 ${
        item.urgent ? "ring-1 ring-warning/40" : ""
      }`}
    >
      <div className="flex gap-3 p-4">
        <input
          id={checkboxId}
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-border text-primary focus:ring-primary"
          checked={item.completed}
          onChange={(e) => onToggle(item.id, e.target.checked)}
        />
        <label htmlFor={checkboxId} className="min-w-0 flex-1 cursor-pointer">
          <span className="flex flex-wrap items-center gap-2">
            <span
              className={`font-semibold text-ink ${
                item.completed ? "line-through opacity-60" : ""
              }`}
            >
              {item.text}
            </span>
            {item.urgent ? (
              <span className="rounded-chip bg-warning/15 px-2 py-0.5 text-xs font-semibold text-warning">
                Urgent
              </span>
            ) : null}
          </span>
          <span
            className={`mt-1 block text-sm text-muted ${
              item.completed ? "line-through opacity-60" : ""
            }`}
          >
            {item.detail}
          </span>
        </label>
      </div>
      <div className="px-4 pb-3">
        <FreshnessBadge
          itemId={item.id}
          onVerify={() => markVerified(item.id)}
          onReport={(note) => reportOutdated(item.id, note)}
        />
      </div>
    </div>
  );
}
