import { useEffect } from "react";
import { Link } from "react-router-dom";
import { navigation, activityPath } from "../data/navigation";
import { useCompletion } from "../context/CompletionContext";
import { badges } from "../data/badges";
import Badge from "../components/Badge";
import { useRank } from "../context/RankContext";
import NationalRanking from "../components/NationalRanking";
import NextStepBanner from "../components/NextStepBanner";
import ProgressSummaryCard from "../components/ProgressSummaryCard";
import ExperienceBar from "../components/ExperienceBar";

export default function DashboardHome() {
  const { completedCount, totalCount, isComplete } = useCompletion();
  const { markDashboardVisited } = useRank();
  const pct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  useEffect(() => {
    markDashboardVisited();
  }, [markDashboardVisited]);

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-800">Student Dashboard</h1>
      <p className="mt-2 text-slate-500">
        Work through your activities below. Each one you complete counts toward
        your overall progress.
      </p>

      {/* Experience bar */}
      <div className="mt-8">
        <ExperienceBar />
      </div>

      {/* Overall progress bar */}
      <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm/relaxed opacity-90">Activities completed</p>
            <p className="text-4xl font-bold">
              {completedCount}
              <span className="text-xl font-medium opacity-80"> / {totalCount}</span>
            </p>
          </div>
          <p className="text-3xl font-bold">{pct}%</p>
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      
      <div className="mt-6">
        <ProgressSummaryCard />
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-6">
        {badges.map((badge) => (
          <Badge
            key={badge.id}
            icon={badge.icon}
            label={badge.label}
            color={badge.color}
            earned={badge.isEarned(completedCount, totalCount)}
          />
        ))}
      </div>
      <div className="mt-6">
        <NextStepBanner />
      </div>
      <NationalRanking />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {navigation.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.slug}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <Icon size={18} className="text-indigo-600" />
                {group.label}
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const path = activityPath(group.slug, item.slug);
                  return (
                    <li key={item.slug}>
                      <Link
                        to={path}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                      >
                        {item.label}
                        {isComplete(path) && (
                          <span className="text-xs font-medium text-emerald-500">
                            Done
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
