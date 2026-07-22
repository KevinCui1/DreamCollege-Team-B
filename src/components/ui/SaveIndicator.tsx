import { Check, Loader2, RotateCcw } from "lucide-react";
import { cn } from "./cn";

/** Autosave lifecycle, exposed by the profile store. */
export type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Non-intrusive autosave feedback. The "Saved" stamp follows the lavender UI.
 * announced politely to screen readers and never steals focus.
 */
export default function SaveIndicator({
  state,
  onRetry,
  className,
}: {
  state: SaveState;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      aria-live="polite"
      className={cn(
        "flex min-h-[24px] items-center gap-1.5 font-body text-xs",
        className,
      )}
    >
      {state === "saving" && (
        <span className="flex items-center gap-1.5 text-ink-muted">
          <Loader2 size={14} className="animate-spin motion-reduce:animate-none" />
          Saving…
        </span>
      )}
      {state === "saved" && (
        <span className="animate-stamp-in flex items-center gap-1 font-semibold uppercase tracking-[0.12em] text-lavender-700">
          <Check size={14} strokeWidth={2.5} />
          Saved
        </span>
      )}
      {state === "error" && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 rounded font-semibold text-oxblood outline-none hover:underline focus-visible:ring-2 focus-visible:ring-oxblood"
        >
          <RotateCcw size={14} />
          Couldn't save — retry
        </button>
      )}
    </div>
  );
}
