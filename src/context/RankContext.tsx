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
import { useCompletion } from "./CompletionContext";
import { deriveRankFromXp, type Rank } from "../data/ranks";
import { earnedXp } from "../lib/nextStep";

const STORAGE_KEY = "crew-b:rank-state";

/**
 * Persisted rank state — deliberately separate from `crew-b:completed-activities`
 * so the dashboard milestone never pollutes the 14-activity progress count.
 *
 * - `dashboardVisited`: set the first time the student opens the home page.
 * - `celebratedOrder`: the highest rank order whose rank-up animation has played,
 *    so each rank celebrates exactly once and never replays on reload.
 */
type RankState = {
  dashboardVisited: boolean;
  celebratedOrder: number;
};

type RankContextValue = {
  /** The student's current rank, derived live from completion state. */
  currentRank: Rank;
  /** The rank whose animation should play right now, or null. */
  pendingRankUp: Rank | null;
  /** Called by the overlay when the student dismisses it. */
  onRankUpComplete: () => void;
  /** Marks the dashboard milestone complete (idempotent). */
  markDashboardVisited: () => void;
  /** Wipe rank state (dashboard milestone + celebration history). */
  resetRank: () => void;
};

const RankContext = createContext<RankContextValue | null>(null);

function loadState(): RankState {
  const fallback: RankState = { dashboardVisited: false, celebratedOrder: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<RankState>;
    return {
      dashboardVisited: Boolean(parsed.dashboardVisited),
      celebratedOrder:
        typeof parsed.celebratedOrder === "number" ? parsed.celebratedOrder : 0,
    };
  } catch {
    return fallback;
  }
}

export function RankProvider({ children }: { children: ReactNode }) {
  const { isComplete, completedPaths } = useCompletion();
  const [state, setState] = useState<RankState>(loadState);
  const [pendingRankUp, setPendingRankUp] = useState<Rank | null>(null);

  // Persist rank state whenever it changes (best-effort; survives reload).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage failures (e.g. private mode); state stays in memory.
    }
  }, [state]);

  // Derive the current rank from total XP earned across completed activities.
  // `completedPaths` is in the dep list so this recomputes on every change
  // (isComplete is derived from the same completion state).
  const currentRank = useMemo(
    () => deriveRankFromXp(earnedXp(isComplete)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [completedPaths],
  );

  // Detect upward transitions: when the derived rank passes the highest rank we
  // have already celebrated, queue its animation. We compare against the latest
  // celebratedOrder via a ref so this effect only depends on the derived rank.
  const celebratedOrderRef = useRef(state.celebratedOrder);
  celebratedOrderRef.current = state.celebratedOrder;

  useEffect(() => {
    if (currentRank.order > celebratedOrderRef.current) {
      setPendingRankUp(currentRank);
    }
  }, [currentRank]);

  // Read the in-flight rank via a ref so onRankUpComplete is a stable callback
  // and doesn't nest setState inside another updater.
  const pendingRef = useRef<Rank | null>(null);
  pendingRef.current = pendingRankUp;

  const onRankUpComplete = useCallback(() => {
    const rank = pendingRef.current;
    if (rank) {
      setState((prev) =>
        rank.order > prev.celebratedOrder
          ? { ...prev, celebratedOrder: rank.order }
          : prev,
      );
    }
    setPendingRankUp(null);
  }, []);

  const markDashboardVisited = useCallback(() => {
    setState((prev) =>
      prev.dashboardVisited ? prev : { ...prev, dashboardVisited: true },
    );
  }, []);

  const resetRank = useCallback(() => {
    setState({ dashboardVisited: false, celebratedOrder: 0 });
    setPendingRankUp(null);
  }, []);

  const value = useMemo<RankContextValue>(
    () => ({
      currentRank,
      pendingRankUp,
      onRankUpComplete,
      markDashboardVisited,
      resetRank,
    }),
    [
      currentRank,
      pendingRankUp,
      onRankUpComplete,
      markDashboardVisited,
      resetRank,
    ],
  );

  return <RankContext.Provider value={value}>{children}</RankContext.Provider>;
}

export function useRank() {
  const ctx = useContext(RankContext);
  if (!ctx) {
    throw new Error("useRank must be used within a RankProvider");
  }
  return ctx;
}
