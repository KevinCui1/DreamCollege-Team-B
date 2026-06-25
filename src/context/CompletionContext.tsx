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

export function CompletionProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<string[]>(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Ignore storage failures (e.g. private mode); state stays in memory.
    }
  }, [completed]);

  const isComplete = useCallback(
    (path: string) => completed.includes(path),
    [completed],
  );

  const complete = useCallback((path: string) => {
    setCompleted((prev) => (prev.includes(path) ? prev : [...prev, path]));
  }, []);

  const reset = useCallback((path: string) => {
    setCompleted((prev) => prev.filter((p) => p !== path));
  }, []);

  const resetAll = useCallback(() => {
    setCompleted([]);
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
    }),
    [isComplete, complete, reset, resetAll, completed],
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
