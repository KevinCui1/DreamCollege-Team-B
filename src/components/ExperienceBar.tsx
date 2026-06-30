import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Navigation2,
  Rocket,
  Trophy,
  Wrench,
} from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { useAchievement } from "../context/AchievementContext";
import { useRank } from "../context/RankContext";
import { ranks } from "../data/ranks";

// ── Types ──────────────────────────────────────────────────────────────────

type XPActivityItem = { type: "activity"; path: string; label: string; group: string };
type XPGradeItem   = { type: "grade";    id: string;  label: string; group: string };
type XPItem = XPActivityItem | XPGradeItem;

// ── Ordered XP sequence: 34 total ─────────────────────────────────────────
// Achievement order: user profile → career planning → 9th → 10th → 11th →
// college planning → college application → 12th grade

const XP_ITEMS: XPItem[] = [
  // 1. User Profile (1)
  { type: "activity", path: "/college-planning/college-profile", label: "Complete Your Profile", group: "User Profile" },
  // 2. Career Planning (5)
  { type: "activity", path: "/career-planning/career-discovery-quiz", label: "Career Discovery Quiz", group: "Career Planning" },
  { type: "activity", path: "/career-planning/my-career-tracks",      label: "My Career Tracks",     group: "Career Planning" },
  { type: "activity", path: "/career-planning/career-fit-report",     label: "Career Fit Report",    group: "Career Planning" },
  { type: "activity", path: "/career-planning/explore-all-careers",   label: "Explore All Careers",  group: "Career Planning" },
  { type: "activity", path: "/career-planning/high-school-plan",      label: "High School Plan",     group: "Career Planning" },
  // 3. 9th Grade (5)
  { type: "grade", id: "9-1", label: "Join a club or extracurricular activity",          group: "9th Grade" },
  { type: "grade", id: "9-2", label: "Meet with your school counselor",                  group: "9th Grade" },
  { type: "grade", id: "9-3", label: "Research career interests and strengths",           group: "9th Grade" },
  { type: "grade", id: "9-4", label: "Begin community service or volunteer work",         group: "9th Grade" },
  { type: "grade", id: "9-5", label: "Explore summer programs or enrichment opportunities", group: "9th Grade" },
  // 4. 10th Grade (5)
  { type: "grade", id: "10-1", label: "Take the PSAT for practice",                       group: "10th Grade" },
  { type: "grade", id: "10-2", label: "Explore dual enrollment or AP courses",             group: "10th Grade" },
  { type: "grade", id: "10-3", label: "Visit a college campus",                            group: "10th Grade" },
  { type: "grade", id: "10-4", label: "Job shadow a professional in your field",           group: "10th Grade" },
  { type: "grade", id: "10-5", label: "Expand leadership roles in activities",             group: "10th Grade" },
  // 5. 11th Grade (5)
  { type: "grade", id: "11-1", label: "Take the SAT or ACT",                              group: "11th Grade" },
  { type: "grade", id: "11-2", label: "Attend college fairs and information sessions",    group: "11th Grade" },
  { type: "grade", id: "11-3", label: "Begin researching and applying for scholarships",  group: "11th Grade" },
  { type: "grade", id: "11-4", label: "Narrow down your college list to 8–12 schools",   group: "11th Grade" },
  { type: "grade", id: "11-5", label: "Build relationships with recommendation writers",  group: "11th Grade" },
  // 6. College Planning — remaining 6 (college-profile was step 1)
  { type: "activity", path: "/college-planning/positioning-statement", label: "Positioning Statement", group: "College Planning" },
  { type: "activity", path: "/college-planning/majors",                label: "Majors",                group: "College Planning" },
  { type: "activity", path: "/college-planning/colleges",              label: "Colleges",              group: "College Planning" },
  { type: "activity", path: "/college-planning/activities",            label: "Activities",            group: "College Planning" },
  { type: "activity", path: "/college-planning/scholarships",          label: "Scholarships",          group: "College Planning" },
  { type: "activity", path: "/college-planning/shortlist",             label: "Shortlist",             group: "College Planning" },
  // 7. College Application (2)
  { type: "activity", path: "/college-application/application",          label: "Application",           group: "College Application" },
  { type: "activity", path: "/college-application/recommendation-letter", label: "Recommendation Letter", group: "College Application" },
  // 8. 12th Grade (5)
  { type: "grade", id: "12-1", label: "Submit all college applications by deadlines",         group: "12th Grade" },
  { type: "grade", id: "12-2", label: "Complete FAFSA and financial aid applications",        group: "12th Grade" },
  { type: "grade", id: "12-3", label: "Finalize and submit scholarship applications",         group: "12th Grade" },
  { type: "grade", id: "12-4", label: "Accept your college admission offer",                  group: "12th Grade" },
  { type: "grade", id: "12-5", label: "Prepare for your college transition and orientation",  group: "12th Grade" },
];

