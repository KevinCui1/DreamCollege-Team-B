import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { activityPath, findActivity } from "../data/navigation";
import { useCompletion } from "../context/CompletionContext";
import { milestones } from "../data/achievements";
import { useAchievement } from "../context/AchievementContext";

export default function ActivityPage() {
  const { groupSlug, itemSlug } = useParams();
  const { isComplete, complete } = useCompletion();
  const { earnMilestone } = useAchievement();

  const match = findActivity(groupSlug, itemSlug);

  if (!match) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-800">Activity not found</h1>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const { group, item } = match;
  const path = activityPath(group.slug, item.slug);
  const done = isComplete(path);

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <nav className="mb-6 text-sm text-slate-400">
        <Link to="/" className="hover:text-slate-600">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>{group.label}</span>
        <span className="mx-2">/</span>
        <span className="text-slate-600">{item.label}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-800">{item.label}</h1>
      <p className="mt-2 text-slate-500">
        Part of <span className="font-medium text-slate-700">{group.label}</span>.
      </p>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {done ? (
          <div>
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={24} />
              <span className="text-lg font-semibold">Activity completed</span>
            </div>
            <p className="mt-2 text-slate-500">
              Nice work — this activity is marked complete and counts toward your
              progress.
            </p>
            <button
              type="button"
              disabled
              className="mt-6 cursor-default rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white opacity-90"
            >
              Completed ✓
            </button>
          </div>
        ) : (
          <div>
            <p className="text-slate-600">
              When you're ready, mark this activity as complete.
            </p>
            <button
              type="button"
              onClick={() => {
                complete(path);
                const milestone = milestones.find((m) => m.triggerPath === path);
                if (milestone) earnMilestone(milestone.id);
              }}
              className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
            >
              Complete Activity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
