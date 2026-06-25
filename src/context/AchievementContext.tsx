import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  milestones,
  defaultGradeAchievements,
  type MilestoneAchievement,
  type MilestoneId,
  type GradeAchievement,
  type GradeLevel,
} from "../data/achievements";

const MILESTONE_KEY = "crew-b:earned-milestones";
const GRADE_KEY = "crew-b:grade-achievements";

export type CelebrationEvent = {
  id: string;
  title: string;
};

type AchievementContextValue = {
  isMilestoneEarned: (id: MilestoneId) => boolean;
  earnMilestone: (id: MilestoneId) => void;
  earnMilestoneSilent: (id: MilestoneId) => void;
  nextMilestone: MilestoneAchievement | null;
  gradeAchievements: GradeAchievement[];
  toggleGradeAchievement: (id: string) => void;
  addGradeAchievement: (gradeLevel: GradeLevel, title: string) => void;
  removeGradeAchievement: (id: string) => void;
  celebration: CelebrationEvent | null;
  clearCelebration: () => void;
  resetAchievements: () => void;
  earnedMilestoneCount: number;
  totalMilestoneCount: number;
};

const AchievementContext = createContext<AchievementContextValue | null>(null);

export function AchievementProvider({ children }: { children: ReactNode }) {
  const [earnedMilestones, setEarnedMilestones] = useState<Set<MilestoneId>>(() => {
    try {
      const stored = localStorage.getItem(MILESTONE_KEY);
      return stored ? new Set<MilestoneId>(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [gradeAchievements, setGradeAchievements] = useState<GradeAchievement[]>(() => {
    try {
      const stored = localStorage.getItem(GRADE_KEY);
      return stored ? JSON.parse(stored) : defaultGradeAchievements;
    } catch {
      return defaultGradeAchievements;
    }
  });

  const [celebration, setCelebration] = useState<CelebrationEvent | null>(null);

  useEffect(() => {
    localStorage.setItem(MILESTONE_KEY, JSON.stringify([...earnedMilestones]));
  }, [earnedMilestones]);

  useEffect(() => {
    localStorage.setItem(GRADE_KEY, JSON.stringify(gradeAchievements));
  }, [gradeAchievements]);

  const isMilestoneEarned = useCallback(
    (id: MilestoneId) => earnedMilestones.has(id),
    [earnedMilestones],
  );

  const earnMilestone = useCallback((id: MilestoneId) => {
    setEarnedMilestones((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    const milestone = milestones.find((m) => m.id === id);
    if (milestone) setCelebration({ id, title: milestone.title });
  }, []);

  const earnMilestoneSilent = useCallback((id: MilestoneId) => {
    setEarnedMilestones((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const nextMilestone = useMemo(
    () => milestones.find((m) => !earnedMilestones.has(m.id)) ?? null,
    [earnedMilestones],
  );

  const toggleGradeAchievement = useCallback((id: string) => {
    setGradeAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a)),
    );
  }, []);

  const addGradeAchievement = useCallback((gradeLevel: GradeLevel, title: string) => {
    const id = `custom-${gradeLevel}-${Date.now()}`;
    setGradeAchievements((prev) => [
      ...prev,
      { id, gradeLevel, title, completed: false },
    ]);
  }, []);

  const removeGradeAchievement = useCallback((id: string) => {
    setGradeAchievements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearCelebration = useCallback(() => setCelebration(null), []);

  const resetAchievements = useCallback(() => {
    setEarnedMilestones(new Set());
    setGradeAchievements(defaultGradeAchievements);
    setCelebration(null);
  }, []);

  const value = useMemo<AchievementContextValue>(
    () => ({
      isMilestoneEarned,
      earnMilestone,
      earnMilestoneSilent,
      nextMilestone,
      gradeAchievements,
      toggleGradeAchievement,
      addGradeAchievement,
      removeGradeAchievement,
      celebration,
      clearCelebration,
      resetAchievements,
      earnedMilestoneCount: earnedMilestones.size,
      totalMilestoneCount: milestones.length,
    }),
    [
      isMilestoneEarned,
      earnMilestone,
      earnMilestoneSilent,
      nextMilestone,
      gradeAchievements,
      toggleGradeAchievement,
      addGradeAchievement,
      removeGradeAchievement,
      celebration,
      clearCelebration,
      resetAchievements,
      earnedMilestones.size,
    ],
  );

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievement() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error("useAchievement must be used within AchievementProvider");
  return ctx;
}
