import { Fragment, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  Navigation2,
  Rocket,
  Sparkles,
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

const PHASES = [
  { name: "Profile",      count: 1, color: "#818cf8" }, // indigo-400
  { name: "Career",       count: 5, color: "#a78bfa" }, // violet-400
  { name: "9th",          count: 5, color: "#c084fc" }, // purple-400
  { name: "10th",         count: 5, color: "#e879f9" }, // fuchsia-400
  { name: "11th",         count: 5, color: "#f472b6" }, // pink-400
  { name: "College Plan", count: 6, color: "#fb7185" }, // rose-400
  { name: "Apps",         count: 2, color: "#fb923c" }, // orange-400
  { name: "12th",         count: 5, color: "#fbbf24" }, // amber-400
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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6 text-white shadow-2xl ring-1 ring-white/10">
        {/* Ambient glow orbs */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-600/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-600/25 blur-3xl" />

        {/* ── Header: rank badge + XP counter ── */}
        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 ring-1 ring-white/20">
              <RankIcon size={22} className="text-indigo-300" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                Current Rank
              </p>
              <p className="mt-0.5 text-xl font-bold leading-none">
                {currentRank.name}
              </p>
              <p className="mt-1.5 text-xs leading-none text-white/45">
                {currentRank.tagline}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-4xl font-bold tabular-nums leading-none">
              {earnedXP}
              <span className="text-xl font-normal text-white/35">
                {" "}
                / {TOTAL_XP}
              </span>
            </p>
            <p className="mt-1.5 text-xs text-white/35">
              {isFull ? "All complete!" : `${xpPct}% complete`}
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
                <div className="absolute inset-0 bg-white/[0.07]" />
                {/* Filled portion */}
                {phase.fillPct > 0 && (
                  <div
                    className="absolute inset-y-0 left-0 transition-[width] duration-700 ease-out"
                    style={{
                      width: `${phase.fillPct}%`,
                      backgroundColor: phase.full ? "#34d399" : phase.color,
                      boxShadow: `0 0 14px ${phase.color}66`,
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
                  className={`text-[10px] font-medium transition-colors ${
                    phase.full
                      ? "text-emerald-400"
                      : phase.done > 0
                      ? "text-white/65"
                      : "text-white/25"
                  }`}
                >
                  {phase.name}
                  {phase.done > 0 && (
                    <span className="ml-0.5 text-white/30">
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
                      ? "bg-white/[0.18] text-white ring-1 ring-white/25"
                      : earned
                      ? "bg-white/[0.09] text-white/60"
                      : "text-white/20"
                  }`}
                >
                  <Icon size={11} />
                  {rank.name}
                  {current && (
                    <Sparkles
                      size={9}
                      className="animate-pulse text-yellow-300"
                    />
                  )}
                </div>
                {i < ranks.length - 1 && (
                  <div
                    className={`h-px flex-1 rounded-full transition-colors duration-500 ${
                      earned ? "bg-white/30" : "bg-white/10"
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
            <div className="flex items-center gap-3 rounded-xl bg-emerald-500/15 p-4 ring-1 ring-emerald-400/30">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/20 ring-1 ring-emerald-400/40">
                <Trophy size={18} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-300">
                  Journey Complete!
                </p>
                <p className="mt-0.5 text-xs text-white/45">
                  You've accomplished every milestone. Incredible work!
                </p>
              </div>
            </div>
          ) : nextStep ? (
            <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/[0.08]">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                  Recommended Next Step
                </p>
                <p className="mt-1 truncate text-sm font-semibold">
                  {nextStep.label}
                </p>
                <p className="mt-0.5 text-xs text-white/40">
                  {nextStep.group}
                </p>
              </div>
              <Link
                to={
                  nextStep.type === "activity"
                    ? nextStep.path
                    : "/achievements"
                }
                className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3.5 py-2.5 text-xs font-bold shadow-lg transition hover:from-indigo-400 hover:to-purple-400 active:scale-95"
              >
                Go <ArrowRight size={12} />
              </Link>
            </div>
          ) : null}
        </div>
    </div>
  );
}
