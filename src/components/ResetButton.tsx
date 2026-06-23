import { RotateCcw } from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { useRank } from "../context/RankContext";

/**
 * Always-on-screen control that wipes every bit of saved progress:
 * completed activities and rank state (dashboard milestone + celebrations).
 * Pinned to the viewport so it's reachable from any route.
 */
export default function ResetButton() {
  const { resetAll, completedCount } = useCompletion();
  const { resetRank } = useRank();

  const handleReset = () => {
    if (
      !window.confirm(
        "Reset all progress? This clears your completed activities and rank.",
      )
    ) {
      return;
    }
    resetAll();
    resetRank();
  };

  return (
    <button
      type="button"
      onClick={handleReset}
      aria-label="Reset all progress"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 active:scale-95"
    >
      <RotateCcw size={16} />
      Reset progress
      {completedCount > 0 && (
        <span className="ml-0.5 rounded-full bg-white/25 px-1.5 text-xs">
          {completedCount}
        </span>
      )}
    </button>
  );
}
