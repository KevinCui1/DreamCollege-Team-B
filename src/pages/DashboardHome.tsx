import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { useRank } from "../context/RankContext";
import { badges } from "../data/badges";
import Badge from "../components/Badge";
import NationalRanking from "../components/NationalRanking";
import ExperienceBar from "../components/ExperienceBar";
import JourneyTimeline from "../components/JourneyTimeline";
import { softCard } from "../theme";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHome() {
  const { completedCount, totalCount } = useCompletion();
  const { markDashboardVisited, currentRank } = useRank();

  useEffect(() => {
    markDashboardVisited();
  }, [markDashboardVisited]);

  const earnedBadges = badges.filter((b) =>
    b.isEarned(completedCount, totalCount),
  ).length;

  return (
    <div className="mx-auto max-w-4xl space-y-7 px-6 py-12 sm:px-8">
      {/* ── Warm welcome hero ── */}
      <header>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-lavender-500">
            Welcome back
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lavender-100 px-2.5 py-1 text-[11px] font-bold text-lavender-700">
            <Sparkles size={12} strokeWidth={2.5} />
            {currentRank.name}
          </span>
        </div>
        <h1 className="mt-2.5 font-display text-4xl font-bold tracking-tight text-ink">
          {greeting()}.
        </h1>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Plan your path to college, track your progress, and get a personalized
          AI roadmap.
        </p>
      </header>

      {/* ── Unified planning module ── */}
      <JourneyTimeline />

      {/* ── Where you stand ── */}
      <NationalRanking />

      {/* ── Progress at a glance ── */}
      <ExperienceBar />

      {/* ── Milestones ── */}
      <section className={`${softCard} p-7`}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold tracking-tight text-ink">
              Milestones
            </h2>
            <p className="mt-0.5 text-sm text-ink-muted">
              Badges you earn as your progress grows.
            </p>
          </div>
          <span className="flex-shrink-0 rounded-full bg-lavender-100 px-3 py-1 text-xs font-bold text-lavender-700">
            {earnedBadges} / {badges.length} earned
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-x-7 gap-y-6">
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
    </div>
  );
}
