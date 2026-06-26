// src/components/ProgressSummaryCard.tsx
// Salma Ali — Week 1 Gamification Feature
// Shows overall completion summary with motivational message and per-section breakdown

import { useCompletion } from "../context/CompletionContext";
import { navigation, activityPath } from "../data/navigation";

function getMotivationalMessage(percent: number): string {
  if (percent === 0) return "Let's get started! Your college journey begins here 🚀";
  if (percent <= 25) return "Great start! Keep the momentum going 💪";
  if (percent <= 50) return "You're building a strong foundation! 🌱";
  if (percent <= 75) return "You're more than halfway there! 🔥";
  if (percent < 100) return "Almost done! The finish line is in sight 🎯";
  return "You did it! Your college plan is complete 🎉";
}

export default function ProgressSummaryCard() {
  const { isComplete, completedCount, totalCount, completedPaths } = useCompletion();

  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Find the most recently completed activity
  const lastCompletedPath = completedPaths[completedPaths.length - 1];
  let lastCompletedLabel: string | null = null;
  if (lastCompletedPath) {
    for (const group of navigation) {
      for (const item of group.items) {
        if (activityPath(group.slug, item.slug) === lastCompletedPath) {
          lastCompletedLabel = item.label;
        }
      }
    }
  }

  // Per-section breakdown
  const sectionStats = navigation.map((group) => {
    const total = group.items.length;
    const completed = group.items.filter((item) =>
      isComplete(activityPath(group.slug, item.slug))
    ).length;
    return { label: group.label, completed, total };
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Your Progress</h2>
        <p className="text-sm text-indigo-500 mt-0.5">{getMotivationalMessage(percent)}</p>
      </div>

      {/* Overall count */}
      <div className="flex items-end gap-2">
        <span className="text-4xl font-bold text-indigo-600">{completedCount}</span>
        <span className="text-gray-400 text-sm mb-1">/ {totalCount} activities complete</span>
      </div>

      {/* Overall bar */}
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: percent === 100 ? "#22c55e" : "#6366f1",
          }}
        />
      </div>

      {/* Per-section breakdown */}
      <div className="space-y-2 pt-1">
        {sectionStats.map(({ label, completed, total }) => (
          <div key={label} className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{label}</span>
            <span className={`font-medium ${completed === total ? "text-green-500" : "text-indigo-500"}`}>
              {completed}/{total} {completed === total && "✅"}
            </span>
          </div>
        ))}
      </div>

      {/* Most recently completed */}
      {lastCompletedLabel && (
        <div className="text-xs text-gray-400 border-t border-gray-50 pt-3">
          Last completed: <span className="text-gray-600 font-medium">{lastCompletedLabel}</span>
        </div>
      )}
    </div>
  );
}
