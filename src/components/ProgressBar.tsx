"use client";

export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const done    = i + 1 < current;
        const active  = i + 1 === current;
        return (
          <div
            key={i}
            className="step-box"
            style={
              active ? { background: "var(--yellow)" }
              : done  ? { background: "var(--black)", color: "white" }
              :          {}
            }
            aria-hidden
          >
            {String(i + 1).padStart(2, "0")}
          </div>
        );
      })}
      {/* connector line */}
      <span className="flex-1 border-t-2 border-black" aria-hidden />
      <span className="text-[11px] font-bold uppercase tracking-widest text-muted">
        {current}/{total}
      </span>
    </div>
  );
}
