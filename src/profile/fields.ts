/**
 * The field registry — every profile question described exactly once.
 *
 * All collection UI (first-run, contextual collectors, the review hub) is driven
 * by these definitions; page components never hold their own question lists.
 * Covers every field from the original College Profile + Career Quiz inventory,
 * plus the controlled extras documented in `schema.ts`.
 */
import type { ApplicationProfile, ProfileSnapshot, Theme } from "./schema";
import {
  GENDER_OPTIONS,
  SCHOOL_YEAR_OPTIONS,
  GRADUATION_YEARS,
  FIRST_GEN_OPTIONS,
  FAMILY_INCOME_OPTIONS,
  RESIDENCY_OPTIONS,
  COUNTRIES,
  US_STATES,
  GPA_SCALE_OPTIONS,
  PREF_COUNTRIES,
  REGIONS,
  AREAS_OF_INTEREST,
  PROGRAM_STRENGTH,
  INSTITUTION_TYPE,
  SPECIAL_DESIGNATION,
  CAMPUS_CULTURE,
  FINANCIAL_AID,
  GEOGRAPHY_AREA,
  STUDENT_BODY,
} from "../data/applicationProfileOptions";

/** Controls FieldControl rendering; composite types own bespoke editors. */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "sat"
  | "act"
  | "exams"
  | "awards"
  | "activities"
  | "quiz-link";

export type FieldDef = {
  id: string;
  label: string;
  theme: Theme;
  type: FieldType;
  /** Student-friendly reason we ask (no internal/LLM terminology). */
  reason: string;
  options?: string[];
  placeholder?: string;
  suffix?: string;
  maxLength?: number;
  /** Optional fields are never treated as "required-now". */
  optional?: boolean;
  /** Prompts respectful, explained collection (income, first-gen, residency…). */
  sensitive?: boolean;
  /** True once the student has provided this. */
  answered: (s: ProfileSnapshot) => boolean;
  /** Read the current value for generic (scalar/array) controls. */
  get?: (app: ApplicationProfile) => string | string[];
  /** Build a patch from a new value for generic controls. */
  set?: (value: string | string[], app: ApplicationProfile) => Partial<ApplicationProfile>;
};

// ── Factories ───────────────────────────────────────────────────────────────

type StringKey = {
  [K in keyof ApplicationProfile]: ApplicationProfile[K] extends string ? K : never;
}[keyof ApplicationProfile];

type ArrayKey = {
  [K in keyof ApplicationProfile]: ApplicationProfile[K] extends string[] ? K : never;
}[keyof ApplicationProfile];

type Extra = Partial<
  Pick<
    FieldDef,
    "placeholder" | "suffix" | "maxLength" | "optional" | "sensitive" | "options"
  >
>;

function scalar(
  id: StringKey,
  label: string,
  theme: Theme,
  type: "text" | "textarea" | "number" | "select",
  reason: string,
  extra: Extra = {},
): FieldDef {
  return {
    id,
    label,
    theme,
    type,
    reason,
    ...extra,
    answered: (s) => (s.app[id] as string).trim() !== "",
    get: (app) => app[id] as string,
    set: (value) => ({ [id]: value } as Partial<ApplicationProfile>),
  };
}

function multi(
  id: ArrayKey,
  label: string,
  theme: Theme,
  reason: string,
  options: string[],
  extra: Extra = {},
): FieldDef {
  return {
    id,
    label,
    theme,
    type: "multiselect",
    reason,
    options,
    ...extra,
    answered: (s) => (s.app[id] as string[]).length > 0,
    get: (app) => app[id] as string[],
    set: (value) => ({ [id]: value } as Partial<ApplicationProfile>),
  };
}

// ── The registry ──────────────────────────────────────────────────────────────

