/**
 * Canonical profile schema for Dream College's shared, account-linked profile.
 *
 * The typed shapes still live in `StudentProfileContext` (where the provider and
 * its persistence live); this module re-exports them as the single import point
 * for the field registry, requirement map, and completeness helpers, and defines
 * the theme taxonomy plus the documented registry of controlled extra fields.
 */
import type {
  ApplicationProfile,
  QuizAnswers,
  ExamEntry,
  AwardEntry,
  ActivityEntry,
} from "../context/StudentProfileContext";

export type {
  ApplicationProfile,
  QuizAnswers,
  ExamEntry,
  AwardEntry,
  ActivityEntry,
};

/** Everything the collection system reads to decide what to ask. */
export type ProfileSnapshot = {
  app: ApplicationProfile;
  quiz: QuizAnswers | null;
};

/** Understandable groupings shown as themes in the review hub. */
export type Theme =
  | "identity"
  | "education"
  | "testing"
  | "preferences"
  | "awards"
  | "activities"
  | "career";

export const THEME_META: Record<Theme, { label: string; blurb: string }> = {
  identity: { label: "About you", blurb: "The basics that personalize everything." },
  education: { label: "School & grades", blurb: "Where you study and how you're doing." },
  testing: { label: "Tests & courses", blurb: "Scores and rigor — only if you have them." },
  preferences: { label: "What you're looking for", blurb: "The kind of college that fits you." },
  awards: { label: "Awards & honors", blurb: "Recognition you've earned." },
  activities: { label: "Activities", blurb: "How you spend your time outside class." },
  career: { label: "Direction", blurb: "Where your interests are pointing." },
};

/**
 * Controlled registry of reusable fields added beyond the original intake.
 * Documented here per the brief's new-fields guardrail: reason + reusers.
 */
export const EXTRA_FIELDS = [
  {
    id: "careerDirection",
    reason: "Lets a student who already has a career in mind say so directly.",
    reusers: ["my-career-tracks", "career-fit-report", "majors", "high-school-plan"],
  },
  {
    id: "favoriteSubjects",
    reason: "Academic strengths that existing data doesn't capture cleanly.",
    reusers: ["majors", "career-fit-report", "high-school-plan"],
  },
  {
    id: "currentCourses",
    reason: "Course rigor / plan signal not present in the original fields.",
    reusers: ["high-school-plan", "application"],
  },
  {
    id: "accomplishmentDetail",
    reason: "One impact detail to support a credible narrative when activity descriptions are thin.",
    reusers: ["positioning-statement", "recommendation-letter"],
  },
] as const;
