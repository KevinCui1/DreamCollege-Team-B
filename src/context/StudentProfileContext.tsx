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

/** Answers to the Career Discovery Quiz, keyed by question id. */
export type QuizAnswers = Record<string, string>;

/** Free-form basic profile inputs the student fills in for recommendations. */
export type StudentProfile = {
  gradeLevel: string;
  gpa: string;
  apCount: string;
  interests: string;
  goals: string;
  constraints: string;
};

export const emptyProfile: StudentProfile = {
  gradeLevel: "",
  gpa: "",
  apCount: "",
  interests: "",
  goals: "",
  constraints: "",
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

export function StudentProfileProvider({ children }: { children: ReactNode }) {
  const [quizAnswers, setQuizAnswersState] = useState<QuizAnswers | null>(
    loadQuiz,
  );
  const [profile, setProfile] = useState<StudentProfile>(loadProfile);

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

  const setQuizAnswers = useCallback((answers: QuizAnswers) => {
    setQuizAnswersState(answers);
  }, []);

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetProfile = useCallback(() => {
    setQuizAnswersState(null);
    setProfile(emptyProfile);
  }, []);

  const value = useMemo<StudentProfileContextValue>(
    () => ({
      quizAnswers,
      setQuizAnswers,
      profile,
      updateProfile,
      resetProfile,
    }),
    [quizAnswers, setQuizAnswers, profile, updateProfile, resetProfile],
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
