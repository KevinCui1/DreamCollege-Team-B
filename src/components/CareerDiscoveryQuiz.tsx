import { useState } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { quizQuestions, totalQuizQuestions } from "../data/quiz";
import {
  useStudentProfile,
  type QuizAnswers,
} from "../context/StudentProfileContext";
import { useFeedback } from "../context/FeedbackContext";
import { quizFeedback } from "../data/feedbackQuestions";

type Props = {
  done: boolean;
  onComplete: () => void;
};

export default function CareerDiscoveryQuiz({ done, onComplete }: Props) {
  const { quizAnswers, setQuizAnswers } = useStudentProfile();
  const { triggerFeedback } = useFeedback();

  const [taking, setTaking] = useState(!done || !quizAnswers);
  const [step, setStep] = useState(0);
  
  // Keep local state explicitly in sync with saved answers or empty dictionary
  const [answers, setAnswers] = useState<QuizAnswers>(() => quizAnswers ?? {});

  const question = quizQuestions[step];
  const isLast = step === totalQuizQuestions - 1;
  const currentSelection = answers[question?.id];

  const handleSelectValue = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = () => {
    if (!currentSelection) return; // Prevent advancing without a selection
    
    if (isLast) {
      setQuizAnswers(answers);
      if (!done) onComplete();
      setTaking(false);
      triggerFeedback(quizFeedback);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleRetake = () => {
    setStep(0);
    setAnswers({}); // Clear past buffer to avoid partial pollution if aborted
    setTaking(true);
  };

  // Progress calculations fixed
  const progressPercent = Math.round((step / totalQuizQuestions) * 100);

  // Summary View
  if (!taking) {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={24} />
            <span className="text-lg font-semibold">Quiz completed</span>
          </div>
          <p className="mt-2 text-slate-500 text-sm">
            Your answers are saved and power your{" "}
            <span className="font-medium text-slate-700">Best Next Task</span>{" "}
            recommendation. Look for the button in the bottom-right corner.
          </p>
        </div>

        <dl className="space-y-3">
          {quizQuestions.map((q) => {
            const currentAns = quizAnswers?.[q.id];
            const label = q.options.find((o) => o.value === currentAns)?.label;
            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <dt className="text-sm font-medium text-slate-700">
                  {q.prompt}
                </dt>
                <dd className="mt-0.5 text-sm font-semibold text-indigo-600">
                  {label ?? "—"}
                </dd>
              </div>
            );
          })}
        </dl>

        <button
          type="button"
          onClick={handleRetake}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Retake quiz
        </button>
      </div>
    );
  }

  // Question Stepper View
  return (
    <div>
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>
            Question {step + 1} of {totalQuizQuestions}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-slate-800">{question.prompt}</h2>

      {/* Accessibility enhancement: role="radiogroup" */}
      <div className="mt-5 space-y-3" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((opt) => {
          const isSelected = currentSelection === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => handleSelectValue(opt.value)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                isSelected
                  ? "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-sm"
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

      <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            <ArrowLeft size={15} />
            Back
          </button>
        ) : (
          <div /> /* Layout spacer */
        )}

        <button
          type="button"
          disabled={!currentSelection}
          onClick={handleNext}
          className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition ${
            currentSelection
              ? "bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
              : "bg-slate-300 cursor-not-allowed"
          }`}
        >
          {isLast ? "Submit Quiz" : "Next"}
          {!isLast && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  );
}
