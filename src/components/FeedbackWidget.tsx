import { useState } from "react";
import { MessageSquare, Star, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useFeedback } from "../context/FeedbackContext";
import type { FeedbackQuestion } from "../data/feedbackQuestions";

// ── Individual question renderers ────────────────────────────────────────────

function RatingInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const selected = parseInt(value) || 0;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(String(n))}
          className="transition"
        >
          <Star
            size={22}
            className={
              n <= (hovered || selected)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
}

function ChoiceInput({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            value === opt
              ? "border-lavender-500 bg-lavender-500 text-white"
              : "border-lavender-200 bg-lavender-50 text-lavender-700 hover:border-lavender-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function ThumbsInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        aria-label="Helpful"
        onClick={() => onChange("up")}
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
          value === "up"
            ? "border-emerald-400 bg-emerald-50 text-emerald-500"
            : "border-slate-200 text-slate-400 hover:border-emerald-300"
        }`}
      >
        <ThumbsUp size={18} />
      </button>
      <button
        type="button"
        aria-label="Not helpful"
        onClick={() => onChange("down")}
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
          value === "down"
            ? "border-rose-400 bg-rose-50 text-rose-500"
            : "border-slate-200 text-slate-400 hover:border-rose-300"
        }`}
      >
        <ThumbsDown size={18} />
      </button>
    </div>
  );
}

function Question({
  q,
  value,
  onChange,
}: {
  q: FeedbackQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-700">{q.text}</p>
      {q.type === "rating" && <RatingInput value={value} onChange={onChange} />}
      {q.type === "choice" && (
        <ChoiceInput options={q.options ?? []} value={value} onChange={onChange} />
      )}
      {q.type === "thumbs" && <ThumbsInput value={value} onChange={onChange} />}
    </div>
  );
}

// ── Widget shell ─────────────────────────────────────────────────────────────

export default function FeedbackWidget() {
  const { current, submit, dismiss } = useFeedback();
  const [responses, setResponses] = useState<Record<string, string>>({});

  if (!current) return null;

  const answeredCount = current.questions.filter((q) => responses[q.id]).length;
  const allAnswered = answeredCount === current.questions.length;

  const handleChange = (qId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = () => {
    submit(responses);
    setResponses({});
  };

  const handleDismiss = () => {
    dismiss();
    setResponses({});
  };

  return (
    <div
      className="fixed bottom-24 right-5 z-50 w-80 rounded-2xl border border-lavender-200 bg-white shadow-2xl shadow-lavender-900/10"
      style={{ animation: "achievementSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both" }}
      role="dialog"
      aria-label="Feedback"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-lavender-100 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-lavender-100">
            <MessageSquare size={13} className="text-lavender-600" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-lavender-500">
              {current.subtitle}
            </p>
            <p className="text-sm font-bold text-slate-800">{current.title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Skip feedback"
          className="mt-0.5 flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <X size={15} />
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-4 px-4 py-4">
        {current.questions.map((q) => (
          <Question
            key={q.id}
            q={q}
            value={responses[q.id] ?? ""}
            onChange={(v) => handleChange(q.id, v)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-lavender-100 px-4 py-3">
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-slate-400 transition hover:text-slate-600"
        >
          Skip
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
            allAnswered
              ? "bg-lavender-500 text-white hover:bg-lavender-600"
              : "cursor-not-allowed bg-slate-100 text-slate-400"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
