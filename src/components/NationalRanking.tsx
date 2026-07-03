import { useState } from "react";
import { Globe, TrendingUp, BookOpen, Award, Target, BarChart2 } from "lucide-react";
import { softCard } from "../theme";

type Metric = {
  label: string;
  value: string;
  percentile: number;
  icon: React.ElementType;
  /** How heavily colleges weigh this factor. 1 = most important. */
  importance: number;
  /**
   * Time needed to meaningfully improve this metric. 1 = a weekend
   * (e.g. service hours), 6 = multiple years (e.g. sustained involvement).
   */
  effort: number;
};

const DEMO_METRICS: Metric[] = [
  { label: "Unweighted GPA", value: "3.82 / 4.0", percentile: 88, icon: BookOpen, importance: 1, effort: 5 },
  { label: "Weighted GPA",   value: "4.45 / 5.0", percentile: 83, icon: TrendingUp, importance: 2, effort: 5 },
  { label: "Class Rank",     value: "18 / 340",   percentile: 95, icon: Award,      importance: 3, effort: 6 },
  { label: "SAT / ACT",      value: "1430 · 32",  percentile: 91, icon: Target,     importance: 4, effort: 3 },
  { label: "AP Scores",      value: "Avg 4.2 / 5", percentile: 86, icon: BarChart2, importance: 5, effort: 4 },
];

type SortOrder =
  | "importance"
  | "highToLow"
  | "lowToHigh"
  | "quickWins"
  | "lowHangingFruit";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "importance",      label: "Importance to colleges" },
  { value: "highToLow",       label: "Strongest first" },
  { value: "lowToHigh",       label: "Weakest first" },
  { value: "quickWins",       label: "Quick wins (least effort)" },
  { value: "lowHangingFruit", label: "Low-hanging fruit (best payoff)" },
];

function pointsToNextTier(p: number): number {
  if (p >= 90) return Infinity;
  if (p >= 75) return 90 - p;
  if (p >= 50) return 75 - p;
  return 50 - p;
}

function impactPerEffort(m: Metric): number {
  const collegeWeight = DEMO_METRICS.length + 1 - m.importance;
  const roomToGrow = 100 - m.percentile;
  return (collegeWeight * roomToGrow) / m.effort;
}

function sortMetrics(metrics: Metric[], order: SortOrder): Metric[] {
  const sorted = [...metrics];
  switch (order) {
    case "highToLow":
      return sorted.sort((a, b) => b.percentile - a.percentile);
    case "lowToHigh":
      return sorted.sort((a, b) => a.percentile - b.percentile);
    case "quickWins":
      return sorted.sort(
        (a, b) =>
          a.effort - b.effort ||
          pointsToNextTier(a.percentile) - pointsToNextTier(b.percentile),
      );
    case "lowHangingFruit":
      return sorted.sort((a, b) => impactPerEffort(b) - impactPerEffort(a));
    case "importance":
      return sorted.sort((a, b) => a.importance - b.importance);
  }
}

const OVERALL_PERCENTILE = 89;

const VISIBILITY_KEY = "crew-b:national-ranking-visible";

function loadVisibility(): boolean {
  try {
    return localStorage.getItem(VISIBILITY_KEY) !== "false";
  } catch {
    return true;
  }
}

/** Earned states stay warm-lavender; only true excellence tips into emerald. */
function barGradient(p: number): string {
  if (p >= 90) return "linear-gradient(90deg, #34d399, #10b981)";
  return "linear-gradient(90deg, #c9b8ff, #8b5cf6)";
}

function MetricRow({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <div className="rounded-2xl border border-lavender-200/70 bg-lavender-50/60 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-soft">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-ink">
          <Icon size={15} className="flex-shrink-0 text-lavender-600" />
          <span className="truncate">{metric.label}</span>
        </div>
        <span className="flex-shrink-0 text-sm font-bold tabular-nums text-ink">
          {metric.value}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-lavender-100">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${metric.percentile}%`, backgroundImage: barGradient(metric.percentile) }}
        />
      </div>
      <p className="mt-1.5 text-right text-xs font-medium text-ink-soft">
        {metric.percentile}th percentile
      </p>
    </div>
  );
}

function VisibilityToggle({
  visible,
  onToggle,
  dark,
}: {
  visible: boolean;
  onToggle: () => void;
  dark: boolean;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-2 text-xs font-medium ${
        dark ? "text-white/75" : "text-slate-500"
      }`}
    >
      {visible ? "Shown" : "Hidden"}
      <button
        type="button"
        role="switch"
        aria-checked={visible}
        aria-label={visible ? "Hide national ranking" : "Show national ranking"}
        onClick={onToggle}
        className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
          visible
            ? dark
              ? "bg-emerald-400"
              : "bg-indigo-500"
            : dark
              ? "bg-white/25"
              : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
            visible ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

export default function NationalRanking() {
  const [visible, setVisible] = useState(loadVisibility);
  const [sortOrder, setSortOrder] = useState<SortOrder>("importance");

  const toggleVisible = () => {
    setVisible((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(VISIBILITY_KEY, String(next));
      } catch {
        // Ignore storage errors; visibility still toggles for this session.
      }
      return next;
    });
  };

  if (!visible) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Globe size={20} className="text-slate-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-700">National Ranking</h2>
            <p className="text-xs text-slate-400">
              Hidden — flip the switch to see how you compare nationally.
            </p>
          </div>
        </div>
        <VisibilityToggle visible={visible} onToggle={toggleVisible} dark={false} />
      </div>
    );
  }

  return (
    <section className={`${softCard} overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-lavender-500 to-lavender-700 px-6 py-6 text-white">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold tracking-tight">
                Where you stand
              </h2>
              <p className="text-sm text-lavender-100">
                Compared with students across the country
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:text-right">
            <div>
              <p className="text-xs font-medium text-lavender-100">Overall percentile</p>
              <p className="font-display text-4xl font-bold leading-none">
                {OVERALL_PERCENTILE}
                <span className="text-xl font-semibold text-lavender-200">th</span>
              </p>
              <p className="mt-0.5 text-xs text-lavender-200">
                Top {100 - OVERALL_PERCENTILE}% nationally
              </p>
            </div>
            <div className="relative h-16 w-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray={`${OVERALL_PERCENTILE} ${100 - OVERALL_PERCENTILE}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {OVERALL_PERCENTILE}%
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end border-t border-white/10 pt-3">
          <VisibilityToggle visible={visible} onToggle={toggleVisible} dark />
        </div>
      </div>

      {/* Sort control */}
      <div className="flex items-center justify-end px-6 pt-5">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
          Sort by
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 shadow-sm focus:border-indigo-400 focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Metric breakdown */}
      <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortMetrics(DEMO_METRICS, sortOrder).map((m) => (
          <MetricRow key={m.label} metric={m} />
        ))}
      </div>

      <p className="px-6 pb-6 text-xs text-ink-soft">
        Demo data — your percentile compares you with college-bound students on the platform.
        Connect your school profile to see live rankings.
      </p>
    </section>
  );
}
