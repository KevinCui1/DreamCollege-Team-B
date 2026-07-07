import { useMemo } from "react";
import { Compass, MapPinned, Rocket, Wrench } from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { useRank } from "../context/RankContext";
import { ranks } from "../data/ranks";
import { TOTAL_XP, earnedXp } from "../lib/nextStep";
import { softCard } from "../theme";

// ── Rank icon map ──────────────────────────────────────────────────────────

const RANK_ICONS = {
  "explorer":     Compass,
  "planner":      MapPinned,
  "builder":      Wrench,
  "launch-ready": Rocket,
} as const;

/** Chart plot height in pixels — ticks and the bar are positioned within it. */
const CHART_H = 240;

// ── Main component ─────────────────────────────────────────────────────────
// The experience bar, drawn as a single-column bar chart: a numerical XP y-axis
// whose ticks are labeled with each rank, gridlines at every rank threshold, and
// a column that rises to the student's current XP.

export default function ExperienceBar() {
  const { isComplete } = useCompletion();
  const { currentRank } = useRank();

  const xp = useMemo(() => earnedXp(isComplete), [isComplete]);
  const xpPct = TOTAL_XP === 0 ? 0 : (xp / TOTAL_XP) * 100;
  const isFull = xp >= TOTAL_XP;

  // The next rank the student hasn't reached yet (null once Launch Ready is hit).
  const nextRank = useMemo(
    () => ranks.find((r) => r.xpThreshold > xp) ?? null,
    [xp],
  );
  const xpToNext = nextRank ? nextRank.xpThreshold - xp : 0;

  const RankIcon =
    RANK_ICONS[currentRank.id as keyof typeof RANK_ICONS] ?? Compass;

  // Bottom offset (%) for a given XP value on the chart scale.
  const offsetPct = (value: number) =>
    TOTAL_XP === 0 ? 0 : (value / TOTAL_XP) * 100;

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
            {xp}
            <span className="text-xl font-semibold text-ink-soft"> XP</span>
          </p>
          <p className="mt-1.5 text-xs font-semibold text-ink-soft">
            {isFull
              ? "Max rank reached"
              : `${xpToNext} XP to ${nextRank?.name}`}
          </p>
        </div>
      </div>

      {/* ── Bar chart: rank-labeled numerical y-axis + XP column ── */}
      <div className="mt-7 flex gap-3">
        {/* Y-axis: one tick per rank, showing its XP threshold + name. */}
        <div
          className="relative w-24 flex-shrink-0"
          style={{ height: CHART_H }}
          aria-hidden="true"
        >
          {ranks.map((rank) => {
            const reached = xp >= rank.xpThreshold;
            const current = rank.id === currentRank.id;
            return (
              <div
                key={rank.id}
                className="absolute right-0 flex translate-y-1/2 flex-col items-end text-right"
                style={{ bottom: `${offsetPct(rank.xpThreshold)}%` }}
              >
                <span
                  className={`font-display text-sm font-bold tabular-nums leading-none ${
                    reached ? "text-lavender-700" : "text-ink-soft"
                  }`}
                >
                  {rank.xpThreshold}
                </span>
                <span
                  className={`mt-0.5 text-[10px] font-semibold leading-tight ${
                    current
                      ? "text-lavender-600"
                      : reached
                      ? "text-ink-muted"
                      : "text-ink-soft/70"
                  }`}
                >
                  {rank.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Plot area: gridlines at each threshold + the rising XP column. */}
        <div
          className="relative flex-1 border-l border-lavender-200"
          style={{ height: CHART_H }}
        >
          {/* Threshold gridlines */}
          {ranks.map((rank) => {
            const reached = xp >= rank.xpThreshold;
            return (
              <div
                key={rank.id}
                className={`absolute inset-x-0 border-t border-dashed ${
                  reached ? "border-lavender-300" : "border-lavender-200/70"
                }`}
                style={{ bottom: `${offsetPct(rank.xpThreshold)}%` }}
                aria-hidden="true"
              />
            );
          })}

          {/* The XP column — a solid purple bar that grows vertically with XP.
              The wrapper spans the full plot height so the bar's percentage
              height resolves against the chart, and items-end anchors it to the
              baseline. */}
          <div className="absolute inset-x-4 inset-y-0 flex items-end justify-center">
            <div
              className={`w-1/2 rounded-t-xl transition-[height] duration-700 ease-out ${
                isFull ? "bg-emerald-500" : "bg-lavender-600"
              }`}
              style={{ height: `${Math.max(xpPct, xp > 0 ? 3 : 0)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
