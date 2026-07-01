import { Fragment, useMemo } from "react";
import { Compass, Navigation2, Rocket, Wrench } from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { useAchievement } from "../context/AchievementContext";
import { useRank } from "../context/RankContext";
import { ranks } from "../data/ranks";
import {
  TOTAL_XP,
  countEarned,
  makeItemDone,
} from "../lib/nextStep";
import { softCard } from "../theme";

// ── Rank icon map ──────────────────────────────────────────────────────────

const RANK_ICONS = {
  "explorer":     Compass,
  "navigator":    Navigation2,
  "builder":      Wrench,
  "launch-ready": Rocket,
} as const;

// ── Main component ─────────────────────────────────────────────────────────
// A calm "progress at a glance" widget: current rank, XP counter, a single
// cohesive lavender progress bar, and the four-stop rank ladder. The recommended
// next step lives in the dashboard hero spotlight, not here.

export default function ExperienceBar() {
  const { isComplete } = useCompletion();
  const { gradeAchievements } = useAchievement();
  const { currentRank } = useRank();

  const itemDone = useMemo(
    () => makeItemDone(isComplete, gradeAchievements),
    [isComplete, gradeAchievements],
  );

  const earnedXP = useMemo(() => countEarned(itemDone), [itemDone]);
  const xpPct = TOTAL_XP === 0 ? 0 : Math.round((earnedXP / TOTAL_XP) * 100);
  const isFull = earnedXP === TOTAL_XP;

  const RankIcon =
    RANK_ICONS[currentRank.id as keyof typeof RANK_ICONS] ?? Compass;

  return (
    <div className={`${softCard} p-7`}>
      {/* ── Header: rank badge + XP counter ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-500 to-lavender-700 shadow-soft">
            <RankIcon size={22} className="text-white" strokeWidth={2.25} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-lavender-600">
              Current Rank
            </p>
            <p className="mt-0.5 font-display text-xl font-bold leading-none tracking-tight text-ink">
              {currentRank.name}
            </p>
            <p className="mt-1.5 text-xs leading-none text-ink-muted">
              {currentRank.tagline}
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <p className="font-display text-4xl font-bold tabular-nums leading-none tracking-tight text-ink">
            {earnedXP}
            <span className="text-xl font-semibold text-ink-soft"> / {TOTAL_XP}</span>
          </p>
          <p className="mt-1.5 text-xs font-semibold text-ink-soft">
            {isFull ? "All steps complete" : `${xpPct}% of your journey`}
          </p>
        </div>
      </div>

      {/* ── Single cohesive progress bar ── */}
      <div className="mt-5">
        <div className="h-4 w-full overflow-hidden rounded-full bg-lavender-100">
          <div
            className="relative h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${Math.max(xpPct, earnedXP > 0 ? 4 : 0)}%`,
              backgroundImage: isFull
                ? "linear-gradient(90deg, #34d399, #10b981)"
                : "linear-gradient(90deg, #c9b8ff, #8b5cf6 55%, #7c3aed)",
            }}
          >
            {earnedXP > 0 && (
              <div className="xp-shimmer absolute inset-0 w-1/3 bg-white/25" />
            )}
          </div>
        </div>
      </div>

      {/* ── Rank progression track ── */}
      <div className="mt-6 flex items-center gap-1">
        {ranks.map((rank, i) => {
          const Icon =
            RANK_ICONS[rank.id as keyof typeof RANK_ICONS] ?? Compass;
          const earned = currentRank.order >= rank.order;
          const current = currentRank.order === rank.order;
          return (
            <Fragment key={rank.id}>
              <div
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold transition-all duration-300 ${
                  current
                    ? "bg-gradient-to-br from-lavender-600 to-lavender-700 text-white shadow-soft"
                    : earned
                    ? "bg-lavender-100 text-lavender-700"
                    : "text-ink-soft/60"
                }`}
              >
                <Icon size={11} strokeWidth={2.5} />
                {rank.name}
              </div>
              {i < ranks.length - 1 && (
                <div
                  className={`h-0.5 flex-1 rounded-full transition-colors duration-500 ${
                    earned ? "bg-lavender-300" : "bg-lavender-100"
                  }`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
