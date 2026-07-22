import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getProfileStore,
  type ProfileBundle,
  type InputSnapshot,
} from "../lib/persistence";
import { getField } from "../profile/fields";
import { deriveLegacyProfile } from "../profile/deriveLegacy";
import type { SaveState } from "../components/ui/SaveIndicator";

const QUIZ_KEY = "crew-b:quiz-answers";
const PROFILE_KEY = "crew-b:student-profile";
const APP_PROFILE_KEY = "crew-b:application-profile";

/** Answers to the Career Discovery Quiz, keyed by question id. */
export type QuizAnswers = Record<string, string>;

/** Free-form basic profile inputs the student fills in for recommendations. */
export type StudentProfile = {
  gradeLevel: string;
  gpa: string;
  gpaScale: string;
  apCount: string;
  testScores: string;
  extracurriculars: string;
  extracurricularAwards: string;
  interests: string;
  goals: string;
  constraints: string;
};

export const emptyProfile: StudentProfile = {
  gradeLevel: "",
  gpa: "",
  gpaScale: "",
  apCount: "",
  testScores: "",
  extracurriculars: "",
  extracurricularAwards: "",
  interests: "",
  goals: "",
  constraints: "",
};

/** A single AP / IB / A-Level exam entry (subject + score). */
export type ExamEntry = { subject: string; score: string };

/** One row in the Awards step. */
export type AwardEntry = {
  award: string;
  gradeLevel: string;
  levelOfRecognition: string;
};

/** One card in the Activities step. */
export type ActivityEntry = {
  activityType: string;
  position: string;
  organizationName: string;
  grade: string;
  weeksPerYear: string;
  hoursPerWeek: string;
  description: string;
};

/**
 * Full structured "College Profile" wizard data. Fields map 1:1 to the six
 * wizard steps. Every scalar defaults to "" and every list to []; nested test
 * scores are always present objects so step components can bind without guards.
 */
export type ApplicationProfile = {
  // Step 1 — Basic Information
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  currentSchoolYear: string;
  graduationYear: string;
  firstGeneration: string;
  familyIncome: string;
  residencyStatus: string;
  // Step 2 — Education
  schoolName: string;
  country: string;
  stateProvince: string;
  city: string;
  graduatingClassSize: string;
  classRanking: string;
  gpaScale: string;
  unweightedGpa: string;
  weightedGpa: string;
  // Step 3 — Testing
  sat: { readingWriting: string; math: string; total: string };
  act: {
    english: string;
    math: string;
    reading: string;
    science: string;
    composite: string;
  };
  examType: "AP" | "IB" | "A-Level";
  apSubjects: ExamEntry[];
  ibSubjects: ExamEntry[];
  aLevels: ExamEntry[];
  // Step 4 — Preference
  prefCountry: string;
  prefStateProvince: string;
  regions: string[];
  areasOfInterest: string[];
  programStrength: string[];
  institutionType: string[];
  specialDesignation: string[];
  campusCulture: string[];
  financialAid: string[];
  geographyArea: string[];
  studentBody: string[];
  prefOthers: string;
  // Step 5 — Awards
  awards: AwardEntry[];
  // Step 6 — Activities
  activities: ActivityEntry[];

  // ── Controlled reusable additions (see src/profile/schema.ts EXTRA_FIELDS).
  // Each was added only because it materially improves a tool's future LLM
  // input and is reused across tools. All optional & default-empty so existing
  // stored profiles migrate forward untouched.
  /** A career the student already has in mind (Career Tracks/Fit, Majors). */
  careerDirection: string;
  /** Favorite subjects / academic strengths (Majors, Career Fit, High School Plan). */
  favoriteSubjects: string[];
  /** Courses in progress or planned (High School Plan, Application rigor signal). */
  currentCourses: string;
  /** One accomplishment/impact detail for a credible narrative (Positioning, Recs). */
  accomplishmentDetail: string;
};

export const emptyApplicationProfile: ApplicationProfile = {
  firstName: "",
  middleName: "",
  lastName: "",
  gender: "",
  currentSchoolYear: "",
  graduationYear: "",
  firstGeneration: "",
  familyIncome: "",
  residencyStatus: "",
  schoolName: "",
  country: "United States of America",
  stateProvince: "",
  city: "",
  graduatingClassSize: "",
  classRanking: "",
  gpaScale: "None",
  unweightedGpa: "",
  weightedGpa: "",
  sat: { readingWriting: "", math: "", total: "" },
  act: { english: "", math: "", reading: "", science: "", composite: "" },
  examType: "AP",
  apSubjects: [],
  ibSubjects: [],
  aLevels: [],
  prefCountry: "US",
  prefStateProvince: "",
  regions: [],
  areasOfInterest: [],
  programStrength: [],
  institutionType: [],
  specialDesignation: [],
  campusCulture: [],
  financialAid: [],
  geographyArea: [],
  studentBody: [],
  prefOthers: "",
  awards: [],
  activities: [],
  careerDirection: "",
  favoriteSubjects: [],
  currentCourses: "",
  accomplishmentDetail: "",
};

