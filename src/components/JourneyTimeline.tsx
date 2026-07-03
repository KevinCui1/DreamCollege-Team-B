import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  DollarSign,
  FileText,
  HelpCircle,
  Lightbulb,
  Loader2,
  PartyPopper,
  RefreshCw,
  Sparkles,
  Target,
  User,
  type LucideIcon,
} from "lucide-react";
import { useCompletion } from "../context/CompletionContext";
import { useAchievement } from "../context/AchievementContext";
import { useStudentProfile } from "../context/StudentProfileContext";
import { makeItemDone } from "../lib/nextStep";
import {
  JOURNEY_COUNT,
  sequenceJourney,
  type JourneyMilestone,
} from "../lib/journey";
import {
  buildRoadmapContext,
  loadRoadmap,
  requestRoadmap,
  saveRoadmap,
  type GeneratedRoadmap,
  type RoadmapEntry,
  type RoadmapEntryCategory,
  type SectionPick,
} from "../lib/roadmap";
import { findSectionBySlug } from "../data/navigation";
import { softCard, eyebrow } from "../theme";
import { useFeedback } from "../context/FeedbackContext";
import { roadmapFeedback } from "../data/feedbackQuestions";

export default function JourneyTimeline() {
  const { isComplete, completedPaths } = useCompletion();
  const { gradeAchievements } = useAchievement();
  const { quizAnswers, profile } = useStudentProfile();
  const { triggerFeedback } = useFeedback();

  const itemDone = useMemo(
    () => makeItemDone(isComplete, gradeAchievements),
    [isComplete, gradeAchievements],
  );
  const { completed, current, upcoming } = useMemo(
    () => sequenceJourney(itemDone),
    [itemDone],
  );

  const profileComplete = isComplete("/college-planning/college-profile");
  const quizComplete = quizAnswers !== null;
  const setupDone = profileComplete && quizComplete;

  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(() =>
    loadRoadmap(),
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [autoUpdating, setAutoUpdating] = useState(false);

  const handleGenerate = async (lastCompletedActivity?: string | null) => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const ctx = buildRoadmapContext({
        quizAnswers,
        profile,
        isComplete,
        lastCompletedActivity,
      });
      const result = await requestRoadmap(ctx);
      saveRoadmap(result);
      setRoadmap(result);
      triggerFeedback(roadmapFeedback, 2000);
    } catch (e) {
      setGenerateError(
        e instanceof Error ? e.message : "Something went wrong.",
      );
    } finally {
      setIsGenerating(false);
      setAutoUpdating(false);
    }
  };

  // Dynamic updates: when the student completes a new step and a roadmap
  // already exists, silently regenerate so future entries reflect what they
  // just finished. Skipped on first mount (ref seeds to the current count),
  // and skipped entirely until the roadmap has been generated once.
  const prevCompletedCountRef = useRef(completedPaths.length);
  const prevCompletedPathsRef = useRef(completedPaths);
  useEffect(() => {
    const prevPaths = prevCompletedPathsRef.current;
    const grew = completedPaths.length > prevCompletedCountRef.current;
    if (grew && roadmap && !isGenerating) {
      const newlyCompleted = completedPaths.find(
        (p) => !prevPaths.includes(p),
      );
      setAutoUpdating(true);
      void handleGenerate(newlyCompleted ?? null);
    }
    prevCompletedCountRef.current = completedPaths.length;
    prevCompletedPathsRef.current = completedPaths;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedPaths]);

  // Phase 1: Prerequisites not complete — show focused starter card
  if (!setupDone) {
    return (
      <SetupStarterCard
        profileComplete={profileComplete}
        quizComplete={quizComplete}
      />
    );
  }

  // Phase 2: Setup done, no roadmap yet — show generate prompt
  if (!roadmap) {
    return (
      <GenerateCard
        isGenerating={isGenerating}
        generateError={generateError}
        onGenerate={() => handleGenerate(null)}
      />
    );
  }

  // Phase 3: Roadmap generated — show full timeline with AI entries as upcoming path
  const allDone = current === null && upcoming.length === 0;

  return (
    <section className={`${softCard} p-7`}>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            Your roadmap
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            A personalized path to college, built around your goals.
          </p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-lavender-100 px-3 py-1 text-xs font-bold text-lavender-700">
          {completed.length} / {JOURNEY_COUNT} done
        </span>
      </div>

      {autoUpdating && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-lavender-200 bg-lavender-50 px-3 py-2 text-xs font-semibold text-lavender-700">
          <Loader2 size={13} className="animate-spin" />
          Updating your plan based on what you just finished…
        </div>
      )}

      {/* Recommended next step — the merged "Best Next Task" feature, now
          the first thing shown on the dashboard instead of a corner button. */}
      {roadmap.recommendation && (
        <RecommendationCard recommendation={roadmap.recommendation} />
      )}

      {roadmap.sectionPicks && roadmap.sectionPicks.length > 0 && (
        <SectionPicksList picks={roadmap.sectionPicks} />
      )}

      {/* Completed and current static milestones */}
      <ol className="space-y-0">
        {completed.map((m) => (
          <TimelineRow key={m.id} milestone={m} connector="filled">
            <div className="flex items-baseline justify-between gap-3 py-1">
              <p className="text-sm font-semibold text-ink-muted line-through decoration-lavender-300">
                {m.title}
              </p>
              <span className="flex-shrink-0 text-[11px] font-semibold text-ink-soft">
                {m.timeframe}
              </span>
            </div>
          </TimelineRow>
        ))}

      </ol>

      {allDone && (
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white p-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-soft">
            <PartyPopper size={18} strokeWidth={2.25} />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-ink">
              Every milestone reached
            </p>
            <p className="text-xs text-ink-muted">
              You've walked the whole path. Wonderful work.
            </p>
          </div>
        </div>
      )}

      {/* AI-generated entries as the personalized upcoming path */}
      {roadmap.entries.length > 0 && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-lavender-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="flex items-center gap-1.5 bg-white px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-lavender-400">
                <Sparkles size={11} strokeWidth={2.5} />
                Your Personalized Plan
              </span>
            </div>
          </div>

          <ol className="space-y-0">
            {roadmap.entries.map((entry, i) => (
              <AIEntryRow
                key={entry.id}
                entry={entry}
                connector={i < roadmap.entries.length - 1 ? "muted" : "none"}
              />
            ))}
          </ol>
        </>
      )}

      {/* Inline error on regenerate failure */}
      {!isGenerating && generateError && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200/70 bg-rose-50 px-3 py-2 text-sm text-rose-600">
          <AlertTriangle size={14} className="flex-shrink-0" />
          <span>{generateError}</span>
          <button
            type="button"
            onClick={() => handleGenerate(null)}
            className="ml-auto font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <p className="text-[11px] text-ink-soft">
          Generated{" "}
          {new Date(roadmap.generatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <button
          type="button"
          onClick={() => handleGenerate(null)}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-lavender-600 transition hover:text-lavender-700 disabled:opacity-50"
        >
          <RefreshCw
            size={12}
            strokeWidth={2.5}
            className={isGenerating ? "animate-spin" : ""}
          />
          {isGenerating ? "Regenerating…" : "Regenerate"}
        </button>
      </div>
    </section>
  );
}

// ── Recommended next step (merged Best Next Task result) ────────────────────

function RecommendationCard({
  recommendation,
}: {
  recommendation: NonNullable<GeneratedRoadmap["recommendation"]>;
}) {
  const section = findSectionBySlug(recommendation.sectionId);
  return (
    <div className="mb-6 rounded-2xl border border-lavender-300/60 bg-gradient-to-br from-lavender-50 to-white p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Target size={16} className="text-lavender-600" />
        <p className={eyebrow}>Your best next step</p>
      </div>
      <p className="mt-2 font-display text-lg font-bold leading-snug text-ink">
        {recommendation.bestTask}
      </p>

      {recommendation.why && (
        <div className="mt-3 flex items-start gap-2">
          <Lightbulb size={15} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed text-ink-muted">
            {recommendation.why}
          </p>
        </div>
      )}

      {section && (
        <Link
          to={section.path}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-lavender-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition hover:bg-lavender-700"
        >
          Go to {section.label}
          <ArrowRight size={13} strokeWidth={2.5} />
        </Link>
      )}

      {recommendation.missingInfo.length > 0 && (
        <div className="mt-3 flex items-start gap-2">
          <HelpCircle size={15} className="mt-0.5 flex-shrink-0 text-ink-soft" />
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-ink-soft">
            {recommendation.missingInfo.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Other recommended sections (smaller slots beneath the best next step) ───

function SectionPicksList({ picks }: { picks: SectionPick[] }) {
  const resolved = picks
    .map((pick) => ({ pick, section: findSectionBySlug(pick.sectionId) }))
    .filter(
      (r): r is { pick: SectionPick; section: NonNullable<ReturnType<typeof findSectionBySlug>> } =>
        r.section !== null,
    );

  if (resolved.length === 0) return null;

  return (
    <div className="mb-6">
      <p className={`${eyebrow} mb-2`}>Also worth a look</p>
      <ul className="space-y-2">
        {resolved.map(({ pick, section }) => (
          <li
            key={pick.sectionId}
            className="rounded-xl border border-lavender-100 bg-white/60 p-3"
          >
            <Link
              to={section.path}
              className="inline-flex items-center gap-1 text-sm font-semibold text-lavender-700 hover:text-lavender-800"
            >
              {section.label}
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
            {pick.why && (
              <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">
                {pick.why}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Phase 1: Setup starter card ──────────────────────────────────────────────

function SetupStarterCard({
  profileComplete,
  quizComplete,
}: {
  profileComplete: boolean;
  quizComplete: boolean;
}) {
  const firstIncompleteHref = !profileComplete
    ? "/college-planning/college-profile"
    : "/career-planning/career-discovery-quiz";
  const ctaLabel = !profileComplete ? "Start your profile" : "Take the quiz";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-lavender-300/60 bg-gradient-to-br from-lavender-600 to-lavender-800 p-7 text-white shadow-soft-lg">
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

      <div className="relative flex flex-col gap-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-lavender-200">
          Before we build your plan
        </p>

        <div>
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight">
            Complete two quick steps
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-lavender-200">
            Once your profile and career quiz are done, we'll generate a fully
            personalized college roadmap just for you.
          </p>
        </div>

        <ul className="space-y-3">
          <SetupRow done={profileComplete} icon={User} label="Complete your profile" />
          <SetupRow done={quizComplete} icon={Briefcase} label="Take the Career Discovery Quiz" />
        </ul>

        <Link
          to={firstIncompleteHref}
          className="group self-start inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-lavender-700 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lavender-700 active:translate-y-0"
        >
          {ctaLabel}
          <ArrowRight
            size={16}
            strokeWidth={2.5}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}

function SetupRow({
  done,
  icon: Icon,
  label,
}: {
  done: boolean;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <li className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
          done ? "bg-white/20" : "border border-white/20 bg-white/10"
        }`}
      >
        {done ? (
          <Check size={16} strokeWidth={2.75} className="text-white" />
        ) : (
          <Icon size={16} strokeWidth={2.25} className="text-lavender-200" />
        )}
      </div>
      <span
        className={`text-sm font-semibold ${
          done ? "text-lavender-200 line-through decoration-white/40" : "text-white"
        }`}
      >
        {label}
      </span>
    </li>
  );
}

// ── Phase 2: Generate prompt card ────────────────────────────────────────────

function GenerateCard({
  isGenerating,
  generateError,
  onGenerate,
}: {
  isGenerating: boolean;
  generateError: string | null;
  onGenerate: () => void;
}) {
  return (
    <section className={`${softCard} p-8 text-center`}>
      {isGenerating ? (
        <div className="flex items-center justify-center gap-2.5 py-5 text-sm text-ink-muted">
          <Loader2 size={17} className="animate-spin text-lavender-500" />
          Building your personalized roadmap…
        </div>
      ) : (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-500 to-lavender-700 text-white shadow-soft">
            <Sparkles size={24} strokeWidth={2.25} />
          </div>

          <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-ink">
            Ready to generate your roadmap
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
            Based on your profile and career quiz, we'll build a personalized
            action plan — including your best next step — for your entire
            college journey.
          </p>

          {generateError && (
            <div className="mx-auto mt-4 flex max-w-sm items-start gap-3 rounded-2xl border border-rose-200/70 bg-rose-50 p-4 text-left">
              <AlertTriangle
                size={17}
                className="mt-0.5 flex-shrink-0 text-rose-400"
              />
              <div>
                <p className="text-sm font-semibold text-ink">
                  Couldn't generate your roadmap
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">{generateError}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onGenerate}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-lavender-600 to-lavender-700 px-6 py-3.5 text-sm font-bold text-white shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-500 focus-visible:ring-offset-2 active:translate-y-0"
          >
            <Sparkles size={15} strokeWidth={2.5} />
            Generate Future Timeline
          </button>
        </>
      )}
    </section>
  );
}

// ── Static milestone row ──────────────────────────────────────────────────────

function TimelineRow({
  milestone,
  state = "done",
  connector,
  children,
}: {
  milestone: JourneyMilestone;
  state?: "done" | "current" | "upcoming";
  connector: "filled" | "muted" | "none";
  children: React.ReactNode;
}) {
  const Icon = milestone.icon;
  const isCurrent = state === "current";

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={
            isCurrent
              ? "journey-here flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lavender-600 to-lavender-800 text-white shadow-soft"
              : state === "done"
              ? "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lavender-500 to-lavender-700 text-white shadow-soft"
              : "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-lavender-200 bg-lavender-50 text-lavender-400"
          }
        >
          {state === "done" ? (
            <Check size={16} strokeWidth={2.75} />
          ) : (
            <Icon size={isCurrent ? 20 : 16} strokeWidth={2.25} />
          )}
        </div>
        {connector !== "none" && (
          <span
            className={`w-0.5 flex-1 rounded-full ${
              connector === "filled" ? "bg-lavender-300" : "bg-lavender-100"
            }`}
          />
        )}
      </div>

      <div className={`min-w-0 flex-1 ${connector === "none" ? "" : "pb-5"}`}>
        {children}
      </div>
    </li>
  );
}

// ── AI-generated entry row ────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<RoadmapEntryCategory, LucideIcon> = {
  career: Briefcase,
  academic: BookOpen,
  college: Building2,
  application: FileText,
  financial: DollarSign,
  personal: User,
};

function AIEntryRow({
  entry,
  connector,
}: {
  entry: RoadmapEntry;
  connector: "muted" | "none";
}) {
  const Icon = CATEGORY_ICONS[entry.category] ?? User;

  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-lavender-200 bg-lavender-50 text-lavender-400">
          <Icon size={16} strokeWidth={2.25} />
        </div>
        {connector !== "none" && (
          <span className="w-0.5 flex-1 rounded-full bg-lavender-100" />
        )}
      </div>

      <div className={`min-w-0 flex-1 ${connector === "none" ? "" : "pb-5"}`}>
        <div className="py-1.5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-ink">{entry.title}</p>
            <span className="flex-shrink-0 whitespace-nowrap text-[11px] font-semibold text-ink-soft">
              {entry.timeframe}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            {entry.description}
          </p>
        </div>
      </div>
    </li>
  );
}
