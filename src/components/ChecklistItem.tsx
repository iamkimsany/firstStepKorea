"use client";

import type { ChecklistItem as ChecklistItemType } from "@/types";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import { markVerified, reportOutdated } from "@/lib/freshness";

export function ChecklistItem({
  item,
  onToggle,
  urgentLabel = "Urgent",
}: {
  item: ChecklistItemType;
  onToggle: (id: string, completed: boolean) => void;
  urgentLabel?: string;
}) {
  const checkboxId = `chk-${item.id}`;

  return (
    <div className="neo-card transition">
      <div className="flex gap-4 p-4">
        {/* square checkbox */}
        <div className="mt-0.5 shrink-0">
          <input
            id={checkboxId}
            type="checkbox"
            className="sr-only"
            checked={item.completed}
            onChange={(e) => onToggle(item.id, e.target.checked)}
          />
          <label
            htmlFor={checkboxId}
            className="flex h-6 w-6 cursor-pointer items-center justify-center border-2 border-black transition"
            style={item.completed ? { background: "var(--yellow)" } : { background: "white" }}
            aria-label={item.completed ? "Unmark complete" : "Mark complete"}
          >
            {item.completed ? (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
                <path d="M1 5l3.5 3.5L11 1" stroke="black" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
            ) : null}
          </label>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-sm font-bold uppercase tracking-tight text-black ${
                item.completed ? "line-through opacity-40" : ""
              }`}
            >
              {item.text}
            </span>
            {item.urgent && !item.completed ? (
              <span className="neo-label text-[9px]">{urgentLabel}</span>
            ) : null}
          </div>
          <p
            className={`mt-1.5 text-xs font-medium leading-relaxed text-muted ${
              item.completed ? "line-through opacity-40" : ""
            }`}
          >
            {item.detail}
          </p>
        </div>
      </div>

      <div className="border-t-2 border-black px-4 py-2.5">
        <FreshnessBadge
          itemId={item.id}
          onVerify={() => markVerified(item.id)}
          onReport={(note) => reportOutdated(item.id, note)}
        />
      </div>
    </div>
  );
}
