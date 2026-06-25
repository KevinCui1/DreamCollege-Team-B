import { Globe, TrendingUp, BookOpen, Award, Target, BarChart2 } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  percentile: number;
  insight: string;
  icon: React.ElementType;
};

const DEMO_METRICS: Metric[] = [
  {
    label: "Unweighted GPA",
    value: "3.82 / 4.0",
    percentile: 88,
    insight: "Higher than 88% of DreamCollege students nationally.",
    icon: BookOpen,
  },
  {
    label: "Weighted GPA",
    value: "4.45 / 5.0",
    percentile: 83,
    insight: "Your rigorous course load puts you in the top 17%.",
    icon: TrendingUp,
  },
  {
    label: "Class Rank",
    value: "18 / 340",
    percentile: 95,
    insight: "Top 5% of your graduating class — highly competitive.",
    icon: Award,
  },
  {
    label: "SAT / ACT",
    value: "1430 SAT · 32 ACT",
    percentile: 91,
    insight: "Above the median for most top-50 universities.",
    icon: Target,
  },
  {
    label: "AP Scores",
    value: "Avg 4.2 across 5 exams",
    percentile: 86,
    insight: "Strong AP performance signals college-level readiness.",
    icon: BarChart2,
  },
];

const OVERALL_PERCENTILE = 89;

function percentileColor(p: number): string {
  if (p >= 90) return "bg-emerald-500";
  if (p >= 75) return "bg-indigo-500";
  if (p >= 50) return "bg-amber-400";
  return "bg-rose-400";
}

function percentileLabel(p: number): string {
  if (p >= 90) return "Excellent";
  if (p >= 75) return "Strong";
  if (p >= 50) return "Average";
  return "Needs Work";
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;
  const barColor = percentileColor(metric.percentile);
  const badge = percentileLabel(metric.percentile);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Icon size={15} className="text-indigo-500" />
          {metric.label}
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium text-white ${barColor}`}
        >
          {badge}
        </span>
      </div>

      <p className="mb-3 text-sm font-bold text-slate-900">{metric.value}</p>

      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span>National percentile</span>
        <span className="font-semibold text-slate-700">{metric.percentile}th</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${metric.percentile}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-slate-500">{metric.insight}</p>
    </div>
  );
}

export default function NationalRanking() {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="rounded-t-2xl bg-gradient-to-r from-slate-800 to-indigo-900 px-6 py-5 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">National Ranking</h2>
              <p className="text-sm opacity-75">
                Compared to DreamCollege.ai students across the country
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:text-right">
            <div>
              <p className="text-sm opacity-75">Overall percentile</p>
              <p className="text-4xl font-extrabold leading-none">
                {OVERALL_PERCENTILE}
                <span className="text-xl font-semibold opacity-80">th</span>
              </p>
              <p className="mt-0.5 text-xs opacity-60">
                Top {100 - OVERALL_PERCENTILE}% nationally
              </p>
            </div>
            <div className="relative h-16 w-16 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="3"
                />
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
              <span className="absolute inset-0 flex items-center justify-center rotate-0 text-xs font-bold">
                {OVERALL_PERCENTILE}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metric breakdown */}
      <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_METRICS.map((m) => (
          <MetricCard key={m.label} metric={m} />
        ))}

        {/* Context card */}
        <div className="flex flex-col justify-between rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <div>
            <p className="mb-1 text-sm font-semibold text-indigo-800">
              What does this mean?
            </p>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Your percentile compares you to thousands of college-bound students
              on DreamCollege.ai. Scores are updated as you complete activities
              and add academic information.
            </p>
          </div>
          <p className="mt-4 text-xs text-indigo-500 italic">
            Demo data — connect your school profile to see live rankings.
          </p>
        </div>
      </div>
    </div>
  );
}
