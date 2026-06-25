import { useEffect } from "react";
import { Trophy, X } from "lucide-react";
import { useAchievement } from "../context/AchievementContext";

const AUTO_DISMISS_MS = 4500;

export default function CelebrationToast() {
  const { celebration, clearCelebration } = useAchievement();

  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(clearCelebration, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [celebration, clearCelebration]);

  if (!celebration) return null;

  return (
    <div
      className="fixed bottom-20 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-white shadow-2xl"
      style={{ animation: "achievementSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/20">
        <Trophy size={22} className="text-yellow-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-75">
          Achievement Unlocked
        </p>
        <p className="truncate text-[15px] font-semibold leading-snug">
          {celebration.title}
        </p>
      </div>
      <button
        type="button"
        onClick={clearCelebration}
        aria-label="Dismiss"
        className="flex-shrink-0 rounded-lg p-1.5 opacity-60 transition hover:bg-white/20 hover:opacity-100"
      >
        <X size={15} />
      </button>
    </div>
  );
}
