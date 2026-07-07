// Single source of truth for the ordered "journey" of things a student completes,
// and the helpers that derive XP totals and the recommended next step from it.
// Shared by the Dashboard hero spotlight and the ExperienceBar so the two never
// disagree about what comes next.

import type { GradeAchievement } from "../data/achievements";

// ── Types ──────────────────────────────────────────────────────────────────

export type XPActivityItem = {
  type: "activity";
  path: string;
  label: string;
  group: string;
};
export type XPGradeItem = {
  type: "grade";
  id: string;
  label: string;
  group: string;
};
export type XPItem = XPActivityItem | XPGradeItem;

// ── Ordered XP sequence: 34 total ─────────────────────────────────────────
// Achievement order: user profile → career planning → 9th → 10th → 11th →
// college planning → college application → 12th grade

export const XP_ITEMS: XPItem[] = [
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

// ── Experience points ────────────────────────────────────────────────────────
// XP is awarded for the Career Planning and College Planning activity tabs only.
// Completing the profile and the Career Discovery Quiz is worth 100 XP each;
// every other Career/College Planning activity is worth 50 XP. College
// Application tasks and the four-year-plan grade tasks are tracked for the
// journey but award no XP.

/** Completing the profile is worth 100 XP. */
export const XP_PROFILE_PATH = "/college-planning/college-profile";
/** Completing the Career Discovery Quiz is worth 100 XP. */
export const XP_QUIZ_PATH = "/career-planning/career-discovery-quiz";

const XP_HIGH = 100;
const XP_STANDARD = 50;

/** XP awarded for completing a given activity path (0 if it isn't XP-bearing). */
export function xpForPath(path: string): number {
  // College Application tasks award no experience.
  if (path.startsWith("/college-application/")) return 0;
  if (path === XP_PROFILE_PATH || path === XP_QUIZ_PATH) return XP_HIGH;
  return XP_STANDARD;
}

/** Every activity path that awards XP, in journey order. */
export const XP_ACTIVITY_PATHS: string[] = XP_ITEMS.filter(
  (item): item is XPActivityItem =>
    item.type === "activity" && xpForPath(item.path) > 0,
).map((item) => item.path);

/** Maximum XP reachable (100 + 100 + 10 × 50 = 700). */
export const TOTAL_XP = XP_ACTIVITY_PATHS.reduce(
  (sum, path) => sum + xpForPath(path),
  0,
);

/** Total XP earned so far from completed activities. */
export function earnedXp(isComplete: (path: string) => boolean): number {
  return XP_ACTIVITY_PATHS.reduce(
    (sum, path) => (isComplete(path) ? sum + xpForPath(path) : sum),
    0,
  );
}

/** Where an activity item links to. Grade items route to the Achievement Map. */
export function itemHref(item: XPItem): string {
  return item.type === "activity" ? item.path : "/achievements";
}

/**
 * Build an `itemDone` predicate from the two completion sources. Kept as a factory
 * so callers can memoize it against their own dependencies.
 */
export function makeItemDone(
  isComplete: (path: string) => boolean,
  gradeAchievements: GradeAchievement[],
) {
  return (item: XPItem): boolean => {
    if (item.type === "activity") return isComplete(item.path);
    const a = gradeAchievements.find((g) => g.id === item.id);
    return a?.completed ?? false;
  };
}

/** First uncompleted item in journey order — the recommended next step. */
export function findNextStep(
  itemDone: (item: XPItem) => boolean,
): XPItem | null {
  return XP_ITEMS.find((item) => !itemDone(item)) ?? null;
}
