/**
 * A rank the student can reach. Ranks form a strict ladder ordered by `order`
 * and are unlocked purely by total experience points (XP): the current rank is
 * the highest one whose `xpThreshold` the student's XP has reached. Ranks are
 * always DERIVED from XP — never stored as a source of truth — so they stay
 * correct as completion (and therefore XP) changes.
 */
export type Rank = {
  id: string;
  /** Display name shown in the rank-up moment. */
  name: string;
  /** Ladder position. 0 is the default starting rank. */
  order: number;
  /** One-line, product-native line shown beneath the rank name. */
  tagline: string;
  /** Total XP at which this rank unlocks. */
  xpThreshold: number;
};

/** The rank ladder, lowest to highest. `ranks[0]` is the default starting rank. */
export const ranks: Rank[] = [
  {
    id: "explorer",
    name: "Explorer",
    order: 0,
    tagline: "Your journey starts here.",
    xpThreshold: 0,
  },
  {
    id: "planner",
    name: "Planner",
    order: 1,
    tagline: "Course charted — you know where you're headed.",
    xpThreshold: 200,
  },
  {
    id: "builder",
    name: "Builder",
    order: 2,
    tagline: "Your career plan is taking shape.",
    xpThreshold: 400,
  },
  {
    id: "launch-ready",
    name: "Launch Ready",
    order: 3,
    tagline: "Your applications are ready for liftoff.",
    xpThreshold: 700,
  },
];

export const defaultRank = ranks[0];

/**
 * The highest rank whose XP threshold the student has reached. Because `ranks`
 * is ordered by ascending threshold, walking it and keeping the last rank whose
 * threshold is met yields the correct sequential rank.
 */
export function deriveRankFromXp(xp: number): Rank {
  let current = ranks[0];
  for (const rank of ranks) {
    if (xp >= rank.xpThreshold) current = rank;
  }
  return current;
}
