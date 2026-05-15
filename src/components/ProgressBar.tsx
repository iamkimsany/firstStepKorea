"use client";

export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full px-1">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span className="font-medium text-ink">
          Step {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-primary-light">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
