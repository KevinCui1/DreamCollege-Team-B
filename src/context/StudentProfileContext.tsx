import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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
  /** Wipe quiz answers and profile inputs (called from the reset control). */
  resetProfile: () => void;
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

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers | null>(
    loadQuiz,
  );
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);
  const [applicationProfile, setApplicationProfile] =
    useState<ApplicationProfile>(loadApplicationProfile);

  useEffect(() => {
    try {
      if (quizAnswers === null) localStorage.removeItem(QUIZ_KEY);
      else localStorage.setItem(QUIZ_KEY, JSON.stringify(quizAnswers));
    } catch {
      // Ignore storage failures (e.g. private mode); state stays in memory.
    }
  }, [quizAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage failures; state stays in memory.
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(APP_PROFILE_KEY, JSON.stringify(applicationProfile));
    } catch {
      // Ignore storage failures; state stays in memory.
    }
  }, [applicationProfile]);

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

  const resetProfile = useCallback(() => {
    setQuizAnswersState(null);
    setProfile(emptyProfile);
    setApplicationProfile(emptyApplicationProfile);
  }, []);

  const value = useMemo<StudentProfileContextValue>(
    () => ({
      quizAnswers,
      setQuizAnswers,
      profile,
      updateProfile,
      applicationProfile,
      updateApplicationProfile,
      resetProfile,
    }),
    [
      quizAnswers,
      setQuizAnswers,
      profile,
      updateProfile,
      applicationProfile,
      updateApplicationProfile,
      resetProfile,
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
