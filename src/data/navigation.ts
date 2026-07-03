import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";

export type NavItem = {
  label: string;
  slug: string;
  /**
   * One sentence on what this section is for and when a student should go
   * there. Fed to the roadmap LLM as the catalog it routes students to, so it
   * can pick the section that genuinely matches the student's situation.
   */
  purpose: string;
};

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
      {
        label: "Career Discovery Quiz",
        slug: "career-discovery-quiz",
        purpose:
          "Take a short quiz that surfaces the careers and work styles that fit you; the starting point when a student has no clear direction yet.",
      },
      {
        label: "My Career Tracks",
        slug: "my-career-tracks",
        purpose:
          "Save and track the specific career paths you're seriously considering; use it once the quiz or interests point to a few concrete careers.",
      },
      {
        label: "Career Fit Report",
        slug: "career-fit-report",
        purpose:
          "See how well specific careers match your quiz results, grades, activities, and awards; ideal when a student's quiz answers or awards already imply a career worth validating.",
      },
      {
        label: "Explore All Careers",
        slug: "explore-all-careers",
        purpose:
          "Browse the full catalog of careers to see where your interests and activities could lead; good when activities cluster around a theme but the career is still open.",
      },
      {
        label: "High School Plan",
        slug: "high-school-plan",
        purpose:
          "Map out courses, tests, and milestones across all four years; most valuable for younger students (9th/10th grade) who are still setting up their path.",
      },
    ],
  },
  {
    label: "College Planning",
    slug: "college-planning",
    icon: GraduationCap,
    items: [
      {
        label: "College Profile",
        slug: "college-profile",
        purpose:
          "Record your grade, GPA, test scores, activities, and awards so every other recommendation is personalized; the first thing to fill in when it's still empty.",
      },
      {
        label: "Positioning Statement",
        slug: "positioning-statement",
        purpose:
          "Turn your activities and awards into a cohesive spike or narrative for applications; ideal when a student's activities concentrate around one subject or theme that could be framed as a strength.",
      },
      {
        label: "Majors",
        slug: "majors",
        purpose:
          "Explore and shortlist college majors that fit your interests and strengths; use once a student has an academic direction but hasn't chosen what to study.",
      },
      {
        label: "Colleges",
        slug: "colleges",
        purpose:
          "Research colleges and compare them against your profile; good when a student has solid stats but no target schools yet.",
      },
      {
        label: "Activities",
        slug: "activities",
        purpose:
          "Build and organize your extracurricular activity list; the clear next step when a student has few or thin activities recorded.",
      },
      {
        label: "Scholarships",
        slug: "scholarships",
        purpose:
          "Find and track scholarships you qualify for; useful for students with financial constraints or strong stats/awards to leverage.",
      },
      {
        label: "Shortlist",
        slug: "shortlist",
        purpose:
          "Narrow your researched colleges into a final balanced list of reach/target/safety schools; use later in the process once colleges have been explored.",
      },
    ],
  },
  {
    label: "College Application",
    slug: "college-application",
    icon: GraduationCap,
    items: [
      {
        label: "Application",
        slug: "application",
        purpose:
          "Assemble and submit your college applications; relevant for upper-grade students (11th/12th) with a shortlist in place.",
      },
      {
        label: "Recommendation Letter",
        slug: "recommendation-letter",
        purpose:
          "Request and manage teacher recommendation letters; a late-stage step once a student is actively applying.",
      },
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

/**
 * Resolve a bare item slug (as returned by the roadmap LLM) to its label and
 * route. Item slugs are globally unique across groups, so the slug alone is
 * enough. Returns null for unknown slugs so a hallucinated section id can't
 * become a dead link in the UI.
 */
export function findSectionBySlug(
  slug: string | undefined,
): { label: string; path: string; groupLabel: string } | null {
  if (!slug) return null;
  for (const group of navigation) {
    const item = group.items.find((i) => i.slug === slug);
    if (item) {
      return {
        label: item.label,
        path: activityPath(group.slug, item.slug),
        groupLabel: group.label,
      };
    }
  }
  return null;
}
