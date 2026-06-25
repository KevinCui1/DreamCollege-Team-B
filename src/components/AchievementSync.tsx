import { useEffect } from "react";
import { milestones } from "../data/achievements";
import { useCompletion } from "../context/CompletionContext";
import { useAchievement } from "../context/AchievementContext";

export default function AchievementSync() {
  const { isComplete } = useCompletion();
  const { isMilestoneEarned, earnMilestoneSilent } = useAchievement();

  // On mount, silently grant achievements for activities already completed
  // before the achievement system existed — no celebration toast for these.
  useEffect(() => {
    milestones.forEach((milestone) => {
      if (isComplete(milestone.triggerPath) && !isMilestoneEarned(milestone.id)) {
        earnMilestoneSilent(milestone.id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