const TOTAL_XP = XP_ITEMS.length; // 34

// ── Segmented bar phases ───────────────────────────────────────────────────
// Each segment width is proportional to item count (flex: count).

// Unified violet monochrome ramp: lightens-to-deepens across the journey,
// so the bar reads as one cohesive progression rather than a rainbow.
const PHASES = [
  { name: "Profile",      count: 1, color: "#c4b5fd" }, // violet-300
  { name: "Career",       count: 5, color: "#b3a4fb" },
  { name: "9th",          count: 5, color: "#a78bfa" }, // violet-400
  { name: "10th",         count: 5, color: "#9471f4" },
  { name: "11th",         count: 5, color: "#8b5cf6" }, // violet-500
  { name: "College Plan", count: 6, color: "#7c4ddb" },
  { name: "Apps",         count: 2, color: "#7c3aed" }, // violet-600
  { name: "12th",         count: 5, color: "#6d28d9" }, // violet-700
];

// ── Rank icon map ──────────────────────────────────────────────────────────

const RANK_ICONS = {
  "explorer":     Compass,
  "navigator":    Navigation2,
  "builder":      Wrench,
  "launch-ready": Rocket,
} as const;

// ── Main component ─────────────────────────────────────────────────────────

export default function ExperienceBar() {
  const { isComplete } = useCompletion();
  const { gradeAchievements } = useAchievement();
  const { currentRank } = useRank();

  // Helper: is an XPItem completed?
  const itemDone = useMemo(() => {
    return (item: XPItem): boolean => {
      if (item.type === "activity") return isComplete(item.path);
      const a = gradeAchievements.find((g) => g.id === item.id);
      return a?.completed ?? false;
    };
  }, [isComplete, gradeAchievements]);

  // Total XP earned (order-independent — any completed item counts)
  const earnedXP = useMemo(
    () => XP_ITEMS.filter(itemDone).length,
    [itemDone],
  );

  const xpPct  = TOTAL_XP === 0 ? 0 : Math.round((earnedXP / TOTAL_XP) * 100);
  const isFull = earnedXP === TOTAL_XP;

  // Per-phase completion data for the segmented bar
  const phaseData = useMemo(() => {
    let idx = 0;
    return PHASES.map((phase) => {
      const slice = XP_ITEMS.slice(idx, idx + phase.count);
      idx += phase.count;
      const done = slice.filter(itemDone).length;
      return {
        ...phase,
        done,
        fillPct: Math.round((done / phase.count) * 100),
        full: done === phase.count,
      };
    });
  }, [itemDone]);

  // First uncompleted item in the achievement order → recommended next step
  const nextStep = useMemo(
    () => XP_ITEMS.find((item) => !itemDone(item)) ?? null,
    [itemDone],
  );

  const RankIcon =
    RANK_ICONS[currentRank.id as keyof typeof RANK_ICONS] ?? Compass;

  return (
    <div className="relative overflow-hidden rounded-xl bg-white/75 p-7 text-slate-900 shadow-card border border-slate-900/[0.06] backdrop-blur-xl">
        {/* ── Header: rank badge + XP counter ── */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-violet-600 shadow-card">
              <RankIcon size={22} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Current Rank
              </p>
              <p className="mt-0.5 font-display text-xl font-bold leading-none tracking-tight">
                {currentRank.name}
              </p>
              <p className="mt-1.5 text-xs leading-none text-slate-500">
                {currentRank.tagline}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="font-display text-4xl font-bold tabular-nums leading-none tracking-tight text-slate-900">
              {earnedXP}
              <span className="text-xl font-medium text-slate-400">
                {" "}
                / {TOTAL_XP}
              </span>
            </p>
            <p className="mt-1.5 text-xs font-medium text-slate-400">
              {isFull ? "All complete" : `${xpPct}% complete`}
            </p>
          </div>
        </div>

        {/* ── Segmented XP bar ── */}
        <div className="relative mt-5">
          {/* Bar track */}
          <div className="flex h-5 gap-0.5 overflow-hidden rounded-full">
            {phaseData.map((phase, i) => (
              <div
                key={i}
                className="relative overflow-hidden"
                style={{ flex: phase.count }}
              >
                {/* Empty track */}
                <div className="absolute inset-0 bg-violet-100" />
                {/* Filled portion */}
                {phase.fillPct > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-out"
                    style={{
                      width: `${phase.fillPct}%`,
                      backgroundColor: phase.full ? "#34d399" : phase.color,
                      boxShadow: `0 0 6px ${phase.color}33`,
                    }}
                  >
                    {/* Shimmer sweep */}
                    <div className="xp-shimmer absolute inset-0 w-1/3 bg-white/20" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Phase legend */}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
            {phaseData.map((phase, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: phase.full ? "#34d399" : phase.color,
                    opacity: phase.done === 0 ? 0.3 : 1,
                  }}
                />
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    phase.full
                      ? "text-emerald-600"
                      : phase.done > 0
                      ? "text-slate-600"
                      : "text-slate-400"
                  }`}
                >
                  {phase.name}
                  {phase.done > 0 && (
                    <span className="ml-0.5 text-slate-400">
                      {" "}
                      {phase.done}/{phase.count}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rank progression track ── */}
        <div className="relative mt-5 flex items-center gap-1">
          {ranks.map((rank, i) => {
            const Icon =
              RANK_ICONS[rank.id as keyof typeof RANK_ICONS] ?? Compass;
            const earned  = currentRank.order >= rank.order;
            const current = currentRank.order === rank.order;
            return (
              <Fragment key={rank.id}>
                <div
                  className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-300 ${
                    current
                      ? "bg-violet-600 text-white shadow-card"
                      : earned
                      ? "bg-violet-100 text-violet-700"
                      : "text-slate-300"
                  }`}
                >
                  <Icon size={11} />
                  {rank.name}
                </div>
                {i < ranks.length - 1 && (
                  <div
                    className={`h-px flex-1 rounded-full transition-colors duration-500 ${
                      earned ? "bg-violet-300" : "bg-slate-900/[0.06]"
                    }`}
                  />
                )}
              </Fragment>
            );
          })}
        </div>

        {/* ── Next step / completion ── */}
        <div className="relative mt-4">
          {isFull ? (
            <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-200">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-300">
                <Trophy size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-700">
                  Journey complete
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  You've reached every milestone in your plan.
                </p>
              </div>
            </div>
          ) : nextStep ? (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-violet-50/80 p-4 ring-1 ring-violet-100">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Recommended Next Step
                </p>
                <p className="mt-1 truncate text-sm font-bold text-slate-800">
                  {nextStep.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {nextStep.group}
                </p>
              </div>
              <Link
                to={
                  nextStep.type === "activity"
                    ? nextStep.path
                    : "/achievements"
                }
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-card transition hover:bg-violet-700 active:scale-95"
              >
                Go <ArrowRight size={12} />
              </Link>
            </div>
          ) : null}
        </div>
    </div>
  );
}
