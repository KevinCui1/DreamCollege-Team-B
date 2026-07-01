import { Globe, TrendingUp, BookOpen, Award, Target, BarChart2 } from "lucide-react";
import { softCard } from "../theme";

type Metric = {
  label: string;
  value: string;
  percentile: number;
  icon: React.ElementType;
};

const DEMO_METRICS: Metric[] = [
  { label: "Unweighted GPA", value: "3.82 / 4.0", percentile: 88, icon: BookOpen },
  { label: "Weighted GPA", value: "4.45 / 5.0", percentile: 83, icon: TrendingUp },
  { label: "Class Rank", value: "18 / 340", percentile: 95, icon: Award },
  { label: "SAT / ACT", value: "1430 · 32", percentile: 91, icon: Target },
  { label: "AP Scores", value: "Avg 4.2 / 5", percentile: 86, icon: BarChart2 },
];

const OVERALL_PERCENTILE = 89;

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

export default function NationalRanking() {
  return (
    <section className={`${softCard} overflow-hidden`}>
      {/* Header — soft lavender gradient (was a heavy solid block). */}
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
      </div>

      {/* Metric breakdown — calmer, lower-density rows. */}
      <div className="grid gap-3 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_METRICS.map((m) => (
          <MetricRow key={m.label} metric={m} />
        ))}
      </div>

      {/* Single muted context line (was a wordy card). */}
      <p className="px-6 pb-6 text-xs text-ink-soft">
        Demo data — your percentile compares you with college-bound students on the platform.
        Connect your school profile to see live rankings.
      </p>
    </section>
  );
}
