import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { FeedbackItem } from "../data/feedbackQuestions";

const STORAGE_KEY = "crew-b:feedback-responses";

export type FeedbackResponse = {
  id: string;
  submittedAt: string;
  responses: Record<string, string>;
};

type FeedbackContextValue = {
  current: FeedbackItem | null;
  triggerFeedback: (item: FeedbackItem, delayMs?: number) => void;
  submit: (responses: Record<string, string>) => void;
  dismiss: () => void;
};

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

function saveResponse(response: FeedbackResponse) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all: FeedbackResponse[] = raw ? JSON.parse(raw) : [];
    all.push(response);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Ignore storage failures.
  }
}

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<FeedbackItem[]>([]);
  /** IDs shown this session — prevents the same prompt appearing twice. */
  const shownIds = useRef<Set<string>>(new Set());

  const current = queue[0] ?? null;

  const advance = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  const triggerFeedback = useCallback(
    (item: FeedbackItem, delayMs = 1200) => {
      if (shownIds.current.has(item.id)) return;
      shownIds.current.add(item.id);
      setTimeout(() => {
        setQueue((q) => [...q, item]);
      }, delayMs);
    },
    [],
  );

  const submit = useCallback(
    (responses: Record<string, string>) => {
      if (!current) return;
      saveResponse({
        id: current.id,
        submittedAt: new Date().toISOString(),
        responses,
      });
      advance();
    },
    [current, advance],
  );

  const dismiss = useCallback(() => {
    advance();
  }, [advance]);

  const value = useMemo<FeedbackContextValue>(
    () => ({ current, triggerFeedback, submit, dismiss }),
    [current, triggerFeedback, submit, dismiss],
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}