export const FIELDS: FieldDef[] = [
  // Identity ------------------------------------------------------------------
  scalar("firstName", "First name", "identity", "text", "So we can greet you and address your materials correctly."),
  scalar("middleName", "Middle name", "identity", "text", "Some applications ask for it.", { optional: true }),
  scalar("lastName", "Last name", "identity", "text", "For your applications and materials."),
  scalar("gender", "Gender", "identity", "select", "Some scholarships and programs consider it.", { options: GENDER_OPTIONS, sensitive: true, optional: true }),
  scalar("currentSchoolYear", "Current grade", "identity", "select", "Different grades get different next steps.", { options: SCHOOL_YEAR_OPTIONS }),
  scalar("graduationYear", "Graduation year", "identity", "select", "It sets your application timeline.", { options: GRADUATION_YEARS }),
  scalar("firstGeneration", "First-generation student", "identity", "select", "Many colleges and scholarships specifically support first-gen students.", { options: FIRST_GEN_OPTIONS, sensitive: true, optional: true }),
  scalar("familyIncome", "Family income range", "identity", "select", "Used only to surface financial aid and scholarships you may qualify for.", { options: FAMILY_INCOME_OPTIONS, sensitive: true, optional: true }),
  scalar("residencyStatus", "Residency status", "identity", "select", "Affects aid eligibility and application options.", { options: RESIDENCY_OPTIONS, sensitive: true, optional: true }),

  // Education -----------------------------------------------------------------
  scalar("schoolName", "High school name", "education", "text", "Appears on your applications and recommendation requests."),
  scalar("country", "Country", "education", "select", "Sets location-based options.", { options: COUNTRIES }),
  scalar("stateProvince", "State / province", "education", "select", "Helps with in-state options and local scholarships.", { options: US_STATES, optional: true }),
  scalar("city", "City", "education", "text", "Rounds out your school location.", { optional: true }),
  scalar("graduatingClassSize", "Graduating class size", "education", "number", "Gives context to your class rank.", { optional: true }),
  scalar("classRanking", "Class rank", "education", "text", "Adds context to your GPA.", { placeholder: "e.g. 12 / 400", optional: true }),
  scalar("gpaScale", "GPA scale", "education", "select", "Tells us how to read your GPA.", { options: GPA_SCALE_OPTIONS }),
  scalar("unweightedGpa", "Unweighted GPA", "education", "text", "A core part of your academic profile.", { placeholder: "e.g. 3.9" }),
  scalar("weightedGpa", "Weighted GPA", "education", "text", "If your school reports one.", { placeholder: "e.g. 4.4", optional: true }),

  // Testing -------------------------------------------------------------------
  {
    id: "sat",
    label: "SAT scores",
    theme: "testing",
    type: "sat",
    reason: "Only if you've taken it — colleges use it alongside your GPA.",
    optional: true,
    answered: (s) => Object.values(s.app.sat).some((v) => v.trim() !== ""),
  },
  {
    id: "act",
    label: "ACT scores",
    theme: "testing",
    type: "act",
    reason: "Only if you've taken it — an alternative to the SAT.",
    optional: true,
    answered: (s) => Object.values(s.app.act).some((v) => v.trim() !== ""),
  },
  {
    id: "exams",
    label: "AP / IB / A-Level courses",
    theme: "testing",
    type: "exams",
    reason: "Advanced coursework signals academic rigor.",
    optional: true,
    answered: (s) =>
      s.app.apSubjects.length > 0 ||
      s.app.ibSubjects.length > 0 ||
      s.app.aLevels.length > 0,
  },
  scalar("currentCourses", "Current & planned courses", "testing", "textarea", "Helps map your four-year plan and shows course rigor.", { placeholder: "e.g. AP Calc BC, AP Bio, Honors English…", maxLength: 400, optional: true }),

  // Career direction ----------------------------------------------------------
  {
    id: "careerQuiz",
    label: "Career Discovery Quiz",
    theme: "career",
    type: "quiz-link",
    reason: "A 5-question quiz that surfaces careers and work styles that fit you.",
    answered: (s) => s.quiz !== null,
  },
  scalar("careerDirection", "Career you're considering", "career", "text", "If you already have one in mind, we'll build around it.", { placeholder: "e.g. Software engineer, Nurse, Undecided", optional: true }),
  multi("favoriteSubjects", "Favorite subjects", "career", "The subjects you enjoy most point toward fitting majors.", AREAS_OF_INTEREST, { optional: true }),

  // Preferences ---------------------------------------------------------------
  scalar("prefCountry", "Where you want to study", "preferences", "select", "Narrows the colleges we consider.", { options: PREF_COUNTRIES }),
  scalar("prefStateProvince", "Preferred state / province", "preferences", "select", "If you have a location in mind.", { options: US_STATES, optional: true }),
  multi("regions", "Preferred regions", "preferences", "Regions you'd like to be in.", REGIONS, { optional: true }),
  multi("areasOfInterest", "Academic areas of interest", "preferences", "The fields you might want to study.", AREAS_OF_INTEREST),
  multi("programStrength", "Program strengths", "preferences", "What you want a college to be strong at.", PROGRAM_STRENGTH, { optional: true }),
  multi("institutionType", "Institution type", "preferences", "The kind of school that fits you.", INSTITUTION_TYPE, { optional: true }),
  multi("specialDesignation", "Special designations", "preferences", "If any of these matter to you.", SPECIAL_DESIGNATION, { optional: true }),
  multi("campusCulture", "Campus culture", "preferences", "The environment you'd thrive in.", CAMPUS_CULTURE, { optional: true }),
  multi("financialAid", "Financial aid importance", "preferences", "How much aid factors into your choice.", FINANCIAL_AID, { sensitive: true, optional: true }),
  multi("geographyArea", "Setting", "preferences", "Rural, suburban, or urban.", GEOGRAPHY_AREA, { optional: true }),
  multi("studentBody", "Student-body size", "preferences", "How big a school you'd like.", STUDENT_BODY, { optional: true }),
  scalar("prefOthers", "Anything else", "preferences", "textarea", "Other preferences we should keep in mind.", { maxLength: 300, optional: true }),

  // Awards --------------------------------------------------------------------
  {
    id: "awards",
    label: "Awards & honors",
    theme: "awards",
    type: "awards",
    reason: "Recognition strengthens applications, scholarships, and your narrative.",
    optional: true,
    answered: (s) => s.app.awards.length > 0,
  },

  // Activities ----------------------------------------------------------------
  {
    id: "activities",
    label: "Activities",
    theme: "activities",
    type: "activities",
    reason: "Your activities shape recommendations across nearly every tool.",
    answered: (s) => s.app.activities.length > 0,
  },
  scalar("accomplishmentDetail", "A proud accomplishment", "activities", "textarea", "One specific impact you've had — useful for essays and recommendations.", { placeholder: "What did you do, and what changed because of it?", maxLength: 300, optional: true }),
];

// ── Lookups ───────────────────────────────────────────────────────────────────

const BY_ID = new Map(FIELDS.map((f) => [f.id, f]));

export function getField(id: string): FieldDef | undefined {
  return BY_ID.get(id);
}

export function fieldsByTheme(theme: Theme): FieldDef[] {
  return FIELDS.filter((f) => f.theme === theme);
}
