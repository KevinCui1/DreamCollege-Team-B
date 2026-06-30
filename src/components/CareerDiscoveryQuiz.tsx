import { useState } from "react";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { quizQuestions, totalQuizQuestions } from "../data/quiz";
import {
  useStudentProfile,
  type QuizAnswers,
} from "../context/StudentProfileContext";

type Props = {
  /** Whether the quiz activity has already been marked complete. */
  done: boolean;
  /** Fires the existing activity-completion flow (milestone + confetti). */
  onComplete: () => void;
};

/**
 * The Career Discovery Quiz UI. Steps through a few single-select questions,
 * persists answers to StudentProfileContext, and calls `onComplete` (which runs
 * ActivityPage's existing completion logic) when finished. When the activity is
 * already complete it shows a summary with the option to retake.
 */
export default function CareerDiscoveryQuiz({ done, onComplete }: Props) {
  const { quizAnswers, setQuizAnswers } = useStudentProfile();

  // Start in summary mode if the quiz was already completed with stored answers.
  const [taking, setTaking] = useState(!done || !quizAnswers);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(quizAnswers ?? {});

  const question = quizQuestions[step];
  const isLast = step === totalQuizQuestions - 1;
  const selected = answers[question?.id];

  const handleSelect = (value: string) => {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);

    if (isLast) {
      setQuizAnswers(next);
      if (!done) onComplete();
      setTaking(false);
    } else {
      setStep((s) => s + 1);
    }
  };

  // Summary / completed view.
  if (!taking) {
    return (
      <div>
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 size={24} />
          <span className="text-lg font-semibold">Quiz completed</span>
        </div>
        <p className="mt-2 text-slate-500">
          Your answers are saved and power your{" "}
          <span className="font-medium text-slate-700">Best Next Task</span>{" "}
          recommendation. Look for the button in the bottom-right corner.
        </p>

        <dl className="mt-6 space-y-3">
          {quizQuestions.map((q) => {
            const ans = (quizAnswers ?? answers)[q.id];
            const label = q.options.find((o) => o.value === ans)?.label;
            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <dt className="text-sm font-medium text-slate-700">
                  {q.prompt}
                </dt>
                <dd className="mt-0.5 text-sm text-indigo-600">
                  {label ?? "—"}
                </dd>
              </div>
            );
          })}
        </dl>

        <button
          type="button"
          onClick={() => {
            setStep(0);
            setTaking(true);
          }}
          className="mt-6 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Retake quiz
        </button>
      </div>
    );
  }

  // Question stepper.
  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            Question {step + 1} of {totalQuizQuestions}
          </span>
          <span>{Math.round((step / totalQuizQuestions) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
            style={{ width: `${(step / totalQuizQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-800">{question.prompt}</h2>

      <div className="mt-5 space-y-3">
        {question.options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                isSelected
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
              }`}
            >
              <span
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500"
                    : "border-slate-300"
                }`}
              >
                {isSelected && <CheckCircle2 size={14} className="text-white" />}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      )}
    </div>
  );
}
