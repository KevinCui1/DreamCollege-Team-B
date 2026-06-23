import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";

export type NavItem = { label: string; slug: string };

export type NavGroup = {
  label: string;
  slug: string;
  icon: LucideIcon;
  items: NavItem[];
};

/**
 * Single source of truth for the sidebar groups and their activities.
 * The sidebar UI and the router routes are both generated from this array,
 * so adding a new activity later just means editing this file.
 */
export const navigation: NavGroup[] = [
  {
    label: "Career Planning",
    slug: "career-planning",
    icon: Briefcase,
    items: [
      { label: "Career Discovery Quiz", slug: "career-discovery-quiz" },
      { label: "My Career Tracks", slug: "my-career-tracks" },
      { label: "Career Fit Report", slug: "career-fit-report" },
      { label: "Explore All Careers", slug: "explore-all-careers" },
      { label: "High School Plan", slug: "high-school-plan" },
    ],
  },
  {
    label: "College Planning",
    slug: "college-planning",
    icon: GraduationCap,
    items: [
      { label: "College Profile", slug: "college-profile" },
      { label: "Positioning Statement", slug: "positioning-statement" },
      { label: "Majors", slug: "majors" },
      { label: "Colleges", slug: "colleges" },
      { label: "Activities", slug: "activities" },
      { label: "Scholarships", slug: "scholarships" },
      { label: "Shortlist", slug: "shortlist" },
    ],
  },
  {
    label: "College Application",
    slug: "college-application",
    icon: GraduationCap,
    items: [
      { label: "Application", slug: "application" },
      { label: "Recommendation Letter", slug: "recommendation-letter" },
    ],
  },
];

/** Build the canonical route path for an activity. */
export const activityPath = (groupSlug: string, itemSlug: string) =>
  `/${groupSlug}/${itemSlug}`;

/** Total number of activities across all groups. */
export const totalActivities = navigation.reduce(
  (sum, group) => sum + group.items.length,
  0,
);

/** Look up a group + item label pair from route slugs. */
export function findActivity(groupSlug?: string, itemSlug?: string) {
  const group = navigation.find((g) => g.slug === groupSlug);
  const item = group?.items.find((i) => i.slug === itemSlug);
  if (!group || !item) return null;
  return { group, item };
}
