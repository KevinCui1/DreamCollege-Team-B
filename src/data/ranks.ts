import { navigation, activityPath } from "./navigation";

/**
 * A rank the student can reach. Ranks form a strict ladder ordered by `order`;
 * the current rank is the highest one whose requirement (and every lower rank's)
 * is met. Ranks are always DERIVED from task-completion state — never stored as a
 * source of truth — so they stay correct even if completion data changes.
 */
export type Rank = {
  id: string;
  /** Display name shown in the rank-up moment. */
  name: string;
  /** Ladder position. 0 is the default starting rank. */
  order: number;
  /** One-line, product-native line shown beneath the rank name. */
  tagline: string;
};

/** Career Discovery Quiz — the single task that (with the dashboard) earns Navigator. */
const CAREER_DISCOVERY_QUIZ_PATH = activityPath(
  "career-planning",
  "career-discovery-quiz",
);

/** All activity paths within a group slug, derived from the nav source of truth. */
function pathsForGroup(groupSlug: string): string[] {
  const group = navigation.find((g) => g.slug === groupSlug);
  if (!group) return [];
  return group.items.map((item) => activityPath(group.slug, item.slug));
}

/** Every task in Career Planning — completing all of them earns Builder. */
export const careerPlanningPaths = pathsForGroup("career-planning");
/** Every task in College Planning — completing all of them earns Launch Ready. */
export const collegePlanningPaths = pathsForGroup("college-planning");

/**
 * Requirement for each non-default rank, keyed by ladder order. A rank is reached
 * only when its requirement AND all lower requirements are satisfied (see deriveRank).
 */
type RankRequirement = (
  isComplete: (path: string) => boolean,
  dashboardVisited: boolean,
) => boolean;

const requirements: Record<number, RankRequirement> = {
  // Navigator: opened the dashboard and finished the Career Discovery Quiz.
  1: (isComplete, dashboardVisited) =>
    dashboardVisited && isComplete(CAREER_DISCOVERY_QUIZ_PATH),
  // Builder: every Career Planning tool complete.
  2: (isComplete) => careerPlanningPaths.every(isComplete),
  // Launch Ready: every College Planning tool complete.
  3: (isComplete) => collegePlanningPaths.every(isComplete),
};

/** The rank ladder, lowest to highest. `ranks[0]` is the default starting rank. */
export const ranks: Rank[] = [
  {
    id: "explorer",
    name: "Explorer",
    order: 0,
    tagline: "Your journey starts here.",
  },
  {
    id: "navigator",
    name: "Navigator",
    order: 1,
    tagline: "Course charted — you know where you're headed.",
  },
  {
    id: "builder",
    name: "Builder",
    order: 2,
    tagline: "Your career plan is taking shape.",
  },
  {
    id: "launch-ready",
    name: "Launch Ready",
    order: 3,
    tagline: "Your applications are ready for liftoff.",
  },
];

export const defaultRank = ranks[0];

/**
 * Walk the ladder from the bottom and stop at the first rank whose requirement is
 * unmet — returning the rank just below. This keeps progression sequential: you
 * can't skip Builder to land on Launch Ready, even if college tasks happen first.
 */
export function deriveRank(
  isComplete: (path: string) => boolean,
  dashboardVisited: boolean,
): Rank {
  let current = ranks[0];
  for (let i = 1; i < ranks.length; i++) {
    const requirement = requirements[ranks[i].order];
    if (requirement && requirement(isComplete, dashboardVisited)) {
      current = ranks[i];
    } else {
      break;
    }
  }
  return current;
}
