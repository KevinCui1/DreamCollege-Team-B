import { Link } from "react-router-dom";
import { ArrowRight, Trophy } from "lucide-react";
import { useAchievement } from "../context/AchievementContext";

export default function NextStepBanner() {
  const { nextMilestone, earnedMilestoneCount, totalMilestoneCount } =
    useAchievement();

  if (!nextMilestone) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <Trophy size={20} className="text-emerald-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-emerald-800">All milestones complete!</p>
          <p className="text-sm text-emerald-600">
            You've completed your entire achievement path. Incredible work!
          </p>
        </div>
      </div>
    );
  }

  const Icon = nextMilestone.icon;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600">
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
            Next Step
          </span>
          <span className="text-xs text-slate-400">
            {earnedMilestoneCount} of {totalMilestoneCount} milestones done
          </span>
        </div>
        <p className="text-sm font-semibold leading-snug text-slate-800">
          {nextMilestone.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{nextMilestone.description}</p>
      </div>
      <Link
        to={nextMilestone.triggerPath}
        className="flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
      >
        Go <ArrowRight size={14} />
      </Link>
    </div>
  );
}
