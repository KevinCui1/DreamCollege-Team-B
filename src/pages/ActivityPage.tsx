import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { activityPath, findActivity } from "../data/navigation";
import { useCompletion } from "../context/CompletionContext";
import XpCelebration from "../components/XpCelebration";
import CareerDiscoveryQuiz from "../components/CareerDiscoveryQuiz";
import CollegeProfileWizard from "../components/CollegeProfileWizard";
import { milestones } from "../data/achievements";
import { useAchievement } from "../context/AchievementContext";
import { useFeedback } from "../context/FeedbackContext";
import { activityFeedback } from "../data/feedbackQuestions";
import { xpForPath } from "../lib/nextStep";

/** Slug of the activity that renders the interactive Career Discovery Quiz. */
const CAREER_DISCOVERY_QUIZ_SLUG = "career-discovery-quiz";
/** Slug of the activity that renders the College Profile form. */
const COLLEGE_PROFILE_SLUG = "college-profile";

export default function ActivityPage() {
  const { groupSlug, itemSlug } = useParams();
  const { isComplete, complete } = useCompletion();
  const [xpAward, setXpAward] = useState<number | null>(null);
  const { earnMilestone } = useAchievement();
  const { triggerFeedback } = useFeedback();

  const match = findActivity(groupSlug, itemSlug);

  if (!match) {
    return (
      <div className="mx-auto max-w-3xl px-8 py-10">
        <h1 className="text-2xl font-bold text-slate-800">Activity not found</h1>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">
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

  const isCollegeProfile = item.slug === COLLEGE_PROFILE_SLUG;

  return (
    <div
      className={`mx-auto px-8 py-10 ${isCollegeProfile ? "max-w-6xl" : "max-w-3xl"}`}
    >
      {xpAward !== null && (
        <XpCelebration amount={xpAward} onDone={() => setXpAward(null)} />
      )}
      <nav className="mb-6 text-sm text-slate-400">
        <Link to="/" className="hover:text-slate-600">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>{group.label}</span>
        <span className="mx-2">/</span>
        <span className="text-slate-600">{item.label}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-800">{item.label}</h1>
      <p className="mt-2 text-slate-500">
        Part of <span className="font-medium text-slate-700">{group.label}</span>.
      </p>

      {/* The College Profile wizard supplies its own two-column card layout, so
          it renders outside the default white content card. */}
      {isCollegeProfile ? (
        <CollegeProfileWizard done={done} onComplete={handleComplete} />
      ) : (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          {item.slug === CAREER_DISCOVERY_QUIZ_SLUG ? (
            <CareerDiscoveryQuiz done={done} onComplete={handleComplete} />
          ) : done ? (
            <div>
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 size={24} />
                <span className="text-lg font-semibold">Activity completed</span>
              </div>
              <p className="mt-2 text-slate-500">
                Nice work — this activity is marked complete and counts toward
                your progress.
              </p>
              <button
                type="button"
                disabled
                className="mt-6 cursor-default rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white opacity-90"
              >
                Completed ✓
              </button>
            </div>
          ) : (
            <div>
              <p className="text-slate-600">
                When you're ready, mark this activity as complete.
              </p>
              <button
                type="button"
                onClick={handleComplete}
                className="mt-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500"
              >
                Complete Activity
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
