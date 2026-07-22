import { RotateCcw, Undo2 } from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { useRank } from "../context/RankContext";
import { useAchievement } from "../context/AchievementContext";
import { useStudentProfile } from "../context/StudentProfileContext";
import Button from "./ui/Button";

/**
 * Always-on-screen control group that wipes every bit of saved progress —
 * completed activities, rank state, achievements, College Profile, and quiz
 * answers — down to a true blank slate, with a paired "Restore Inputs"
 * control to bring back the last saved College Profile + quiz snapshot.
 * Pinned to the viewport so it's reachable from any route.
 */
export default function ResetButton() {
  const { resetAll, completedCount } = useCompletion();
  const { resetRank } = useRank();
  const { resetAchievements } = useAchievement();
  const { resetProfile, restoreProfile, hasBackup } = useStudentProfile();

  const handleReset = async () => {
    if (
      !window.confirm(
        "Reset all progress? This clears your completed activities, rank, achievements, College Profile, and quiz answers. Your College Profile and quiz answers are saved first and can be brought back with \"Restore inputs\".",
      )
    ) {
      return;
    }
    resetAll();
    resetRank();
    resetAchievements();
    await resetProfile();
    window.location.reload();
  };

  const handleRestore = () => {
    if (
      !window.confirm(
        "Restore your most recently saved College Profile and quiz answers? This won't affect your progress or completions.",
      )
    ) {
      return;
    }
    restoreProfile();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleRestore}
        disabled={!hasBackup}
        aria-label="Restore last saved inputs"
        className="shadow-almanac"
      >
        <Undo2 size={16} />
        Restore inputs
      </Button>
      <button
        type="button"
        onClick={handleReset}
        aria-label="Reset all progress"
        className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 active:scale-95"
      >
        <RotateCcw size={16} />
        Reset progress
        {completedCount > 0 && (
          <span className="ml-0.5 rounded-full bg-white/25 px-1.5 text-xs">
            {completedCount}
          </span>
        )}
      </button>
    </div>
  );
}
