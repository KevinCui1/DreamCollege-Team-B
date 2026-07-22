import type {
  ApplicationProfile,
  StudentProfile,
} from "../context/StudentProfileContext";

/**
 * Folds the structured profile into the flat legacy `StudentProfile` string bag
 * that the roadmap / best-next-task AI context builders consume. Previously done
 * only on the wizard's final save; now derived continuously so contextually
 * collected data personalizes the AI features immediately. `goals` and
 * `constraints` are left untouched (they have no structured source).
 */
export function deriveLegacyProfile(p: ApplicationProfile): Partial<StudentProfile> {
  const tests: string[] = [];
  if (p.sat.total || p.sat.readingWriting || p.sat.math) {
    tests.push(
      `SAT: ${p.sat.total || "?"} (R&W ${p.sat.readingWriting || "?"}, Math ${p.sat.math || "?"})`,
    );
  }
  if (p.act.composite) tests.push(`ACT: ${p.act.composite}`);
  const apList = p.apSubjects
    .filter((a) => a.subject)
    .map((a) => `${a.subject}${a.score ? `: ${a.score}` : ""}`);
  if (apList.length) tests.push(`AP — ${apList.join(", ")}`);

  const activities = p.activities
    .filter((a) => a.activityType || a.organizationName)
    .map(
      (a) =>
        [a.position, a.organizationName].filter(Boolean).join(" @ ") ||
        a.activityType,
    );

  const awards = p.awards
    .filter((a) => a.award)
    .map((a) => [a.award, a.levelOfRecognition].filter(Boolean).join(" — "));

  // Interests blend the two structured signals so the AI sees both.
  const interests = [...p.areasOfInterest, ...p.favoriteSubjects];

  return {
    gradeLevel: p.currentSchoolYear,
    gpa: p.unweightedGpa || p.weightedGpa,
    gpaScale: p.gpaScale === "None" ? "" : p.gpaScale,
    apCount: apList.length ? String(apList.length) : "",
    testScores: tests.join("; "),
    extracurriculars: activities.join("; "),
    extracurricularAwards: awards.join("; "),
    interests: Array.from(new Set(interests)).join(", "),
    goals: p.careerDirection,
  };
}
