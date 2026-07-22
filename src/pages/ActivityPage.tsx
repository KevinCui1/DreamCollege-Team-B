import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { activityPath, findActivity } from "../data/navigation";
import { useCompletion } from "../context/CompletionContext";
import { useStudentProfile } from "../context/StudentProfileContext";
import XpCelebration from "../components/XpCelebration";
import CareerDiscoveryQuiz from "../components/CareerDiscoveryQuiz";
import CollegeProfileHub from "../components/CollegeProfileHub";
import ToolCollectionView from "../components/collection/ToolCollectionView";
import { milestones } from "../data/achievements";
import { useAchievement } from "../context/AchievementContext";
import { useFeedback } from "../context/FeedbackContext";
import { activityFeedback } from "../data/feedbackQuestions";
import { xpForPath } from "../lib/nextStep";

/** Slug of the activity that renders the interactive Career Discovery Quiz. */
const CAREER_DISCOVERY_QUIZ_SLUG = "career-discovery-quiz";
/** Slug of the activity that renders the College Profile review hub. */
const COLLEGE_PROFILE_SLUG = "college-profile";

export default function ActivityPage() {
  const { groupSlug, itemSlug } = useParams();
  const { isComplete, complete } = useCompletion();
  const { hydrated } = useStudentProfile();
  const [xpAward, setXpAward] = useState<number | null>(null);
  const { earnMilestone } = useAchievement();
  const { triggerFeedback } = useFeedback();

  const match = findActivity(groupSlug, itemSlug);

  if (!match) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="font-serif text-2xl font-bold text-ink">
          Activity not found
        </h1>
        <Link to="/" className="mt-4 inline-block text-lavender-700 hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  const { group, item } = match;
  const path = activityPath(group.slug, item.slug);
  const done = isComplete(path);

  const handleComplete = () => {
    // Only celebrate genuinely new completions that actually award XP, so
    // re-submits don't re-award and non-XP tasks don't pop a "+0 XP" moment.
    const firstTime = !isComplete(path);
    complete(path);

    const award = xpForPath(path);
    if (firstTime && award > 0) {
      setXpAward(award);
    }

    const milestone = milestones.find((m) => m.triggerPath === path);
    if (milestone) earnMilestone(milestone.id);

    if (itemSlug !== CAREER_DISCOVERY_QUIZ_SLUG) {
      triggerFeedback(activityFeedback(path, item.label), 3000);
    }
  };

  const isQuiz = item.slug === CAREER_DISCOVERY_QUIZ_SLUG;
  const isCollegeProfile = item.slug === COLLEGE_PROFILE_SLUG;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 sm:px-8">
      {xpAward !== null && (
        <XpCelebration amount={xpAward} onDone={() => setXpAward(null)} />
      )}
      <nav className="mb-6 font-body text-sm text-ink-soft">
        <Link to="/" className="hover:text-ink">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>{group.label}</span>
        <span className="mx-2">/</span>
        <span className="text-ink-muted">{item.label}</span>
      </nav>

      <h1 className="font-serif text-3xl font-semibold text-ink">{item.label}</h1>

      {isQuiz ? (
        <div className="mt-8 rounded-2xl border border-lavender-200/80 bg-white p-8 shadow-soft">
          <CareerDiscoveryQuiz done={done} onComplete={handleComplete} />
        </div>
      ) : !hydrated ? (
        <div className="mt-8 flex items-center gap-2 font-body text-sm text-ink-muted">
          Loading your profile…
        </div>
      ) : isCollegeProfile ? (
        <CollegeProfileHub done={done} onComplete={handleComplete} />
      ) : (
        <ToolCollectionView
          group={group}
          item={item}
          done={done}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
