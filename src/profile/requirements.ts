/**
 * Centralized tool → field requirement map.
 *
 * For every navigation tool, each relevant field is marked `required-now`
 * (materially gates a useful result) or `useful-if-missing` (improves it).
 * Anything unlisted is not-needed. This map — not the page components — decides
 * what each tool asks for, following the strategy in CLAUDE.md's
 * <tool_input_strategy>. Notably: Colleges never forces test scores; Career Fit
 * never demands college preferences; Scholarships explains sensitive fields.
 */

export type RequirementLevel = "required-now" | "useful-if-missing";
export type ToolRequirement = { fieldId: string; level: RequirementLevel };

const req = (...ids: string[]): ToolRequirement[] =>
  ids.map((fieldId) => ({ fieldId, level: "required-now" as const }));
const useful = (...ids: string[]): ToolRequirement[] =>
  ids.map((fieldId) => ({ fieldId, level: "useful-if-missing" as const }));

export const TOOL_REQUIREMENTS: Record<string, ToolRequirement[]> = {
  // Career Planning ----------------------------------------------------------
  "career-discovery-quiz": [], // The quiz is itself the collection.
  "my-career-tracks": [
    ...req("currentSchoolYear"),
    ...useful("careerQuiz", "careerDirection", "areasOfInterest", "favoriteSubjects", "activities", "awards"),
  ],
  "career-fit-report": [
    ...req("careerQuiz"),
    ...useful("careerDirection", "favoriteSubjects", "areasOfInterest", "gpaScale", "unweightedGpa", "exams", "activities", "awards"),
  ],
  "explore-all-careers": [
    ...useful("careerQuiz", "areasOfInterest", "favoriteSubjects", "activities", "awards", "careerDirection"),
  ],
  "high-school-plan": [
    ...req("currentSchoolYear", "graduationYear"),
    ...useful("careerDirection", "favoriteSubjects", "currentCourses", "unweightedGpa", "sat", "act", "activities"),
  ],

  // College Planning ---------------------------------------------------------
  "college-profile": [], // The shared review/edit hub — not a gated collector.
  "positioning-statement": [
    ...req("activities"),
    ...useful("awards", "areasOfInterest", "careerDirection", "accomplishmentDetail"),
  ],
  "majors": [
    ...useful("careerQuiz", "areasOfInterest", "favoriteSubjects", "unweightedGpa", "activities", "awards", "careerDirection"),
  ],
  "colleges": [
    ...req("graduationYear", "areasOfInterest"),
    ...useful("gpaScale", "unweightedGpa", "prefCountry", "regions", "institutionType", "campusCulture", "geographyArea", "studentBody", "financialAid", "careerDirection", "sat", "act"),
  ],
  "activities": [
    ...req("activities"),
  ],
  "scholarships": [
    ...useful("residencyStatus", "firstGeneration", "familyIncome", "financialAid", "unweightedGpa", "awards", "activities", "graduationYear"),
  ],
  "shortlist": [
    ...req("areasOfInterest"),
    ...useful("prefCountry", "regions", "institutionType", "unweightedGpa", "sat", "act", "financialAid", "careerDirection"),
  ],

  // College Application ------------------------------------------------------
  "application": [
    ...req("firstName", "lastName", "schoolName", "currentSchoolYear", "graduationYear"),
    ...useful("gpaScale", "unweightedGpa", "sat", "act", "exams", "activities", "awards", "areasOfInterest", "careerDirection", "currentCourses"),
  ],
  "recommendation-letter": [
    ...req("schoolName", "currentSchoolYear"),
    ...useful("activities", "awards", "favoriteSubjects", "careerDirection", "accomplishmentDetail"),
  ],
};

export function requirementsForTool(slug: string | undefined): ToolRequirement[] {
  return (slug && TOOL_REQUIREMENTS[slug]) || [];
}
