import { Flame, Rocket, Sparkles, Star, Trophy, type LucideIcon } from "lucide-react";

export type BadgeColor = "emerald" | "sky" | "violet" | "rose" | "amber";

export type BadgeDef = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: BadgeColor;
  isEarned: (completedCount: number, totalCount: number) => boolean;
};

/** Milestone badges unlocked as a student completes activities. */
export const badges: BadgeDef[] = [
  {
    id: "first-step",
    label: "First Step",
    icon: Sparkles,
    color: "emerald",
    isEarned: (completedCount) => completedCount >= 1,
  },
  {
    id: "quarter-way",
    label: "Quarter Way",
    icon: Star,
    color: "sky",
    isEarned: (completedCount, totalCount) =>
      totalCount > 0 && completedCount / totalCount >= 0.25,
  },
  {
    id: "halfway-there",
    label: "Halfway There",
    icon: Flame,
    color: "violet",
    isEarned: (completedCount, totalCount) =>
      totalCount > 0 && completedCount / totalCount >= 0.5,
  },
  {
    id: "almost-there",
    label: "Almost There",
    icon: Rocket,
    color: "rose",
    isEarned: (completedCount, totalCount) =>
      totalCount > 0 && completedCount / totalCount >= 0.75,
  },
  {
    id: "all-done",
    label: "All Done",
    icon: Trophy,
    color: "amber",
    isEarned: (completedCount, totalCount) =>
      totalCount > 0 && completedCount === totalCount,
  },
];
