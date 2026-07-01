// The guided, time-based "journey" a student follows toward college — a curated
// layer on top of the raw XP_ITEMS sequence. Each milestone bundles a few real
// tasks under one human, time-anchored heading with real-world guidance (e.g.
// "research your recommended majors, then shortlist colleges"). Completion and
// ordering are *derived* from the same completion state the rest of the app uses,
// so nothing here is persisted separately.

import type { LucideIcon } from "lucide-react";
import {
  UserRound,
  Compass,
  Telescope,
  GraduationCap,
  Sparkles,
  Send,
  Flag,
} from "lucide-react";
import { XP_ITEMS, itemHref, type XPItem } from "./nextStep";

// ── Types ────────────────────────────────────────────────────────────────────

export type JourneyMilestone = {
  id: string;
  title: string;
  /** What to actually go do — blends app tasks with real-world action. */
  blurb: string;
  /** Time anchor shown as an eyebrow chip. */
  timeframe: string;
  icon: LucideIcon;
  /** Underlying trackable activity paths (from XP_ITEMS). */
  activities?: string[];
  /** Underlying trackable grade-achievement ids (from XP_ITEMS). */
  grades?: string[];
};

// ── The journey ──────────────────────────────────────────────────────────────
// Ordered by when a student naturally reaches each stage. Kept deliberately short
// so the road ahead reads at a glance.

export const JOURNEY: JourneyMilestone[] = [
  {
    id: "profile",
    title: "Set up your profile",
    blurb:
      "Share your grades, interests, and goals so every recommendation is tailored to you.",
    timeframe: "Start here",
    icon: UserRound,
    activities: ["/college-planning/college-profile"],
  },
  {
    id: "direction",
    title: "Discover your direction",
    blurb:
      "Take the Career Discovery Quiz, then review the career tracks it recommends and see how well they fit.",
    timeframe: "Freshman year",
    icon: Compass,
    activities: [
      "/career-planning/career-discovery-quiz",
      "/career-planning/my-career-tracks",
      "/career-planning/career-fit-report",
    ],
  },
  {
    id: "explore",
    title: "Explore & research careers",
    blurb:
      "Dig into the careers you're matched with, talk to your counselor, and build a high-school plan to get there.",
    timeframe: "Sophomore year",
    icon: Telescope,
    activities: [
      "/career-planning/explore-all-careers",
      "/career-planning/high-school-plan",
    ],
  },
  {
    id: "college-list",
    title: "Research majors & build your college list",
    blurb:
      "Research your recommended majors, then explore, visit, and shortlist the colleges that fit you best.",
    timeframe: "Junior year",
    icon: GraduationCap,
    activities: [
      "/college-planning/majors",
      "/college-planning/colleges",
      "/college-planning/shortlist",
    ],
  },
  {
    id: "strengthen",
    title: "Strengthen your profile",
    blurb:
      "Sharpen your positioning statement, log your best activities, and find scholarships worth applying for.",
    timeframe: "Junior year",
    icon: Sparkles,
    activities: [
      "/college-planning/positioning-statement",
      "/college-planning/activities",
      "/college-planning/scholarships",
    ],
  },
  {
    id: "apply",
    title: "Apply to college",
    blurb:
      "Complete your applications, request recommendation letters, and submit everything before deadlines.",
    timeframe: "Senior year — fall",
    icon: Send,
    activities: [
      "/college-application/application",
      "/college-application/recommendation-letter",
    ],
    grades: ["12-1"],
  },
  {
    id: "finish",
    title: "Cross the finish line",
    blurb:
      "Complete the FAFSA, finalize scholarships, accept your offer, and prepare for the transition to college.",
    timeframe: "Senior year — spring",
    icon: Flag,
    grades: ["12-2", "12-3", "12-4", "12-5"],
  },
];

export const JOURNEY_COUNT = JOURNEY.length;

// ── Derivation helpers (driven by the shared itemDone predicate) ──────────────

/** The canonical XP_ITEMS a milestone is made of. */
function milestoneItems(m: JourneyMilestone): XPItem[] {
  return XP_ITEMS.filter((item) =>
    item.type === "activity"
      ? m.activities?.includes(item.path) ?? false
      : m.grades?.includes(item.id) ?? false,
  );
}

export type MilestoneProgress = {
  done: number;
  total: number;
  complete: boolean;
};

export function milestoneProgress(
  m: JourneyMilestone,
  itemDone: (item: XPItem) => boolean,
): MilestoneProgress {
  const items = milestoneItems(m);
  const done = items.filter(itemDone).length;
  return { done, total: items.length, complete: items.length > 0 && done === items.length };
}

/** Where the milestone's CTA points — the first task in it the student hasn't done. */
export function milestoneHref(
  m: JourneyMilestone,
  itemDone: (item: XPItem) => boolean,
): string {
  const items = milestoneItems(m);
  const next = items.find((item) => !itemDone(item)) ?? items[0];
  return next ? itemHref(next) : "/";
}

export type SequencedJourney = {
  completed: JourneyMilestone[];
  current: JourneyMilestone | null;
  upcoming: JourneyMilestone[];
};

/**
 * Re-sequence the journey around live progress: finished milestones cluster at
 * the top (even if completed out of order), the first unfinished one becomes the
 * "you are here" focus, and the rest wait below.
 */
export function sequenceJourney(
  itemDone: (item: XPItem) => boolean,
): SequencedJourney {
  const completed: JourneyMilestone[] = [];
  const remaining: JourneyMilestone[] = [];
  for (const m of JOURNEY) {
    if (milestoneProgress(m, itemDone).complete) completed.push(m);
    else remaining.push(m);
  }
  const [current = null, ...upcoming] = remaining;
  return { completed, current, upcoming };
}
