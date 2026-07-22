import { cn } from "./cn";

/**
 * A calm "chapter ribbon" — vivid-purple fill on a lavender track. This is
 * deliberately NOT a gamified XP bar (see DESIGN.md); it just orients the
 * student within a short collection flow.
 */
export default function ProgressRibbon({
  current,
  total,
  label,
  className,
}: {
  current: number;
  total: number;
  label?: string;
  className?: string;
}) {
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(100, Math.round((current / safeTotal) * 100));
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center justify-between font-body text-xs text-ink-muted">
        <span>{label ?? `Step ${Math.min(current, safeTotal)} of ${safeTotal}`}</span>
        <span className="tabular-nums">{pct}%</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-lavender-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Collection progress"}
      >
        <div
          className="h-full rounded-full bg-lavender-700 transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
