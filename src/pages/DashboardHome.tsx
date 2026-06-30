import { useEffect } from "react";
import { useCompletion } from "../context/CompletionContext";
import { badges } from "../data/badges";
import Badge from "../components/Badge";
import { useRank } from "../context/RankContext";
import NationalRanking from "../components/NationalRanking";
import ExperienceBar from "../components/ExperienceBar";
import { glassCard, eyebrow } from "../theme";

export default function DashboardHome() {
  const { completedCount, totalCount } = useCompletion();
  const { markDashboardVisited } = useRank();

  useEffect(() => {
    markDashboardVisited();
  }, [markDashboardVisited]);

  const earnedBadges = badges.filter((b) =>
    b.isEarned(completedCount, totalCount),
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-8 py-12">
      {/* ── Hero header ── */}
      <header>
        <p className={eyebrow}>Your College Journey</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900">
          Student Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-500">
          Work through your activities below. Each one you complete moves you up
          the ranks and adds to your overall progress.
        </p>
      </header>

      {/* ── Experience bar ── */}
      <ExperienceBar />

      {/* ── Milestones ── */}
      <section className={`${glassCard} p-7`}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-slate-900">
              Milestones
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Badges you earn as your progress grows.
            </p>
          </div>
          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
            {earnedBadges} / {badges.length} earned
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-7">
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
      </section>

      {/* ── National ranking ── */}
      <NationalRanking />
    </div>
  );
}