type StudentProfileContextValue = {
  /** Quiz answers, or null if the quiz hasn't been taken yet. */
  quizAnswers: QuizAnswers | null;
  /** Persist the full set of quiz answers. */
  setQuizAnswers: (answers: QuizAnswers) => void;
  /** Basic profile inputs (always an object; fields default to ""). */
  profile: StudentProfile;
  /** Merge a partial update into the stored profile. */
  updateProfile: (patch: Partial<StudentProfile>) => void;
  /** Structured College Profile wizard data (always an object). */
  applicationProfile: ApplicationProfile;
  /** Merge a partial update into the stored application profile. */
  updateApplicationProfile: (patch: Partial<ApplicationProfile>) => void;
  /** Registry-driven setter for a single scalar/multiselect field by id. */
  answerField: (fieldId: string, value: string | string[]) => void;
  /**
   * Snapshot the current College Profile + quiz answers, then wipe them to a
   * true blank slate (called from the reset control). The snapshot is saved
   * durably before this resolves, so it survives an immediate page reload.
   */
  resetProfile: () => Promise<void>;
  /** True once a snapshot exists that "Restore Inputs" can bring back. */
  hasBackup: boolean;
  /** Restore the most recently saved College Profile + quiz snapshot. */
  restoreProfile: () => void;
  /** Non-intrusive autosave lifecycle for the "Saved" indicator. */
  saveState: SaveState;
  /** Force a save after a recoverable error. */
  retrySave: () => void;
  /** False until the account-linked bundle has loaded for the current user. */
  hydrated: boolean;
};

const StudentProfileContext = createContext<StudentProfileContextValue | null>(
  null,
);

function loadQuiz(): QuizAnswers | null {
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as QuizAnswers) : null;
  } catch {
    return null;
  }
}

function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return emptyProfile;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? { ...emptyProfile, ...(parsed as Partial<StudentProfile>) }
      : emptyProfile;
  } catch {
    return emptyProfile;
  }
}

function loadApplicationProfile(): ApplicationProfile {
  try {
    const raw = localStorage.getItem(APP_PROFILE_KEY);
    if (!raw) return emptyApplicationProfile;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object"
      ? { ...emptyApplicationProfile, ...(parsed as Partial<ApplicationProfile>) }
      : emptyApplicationProfile;
  } catch {
    return emptyApplicationProfile;
  }
}

/** Does a legacy localStorage bundle hold anything worth migrating? */
function bundleHasData(b: ProfileBundle): boolean {
  if (b.quiz && Object.keys(b.quiz).length > 0) return true;
  const app = b.application;
  return Object.entries(app).some(([key, val]) => {
    const empty = emptyApplicationProfile[key as keyof ApplicationProfile];
    return JSON.stringify(val) !== JSON.stringify(empty);
  });
}

