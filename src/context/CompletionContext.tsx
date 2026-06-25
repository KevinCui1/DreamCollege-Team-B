import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { totalActivities } from "../data/navigation";

const STORAGE_KEY = "crew-b:completed-activities";
const STREAK_STORAGE_KEY = "crew-b:streak";

export const STREAK_CYCLE_DAYS = 30;
export const STREAK_MILESTONES = [3, 7, 15] as const;

type StreakState = {
  currentDay: number;
  lastActiveDate: string | null;
};

type CompletionContextValue = {
  /** Whether an activity (by its route path) has been completed. */
  isComplete: (path: string) => boolean;
  /** Mark an activity complete. */
  complete: (path: string) => void;
  /** Toggle / undo completion (handy for testing the gamification loop). */
  reset: (path: string) => void;
  /** Wipe all completion progress. */
  resetAll: () => void;
  /** Raw list of completed activity paths (lets consumers derive reactively). */
  completedPaths: string[];
  completedCount: number;
  totalCount: number;
  streakDay: number;
};

const CompletionContext = createContext<CompletionContextValue | null>(null);

function loadInitial(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadStreak(): StreakState {
  const fallback: StreakState = { currentDay: 0, lastActiveDate: null };

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as Partial<StreakState>;
    const currentDay =
      typeof parsed.currentDay === "number"
        ? Math.min(Math.max(Math.floor(parsed.currentDay), 0), STREAK_CYCLE_DAYS)
        : 0;
    const lastActiveDate =
      typeof parsed.lastActiveDate === "string" ? parsed.lastActiveDate : null;

    return { currentDay, lastActiveDate };
  } catch {
    return fallback;
  }
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(dateA: string, dateB: string) {
  const [yearA, monthA, dayA] = dateA.split("-").map(Number);
  const [yearB, monthB, dayB] = dateB.split("-").map(Number);
  const timeA = Date.UTC(yearA, monthA - 1, dayA);
  const timeB = Date.UTC(yearB, monthB - 1, dayB);
  return Math.round((timeB - timeA) / 86_400_000);
}

function advanceStreak(previous: StreakState, activeDate: string): StreakState {
  if (previous.lastActiveDate === activeDate) return previous;

  if (!previous.lastActiveDate || previous.currentDay >= STREAK_CYCLE_DAYS) {
    return { currentDay: 1, lastActiveDate: activeDate };
  }

  const isConsecutiveDay = daysBetween(previous.lastActiveDate, activeDate) === 1;
  return {
    currentDay: isConsecutiveDay ? previous.currentDay + 1 : 1,
    lastActiveDate: activeDate,
  };
}

export function CompletionProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<string[]>(loadInitial);
  const [streak, setStreak] = useState<StreakState>(loadStreak);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Ignore storage failures (e.g. private mode); state stays in memory.
    }
  }, [completed]);

  useEffect(() => {
    try {
      localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
    } catch {
      // Ignore storage failures (e.g. private mode); state stays in memory.
    }
  }, [streak]);

  const isComplete = useCallback(
    (path: string) => completed.includes(path),
    [completed],
  );

  const complete = useCallback((path: string) => {
    setCompleted((prev) => {
      if (prev.includes(path)) return prev;
      setStreak((previous) => advanceStreak(previous, localDateKey()));
      return [...prev, path];
    });
  }, []);

  const reset = useCallback((path: string) => {
    setCompleted((prev) => prev.filter((p) => p !== path));
  }, []);

  const resetAll = useCallback(() => {
    setCompleted([]);
    setStreak({ currentDay: 0, lastActiveDate: null });
  }, []);

  const value = useMemo<CompletionContextValue>(
    () => ({
      isComplete,
      complete,
      reset,
      resetAll,
      completedPaths: completed,
      completedCount: completed.length,
      totalCount: totalActivities,
      streakDay: streak.currentDay,
    }),
    [isComplete, complete, reset, resetAll, completed, streak.currentDay],
  );

  return (
    <CompletionContext.Provider value={value}>
      {children}
    </CompletionContext.Provider>
  );
}

export function useCompletion() {
  const ctx = useContext(CompletionContext);
  if (!ctx) {
    throw new Error("useCompletion must be used within a CompletionProvider");
  }
  return ctx;
}
