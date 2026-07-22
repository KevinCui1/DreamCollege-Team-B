import type { ApplicationProfile } from "../context/StudentProfileContext";

/**
 * The intentionally-tiny first-run set. Only what's needed to personalize the
 * dashboard and suggest an intelligent next step — no sensitive, academic,
 * testing, award, activity, or college-preference intake here (that's collected
 * contextually, at the tool where it becomes useful).
 */
export const ONBOARDING_FIELD_IDS = [
  "firstName",
  "currentSchoolYear",
  "graduationYear",
] as const;

/** A student is "onboarded" once the welcome essentials are present. */
export function isOnboarded(app: ApplicationProfile): boolean {
  return (
    app.firstName.trim() !== "" &&
    app.currentSchoolYear.trim() !== "" &&
    app.graduationYear.trim() !== ""
  );
}