/** Is this application profile indistinguishable from a fresh/empty one? */
function isApplicationEmpty(app: ApplicationProfile): boolean {
  return JSON.stringify(app) === JSON.stringify(emptyApplicationProfile);
}

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const { userId, loading: authLoading } = useAuth();
  const store = useMemo(getProfileStore, []);

  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(emptyProfile);
  const [applicationProfile, setApplicationProfile] =
    useState<ApplicationProfile>(emptyApplicationProfile);
  const [backup, setBackup] = useState<InputSnapshot | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [hydrated, setHydrated] = useState(false);

  // Refs coordinate hydration vs. autosave so loading data never triggers a save.
  const hydratedRef = useRef(false);
  const skipSaveRef = useRef(false);

  // ── Hydrate the account-linked bundle whenever the active user changes ──────
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    hydratedRef.current = false;
    setHydrated(false);

    (async () => {
      let bundle = await store.load(userId).catch(() => null);

      if (!bundle) {
        // First load for this user: migrate any pre-existing localStorage data
        // (from before accounts existed) so no field is ever silently dropped.
        const migrated: ProfileBundle = {
          application: loadApplicationProfile(),
          quiz: loadQuiz(),
          legacy: loadProfile(),
        };
        bundle = migrated;
        if (bundleHasData(migrated)) {
          await store.save(userId, migrated).catch(() => {});
        }
      }

      if (cancelled) return;
      setQuizAnswersState(bundle.quiz);
      setProfile({ ...emptyProfile, ...bundle.legacy });
      setApplicationProfile({ ...emptyApplicationProfile, ...bundle.application });
      setBackup(bundle.backup ?? null);
      setSaveState("idle");
      skipSaveRef.current = true; // don't re-save the freshly-loaded state
      hydratedRef.current = true;
      setHydrated(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, authLoading, store]);

  // ── Debounced autosave with visible save-state ──────────────────────────────
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      return;
    }
    setSaveState("saving");
    const bundle: ProfileBundle = {
      application: applicationProfile,
      quiz: quizAnswers,
      legacy: profile,
      backup,
    };
    const timer = setTimeout(() => {
      store
        .save(userId, bundle)
        .then(() => setSaveState("saved"))
        .catch(() => setSaveState("error"));
    }, 600);
    return () => clearTimeout(timer);
  }, [quizAnswers, profile, applicationProfile, backup, userId, store]);

  // Fade the "Saved" stamp back to idle so it stays quiet.
  useEffect(() => {
    if (saveState !== "saved") return;
    const t = setTimeout(() => setSaveState("idle"), 2200);
    return () => clearTimeout(t);
  }, [saveState]);

  // Keep the flat legacy profile (consumed by the roadmap / best-next-task AI)
  // continuously derived from the structured profile, so information collected
  // in any tool immediately personalizes those features. Only writes when a
  // derived value actually changes, to avoid an update loop.
  useEffect(() => {
    if (!hydratedRef.current) return;
    const derived = deriveLegacyProfile(applicationProfile);
    setProfile((prev) => {
      const changed = (Object.keys(derived) as (keyof StudentProfile)[]).some(
        (k) => prev[k] !== derived[k],
      );
      return changed ? { ...prev, ...derived } : prev;
    });
  }, [applicationProfile]);

  const retrySave = useCallback(() => {
    setSaveState("saving");
    const bundle: ProfileBundle = {
      application: applicationProfile,
      quiz: quizAnswers,
      legacy: profile,
      backup,
    };
    store
      .save(userId, bundle)
      .then(() => setSaveState("saved"))
      .catch(() => setSaveState("error"));
  }, [applicationProfile, quizAnswers, profile, backup, userId, store]);

  const setQuizAnswers = useCallback((answers: QuizAnswers) => {
    setQuizAnswersState(answers);
  }, []);

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateApplicationProfile = useCallback(
    (patch: Partial<ApplicationProfile>) => {
      setApplicationProfile((prev) => ({ ...prev, ...patch }));
    },
    [],
  );

  const answerField = useCallback(
    (fieldId: string, value: string | string[]) => {
      const field = getField(fieldId);
      if (!field?.set) return; // composite fields update via updateApplicationProfile
      setApplicationProfile((prev) => ({ ...prev, ...field.set!(value, prev) }));
    },
    [],
  );

  const resetProfile = useCallback(async () => {
    // Snapshot current inputs before wiping them, unless there's nothing to
    // save (never overwrite a real prior backup with an empty one).
    const hasCurrentData = !isApplicationEmpty(applicationProfile) || quizAnswers !== null;
    const nextBackup: InputSnapshot | null = hasCurrentData
      ? { application: applicationProfile, quiz: quizAnswers, savedAt: new Date().toISOString() }
      : backup;

    setBackup(nextBackup);
    setQuizAnswersState(null);
    setProfile(emptyProfile);
    setApplicationProfile(emptyApplicationProfile);

    // Persist immediately (don't rely on the debounced autosave) so the
    // snapshot and the clear are durable before the caller reloads the page.
    const bundle: ProfileBundle = {
      application: emptyApplicationProfile,
      quiz: null,
      legacy: emptyProfile,
      backup: nextBackup,
    };
    try {
      await store.save(userId, bundle);
    } catch {
      // Best-effort, same as autosave — the local mirror already attempted
      // a write; nothing more useful to do before the page reloads.
    }
  }, [applicationProfile, quizAnswers, backup, userId, store]);

  const restoreProfile = useCallback(() => {
    if (!backup) return;
    setApplicationProfile(backup.application);
    setQuizAnswersState(backup.quiz);
    // Legacy `profile` re-derives automatically from the effect above.
    // `backup` itself is left untouched so it can be restored again later.
  }, [backup]);

  const value = useMemo<StudentProfileContextValue>(
    () => ({
      quizAnswers,
      setQuizAnswers,
      profile,
      updateProfile,
      applicationProfile,
      updateApplicationProfile,
      answerField,
      resetProfile,
      hasBackup: backup !== null,
      restoreProfile,
      saveState,
      retrySave,
      hydrated,
    }),
    [
      quizAnswers,
      setQuizAnswers,
      profile,
      updateProfile,
      applicationProfile,
      updateApplicationProfile,
      answerField,
      resetProfile,
      backup,
      restoreProfile,
      saveState,
      retrySave,
      hydrated,
    ],
  );

  return (
    <StudentProfileContext.Provider value={value}>
      {children}
    </StudentProfileContext.Provider>
  );
}

export function useStudentProfile() {
  const ctx = useContext(StudentProfileContext);
  if (!ctx) {
    throw new Error(
      "useStudentProfile must be used within a StudentProfileProvider",
    );
  }
  return ctx;
}

/**
 * Convenience view of the current profile for the field registry / completeness
 * helpers (which take a `{ app, quiz }` snapshot).
 */
export function useProfileSnapshot() {
  const { applicationProfile, quizAnswers } = useStudentProfile();
  return useMemo(
    () => ({ app: applicationProfile, quiz: quizAnswers }),
    [applicationProfile, quizAnswers],
  );
}
