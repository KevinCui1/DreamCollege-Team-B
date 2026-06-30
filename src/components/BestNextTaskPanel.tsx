import { useState, type ReactNode } from "react";
import {
  X,
  Sparkles,
  Loader2,
  Target,
  Lightbulb,
  Wrench,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import {
  useStudentProfile,
  type StudentProfile,
} from "../context/StudentProfileContext";
import { useCompletion } from "../context/CompletionContext";
import { useAchievement } from "../context/AchievementContext";
import { useRank } from "../context/RankContext";
import { milestones } from "../data/achievements";
import {
  buildBestNextTaskContext,
  requestBestNextTask,
  type BestNextTaskResult,
} from "../lib/bestNextTask";

type Props = { onClose: () => void };

type Field = {
  key:
    | "gradeLevel"
    | "gpa"
    | "apCount"
    | "interests"
    | "goals"
    | "constraints";
  label: string;
  placeholder: string;
  multiline?: boolean;
};

const FIELDS: Field[] = [
  { key: "gradeLevel", label: "Grade level", placeholder: "e.g. 11th grade" },
  { key: "gpa", label: "GPA", placeholder: "e.g. 3.8 / 4.0" },
  { key: "apCount", label: "APs taken / planned", placeholder: "e.g. 4" },
  {
    key: "interests",
    label: "Interests & extracurriculars",
    placeholder: "e.g. robotics club, volunteering, soccer",
    multiline: true,
  },
  {
    key: "goals",
    label: "Goals",
    placeholder: "e.g. study computer science, get into a state school",
    multiline: true,
  },
  {
    key: "constraints",
    label: "Constraints",
    placeholder: "e.g. need scholarships, prefer to stay in-state",
    multiline: true,
  },
];

export default function BestNextTaskPanel({ onClose }: Props) {
  const { profile, updateProfile, quizAnswers } = useStudentProfile();
  const { isComplete } = useCompletion();
  const { isMilestoneEarned, nextMilestone, gradeAchievements } =
    useAchievement();
  const { currentRank } = useRank();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BestNextTaskResult | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const context = buildBestNextTaskContext({
        quizAnswers,
        profile,
        isComplete,
        earnedMilestoneTitles: milestones
          .filter((m) => isMilestoneEarned(m.id))
          .map((m) => m.title),
        nextMilestoneTitle: nextMilestone?.title ?? null,
        gradeGoals: gradeAchievements,
        currentRank: currentRank.name,
      });
      const res = await requestBestNextTask(context);
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 px-4 py-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Best Next Task"
    >
      <div
        className="flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-white">
          <Sparkles size={22} />
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-tight">Best Next Task</h2>
            <p className="text-xs text-white/80">
              A personalized recommendation powered by Claude.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 opacity-80 transition hover:bg-white/20 hover:opacity-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm text-slate-500">
            Add a little about yourself for a sharper recommendation. Every field
            is optional — your quiz answers and progress are already included.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div
                key={field.key}
                className={field.multiline ? "sm:col-span-2" : ""}
              >
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    value={profile[field.key]}
                    onChange={(e) =>
                      updateProfile({ [field.key]: e.target.value } as Partial<StudentProfile>)
                    }
                    placeholder={field.placeholder}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile[field.key]}
                    onChange={(e) =>
                      updateProfile({ [field.key]: e.target.value } as Partial<StudentProfile>)
                    }
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-indigo-500 hover:to-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Thinking…
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {result ? "Regenerate recommendation" : "Generate best next task"}
              </>
            )}
          </button>

          {/* Error state */}
          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertTriangle
                size={18}
                className="mt-0.5 flex-shrink-0 text-rose-500"
              />
              <div>
                <p className="text-sm font-semibold text-rose-700">
                  Couldn't generate a recommendation
                </p>
                <p className="mt-0.5 text-sm text-rose-600">{error}</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && !result && (
            <p className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
              Your recommended next task will appear here.
            </p>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="mt-5 space-y-4">
              <ResultBlock
                icon={<Target size={18} className="text-indigo-600" />}
                title="Your best next task"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {result.bestTask}
                </p>
              </ResultBlock>

              {result.why && (
                <ResultBlock
                  icon={<Lightbulb size={18} className="text-amber-500" />}
                  title="Why this is the best next step"
                >
                  <p className="text-sm text-slate-600">{result.why}</p>
                </ResultBlock>
              )}

              {result.appTool && (
                <ResultBlock
                  icon={<Wrench size={18} className="text-emerald-600" />}
                  title="Tool to use"
                >
                  <p className="text-sm text-slate-600">{result.appTool}</p>
                </ResultBlock>
              )}

              {result.missingInfo.length > 0 && (
                <ResultBlock
                  icon={<HelpCircle size={18} className="text-slate-400" />}
                  title="What would improve this recommendation"
                >
                  <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {result.missingInfo.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </ResultBlock>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultBlock({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-1.5 flex items-center gap-2">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
